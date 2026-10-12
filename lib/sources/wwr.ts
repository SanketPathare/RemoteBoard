/**
 * We Work Remotely adapter — public category RSS feeds (XML).
 * Server-side parse only. We store an excerpt + link back to the original
 * WWR listing (paid postings — attribution-sensitive, no full rehost claim).
 */
import { XMLParser } from "fast-xml-parser";
import { PROVIDER_TIMEOUT_MS, WWR_FEEDS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "wwr";

interface RssItem {
  title?: string;
  link?: string;
  guid?: string | { "#text"?: string };
  description?: string;
  pubDate?: string;
  region?: string;
  category?: string;
  "media:content"?: { url?: string };
}

function guidText(g: RssItem["guid"]): string {
  if (typeof g === "string") return g;
  return safeString(g?.["#text"]);
}

function splitTitle(title: string): { company: string; role: string } {
  const idx = title.indexOf(":");
  if (idx > 0) {
    return {
      company: title.slice(0, idx).trim() || "Unknown company",
      role: title.slice(idx + 1).trim() || title,
    };
  }
  return { company: "Unknown company", role: title };
}

export function normalizeWwr(item: RssItem): Job | null {
  const rawTitle = safeString(item.title);
  const link = safeString(item.link) || guidText(item.guid);
  if (!rawTitle || !link) return null;

  const { company, role } = splitTitle(rawTitle);
  const region = safeString(item.region);
  const category = safeString(item.category);
  const descriptionHtml = safeString(item.description);
  const logoMatch = descriptionHtml.match(/<img[^>]+src="([^"]+)"/i);
  const logo = logoMatch ? logoMatch[1] : null;
  const worldwide = /anywhere in the world|worldwide|global|remote/i.test(region);

  return {
    id: makeJobId(SOURCE, link),
    source: SOURCE,
    sourceId: link,
    title: role,
    company,
    logo,
    location: region || "Remote",
    remote: true,
    // Only claim worldwide when the feed region says so.
    remoteEligibility: worldwide ? "Anywhere in the world" : region || undefined,
    employmentType: undefined,
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: category ? [category] : [],
    tags: category ? [category] : [],
    category: category || undefined,
    descriptionHtml: descriptionHtml || `<p>${role}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || role),
    postedAt: toIsoDate(item.pubDate),
    applyUrl: link,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(link)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: link,
  };
}

async function fetchFeed(url: string, signal: AbortSignal): Promise<Job[]> {
  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`WWR HTTP ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
  const parsed = parser.parse(xml) as { rss?: { channel?: { item?: RssItem | RssItem[] } } };
  const items = parsed.rss?.channel?.item;
  const arr = Array.isArray(items) ? items : items ? [items] : [];
  return arr.map(normalizeWwr).filter((j): j is Job => j !== null);
}

export async function fetchWwr(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS * 2);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const settled = await Promise.allSettled(
      WWR_FEEDS.map((f) => fetchFeed(f, ctrl.signal)),
    );
    const all: Job[] = [];
    for (const s of settled) {
      if (s.status === "fulfilled") all.push(...s.value);
    }
    if (all.length === 0) {
      const first = settled.find((s) => s.status === "rejected") as PromiseRejectedResult | undefined;
      if (first) throw new Error(String(first.reason));
    }
    // ~10 per feed to keep the mix balanced.
    return all.slice(0, 40);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
