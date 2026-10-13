/**
 * Startup Jobs adapter — https://startup.jobs/feeds/jobs?workplace=remote
 * Public RSS 2.0 feed, curated remote startup jobs.
 * Attribution required: listings link back to startup.jobs.
 */
import { XMLParser } from "fast-xml-parser";
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "startupjobs";
const FEED = "https://startup.jobs/feeds/jobs?workplace=remote";

interface RssItem {
  title?: string;
  link?: string;
  guid?: string | { "#text"?: string; isPermaLink?: string };
  description?: string;
  pubDate?: string;
  category?: string | string[];
}

function guidStr(g: RssItem["guid"]): string {
  if (typeof g === "string") return g;
  return safeString(g?.["#text"]);
}

export function normalizeStartupJobs(item: RssItem): Job | null {
  const rawTitle = safeString(item.title);
  const link = safeString(item.link) || guidStr(item.guid);
  if (!rawTitle || !link) return null;

  // Title format: "Role at Company"
  let role = rawTitle;
  let company = "Unknown startup";
  const atIdx = rawTitle.lastIndexOf(" at ");
  if (atIdx > 0) {
    role = rawTitle.slice(0, atIdx).trim();
    company = rawTitle.slice(atIdx + 4).trim();
  }

  const rawCat = item.category;
  const cats = Array.isArray(rawCat)
    ? rawCat.map((c) => safeString(c)).filter(Boolean)
    : rawCat ? [safeString(rawCat)] : [];

  const descriptionHtml = safeString(item.description);

  // Extract location and salary from description (e.g. "Remote, U.S. · $209,800 – $262,200 per year")
  let location = "Remote";
  let salaryText: string | undefined = undefined;
  const lines = descriptionHtml.split("\n").map((l) => l.trim()).filter(Boolean);
  const metaLine = lines.length > 1 ? lines[lines.length - 1] : "";

  if (metaLine.includes("·")) {
    const parts = metaLine.split("·").map((s) => s.trim());
    if (parts[0]) location = parts[0];
    if (parts[1]) salaryText = parts[1];
  } else if (/^remote/i.test(metaLine)) {
    location = metaLine;
  }

  return {
    id: makeJobId(SOURCE, link),
    source: SOURCE,
    sourceId: link,
    title: role,
    company,
    logo: null,
    location,
    remote: true,
    remoteEligibility: "Remote",
    employmentType: undefined,
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText,
    skills: cats,
    tags: cats.slice(0, 8),
    category: cats[0],
    descriptionHtml: descriptionHtml ? `<p>${descriptionHtml.replace(/\n/g, "<br/>")}</p>` : `<p>${role}</p>`,
    excerpt: excerptFromHtml(descriptionHtml || role),
    postedAt: toIsoDate(item.pubDate),
    applyUrl: link,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(link)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Startup Jobs",
    sourceUrl: link,
  };
}

export async function fetchStartupJobs(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const res = await fetch(FEED, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "RemoteBoard/1.0 (+https://remoteboard.dev)",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Startup Jobs HTTP ${res.status}`);
    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      trimValues: true,
    });
    const parsed = parser.parse(xml) as {
      rss?: { channel?: { item?: RssItem | RssItem[] } };
    };

    const rawItems = parsed.rss?.channel?.item;
    const items: RssItem[] = Array.isArray(rawItems)
      ? rawItems
      : rawItems ? [rawItems] : [];

    return items.map(normalizeStartupJobs).filter((j): j is Job => j !== null);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
