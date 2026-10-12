import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  Tag,
} from "lucide-react";
import { timeAgo } from "@/lib/format";
import type { Job } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";
import { SafeHtml } from "./SafeHtml";

export function JobDetail({ job }: { job: Job }) {
  const rel =
    job.source === "remoteok"
      ? "noopener noreferrer"
      : "noopener noreferrer sponsored nofollow";
  const posted = new Date(job.postedAt);
  const postedLabel = Number.isNaN(posted.getTime())
    ? job.postedAt
    : posted.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const facts: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Building2 className="h-4 w-4" aria-hidden />, label: "Company", value: job.company },
    { icon: <MapPin className="h-4 w-4" aria-hidden />, label: "Location", value: job.location },
    {
      icon: <Globe className="h-4 w-4" aria-hidden />,
      label: "Remote eligibility",
      value: job.remoteEligibility || (job.remote ? "Remote eligible" : "See original filing"),
    },
    ...(job.employmentType
      ? [{ icon: <Briefcase className="h-4 w-4" aria-hidden />, label: "Employment type", value: job.employmentType }]
      : []),
    ...(job.experienceLevel
      ? [{ icon: <Tag className="h-4 w-4" aria-hidden />, label: "Experience level", value: job.experienceLevel }]
      : []),
    ...(job.salaryText
      ? [{ icon: <Banknote className="h-4 w-4" aria-hidden />, label: "Pay", value: `${job.salaryText}/yr` }]
      : []),
    { icon: <Calendar className="h-4 w-4" aria-hidden />, label: "Published", value: `${postedLabel} (${timeAgo(job.postedAt)})` },
  ];

  const applyBtn = (
    <a
      href={job.applyUrl}
      target="_blank"
      rel={rel}
      className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070F3] dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA]"
    >
      Apply now on {job.sourceName} <ArrowUpRight className="h-4 w-4" aria-hidden />
    </a>
  );

  const originalBtn = (
    <a
      href={job.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-md border border-[#EAEAEA] px-5 py-3 text-sm font-medium text-black transition hover:border-[#999999] focus-visible:outline-2 focus-visible:outline-[#0070F3] dark:border-[#333333] dark:text-white dark:hover:border-[#666666]"
    >
      <ExternalLink className="h-4 w-4" aria-hidden /> Read the original filing
    </a>
  );

  return (
    <div className="flex flex-col gap-4 pb-24 sm:gap-5 lg:pb-0">
      <Link
        href="/jobs"
        className="inline-flex w-fit items-center gap-1.5 rounded-md px-1 py-1 font-mono text-xs text-[#666666] transition hover:text-black hover:underline focus-visible:outline-2 focus-visible:outline-[#0070F3] dark:text-[#888888] dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> back to all filings
      </Link>

      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          <article className="glass-card card-sheen rounded-lg border border-[#EAEAEA] p-5 sm:p-7 lg:p-8 dark:border-[#333333]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="headline text-balance text-3xl font-extrabold leading-tight text-black sm:text-4xl dark:text-white">
                  {job.title}
                </h1>
                <p className="mt-1.5 flex items-center gap-1.5 text-base text-[#666666] dark:text-[#888888]">
                  <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                  {job.company}
                </p>
              </div>
              <SourceBadge source={job.source} />
            </div>

            <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-[#EAEAEA] pt-5 sm:grid-cols-2 dark:border-[#333333]">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#EAEAEA] text-black dark:border-[#333333] dark:text-white">
                    {f.icon}
                  </span>
                  <span className="min-w-0">
                    <dt className="text-sm text-[#666666] dark:text-[#888888]">
                      {f.label}
                    </dt>
                    <dd className="break-words font-medium text-black dark:text-white">{f.value}</dd>
                  </span>
                </div>
              ))}
            </dl>

            {(job.skills.length > 0 || job.tags.length > 0) && (
              <div className="mt-5">
                <h2 className="text-sm font-medium text-[#666666] dark:text-[#888888]">Skills and tags</h2>
                <p className="mt-2 font-mono text-xs leading-6 text-[#666666] dark:text-[#888888]">
                  {[...new Set([...job.skills, ...job.tags])].slice(0, 16).join(", ")}
                </p>
              </div>
            )}

            {/* Inline apply (tablet/desktop; mobile uses sticky bottom bar) */}
            <div className="mt-6 hidden flex-col gap-2 sm:flex lg:hidden xl:flex">
              {applyBtn}
              {originalBtn}
            </div>
          </article>

          <section
            aria-label="Job description"
            className="glass-card card-sheen rounded-lg border border-[#EAEAEA] p-5 sm:p-7 lg:p-8 dark:border-[#333333]"
          >
            <h2 className="headline text-2xl font-bold text-black dark:text-white">About this role</h2>
            {job.excerpt && (
              <p className="mt-3 border-l-2 border-black py-1 pl-3 pr-2 text-sm italic leading-6 text-[#666666] dark:border-white dark:text-[#888888]">
                {job.excerpt}
              </p>
            )}
            <SafeHtml html={job.descriptionHtml} className="job-description mt-4" />
            <p className="mt-6 border-t border-[#EAEAEA] pt-4 font-mono text-xs leading-5 text-[#999999] dark:border-[#333333]">
              filed by {job.sourceName} ·{" "}
              <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#0070F3] hover:underline">
                read the original filing
              </a>
            </p>
          </section>
        </div>

        {/* Sticky aside (desktop) */}
        <aside className="hidden lg:block">
          <div className="glass-card card-sheen sticky top-24 flex flex-col gap-3 rounded-lg border border-[#EAEAEA] p-5 dark:border-[#333333]">
            {job.salaryText && (
              <p className="border-b border-[#EAEAEA] pb-3 dark:border-[#333333]">
                <span className="block font-mono text-xs text-[#999999]">
                  reported pay
                </span>
                <span className="block text-lg font-semibold tabular-nums text-black dark:text-white">
                  {job.salaryText}
                  <span className="font-mono text-xs font-normal text-[#999999]"> /yr</span>
                </span>
              </p>
            )}
            {applyBtn}
            {originalBtn}
            <p className="font-mono text-[11px] leading-5 text-[#999999]">
              you apply on {job.sourceName} · nothing tracked here · confirm details on the original filing
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky bottom apply bar (mobile only) */}
      <div className="glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-[#EAEAEA] px-4 py-3 sm:hidden dark:border-[#333333]">
        <div className="mx-auto max-w-7xl">{applyBtn}</div>
      </div>
    </div>
  );
}
