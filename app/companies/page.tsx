import type { Metadata } from "next";
import { Building2, Globe, Users } from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { groupJobsByCompany } from "@/lib/companies";
import { CompaniesExplorer } from "@/components/CompaniesExplorer";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Companies Hiring Remote | RemoteBoard",
  description:
    "Explore top remote-first companies actively hiring worldwide. Search companies by industry, skill, location, and open positions.",
};

export default async function CompaniesPage() {
  const { jobs } = await aggregateJobs();
  const companies = groupJobsByCompany(jobs);
  const totalRoles = companies.reduce((acc, c) => acc + c.openJobsCount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      {/* Hero Header */}
      <div className="mb-8 max-w-3xl">
        <p className="font-mono text-xs text-neutral-500 dark:text-[#999999]">$ directory / companies</p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl dark:text-white">
          Companies hiring remote
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-[#888888]">
          Explore top remote-first companies actively hiring worldwide. Search by company name,
          view their open engineering, design, marketing, and product positions, and apply directly.
        </p>

        {/* Quick stat chips */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#a3a3a3]">
            <Building2 className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
            <span>
              <strong className="font-semibold text-neutral-900 dark:text-white">{companies.length}</strong> hiring companies
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#a3a3a3]">
            <Users className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
            <span>
              <strong className="font-semibold text-neutral-900 dark:text-white">{totalRoles}</strong> live open positions
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#a3a3a3]">
            <Globe className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
            <span>100% remote & distributed</span>
          </div>
        </div>
      </div>

      {/* ── Featured Employer Portal: Hitachi ── */}
      <section
        aria-label="Featured Employer Portals"
        className="glass-card card-sheen mb-10 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7 dark:border-[#262626] dark:bg-[#0c0c0c]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">$ spotlight / enterprise</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                Official Portals
              </span>
            </div>
            <h2 className="headline mt-2 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
              Hitachi Careers & Global Opportunities
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">
              Direct access to live openings across the Hitachi ecosystem — including Hitachi Energy,
              Hitachi Vantara, Hitachi Solutions, and Hitachi Rail. Browse all international roles or filter
              specifically for positions across India.
            </p>
          </div>

          {/* Action Portal Links */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <a
              href="https://careers.hitachi.com/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-between gap-3 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
            >
              <span>Hitachi Careers — all jobs</span>
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white dark:bg-black/10 dark:text-black">
                3,600+ roles ↗
              </span>
            </a>

            <a
              href="https://careers.hitachi.com/jobs?filter[country]=India"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 dark:border-[#333] dark:bg-[#141414] dark:text-white dark:hover:border-white dark:hover:bg-[#1f1f1f]"
            >
              <span>Hitachi India jobs</span>
              <span className="rounded-md border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-700 dark:border-white/20 dark:bg-white/10 dark:text-[#e5e5e5]">
                600+ roles ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Explorer */}
      <CompaniesExplorer initialCompanies={companies} />
    </div>
  );
}
