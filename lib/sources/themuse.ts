/**
 * The Muse adapter — https://www.themuse.com/api/public/jobs
 * Public JSON API, no key, paginated at 20 results/page. Returns all job
 * types (on-site + remote), so remote eligibility is derived per listing.
 * Apply URL = refs.landing_page (the real Muse posting).
 */
import { FETCH_LIMITS, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "themuse";
const ENDPOINT = "https://www.themuse.com/api/public/jobs";

interface MuseNamed {
  name?: string;
  short_name?: string;
}

interface MuseRaw {
  id?: number | string;
  short_name?: string;
  name?: string;
  type?: string;
  publication_date?: string;
  contents?: string;
  locations?: MuseNamed[];
  categories?: MuseNamed[];
  levels?: MuseNamed[];
  tags?: MuseNamed[];
  refs?: { landing_page?: string };
  company?: { id?: number | string; short_name?: string; name?: string; logo?: string };
}

export function normalizeTheMuse(raw: MuseRaw): Job | null {
  const sourceId = safeString(String(raw.id ?? ""));
  const title = safeString(raw.name);
  const applyUrl = safeString(raw.refs?.landing_page);
  if (!sourceId || !title || !applyUrl) return null;

  const company = safeString(raw.company?.name, "Unknown company");
  const logo = safeString(raw.company?.logo) || null;

  const locations = Array.isArray(raw.locations)
    ? raw.locations.map((l) => safeString(l?.name)).filter(Boolean)
    : [];
  const location = locations.length > 0 ? locations.join(", ") : "Remote";

  const categories = Array.isArray(raw.categories)
    ? safeStringArray(raw.categories.map((c) => c?.name))
    : [];
  const levels = Array.isArray(raw.levels)
    ? safeStringArray(raw.levels.map((l) => l?.name))
    : [];
  const extraTags = Array.isArray(raw.tags)
    ? safeStringArray(raw.tags.map((t) => t?.name))
    : [];
  const tags = [...categories, ...levels, ...extraTags].slice(0, 12);

  const descriptionHtml = safeString(raw.contents);
  const isRemote = locations.some((l) => /remote|anywhere|worldwide|telecommute/i.test(l));

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo,
    location,
    remote: isRemote,
    remoteEligibility: isRemote ? location : undefined,
    employmentType: safeString(raw.type) || undefined,
    experienceLevel: levels[0] || undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags,
    category: categories[0] || undefined,
    descriptionHtml: descriptionHtml || `<p>${title}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || title),
    postedAt: toIsoDate(raw.publication_date),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
  };
}

async function fetchPage(page: number, signal: AbortSignal): Promise<MuseRaw[]> {
  const res = await fetch(`${ENDPOINT}?page=${page}`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`The Muse HTTP ${res.status}`);
  const data = (await res.json()) as { results?: MuseRaw[] };
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchTheMuse(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  const pages = Math.max(1, Math.ceil(FETCH_LIMITS.themuse / 20));
  try {
    const results = await Promise.all(
      Array.from({ length: pages }, (_, i) => fetchPage(i + 1, ctrl.signal)),
    );
    return results
      .flat()
      .map(normalizeTheMuse)
      .filter((j): j is Job => j !== null)
      .slice(0, FETCH_LIMITS.themuse);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
