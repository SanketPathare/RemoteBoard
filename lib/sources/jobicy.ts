/**
 * Jobicy adapter — https://jobicy.com/api/v2/remote-jobs
 * Public, no key. `url` is the Jobicy listing (direct ATS URL only with
 * commercial key, which we do NOT use — Apply links to `url` as-is).
 */
import { FETCH_LIMITS, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, formatSalary, safeNumber, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "jobicy";
const ENDPOINT = "https://jobicy.com/api/v2/remote-jobs";

interface JobicyRaw {
  id?: number | string;
  url?: string;
  jobSlug?: string;
  jobTitle?: string;
  companyName?: string;
  companyLogo?: string;
  jobIndustry?: string[];
  jobType?: string | string[];
  jobGeo?: string;
  jobLevel?: string;
  jobExcerpt?: string;
  jobDescription?: string;
  pubDate?: string;
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  salaryCurrency?: string | null;
}

export function normalizeJobicy(raw: JobicyRaw): Job | null {
  const sourceId = safeString(String(raw.id ?? ""));
  const title = safeString(raw.jobTitle);
  const applyUrl = safeString(raw.url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = safeString(raw.companyName, "Unknown company");
  const logo = safeString(raw.companyLogo) || null;
  const industries = safeStringArray(raw.jobIndustry);
  const jobType = Array.isArray(raw.jobType)
    ? safeString(raw.jobType[0])
    : safeString(raw.jobType);
  const geo = safeString(raw.jobGeo);
  const level = safeString(raw.jobLevel);
  const descriptionHtml = safeString(raw.jobDescription) || safeString(raw.jobExcerpt);
  const salaryMin = safeNumber(raw.salaryMin);
  const salaryMax = safeNumber(raw.salaryMax);
  const salaryCurrency = safeString(raw.salaryCurrency) || null;
  const postedAt = toIsoDate(raw.pubDate);
  const isAnywhere = /anywhere|worldwide|global|remote/i.test(geo);

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo,
    location: geo || "Remote",
    remote: true,
    remoteEligibility: geo || undefined,
    employmentType: jobType || undefined,
    experienceLevel: level || undefined,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryText: formatSalary(salaryMin, salaryMax, salaryCurrency || undefined),
    skills: industries,
    tags: [...industries, ...(level ? [level] : [])].slice(0, 12),
    category: industries[0],
    descriptionHtml: descriptionHtml || `<p>${safeString(raw.jobExcerpt, title)}</p>`,
    excerpt: safeString(raw.jobExcerpt) || excerptFromHtml(descriptionHtml),
    postedAt,
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
    ...(isAnywhere ? {} : {}),
  };
}

export async function fetchJobicy(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(
      `${ENDPOINT}?count=${FETCH_LIMITS.jobicy}`,
      { signal: ctrl.signal, headers: { Accept: "application/json" }, cache: "no-store" },
    );
    if (!res.ok) throw new Error(`Jobicy HTTP ${res.status}`);
    const data = (await res.json()) as { jobs?: JobicyRaw[] };
    return (data.jobs || []).map(normalizeJobicy).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
