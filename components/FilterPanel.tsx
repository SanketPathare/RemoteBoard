"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { JobFilters } from "@/lib/filters";
import { SOURCE_META } from "@/lib/types";

interface Props {
  filters: JobFilters;
  onChange: (f: JobFilters) => void;
  onClear: () => void;
  locations: string[];
  categories: string[];
  employmentTypes: string[];
  resultCount: number;
}

const inputCls =
  "w-full rounded-md border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-black focus:border-[#0070F3] focus:outline-none focus:ring-4 focus:ring-[#0070F3]/15 dark:border-[#333333] dark:bg-black dark:text-white";

function activeCount(f: JobFilters): number {
  let n = 0;
  if (f.remoteOnly) n++;
  if (f.salaryOnly) n++;
  if (f.source !== "all") n++;
  if (f.location.trim()) n++;
  if (f.country.trim()) n++;
  if (f.category.trim()) n++;
  if (f.employmentType) n++;
  return n;
}

export function FilterPanel({ filters, onChange, onClear, locations, categories, employmentTypes, resultCount }: Props) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<JobFilters>) => onChange({ ...filters, ...patch });
  const count = activeCount(filters);

  const body = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <label className="flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-md border border-[#EAEAEA] px-3 py-2.5 text-sm transition has-checked:border-[#0070F3] dark:border-[#333333] dark:has-checked:bg-[#0070F3]/10">
        <input
          type="checkbox"
          checked={filters.remoteOnly}
          onChange={(e) => set({ remoteOnly: e.target.checked })}
          className="h-4 w-4 shrink-0 accent-[#0070F3]"
        />
        <span className="font-medium text-black dark:text-white">Remote only</span>
      </label>

      <label className="flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-md border border-[#EAEAEA] px-3 py-2.5 text-sm transition has-checked:border-[#0070F3] dark:border-[#333333] dark:has-checked:bg-[#0070F3]/10">
        <input
          type="checkbox"
          checked={filters.salaryOnly}
          onChange={(e) => set({ salaryOnly: e.target.checked })}
          className="h-4 w-4 shrink-0 accent-[#0070F3]"
        />
        <span className="font-medium text-black dark:text-white">Pay listed</span>
      </label>

      <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <label htmlFor="f-source" className="mb-1.5 block text-sm font-medium text-[#666666] dark:text-[#888888]">
          Filed by
        </label>
        <select
          id="f-source"
          value={filters.source}
          onChange={(e) => set({ source: e.target.value })}
          className={inputCls}
        >
          <option value="all">All providers</option>
          {(Object.keys(SOURCE_META) as (keyof typeof SOURCE_META)[]).map((s) => (
            <option key={s} value={s}>
              {SOURCE_META[s].label}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <label htmlFor="f-location" className="mb-1.5 block text-sm font-medium text-[#666666] dark:text-[#888888]">
          Location or eligibility
        </label>
        <input
          id="f-location"
          list="location-options"
          value={filters.location}
          onChange={(e) => set({ location: e.target.value })}
          placeholder="e.g. Germany, Worldwide…"
          className={inputCls}
        />
        <datalist id="location-options">
          {locations.slice(0, 30).map((l) => (
            <option key={l} value={l} />
          ))}
        </datalist>
      </div>

      <div>
          <label htmlFor="f-category" className="mb-1.5 block text-sm font-medium text-[#666666] dark:text-[#888888]">
            Category
          </label>
        <input
          id="f-category"
          list="category-options"
          value={filters.category}
          onChange={(e) => set({ category: e.target.value })}
          placeholder="e.g. engineering…"
          className={inputCls}
        />
        <datalist id="category-options">
          {categories.slice(0, 30).map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div>
          <label htmlFor="f-employment" className="mb-1.5 block text-sm font-medium text-[#666666] dark:text-[#888888]">
            Employment type
          </label>
        <select
          id="f-employment"
          value={filters.employmentType}
          onChange={(e) => set({ employmentType: e.target.value })}
          className={inputCls}
        >
          <option value="">Any type</option>
          {employmentTypes.map((t) => (
            <option key={t} value={t.toLowerCase()}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <section
      aria-label="Job filters"
      className="glass-card card-sheen overflow-hidden rounded-lg border border-[#EAEAEA] dark:border-[#333333]"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3.5 sm:px-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-md text-sm font-medium text-black focus-visible:outline-2 focus-visible:outline-[#0070F3] lg:cursor-default dark:text-white"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#0070F3]" aria-hidden />
          Filters
          {count > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0070F3] px-1.5 font-mono text-[11px] font-bold text-white">
              {count}
            </span>
          )}
          <ChevronDown
            aria-hidden
            className={`h-4 w-4 text-[#999999] transition-transform lg:hidden ${open ? "rotate-180" : ""}`}
          />
        </button>
        <div className="flex items-center gap-2">
          <p aria-live="polite" className="rounded-full bg-[#FAFAFA] px-2.5 py-1 font-mono text-xs text-[#666666] dark:bg-[#111111] dark:text-[#888888]">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </p>
          {count > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[#0070F3] transition hover:bg-[#FAFAFA] focus-visible:outline-2 focus-visible:outline-[#0070F3] dark:hover:bg-[#111111]"
            >
              <RotateCcw className="h-3 w-3" aria-hidden /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile collapsible / always open on desktop */}
      <div className={`${open ? "block" : "hidden"} border-t border-[#EAEAEA] px-4 py-4 sm:px-5 lg:block dark:border-[#333333]`}>
        {body}
      </div>
    </section>
  );
}
