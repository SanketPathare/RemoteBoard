import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Headset,
  Megaphone,
  Palette,
  Zap,
  Globe,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { aggregateJobs } from "@/lib/aggregate";
import { SOURCE_META } from "@/lib/types";
import { JobList } from "@/components/JobList";
import { HomeSearch } from "@/components/HomeSearch";
import { FilingsTicker } from "@/components/FilingsTicker";

export const metadata: Metadata = {
  title: "RemoteBoard — Live Remote Jobs from Trusted Sources",
  description:
    "Search live remote jobs from Jobicy, Himalayas, Arbeitnow, Remote OK, and We Work Remotely. Filter by location, category, and salary. Every Apply button opens the original posting.",
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
    desc: "Aggregated from five trusted boards, refreshed every 10 minutes with no manual curation.",
  },
  {
    icon: Globe,
    title: "100% remote",
    desc: "Every listing is confirmed remote. Location constraints shown exactly as filed.",
  },
  {
    icon: ShieldCheck,
    title: "No sign-up",
    desc: "Zero accounts, zero tracking. Browse freely and apply on the original provider's page.",
  },
  {
    icon: BarChart3,
    title: "Pay transparency",
    desc: "Salary shown when the provider discloses it — never estimated, never hidden.",
  },
];

export default async function HomePage() {
  const { jobs, errors, counts } = await aggregateJobs();
  const latest = jobs.slice(0, 9);
  const total = jobs.length;
  const ticks = jobs.slice(0, 12).map((j) => ({
    title: j.title,
    company: j.company,
    postedAt: j.postedAt,
    detailUrl: j.detailUrl,
    sourceName: j.sourceName,
  }));

  return (
    <div className="bg-black">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#1f1f1f] bg-black">
        <div aria-hidden className="hero-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 text-center sm:px-6 sm:pb-28 sm:pt-32">

          {/* Live badge */}
          <div className="anim-fade-up inline-flex items-center gap-2.5 rounded-full border border-[#333] bg-[#0a0a0a]/90 px-3.5 py-1.5 text-xs">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="font-mono text-[#a3a3a3]">
              {total > 0 ? (
                <><span className="badge-live font-semibold">{total.toLocaleString()}</span>{" "}
                <span>open positions</span></>
              ) : (
                <span>live positions</span>
              )}
            </span>
            <span className="text-[#525252]">·</span>
            <span className="font-mono text-[#737373]">no sign-up</span>
          </div>

          {/* Headline */}
          <h1 className="headline anim-fade-up anim-delay-1 mx-auto mt-9 max-w-5xl text-[clamp(3.25rem,8vw,6.75rem)] font-semibold leading-[0.98]">
            <span className="headline-gradient">Find work</span>
            <br />
            <span className="headline-gradient">worth doing.</span>
          </h1>

          {/* Sub */}
          <p className="anim-fade-up anim-delay-2 mx-auto mt-7 max-w-2xl text-base leading-7 text-[#a3a3a3] sm:text-lg sm:leading-8">
            One board for every live remote posting. Traced to its source,
            with pay and eligibility shown exactly as reported.
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
            <span className="shrink-0 font-mono text-xs text-[#737373]">Popular:</span>
            {POPULAR.map((p) => (
              <Link
                key={p}
                href={`/jobs?q=${encodeURIComponent(p)}`}
                className="shrink-0 rounded-full border border-[#333] px-2.5 py-1 font-mono text-xs text-[#a3a3a3] transition hover:border-[#737373] hover:text-white"
              >
                {p}
              </Link>
            ))}
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
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#262626] bg-[#262626] sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <li
              key={i}
              className="feature-card glass-card card-sheen group flex flex-col gap-3 bg-[#080808] p-7"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#333] bg-[#111] text-[#a3a3a3] transition group-hover:border-[#737373] group-hover:text-white">
                <f.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                {f.title}
              </span>
              <span className="text-[13px] leading-6 text-[#a3a3a3]">
                {f.desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="divider mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* ── Categories ── */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#a3a3a3]">Browse by role</p>
            <h2
              id="categories-heading"
              className="subhead mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Find your discipline
            </h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#d4d4d4] hover:text-white hover:underline"
          >
            All jobs <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.q}>
              <Link
                href={`/jobs?q=${encodeURIComponent(c.q)}`}
                className="feature-card glass-card card-sheen group block rounded-xl border border-[#262626] p-6 transition hover:border-[#525252]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#333] bg-[#111] text-[#a3a3a3] transition group-hover:border-[#737373] group-hover:text-white">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-5 block text-[15px] font-semibold tracking-tight text-white">
                  {c.label}
                </span>
                <span className="mt-1 block text-[13px] leading-5 text-[#a3a3a3]">
                  {c.blurb}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                  Browse <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="divider mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* ── Sources ── */}
      <section
        aria-label="Job sources"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <p className="font-mono text-xs text-[#737373]">Aggregated from</p>
        <ul className="rail mt-4 flex flex-wrap gap-2">
          {(Object.keys(SOURCE_META) as (keyof typeof SOURCE_META)[]).map((s) => (
            <li key={s}>
              <Link
                href={`/jobs?source=${s}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#0a0a0a] px-3.5 py-1.5 text-xs font-medium text-[#a3a3a3] transition hover:border-[#737373] hover:text-white"
              >
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full source-dot-${s}`} />
                {SOURCE_META[s].label}
                <span className="font-mono text-[11px] text-[#737373]">
                  {counts[s] || 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="divider mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* ── Latest filings ── */}
      <section
        aria-labelledby="latest-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#a3a3a3]">Just filed</p>
            <h2
              id="latest-heading"
              className="subhead mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Latest positions
            </h2>
            <p className="mt-2 font-mono text-xs text-[#737373]">
              {errors.length > 0 ? (
                <>partial results · {errors.length} provider{errors.length === 1 ? "" : "s"} unreachable</>
              ) : (
                <>newest first · refreshed every 10 minutes</>
              )}
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4d4d4]"
          >
            View all <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {latest.length > 0 ? (
          <JobList jobs={latest} />
        ) : (
          <div className="rounded-xl border border-dashed border-[#404040] bg-[#080808] p-14 text-center">
            <p className="text-sm leading-7 text-[#a3a3a3]">
              Providers are temporarily unreachable. Try again in a minute, or browse directly on{" "}
              <a className="font-medium text-white underline underline-offset-4" href="https://jobicy.com">Jobicy</a>{" "}
              and{" "}
              <a className="font-medium text-white underline underline-offset-4" href="https://himalayas.app">Himalayas</a>.
            </p>
          </div>
        )}
      </section>

      {/* ── CTA banner ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-[#262626] bg-[#080808] px-8 py-16 text-center">
          <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
          <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative">
            <p className="font-mono text-xs text-[#a3a3a3]">RemoteBoard</p>
            <h2 className="headline mx-auto mt-4 max-w-xl text-2xl font-bold sm:text-3xl">
              <span className="headline-gradient">Ready to find your next remote role?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#a3a3a3]">
              Browse {total > 0 ? total.toLocaleString() : "thousands of"} live positions across
              engineering, design, marketing and more — no account required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/jobs" className="btn-primary min-h-[48px] gap-2 px-7 text-base">
                Start browsing <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/about" className="btn-secondary min-h-[48px] px-7 text-base">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
