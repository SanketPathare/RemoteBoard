import type { AggregatedResult, Job, SourceError, SourceName } from "./types";
import { dedupKey } from "./types";
import { fetchJobicy } from "./sources/jobicy";
import { fetchHimalayas } from "./sources/himalayas";
import { fetchArbeitnow } from "./sources/arbeitnow";
import { fetchRemoteOk } from "./sources/remoteok";
import { fetchWwr } from "./sources/wwr";
import { fetchRemotive } from "./sources/remotive";
import { fetchJobspresso } from "./sources/jobspresso";
import { fetchRemoteco } from "./sources/remoteco";
import { fetchRemoteFirst } from "./sources/remotefirst";
import { fetchStartupJobs } from "./sources/startupjobs";
import { fetchRemoteLanders } from "./sources/remotelanders";
import { fetchTheMuse } from "./sources/themuse";
import { fetchWorkingNomads } from "./sources/workingnomads";
import { fetchHnHiring } from "./sources/hnhiring";
import { fetchHitachi } from "./sources/hitachi";

const FETCHERS: Record<SourceName, () => Promise<Job[]>> = {
  jobicy: fetchJobicy,
  himalayas: fetchHimalayas,
  arbeitnow: fetchArbeitnow,
  remoteok: fetchRemoteOk,
  wwr: fetchWwr,
  remotive: fetchRemotive,
  jobspresso: fetchJobspresso,
  remoteco: fetchRemoteco,
  remotefirst: fetchRemoteFirst,
  startupjobs: fetchStartupJobs,
  remotelanders: fetchRemoteLanders,
  themuse: fetchTheMuse,
  workingnomads: fetchWorkingNomads,
  hnhiring: fetchHnHiring,
  hitachi: fetchHitachi,
};

const ALL_SOURCES: SourceName[] = [
  "jobicy",
  "himalayas",
  "arbeitnow",
  "remoteok",
  "wwr",
  "remotive",
  "jobspresso",
  "remoteco",
  "remotefirst",
  "startupjobs",
  "remotelanders",
  "themuse",
  "workingnomads",
  "hnhiring",
  "hitachi",
];

/**
 * Stateless live aggregation. No DB, no cache writes — relies on Next.js
 * fetch `revalidate` + per-provider timeouts. One source failing never
 * blocks the others.
 */
export async function aggregateJobs(sources?: SourceName[]): Promise<AggregatedResult> {
  const wanted = sources && sources.length > 0 ? sources : ALL_SOURCES;
  const settled = await Promise.allSettled(wanted.map((s) => FETCHERS[s]()));

  const jobs: Job[] = [];
  const errors: SourceError[] = [];
  const counts: AggregatedResult["counts"] = {
    jobicy: 0,
    himalayas: 0,
    arbeitnow: 0,
    remoteok: 0,
    wwr: 0,
    remotive: 0,
    jobspresso: 0,
    remoteco: 0,
    remotefirst: 0,
    startupjobs: 0,
    remotelanders: 0,
    themuse: 0,
    workingnomads: 0,
    hnhiring: 0,
    hitachi: 0,
  };

  settled.forEach((s, i) => {
    const source = wanted[i];
    if (s.status === "fulfilled") {
      for (const j of s.value) {
        jobs.push(j);
        counts[source] += 1;
      }
    } else {
      const msg =
        s.reason instanceof Error ? s.reason.message : String(s.reason);
      errors.push({ source, message: msg });
    }
  });

  // Sort newest-first, then dedupe by source+sourceId (keep newest).
  jobs.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
  const seen = new Set<string>();
  const deduped = jobs.filter((j) => {
    const k = dedupKey(j);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return { jobs: deduped, total: deduped.length, errors, counts };
}

/** Stateless detail lookup — re-fetch live, find by composite key. */
export async function findJob(source: SourceName, sourceId: string): Promise<Job | null> {
  const decoded = decodeURIComponent(sourceId);
  const { jobs } = await aggregateJobs([source]);
  return (
    jobs.find((j) => j.sourceId === decoded || j.sourceId === sourceId) ?? null
  );
}

export function isSourceName(v: string): v is SourceName {
  return (ALL_SOURCES as string[]).includes(v);
}
