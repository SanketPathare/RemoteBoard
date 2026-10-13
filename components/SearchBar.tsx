"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export function SearchBar({
  defaultValue,
  onSearch,
  id = "job-search",
  size = "default",
}: {
  defaultValue?: string;
  onSearch: (q: string) => void;
  id?: string;
  size?: "default" | "hero";
  /** @deprecated — retained for compatibility with older call sites. */
  tone?: "dark" | "auto";
}) {
  const [value, setValue] = useState(defaultValue || "");
  const hero = size === "hero";

  return (
    <form
      role="search"
      aria-label="Search remote jobs"
      className={`flex w-full gap-2 ${hero ? "flex-col sm:flex-row" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search job titles, companies, or skills
      </label>

      <div className="relative flex-1">
        <Search
          aria-hidden
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#737373] ${
            hero ? "h-5 w-5" : "h-4 w-4"
          }`}
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search jobs by title, company, or skill"
          autoComplete="off"
          className={`glass-input w-full rounded-lg border border-neutral-300 bg-white font-sans text-neutral-900 placeholder:text-neutral-400 shadow-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 dark:border-[#404040] dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#737373] dark:focus:border-[#a3a3a3] dark:focus:ring-white/10 ${
            hero ? "py-4 pl-12 pr-11 text-base" : "py-3 pl-10 pr-9 text-sm"
          } [&::-webkit-search-cancel-button]:hidden`}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => { setValue(""); onSearch(""); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-black dark:text-[#737373] dark:hover:bg-[#1a1a1a] dark:hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <button
        type="submit"
        className={`rounded-lg border border-neutral-900 bg-neutral-900 font-semibold text-white shadow-sm transition hover:border-black hover:bg-black dark:border-white dark:bg-white dark:text-black dark:hover:border-[#d4d4d4] dark:hover:bg-[#d4d4d4] ${
          hero ? "px-7 py-4 text-base" : "min-h-[48px] px-5 py-3 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
}
