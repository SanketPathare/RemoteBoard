import type { Job } from "./types";

export interface JobFilters {
  query: string;
  remoteOnly: boolean;
  location: string;
  country: string;
  category: string;
  employmentType: string;
  salaryOnly: boolean;
  minSalary: number; // 0 = any, 50000, 100000, etc.
  programmingLanguage: string; // e.g. "python", "react"
  experienceLevel: string; // e.g. "junior", "senior"
  datePosted: string; // "all" | "24h" | "3d" | "7d" | "30d"
  source: string; // "all" | SourceName
}

export const EMPTY_FILTERS: JobFilters = {
  query: "",
  remoteOnly: false,
  location: "",
  country: "",
  category: "",
  employmentType: "",
  salaryOnly: false,
  minSalary: 0,
  programmingLanguage: "",
  experienceLevel: "",
  datePosted: "all",
  source: "all",
};

function norm(s: string): string {
  return s.toLowerCase().trim();
}

/** Pure client-side filtering — no refetch per keystroke. */
export function filterJobs(jobs: Job[], f: JobFilters): Job[] {
  const q = norm(f.query);
  const loc = norm(f.location);
  const country = norm(f.country);
  const cat = norm(f.category);
  const emp = norm(f.employmentType);
  const lang = norm(f.programmingLanguage);
  const exp = norm(f.experienceLevel);

  const now = Date.now();

  return jobs.filter((j) => {
    if (f.source !== "all" && j.source !== f.source) return false;
    if (f.remoteOnly && !j.remote) return false;
    if (f.salaryOnly && !(j.salaryMin || j.salaryMax)) return false;

    // Minimum salary threshold
    if (f.minSalary > 0) {
      const sMax = j.salaryMax ?? 0;
      const sMin = j.salaryMin ?? 0;
      if (sMax < f.minSalary && sMin < f.minSalary) return false;
    }

    if (emp && norm(j.employmentType || "") !== emp) return false;

    // Programming language / skill match
    if (lang) {
      const skillsHay = `${j.skills.join(" ")} ${j.tags.join(" ")} ${j.title}`.toLowerCase();
      if (!skillsHay.includes(lang)) return false;
    }

    // Experience / Education level match
    if (exp) {
      const expHay = `${j.experienceLevel || ""} ${j.title} ${j.tags.join(" ")}`.toLowerCase();
      if (exp === "junior" && !/junior|entry|intern|associate/i.test(expHay)) return false;
      if (exp === "mid" && !/mid|intermediate/i.test(expHay)) return false;
      if (exp === "senior" && !/senior|sr\b|lead|principal|staff/i.test(expHay)) return false;
      if (exp === "lead" && !/lead|manager|director|head|vp|chief/i.test(expHay)) return false;
    }

    // Date posted match
    if (f.datePosted && f.datePosted !== "all") {
      const pTime = new Date(j.postedAt).getTime();
      if (!Number.isNaN(pTime)) {
        const diffHours = (now - pTime) / (1000 * 60 * 60);
        if (f.datePosted === "24h" && diffHours > 24) return false;
        if (f.datePosted === "3d" && diffHours > 72) return false;
        if (f.datePosted === "7d" && diffHours > 168) return false;
        if (f.datePosted === "30d" && diffHours > 720) return false;
      }
    }

    if (cat) {
      const hay = `${j.category || ""} ${j.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(cat)) return false;
    }
    if (loc && !`${j.location} ${j.remoteEligibility || ""}`.toLowerCase().includes(loc))
      return false;
    if (country && !`${j.location} ${j.remoteEligibility || ""}`.toLowerCase().includes(country))
      return false;
    if (q) {
      const hay =
        `${j.title} ${j.company} ${j.skills.join(" ")} ${j.tags.join(" ")} ${j.category || ""}`.toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      for (const t of tokens) {
        if (!hay.includes(t)) return false;
      }
    }
    return true;
  });
}

/**
 * Fair multi-source & multi-company interleaving ("mix all sources and mix posts").
 * Prevents clustering by a single provider or employer while preserving
 * chronological recency tiers.
 */
export function mixJobs(jobs: Job[]): Job[] {
  if (jobs.length <= 1) return [...jobs];

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  // Split into 4 chronological tiers
  const tiers: Job[][] = [[], [], [], []];
  for (const job of jobs) {
    const t = new Date(job.postedAt).getTime();
    const diff = Number.isNaN(t) ? Infinity : now - t;
    if (diff <= 2 * DAY_MS) {
      tiers[0].push(job);
    } else if (diff <= 7 * DAY_MS) {
      tiers[1].push(job);
    } else if (diff <= 30 * DAY_MS) {
      tiers[2].push(job);
    } else {
      tiers[3].push(job);
    }
  }

  const mixedAll: Job[] = [];

  for (const tierJobs of tiers) {
    if (tierJobs.length === 0) continue;

    const sourceCount = new Set(tierJobs.map((j) => j.source)).size;

    if (sourceCount > 1) {
      // ── Multi-source mixing: Round-robin across sources while avoiding consecutive same-company posts ──
      const sourceMap = new Map<string, Job[]>();
      for (const job of tierJobs) {
        if (!sourceMap.has(job.source)) sourceMap.set(job.source, []);
        sourceMap.get(job.source)!.push(job);
      }

      for (const list of sourceMap.values()) {
        list.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
      }

      const sources = Array.from(sourceMap.keys());
      sources.sort(() => Math.random() - 0.5);

      let remaining = tierJobs.length;
      let lastCompany = mixedAll[mixedAll.length - 1]?.company || "";

      while (remaining > 0) {
        let progressed = false;

        for (const src of sources) {
          const bucket = sourceMap.get(src);
          if (!bucket || bucket.length === 0) continue;

          // Pick candidate that avoids repeating same company if possible
          let pickIdx = 0;
          if (bucket.length > 1 && bucket[0].company === lastCompany) {
            const altIdx = bucket.findIndex((j) => j.company !== lastCompany);
            if (altIdx !== -1) pickIdx = altIdx;
          }

          const [picked] = bucket.splice(pickIdx, 1);
          mixedAll.push(picked);
          lastCompany = picked.company;
          remaining--;
          progressed = true;
        }

        if (!progressed) break;
      }
    } else {
      // ── Single-source mixing: Interleave by company and category ──
      const compMap = new Map<string, Job[]>();
      for (const job of tierJobs) {
        const key = job.company || "Company";
        if (!compMap.has(key)) compMap.set(key, []);
        compMap.get(key)!.push(job);
      }

      for (const list of compMap.values()) {
        list.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
      }

      const companies = Array.from(compMap.keys());
      companies.sort(() => Math.random() - 0.5);

      let remaining = tierJobs.length;
      let lastCategory = "";

      while (remaining > 0) {
        let progressed = false;

        for (const comp of companies) {
          const bucket = compMap.get(comp);
          if (!bucket || bucket.length === 0) continue;

          let pickIdx = 0;
          if (bucket.length > 1 && bucket[0].category === lastCategory) {
            const altIdx = bucket.findIndex((j) => j.category !== lastCategory);
            if (altIdx !== -1) pickIdx = altIdx;
          }

          const [picked] = bucket.splice(pickIdx, 1);
          mixedAll.push(picked);
          lastCategory = picked.category || "";
          remaining--;
          progressed = true;
        }

        if (!progressed) break;
      }
    }
  }

  return mixedAll;
}

export function sortNewestFirst(jobs: Job[]): Job[] {
  return mixJobs(jobs);
}

/** Facet helpers for populating filter dropdowns from live data. */
export function facetValues(jobs: Job[], pick: (j: Job) => string | undefined): string[] {
  const set = new Map<string, string>();
  for (const j of jobs) {
    const v = (pick(j) || "").trim();
    if (v) set.set(v.toLowerCase(), v);
  }
  return [...set.values()].sort((a, b) => a.localeCompare(b)).slice(0, 60);
}
