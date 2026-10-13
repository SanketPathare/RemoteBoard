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
      <div className="glass-card card-sheen space-y-4 rounded-2xl border border-[#262626] p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search bar */}
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search categories by name, skill, or hiring company..."
              className="h-11 w-full rounded-xl border border-[#333] bg-[#111] pl-10 pr-4 text-sm text-white placeholder-[#666] outline-none transition focus:border-white focus:ring-1 focus:ring-white"
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

          {/* Sort Selector */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden font-mono text-xs text-[#888] sm:inline">
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
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "border border-[#262626] bg-[#111] text-[#a3a3a3] hover:border-[#404040] hover:text-white"
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
        <p className="font-mono text-xs text-[#888]">
          Showing <span className="text-white font-medium">{from}</span>–
          <span className="text-white font-medium">{to}</span> of{" "}
          <span className="text-white font-semibold">{filtered.length}</span> categories
        </p>
        <span className="font-mono text-xs text-[#737373]">
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
                  className="feature-card glass-card card-sheen group relative flex w-full flex-col justify-between rounded-2xl border border-[#262626] bg-[#0c0c0c] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-white hover:bg-[#121212] hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                >
                  <div>
                    {/* Header: Cluster Icon + Job Count */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#333] bg-[#161616] text-white transition group-hover:border-white group-hover:bg-white group-hover:text-black">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white transition group-hover:border-white group-hover:bg-white group-hover:text-black">
                        {c.jobCount} {c.jobCount === 1 ? "role" : "roles"}
                      </span>
                    </div>

                    {/* Category Title */}
                    <h3 className="headline mt-4 truncate text-base font-bold tracking-tight text-white group-hover:text-white">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#737373]">{c.cluster}</p>

                    {/* Hiring Employers */}
                    {c.topCompanies.length > 0 && (
                      <div className="mt-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#666]">
                          Hiring Employers
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {c.topCompanies.slice(0, 3).map((comp) => (
                            <span
                              key={comp}
                              className="rounded border border-[#222] bg-[#141414] px-1.5 py-0.5 text-[10px] text-[#a3a3a3]"
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
                            className="rounded-md bg-[#161616] px-1.5 py-0.5 text-[10px] text-[#888]"
                          >
                            #{skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#1f1f1f] pt-3 text-xs font-medium text-[#a3a3a3] transition group-hover:text-white">
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
        <div className="glass-card card-sheen rounded-2xl border border-[#262626] p-12 text-center">
          <p className="font-mono text-xs text-[#888]">$ 0 categories found</p>
          <h3 className="headline mt-2 text-lg font-bold text-white">
            No categories match your search
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#a3a3a3]">
            Try adjusting your search keywords or switch the discipline filter tab above.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCluster("all");
              setPage(1);
            }}
            className="mt-5 inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#404040] bg-[#141414] px-4 py-2 text-xs font-medium text-white hover:border-white"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-6">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3.5 py-1.5 text-xs font-medium text-[#d4d4d4] transition hover:border-[#404040] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          <span className="font-mono text-xs text-[#888]">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3.5 py-1.5 text-xs font-medium text-[#d4d4d4] transition hover:border-[#404040] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
