"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { JobFilters } from "@/lib/filters";
import { CustomSelect } from "./CustomSelect";

interface Props {
  filters: JobFilters;
  onChange: (f: JobFilters) => void;
  onClear: () => void;
  locations: string[];
  categories: string[];
  employmentTypes: string[];
  resultCount: number;
  loading?: boolean;
}

const inputCls =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 dark:border-[#404040] dark:bg-[#080808] dark:text-white dark:focus:border-[#a3a3a3] dark:focus:ring-white/10";

function activeCount(f: JobFilters): number {
  let n = 0;
  if (f.remoteOnly) n++;
  if (f.salaryOnly || f.minSalary > 0) n++;
  if (f.source !== "all") n++;
  if (f.location.trim()) n++;
  if (f.country.trim()) n++;
  if (f.category.trim()) n++;
  if (f.employmentType) n++;
  if (f.programmingLanguage) n++;
  if (f.experienceLevel) n++;
  if (f.datePosted && f.datePosted !== "all") n++;
  return n;
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
  locations,
  categories,
  employmentTypes,
  resultCount,
  loading = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<JobFilters>) => onChange({ ...filters, ...patch });
  const count = activeCount(filters);

  const body = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <label className="flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm transition has-checked:border-neutral-900 has-checked:bg-neutral-50 dark:border-[#333] dark:bg-transparent dark:has-checked:border-[#737373] dark:has-checked:bg-[#111]">
        <input
          type="checkbox"
          checked={filters.remoteOnly}
          onChange={(e) => set({ remoteOnly: e.target.checked })}
          className="h-4 w-4 shrink-0 accent-neutral-900 dark:accent-white"
        />
        <span className="font-medium text-neutral-900 dark:text-white">Remote only</span>
      </label>

      <label className="flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm transition has-checked:border-neutral-900 has-checked:bg-neutral-50 dark:border-[#333] dark:bg-transparent dark:has-checked:border-[#737373] dark:has-checked:bg-[#111]">
        <input
          type="checkbox"
          checked={filters.salaryOnly}
          onChange={(e) => set({ salaryOnly: e.target.checked })}
          className="h-4 w-4 shrink-0 accent-neutral-900 dark:accent-white"
        />
        <span className="font-medium text-neutral-900 dark:text-white">Pay listed</span>
      </label>

      <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <label htmlFor="f-location" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-[#a3a3a3]">
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
        <label htmlFor="f-category" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-[#a3a3a3]">
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
        <label htmlFor="f-employment" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-[#a3a3a3]">
          Employment type
        </label>
        <CustomSelect
          id="f-employment"
          title="Employment Type"
          align="left"
          className="w-full"
          triggerClassName="w-full h-11 bg-white border-neutral-300 dark:bg-[#080808] dark:border-[#404040]"
          value={filters.employmentType}
          onChange={(val) => set({ employmentType: val })}
          options={[
            { value: "", label: "Any type" },
            ...employmentTypes.map((t) => ({ value: t.toLowerCase(), label: t })),
          ]}
        />
      </div>
    </div>
  );

  return (
    <section
      aria-label="Job filters"
      className="glass-card card-sheen overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3.5 sm:px-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-md text-sm font-medium text-neutral-900 lg:cursor-default dark:text-white"
        >
          <SlidersHorizontal className="h-4 w-4 text-neutral-500 dark:text-[#a3a3a3]" aria-hidden />
          Filters
          {count > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 font-mono text-[11px] font-bold text-white dark:bg-white dark:text-black">
              {count}
            </span>
          )}
          <ChevronDown
            aria-hidden
            className={`h-4 w-4 text-neutral-400 transition-transform lg:hidden dark:text-[#737373] ${open ? "rotate-180" : ""}`}
          />
        </button>
        <div className="flex items-center gap-2">
          <p aria-live="polite" className="rounded-full bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 dark:bg-[#171717] dark:text-[#a3a3a3]">
            {loading ? "loading…" : `${resultCount} result${resultCount === 1 ? "" : "s"}`}
          </p>
          {count > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-[#d4d4d4] dark:hover:bg-[#171717] dark:hover:text-white"
            >
              <RotateCcw className="h-3 w-3" aria-hidden /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile collapsible / always open on desktop */}
      <div className={`${open ? "block" : "hidden"} border-t border-neutral-200 px-4 py-4 sm:px-5 lg:block dark:border-[#262626]`}>
        {body}
      </div>
    </section>
  );
}
