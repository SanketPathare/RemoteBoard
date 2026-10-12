"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { timeAgo } from "@/lib/format";
import type { Job } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";

function CompanyTile({ name }: { name: string }) {
  const letter = (name.trim()[0] || "?").toUpperCase();
  const hues = [220, 250, 170, 340, 30, 200];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <span
      aria-hidden
      style={{ background: `hsl(${hue} 60% 10%)`, color: `hsl(${hue} 80% 65%)` }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ring-1 ring-white/5"
    >
      {letter}
    </span>
  );
}

export function ApplyButtons({ job }: { job: Job }) {
  const rel =
    job.source === "remoteok"
      ? "noopener noreferrer"
      : "noopener noreferrer sponsored nofollow";
  return (
    <div className="flex gap-2">
      <Link
        href={job.detailUrl}
        className="inline-flex min-h-[38px] flex-1 items-center justify-center gap-1 rounded-xl border border-[#222] px-3 text-sm font-medium text-[#888] transition hover:border-[#333] hover:text-white focus-visible:outline-2 focus-visible:outline-[#0070f3]"
      >
        Details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
      <a
        href={job.applyUrl}
        target="_blank"
        rel={rel}
        className="inline-flex min-h-[38px] flex-1 items-center justify-center gap-1 rounded-xl bg-white px-3 text-sm font-medium text-black transition hover:bg-[#e8e8e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070f3]"
      >
        Apply <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    </div>
  );
}

export function JobCard({ job }: { job: Job }) {
  const [logoOk, setLogoOk] = useState(true);
  const showLogo = Boolean(job.logo) && logoOk;

  return (
    <article className="feature-card glass-card card-sheen group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#1f1f1f] transition hover:border-[#333]">
      <span aria-hidden className={`source-tab-x source-tab-${job.source}`} />

      <div className="flex h-full flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          {showLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.logo as string}
              alt={`${job.company} logo`}
              loading="lazy"
              className="h-10 w-10 shrink-0 rounded-xl border border-[#222] bg-[#111] object-contain p-1.5"
              onError={() => setLogoOk(false)}
            />
          ) : (
            <CompanyTile name={job.company} />
          )}

          <div className="min-w-0 flex-1">
            <h3 className="headline line-clamp-2 text-[15px] font-semibold leading-snug text-white">
              <Link
                href={job.detailUrl}
                className="transition hover:text-[#0070f3]"
              >
                {job.title}
              </Link>
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#555]">
              <Building2 className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{job.company}</span>
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-[#444]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {timeAgo(job.postedAt)}
          </span>
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden />
              {job.location}
              {job.remote ? " · remote" : ""}
            </span>
          )}
          {job.employmentType && (
            <span>{job.employmentType.toLowerCase()}</span>
          )}
        </div>

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[#1f1f1f] bg-[#111] px-2 py-0.5 font-mono text-[11px] text-[#555]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Salary + source */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold tabular-nums text-white">
            {job.salaryText ? `${job.salaryText}/yr` : (
              <span className="text-[#444]">Pay undisclosed</span>
            )}
          </p>
          <SourceBadge source={job.source} />
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-1">
          <ApplyButtons job={job} />
        </div>
      </div>
    </article>
  );
}
