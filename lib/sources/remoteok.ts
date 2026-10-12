/**
 * RemoteOK adapter — https://remoteok.com/api
 * Response is an array: [0] = { legal, last_updated }, rest = jobs.
 * Requires a real User-Agent (server-side only). Apply URL = apply_url ?? url.
 * NOTE: RemoteOK logo is a registered trademark — we intentionally OMIT logos
 * and render an initial-avatar instead (see JobCard).
 */
import { PROVIDER_TIMEOUT_MS, userAgent } from "../constants";
import { excerptFromHtml, formatSalary, safeNumber, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "remoteok";
const ENDPOINT = "https://remoteok.com/api";

interface RemoteOkRaw {
  slug?: string;
  id?: string | number;
  position?: string;
  company?: string;
  tags?: string[];
  description?: string;
  location?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  url?: string;
  apply_url?: string;
  epoch?: number;
  date?: string;
}

export function normalizeRemoteOk(raw: RemoteOkRaw): Job | null {
  const sourceId = safeString(String(raw.slug || raw.id || ""));
  const title = safeString(raw.position);
  const applyUrl = safeString(raw.apply_url) || safeString(raw.url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = safeString(raw.company, "Unknown company");
  const tags = safeStringArray(raw.tags);
  const min = safeNumber(raw.salary_min);
  const max = safeNumber(raw.salary_max);
  const location = safeString(raw.location);
  const descriptionHtml = safeString(raw.description);

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo: null, // trademark: never reuse RemoteOK-hosted logos without permission
    location: location || "Remote",
    remote: true,
    remoteEligibility: location || undefined,
    employmentType: undefined,
    experienceLevel: undefined,
    salaryMin: min,
    salaryMax: max,
    salaryCurrency: min || max ? "USD" : null,
    salaryText: formatSalary(min, max, min || max ? "USD" : undefined),
    skills: tags,
    tags,
    category: tags[0],
    descriptionHtml: descriptionHtml || `<p>${title}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || title),
    postedAt: toIsoDate(raw.epoch ?? raw.date),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: safeString(raw.url) || applyUrl,
  };
}

export async function fetchRemoteOk(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(ENDPOINT, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": userAgent() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`RemoteOK HTTP ${res.status}`);
    const data = (await res.json()) as (RemoteOkRaw & { legal?: string })[];
    const jobs = Array.isArray(data) ? data.filter((d) => !d.legal) : [];
    return (jobs as RemoteOkRaw[])
      .map(normalizeRemoteOk)
      .filter((j): j is Job => j !== null)
      .slice(0, 100);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
