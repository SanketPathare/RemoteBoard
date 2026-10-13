export function JobCardSkeleton() {
  return (
    <article className="feature-card glass-card card-sheen skeleton-shimmer relative flex h-full flex-col overflow-hidden rounded-xl border border-[#262626] p-5">
      <div className="flex h-full flex-col gap-4">
        {/* Header: Logo + Title + Company */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg border border-[#333] bg-[#1a1a1a]" />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <div className="h-4 w-4/5 rounded bg-[#262626]" />
            <div className="h-3 w-2/5 rounded bg-[#1a1a1a]" />
          </div>
        </div>

        {/* Meta: time, location, remote */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-3 w-16 rounded bg-[#1a1a1a]" />
          <div className="h-3 w-24 rounded bg-[#1a1a1a]" />
          <div className="h-3 w-14 rounded bg-[#1a1a1a]" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <div className="h-5 w-14 rounded-md border border-[#262626] bg-[#111]" />
          <div className="h-5 w-20 rounded-md border border-[#262626] bg-[#111]" />
          <div className="h-5 w-12 rounded-md border border-[#262626] bg-[#111]" />
        </div>

        {/* Salary */}
        <div className="h-4 w-28 rounded bg-[#222]" />

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2 pt-1">
          <div className="h-10 flex-1 rounded-md border border-[#333] bg-[#111]" />
          <div className="h-10 flex-1 rounded-md bg-[#262626]" />
        </div>
      </div>
    </article>
  );
}

export function JobListSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Result count placeholder */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-3.5 w-32 animate-pulse rounded bg-[#1a1a1a]" />
        <div className="h-3.5 w-20 animate-pulse rounded bg-[#1a1a1a]" />
      </div>

      {/* Grid of skeleton job cards */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex min-w-0">
            <div className="min-w-0 flex-1">
              <JobCardSkeleton />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
