/**
 * Himalayas adapter — https://himalayas.app/jobs/api
 * Free public API, no auth, max 20/request. Cursor pagination preferred.
 * Apply URL = applicationLink (fallback guid). Server-side only (no CORS).
 */
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, formatSalary, safeNumber, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "himalayas";
const ENDPOINT = "https://himalayas.app/jobs/api";

interface HimalayasRaw {
  title?: string;
  companyName?: string;
  companySlug?: string;
  companyLogo?: string;
  applicationLink?: string;
  guid?: string;
  categories?: string[];
  parentCategories?: string[];
  seniority?: string[];
  employmentType?: string;
  locationRestrictions?: string[];
  timezoneRestrictions?: (string | number)[];
  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string | null;
  salaryPeriod?: string | null;
  description?: string;
  excerpt?: string;
  pubDate?: number | string;
}

export function normalizeHimalayas(raw: HimalayasRaw): Job | null {
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.applicationLink) || safeString(raw.guid);
  if (!title || !applyUrl) return null;
  const sourceId = safeString(raw.guid, `${safeString(raw.companySlug)}-${title}`.slice(0, 120));
  if (!sourceId) return null;

  const company = safeString(raw.companyName, "Unknown company");
  const categories = safeStringArray(raw.categories);
  const parents = safeStringArray(raw.parentCategories);
  const seniority = safeStringArray(raw.seniority);
  const restrictions = safeStringArray(raw.locationRestrictions);
  const salaryMin = safeNumber(raw.minSalary);
  const salaryMax = safeNumber(raw.maxSalary);
  const currency = safeString(raw.currency) || null;
  const employmentType = safeString(raw.employmentType);
  const descriptionHtml = safeString(raw.description) || safeString(raw.excerpt);
  const worldwide = restrictions.some((r) => /worldwide|anywhere|global/i.test(r));

  const eligibility = worldwide
    ? "Worldwide"
    : restrictions.length > 0
      ? restrictions.slice(0, 4).join(", ")
      : undefined;

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo: safeString(raw.companyLogo) || null,
    location: restrictions[0] || (worldwide ? "Worldwide" : "Remote"),
    remote: true,
    remoteEligibility: eligibility,
    employmentType: employmentType || undefined,
    experienceLevel: seniority[0] || undefined,
    salaryMin,
    salaryMax,
    salaryCurrency: currency,
    salaryText: formatSalary(salaryMin, salaryMax, currency || undefined),
    skills: [...categories, ...parents].slice(0, 12),
    tags: [...categories, ...seniority].slice(0, 12),
    category: parents[0] || categories[0],
    descriptionHtml: descriptionHtml || `<p>${title}</p>`,
    excerpt: safeString(raw.excerpt) || excerptFromHtml(descriptionHtml),
    postedAt: toIsoDate(raw.pubDate),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
  };
}

export async function fetchHimalayas(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(`${ENDPOINT}?limit=20`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Himalayas HTTP ${res.status}`);
    const data = (await res.json()) as { jobs?: HimalayasRaw[] };
    return (data.jobs || []).map(normalizeHimalayas).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
