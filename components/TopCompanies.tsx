import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import type { CompanySummary } from "@/lib/companies";
import { CompanyLogo } from "./CompanyLogo";

interface TopCompaniesProps {
  companies: CompanySummary[];
  totalCompaniesCount?: number;
}

export function TopCompanies({ companies, totalCompaniesCount }: TopCompaniesProps) {
  if (!companies || companies.length === 0) return null;

  const displayCount = totalCompaniesCount || companies.length;

  return (
    <section
      aria-labelledby="top-companies-heading"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      {/* ── Section Header ── */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">$ directory / top hiring</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Live Hiring
            </span>
          </div>
          <h2
            id="top-companies-heading"
            className="subhead mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white"
          >
            Top companies hiring remote
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-[#a3a3a3]">
            Leading remote-first teams and distributed companies with the most active open positions.
          </p>
        </div>

        <Link
          href="/companies"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
        >
          View all {displayCount} companies
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {/* ── Grid of Top Company Cards ── */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {companies.map((c) => (
          <li key={c.slug} className="flex min-w-0">
            <Link
              href={`/companies/${c.slug}`}
              className="feature-card glass-card card-sheen group relative flex w-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-lg dark:border-[#262626] dark:bg-[#0c0c0c] dark:hover:border-white dark:hover:bg-[#121212] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
            >
              <div>
                {/* Header: Logo + Roles badge */}
                <div className="flex items-start justify-between gap-3">
                  <CompanyLogo name={c.name} logo={c.logo} size="lg" />
                  <span className="inline-flex shrink-0 items-center rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-neutral-800 transition group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black">
                    {c.openJobsCount} {c.openJobsCount === 1 ? "role" : "roles"}
                  </span>
                </div>

                {/* Company Name */}
                <h3 className="mt-4 truncate text-base font-bold tracking-tight text-neutral-900 transition group-hover:text-neutral-900 dark:text-white dark:group-hover:text-white">
                  {c.name}
                </h3>

                {/* Categories / Disciplines */}
                {c.categories.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {c.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:border-[#262626] dark:bg-[#161616] dark:text-[#a3a3a3]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Locations */}
                {c.locations.length > 0 && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-[#737373]">
                    <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                    <span className="truncate">{c.locations.join(", ")}</span>
                  </p>
                )}
              </div>

              {/* Card Footer Link */}
              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-medium text-neutral-600 transition group-hover:text-neutral-900 dark:border-[#1f1f1f] dark:text-[#a3a3a3] dark:group-hover:text-white">
                <span>View open positions</span>
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Quick Discovery Strip ── */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3.5 sm:flex-row dark:border-[#222] dark:bg-[#080808]">
        <p className="font-mono text-xs text-neutral-600 dark:text-[#888]">
          Looking for a specific employer? Search over{" "}
          <strong className="text-neutral-900 font-semibold dark:text-white">{displayCount}</strong> remote companies worldwide.
        </p>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-900 transition hover:text-neutral-700 hover:underline dark:text-white dark:hover:text-[#d4d4d4]"
        >
          Explore Company Directory <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
