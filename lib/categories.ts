import type { Job } from "./types";

export interface CategorySummary {
  name: string;
  slug: string;
  cluster: string;
  jobCount: number;
  companiesCount: number;
  topCompanies: string[];
  skills: string[];
  remoteCount: number;
  latestPostedAt: string;
  jobs: Job[];
}

export function toCategorySlug(name: string): string {
  if (!name) return "category";
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "category"
  );
}

export function normalizeCategoryName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "General";
  // Capitalize nicely
  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getCategoryCluster(name: string): string {
  const n = name.toLowerCase();
  if (/engineer|developer|devops|full-stack|backend|frontend|software|code|platform|cloud|tech|programming|systems|infrastructure|qa\b|security/i.test(n)) {
    return "Engineering";
  }
  if (/design|ui|ux|creative|graphic|brand|product design|visual|art/i.test(n)) {
    return "Design";
  }
  if (/product|scrum|agile|project manager|owner|delivery/i.test(n)) {
    return "Product";
  }
  if (/data|ai\b|machine learning|analytics|bi\b|deep learning|scientist|algorithm/i.test(n)) {
    return "Data & AI";
  }
  if (/sales|gtm|account exec|business dev|bd\b|revenue|commercial|partnerships/i.test(n)) {
    return "Sales & BD";
  }
  if (/marketing|seo|growth|content|social|copywriting|campaign|pr\b/i.test(n)) {
    return "Marketing";
  }
  if (/support|customer|service|client|success|helpdesk/i.test(n)) {
    return "Support";
  }
  if (/finance|accounting|payroll|tax|legal|audit|compliance|fp&a|banking/i.test(n)) {
    return "Finance & Legal";
  }
  if (/hr\b|people|talent|recruit|people tech|human resources|workplace/i.test(n)) {
    return "People & HR";
  }
  if (/operation|admin|strategy|management|exec|executive|chief|office/i.test(n)) {
    return "Operations";
  }
  if (/health|clinical|medical|nurse|pharmacy|care/i.test(n)) {
    return "Healthcare";
  }
  return "General";
}

export function groupJobsByCategory(jobs: Job[]): CategorySummary[] {
  const map = new Map<string, { name: string; jobs: Job[] }>();

  for (const job of jobs) {
    const rawCat = job.category?.trim();
    if (!rawCat) continue;
    const normName = normalizeCategoryName(rawCat);
    const slug = toCategorySlug(normName);

    if (!map.has(slug)) {
      map.set(slug, { name: normName, jobs: [] });
    }
    map.get(slug)!.jobs.push(job);
  }

  const summaries: CategorySummary[] = [];

  for (const [slug, entry] of map.entries()) {
    const companiesSet = new Set<string>();
    const skillsSet = new Set<string>();
    let remoteCount = 0;

    for (const j of entry.jobs) {
      if (j.company) companiesSet.add(j.company);
      if (j.remote) remoteCount++;
      for (const s of j.skills || []) {
        if (s.toLowerCase() !== entry.name.toLowerCase()) skillsSet.add(s);
      }
    }

    entry.jobs.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));

    summaries.push({
      name: entry.name,
      slug,
      cluster: getCategoryCluster(entry.name),
      jobCount: entry.jobs.length,
      companiesCount: companiesSet.size,
      topCompanies: Array.from(companiesSet).slice(0, 4),
      skills: Array.from(skillsSet).slice(0, 6),
      remoteCount,
      latestPostedAt: entry.jobs[0]?.postedAt || new Date().toISOString(),
      jobs: entry.jobs,
    });
  }

  // Sort by most job openings first
  return summaries.sort((a, b) => b.jobCount - a.jobCount);
}

export function getCategoryBySlug(jobs: Job[], slug: string): CategorySummary | null {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();
  const all = groupJobsByCategory(jobs);
  return all.find((c) => c.slug === normalizedSlug) || null;
}
