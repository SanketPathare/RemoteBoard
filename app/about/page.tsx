import type { Metadata } from "next";
import { BadgeCheck, BriefcaseBusiness, Globe2, Link2, Search, UserX } from "lucide-react";

export const metadata: Metadata = {
  title: "About RemoteBoard",
  description:
    "A simple, privacy-minded way to discover remote roles and apply directly to the original listing.",
};

const FEATURES = [
  {
    icon: Search,
    title: "One place to search",
    description: "Explore remote opportunities by title, location, category, and employment type.",
  },
  {
    icon: Link2,
    title: "Apply directly",
    description: "Continue to the original listing when you are ready to apply.",
  },
  {
    icon: BadgeCheck,
    title: "Clear job details",
    description: "See salary and eligibility information when it is available in the listing.",
  },
  {
    icon: Globe2,
    title: "Remote opportunities",
    description: "Find roles across a range of locations, teams, and disciplines.",
  },
  {
    icon: UserX,
    title: "No account needed",
    description: "Browse and search without creating an account or profile.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Built for your next move",
    description: "A focused job board to help you spend less time searching and more time finding the right role.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">About RemoteBoard</p>
        <h1 className="headline mt-3 text-4xl font-semibold text-neutral-900 sm:text-5xl dark:text-white">
          Find remote work that fits.
        </h1>
        <p className="mt-5 text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8 dark:text-[#a3a3a3]">
          RemoteBoard makes it easier to discover remote roles, compare the
          details that matter, and continue to the original listing when you
          are ready to apply. Browse freely — no account or profile required.
        </p>
      </div>

      <h2 className="headline mt-14 text-2xl font-semibold text-neutral-900 sm:text-3xl dark:text-white">
        A simpler way to find your next role
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <li
            key={feature.title}
            className="glass-card feature-card flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-transparent"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-800 dark:border-[#333] dark:bg-[#111] dark:text-[#d4d4d4]">
              <feature.icon className="h-4 w-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-neutral-900 dark:text-white">
                {feature.title}
              </span>
              <span className="mt-1 block text-[13px] leading-6 text-neutral-600 dark:text-[#a3a3a3]">
                {feature.description}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm leading-6 text-neutral-600 dark:border-[#262626] dark:bg-[#080808] dark:text-[#a3a3a3]">
        Job details can change. Check the original listing for the latest
        information before applying.
      </p>
    </div>
  );
}
