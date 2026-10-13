"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="glass-bar sticky top-0 z-40 border-b border-[#262626] text-white">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-5 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-sm text-[15px] font-semibold tracking-[-0.03em] text-white"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#404040] bg-[#111] text-white">
            <BriefcaseBusiness className="h-[17px] w-[17px]" aria-hidden />
          </span>
          <span>RemoteBoard</span>
        </Link>

        <span aria-hidden className="hidden h-7 w-px bg-[#262626] lg:block" />

        <ul className="hidden shrink-0 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative inline-flex h-10 items-center px-3 text-[14px] transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:text-white hover:after:scale-x-100 ${
                  isActive(item.href)
                    ? "font-medium text-white after:scale-x-100"
                    : "text-[#a3a3a3]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            href="/jobs"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#404040] px-3.5 text-[13px] font-medium text-[#ededed] transition hover:border-[#737373] hover:bg-[#111]"
          >
            Browse jobs
          </Link>
          <Link
            href="/about"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-white px-4 text-[13px] font-semibold text-black transition hover:bg-[#d4d4d4]"
          >
            Learn
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <div className="ml-auto flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#333] text-[#d4d4d4] transition hover:border-[#525252] hover:bg-[#111] hover:text-white"
          >
            {open ? (
              <X className="h-[18px] w-[18px]" aria-hidden />
            ) : (
              <Menu className="h-[18px] w-[18px]" aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-navigation"
          className="glass-bar border-t border-[#262626] px-4 pb-5 pt-3 md:hidden sm:px-6"
        >
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center justify-between rounded-md px-3 text-sm transition ${
                    isActive(item.href)
                      ? "bg-[#111] font-semibold text-white"
                      : "text-[#a3a3a3] hover:bg-[#111] hover:text-white"
                  }`}
                >
                  {item.label}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-[#737373]"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#262626] pt-4">
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#404040] px-3 text-sm font-medium text-[#ededed] transition hover:bg-[#111]"
            >
              Browse jobs
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-black transition hover:bg-[#d4d4d4]"
            >
              Learn more
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
