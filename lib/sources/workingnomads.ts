/**
 * Working Nomads adapter — https://www.workingnomads.com/api/exposed_jobs
 * Public JSON API, no key. Remote-only board. The API returns no id field,
 * so the sourceId is derived from the listing URL slug.
 */
import { FETCH_LIMITS, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "workingnomads";
const ENDPOINT = "https://www.workingnomads.com/api/exposed_jobs?mode=json";

interface WorkingNomadsRaw {
  url?: string;
  title?: string;
  company_name?: string;
  description?: string;
  location?: string;
  category_name?: string;
  tags?: string | string[];
  pub_date?: string;
}

/** Derive a stable slug from a listing URL (API supplies no id). */
function slugFromUrl(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return decodeURIComponent(last);
  } catch {
    /* fall through to hash */
  }
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  return `wn-${(h >>> 0).toString(36)}`;
}

function toTags(v: WorkingNomadsRaw["tags"]): string[] {
  if (Array.isArray(v)) return safeStringArray(v);
  const s = safeString(v);
  return s ? s.split(",").map((t) => t.trim()).filter(Boolean) : [];
}

export function normalizeWorkingNomads(raw: WorkingNomadsRaw): Job | null {
  const applyUrl = safeString(raw.url);
  const title = safeString(raw.title);
  if (!applyUrl || !title) return null;

  const sourceId = slugFromUrl(applyUrl);
  const company = safeString(raw.company_name, "Unknown company");
  const category = safeString(raw.category_name);
  const tags = [...toTags(raw.tags), ...(category ? [category] : [])].slice(0, 12);
  const location = safeString(raw.location) || "Remote";
  const descriptionHtml = safeString(raw.description);

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo: null,
    location,
    remote: true,
    remoteEligibility: location,
    employmentType: undefined,
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags,
    category: category || undefined,
    descriptionHtml: descriptionHtml || `<p>${title}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || title),
    postedAt: toIsoDate(raw.pub_date),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
  };
}

export async function fetchWorkingNomads(signal?: AbortSignal): Promise<Job[]> {
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
    if (!res.ok) throw new Error(`Working Nomads HTTP ${res.status}`);
    const data = (await res.json()) as WorkingNomadsRaw[];
    const items = Array.isArray(data) ? data : [];
    return items
      .map(normalizeWorkingNomads)
      .filter((j): j is Job => j !== null)
      .slice(0, FETCH_LIMITS.workingnomads);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
