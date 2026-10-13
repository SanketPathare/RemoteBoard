/**
 * Recruitee adapter — https://{company}.recruitee.com/api/offers/
 * Direct ATS-sourced listings for companies using Recruitee.
 */
import { ATS_COMPANIES, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "recruitee";

interface RecruiteeOfferRaw {
  id: number | string;
  title?: string;
  location?: string;
  remote?: boolean;
  careers_url?: string;
  department?: string;
  tags?: string[];
  published_at?: string;
  description?: string;
  employment_type_code?: string;
}

export function normalizeRecruitee(raw: RecruiteeOfferRaw, companySlug: string): Job | null {
  const sourceId = safeString(String(raw.id));
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.careers_url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = companySlug.charAt(0).toUpperCase() + companySlug.slice(1);
  const loc = safeString(raw.location);
  const location = !loc || loc.toLowerCase() === "not stated" ? "Remote" : loc;
  const remote = raw.remote === true || /remote/i.test(location) || /remote/i.test(title);

  const dept = safeString(raw.department);
  const rawTags = Array.isArray(raw.tags) ? raw.tags : [];
  const tags = [company, dept, ...rawTags, remote ? "Remote" : undefined].filter(Boolean) as string[];
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
    employmentType: safeString(raw.employment_type_code) || "Full-time",
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags: tags.slice(0, 10),
    category: dept || "Technology",
    descriptionHtml,
    excerpt: excerptFromHtml(descriptionHtml),
    postedAt: toIsoDate(raw.published_at),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(`${companySlug}-${sourceId}`)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Recruitee",
    sourceUrl: applyUrl,
  };
}

export async function fetchRecruitee(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const companies = ATS_COMPANIES.recruitee || ["bunq"];
    const fetchPromises = companies.map(async (companySlug) => {
      try {
        const res = await fetch(
          `https://${encodeURIComponent(companySlug)}.recruitee.com/api/offers/`,
          {
            signal: ctrl.signal,
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );
        if (!res.ok) return [];
        const data = (await res.json()) as { offers?: RecruiteeOfferRaw[] };
        const rawOffers = Array.isArray(data.offers) ? data.offers : [];
        return rawOffers
          .map((j) => normalizeRecruitee(j, companySlug))
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
