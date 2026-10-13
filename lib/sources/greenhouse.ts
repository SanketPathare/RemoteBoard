/**
 * Greenhouse adapter — https://boards-api.greenhouse.io/v1/boards/{company}/jobs
 * Direct ATS-sourced listings for companies using Greenhouse.
 */
import { ATS_COMPANIES, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "greenhouse";

interface GreenhouseJobRaw {
  id: number | string;
  title?: string;
  location?: { name?: string };
  absolute_url?: string;
  content?: string;
  updated_at?: string;
  departments?: Array<{ name?: string }>;
}

export function normalizeGreenhouse(raw: GreenhouseJobRaw, companySlug: string): Job | null {
  const sourceId = safeString(String(raw.id));
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.absolute_url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = companySlug.charAt(0).toUpperCase() + companySlug.slice(1);
  const loc = safeString(raw.location?.name);
  const location = !loc || loc.toLowerCase() === "not stated" ? "Remote" : loc;
  const remote = /remote/i.test(location) || /remote/i.test(title);

  const dept = raw.departments?.[0]?.name;
  const tags = [company, dept, remote ? "Remote" : undefined].filter(Boolean) as string[];
  const descriptionHtml = raw.content || `<p>${title} at ${company}.</p>`;

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
    employmentType: "Full-time",
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags: tags.slice(0, 10),
    category: dept || "Engineering",
    descriptionHtml,
    excerpt: excerptFromHtml(descriptionHtml),
    postedAt: toIsoDate(raw.updated_at),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(`${companySlug}-${sourceId}`)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Greenhouse",
    sourceUrl: applyUrl,
  };
}

export async function fetchGreenhouse(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const companies = ATS_COMPANIES.greenhouse || ["gitlab"];
    const fetchPromises = companies.map(async (companySlug) => {
      try {
        const res = await fetch(
          `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(companySlug)}/jobs?content=true`,
          {
            signal: ctrl.signal,
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );
        if (!res.ok) return [];
        const data = (await res.json()) as { jobs?: GreenhouseJobRaw[] };
        const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];
        return rawJobs
          .map((j) => normalizeGreenhouse(j, companySlug))
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
