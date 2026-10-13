"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, ChevronLeft, ChevronRight, MapPin, Search } from "lucide-react";
import type { CompanySummary } from "@/lib/companies";
import { CompanyLogo } from "./CompanyLogo";
import { CustomSelect } from "./CustomSelect";

const PAGE_SIZE = 24;

export function CompaniesExplorer({ initialCompanies }: { initialCompanies: CompanySummary[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"roles" | "alpha" | "recent">("roles");
  const [page, setPage] = useState(1);

  // Derive unique categories across companies
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    initialCompanies.forEach((c) => c.categories.forEach((cat) => set.add(cat)));
    return Array.from(set).slice(0, 10);
  }, [initialCompanies]);

  // Filter & sort
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = initialCompanies.filter((c) => {
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q)) ||
        c.locations.some((loc) => loc.toLowerCase().includes(q));

      const matchCat =
        selectedCategory === "all" ||
        c.categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase());

      return matchQuery && matchCat;
    });

    if (sortBy === "alpha") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recent") {
      result = [...result].sort((a, b) => +new Date(b.latestPostedAt) - +new Date(a.latestPostedAt));
    } else {
      result = [...result].sort((a, b) => b.openJobsCount - a.openJobsCount);
    }

    return result;
  }, [initialCompanies, query, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageCompanies = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-6">
      {/* ── Search & Filter Controls ── */}
      <div className="glass-card card-sheen space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 dark:border-[#262626] dark:bg-transparent">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search bar */}
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-[#737373]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search companies by name, skill, or role..."
              className="h-11 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900 dark:border-[#333] dark:bg-[#111] dark:text-white dark:placeholder-[#666] dark:focus:border-white dark:focus:ring-white"
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

          {/* Sort Selector */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden font-mono text-xs text-neutral-500 sm:inline dark:text-[#888]">
              Sort:
            </span>
            <CustomSelect
              id="company-sort"
              title="Sort Companies"
              value={sortBy}
              onChange={(val) => {
                setSortBy(val as "roles" | "alpha" | "recent");
                setPage(1);
              }}
              options={[
                { value: "roles", label: "Most open positions" },
                { value: "recent", label: "Recently active" },
                { value: "alpha", label: "Alphabetical (A–Z)" },
              ]}
            />
          </div>
        </div>

        {/* Category quick-filter chips */}
        {allCategories.length > 0 && (
          <div className="custom-scrollbar-x -mx-2 flex gap-1.5 overflow-x-auto px-2 pt-1 pb-1">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === "all"
                  ? "bg-neutral-900 text-white font-semibold dark:bg-white dark:text-black"
                  : "border border-neutral-200 bg-neutral-100 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-[#2a2a2a] dark:bg-[#111] dark:text-[#a3a3a3] dark:hover:border-[#444] dark:hover:text-white"
              }`}
            >
              All disciplines
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-neutral-900 text-white font-semibold dark:bg-white dark:text-black"
                    : "border border-neutral-200 bg-neutral-100 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-[#2a2a2a] dark:bg-[#111] dark:text-[#a3a3a3] dark:hover:border-[#444] dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Summary & Count ── */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-[#1f1f1f]">
        <p className="font-mono text-xs text-neutral-600 dark:text-[#a3a3a3]">
          <span className="font-semibold text-neutral-900 dark:text-white">{filtered.length}</span> hiring companies found
          {filtered.length > 0 && ` (${from}–${to})`}
        </p>
        {totalPages > 1 && (
          <p className="font-mono text-xs text-neutral-500 dark:text-[#737373]">
            Page <span className="text-neutral-900 dark:text-white">{safePage}</span> of {totalPages}
          </p>
        )}
      </div>

      {/* ── Company Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center dark:border-[#262626] dark:bg-[#0c0c0c]">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-neutral-400 dark:text-[#404040]" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">No companies match your search</h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-[#737373]">Try searching for a different keyword or reset filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-900 shadow-sm hover:border-neutral-900 dark:border-[#404040] dark:bg-[#141414] dark:text-white dark:hover:border-white"
          >
            Reset search
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageCompanies.map((c) => (
            <li key={c.slug} className="flex min-w-0">
              <Link
                href={`/companies/${c.slug}`}
                className="feature-card glass-card card-sheen group relative flex w-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:border-[#262626] dark:bg-transparent dark:hover:border-white dark:hover:shadow-lg"
              >
                <div>
                  {/* Header: Logo + Roles count badge */}
                  <div className="flex items-start justify-between gap-3">
                    <CompanyLogo name={c.name} logo={c.logo} size="lg" />
                    <span className="inline-flex shrink-0 items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-neutral-800 dark:border-white/20 dark:bg-white/10 dark:text-white">
                      {c.openJobsCount} {c.openJobsCount === 1 ? "role" : "roles"}
                    </span>
                  </div>

                  {/* Company name */}
                  <h3 className="mt-4 text-base font-bold tracking-tight text-neutral-900 transition group-hover:text-neutral-900 dark:text-white dark:group-hover:text-white">
                    {c.name}
                  </h3>

                  {/* Categories */}
                  {c.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {c.categories.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:border-[#262626] dark:bg-[#111] dark:text-[#a3a3a3]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Locations */}
                  {c.locations.length > 0 && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-[#737373]">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{c.locations.join(", ")}</span>
                    </p>
                  )}
                </div>

                {/* Footer Link */}
                <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-3 text-xs font-medium text-neutral-600 transition group-hover:text-neutral-900 dark:border-[#1f1f1f] dark:text-[#a3a3a3] dark:group-hover:text-white">
                  <span>View open jobs</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 pb-12">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 font-mono text-xs text-neutral-700 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#333] dark:bg-[#111] dark:text-[#a3a3a3] dark:hover:border-white dark:hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <span className="font-mono text-xs text-neutral-500 px-2 dark:text-[#737373]">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 font-mono text-xs text-neutral-700 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#333] dark:bg-[#111] dark:text-[#a3a3a3] dark:hover:border-white dark:hover:text-white"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
