/**
 * Hitachi Careers adapter — https://careers.hitachi.com/jobs
 * Direct ATS-sourced listings across Hitachi Global, Hitachi India,
 * Hitachi Energy, Hitachi Vantara, Hitachi Solutions, and Hitachi Rail.
 */
import { PROVIDER_TIMEOUT_MS } from "../constants";
import { excerptFromHtml, safeString, toIsoDate } from "../format";
import { SOURCE_META, makeJobId, type Job, type SourceName } from "../types";

const SOURCE: SourceName = "hitachi";

const ENDPOINTS = [
  "https://careers.hitachi.com/jobs?filter[cf_remote_type]=Remote",
  "https://careers.hitachi.com/jobs?filter[country]=India",
  "https://careers.hitachi.com/jobs",
] as const;

interface HitachiLocation {
  city?: string;
  state?: string;
  country?: string;
  locationText?: string;
  isRemote?: boolean;
}

interface HitachiCustomField {
  cfKey?: string;
  value?: string;
  key?: string;
}

interface HitachiRawJob {
  sourceID?: string;
  uniqueID?: string;
  requisitionID?: string;
  reference?: string;
  title?: string;
  companyName?: string;
  brandName?: string;
  locations?: HitachiLocation[];
  isRemote?: boolean;
  employmentType?: string[];
  applyURL?: string;
  originalURL?: string;
  customFields?: HitachiCustomField[];
}

