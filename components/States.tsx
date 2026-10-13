import { AlertTriangle, SearchX } from "lucide-react";

export function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="glass-card card-sheen flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-14 text-center sm:py-16 dark:border-[#404040] dark:bg-transparent">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-sm dark:border-[#333] dark:bg-transparent dark:text-[#a3a3a3]">
        <SearchX className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <p className="text-base font-semibold text-neutral-900 dark:text-white">No listings match these filters</p>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">
          Try a different keyword, widen the location, or clear the filters to see the full feed again.
        </p>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-1 min-h-[44px] rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900 dark:border-[#404040] dark:bg-transparent dark:text-[#d4d4d4] dark:hover:border-[#737373] dark:hover:bg-[#111] dark:hover:text-white"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="glass-card card-sheen flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center sm:py-14 dark:border-[#262626] dark:bg-transparent"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-sm dark:border-[#333] dark:bg-transparent dark:text-[#a3a3a3]">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <p className="font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">error</p>
        <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">The feed did not load</p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 min-h-[44px] rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
