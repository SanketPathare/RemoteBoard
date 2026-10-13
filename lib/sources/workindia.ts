/**
 * WorkIndia adapter — https://www.workindia.in
 * Aggregates verified Work From Home / Remote opportunities across Pune, Mumbai,
 * Bengaluru, and pan-India locations directly from WorkIndia's live feeds.
 */
import { FETCH_LIMITS, PROVIDER_TIMEOUT_MS } from "../constants";
import { safeString } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "workindia";

const WORKINDIA_FEEDS = [
  "https://www.workindia.in/work-from-home-jobs-in-pune/",
  "https://www.workindia.in/work-from-home-jobs/",
  "https://www.workindia.in/work-from-home-jobs-in-mumbai/",
  "https://www.workindia.in/work-from-home-jobs-in-bengaluru/",
] as const;

interface WorkIndiaCardRaw {
  url: string;
  title: string;
  salary?: string;
  location: string;
  jobType: string;
  experience: string;
  english?: string;
  company: string;
  qualification: string;
  postedOn: string;
}

function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseSalary(salaryStr?: string): {
  min: number | null;
  max: number | null;
  text?: string;
} {
  if (!salaryStr) return { min: null, max: null };
  const nums = salaryStr.match(/\d+/g);
  if (!nums || nums.length === 0) return { min: null, max: null, text: salaryStr };

  const min = parseInt(nums[0], 10);
  const max = nums.length > 1 ? parseInt(nums[1], 10) : min;
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
  const text = min === max ? `${fmt(min)}/mo` : `${fmt(min)} – ${fmt(max)}/mo`;
  return { min, max, text };
}

function parsePostedDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  // Format: "MM/DD/YYYY" e.g. "10/13/2026"
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [m, d, y] = parts;
    const date = new Date(Date.UTC(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10)));
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  return new Date().toISOString();
}

export function normalizeWorkIndia(raw: WorkIndiaCardRaw): Job | null {
  const applyUrl = safeString(raw.url);
  const rawTitle = unescapeHtml(safeString(raw.title));
  if (!applyUrl || !rawTitle) return null;

  // Clean title (remove redundant "Work From Home - " prefix if present)
  const title = rawTitle.replace(/^work\s+from\s+home\s*[-–:]\s*/i, "").trim() || rawTitle;

  // Extract ID from URL (e.g. ...-pune-11532074/)
  const idMatch = applyUrl.match(/-(\d+)\/?$/);
  const sourceId = idMatch ? idMatch[1] : Buffer.from(applyUrl).toString("base64").slice(0, 16);

  const company = unescapeHtml(safeString(raw.company, "WorkIndia Employer"));
  const rawLocation = unescapeHtml(safeString(raw.location, "India (remote)"));
  
  // Clean location string
  let location = rawLocation;
  if (!/india/i.test(location)) {
    location = `${location}, India`;
  }

  const jobType = unescapeHtml(safeString(raw.jobType));
  const experience = unescapeHtml(safeString(raw.experience));
  const qualification = unescapeHtml(safeString(raw.qualification));
  const english = raw.english ? unescapeHtml(safeString(raw.english)) : "";

  const { min: salaryMin, max: salaryMax, text: salaryText } = parseSalary(raw.salary);
  const postedAt = parsePostedDate(raw.postedOn);

  const skills: string[] = [];
  if (jobType) skills.push(jobType);
  if (experience) skills.push(experience);
  if (qualification) skills.push(qualification);
  if (english) skills.push(english);

  const tags = [
    "Work From Home",
    "Remote",
    "India",
    ...skills,
  ].slice(0, 10);

  const descriptionHtml = `
    <div class="workindia-posting">
      <p><strong>Position:</strong> ${title}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Location:</strong> ${location} (Work From Home / Remote)</p>
      ${salaryText ? `<p><strong>Compensation:</strong> ${salaryText}</p>` : ""}
      <p><strong>Department / Role:</strong> ${jobType || "General"}</p>
      <p><strong>Experience Required:</strong> ${experience || "Open"}</p>
      <p><strong>Qualification:</strong> ${qualification || "Graduate / Open"}</p>
      ${english ? `<p><strong>Language Proficiency:</strong> ${english}</p>` : ""}
      <p class="mt-4">This position is verified and sourced live from WorkIndia's Work From Home directory.</p>
    </div>
  `.trim();

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo: null,
    location,
    remote: true,
    remoteEligibility: "India (remote)",
    employmentType: "Full-time",
    experienceLevel: experience || undefined,
    salaryMin,
    salaryMax,
    salaryCurrency: "INR",
    salaryText,
    skills,
    tags,
    category: jobType || "General",
    descriptionHtml,
    excerpt: `${title} at ${company}. ${location}. ${salaryText || "Competitive pay"}.`,
    postedAt,
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE].label,
    sourceUrl: applyUrl,
  };
}

async function fetchWorkIndiaFeed(url: string, signal: AbortSignal): Promise<WorkIndiaCardRaw[]> {
  const res = await fetch(url, {
    signal,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const html = await res.text();
  const cardRegex =
    /<h2[^>]*class="[^"]*text-brand[^"]*"[^>]*><a\s+href="([^"]+)">([^<]+)<\/a><\/h2>[\s\S]*?(?:<div class="f14 f-bold">([^<]+)<\/div>)?[\s\S]*?<div class="JobDetailsSection"[\s\S]*?LocationDetail[^>]*>([^<]+)<\/div>[\s\S]*?JobTypeDetail[^>]*>([^<]+)<\/div>[\s\S]*?ExperienceDetail[^>]*>([^<]+)<\/div>[\s\S]*?(?:EnglishDetail[^>]*>([^<]+)<\/div>)?[\s\S]*?CompanyDetail[^>]*>([^<]+)<\/div>[\s\S]*?QualificationDetail[^>]*>([^<]+)<\/div>[\s\S]*?JobPostedOnDetail[^>]*>Posted on:\s*([^<]+)<\/div>/gi;

  let match;
  const cards: WorkIndiaCardRaw[] = [];
  while ((match = cardRegex.exec(html)) !== null) {
    const [
      ,
      cardUrl,
      rawTitle,
      salary,
      location,
      jobType,
      experience,
      english,
      company,
      qualification,
      postedOn,
    ] = match;

    cards.push({
      url: cardUrl,
      title: rawTitle,
      salary,
      location,
      jobType,
      experience,
      english,
      company,
      qualification,
      postedOn,
    });
  }

  return cards;
}

export async function fetchWorkIndia(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const rawResults = await Promise.allSettled(
      WORKINDIA_FEEDS.map((url) => fetchWorkIndiaFeed(url, ctrl.signal))
    );

    const allCards: WorkIndiaCardRaw[] = [];
    for (const r of rawResults) {
      if (r.status === "fulfilled") {
        allCards.push(...r.value);
      }
    }

    const seen = new Set<string>();
    const jobs: Job[] = [];
    const limit = FETCH_LIMITS.workindia || 50;

    for (const card of allCards) {
      const normalized = normalizeWorkIndia(card);
      if (normalized && !seen.has(normalized.id)) {
        seen.add(normalized.id);
        jobs.push(normalized);
        if (jobs.length >= limit) break;
      }
    }

    return jobs;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
