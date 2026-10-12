"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/jobs",    label: "Jobs" },
  { href: "/about",   label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="glass-bar sticky top-0 z-40 border-b border-[#1f1f1f]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg text-sm font-semibold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-[#0070f3]"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
            <BriefcaseBusiness className="h-4 w-4" aria-hidden />
          </span>
          <span className="tracking-[-0.02em]">RemoteBoard</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-[#0070f3] ${
                  isActive(n.href)
                    ? "bg-[#1a1a1a] font-medium text-white"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/jobs"
            className="hidden items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e8e8e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070f3] sm:inline-flex"
          >
            Find jobs
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#222] text-[#888] transition hover:bg-[#111] hover:text-white focus-visible:outline-2 focus-visible:outline-[#0070f3] lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <nav
          aria-label="Mobile"
          className="glass-bar border-t border-[#1f1f1f] lg:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-0.5 px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive(n.href)
                      ? "bg-[#1a1a1a] font-medium text-white"
                      : "text-[#888] hover:bg-[#111] hover:text-white"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 sm:hidden">
              <Link
                href="/jobs"
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-white px-3 py-2.5 text-center text-sm font-medium text-black"
              >
                Find jobs
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
