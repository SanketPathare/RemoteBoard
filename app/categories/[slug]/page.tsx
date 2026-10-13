import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  Layers,
} from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { getCategoryBySlug, groupJobsByCategory } from "@/lib/categories";
import { JobList } from "@/components/JobList";
import { timeAgo } from "@/lib/format";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { jobs } = await aggregateJobs();
  const category = getCategoryBySlug(jobs, slug);

  if (!category) {
    return {
      title: "Category Not Found | RemoteBoard",
      description: "No active remote jobs found for this category.",
    };
  }

  return {
    title: `${category.name} Remote Jobs (${category.jobCount} Roles) | RemoteBoard`,
    description: `Browse ${category.jobCount} open remote ${category.name} jobs across ${category.companiesCount} verified hiring employers on RemoteBoard.`,
    openGraph: {
      title: `${category.name} Remote Jobs (${category.jobCount} Roles)`,
      description: `Explore live ${category.name} job openings on RemoteBoard.`,
    },
  };
}

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { jobs } = await aggregateJobs();
  const category = getCategoryBySlug(jobs, slug);

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="font-mono text-xs text-neutral-500 dark:text-[#999999]">$ 404 / category not found</p>
        <h1 className="headline mt-3 text-3xl font-extrabold text-neutral-900 dark:text-white">
          Category Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">
          This category currently doesn&apos;t have any active listings or the postings have expired.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/categories"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
          >
            <Layers className="h-4 w-4" />
            Browse all categories
          </Link>
          <Link
            href="/jobs"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 dark:border-[#404040] dark:bg-[#111] dark:text-white dark:hover:border-[#737373]"
          >
            Browse all jobs
          </Link>
        </div>
      </div>
    );
  }

  // Derive other categories in same cluster
  const allCategories = groupJobsByCategory(jobs);
  const relatedCategories = allCategories
    .filter((c) => c.slug !== category.slug && c.cluster === category.cluster)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      {/* ── Breadcrumb & Back Link ── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-[#a3a3a3] dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to all categories</span>
        </Link>
        <span className="font-mono text-xs text-neutral-500 dark:text-[#737373]">
          {category.jobCount} {category.jobCount === 1 ? "role" : "roles"} active
        </span>
      </div>

      {/* ── Category Hero Header ── */}
      <div className="glass-card card-sheen relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-[#262626] dark:bg-transparent">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-[#333] dark:bg-[#141414] dark:text-white">
            <Layers className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-neutral-800 dark:border-white/20 dark:bg-white/10 dark:text-white">
                {category.cluster}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                {category.jobCount} Live Open Roles
              </span>
            </div>

            <h1 className="headline mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white">
              {category.name} Remote Jobs
            </h1>

            <p className="mt-2 text-sm text-neutral-600 dark:text-[#a3a3a3]">
              Explore verified open positions in {category.name} across {category.companiesCount} hiring
              companies. Apply directly to official job listings.
            </p>

            {/* Quick stats & metadata */}
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-neutral-200 pt-4 dark:border-[#1f1f1f] sm:grid-cols-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
                  Hiring Employers
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-700 dark:text-[#d4d4d4]">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-[#888]" />
                  <span className="truncate">
                    {category.topCompanies.join(", ") || `${category.companiesCount} companies`}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
                  Common Skills
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {category.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[11px] text-neutral-700 dark:border-[#262626] dark:bg-[#111] dark:text-[#a3a3a3]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
                  Latest Position Posted
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-700 dark:text-[#d4d4d4]">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-[#888]" />
                  <span>{timeAgo(category.latestPostedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Open Job Postings Section ── */}
      <section className="mt-10" aria-label={`Open positions in ${category.name}`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="headline text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
              Open Positions in {category.name}
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-[#737373]">
              Showing all verified live roles available for direct application
            </p>
          </div>
          <Link
            href={`/jobs?category=${encodeURIComponent(category.name)}`}
            className="hidden font-mono text-xs text-neutral-900 hover:underline sm:inline dark:text-white"
          >
            Open in full search explorer &rarr;
          </Link>
        </div>

        <JobList jobs={category.jobs} />
      </section>

      {/* ── Related Categories ── */}
      {relatedCategories.length > 0 && (
        <section className="mt-16 border-t border-neutral-200 pt-10 dark:border-[#1f1f1f]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="headline text-lg font-bold text-neutral-900 sm:text-xl dark:text-white">
                Related {category.cluster} Categories
              </h3>
              <p className="text-xs text-neutral-500 dark:text-[#737373]">
                Explore related roles within this discipline
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 transition hover:underline dark:text-white"
            >
              View all categories <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="feature-card glass-card card-sheen group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:border-[#262626] dark:bg-transparent dark:hover:border-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-neutral-500 dark:text-[#888]">{c.cluster}</span>
                    <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-800 dark:border-white/10 dark:bg-[#161616] dark:text-white">
                      {c.jobCount} roles
                    </span>
                  </div>
                  <h4 className="mt-3 truncate text-sm font-bold text-neutral-900 group-hover:text-neutral-900 dark:text-white dark:group-hover:text-white">
                    {c.name}
                  </h4>
                  {c.topCompanies.length > 0 && (
                    <p className="mt-1 truncate text-xs text-neutral-500 dark:text-[#737373]">
                      {c.topCompanies.slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-2 text-[11px] text-neutral-600 group-hover:text-neutral-900 dark:border-[#1f1f1f] dark:text-[#a3a3a3] dark:group-hover:text-white">
                  <span>Browse jobs</span>
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
