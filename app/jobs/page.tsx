import type { Metadata } from "next";
import { JobsExplorer } from "@/components/JobsExplorer";
import { isSourceName } from "@/lib/aggregate";

export const metadata: Metadata = {
  title: "Browse Remote Jobs",
  description:
    "Search and filter live remote jobs by keyword, location, category, employment type, and salary. Newest first, with real Apply links to the original postings.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string }>;
}) {
  const { q, source } = await searchParams;
  const initialSource = source && isSourceName(source) ? source : "all";
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono text-xs text-[#999999]">
          $ live feed
        </p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-black sm:text-4xl dark:text-white">
          Browse remote jobs
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#666666] dark:text-[#888888]">
          Live results from five providers. Filters apply instantly. The feed
          is fetched once per source, not on every keystroke.
        </p>
      </div>
      <div className="mt-5 sm:mt-6">
        <JobsExplorer
          key={`${q || ""}::${initialSource}`}
          initialQuery={q || ""}
          initialSource={initialSource}
        />
      </div>
    </div>
  );
}
