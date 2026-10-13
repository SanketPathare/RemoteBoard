export function JobCardSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse overflow-hidden rounded-xl border border-[#262626] bg-[#080808]"
    >
      <div className="h-[2px] w-full bg-[#262626]" />
      <div className="space-y-3 p-5">
        <div className="flex gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-[#171717]" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-4/5 rounded-md bg-[#171717]" />
            <div className="h-3 w-2/5 rounded-md bg-[#111]" />
          </div>
        </div>
        <div className="h-3 w-2/3 rounded-md bg-[#111]" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-md bg-[#111]" />
          <div className="h-5 w-14 rounded-md bg-[#111]" />
        </div>
        <div className="h-4 w-28 rounded-lg bg-[#111]" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 rounded-xl bg-[#1a1a1a]" />
          <div className="h-10 flex-1 rounded-xl bg-[#1a1a1a]" />
        </div>
      </div>
    </div>
  );
}

export function JobGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading filings"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading filings…</span>
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse rounded-xl border border-[#262626] bg-[#080808] p-6"
    >
      <div className="h-6 w-2/3 rounded-md bg-[#171717]" />
      <div className="mt-2 h-4 w-1/3 rounded-md bg-[#111]" />
      <div className="mt-5 space-y-2.5">
        <div className="h-3 rounded-lg bg-[#111]" />
        <div className="h-3 w-11/12 rounded-lg bg-[#111]" />
        <div className="h-3 w-4/5 rounded-lg bg-[#111]" />
      </div>
    </div>
  );
}
