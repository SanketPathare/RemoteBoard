"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { FilterPills } from "./FilterPills";
import { JobList } from "./JobList";
import { JobListSkeleton } from "./JobSkeleton";
import { EmptyState, ErrorState } from "./States";
import { EMPTY_FILTERS, filterJobs, sortNewestFirst, type JobFilters } from "@/lib/filters";
import type { Job, SourceError } from "@/lib/types";

const PAGE_SIZE = 12;

interface ApiPayload {
  jobs: Job[];
  total: number;
  errors: SourceError[];
}

// ── Pagination bar ──────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build visible page numbers: always show first, last, current ±1, and ellipses
  const pages: (number | "…")[] = [];
  const add = (n: number) => {
    if (!pages.includes(n)) pages.push(n);
  };

  add(1);
  if (page - 2 > 2) pages.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i);
  if (page + 2 < totalPages - 1) pages.push("…");
  if (totalPages > 1) add(totalPages);

  const btnBase =
    "inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1.5 py-8"
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${btnBase} gap-1 border-[#2a2a2a] bg-[#0d0d0d] text-[#a3a3a3] hover:border-[#404040] hover:text-white disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-[#555] font-mono text-xs select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`${btnBase} ${
              p === page
                ? "border-white bg-white text-black"
                : "border-[#2a2a2a] bg-[#0d0d0d] text-[#a3a3a3] hover:border-[#404040] hover:text-white"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${btnBase} gap-1 border-[#2a2a2a] bg-[#0d0d0d] text-[#a3a3a3] hover:border-[#404040] hover:text-white disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </nav>
  );
}

// ── Main explorer ────────────────────────────────────────────────────────────
export function JobsExplorer({ initialQuery = "", initialSource = "all" }: { initialQuery?: string; initialSource?: string }) {
  const [all, setAll] = useState<Job[]>([]);
  const [, setErrors] = useState<SourceError[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({ ...EMPTY_FILTERS, query: initialQuery, source: initialSource });

  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async (source: string) => {
    setPage(1);
    setLoading(true);
    setLoadError(null);
    try {
      const qs = source !== "all" ? `?source=${encodeURIComponent(source)}` : "";
      const res = await fetch(`/api/jobs${qs}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = (await res.json()) as ApiPayload;
      setAll(Array.isArray(data.jobs) ? data.jobs : []);
      setErrors(Array.isArray(data.errors) ? data.errors : []);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll(filters.source);
  }, [filters.source, fetchAll]);

  const filtered = useMemo(
    () => sortNewestFirst(filterJobs(all, filters)),
    [all, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Clamp page when filters narrow results
  const safePage = Math.min(page, totalPages);

  const pageJobs = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  function goToPage(p: number) {
    setPage(p);
    // Scroll results area back into view smoothly
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleFilterChange(f: JobFilters) {
    setFilters(f);
    setPage(1);
  }

  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to   = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Sticky search bar + Pill Filters */}
      <div className="glass-bar sticky top-16 z-30 -mx-4 border-b border-[#262626] px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-2.5">
          <SearchBar
            defaultValue={filters.query}
            onSearch={(q) => handleFilterChange({ ...filters, query: q })}
          />
          <FilterPills
            filters={filters}
            onChange={handleFilterChange}
            onClear={() => handleFilterChange({ ...EMPTY_FILTERS, source: filters.source })}
          />
        </div>
      </div>

      {/* Full-width Results Area */}
      <div className="w-full min-w-0" ref={resultsRef}>
        {loading ? (
          <JobListSkeleton count={9} />
        ) : loadError ? (
          <ErrorState message={loadError} onRetry={() => fetchAll(filters.source)} />
        ) : filtered.length === 0 ? (
          <EmptyState onClear={() => handleFilterChange({ ...EMPTY_FILTERS, source: filters.source })} />
        ) : (
          <>
            {/* Result count & meta row */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#1f1f1f] pb-3">
              <div className="flex items-center gap-3">
                <p aria-live="polite" className="font-mono text-xs text-[#a3a3a3]">
                  <span className="font-semibold text-white">{filtered.length}</span> listings found
                  {filtered.length > 0 && ` (${from}–${to})`}
                </p>
                <span className="hidden text-[#333] sm:inline">·</span>
                <span className="hidden font-mono text-[11px] text-[#737373] sm:inline">
                  newest first · pay and eligibility as reported
                </span>
              </div>
              {totalPages > 1 && (
                <p className="font-mono text-xs text-[#737373]">
                  Page <span className="font-semibold text-white">{safePage}</span> of {totalPages}
                </p>
              )}
            </div>

            <JobList jobs={pageJobs} />

            <Pagination page={safePage} totalPages={totalPages} onPage={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
