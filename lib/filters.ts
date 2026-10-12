import type { Job } from "./types";

export interface JobFilters {
  query: string;
  remoteOnly: boolean;
  location: string;
  country: string;
  category: string;
  employmentType: string;
  salaryOnly: boolean;
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

  return jobs.filter((j) => {
    if (f.source !== "all" && j.source !== f.source) return false;
    if (f.remoteOnly && !j.remote) return false;
    if (f.salaryOnly && !(j.salaryMin || j.salaryMax)) return false;
    if (emp && norm(j.employmentType || "") !== emp) return false;
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

export function sortNewestFirst(jobs: Job[]): Job[] {
  return [...jobs].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
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
