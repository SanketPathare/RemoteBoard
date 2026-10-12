import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import { SOURCE_META, type SourceName } from "@/lib/types";

const SOURCES: SourceName[] = ["jobicy", "himalayas", "arbeitnow", "remoteok", "wwr"];

const PAGES = [
  { href: "/jobs",    label: "Browse jobs",       desc: "Search and filter the live feed" },
  { href: "/about",   label: "About & sources",   desc: "How aggregation works" },
  { href: "/contact", label: "Contact",            desc: "Report a broken link" },
  { href: "/privacy", label: "Privacy policy",     desc: "No accounts, no tracking" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">

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
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#666]">
            A stateless ledger of live remote filings. No accounts, no database.
            Every Apply button opens the original provider posting in a new tab.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Job sources">
            {SOURCES.map((s) => (
              <li key={s}>
                <a
                  href={SOURCE_META[s].siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#222] px-2.5 py-1 font-mono text-xs text-[#555] transition hover:border-[#0070f3]/40 hover:text-[#0070f3]"
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full source-dot-${s}`} />
                  {SOURCE_META[s].label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer navigation">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#444]">
            Explore
          </p>
          <ul className="space-y-1">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group block rounded-lg px-2 py-1.5 transition hover:bg-[#0f0f0f]"
                >
                  <span className="block text-sm text-[#666] transition group-hover:text-white">
                    {p.label}
                  </span>
                  <span className="block text-xs text-[#3a3a3a]">{p.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Disclaimer */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#444]">
            Good to know
          </p>
          <ul className="space-y-3 text-sm leading-6 text-[#555]">
            <li>Filings belong to their providers. Verify details before applying.</li>
            <li>Missing pay means undisclosed, never zero.</li>
            <li>Worldwide appears only when the source confirms it.</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1f1f1f]">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-5 font-mono text-xs text-[#3a3a3a] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} RemoteBoard. Aggregated only as each provider permits.</p>
          <p>
            See{" "}
            <Link href="/about" className="text-[#0070f3] hover:underline">
              About
            </Link>{" "}
            for attribution and terms.
          </p>
        </div>
      </div>
    </footer>
  );
}
