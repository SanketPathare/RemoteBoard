import type { Metadata } from "next";
import { BadgeCheck, DatabaseZap, Globe2, Link2, Timer, UserX } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Sources",
  description:
    "How RemoteBoard works: stateless live aggregation from five permitted providers, with attribution, rate-limit, and redistribution notes.",
};

const ROWS = [
  {
    name: "Jobicy",
    endpoint: "jobicy.com/api/v2/remote-jobs",
    terms: "Public, no key (up to 200/req). Apply links point to the Jobicy listing unless a commercial key is used — we use the public URL as-is.",
    attribution: "Credit + link back. Do not redistribute to Jooble / Google Jobs / LinkedIn. Check ≤ once/hour; listings carry a 6-hour delay.",
  },
  {
    name: "Himalayas",
    endpoint: "himalayas.app/jobs/api (+ /jobs/api/search)",
    terms: "Free incl. commercial, no auth, max 20/req, cursor pagination. Rate-limited (429); data refreshes every 24h. Server-side calls only (no browser CORS).",
    attribution: "Visible link to himalayas.app + “sourced from Himalayas” on every display.",
  },
  {
    name: "Arbeitnow",
    endpoint: "arbeitnow.com/api/job-board-api",
    terms: "Free, no key, EU/Germany-focused with a remote flag. Provided “as is”, revocable.",
    attribution: "Link back to Arbeitnow.com on any display.",
  },
  {
    name: "Remote OK",
    endpoint: "remoteok.com/api",
    terms: "Public array API; first element is legal text. Requires a real User-Agent header or requests fail — hence server-side fetching. Salary 0 means undisclosed.",
    attribution: "Follow link (NOT nofollow) to the RemoteOK posting + name mention, or access is suspended. Logo is trademarked — we never render RemoteOK logos.",
  },
  {
    name: "We Work Remotely",
    endpoint: "weworkremotely.com category RSS feeds",
    terms: "No JSON API; public RSS per category (ttl 60). Paid employer postings — reuse must stay minimal and attribution-sensitive.",
    attribution: "Excerpt + prominent link to the original WWR listing. Never presented as our own posting.",
  },
];

const GUARANTEES = [
  { icon: Link2, t: "Real Apply links", d: "Every Apply now button opens the genuine external posting in a new tab." },
  { icon: BadgeCheck, t: "Nothing invented", d: "No fake jobs, salaries, or URLs. Missing fields render as “not listed”." },
  { icon: Globe2, t: "Honest eligibility", d: "“Worldwide” appears only when the source confirms it." },
  { icon: Timer, t: "Fetch once, filter locally", d: "No API calls on keystrokes — the feed loads once per source." },
  { icon: UserX, t: "No accounts", d: "No login, no profiles, no application tracking." },
  { icon: DatabaseZap, t: "No storage", d: "Nothing in localStorage, cookies, or any server database." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono text-xs text-[#999999]">$ about</p>
        <h1 className="headline mt-2 text-3xl font-extrabold text-black sm:text-4xl dark:text-white">
          A job board with no database
        </h1>
        <p className="mt-3 leading-7 text-[#666666] dark:text-[#888888]">
          RemoteBoard is a <strong className="text-black dark:text-white">stateless</strong> remote-job
          aggregator. No database, no admin panel, no authentication, no stored
          records. Each request fetches live data through a server Route Handler
          (needed for CORS and User-Agent rules), normalizes it into one{" "}
          <code className="rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-1.5 py-0.5 font-mono text-[13px] dark:border-[#333333] dark:bg-[#111111]">Job</code> shape,
          dedupes by <code className="rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-1.5 py-0.5 font-mono text-[13px] dark:border-[#333333] dark:bg-[#111111]">source + provider id</code>,
          and renders it. If one provider fails, the others still display.
        </p>
      </div>

      <h2 className="headline mt-10 text-xl font-bold text-black dark:text-white">What we guarantee</h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUARANTEES.map((g) => (
          <li
            key={g.t}
            className="glass-card card-sheen flex items-start gap-3 rounded-lg border border-[#EAEAEA] p-4 transition hover:border-[#999999] dark:border-[#333333] dark:hover:border-[#666666]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#EAEAEA] text-black dark:border-[#333333] dark:text-white">
              <g.icon className="h-4 w-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-black dark:text-white">{g.t}</span>
              <span className="mt-0.5 block text-[13px] leading-5 text-[#666666] dark:text-[#888888]">{g.d}</span>
            </span>
          </li>
        ))}
      </ul>

      <h2 className="headline mt-10 text-xl font-bold text-black dark:text-white">
        Sources, limits and attribution
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {ROWS.map((r) => (
          <li
            key={r.name}
            className="glass-card card-sheen rounded-lg border border-[#EAEAEA] p-4 sm:p-5 dark:border-[#333333]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[15px] font-semibold text-black dark:text-white">{r.name}</p>
              <code className="rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-2 py-0.5 font-mono text-[11px] text-[#666666] dark:border-[#333333] dark:bg-[#111111] dark:text-[#888888]">
                {r.endpoint}
              </code>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-[#666666] dark:text-[#888888]">
              <strong className="font-semibold text-black dark:text-white">Limits: </strong>
              {r.terms}
            </p>
            <p className="mt-1.5 text-[13px] leading-6 text-[#666666] dark:text-[#888888]">
              <strong className="font-semibold text-black dark:text-white">Attribution: </strong>
              {r.attribution}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-lg border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3 font-mono text-xs leading-6 text-[#666666] dark:border-[#333333] dark:bg-[#111111] dark:text-[#888888]">
        none of these apis are unlimited · rate-limited and revocable · cached ~10 min · outages tolerated
      </p>
    </div>
  );
}
