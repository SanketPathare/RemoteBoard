import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findJob, isSourceName } from "@/lib/aggregate";
import { SOURCE_META } from "@/lib/types";
import { JobDetail } from "@/components/JobDetail";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ source: string; id: string }>;
}): Promise<Metadata> {
  const { source, id } = await params;
  if (!isSourceName(source)) return { title: "Job not found" };
  const job = await findJob(source, decodeURIComponent(id));
  if (!job) return { title: "Job not found or expired" };
  return {
    title: `${job.title} at ${job.company}`,
    description: job.excerpt || `${job.title} at ${job.company} via ${job.sourceName}. Apply on the original posting.`,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ source: string; id: string }>;
}) {
  const { source, id } = await params;
  if (!isSourceName(source)) notFound();
  const job = await findJob(source, decodeURIComponent(id));

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="font-mono text-xs text-[#999999]">expired</p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-black dark:text-white">
          This filing is no longer available
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#666666] dark:text-[#888888]">
          The provider may have filled or expired the role. Feeds change
          frequently and nothing is stored here. Browse current filings or open
          the original source directly.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/jobs"
            className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#333333] dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA]"
          >
            Browse current filings
          </Link>
          <a
            href={SOURCE_META[source].siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-[#EAEAEA] px-5 py-2.5 text-sm font-medium text-black transition hover:border-[#999999] dark:border-[#333333] dark:text-white"
          >
            Open {SOURCE_META[source].label}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <JobDetail job={job} />
    </div>
  );
}
