/**
 * Jobspresso adapter — https://jobspresso.co/feed/ (RSS 2.0, public, no key)
 * Curated remote jobs for tech, design, marketing and more.
 */
import { XMLParser } from "fast-xml-parser";
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "jobspresso";
const FEED = "https://jobspresso.co/feed/";

interface RssItem {
  title?: string;
  link?: string;
  guid?: string | { "#text"?: string };
  description?: string;
  pubDate?: string;
  "content:encoded"?: string;
  category?: string | string[];
}

function guidStr(g: RssItem["guid"]): string {
  if (typeof g === "string") return g;
  return safeString(g?.["#text"]);
}

export function normalizeJobspresso(item: RssItem): Job | null {
  const rawTitle = safeString(item.title);
  const link = safeString(item.link) || guidStr(item.guid);
  if (!rawTitle || !link) return null;

  // Title format: "Role at Company" or "Role — Company"
  let role = rawTitle;
  let company = "Unknown company";
  const atIdx = rawTitle.lastIndexOf(" at ");
  const dashIdx = rawTitle.lastIndexOf(" — ");
  if (atIdx > 0) {
    role = rawTitle.slice(0, atIdx).trim();
    company = rawTitle.slice(atIdx + 4).trim();
  } else if (dashIdx > 0) {
    role = rawTitle.slice(0, dashIdx).trim();
    company = rawTitle.slice(dashIdx + 3).trim();
  }

  const rawCat = item.category;
  const cats = Array.isArray(rawCat)
    ? rawCat.map((c) => safeString(c)).filter(Boolean)
    : rawCat ? [safeString(rawCat)] : [];
  const descriptionHtml = safeString(item["content:encoded"] || item.description);
  const logoMatch = descriptionHtml.match(/<img[^>]+src="([^">]+)"/i);
  const logo = logoMatch ? logoMatch[1] : null;

  return {
    id: makeJobId(SOURCE, link),
    source: SOURCE,
    sourceId: link,
    title: role,
    company,
    logo,
    location: "Remote",
    remote: true,
    remoteEligibility: "Remote",
    employmentType: undefined,
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: cats,
    tags: cats.slice(0, 10),
    category: cats[0],
    descriptionHtml: descriptionHtml || `<p>${role}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || role),
    postedAt: toIsoDate(item.pubDate),
    applyUrl: link,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(link)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: link,
  };
}

export async function fetchJobspresso(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(FEED, {
      signal: ctrl.signal,
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Jobspresso HTTP ${res.status}`);
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const parsed = parser.parse(xml) as { rss?: { channel?: { item?: RssItem | RssItem[] } } };
    const items = parsed.rss?.channel?.item;
    const arr = Array.isArray(items) ? items : items ? [items] : [];
    return arr.map(normalizeJobspresso).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
