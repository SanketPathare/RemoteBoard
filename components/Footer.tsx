import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Mail } from "lucide-react";
import { ThemePillToggle } from "./ThemeToggle";

const PAGES = [
  { href: "/jobs",       label: "Browse jobs",       desc: "Search and filter the live feed" },
  { href: "/companies",  label: "Companies",         desc: "Explore top remote-first teams" },
  { href: "/categories", label: "Categories",        desc: "Browse jobs by department & role" },
  { href: "/countries",  label: "Countries",         desc: "Browse jobs by country & region" },
  { href: "/about",      label: "About RemoteBoard", desc: "How the job board works" },
  { href: "/contact",    label: "Contact",            desc: "Report a broken link" },
  { href: "/privacy",    label: "Privacy policy",     desc: "No accounts, no tracking" },
];

const EMPLOYER_PORTALS = [
  {
    href: "https://careers.hitachi.com/jobs",
    label: "Hitachi Careers — all jobs",
    desc: "Global technology, energy & rail roles",
  },
  {
    href: "https://careers.hitachi.com/jobs?filter[country]=India",
    label: "Hitachi India jobs",
    desc: "Positions across Bengaluru, Pune & remote",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-800 transition-colors duration-200 dark:border-[#262626] dark:bg-black dark:text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1.1fr_1fr] lg:px-8">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-[-0.02em] text-neutral-900 transition-colors dark:text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-black">
              <BriefcaseBusiness className="h-4 w-4" aria-hidden />
            </span>
            RemoteBoard
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">
            A simple place to find remote work. No accounts, no database.
            Apply directly to the original job listing.
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer navigation">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
            Explore
          </p>
          <ul className="space-y-1">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group block rounded-md px-2 py-1.5 transition hover:bg-neutral-200/60 dark:hover:bg-[#111]"
                >
                  <span className="block text-sm text-neutral-700 transition group-hover:text-neutral-900 dark:text-[#a3a3a3] dark:group-hover:text-white">
                    {p.label}
                  </span>
                  <span className="block text-xs text-neutral-500 dark:text-[#737373]">{p.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Career Portals */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
            Featured Portals
          </p>
          <ul className="space-y-1">
            {EMPLOYER_PORTALS.map((portal) => (
              <li key={portal.href}>
                <a
                  href={portal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-md px-2 py-1.5 transition hover:bg-neutral-200/60 dark:hover:bg-[#111]"
                >
                  <span className="flex items-center gap-1 text-sm text-neutral-700 transition group-hover:text-neutral-900 dark:text-[#a3a3a3] dark:group-hover:text-white">
                    <span>{portal.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition group-hover:text-neutral-900 dark:text-[#737373] dark:group-hover:text-white" />
                  </span>
                  <span className="block text-xs text-neutral-500 dark:text-[#737373]">{portal.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#737373]">
            Good to know
          </p>
          <ul className="space-y-3 text-sm leading-6 text-neutral-600 dark:text-[#a3a3a3]">
            <li>Check the original listing for the latest role details.</li>
            <li>Missing pay means undisclosed, never zero.</li>
            <li>Worldwide appears only when the listing confirms it.</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-200 dark:border-[#262626]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-[#737373]">
          <p>© {new Date().getFullYear()} RemoteBoard. Find your next remote role.</p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Icon buttons */}
            <div className="flex items-center gap-1.5">
              <a
                href="https://github.com/SanketPathare/RemoteBoard"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                title="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-[#262626] dark:bg-[#111111] dark:text-[#a3a3a3] dark:hover:border-[#404040] dark:hover:bg-[#1a1a1a] dark:hover:text-white"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (Twitter)"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-[#262626] dark:bg-[#111111] dark:text-[#a3a3a3] dark:hover:border-[#404040] dark:hover:bg-[#1a1a1a] dark:hover:text-white"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <Link
                href="/contact"
                aria-label="Contact"
                title="Contact"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-[#262626] dark:bg-[#111111] dark:text-[#a3a3a3] dark:hover:border-[#404040] dark:hover:bg-[#1a1a1a] dark:hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <span className="hidden h-4 w-px bg-neutral-300 sm:block dark:bg-[#262626]" aria-hidden="true" />

            {/* Theme 3-way toggle pill matching user screenshot */}
            <ThemePillToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

