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
    <header className="glass-bar sticky top-0 z-40 border-b border-[#262626]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg text-[15px] font-semibold tracking-tight text-white"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#404040] bg-[#111] text-white">
            <BriefcaseBusiness className="h-4 w-4" aria-hidden />
          </span>
          <span className="tracking-[-0.02em]">RemoteBoard</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-[13px] transition ${
                  isActive(n.href)
                    ? "font-medium text-white"
                    : "text-[#a3a3a3] hover:text-white"
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
            className="hidden min-h-9 items-center gap-1.5 rounded-md border border-white bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:border-[#d4d4d4] hover:bg-[#d4d4d4] sm:inline-flex"
          >
            Find jobs
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#333] text-[#a3a3a3] transition hover:border-[#525252] hover:bg-[#111] hover:text-white md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <nav
          aria-label="Mobile"
          className="glass-bar border-t border-[#262626] md:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 text-sm transition ${
                    isActive(n.href)
                      ? "bg-[#111] font-medium text-white"
                      : "text-[#a3a3a3] hover:bg-[#111] hover:text-white"
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
                className="block rounded-md bg-white px-3 py-2.5 text-center text-sm font-semibold text-black"
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
