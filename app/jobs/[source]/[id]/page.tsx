import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findJob, isSourceName } from "@/lib/aggregate";
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
    description: job.excerpt || `${job.title} at ${job.company}. Apply directly to the original listing.`,
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
        <p className="font-mono text-xs text-neutral-500 dark:text-[#999999]">expired</p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white">
          This listing is no longer available
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-[#888888]">
          This role may have been filled or expired. Listings change
          frequently and nothing is stored here. Browse current opportunities.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/jobs"
            className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA]"
          >
            Browse current jobs
          </Link>
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
