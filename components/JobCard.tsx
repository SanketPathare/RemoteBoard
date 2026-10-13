"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, MapPin, Clock } from "lucide-react";
import { timeAgo } from "@/lib/format";
import type { Job } from "@/lib/types";

import { CompanyLogo } from "./CompanyLogo";
import { toCompanySlug } from "@/lib/companies";

export function ApplyButtons({ job }: { job: Job }) {
  const rel =
    job.source === "remoteok"
      ? "noopener noreferrer"
      : "noopener noreferrer sponsored nofollow";
  return (
    <div className="flex gap-2">
      <Link
        href={job.detailUrl}
        className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-md border border-neutral-300 bg-neutral-50 px-3 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-100 hover:text-black dark:border-[#404040] dark:bg-transparent dark:text-[#d4d4d4] dark:hover:border-[#737373] dark:hover:bg-[#111] dark:hover:text-white"
      >
        Details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
      <a
        href={job.applyUrl}
        target="_blank"
        rel={rel}
        className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-md border border-neutral-900 bg-neutral-900 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:border-[#d4d4d4] dark:hover:bg-[#d4d4d4]"
      >
        Apply <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    </div>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="feature-card glass-card card-sheen group relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-neutral-400 dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#525252]">
      <div className="flex h-full flex-col gap-4 p-5 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <CompanyLogo name={job.company} logo={job.logo} size="md" />

          <div className="min-w-0 flex-1">
            <h3 className="headline line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900 transition hover:text-neutral-600 dark:text-white dark:hover:text-[#d4d4d4]">
              <Link
                href={job.detailUrl}
                className="transition hover:text-neutral-700 dark:hover:text-[#d4d4d4]"
              >
                {job.title}
              </Link>
            </h3>
            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-neutral-600 dark:text-[#a3a3a3]">
              <Building2 className="h-3 w-3 shrink-0" aria-hidden />
              <Link
                href={`/companies/${toCompanySlug(job.company)}`}
                className="truncate transition hover:text-neutral-900 hover:underline dark:hover:text-white"
              >
                {job.company}
              </Link>
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-[#737373]">
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
                className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:border-[#262626] dark:bg-[#111] dark:text-[#a3a3a3]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Salary */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">
            {job.salaryText ? `${job.salaryText}/yr` : (
              <span className="font-normal text-neutral-400 dark:text-[#737373]">Pay undisclosed</span>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-1">
          <ApplyButtons job={job} />
        </div>
      </div>
    </article>
  );
}
