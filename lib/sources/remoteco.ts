/**
 * Remote.co adapter — https://remote.co/remote-jobs/feed/ (RSS 2.0, public, no key)
 * Well-known curated remote job board covering all categories.
 */
import { XMLParser } from "fast-xml-parser";
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "remoteco";
const FEED = "https://remote.co/remote-jobs/feed/";

interface RssItem {
  title?: string;
  link?: string;
  guid?: string | { "#text"?: string; isPermaLink?: string };
  description?: string;
  "content:encoded"?: string;
  pubDate?: string;
  category?: string | string[];
  "dc:creator"?: string;
}

function guidStr(g: RssItem["guid"]): string {
  if (typeof g === "string") return g;
  return safeString(g?.["#text"]);
}

export function normalizeRemoteco(item: RssItem): Job | null {
  const rawTitle = safeString(item.title);
  const link = safeString(item.link) || guidStr(item.guid);
  if (!rawTitle || !link) return null;

  // Company often appears in dc:creator or "Role at Company" pattern
  const creator = safeString(item["dc:creator"]);
  let role = rawTitle;
  let company = creator || "Unknown company";

  const atIdx = rawTitle.lastIndexOf(" at ");
  if (atIdx > 0 && !creator) {
    role = rawTitle.slice(0, atIdx).trim();
    company = rawTitle.slice(atIdx + 4).trim();
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

export async function fetchRemoteco(signal?: AbortSignal): Promise<Job[]> {
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
    if (!res.ok) {
      return [];
    }
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const parsed = parser.parse(xml) as { rss?: { channel?: { item?: RssItem | RssItem[] } } };
    const items = parsed.rss?.channel?.item;
    const arr = Array.isArray(items) ? items : items ? [items] : [];
    return arr.map(normalizeRemoteco).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
