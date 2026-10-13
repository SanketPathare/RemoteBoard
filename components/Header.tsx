"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/categories", label: "Categories" },
  { href: "/countries", label: "Countries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="glass-bar sticky top-0 z-40 border-b border-neutral-200 text-neutral-900 transition-colors duration-200 dark:border-[#262626] dark:text-white">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-5 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-sm text-[15px] font-semibold tracking-[-0.03em] text-neutral-900 transition-colors dark:text-white"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 text-neutral-900 shadow-sm transition-colors dark:border-[#404040] dark:bg-[#111] dark:text-white">
            <BriefcaseBusiness className="h-[17px] w-[17px]" aria-hidden />
          </span>
          <span>RemoteBoard</span>
        </Link>

        <span aria-hidden className="hidden h-7 w-px bg-neutral-200 lg:block dark:bg-[#262626]" />

        <ul className="hidden shrink-0 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative inline-flex h-10 items-center px-3 text-[14px] transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-neutral-900 after:transition-transform hover:text-neutral-900 hover:after:scale-x-100 dark:after:bg-white dark:hover:text-white ${
                  isActive(item.href)
                    ? "font-medium text-neutral-900 after:scale-x-100 dark:text-white"
                    : "text-neutral-600 dark:text-[#a3a3a3]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/jobs"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3.5 text-[13px] font-medium text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-[#404040] dark:bg-transparent dark:text-[#ededed] dark:hover:border-[#737373] dark:hover:bg-[#111]"
          >
            Browse jobs
          </Link>
          <Link
            href="/about"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-neutral-900 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
          >
            Learn
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-100 hover:text-black dark:border-[#333] dark:text-[#d4d4d4] dark:hover:border-[#525252] dark:hover:bg-[#111] dark:hover:text-white"
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
          className="glass-bar border-t border-neutral-200 px-4 pb-5 pt-3 md:hidden sm:px-6 dark:border-[#262626]"
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
                      ? "bg-neutral-100 font-semibold text-neutral-900 dark:bg-[#111] dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-[#a3a3a3] dark:hover:bg-[#111] dark:hover:text-white"
                  }`}
                >
                  {item.label}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-neutral-400 dark:text-[#737373]"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-200 pt-4 dark:border-[#262626]">
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-[#404040] dark:bg-transparent dark:text-[#ededed] dark:hover:bg-[#111]"
            >
              Browse jobs
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-neutral-900 px-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
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
