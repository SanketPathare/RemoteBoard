import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Compass,
  Home,
} from "lucide-react";

export default function NotFound() {
  const suggestions = [
    { label: "Engineering jobs", href: "/jobs?category=engineering" },
    { label: "Design positions", href: "/jobs?category=design" },
    { label: "Top hiring companies", href: "/companies" },
    { label: "High-paying roles", href: "/jobs?minSalary=100000" },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-68px)] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24">
      {/* ── Ambient Background Lighting ── */}
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl"
      />

      {/* ── Animated Center Icon Beacon ── */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Pulsing beacon waves */}
        <div
          aria-hidden
          className="absolute h-32 w-32 rounded-full border border-white/10 animate-ping opacity-20 [animation-duration:3s]"
        />
        <div
          aria-hidden
          className="absolute h-24 w-24 rounded-full border border-dashed border-white/20 animate-spin [animation-duration:20s]"
        />

        {/* Core Icon Badge */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[#333] bg-[#0c0c0c] shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-transform duration-300 hover:scale-105">
          <Compass className="anim-icon-pulse h-10 w-10 text-white" aria-hidden />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-black bg-emerald-500" />
          </span>
        </div>
      </div>

      {/* ── Status Kicker ── */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#111] px-3.5 py-1 font-mono text-xs text-[#a3a3a3] shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>$ 404 / route_not_found</span>
      </div>

      {/* ── Giant 404 Typography ── */}
      <div className="mt-4 select-none">
        <span className="headline-gradient block font-mono text-7xl font-black tracking-tighter sm:text-8xl md:text-9xl">
          404
        </span>
      </div>

      {/* ── Title & Message ── */}
      <h1 className="headline mx-auto mt-2 max-w-lg text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Lost in the remote wilderness?
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#a3a3a3] sm:text-base">
        The page or expired job listing you&apos;re looking for doesn&apos;t exist.
        Listings change quickly, but hundreds of live positions are open right now.
      </p>

      {/* ── Action Buttons ── */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/jobs"
          className="btn-primary group inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 text-sm font-semibold sm:w-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>Browse live jobs</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/companies"
          className="btn-secondary inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 text-sm font-medium sm:w-auto"
        >
          <Building2 className="h-4 w-4 text-[#a3a3a3]" />
          <span>Explore companies</span>
        </Link>

        <Link
          href="/"
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-[#262626] bg-[#0d0d0d] px-4 font-mono text-xs text-[#a3a3a3] transition hover:border-[#555] hover:text-white sm:w-auto"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* ── Suggested Quick Routes ── */}
      <div className="mt-12 border-t border-[#1f1f1f] pt-8">
        <p className="font-mono text-xs text-[#737373]">Popular destinations to get you back on track:</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {suggestions.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-full border border-[#262626] bg-[#0c0c0c] px-3.5 py-1 text-xs text-[#a3a3a3] transition hover:-translate-y-0.5 hover:border-white hover:text-white"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
