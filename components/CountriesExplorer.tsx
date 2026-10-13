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
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by country, city, or company..."
              className="h-11 w-full rounded-xl border border-[#333] bg-[#111] pl-10 pr-10 text-xs font-medium text-white placeholder-[#666] outline-none transition focus:border-white focus:ring-1 focus:ring-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector using CustomSelect */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden font-mono text-xs text-[#888] sm:inline">
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
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "border border-[#262626] bg-[#0d0d0d] text-[#a3a3a3] hover:border-[#444] hover:text-white"
                }`}
              >
                <span>{region}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                    isSelected
                      ? "bg-black/15 text-black font-bold"
                      : "bg-[#1f1f1f] text-[#888]"
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
        <div className="rounded-2xl border border-dashed border-[#262626] p-12 text-center">
          <Globe2 className="mx-auto h-8 w-8 text-[#555]" />
          <h3 className="mt-3 text-sm font-semibold text-white">No countries found</h3>
          <p className="mt-1 text-xs text-[#888]">
            Try adjusting your search query or switching regions.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedRegion("All");
            }}
            className="mt-4 rounded-xl border border-[#333] bg-[#141414] px-4 py-2 text-xs font-medium text-white transition hover:border-[#555]"
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
              className="group relative flex flex-col justify-between rounded-2xl border border-[#222] bg-[#0c0c0c] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#444] hover:bg-[#141414] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* Header: Flag, Name, Region Badge & Arrow */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#262626] bg-[#141414] shadow-inner transition-transform duration-200 group-hover:scale-105">
                      <CountryFlag code={country.code} slug={country.slug} size="lg" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-white transition-colors group-hover:text-white">
                        {country.name}
                      </h2>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#737373]">
                          {country.region}
                        </span>
                        <span className="text-[#404040]">·</span>
                        <span className="font-mono text-[10px] text-[#737373]">
                          {country.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#666] transition-colors group-hover:text-white">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Description snippet */}
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#888]">
                  {country.description}
                </p>
              </div>

              {/* Bottom Footer: Stats & Top Companies */}
              <div className="mt-5 border-t border-[#1a1a1a] pt-3.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-white">
                    <span>{country.jobCount} open roles</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#737373]">
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
                        className="rounded-md bg-[#161616] px-2 py-0.5 font-mono text-[10px] text-[#a3a3a3] group-hover:border group-hover:border-[#333]"
                      >
                        {comp}
                      </span>
                    ))}
                    {country.companies.length > 3 && (
                      <span className="font-mono text-[10px] text-[#555] self-center">
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
        <div className="flex items-center justify-between border-t border-[#222] pt-6">
          <p className="font-mono text-xs text-[#737373]">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            countries
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#333] bg-[#111] px-3 text-xs font-medium text-white transition hover:border-[#555] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-mono text-xs text-[#a3a3a3]">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#333] bg-[#111] px-3 text-xs font-medium text-white transition hover:border-[#555] disabled:cursor-not-allowed disabled:opacity-40"
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
