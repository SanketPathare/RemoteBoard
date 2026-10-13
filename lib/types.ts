/**
 * Shared Job type + source constants.
 * No database, no persistence — jobs are normalized live from providers.
 */

export type SourceName =
  | "jobicy"
  | "himalayas"
  | "arbeitnow"
  | "remoteok"
  | "wwr"
  | "remotive"
  | "jobspresso"
  | "remoteco"
  | "remotefirst"
  | "startupjobs";

export interface Job {
  /** Composite id: `${source}:${sourceId}` — used for React keys, detail routes, dedup. */
  id: string;
  source: SourceName;
  /** Original provider-side id/slug. */
  sourceId: string;
  title: string;
  company: string;
  /** Logo URL only when the provider supplies one AND permits reuse. RemoteOK logos are omitted (trademark). */
  logo?: string | null;
  location: string;
  /** True when the source explicitly marks the role remote-eligible. */
  remote: boolean;
  /** Human-readable eligibility, e.g. "Worldwide" / "US only". Never claim worldwide unless source confirms. */
  remoteEligibility?: string;
  employmentType?: string;
  experienceLevel?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  /** Pre-formatted salary string for display (handles missing parts safely). */
  salaryText?: string;
  skills: string[];
  tags: string[];
  category?: string;
  /** Sanitized-at-render HTML from the provider. Stored as-is, rendered via SafeHtml. */
  descriptionHtml: string;
  excerpt?: string;
  /** ISO date string. */
  postedAt: string;
  /** REAL external application URL returned by the provider. Never fabricated. */
  applyUrl: string;
  /** Internal detail route, e.g. /jobs/jobicy/155139 */
  detailUrl: string;
  sourceName: string;
  /** Canonical provider listing URL (== applyUrl for most providers). */
  sourceUrl: string;
}

export interface SourceError {
  source: SourceName;
  message: string;
}

export interface AggregatedResult {
  jobs: Job[];
  total: number;
  errors: SourceError[];
  /** Per-source counts after normalization + dedup. */
  counts: Record<SourceName, number>;
}

export const SOURCE_META: Record<
  SourceName,
  { label: string; siteUrl: string; attribution: string }
> = {
  jobicy: {
    label: "Jobicy",
    siteUrl: "https://jobicy.com",
    attribution: "Jobs via Jobicy",
  },
  himalayas: {
    label: "Himalayas",
    siteUrl: "https://himalayas.app",
    attribution: "Jobs via Himalayas",
  },
  arbeitnow: {
    label: "Arbeitnow",
    siteUrl: "https://www.arbeitnow.com",
    attribution: "Jobs via Arbeitnow",
  },
  remoteok: {
    label: "Remote OK",
    siteUrl: "https://remoteok.com",
    attribution: "Jobs via Remote OK",
  },
  wwr: {
    label: "We Work Remotely",
    siteUrl: "https://weworkremotely.com",
    attribution: "Jobs via We Work Remotely",
  },
  remotive: {
    label: "Remotive",
    siteUrl: "https://remotive.com",
    attribution: "Jobs via Remotive",
  },
  jobspresso: {
    label: "Jobspresso",
    siteUrl: "https://jobspresso.co",
    attribution: "Jobs via Jobspresso",
  },
  remoteco: {
    label: "Remote.co",
    siteUrl: "https://remote.co",
    attribution: "Jobs via Remote.co",
  },
  remotefirst: {
    label: "Remote First",
    siteUrl: "https://remotefirstjobs.com",
    attribution: "Jobs via Remote First Jobs",
  },
  startupjobs: {
    label: "Startup Jobs",
    siteUrl: "https://startup.jobs",
    attribution: "Jobs via Startup Jobs",
  },
};

export function makeJobId(source: SourceName, sourceId: string): string {
  return `${source}:${sourceId}`;
}

/** Dedup key — source + provider id. */
export function dedupKey(job: Pick<Job, "source" | "sourceId">): string {
  return `${job.source}::${job.sourceId}`;
}
