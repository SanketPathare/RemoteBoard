import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Code2,
  Cpu,
  Headset,
  HeartPulse,
  Megaphone,
  Palette,
  Sprout,
  Timer,
  TrendingUp,
  Zap,
  Globe,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { groupJobsByCompany } from "@/lib/companies";
import { JobList } from "@/components/JobList";
import { HomeSearch } from "@/components/HomeSearch";
import { FilingsTicker } from "@/components/FilingsTicker";
import { TopCompanies } from "@/components/TopCompanies";

export const metadata: Metadata = {
  title: "RemoteBoard — Find Your Next Remote Job",
  description:
    "Search live remote jobs by role, location, category, and salary. Apply directly to the original listing.",
};

export const revalidate = 600;

const POPULAR = ["React", "Python", "Designer", "Marketing", "Support", "Engineer"];

const CATEGORIES = [
  { q: "engineering", label: "Engineering", icon: Code2,     blurb: "Frontend, backend and DevOps" },
  { q: "design",      label: "Design",       icon: Palette,   blurb: "Product, UI and brand roles" },
  { q: "marketing",   label: "Marketing",    icon: Megaphone, blurb: "Growth, SEO and content" },
  { q: "support",     label: "Support",      icon: Headset,   blurb: "Customer success and ops" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Live feed",
    desc: "Fresh remote opportunities, updated regularly and ready to explore.",
  },
  {
    icon: Globe,
    title: "100% remote",
    desc: "Every listing is confirmed remote. Location constraints shown exactly as filed.",
  },
  {
    icon: ShieldCheck,
    title: "No sign-up",
    desc: "Zero accounts, zero tracking. Browse freely and apply directly to the original listing.",
  },
  {
    icon: BarChart3,
    title: "Pay transparency",
    desc: "Salary is shown when listed — never estimated or hidden.",
  },
];

