"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Search,
} from "lucide-react";
import type { CountrySummary } from "@/lib/countries";
import { COUNTRY_REGIONS, type CountryRegion } from "@/lib/countries";
import { CustomSelect } from "./CustomSelect";
import { CountryFlag } from "./CountryFlag";

const PAGE_SIZE = 18;

interface CountriesExplorerProps {
  initialCountries: CountrySummary[];
}

export function CountriesExplorer({ initialCountries }: CountriesExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<CountryRegion>("All");
  const [sortBy, setSortBy] = useState<"jobs" | "companies" | "alpha">("jobs");
  const [page, setPage] = useState(1);

  // Filter & search logic
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = initialCountries.filter((c) => {
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.companies.some((comp) => comp.toLowerCase().includes(q));

      const matchRegion =
        selectedRegion === "All" || c.region === selectedRegion;

      return matchQuery && matchRegion;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "jobs") return b.jobCount - a.jobCount;
      if (sortBy === "companies") return b.companiesCount - a.companiesCount;
      if (sortBy === "alpha") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [initialCountries, query, selectedRegion, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const safePage = Math.min(page, totalPages);
  const pagedCountries = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  // Compute region counts
  const regionCounts = useMemo(() => {
    const map: Record<string, number> = { All: initialCountries.length };
    for (const c of initialCountries) {
      map[c.region] = (map[c.region] || 0) + 1;
    }
    return map;
  }, [initialCountries]);

  return (
    <div className="space-y-6">
      {/* ── Filter & Search Toolbar ── */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-[#737373]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by country, city, or company..."
              className="h-11 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-10 text-xs font-medium text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900 dark:border-[#333] dark:bg-[#111] dark:text-white dark:placeholder-[#666] dark:focus:border-white dark:focus:ring-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-900 dark:text-[#888] dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector using CustomSelect */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden font-mono text-xs text-neutral-500 sm:inline dark:text-[#888]">
              Sort:
            </span>
            <CustomSelect
              id="country-sort"
              title="Sort Countries"
              value={sortBy}
              onChange={(val) => {
                setSortBy(val as "jobs" | "companies" | "alpha");
                setPage(1);
              }}
              options={[
                { value: "jobs", label: "Most Open Jobs" },
                { value: "companies", label: "Most Employers" },
                { value: "alpha", label: "Alphabetical (A–Z)" },
              ]}
            />
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="custom-scrollbar-x -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-1 pt-1">
          {COUNTRY_REGIONS.map((region) => {
            const isSelected = selectedRegion === region;
            const count = regionCounts[region] || 0;

            return (
              <button
                key={region}
                type="button"
                onClick={() => {
                  setSelectedRegion(region);
                  setPage(1);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-neutral-900 text-white font-semibold shadow-sm dark:bg-white dark:text-black"
                    : "border border-neutral-200 bg-neutral-100 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#a3a3a3] dark:hover:border-[#444] dark:hover:text-white"
                }`}
              >
                <span>{region}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                    isSelected
                      ? "bg-white/20 text-white font-bold dark:bg-black/15 dark:text-black"
                      : "bg-neutral-200 text-neutral-700 dark:bg-[#1f1f1f] dark:text-[#888]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Countries Grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-[#262626] dark:bg-transparent">
          <Globe2 className="mx-auto h-8 w-8 text-neutral-400 dark:text-[#555]" />
          <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">No countries found</h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-[#888]">
            Try adjusting your search query or switching regions.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedRegion("All");
            }}
            className="mt-4 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-900 shadow-sm transition hover:border-neutral-900 dark:border-[#333] dark:bg-[#141414] dark:text-white dark:hover:border-[#555]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagedCountries.map((country) => (
            <Link
              key={country.slug}
              href={`/countries/${country.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:border-[#222] dark:bg-[#0c0c0c] dark:hover:border-[#444] dark:hover:bg-[#141414] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* Header: Flag, Name, Region Badge & Arrow */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 shadow-inner transition-transform duration-200 group-hover:scale-105 dark:border-[#262626] dark:bg-[#141414]">
                      <CountryFlag code={country.code} slug={country.slug} size="lg" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-900 dark:text-white dark:group-hover:text-white">
                        {country.name}
                      </h2>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
                          {country.region}
                        </span>
                        <span className="text-neutral-300 dark:text-[#404040]">·</span>
                        <span className="font-mono text-[10px] text-neutral-500 dark:text-[#737373]">
                          {country.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors group-hover:text-neutral-900 dark:text-[#666] dark:group-hover:text-white">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Description snippet */}
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-600 dark:text-[#888]">
                  {country.description}
                </p>
              </div>

              {/* Bottom Footer: Stats & Top Companies */}
              <div className="mt-5 border-t border-neutral-200 pt-3.5 dark:border-[#1a1a1a]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-900 dark:text-white">
                    <span>{country.jobCount} open roles</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-500 dark:text-[#737373]">
                    <Building2 className="h-3 w-3" />
                    <span>{country.companiesCount} employers</span>
                  </div>
                </div>

                {/* Top hiring company tags */}
                {country.companies.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {country.companies.slice(0, 3).map((comp) => (
                      <span
                        key={comp}
                        className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-700 transition group-hover:border-neutral-400 dark:border-transparent dark:bg-[#161616] dark:text-[#a3a3a3] dark:group-hover:border-[#333]"
                      >
                        {comp}
                      </span>
                    ))}
                    {country.companies.length > 3 && (
                      <span className="self-center font-mono text-[10px] text-neutral-400 dark:text-[#555]">
                        +{country.companiesCount - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-[#222]">
          <p className="font-mono text-xs text-neutral-500 dark:text-[#737373]">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            countries
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-700 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#333] dark:bg-[#111] dark:text-white dark:hover:border-[#555]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-700 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#333] dark:bg-[#111] dark:text-white dark:hover:border-[#555]"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
