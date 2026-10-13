/**
 * Hacker News "Who is hiring?" adapter — https://hn.algolia.com/api/v1
 * Free Algolia HN Search API, no key. Stateless two-step:
 *   1. Discover the latest monthly "Ask HN: Who is hiring?" thread.
 *   2. Pull its top-level comments (parent_id === story_id) and heuristically
 *      parse each freeform listing into company / title / location.
 * Apply URL = first external link in the comment (never fabricated); falls
 * back to the HN comment permalink. sourceUrl is always the HN permalink.
 */
import { FETCH_LIMITS, PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "hnhiring";
const SEARCH = "https://hn.algolia.com/api/v1/search";
const HN_ITEM = "https://news.ycombinator.com/item?id=";
const HIRING_TITLE = /^ask hn[:\s-]*who\s+is\s+hiring\??/i;

interface HnStory {
  objectID?: string;
  title?: string;
  created_at?: string;
}

interface HnComment {
  objectID?: string;
  story_id?: number | string;
  parent_id?: number | string;
  author?: string;
  created_at?: string;
  comment_text?: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      try {
        return String.fromCodePoint(parseInt(h, 16));
      } catch {
        return "";
      }
    })
    .replace(/&#(\d+);/g, (_, d) => {
      try {
        return String.fromCodePoint(Number(d));
      } catch {
        return "";
      }
    })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function firstLine(html: string): string {
  const withBreaks = html.replace(/<\/p>|<br\s*\/?>|<\/div>/gi, "\n");
  const text = decodeEntities(withBreaks.replace(/<[^>]+>/g, " "));
  return (
    text
      .split("\n")
      .map((l) => l.replace(/\s+/g, " ").trim())
      .find((l) => l.length > 0) || ""
  );
}

function firstExternalLink(html: string): string | null {
  const re = /<a\s+[^>]*href="([^"]+)"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const url = decodeEntities(m[1]).trim();
    if (/^https?:\/\//i.test(url) && !/news\.ycombinator\.com/i.test(url)) {
      return url;
    }
  }
  return null;
}

function cleanCompany(s: string): string {
  const c = s
    .replace(/^company\s*[:\-]\s*/i, "")
    .replace(/\s*[\(\[].*?[\)\]]\s*$/g, "")
    .replace(/\s*[-–—,|:]+\s*$/g, "")
    .replace(/\s+is\s+hiring.*$/i, "")
    .replace(/\s+hiring\b.*$/i, "")
    .trim();
  if (/https?:\/\//i.test(c) || URLISH.test(c)) return "";
  return c.slice(0, 80);
}

const URLISH = /https?:\/\/|www\.|\.(com|io|co|net|org|ai|dev)\b/i;

const WORK_MODE = /^(remote|fully[- ]?remote|onsite|on-site|hybrid|full[- ]?time|part[- ]?time|contract|contractor|freelance|internship|anywhere|worldwide|us|usa|eu|emea|global)$/i;

function cleanTitle(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " "))
    .replace(/\bhttps?:\/\/\S+.*$/i, "")
    .replace(/\bwww\.\S+.*$/i, "")
    .replace(/\s*[\(\[].*?[\)\]]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/[\s.,;:\-–—|]+$/, "")
    .trim()
    .slice(0, 120);
}

function labelValue(text: string, labels: string[]): string {
  for (const label of labels) {
    const re = new RegExp(`${label}\\s*[:\\-]\\s*([^|\\n]+)`, "i");
    const m = text.match(re);
    if (m) return m[1].trim();
  }
  return "";
}

interface ParsedListing {
  company: string;
  title: string;
  location: string;
  remote: boolean;
}

