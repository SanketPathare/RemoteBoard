/**
 * Personio adapter — https://{company}.jobs.personio.com/xml
 * Direct ATS-sourced listings for companies using Personio (XML feed).
 */
import { XMLParser } from "fast-xml-parser";
import { ATS_COMPANIES, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "personio";

interface PersonioPositionRaw {
  id?: number | string;
  name?: string;
  office?: string;
  department?: string;
  recruitingCategory?: string;
  employmentType?: string;
  schedule?: string;
  subcompany?: string;
  jobDescriptions?: unknown;
}

export function normalizePersonio(raw: PersonioPositionRaw, companySlug: string): Job | null {
  const sourceId = safeString(String(raw.id));
  const title = safeString(raw.name);
  if (!sourceId || !title) return null;

  const company =
    safeString(raw.subcompany) ||
    companySlug.charAt(0).toUpperCase() + companySlug.slice(1);
  const applyUrl = `https://${encodeURIComponent(companySlug)}.jobs.personio.com/job/${sourceId}`;

  const loc = safeString(raw.office);
  const location = !loc || loc.toLowerCase() === "not stated" ? "Remote" : loc;
  const remote = /remote/i.test(location) || /remote/i.test(title);

  const dept = safeString(raw.department) || safeString(raw.recruitingCategory);
  const schedule = safeString(raw.schedule);
  const empType = safeString(raw.employmentType);
  const tags = [company, dept, schedule, empType, remote ? "Remote" : undefined].filter(Boolean) as string[];
  const descriptionHtml = `<p><strong>${title}</strong> at <strong>${company}</strong>.</p><p>Department: ${
    dept || "General"
  } &bull; Location: ${location} &bull; Employment: ${schedule || empType || "Full-time"}</p><p>Sourced directly from verified employer Personio portal.</p>`;

  return {
    id: makeJobId(SOURCE, `${companySlug}-${sourceId}`),
    source: SOURCE,
    sourceId: `${companySlug}-${sourceId}`,
    title,
    company,
    logo: `https://unavatar.io/${companySlug}.com?fallback=false`,
    location,
    remote,
    remoteEligibility: remote ? "Remote eligible" : location,
    employmentType: schedule || empType || "Full-time",
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags: tags.slice(0, 10),
    category: dept || "Operations",
    descriptionHtml,
    excerpt: excerptFromHtml(descriptionHtml),
    postedAt: toIsoDate(new Date().toISOString()),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(`${companySlug}-${sourceId}`)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Personio",
    sourceUrl: applyUrl,
  };
}

export async function fetchPersonio(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const companies = ATS_COMPANIES.personio || ["personio"];
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
    });

    const fetchPromises = companies.map(async (companySlug) => {
      try {
        const res = await fetch(
          `https://${encodeURIComponent(companySlug)}.jobs.personio.com/xml`,
          {
            signal: ctrl.signal,
            headers: {
              Accept: "application/xml, text/xml, */*",
              "User-Agent": "RemoteJobBoard/1.0",
            },
            cache: "no-store",
          }
        );
        if (!res.ok) return [];
        const xml = await res.text();
        const parsed = parser.parse(xml) as Record<string, unknown>;
        const root =
          (parsed["workzag-jobs"] as Record<string, unknown>) ||
          (parsed["work-positions"] as Record<string, unknown>) ||
          parsed;
        const positions = (root?.position || root?.positions || []) as
          | PersonioPositionRaw
          | PersonioPositionRaw[];
        const rawList = Array.isArray(positions)
          ? positions
          : positions
          ? [positions]
          : [];

        return rawList
          .map((p) => normalizePersonio(p, companySlug))
          .filter((j): j is Job => j !== null);
      } catch {
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    const jobs: Job[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") {
        jobs.push(...r.value);
      }
    }
    return jobs;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