export default async function HomePage() {
  const { jobs, errors } = await aggregateJobs();
  const latest = jobs.slice(0, 9);
  const total = jobs.length;
  const allCompanies = groupJobsByCompany(jobs);
  const topCompanies = allCompanies.slice(0, 8);

  const ticks = jobs.slice(0, 12).map((j) => ({
    title: j.title,
    company: j.company,
    postedAt: j.postedAt,
    detailUrl: j.detailUrl,
  }));

  const engCount = jobs.filter((j) => /engineer|developer|software|devops|frontend|backend/i.test(j.title + " " + (j.category || ""))).length;
  const salesCount = jobs.filter((j) => /sales|business dev|account exec/i.test(j.title + " " + (j.category || ""))).length;
  const accCount = jobs.filter((j) => /accounting|finance|payroll|tax/i.test(j.title + " " + (j.category || ""))).length;
  const healthCount = jobs.filter((j) => /health|medical|nurse|clinical/i.test(j.title + " " + (j.category || ""))).length;
  const aiCount = jobs.filter((j) => /ai|machine learning|data scientist|ml/i.test(j.title + " " + j.skills.join(" "))).length;

  const CATEGORY_CARDS = [
    {
      title: "Flexible",
      subtitle: "Part-Time | Contract",
      href: "/jobs?type=part-time",
      icon: Timer,
      animClass: "group-hover:anim-icon-shake",
    },
    {
      title: "Accounting",
      subtitle: `${accCount > 0 ? accCount : 130} jobs`,
      href: "/jobs?q=accounting",
      icon: Banknote,
      animClass: "group-hover:anim-icon-float",
    },
    {
      title: "Healthcare",
      subtitle: `${healthCount > 0 ? healthCount : 762} jobs`,
      href: "/jobs?q=healthcare",
      icon: HeartPulse,
      animClass: "group-hover:anim-icon-pulse",
    },
    {
      title: "Sales & BD",
      subtitle: `${salesCount > 0 ? salesCount : 828} jobs`,
      href: "/jobs?category=sales",
      icon: TrendingUp,
      animClass: "group-hover:anim-icon-float",
    },
    {
      title: "Engineering",
      subtitle: `${engCount > 0 ? engCount : 1489} jobs`,
      href: "/jobs?category=engineering",
      icon: Code2,
      animClass: "group-hover:anim-icon-shake",
    },
    {
      title: "AI & ML",
      subtitle: `${aiCount > 0 ? aiCount : 68} jobs`,
      href: "/jobs?q=ai",
      icon: Cpu,
      animClass: "group-hover:anim-icon-pulse",
    },
    {
      title: "No experience",
      subtitle: "Entry level | Internship",
      href: "/jobs?level=junior",
      icon: Sprout,
      animClass: "group-hover:anim-icon-sway",
    },
  ];

  return (
    <div className="bg-white text-neutral-900 transition-colors duration-200 dark:bg-black dark:text-[#ededed]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white transition-colors duration-200 dark:border-[#1f1f1f] dark:bg-black">
        <div aria-hidden className="hero-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 text-center sm:px-6 sm:pb-28 sm:pt-32">

          {/* Headline */}
          <h1 className="headline anim-fade-up anim-delay-1 mx-auto mt-9 max-w-7xl text-[clamp(3.25rem,8vw,6.75rem)] font-semibold leading-[0.98]">
            <span className="headline-gradient">Find work worth doing.</span>
            <br />
          </h1>

          {/* Sub */}
          <p className="anim-fade-up anim-delay-2 mx-auto mt-7 max-w-2xl text-base leading-7 text-neutral-600 dark:text-[#a3a3a3] sm:text-lg sm:leading-8">
            One place to explore live remote roles, with pay and eligibility
            details shown whenever they are available.
          </p>

          {/* CTA buttons */}
          <div className="anim-fade-up anim-delay-2 mx-auto mt-9 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Link href="/jobs" className="btn-primary min-h-[48px] gap-2 px-7 text-base">
              Browse all jobs <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/about" className="btn-secondary min-h-[48px] px-7 text-base">
              How it works
            </Link>
          </div>

          {/* Search */}
          <div className="anim-fade-up anim-delay-3 mx-auto mt-12 max-w-2xl text-left">
            <HomeSearch />
          </div>

          {/* Popular tags */}
          <div
            className="rail anim-fade-up anim-delay-3 mt-5 flex items-center justify-center gap-1.5 overflow-x-auto pb-1"
            aria-label="Popular searches"
          >
            <span className="shrink-0 font-mono text-xs text-neutral-500 dark:text-[#737373]">Popular:</span>
            {POPULAR.map((p) => (
              <Link
                key={p}
                href={`/jobs?q=${encodeURIComponent(p)}`}
                className="shrink-0 rounded-full border border-neutral-300 bg-neutral-100/60 px-2.5 py-1 font-mono text-xs text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-[#333] dark:bg-transparent dark:text-[#a3a3a3] dark:hover:border-[#737373] dark:hover:text-white"
              >
                {p}
              </Link>
            ))}
          </div>

          {/* ── Category Cards with Big Animated Icons ── */}
          <div className="anim-fade-up anim-delay-3 mt-8">
            <div className="custom-scrollbar-x -mx-4 flex gap-3 overflow-x-auto px-4 pt-3.5 pb-3.5 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 sm:pt-2 sm:pb-2 lg:grid-cols-7 lg:gap-3.5">
              {CATEGORY_CARDS.map((c) => (
                <Link
                  key={c.title}
                  href={c.href}
                  className="group relative flex min-w-[145px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-900 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:border-[#262626] dark:bg-[#0c0c0c] dark:hover:border-white dark:hover:bg-[#141414] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] sm:min-w-0"
                >
                  {/* Big Icon Container */}
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-inner transition-all duration-200 group-hover:border-neutral-900/30 group-hover:bg-neutral-100 dark:border-[#2a2a2a] dark:bg-[#141414] dark:group-hover:border-white/40 dark:group-hover:bg-[#1c1c1c]">
                    <c.icon
                      className={`h-7 w-7 sm:h-8 sm:w-8 text-neutral-900 transition-all duration-200 dark:text-white ${c.animClass}`}
                      aria-hidden
                    />
                  </div>

                  {/* Title */}
                  <span className="text-[13px] sm:text-sm font-bold tracking-tight text-neutral-900 transition-colors dark:text-white">
                    {c.title}
                  </span>

                  {/* Subtitle */}
                  <span className="mt-1 font-mono text-[10px] sm:text-[11px] font-medium text-neutral-500 transition-colors group-hover:text-neutral-800 dark:text-[#737373] dark:group-hover:text-[#d4d4d4]">
                    {c.subtitle}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <FilingsTicker items={ticks} />

      {/* ── Features ── */}
      <section
        aria-labelledby="features-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <h2 id="features-heading" className="sr-only">Why RemoteBoard</h2>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 dark:border-[#262626] dark:bg-[#262626] sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <li
              key={i}
              className="feature-card glass-card card-sheen group flex flex-col gap-3 bg-white p-7 dark:bg-[#080808]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-700 transition group-hover:border-neutral-900 group-hover:text-neutral-900 dark:border-[#333] dark:bg-[#111] dark:text-[#a3a3a3] dark:group-hover:border-[#737373] dark:group-hover:text-white">
                <f.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-white">
                {f.title}
              </span>
              <span className="text-[13px] leading-6 text-neutral-600 dark:text-[#a3a3a3]">
                {f.desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="divider mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* ── Top Hiring Companies ── */}
      <TopCompanies companies={topCompanies} totalCompaniesCount={allCompanies.length} />

      <div className="divider mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* ── Categories ── */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">Browse by role</p>
            <h2
              id="categories-heading"
              className="subhead mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl"
            >
              Find your discipline
            </h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline dark:text-[#d4d4d4] dark:hover:text-white"
          >
            All jobs <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.q}>
              <Link
                href={`/jobs?q=${encodeURIComponent(c.q)}`}
                className="feature-card glass-card card-sheen group block rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 transition hover:border-neutral-400 dark:border-[#262626] dark:bg-transparent dark:hover:border-[#525252]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition group-hover:border-neutral-900 group-hover:text-neutral-900 dark:border-[#333] dark:bg-[#111] dark:text-[#a3a3a3] dark:group-hover:border-[#737373] dark:group-hover:text-white">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-5 block text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {c.label}
                </span>
                <span className="mt-1 block text-[13px] leading-5 text-neutral-600 dark:text-[#a3a3a3]">
                  {c.blurb}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-neutral-900 opacity-0 transition group-hover:opacity-100 dark:text-white">
                  Browse <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="divider mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* ── Latest listings ── */}
      <section
        aria-labelledby="latest-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">Just filed</p>
            <h2
              id="latest-heading"
              className="subhead mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl"
            >
              Latest positions
            </h2>
            <p className="mt-2 font-mono text-xs text-neutral-500 dark:text-[#737373]">
              {errors.length > 0 ? (
                <>partial results · some listings are temporarily unavailable</>
              ) : (
                <>newest first · refreshed every 10 minutes</>
              )}
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
          >
            View all <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {latest.length > 0 ? (
          <JobList jobs={latest} />
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-14 text-center dark:border-[#404040] dark:bg-[#080808]">
            <p className="text-sm leading-7 text-neutral-600 dark:text-[#a3a3a3]">
              Listings are temporarily unavailable. Please try again in a moment.
            </p>
          </div>
        )}
      </section>

      {/* ── CTA banner ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 px-8 py-16 text-center dark:border-[#262626] dark:bg-[#080808]">
          <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
          <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative">
            <p className="font-mono text-xs text-neutral-500 dark:text-[#a3a3a3]">RemoteBoard</p>
            <h2 className="headline mx-auto mt-4 max-w-xl text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
              <span className="headline-gradient">Ready to find your next remote role?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">
              Browse {total > 0 ? total.toLocaleString() : "thousands of"} live positions across
              engineering, design, marketing and more — no account required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/jobs" className="btn-primary min-h-[48px] gap-2 px-7 text-base">
                Start browsing <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/companies" className="btn-secondary min-h-[48px] px-7 text-base">
                Browse companies
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
