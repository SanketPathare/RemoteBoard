# RemoteBoard — Stateless Remote Job Board

Next.js App Router + TypeScript + Tailwind CSS v4 + Lucide icons. No Firebase, no Supabase, no database, no admin panel, no auth, no job storage. Live jobs are fetched from external providers on each request, normalized into one `Job` type, and rendered. Every **Apply now** button opens the real provider posting in a new tab.

## Providers (all verified live)

| Source | Endpoint | Apply URL used | Notes |
|---|---|---|---|
| Jobicy | `https://jobicy.com/api/v2/remote-jobs?count=50` | `url` (public listing; direct ATS URL needs a commercial key we don't use) | No key, ≤200/req. Credit + link back; don't redistribute to Jooble/Google Jobs/LinkedIn; ≤1 check/hour. |
| Himalayas | `https://himalayas.app/jobs/api?limit=20` (+ `/jobs/api/search`) | `applicationLink` (fallback `guid`) | Free, no auth, max 20/req, cursor pagination. 429 when rate-limited, refreshes daily. **Server-only (no CORS)** — hence the Route Handler. Visible link + "sourced from Himalayas" required. |
| Arbeitnow | `https://www.arbeitnow.com/api/job-board-api` | `url` | Free, no key, EU-focused with `remote` flag. "As is", revocable. Link back required. |
| Remote OK | `https://remoteok.com/api` | `apply_url` (fallback `url`) | Array with `[0] = legal notice`. **Requires a real `User-Agent`** (server-only). Follow link (no `nofollow`) + name mention required; **logo is trademarked — never rendered** (initial-avatar used). Salary 0 = undisclosed. |
| We Work Remotely | Category RSS (`programming`, `design`, `marketing`, `customer-support`) | `link` (= `guid`) | No JSON API. Paid postings — excerpt + link back only, never rehosted as our own. |
| Hitachi Careers | `https://careers.hitachi.com/jobs` (+ `?filter[country]=India`) | `applyURL` (Workday / SmartRecruiters ATS) | Enterprise recruitment portal across Hitachi Energy, Hitachi Vantara, Hitachi Solutions, and Hitachi Rail. Direct ATS application links. |
| Greenhouse | `https://boards-api.greenhouse.io/v1/boards/{company}/jobs` | `absolute_url` | Public ATS boards API. Configurable company handles in `lib/constants.ts` (e.g. `gitlab`). |
| Lever | `https://api.lever.co/v0/postings/{company}?mode=json` | `applyUrl` / `hostedUrl` | Public ATS postings API. Configurable company handles in `lib/constants.ts` (e.g. `spotify`). |
| Ashby | `https://api.ashbyhq.com/posting-api/job-board/{company}` | `jobUrl` | Modern tech ATS job board API. Configurable company handles in `lib/constants.ts` (e.g. `linear`). |
| Recruitee | `https://{company}.recruitee.com/api/offers/` | `careers_url` | Public offers API. Configurable company handles in `lib/constants.ts` (e.g. `bunq`). |
| Personio | `https://{company}.jobs.personio.com/xml` | Direct job portal link | Public XML feed parsed server-side via `fast-xml-parser`. Configurable company handles in `lib/constants.ts` (e.g. `personio`). |

None of these APIs are unlimited. Responses are cached ~10 min (`export const revalidate = 600` + `Cache-Control: s-maxage=600`); provider fetches use 9s timeouts and `Promise.allSettled` so one failure never blocks the others.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; only NEXT_PUBLIC_SITE_URL, no secrets
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

Requires Node 20+. Only runtime deps beyond Next/React: `lucide-react`, `next-themes`, `fast-xml-parser` (WWR RSS).

## Project structure

```
app/
  page.tsx                    # hero + latest jobs (server, newest-first)
  jobs/page.tsx               # listing (server shell + client explorer)
  jobs/[source]/[id]/page.tsx # stateless detail (live re-fetch, notFound when expired)
  about|contact|privacy/page.tsx
  api/jobs/route.ts           # stateless aggregation proxy (CORS/User-Agent fix, saves nothing)
  api/jobs/[source]/[id]/route.ts
  sitemap.ts robots.ts manifest.ts  # static routes only — no fabricated job URLs
lib/
  types.ts                    # shared Job interface + SOURCE_META
  sources/{jobicy,himalayas,arbeitnow,remoteok,wwr}.ts  # one adapter per provider
  aggregate.ts                # Promise.allSettled fan-out, newest-first sort, dedupe
  filters.ts format.ts constants.ts
components/
  JobCard JobList JobDetail SourceBadge SafeHtml SearchBar FilterPanel
  JobsExplorer HomeSearch ContactForm ThemeToggle/Header/Footer Skeleton States
```

## Key behaviors

- **No persistence:** no DB config/dependency, no `localStorage`/`sessionStorage` for jobs (theme only), no import system.
- **Real Apply links:** adapters drop any record without a provider URL; UI uses `target="_blank"` with `rel="noopener noreferrer sponsored nofollow"` (plain `noopener noreferrer` for RemoteOK per its follow-link rule).
- **No fake worldwide claims:** `remoteEligibility` renders only what the source reports (`locationRestrictions`, `region`, `jobGeo`).
- **Fetch discipline:** `/api/jobs` fetched once per source bucket; search text + filters + sort + Load More all run client-side over that batch.
- **SEO honesty:** unique metadata per static page, semantic HTML, sitemap/robots for static routes only. No `JobPosting` structured data (aggregated third-party listings don't meet Google's genuine-posting requirements); only `WebSite`/`Breadcrumb` basics.
- **Dark mode:** `next-themes` + Tailwind `dark:` variant, system default, keyboard-accessible toggle.

## Deployment

Works on Vercel, Netlify, or any Node host:

```bash
npm run build
```

Set `NEXT_PUBLIC_SITE_URL=https://your-domain` in the host env (used for metadata, sitemap, and the RemoteOK `User-Agent`). No other env vars or services needed. Replace `hello@example.com` in `app/contact/page.tsx` + `components/ContactForm.tsx` with a real inbox.

## Attribution checklist (keep when deploying)

- Footer + About link to all five providers.
- Each card/detail shows a `via {Source}` badge + "Original posting on {Source}" link.
- RemoteOK links keep `follow` (no `nofollow`); RemoteOK logos are never shown.
- Himalayas pages mention data is sourced from Himalayas with a link to himalayas.app.
