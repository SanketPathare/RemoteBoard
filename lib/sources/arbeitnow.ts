/**
 * Arbeitnow adapter — https://www.arbeitnow.com/api/job-board-api
 * Free, no key. { data:[{slug,title,company_name,url,...}], links, meta }.
 */
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "arbeitnow";
const ENDPOINT = "https://www.arbeitnow.com/api/job-board-api";

interface ArbeitnowRaw {
  slug?: string;
  title?: string;
  company_name?: string;
  description?: string;
  location?: string;
  remote?: boolean;
  created_at?: number | string;
  url?: string;
  tags?: string[];
  job_types?: string[];
}

export function normalizeArbeitnow(raw: ArbeitnowRaw): Job | null {
  const sourceId = safeString(raw.slug);
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = safeString(raw.company_name, "Unknown company");
  const location = safeString(raw.location);
  const remote = raw.remote === true || /remote/i.test(location);
  const tags = safeStringArray(raw.tags);
  const types = safeStringArray(raw.job_types);
  const descriptionHtml = safeString(raw.description);

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo: null,
    location: location || (remote ? "Remote" : "Germany / EU"),
    remote,
    remoteEligibility: remote ? "Remote eligible" : location || undefined,
    employmentType: types[0] || undefined,
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags: [...tags, ...types].slice(0, 12),
    category: tags[0],
    descriptionHtml: descriptionHtml || `<p>${title}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || title),
    postedAt: toIsoDate(raw.created_at),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
  };
}

export async function fetchArbeitnow(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(ENDPOINT, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Arbeitnow HTTP ${res.status}`);
    const data = (await res.json()) as { data?: ArbeitnowRaw[] };
    return (data.data || []).map(normalizeArbeitnow).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
