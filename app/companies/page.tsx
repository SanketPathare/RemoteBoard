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
        <p className="font-mono text-xs text-[#999999]">$ directory / companies</p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-black sm:text-4xl dark:text-white">
          Companies hiring remote
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#666666] dark:text-[#888888]">
          Explore top remote-first companies actively hiring worldwide. Search by company name,
          view their open engineering, design, marketing, and product positions, and apply directly.
        </p>

        {/* Quick stat chips */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-1.5 text-xs text-[#a3a3a3]">
            <Building2 className="h-3.5 w-3.5 text-white" />
            <span>
              <strong className="font-semibold text-white">{companies.length}</strong> hiring companies
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-1.5 text-xs text-[#a3a3a3]">
            <Users className="h-3.5 w-3.5 text-white" />
            <span>
              <strong className="font-semibold text-white">{totalRoles}</strong> live open positions
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-1.5 text-xs text-[#a3a3a3]">
            <Globe className="h-3.5 w-3.5 text-white" />
            <span>100% remote & distributed</span>
          </div>
        </div>
      </div>

      {/* Interactive Explorer */}
      <CompaniesExplorer initialCompanies={companies} />
    </div>
  );
}
