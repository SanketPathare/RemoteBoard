import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Globe,
  MapPin,
  Tag,
} from "lucide-react";
import { timeAgo } from "@/lib/format";
import type { Job } from "@/lib/types";
import { CompanyLogo } from "./CompanyLogo";
import { SafeHtml } from "./SafeHtml";
import { toCompanySlug } from "@/lib/companies";

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

  const companySlug = toCompanySlug(job.company);

  const facts: { icon: React.ReactNode; label: string; value: React.ReactNode }[] = [
    {
      icon: <Building2 className="h-4 w-4" aria-hidden />,
      label: "Company",
      value: (
        <Link
          href={`/companies/${companySlug}`}
          className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-[#d4d4d4]"
        >
          {job.company}
        </Link>
      ),
    },
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
      ? [{ icon: <Banknote className="h-4 w-4" aria-hidden />, label: "Pay", value: job.salaryText.includes("/") ? job.salaryText : `${job.salaryText}/yr` }]
      : []),
    { icon: <Calendar className="h-4 w-4" aria-hidden />, label: "Published", value: `${postedLabel} (${timeAgo(job.postedAt)})` },
  ];

  const applyBtn = (
    <a
      href={job.applyUrl}
      target="_blank"
      rel={rel}
      className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
    >
      Apply now <ArrowUpRight className="h-4 w-4" aria-hidden />
    </a>
  );



  return (
    <div className="flex flex-col gap-4 pb-24 sm:gap-5 lg:pb-0">
      <Link
        href="/jobs"
        className="inline-flex w-fit items-center gap-1.5 rounded-md px-1 py-1 text-xs text-neutral-600 transition hover:text-neutral-900 hover:underline dark:text-[#a3a3a3] dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> back to all jobs
      </Link>

      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          <article className="glass-card card-sheen rounded-xl border border-neutral-200 bg-white p-5 sm:p-7 lg:p-8 dark:border-[#262626] dark:bg-transparent">
            {/* Header: Company Logo & Job Info */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <CompanyLogo
                name={job.company}
                logo={job.logo}
                size="xl"
                priority
              />
              <div className="min-w-0 flex-1">
                {/* Meta badges */}
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:border-[#262626] dark:bg-[#111] dark:text-[#a3a3a3]">
                    <span
                      className={`h-1.5 w-1.5 rounded-full source-dot-${job.source}`}
                      aria-hidden
                    />
                    {job.sourceName}
                  </span>
                  {job.remote && (
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-950/60 dark:bg-emerald-950/30 dark:text-emerald-400">
                      Remote
                    </span>
                  )}
                  {job.employmentType && (
                    <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-[#262626] dark:bg-[#111] dark:text-[#a3a3a3]">
                      {job.employmentType}
                    </span>
                  )}
                </div>

                <h1 className="headline text-balance text-2xl font-extrabold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white">
                  {job.title}
                </h1>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                  <p className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-white">
                    <Building2 className="h-4 w-4 shrink-0 text-neutral-500 dark:text-[#888888]" aria-hidden />
                    <Link
                      href={`/companies/${companySlug}`}
                      className="transition hover:underline hover:text-neutral-600 dark:hover:text-[#d4d4d4]"
                    >
                      {job.company}
                    </Link>
                  </p>
                  {job.location && (
                    <p className="flex items-center gap-1.5 text-neutral-600 dark:text-[#888888]">
                      <MapPin className="h-4 w-4 shrink-0 text-neutral-500 dark:text-[#888888]" aria-hidden />
                      {job.location}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-neutral-600 dark:text-[#888888]">
                    <Clock className="h-4 w-4 shrink-0 text-neutral-500 dark:text-[#888888]" aria-hidden />
                    {timeAgo(job.postedAt)}
                  </p>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-neutral-200 pt-5 dark:border-[#262626] sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-neutral-800 dark:border-[#333] dark:bg-transparent dark:text-white">
                    {f.icon}
                  </span>
                  <span className="min-w-0">
                    <dt className="text-sm text-neutral-500 dark:text-[#888888]">
                      {f.label}
                    </dt>
                    <dd className="break-words font-medium text-neutral-900 dark:text-white">{f.value}</dd>
                  </span>
                </div>
              ))}
            </dl>

            {(job.skills.length > 0 || job.tags.length > 0) && (
              <div className="mt-5">
                <h2 className="text-sm font-medium text-neutral-500 dark:text-[#888888]">Skills and tags</h2>
                <p className="mt-2 font-mono text-xs leading-6 text-neutral-700 dark:text-[#888888]">
                  {[...new Set([...job.skills, ...job.tags])].slice(0, 16).join(", ")}
                </p>
              </div>
            )}

            {/* Inline apply (tablet/desktop; mobile uses sticky bottom bar) */}
            <div className="mt-6 hidden flex-col gap-2 sm:flex lg:hidden xl:flex">
              {applyBtn}
            </div>
          </article>

          <section
            aria-label="Job description"
            className="glass-card card-sheen rounded-xl border border-neutral-200 bg-white p-5 sm:p-7 lg:p-8 dark:border-[#262626] dark:bg-transparent"
          >
            <h2 className="headline text-2xl font-bold text-neutral-900 dark:text-white">About this role</h2>
            {job.excerpt && (
              <p className="mt-3 border-l-2 border-neutral-300 py-1 pl-3 pr-2 text-sm italic leading-6 text-neutral-700 dark:border-[#737373] dark:text-[#a3a3a3]">
                {job.excerpt}
              </p>
            )}
            <SafeHtml html={job.descriptionHtml} className="job-description mt-4" />
            <p className="mt-6 border-t border-neutral-200 pt-4 text-xs leading-5 text-neutral-500 dark:border-[#262626] dark:text-[#a3a3a3]">
              Listing details may change.{" "}
              <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-900 underline underline-offset-4 dark:text-white">
                check the original listing
              </a>
            </p>
          </section>
        </div>

        {/* Sticky aside (desktop) */}
        <aside className="hidden lg:block">
          <div className="glass-card card-sheen sticky top-24 flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5 dark:border-[#333333] dark:bg-transparent">
            {/* Company Mini Card */}
            <div className="flex items-center gap-3 border-b border-neutral-200 pb-3.5 dark:border-[#262626]">
              <CompanyLogo name={job.company} logo={job.logo} size="md" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/companies/${companySlug}`}
                  className="block truncate text-sm font-semibold text-neutral-900 transition hover:underline dark:text-white"
                >
                  {job.company}
                </Link>
                <p className="truncate text-xs text-neutral-500 dark:text-[#888888]">
                  {job.location || (job.remote ? "Remote" : "Worldwide")}
                </p>
              </div>
            </div>

            {job.salaryText && (
              <p className="border-b border-neutral-200 pb-3 dark:border-[#333333]">
                <span className="block font-mono text-xs text-neutral-500 dark:text-[#999999]">
                  reported pay
                </span>
                <span className="block text-lg font-semibold tabular-nums text-neutral-900 dark:text-white">
                  {job.salaryText}
                  {!job.salaryText.includes("/") && (
                    <span className="font-mono text-xs font-normal text-neutral-500 dark:text-[#999999]"> /yr</span>
                  )}
                </span>
              </p>
            )}
            {applyBtn}
            <p className="font-mono text-[11px] leading-5 text-neutral-500 dark:text-[#999999]">
              nothing is tracked here · confirm details on the original listing
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky bottom apply bar (mobile only) */}
      <div className="glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 px-4 py-3 sm:hidden dark:border-[#333333] dark:bg-black/85">
        <div className="mx-auto max-w-7xl">{applyBtn}</div>
      </div>
    </div>
  );
}