function parseListing(html: string): ParsedListing | null {
  const plain = firstLine(html);
  if (!plain || plain.length < 6) return null;

  // Drop first-person job-seeker posts (not listings).
  if (/^(i am|i'm|i’m|we are looking|candidate|seeking)\b/i.test(plain)) return null;

  let segs = plain.split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
  if (segs.length === 1) {
    const alt = plain.split(/\s+[—–]\s+|\s+-\s+/).map((s) => s.trim()).filter(Boolean);
    if (alt.length >= 2) segs = alt;
  }

  let company = "";
  let title = "";
  let location = "";

  if (segs.length >= 2) {
    company = cleanCompany(segs[0]);
    title = cleanTitle(segs[1]);
    location = segs[2] || "";
    // segs[1] was a work-mode/location, not the role — scan further for the role.
    if (WORK_MODE.test(title)) {
      const role = segs
        .slice(2)
        .map(cleanTitle)
        .find((s) => s && !WORK_MODE.test(s) && !URLISH.test(s));
      if (role) {
        location = segs[1];
        title = role;
      }
    }
    // "Role | <link>" style listing — no company given.
    if (!title && company) {
      title = cleanTitle(segs[0]);
      company = "";
    }
  } else {
    company = cleanCompany(labelValue(plain, ["company", "startup"]) || "");
    title = cleanTitle(labelValue(plain, ["role", "position", "title", "job"]));
    location = labelValue(plain, ["location", "based in", "remote"]);
  }

  if (!title || WORK_MODE.test(title) || URLISH.test(title)) return null; // no identifiable role → skip

  const remote = /remote|anywhere|worldwide|fully[- ]remote|telecommute|distributed team/i.test(plain);
  return {
    company: company || "Unknown company",
    title,
    location: location || (remote ? "Remote" : "See listing"),
    remote,
  };
}

function detectEmploymentType(text: string): string | undefined {
  if (/full[- ]?time/i.test(text)) return "Full-time";
  if (/part[- ]?time/i.test(text)) return "Part-time";
  if (/contract|freelance/i.test(text)) return "Contract";
  if (/intern(ship)?\b/i.test(text)) return "Internship";
  return undefined;
}

export function normalizeHnComment(raw: HnComment): Job | null {
  const sourceId = safeString(raw.objectID);
  const descriptionHtml = safeString(raw.comment_text);
  if (!sourceId || !descriptionHtml) return null;

  const parsed = parseListing(descriptionHtml);
  if (!parsed) return null;

  const permalink = `${HN_ITEM}${sourceId}`;
  const applyUrl = firstExternalLink(descriptionHtml) || permalink;
  const employmentType = detectEmploymentType(firstLine(descriptionHtml));
  const tags = [...(parsed.remote ? ["Remote"] : []), ...(employmentType ? [employmentType] : [])];

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title: parsed.title,
    company: parsed.company,
    logo: null,
    location: parsed.location,
    remote: parsed.remote,
    remoteEligibility: parsed.remote ? parsed.location : undefined,
    employmentType: employmentType || undefined,
    experienceLevel: undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: [],
    tags,
    category: undefined,
    descriptionHtml,
    excerpt: excerptFromHtml(descriptionHtml),
    postedAt: toIsoDate(raw.created_at),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: permalink,
  };
}

async function discoverStory(signal: AbortSignal): Promise<HnStory | null> {
  const url = `${SEARCH}?query=${encodeURIComponent("Ask HN: Who is hiring")}&tags=story&hitsPerPage=20`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`HN search HTTP ${res.status}`);
  const data = (await res.json()) as { hits?: HnStory[] };
  const hits = Array.isArray(data.hits) ? data.hits : [];
  return hits.find((h) => HIRING_TITLE.test(safeString(h.title))) ?? null;
}

async function fetchComments(storyId: string, signal: AbortSignal): Promise<HnComment[]> {
  const url = `${SEARCH}?tags=${encodeURIComponent(`comment,story_${storyId}`)}&hitsPerPage=100&page=0`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`HN comments HTTP ${res.status}`);
  const data = (await res.json()) as { hits?: HnComment[] };
  return Array.isArray(data.hits) ? data.hits : [];
}

export async function fetchHnHiring(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const story = await discoverStory(ctrl.signal);
    if (!story?.objectID) return [];
    const storyId = String(story.objectID);
    const comments = await fetchComments(storyId, ctrl.signal);
    return comments
      .filter((c) => String(c.parent_id) === storyId && String(c.story_id) === storyId)
      .map((c) => normalizeHnComment(c))
      .filter((j): j is Job => j !== null)
      .slice(0, FETCH_LIMITS.hnhiring);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
