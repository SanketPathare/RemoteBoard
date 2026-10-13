/**
 * Ashby adapter — https://api.ashbyhq.com/posting-api/job-board/{company}
 * Direct ATS-sourced listings for companies using Ashby.
 */
import { ATS_COMPANIES, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "ashby";

interface AshbyJobRaw {
  id: string;
  title?: string;
  department?: string;
  location?: string;
  isRemote?: boolean;
  jobUrl?: string;
  publishedAt?: string;
  descriptionHtml?: string;
  employmentType?: string;
}

export function normalizeAshby(raw: AshbyJobRaw, companySlug: string): Job | null {
  const sourceId = safeString(raw.id);
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.jobUrl);
  if (!sourceId || !title || !applyUrl) return null;

  const company = companySlug.charAt(0).toUpperCase() + companySlug.slice(1);
  const loc = safeString(raw.location);
  const location = !loc || loc.toLowerCase() === "not stated" ? "Remote" : loc;
  const remote = raw.isRemote === true || /remote/i.test(location) || /remote/i.test(title);

  const dept = safeString(raw.department);
  const tags = [company, dept, remote ? "Remote" : undefined].filter(Boolean) as string[];
  const descriptionHtml = raw.descriptionHtml || `<p>${title} at ${company}.</p>`;

  return {
    id: makeJobId(SOURCE, `${companySlug}-${sourceId}`),
    source: SOURCE,
    sourceId: `${companySlug}-${sourceId}`,
    title,
    company,
    logo: `https://unavatar.io/${companySlug}.app?fallback=https://unavatar.io/${companySlug}.com?fallback=false`,
    location,
    remote,
    remoteEligibility: remote ? "Remote eligible" : location,
    employmentType: safeString(raw.employmentType) || "Full-time",
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags: tags.slice(0, 10),
    category: dept || "Product & Engineering",
    descriptionHtml,
    excerpt: excerptFromHtml(descriptionHtml),
    postedAt: toIsoDate(raw.publishedAt),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(`${companySlug}-${sourceId}`)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Ashby",
    sourceUrl: applyUrl,
  };
}

export async function fetchAshby(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const companies = ATS_COMPANIES.ashby || ["linear"];
    const fetchPromises = companies.map(async (companySlug) => {
      try {
        const res = await fetch(
          `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(companySlug)}`,
          {
            signal: ctrl.signal,
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );
        if (!res.ok) return [];
        const data = (await res.json()) as { jobs?: AshbyJobRaw[] };
        const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];
        return rawJobs
          .map((j) => normalizeAshby(j, companySlug))
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
