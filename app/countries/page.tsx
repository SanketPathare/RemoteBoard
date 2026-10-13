import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Briefcase, Sparkles } from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { groupJobsByCountry } from "@/lib/countries";
import { CountriesExplorer } from "@/components/CountriesExplorer";
import { CountryFlag } from "@/components/CountryFlag";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Remote Jobs by Country & Region | RemoteBoard",
  description:
    "Explore verified remote jobs categorized by country eligibility and regional time zones. Browse openings in the US, UK, Germany, India, Canada, and Worldwide.",
  openGraph: {
    title: "Remote Jobs by Country & Region | RemoteBoard",
    description:
      "Find location-flexible positions filtered by country eligibility, legal residence, and regional time zones.",
  },
};

export default async function CountriesPage() {
  const { jobs } = await aggregateJobs();
  const countries = groupJobsByCountry(jobs);
  const totalRoles = countries.reduce((acc, c) => acc + c.jobCount, 0);
  const topCountries = countries.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      {/* ── Hero Header ── */}
      <div className="mb-8 max-w-3xl">
        <p className="font-mono text-xs text-neutral-500 dark:text-[#999999]">$ directory / countries</p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl dark:text-white">
          Remote jobs by country
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-[#888888]">
          Find location-flexible positions categorized by country eligibility, tax residence, and time
          zone overlap. Discover roles open to your location across verified global employers.
        </p>

        {/* Quick stat chips */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#a3a3a3]">
            <Globe className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
            <span>
              <strong className="text-neutral-900 dark:text-white">{countries.length}</strong> countries hiring
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#a3a3a3]">
            <Briefcase className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
            <span>
              <strong className="text-neutral-900 dark:text-white">{totalRoles.toLocaleString()}</strong> country-matched roles
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#a3a3a3]">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% verified employer feeds</span>
          </div>
        </div>
      </div>

      {/* ── Top Countries Quick-Access Bar ── */}
      {topCountries.length > 0 && (
        <section aria-label="Top hiring countries" className="mb-10">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
            Top Remote Hiring Locations
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {topCountries.map((c) => (
              <Link
                key={c.slug}
                href={`/countries/${c.slug}`}
                className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:border-neutral-900 hover:bg-neutral-50/50 dark:border-[#262626] dark:bg-[#0d0d0d] dark:hover:border-[#444] dark:hover:bg-[#141414]"
              >
                <div className="flex items-center gap-2.5">
                  <CountryFlag code={c.code} slug={c.slug} size="sm" />
                  <span className="truncate text-xs font-semibold text-neutral-900 group-hover:text-neutral-900 dark:text-white dark:group-hover:text-white">
                    {c.name}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 dark:text-[#737373]">
                  <span>{c.jobCount} roles</span>
                  <span className="font-mono">{c.code}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Full Interactive Countries Directory ── */}
      <CountriesExplorer initialCountries={countries} />
    </div>
  );
}
