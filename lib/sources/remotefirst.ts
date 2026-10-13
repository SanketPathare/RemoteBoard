/**
 * Remote First Jobs adapter — https://remotefirstjobs.com/api/search-jobs
 * Public JSON API, updated every 10 min.
 * Attribution required: listings link back to remotefirstjobs.com listing URLs.
 */
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "remotefirst";
const ENDPOINT = "https://remotefirstjobs.com/api/search-jobs";

interface RemoteFirstRaw {
  id?: string;
  url?: string;
  company_name?: string;
  company_logo?: string;
  title?: string;
  category?: string;
  seniority?: string;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  locations?: string[];
  published_at?: string;
}

export function normalizeRemoteFirst(raw: RemoteFirstRaw): Job | null {
  const sourceId = safeString(raw.id);
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = safeString(raw.company_name, "Unknown company");
  const logo = safeString(raw.company_logo) || null;
  const rawCat = safeString(raw.category)?.replace(/_/g, " ");
  const seniority = safeString(raw.seniority);
  const tags = [rawCat, seniority].filter(Boolean) as string[];

  const locs = Array.isArray(raw.locations)
    ? raw.locations.map((l) => safeString(l)).filter(Boolean)
    : [];
  const location = locs.length > 0 ? locs.join(", ") : "Remote";

  const sMin = typeof raw.salary_min === "number" && raw.salary_min > 0 ? raw.salary_min : null;
  const sMax = typeof raw.salary_max === "number" && raw.salary_max > 0 ? raw.salary_max : null;

  let salaryText: string | undefined = undefined;
  if (sMin && sMax) {
    salaryText = `$${sMin.toLocaleString()} – $${sMax.toLocaleString()}`;
  } else if (sMin) {
    salaryText = `$${sMin.toLocaleString()}+`;
  } else if (sMax) {
    salaryText = `Up to $${sMax.toLocaleString()}`;
  }

  const descriptionHtml = safeString(raw.description);
  const isWorldwide = /worldwide|anywhere|global/i.test(location);

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo,
    location,
    remote: true,
    remoteEligibility: isWorldwide ? "Anywhere in the world" : location,
    employmentType: undefined,
    experienceLevel: seniority || undefined,
    salaryMin: sMin,
    salaryMax: sMax,
    salaryCurrency: "USD",
    salaryText,
    skills: tags,
    tags: tags.slice(0, 10),
    category: rawCat || undefined,
    descriptionHtml: descriptionHtml || `<p>${title}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || title),
    postedAt: toIsoDate(raw.published_at),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Remote First",
    sourceUrl: applyUrl,
  };
}

export async function fetchRemoteFirst(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const res = await fetch(ENDPOINT, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "RemoteBoard/1.0 (+https://remoteboard.dev)",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Remote First HTTP ${res.status}`);
    const data = (await res.json()) as { jobs?: RemoteFirstRaw[] };
    const list = Array.isArray(data.jobs) ? data.jobs : [];
    return list.map(normalizeRemoteFirst).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
