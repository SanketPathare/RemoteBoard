import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Clock,
  MapPin,
} from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { getCompanyBySlug, groupJobsByCompany } from "@/lib/companies";
import { CompanyLogo } from "@/components/CompanyLogo";
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
  const company = getCompanyBySlug(jobs, slug);

  if (!company) {
    return {
      title: "Company Not Found | RemoteBoard",
      description: "No active remote jobs found for this company.",
    };
  }

  const categoryText = company.categories.length > 0 ? ` in ${company.categories.join(", ")}` : "";
  return {
    title: `${company.name} Remote Jobs (${company.openJobsCount} Open Roles) | RemoteBoard`,
    description: `Explore ${company.openJobsCount} remote job openings at ${company.name}${categoryText}. Apply directly to official job listings.`,
    openGraph: {
      title: `${company.name} Remote Jobs (${company.openJobsCount} Open Roles)`,
      description: `Browse live remote vacancies at ${company.name} on RemoteBoard.`,
    },
  };
}

export default async function CompanySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { jobs } = await aggregateJobs();
  const company = getCompanyBySlug(jobs, slug);

  if (!company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="font-mono text-xs text-[#999999]">$ 404 / company not found</p>
        <h1 className="headline mt-3 text-3xl font-extrabold text-white">
          Company Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#a3a3a3]">
          This company currently doesn&apos;t have any live remote postings or the listings have expired.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/companies"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4d4d4]"
          >
            <Building2 className="h-4 w-4" />
            Browse all companies
          </Link>
          <Link
            href="/jobs"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#404040] bg-[#111] px-5 py-2.5 text-sm font-medium text-white transition hover:border-[#737373]"
          >
            Browse all jobs
          </Link>
        </div>
      </div>
    );
  }

  // Derive other hiring companies to recommend
  const allCompanies = groupJobsByCompany(jobs);
  const otherCompanies = allCompanies
    .filter((c) => c.slug !== company.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      {/* ── Breadcrumb & Back Link ── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#a3a3a3] transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to companies</span>
        </Link>
        <span className="font-mono text-xs text-[#737373]">
          {company.openJobsCount} {company.openJobsCount === 1 ? "listing" : "listings"} active
        </span>
      </div>

      {/* ── Company Profile Hero Header ── */}
      <div className="glass-card card-sheen relative overflow-hidden rounded-2xl border border-[#262626] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
          {/* Company Logo */}
          <div className="relative shrink-0">
            <CompanyLogo name={company.name} logo={company.logo} size="xl" priority />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Actively Hiring Remote
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-white">
                {company.openJobsCount} {company.openJobsCount === 1 ? "Open Position" : "Open Positions"}
              </span>
            </div>

            <h1 className="headline mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {company.name}
            </h1>

            <p className="mt-2 text-sm text-[#a3a3a3]">
              Hiring remote professionals across distributed teams. View all open positions below and apply directly.
            </p>

            {company.slug === "hitachi" && (
              <div className="mt-4 flex flex-wrap items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-3.5">
                <span className="font-mono text-xs font-semibold text-white">Official Portals:</span>
                <a
                  href="https://careers.hitachi.com/jobs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#111] px-3 py-1.5 text-xs font-medium text-white transition hover:border-white hover:bg-[#1a1a1a]"
                >
                  <span>Hitachi Careers — all jobs</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#888]" />
                </a>
                <a
                  href="https://careers.hitachi.com/jobs?filter[country]=India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#111] px-3 py-1.5 text-xs font-medium text-white transition hover:border-white hover:bg-[#1a1a1a]"
                >
                  <span>Hitachi India jobs</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#888]" />
                </a>
              </div>
            )}

            {/* Quick badges & metadata */}
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[#1f1f1f] pt-4 sm:grid-cols-3">
              {/* Disciplines */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#737373]">
                  Hiring Disciplines
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {company.categories.length > 0 ? (
                    company.categories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border border-[#262626] bg-[#111] px-2 py-0.5 text-xs font-medium text-[#d4d4d4]"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#737373]">Engineering & Product</span>
                  )}
                </div>
              </div>

              {/* Locations */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#737373]">
                  Locations / Timezones
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-[#d4d4d4]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#888]" />
                  <span className="truncate">
                    {company.locations.length > 0
                      ? company.locations.join(", ")
                      : "Worldwide / Remote"}
                  </span>
                </div>
              </div>

              {/* Latest role posted */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#737373]">
                  Latest Role Posted
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#d4d4d4]">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#888]" />
                  <span>{timeAgo(company.latestPostedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Open Job Postings Section ── */}
      <section className="mt-10" aria-label={`Open positions at ${company.name}`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="headline text-xl font-bold text-white sm:text-2xl">
              Open Positions at {company.name}
            </h2>
            <p className="mt-1 text-xs text-[#737373]">
              Showing all verified live listings available for direct application
            </p>
          </div>
          <span className="hidden font-mono text-xs text-[#888] sm:inline">
            Sorted newest first
          </span>
        </div>

        <JobList jobs={company.jobs} />
      </section>

      {/* ── Explore More Companies ── */}
      {otherCompanies.length > 0 && (
        <section className="mt-16 border-t border-[#1f1f1f] pt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="headline text-lg font-bold text-white sm:text-xl">
                Other Companies Hiring Remotely
              </h3>
              <p className="text-xs text-[#737373]">
                Explore more remote teams with open positions
              </p>
            </div>
            <Link
              href="/companies"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white transition hover:underline"
            >
              View all companies <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherCompanies.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="feature-card glass-card card-sheen group flex flex-col justify-between rounded-xl border border-[#262626] p-4 transition hover:-translate-y-0.5 hover:border-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <CompanyLogo name={c.name} logo={c.logo} size="md" />
                    <span className="rounded-full border border-white/10 bg-[#161616] px-2 py-0.5 font-mono text-[11px] font-medium text-white">
                      {c.openJobsCount} {c.openJobsCount === 1 ? "role" : "roles"}
                    </span>
                  </div>
                  <h4 className="mt-3 truncate text-sm font-bold text-white group-hover:text-white">
                    {c.name}
                  </h4>
                  {c.categories.length > 0 && (
                    <p className="mt-1 truncate text-xs text-[#737373]">
                      {c.categories.slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#1f1f1f] pt-2 text-[11px] text-[#a3a3a3] group-hover:text-white">
                  <span>View jobs</span>
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
