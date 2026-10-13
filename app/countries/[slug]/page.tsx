import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Sparkles,
} from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { getCountryBySlug, groupJobsByCountry } from "@/lib/countries";
import { JobList } from "@/components/JobList";
import { CountryFlag } from "@/components/CountryFlag";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { jobs } = await aggregateJobs();
  const country = getCountryBySlug(jobs, slug);

  if (!country) {
    return {
      title: "Country Not Found | RemoteBoard",
      description: "No active remote jobs found for this country location.",
    };
  }

  return {
    title: `Remote Jobs in ${country.name} (${country.jobCount} Roles) | RemoteBoard`,
    description: `Browse ${country.jobCount} open remote jobs in ${country.name} across ${country.companiesCount} hiring companies. Apply directly to official job listings.`,
    openGraph: {
      title: `Remote Jobs in ${country.name} (${country.jobCount} Roles)`,
      description: `Explore verified location-flexible openings for candidates in ${country.name}.`,
    },
  };
}

export default async function CountrySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { jobs } = await aggregateJobs();
  const country = getCountryBySlug(jobs, slug);

  if (!country) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="font-mono text-xs text-neutral-500 dark:text-[#999999]">$ 404 / country not found</p>
        <h1 className="headline mt-3 text-3xl font-extrabold text-neutral-900 dark:text-white">
          Location Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">
          This country currently doesn&apos;t have any active listings matching its keyword filters,
          or the postings have expired.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/countries"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
          >
            <Globe className="h-4 w-4" />
            Browse all countries
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

  // Derive other countries in the same region
  const allCountries = groupJobsByCountry(jobs);
  const relatedCountries = allCountries
    .filter((c) => c.slug !== country.slug && c.region === country.region)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      {/* ── Breadcrumb & Back Link ── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/countries"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-[#a3a3a3] dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to all countries</span>
        </Link>
        <span className="font-mono text-xs text-neutral-500 dark:text-[#737373]">
          {country.jobCount} {country.jobCount === 1 ? "role" : "roles"} active
        </span>
      </div>

      {/* ── Country Hero Header ── */}
      <div className="glass-card card-sheen relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-[#262626] dark:bg-transparent">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
          {/* Big Real SVG Flag Display */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 shadow-inner dark:border-[#333] dark:bg-[#141414]">
            <CountryFlag code={country.code} slug={country.slug} size="xl" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-neutral-800 dark:border-white/20 dark:bg-white/10 dark:text-white">
                {country.region}
              </span>
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-xs text-neutral-600 dark:border-[#333] dark:bg-[#111] dark:text-[#a3a3a3]">
                Currency: {country.currency}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                {country.jobCount} Live Open Roles
              </span>
            </div>

            <h1 className="headline mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white">
              Remote Jobs in {country.name}
            </h1>

            <p className="mt-2 text-sm text-neutral-600 dark:text-[#a3a3a3]">
              {country.description}
            </p>

            {/* Quick stats & metadata */}
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-neutral-200 pt-4 dark:border-[#1f1f1f] sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
                  Hiring Employers
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-700 dark:text-[#d4d4d4]">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-[#888]" />
                  <span className="truncate">
                    {country.companies.slice(0, 4).join(", ") || `${country.companiesCount} companies`}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
                  Location Constraints
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-700 dark:text-[#d4d4d4]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-[#888]" />
                  <span>
                    {country.slug === "worldwide" ? "Anywhere in the World" : `${country.name} / ${country.region}`}
                  </span>
                </div>
              </div>

              {country.averageSalary && (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
                    Reported Base Pay
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>Avg ~${(country.averageSalary / 1000).toFixed(0)}k/year</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Job Listings & Sidebar ── */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Jobs Column */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Open Positions in {country.name}
            </h2>
            <span className="font-mono text-xs text-neutral-500 dark:text-[#737373]">
              Showing {country.jobs.length} jobs
            </span>
          </div>

          <JobList jobs={country.jobs} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Top Hiring Companies in this country */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#0c0c0c]">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#888]">
              Top Employers Hiring in {country.name}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {country.companies.map((comp) => (
                <Link
                  key={comp}
                  href={`/jobs?q=${encodeURIComponent(comp)}`}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-[#2a2a2a] dark:bg-[#141414] dark:text-[#d4d4d4] dark:hover:border-[#444] dark:hover:text-white"
                >
                  {comp}
                </Link>
              ))}
            </div>
          </div>

          {/* Related Countries in Same Region */}
          {relatedCountries.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#0c0c0c]">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#888]">
                More in {country.region}
              </h3>
              <div className="mt-3 divide-y divide-neutral-200 dark:divide-[#1a1a1a]">
                {relatedCountries.map((rc) => (
                  <Link
                    key={rc.slug}
                    href={`/countries/${rc.slug}`}
                    className="flex items-center justify-between py-2.5 text-xs text-neutral-600 transition hover:text-neutral-900 dark:text-[#a3a3a3] dark:hover:text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <CountryFlag code={rc.code} slug={rc.slug} size="sm" />
                      <span className="font-medium text-neutral-900 dark:text-white">{rc.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-500 dark:text-[#737373]">
                      {rc.jobCount} roles
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-xs leading-5 text-neutral-600 dark:border-[#262626] dark:bg-[#080808] dark:text-[#888]">
            <p className="font-semibold text-neutral-900 dark:text-white">Remote Eligibility Note</p>
            <p className="mt-1">
              Employers may require legal residency or work authorization in {country.name} even for
              fully remote positions due to payroll, tax, and labor regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
