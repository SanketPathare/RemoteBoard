import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";

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
    <footer className="border-t border-[#262626] bg-black">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1.1fr_1fr] lg:px-8">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-[-0.02em] text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
              <BriefcaseBusiness className="h-4 w-4" aria-hidden />
            </span>
            RemoteBoard
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#a3a3a3]">
            A simple place to find remote work. No accounts, no database.
            Apply directly to the original job listing.
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer navigation">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">
            Explore
          </p>
          <ul className="space-y-1">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group block rounded-md px-2 py-1.5 transition hover:bg-[#111]"
                >
                  <span className="block text-sm text-[#a3a3a3] transition group-hover:text-white">
                    {p.label}
                  </span>
                  <span className="block text-xs text-[#737373]">{p.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Career Portals */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">
            Featured Portals
          </p>
          <ul className="space-y-1">
            {EMPLOYER_PORTALS.map((portal) => (
              <li key={portal.href}>
                <a
                  href={portal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-md px-2 py-1.5 transition hover:bg-[#111]"
                >
                  <span className="flex items-center gap-1 text-sm text-[#a3a3a3] transition group-hover:text-white">
                    <span>{portal.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#737373] transition group-hover:text-white" />
                  </span>
                  <span className="block text-xs text-[#737373]">{portal.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">
            Good to know
          </p>
          <ul className="space-y-3 text-sm leading-6 text-[#a3a3a3]">
            <li>Check the original listing for the latest role details.</li>
            <li>Missing pay means undisclosed, never zero.</li>
            <li>Worldwide appears only when the listing confirms it.</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#262626]">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-5 text-xs text-[#737373] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} RemoteBoard. Find your next remote role.</p>
          <p>
            See{" "}
            <Link href="/about" className="text-[#d4d4d4] hover:text-white hover:underline">
              About RemoteBoard
            </Link>{" "}
            for more information.
          </p>
        </div>
      </div>
    </footer>
  );
}