export function normalizeHitachi(raw: HitachiRawJob): Job | null {
  const sourceId = safeString(raw.requisitionID || raw.sourceID || raw.uniqueID);
  const title = safeString(raw.title);
  if (!sourceId || !title) return null;

  // Real ATS application URL (Workday, SmartRecruiters, GlobalLogic)
  const applyUrl = safeString(
    raw.applyURL ||
      (raw.originalURL
        ? `https://careers.hitachi.com/${raw.originalURL}`
        : "https://careers.hitachi.com/jobs")
  );

  const brand = safeString(raw.brandName);
  const company = "Hitachi";

  // Custom fields
  const customFields = Array.isArray(raw.customFields) ? raw.customFields : [];
  const remoteTypeField = customFields.find((c) => c.cfKey === "cf_remote_type")?.value;
  const sectorField = customFields.find((c) => c.cfKey === "cf_sector")?.value;
  const experienceField = customFields.find((c) => c.cfKey === "cf_experience")?.value;

  // Locations
  const locs = Array.isArray(raw.locations) ? raw.locations : [];
  const primaryLoc = locs[0];
  const locParts: string[] = [];
  if (primaryLoc?.city) locParts.push(primaryLoc.city);
  if (primaryLoc?.state && primaryLoc.state !== primaryLoc.city) locParts.push(primaryLoc.state);
  if (primaryLoc?.country) locParts.push(primaryLoc.country);
  const locationString = locParts.length > 0 ? locParts.join(", ") : "Global / Distributed";

  const isRemote =
    raw.isRemote === true ||
    remoteTypeField?.toLowerCase() === "remote" ||
    primaryLoc?.isRemote === true ||
    /remote/i.test(locationString) ||
    /remote/i.test(title);

  const isHybrid = remoteTypeField?.toLowerCase() === "hybrid";

  let remoteEligibility = "Onsite";
  if (isRemote) {
    remoteEligibility = primaryLoc?.country ? `Remote (${primaryLoc.country})` : "Remote";
  } else if (isHybrid) {
    remoteEligibility = `Hybrid (${locationString})`;
  } else if (primaryLoc?.country) {
    remoteEligibility = primaryLoc.country;
  }

  const employmentType =
    Array.isArray(raw.employmentType) && raw.employmentType.length > 0
      ? safeString(raw.employmentType[0])
      : "Full Time";

  // Build tags
  const tagsSet = new Set<string>();
  tagsSet.add("Hitachi");
  if (brand) tagsSet.add(brand);
  if (sectorField) tagsSet.add(sectorField);
  if (primaryLoc?.country) tagsSet.add(primaryLoc.country);
  if (primaryLoc?.country?.toLowerCase() === "india") tagsSet.add("Hitachi India");
  if (isRemote) tagsSet.add("Remote");
  if (isHybrid) tagsSet.add("Hybrid");

  const tags = Array.from(tagsSet).slice(0, 10);
  const category = sectorField || (tags[1] && tags[1] !== "Hitachi" ? tags[1] : "Engineering");

  const descriptionHtml = `
    <div class="hitachi-job-detail">
      <p><strong>${title}</strong></p>
      <p><strong>Organization:</strong> ${brand || "Hitachi"} (${sectorField || "Hitachi Group"})</p>
      <p><strong>Location:</strong> ${locationString} &bull; <strong>Arrangement:</strong> ${
        isRemote ? "Remote" : isHybrid ? "Hybrid" : "Onsite"
      }</p>
      <p><strong>Employment Type:</strong> ${employmentType} &bull; <strong>Requisition ID:</strong> ${sourceId}</p>
      ${experienceField ? `<p><strong>Experience Level:</strong> ${experienceField}</p>` : ""}
      <p class="mt-4">
        Apply directly via Hitachi's official applicant tracking system. For more vacancies, explore:
      </p>
      <ul>
        <li><a href="https://careers.hitachi.com/jobs" target="_blank" rel="noopener noreferrer">Hitachi Careers — all jobs</a></li>
        <li><a href="https://careers.hitachi.com/jobs?filter[country]=India" target="_blank" rel="noopener noreferrer">Hitachi India jobs</a></li>
      </ul>
    </div>
  `.trim();

  return {
    id: makeJobId(SOURCE, sourceId),
    source: SOURCE,
    sourceId,
    title,
    company,
    logo: "https://careers.hitachi.com/favicon-192x192.png",
    location: locationString,
    remote: isRemote || isHybrid,
    remoteEligibility,
    employmentType: employmentType || undefined,
    experienceLevel: experienceField || undefined,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryText: undefined,
    skills: tags,
    tags,
    category,
    descriptionHtml,
    excerpt: excerptFromHtml(
      `${title} at ${brand || "Hitachi"}. Location: ${locationString}. ${
        isRemote ? "Remote" : isHybrid ? "Hybrid" : "Onsite"
      }.`
    ),
    postedAt: toIsoDate(new Date().toISOString()),
    applyUrl,
    detailUrl: `/jobs/${SOURCE}/${encodeURIComponent(sourceId)}`,
    sourceName: SOURCE_META[SOURCE]?.label || "Hitachi Careers",
    sourceUrl: applyUrl,
  };
}

export async function fetchHitachi(signal?: AbortSignal): Promise<Job[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const fetchPromises = ENDPOINTS.map(async (url) => {
      try {
        const res = await fetch(url, {
          signal: ctrl.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          cache: "no-store",
        });
        if (!res.ok) return [];
        const html = await res.text();
        const match = html.match(/window\.__PRELOAD_STATE__\s*=\s*({[\s\S]*?});/);
        if (!match) return [];
        const state = JSON.parse(match[1]) as {
          jobSearch?: { jobs?: HitachiRawJob[] };
        };
        return Array.isArray(state.jobSearch?.jobs) ? state.jobSearch.jobs : [];
      } catch {
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    const rawJobs: HitachiRawJob[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") {
        rawJobs.push(...r.value);
      }
    }

    const seenIds = new Set<string>();
    const jobs: Job[] = [];

    for (const raw of rawJobs) {
      const normalized = normalizeHitachi(raw);
      if (!normalized) continue;
      if (seenIds.has(normalized.sourceId)) continue;
      seenIds.add(normalized.sourceId);
      jobs.push(normalized);
    }

    return jobs;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
