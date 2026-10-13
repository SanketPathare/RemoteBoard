/**
 * Lever adapter — https://api.lever.co/v0/postings/{company}?mode=json
 * Direct ATS-sourced listings for companies using Lever.
 */
import { ATS_COMPANIES, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "lever";

interface LeverJobRaw {
  id: string;
  text?: string;
  categories?: {
    commitment?: string;
    department?: string;
    location?: string;
    team?: string;
  };
  hostedUrl?: string;
  applyUrl?: string;
  createdAt?: number;
  description?: string;
  descriptionPlain?: string;
}

export function normalizeLever(raw: LeverJobRaw, companySlug: string): Job | null {
  const sourceId = safeString(raw.id);
  const title = safeString(raw.text);
  const applyUrl = safeString(raw.applyUrl || raw.hostedUrl);
  if (!sourceId || !title || !applyUrl) return null;

  const company = companySlug.charAt(0).toUpperCase() + companySlug.slice(1);
  const loc = safeString(raw.categories?.location);
  const location = !loc || loc.toLowerCase() === "not stated" ? "Remote" : loc;
  const remote = /remote/i.test(location) || /remote/i.test(title);

  const team = raw.categories?.team || raw.categories?.department;
  const commitment = raw.categories?.commitment;
  const tags = [company, team, commitment, remote ? "Remote" : undefined].filter(Boolean) as string[];
  const descriptionHtml = raw.description || `<p>${title} at ${company}.</p>`;

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
    employmentType: commitment || "Full-time",
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags: tags.slice(0, 10),
    category: team || "General",
    descriptionHtml,
    excerpt: excerptFromHtml(descriptionHtml),
    postedAt: toIsoDate(raw.createdAt),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(`${companySlug}-${sourceId}`)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Lever",
    sourceUrl: raw.hostedUrl || applyUrl,
  };
}

export async function fetchLever(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const companies = ATS_COMPANIES.lever || ["spotify"];
    const fetchPromises = companies.map(async (companySlug) => {
      try {
        const res = await fetch(
          `https://api.lever.co/v0/postings/${encodeURIComponent(companySlug)}?mode=json`,
          {
            signal: ctrl.signal,
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );
        if (!res.ok) return [];
        const rawJobs = (await res.json()) as LeverJobRaw[];
        if (!Array.isArray(rawJobs)) return [];
        return rawJobs
          .map((j) => normalizeLever(j, companySlug))
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
