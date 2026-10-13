"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { JobList } from "./JobList";
import { EmptyState, ErrorState } from "./States";
import { EMPTY_FILTERS, facetValues, filterJobs, sortNewestFirst, type JobFilters } from "@/lib/filters";
import type { Job, SourceError } from "@/lib/types";

const PAGE_SIZE = 12;

interface ApiPayload {
  jobs: Job[];
  total: number;
  errors: SourceError[];
}

/**
 * Client explorer: fetches ONCE per source selection (not per keystroke),
 * then filters/sorts/paginates locally. Query text filters client-side to
 * avoid repeated API calls on every UI interaction.
 */
export function JobsExplorer({ initialQuery = "", initialSource = "all" }: { initialQuery?: string; initialSource?: string }) {
  const [all, setAll] = useState<Job[]>([]);
  const [errors, setErrors] = useState<SourceError[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState<JobFilters>({ ...EMPTY_FILTERS, query: initialQuery, source: initialSource });

  const fetchAll = useCallback(async (source: string) => {
    setVisible(PAGE_SIZE);
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

  // Refetch only when the source bucket changes — never on text/filter tweaks.
  // URL param changes remount this component via key (see jobs/page.tsx).
  // Intentional data-fetch effect: synchronizes client state with the server
  // feed (an external system), which is exactly what effects are for.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll(filters.source);
  }, [filters.source, fetchAll]);

  const filtered = useMemo(
    () => sortNewestFirst(filterJobs(all, filters)),
    [all, filters],
  );

  const locations = useMemo(() => facetValues(all, (j) => j.location), [all]);
  const categories = useMemo(
    () => facetValues(all, (j) => j.category || j.tags[0]),
    [all],
  );
  const employmentTypes = useMemo(() => facetValues(all, (j) => j.employmentType), [all]);

  const pct = filtered.length ? Math.min(100, Math.round((Math.min(visible, filtered.length) / filtered.length) * 100)) : 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Keep search available while browsing the results. */}
      <div className="glass-bar sticky top-16 z-30 -mx-4 border-b border-[#262626] px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchBar
            defaultValue={filters.query}
            onSearch={(q) => {
              setFilters((f) => ({ ...f, query: q }));
              setVisible(PAGE_SIZE);
            }}
          />
        </div>
      </div>

      {errors.length > 0 && !loading && (
        <p role="status" className="flex items-start gap-2 rounded-lg border border-[#404040] bg-[#111] px-4 py-3 text-[13px] leading-5 text-[#a3a3a3]">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            {errors.length} listing feed{errors.length === 1 ? " is" : "s are"} temporarily
            unavailable. Showing the listings that are currently available.
          </span>
        </p>
      )}

      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-36">
          <FilterPanel
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setVisible(PAGE_SIZE);
            }}
            onClear={() => {
              setFilters({ ...EMPTY_FILTERS, source: filters.source });
              setVisible(PAGE_SIZE);
            }}
            locations={locations}
            categories={categories}
            employmentTypes={employmentTypes}
            resultCount={filtered.length}
          />
          {!loading && !loadError && filtered.length > 0 && (
            <p className="mt-3 hidden rounded-lg border border-[#262626] bg-[#080808] px-4 py-3 font-mono text-xs leading-5 text-[#a3a3a3] lg:block">
              newest first · pay and eligibility as reported
            </p>
          )}
        </div>

        <div className="min-w-0">
          {loading ? (
            null
          ) : loadError ? (
            <ErrorState message={loadError} onRetry={() => fetchAll(filters.source)} />
          ) : filtered.length === 0 ? (
            <EmptyState
              onClear={() => setFilters({ ...EMPTY_FILTERS, source: filters.source })}
            />
          ) : (
            <>
              <JobList jobs={filtered.slice(0, visible)} />
              <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-8">
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-[#262626]"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Filings shown"
                >
                  <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p aria-live="polite" className="font-mono text-xs text-[#a3a3a3]">
                  {Math.min(visible, filtered.length)} of {filtered.length} listings shown
                </p>
                {visible < filtered.length && (
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="min-h-[48px] w-full rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d4d4d4] sm:w-auto sm:min-w-56"
                  >
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
