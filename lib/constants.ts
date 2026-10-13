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
