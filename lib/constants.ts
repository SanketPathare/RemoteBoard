import type { SourceName } from "./types";

/** Central tunables — no secrets here. Nothing client-exposed needs a key. */
export const PROVIDER_TIMEOUT_MS = 9_000;

export const FETCH_LIMITS: Record<SourceName, number> = {
  jobicy: 50,
  himalayas: 20,
  arbeitnow: 100,
  remoteok: 100,
  wwr: 40,
  remotive: 50,
  jobspresso: 50,
  remoteco: 50,
  remotefirst: 50,
  startupjobs: 50,
  remotelanders: 100,
  themuse: 40,
  workingnomads: 50,
  hnhiring: 100,
  hitachi: 50,
  greenhouse: 50,
  lever: 50,
  ashby: 50,
  recruitee: 50,
  personio: 50,
  workindia: 50,
};

/**
 * Direct ATS company handles. Add any company slug to fetch its public job board:
 * - Greenhouse: https://boards-api.greenhouse.io/v1/boards/{company}/jobs
 * - Lever: https://api.lever.co/v0/postings/{company}?mode=json
 * - Ashby: https://api.ashbyhq.com/posting-api/job-board/{company}
 * - Recruitee: https://{company}.recruitee.com/api/offers/
 * - Personio: https://{company}.jobs.personio.com/xml
 */
export const ATS_COMPANIES: Record<"greenhouse" | "lever" | "ashby" | "recruitee" | "personio", string[]> = {
  greenhouse: ["gitlab"],
  lever: ["spotify"],
  ashby: ["linear"],
  recruitee: ["bunq"],
  personio: ["personio"],
};

/** WWR category RSS feeds aggregated server-side (excerpt + link back). */
export const WWR_FEEDS = [
  "https://weworkremotely.com/categories/remote-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-design-jobs.rss",
  "https://weworkremotely.com/categories/remote-marketing-jobs.rss",
  "https://weworkremotely.com/categories/remote-customer-support-jobs.rss",
] as const;

export const SITE_DEFAULT_URL = "http://localhost:3000";

/** Identification header required by RemoteOK (403 without a real UA). */
export function userAgent(): string {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    SITE_DEFAULT_URL;
  return `RemoteJobBoard/1.0 (+${site})`;
}
