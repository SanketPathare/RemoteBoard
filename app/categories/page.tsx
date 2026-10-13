import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Cpu,
  Globe,
  Headset,
  HeartPulse,
  Layers,
  Megaphone,
  Palette,
  TrendingUp,
  Users,
} from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { groupJobsByCategory } from "@/lib/categories";
import { CategoriesExplorer } from "@/components/CategoriesExplorer";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Job Categories & Disciplines | RemoteBoard",
  description:
    "Browse open remote positions categorized by department and discipline. Explore engineering, design, marketing, sales, product, and AI roles.",
};

const TOP_CLUSTERS = [
  { name: "Engineering", icon: Code2, query: "Engineering", desc: "Software, Frontend, Backend & DevOps" },
  { name: "Design", icon: Palette, query: "Design", desc: "Product, UI/UX & Brand Creative" },
  { name: "Product", icon: Layers, query: "Product", desc: "Product Management & Technical Leads" },
  { name: "Data & AI", icon: Cpu, query: "Data", desc: "Machine Learning, Analytics & Data Science" },
  { name: "Sales & BD", icon: TrendingUp, query: "Sales", desc: "Account Execs, GTM & Business Dev" },
  { name: "Marketing", icon: Megaphone, query: "Marketing", desc: "Growth, Content, Social & SEO" },
  { name: "Support", icon: Headset, query: "Support", desc: "Customer Success & Operations Support" },
  { name: "Healthcare", icon: HeartPulse, query: "Healthcare", desc: "Clinical Delivery & Medical Tech" },
];

export default async function CategoriesPage() {
  const { jobs } = await aggregateJobs();
  const categories = groupJobsByCategory(jobs);
  const totalRoles = categories.reduce((acc, c) => acc + c.jobCount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      {/* ── Hero Header ── */}
      <div className="mb-8 max-w-3xl">
        <p className="font-mono text-xs text-[#999999]">$ directory / categories</p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-black sm:text-4xl dark:text-white">
          Browse jobs by category
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#666666] dark:text-[#888888]">
          Explore open positions structured by department, skill, and industry. Find roles that fit
          your exact expertise across hundreds of verified hiring employers.
        </p>

        {/* Quick stat chips */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-1.5 text-xs text-[#a3a3a3]">
            <Layers className="h-3.5 w-3.5 text-white" />
            <span>
              <strong className="font-semibold text-white">{categories.length}</strong> active categories
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-1.5 text-xs text-[#a3a3a3]">
            <Users className="h-3.5 w-3.5 text-white" />
            <span>
              <strong className="font-semibold text-white">{totalRoles}</strong> categorized positions
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-1.5 text-xs text-[#a3a3a3]">
            <Globe className="h-3.5 w-3.5 text-white" />
            <span>100% remote & distributed</span>
          </div>
        </div>
      </div>

      {/* ── Featured Quick-Access Disciplines ── */}
      <section aria-label="Top Disciplines" className="mb-10">
        <h2 className="sr-only">Top Disciplines</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {TOP_CLUSTERS.map((c) => (
            <Link
              key={c.name}
              href={`/jobs?category=${encodeURIComponent(c.query)}`}
              className="glass-card card-sheen group flex flex-col items-center justify-center rounded-xl border border-[#262626] bg-[#0c0c0c] p-3.5 text-center transition hover:-translate-y-0.5 hover:border-white hover:bg-[#141414]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#141414] text-white transition group-hover:border-white group-hover:bg-white group-hover:text-black">
                <c.icon className="h-4 w-4" />
              </div>
              <span className="mt-2 text-xs font-semibold text-white group-hover:text-white">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Interactive Category Explorer ── */}
      <CategoriesExplorer initialCategories={categories} />
    </div>
  );
}
