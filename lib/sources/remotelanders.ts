/**
 * Remote Landers adapter — https://remotelanders.com/api/jobs (JSON API, public, no key)
 * Direct ATS-sourced remote listings (Greenhouse, Ashby, Lever, SmartRecruiters, Recruitee).
 */
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, safeStringArray, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "remotelanders";
const ENDPOINT = "https://remotelanders.com/api/jobs?limit=100";

interface RemoteLandersRaw {
  slug?: string;
  title?: string;
  company?: string;
  companyWebsite?: string;
  category?: string;
  subtags?: string[];
  location?: string;
  type?: string;
  level?: string;
  salary?: string;
  salaryVariesByRegion?: boolean;
  postedDate?: string;
  url?: string;
}

interface RemoteLandersApiResponse {
  total?: number;
  jobs?: RemoteLandersRaw[];
}

function parseSalary(text: string): { min: number | null; max: number | null; currency: string | null } {
  if (!text) return { min: null, max: null, currency: null };
  const currency = text.includes("€") ? "EUR" : text.includes("£") ? "GBP" : text.includes("$") ? "USD" : null;
  const matches = text.match(/(\d+(?:\.\d+)?)\s*k?/gi);
  if (!matches) return { min: null, max: null, currency };
  const nums = matches
    .map((m) => {
      const isK = m.toLowerCase().includes("k");
      const num = parseFloat(m.replace(/[^0-9.]/g, ""));
      return isK ? num * 1000 : num < 500 && text.toLowerCase().includes("/ yr") ? num * 1000 : num;
    })
    .filter((n) => !Number.isNaN(n) && n > 0);
  if (nums.length === 0) return { min: null, max: null, currency };
  if (nums.length === 1) return { min: nums[0], max: nums[0], currency };
  return { min: Math.min(...nums), max: Math.max(...nums), currency };
}

export function normalizeRemoteLanders(raw: RemoteLandersRaw): Job | null {
  const sourceId = safeString(raw.slug);
  const title = safeString(raw.title);
  const applyUrl = safeString(raw.url);
  if (!sourceId || !title || !applyUrl) return null;

  const company = safeString(raw.company, "Unknown company");
  const subtags = safeStringArray(raw.subtags);
  const category = safeString(raw.category);
  const tags = [category, ...subtags].filter(Boolean);

  const loc = safeString(raw.location);
  const location = !loc || loc.toLowerCase() === "not stated" ? "Remote" : loc;

  // Resolve logo from company website if available
  let logo: string | null = null;
  if (raw.companyWebsite) {
    try {
      const urlStr = raw.companyWebsite.startsWith("http") ? raw.companyWebsite : `https://${raw.companyWebsite}`;
      const hostname = new URL(urlStr).hostname;
      if (hostname && !hostname.includes("localhost")) {
        logo = `https://unavatar.io/${hostname}?fallback=false`;
      }
    } catch {}
  }

  const { min, max, currency } = parseSalary(raw.salary || "");

  const roleDesc = `<p><strong>${title}</strong> at <strong>${company}</strong>.</p><p>Discipline: ${
    category || "General"
  } | Location: ${location} | Employment: ${raw.type || "Full-time"}</p><p>Sourced directly from verified employer ATS platforms via Remote Landers.</p>`;

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo,
    location,
    remote: true,
    remoteEligibility: location,
    employmentType: safeString(raw.type) || undefined,
    experienceLevel: safeString(raw.level) || undefined,
    salaryMin: min,
    salaryMax: max,
    salaryCurrency: currency,
    salaryText: safeString(raw.salary) || undefined,
    skills: tags,
    tags: tags.slice(0, 10),
    category: category || "Other",
    descriptionHtml: roleDesc,
    excerpt: excerptFromHtml(roleDesc),
    postedAt: toIsoDate(raw.postedDate),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
  };
}

export async function fetchRemoteLanders(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(ENDPOINT, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return [];
    }
    const data = (await res.json()) as RemoteLandersApiResponse;
    const items = Array.isArray(data.jobs) ? data.jobs : [];
    return items.map(normalizeRemoteLanders).filter((j): j is Job => j !== null);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
