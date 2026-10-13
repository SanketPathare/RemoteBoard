"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Headset,
  HeartPulse,
  Layers,
  Megaphone,
  Palette,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import type { CategorySummary } from "@/lib/categories";
import { CustomSelect } from "./CustomSelect";

const PAGE_SIZE = 24;

const CLUSTER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Engineering: Code2,
  Design: Palette,
  Product: Layers,
  "Data & AI": Cpu,
  "Sales & BD": TrendingUp,
  Marketing: Megaphone,
  Support: Headset,
  Operations: Briefcase,
  "People & HR": Users,
  "Finance & Legal": Briefcase,
  Healthcare: HeartPulse,
};

export function CategoriesExplorer({
  initialCategories,
}: {
  initialCategories: CategorySummary[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("all");
  const [sortBy, setSortBy] = useState<"jobs" | "alpha" | "companies">("jobs");
  const [page, setPage] = useState(1);

  // Derive unique clusters
  const clusters = useMemo(() => {
    const set = new Set<string>();
    initialCategories.forEach((c) => set.add(c.cluster));
    return ["all", ...Array.from(set)];
  }, [initialCategories]);

  // Filter & sort
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = initialCategories.filter((c) => {
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.cluster.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        c.topCompanies.some((comp) => comp.toLowerCase().includes(q));

      const matchCluster =
        selectedCluster === "all" ||
        c.cluster.toLowerCase() === selectedCluster.toLowerCase();

      return matchQuery && matchCluster;
    });

    if (sortBy === "alpha") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "companies") {
      result = [...result].sort((a, b) => b.companiesCount - a.companiesCount);
    } else {
      result = [...result].sort((a, b) => b.jobCount - a.jobCount);
    }

    return result;
  }, [initialCategories, query, selectedCluster, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageCategories = useMemo(
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
              placeholder="Search categories by name, skill, or hiring company..."
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
              id="category-sort"
              title="Sort Categories"
              value={sortBy}
              onChange={(val) => {
                setSortBy(val as "jobs" | "alpha" | "companies");
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

        {/* Cluster Filter Tabs */}
        <div className="custom-scrollbar-x -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-1 pt-1">
          {clusters.map((cl) => {
            const isSelected = selectedCluster === cl;
            const IconComponent = CLUSTER_ICONS[cl] || Briefcase;
            return (
              <button
                key={cl}
                type="button"
                onClick={() => {
                  setSelectedCluster(cl);
                  setPage(1);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-neutral-900 text-white font-semibold shadow-sm dark:bg-white dark:text-black"
                    : "border border-neutral-200 bg-neutral-100 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-[#262626] dark:bg-[#111] dark:text-[#a3a3a3] dark:hover:border-[#404040] dark:hover:text-white"
                }`}
              >
                {cl !== "all" && <IconComponent className="h-3 w-3" />}
                <span className="capitalize">{cl === "all" ? "All Disciplines" : cl}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results Bar ── */}
      <div className="flex items-center justify-between px-1">
        <p className="font-mono text-xs text-neutral-500 dark:text-[#888]">
          Showing <span className="font-medium text-neutral-900 dark:text-white">{from}</span>–
          <span className="font-medium text-neutral-900 dark:text-white">{to}</span> of{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">{filtered.length}</span> categories
        </p>
        <span className="font-mono text-xs text-neutral-500 dark:text-[#737373]">
          Page {safePage} of {totalPages}
        </span>
      </div>

      {/* ── Category Cards Grid ── */}
      {pageCategories.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageCategories.map((c) => {
            const IconComp = CLUSTER_ICONS[c.cluster] || Briefcase;
            return (
              <li key={c.slug} className="flex min-w-0">
                <Link
                  href={`/jobs?category=${encodeURIComponent(c.name)}`}
                  className="feature-card glass-card card-sheen group relative flex w-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-neutral-900 hover:bg-neutral-50/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:border-[#262626] dark:bg-[#0c0c0c] dark:hover:border-white dark:hover:bg-[#121212] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                >
                  <div>
                    {/* Header: Cluster Icon + Job Count */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 transition group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white dark:border-[#333] dark:bg-[#161616] dark:text-white dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-neutral-800 transition group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black">
                        {c.jobCount} {c.jobCount === 1 ? "role" : "roles"}
                      </span>
                    </div>

                    {/* Category Title */}
                    <h3 className="headline mt-4 truncate text-base font-bold tracking-tight text-neutral-900 group-hover:text-neutral-900 dark:text-white dark:group-hover:text-white">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-[#737373]">{c.cluster}</p>

                    {/* Hiring Employers */}
                    {c.topCompanies.length > 0 && (
                      <div className="mt-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-[#666]">
                          Hiring Employers
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {c.topCompanies.slice(0, 3).map((comp) => (
                            <span
                              key={comp}
                              className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] text-neutral-700 dark:border-[#222] dark:bg-[#141414] dark:text-[#a3a3a3]"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sample Skills */}
                    {c.skills.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-[#161616] dark:text-[#888]"
                          >
                            #{skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-3 text-xs font-medium text-neutral-600 transition group-hover:text-neutral-900 dark:border-[#1f1f1f] dark:text-[#a3a3a3] dark:group-hover:text-white">
                    <span>Explore {c.jobCount} {c.jobCount === 1 ? "job" : "jobs"}</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        /* Empty State */
        <div className="glass-card card-sheen rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-[#262626] dark:bg-transparent">
          <p className="font-mono text-xs text-neutral-500 dark:text-[#888]">$ 0 categories found</p>
          <h3 className="headline mt-2 text-lg font-bold text-neutral-900 dark:text-white">
            No categories match your search
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-neutral-600 dark:text-[#a3a3a3]">
            Try adjusting your search keywords or switch the discipline filter tab above.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCluster("all");
              setPage(1);
            }}
            className="mt-5 inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-900 shadow-sm hover:border-neutral-900 dark:border-[#404040] dark:bg-[#141414] dark:text-white dark:hover:border-white"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-[#1f1f1f]">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#d4d4d4] dark:hover:border-[#404040] dark:hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          <span className="font-mono text-xs text-neutral-500 dark:text-[#888]">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-[#d4d4d4] dark:hover:border-[#404040] dark:hover:text-white"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
