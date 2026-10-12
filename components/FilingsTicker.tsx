"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format";
import { ChevronRight } from "lucide-react";

export interface FilingTick {
  title: string;
  company: string;
  postedAt: string;
  detailUrl: string;
  sourceName: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * nextjs.org-style announcement bar: single rotating job entry.
 * Pauses on hover/focus; static when user prefers reduced motion.
 */
export function FilingsTicker({ items }: { items: FilingTick[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (paused || reduced || items.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [paused, reduced, items.length]);

  if (items.length === 0) return null;
  const current = items[index % items.length];

  return (
    <div
      className="sticky top-14 z-30 border-b border-[#1f1f1f] bg-black/80 backdrop-blur-xl backdrop-saturate-150"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        {/* Pulsing live dot */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0070f3] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0070f3]" />
        </span>

        <Link
          key={`${current.detailUrl}-${index}`}
          href={current.detailUrl}
          className="filing-enter group flex min-w-0 flex-1 items-center gap-2 font-mono text-xs text-[#888] hover:text-white"
        >
          <span className="hidden shrink-0 rounded-md border border-[#333] px-1.5 py-0.5 text-[10px] text-[#555] sm:inline">
            NEW
          </span>
          <span className="min-w-0 flex-1 truncate">
            <span className="text-[#ccc] group-hover:text-white">{current.title}</span>
            <span className="text-[#555]"> at {current.company}</span>
            <span className="hidden text-[#444] sm:inline"> · {timeAgo(current.postedAt)}</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#555] group-hover:text-[#888]" aria-hidden />
        </Link>

        <p aria-live="polite" className="hidden shrink-0 font-mono text-[11px] text-[#444] sm:block">
          {index + 1}/{items.length}
        </p>
      </div>
    </div>
  );
}
