/**
 * Remotive adapter — https://remotive.com/api/remote-jobs
 * Public, no key. Attribution required: link back to the Remotive listing URL.
 * Data delayed ~24 h by design. Rate limit: max 4 req/day recommended.
 */
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "remotive";
const ENDPOINT = "https://remotive.com/api/remote-jobs";

interface RemotiveRaw {
  id?: number | string;
  url?: string;
  title?: string;
  company_name?: string;
  company_logo?: string;
  company_logo_url?: string;
  category?: string;
  tags?: string[];
  job_type?: string;
  publication_date?: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

export function normalizeRemotive(raw: RemotiveRaw): Job | null {
  const sourceId = String(raw.id ?? "");
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = safeString(raw.company_name, "Unknown company");
  const logo = safeString(raw.company_logo_url || raw.company_logo) || null;
  const category = safeString(raw.category);
  const tags = safeStringArray(raw.tags);
  const jobType = safeString(raw.job_type)?.replace(/_/g, " ") || undefined;
  const location = safeString(raw.candidate_required_location);
  const salaryText = safeString(raw.salary) || undefined;
  const descriptionHtml = safeString(raw.description);
  const isWorldwide = /worldwide|anywhere|global/i.test(location);

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo,
    location: location || "Worldwide",
    remote: true,
    remoteEligibility: isWorldwide ? "Anywhere in the world" : location || undefined,
    employmentType: jobType,
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText,
    skills: tags,
    tags: [...(category ? [category] : []), ...tags].slice(0, 12),
    category: category || undefined,
    descriptionHtml: descriptionHtml || `<p>${title}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || title),
    postedAt: toIsoDate(raw.publication_date),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
  };
}

export async function fetchRemotive(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(`${ENDPOINT}?limit=50`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Remotive HTTP ${res.status}`);
    const data = (await res.json()) as { jobs?: RemotiveRaw[] };
    return (data.jobs || []).map(normalizeRemotive).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
