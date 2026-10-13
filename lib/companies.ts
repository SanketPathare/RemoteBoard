import type { Job, SourceName } from "./types";

export interface CompanySummary {
  name: string;
  slug: string;
  logo: string | null;
  openJobsCount: number;
  categories: string[];
  locations: string[];
  latestPostedAt: string;
  jobs: Job[];
  sources: SourceName[];
}

export function toCompanySlug(name: string): string {
  if (!name) return "company";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "company";
}

export function groupJobsByCompany(jobs: Job[]): CompanySummary[] {
  const map = new Map<string, { name: string; jobs: Job[]; logo: string | null }>();

  for (const job of jobs) {
    const rawName = job.company?.trim() || "Unknown Company";
    const slug = toCompanySlug(rawName);

    if (!map.has(slug)) {
      map.set(slug, {
        name: rawName,
        jobs: [],
        logo: job.logo || null,
      });
    }

    const entry = map.get(slug)!;
    entry.jobs.push(job);
    if (!entry.logo && job.logo) {
      entry.logo = job.logo;
    }
  }

  const companies: CompanySummary[] = [];

  for (const [slug, data] of map.entries()) {
    const categoriesSet = new Set<string>();
    const locationsSet = new Set<string>();
    const sourcesSet = new Set<SourceName>();

    for (const j of data.jobs) {
      if (j.category) categoriesSet.add(j.category);
      if (j.location && j.location.toLowerCase() !== "not stated") locationsSet.add(j.location);
      sourcesSet.add(j.source);
    }

    // Sort jobs by newest first
    data.jobs.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));

    companies.push({
      name: data.name,
      slug,
      logo: data.logo,
      openJobsCount: data.jobs.length,
      categories: Array.from(categoriesSet).slice(0, 5),
      locations: Array.from(locationsSet).slice(0, 3),
      latestPostedAt: data.jobs[0]?.postedAt || new Date().toISOString(),
      jobs: data.jobs,
      sources: Array.from(sourcesSet),
    });
  }

  // Sort by most open roles first by default
  return companies.sort((a, b) => b.openJobsCount - a.openJobsCount);
}

export function getCompanyBySlug(jobs: Job[], slug: string): CompanySummary | null {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();
  const all = groupJobsByCompany(jobs);
  return all.find((c) => c.slug === normalizedSlug) || null;
}
