import { AlertTriangle, SearchX } from "lucide-react";

export function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="glass-card card-sheen flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#1f1f1f] px-6 py-14 text-center sm:py-16">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#222] text-[#555]">
        <SearchX className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <p className="text-base font-semibold text-white">No filings match these filters</p>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#555]">
          Try a different keyword, widen the location, or clear the filters to see the full feed again.
        </p>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-1 min-h-[44px] rounded-xl border border-[#222] px-5 py-2.5 text-sm font-medium text-[#888] transition hover:border-[#333] hover:text-white focus-visible:outline-2 focus-visible:outline-[#0070f3]"
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
      className="glass-card card-sheen flex flex-col items-center gap-3 rounded-2xl border border-[#1f1f1f] px-6 py-12 text-center sm:py-14"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#222] text-[#555]">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <p className="font-mono text-xs text-[#444]">error</p>
        <p className="mt-1 text-base font-semibold text-white">The feed did not load</p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#555]">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 min-h-[44px] rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-[#e8e8e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070f3]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
