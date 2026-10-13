"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { Job } from "@/lib/types";
import { JobCard } from "./JobCard";

interface PaginatedJobListProps {
  jobs: Job[];
  title?: string;
  pageSize?: number;
  emptyMessage?: string;
  gridClassName?: string;
}

export function PaginatedJobList({
  jobs,
  title,
  pageSize = 12,
  emptyMessage = "No matching jobs found.",
  gridClassName = "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3",
}: PaginatedJobListProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return jobs;
    const q = query.toLowerCase().trim();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.category && j.category.toLowerCase().includes(q)) ||
        j.skills.some((s) => s.toLowerCase().includes(q)) ||
        j.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [jobs, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageJobs = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  function goToPage(p: number) {
    setPage(p);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Generate pagination items
  const pages: (number | "…")[] = [];
  const add = (n: number) => {
    if (!pages.includes(n)) pages.push(n);
  };
  add(1);
  if (safePage - 2 > 2) pages.push("…");
  for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
    add(i);
  }
  if (safePage + 2 < totalPages - 1) pages.push("…");
  if (totalPages > 1) add(totalPages);

  const btnBase =
    "inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-2.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  return (
    <div ref={listRef} className="scroll-mt-24 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-4 dark:border-[#262626]">
        <div>
          {title && (
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {title}
            </h2>
          )}
          <p className="font-mono text-xs text-neutral-500 dark:text-[#737373]">
            Showing <span className="font-semibold text-neutral-900 dark:text-white">{from}–{to}</span> of{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">{filtered.length}</span> jobs
            {query && filtered.length !== jobs.length && (
              <span className="ml-1 text-neutral-400"> (filtered from {jobs.length})</span>
            )}
          </p>
        </div>

        {/* Quick Search inside list */}
        <div className="relative min-w-[220px] max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 dark:text-[#737373]" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter roles or skills..."
            className="w-full rounded-lg border border-neutral-300 bg-white py-1.5 pl-9 pr-8 text-xs text-neutral-900 placeholder:text-neutral-400 shadow-sm transition focus:border-neutral-900 focus:outline-none dark:border-[#333] dark:bg-[#111] dark:text-white dark:placeholder:text-[#666] dark:focus:border-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-black dark:text-[#737373] dark:hover:text-white"
              aria-label="Clear filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {pageJobs.length > 0 ? (
        <ul className={gridClassName}>
          {pageJobs.map((job) => (
            <li key={job.id} className="flex min-w-0">
              <div className="min-w-0 flex-1">
                <JobCard job={job} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 text-center dark:border-[#262626] dark:bg-[#0c0c0c]">
          <p className="text-sm text-neutral-600 dark:text-[#a3a3a3]">
            {query ? `No positions matching "${query}".` : emptyMessage}
          </p>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="mt-3 inline-flex items-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:border-black hover:text-black dark:border-[#333] dark:bg-[#111] dark:text-[#d4d4d4] dark:hover:border-white dark:hover:text-white"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex flex-wrap items-center justify-center gap-1.5 pt-8 pb-4"
        >
          {/* Prev */}
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
            className={`${btnBase} gap-1 border-neutral-300 bg-white text-neutral-700 shadow-sm hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-[#2a2a2a] dark:bg-[#0d0d0d] dark:text-[#a3a3a3] dark:hover:border-[#404040] dark:hover:text-white`}
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page numbers */}
          {pages.map((p, idx) =>
            p === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 font-mono text-xs text-neutral-400 select-none dark:text-[#555]"
              >
                …
              </span>
            ) : (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => goToPage(p)}
                aria-current={p === safePage ? "page" : undefined}
                className={`${btnBase} ${
                  p === safePage
                    ? "border-neutral-900 bg-neutral-900 font-bold text-white shadow-sm dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-300 bg-white text-neutral-700 shadow-sm hover:border-neutral-900 hover:text-neutral-900 dark:border-[#2a2a2a] dark:bg-[#0d0d0d] dark:text-[#a3a3a3] dark:hover:border-[#404040] dark:hover:text-white"
                }`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
            className={`${btnBase} gap-1 border-neutral-300 bg-white text-neutral-700 shadow-sm hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-[#2a2a2a] dark:bg-[#0d0d0d] dark:text-[#a3a3a3] dark:hover:border-[#404040] dark:hover:text-white`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </nav>
      )}
    </div>
  );
}
