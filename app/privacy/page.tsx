import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "RemoteBoard privacy: no accounts, no job-data storage, no tracking. What little data exists and where external links go.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <p className="font-mono text-xs text-[#999999]">$ privacy</p>
      <h1 className="headline mt-2 text-3xl font-extrabold text-black sm:text-4xl dark:text-white">Privacy policy</h1>
      <p className="mt-1 font-mono text-xs text-[#999999]">last updated: october 2026</p>

      <div className="mt-6 space-y-6 text-[15px] leading-7 text-[#333333] dark:text-[#EAEAEA]">
        <section>
          <h2 className="headline text-lg font-bold text-black dark:text-white">1. No accounts, no job database</h2>
          <p>
            RemoteBoard has no sign-up, no login, and no database of jobs or
            users. Job listings are fetched live from third-party providers
            (Jobicy, Himalayas, Arbeitnow, Remote OK, We Work Remotely) on each
            request and never saved. We do not store applications, resumes, or
            profiles.
          </p>
        </section>
        <section>
          <h2 className="headline text-lg font-bold text-black dark:text-white">2. What we (don’t) store</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>No <code>localStorage</code> or <code>sessionStorage</code> is used for job data.</li>
            <li>Theme preference (light/dark) is kept locally in your browser only.</li>
            <li>Server logs standard for hosting (e.g. Vercel) may record anonymized request metadata — see your host’s policy.</li>
            <li>The contact form never sends data to us; it only opens your email app.</li>
          </ul>
        </section>
        <section>
          <h2 className="headline text-lg font-bold text-black dark:text-white">3. External application links</h2>
          <p>
            Every Apply button opens the original provider/employer page in a
            new tab. Those sites have their own privacy policies and may set
            cookies or collect application data. Review the provider’s policy
            before applying — we are not responsible for their practices.
          </p>
        </section>
        <section>
          <h2 className="headline text-lg font-bold text-black dark:text-white">4. Cookies &amp; analytics</h2>
          <p>
            This starter ships with no analytics and no advertising cookies. If
            you add analytics at deploy time, disclose it here and obtain
            consent where required.
          </p>
        </section>
        <section>
          <h2 className="headline text-lg font-bold text-black dark:text-white">5. Contact</h2>
          <p>
            Privacy questions or takedown requests: <a className="text-white underline underline-offset-4" href="mailto:hello@example.com">hello@example.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
