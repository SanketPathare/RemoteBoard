import type { Job } from "./types";

export interface CountryDefinition {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: "North America" | "Europe" | "Asia-Pacific" | "Latin America" | "Middle East" | "Worldwide";
  currency: string;
  keywords: string[];
  description: string;
}

export interface CountrySummary {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: string;
  currency: string;
  jobCount: number;
  companiesCount: number;
  companies: string[];
  averageSalary: number | null;
  description: string;
  jobs: Job[];
}

export const COUNTRY_DEFINITIONS: CountryDefinition[] = [
  {
    slug: "worldwide",
    name: "Worldwide",
    flag: "🌐",
    code: "WW",
    region: "Worldwide",
    currency: "USD",
    keywords: [
      "worldwide",
      "anywhere in the world",
      "anywhere",
      "global",
      "all countries",
      "any location",
      "remote - worldwide",
      "100% remote",
    ],
    description: "Fully location-agnostic remote roles open to candidates anywhere across the globe without geographic restrictions.",
  },
  {
    slug: "united-states",
    name: "United States",
    flag: "🇺🇸",
    code: "US",
    region: "North America",
    currency: "USD",
    keywords: [
      "united states",
      "usa",
      "u.s.",
      "u.s.a",
      "us only",
      "us remote",
      "north america",
      "san francisco",
      "new york",
      "austin",
      "seattle",
      "chicago",
      "los angeles",
      "california",
      "texas",
      "boston",
    ],
    description: "Remote positions for US-based professionals, US tax entities, and North American time zone overlaps.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flag: "🇬🇧",
    code: "GB",
    region: "Europe",
    currency: "GBP",
    keywords: [
      "united kingdom",
      "uk",
      "london",
      "england",
      "scotland",
      "wales",
      "great britain",
      "u.k.",
      "manchester",
      "edinburgh",
      "bristol",
    ],
    description: "Remote & hybrid roles eligible for UK residents and candidates aligned with GMT/BST operating hours.",
  },
  {
    slug: "germany",
    name: "Germany",
    flag: "🇩🇪",
    code: "DE",
    region: "Europe",
    currency: "EUR",
    keywords: [
      "germany",
      "deutschland",
      "berlin",
      "munich",
      "münchen",
      "frankfurt",
      "hamburg",
      "cologne",
      "köln",
      "stuttgart",
      "germany / eu",
    ],
    description: "Tech, engineering, and remote roles within Germany and the broader DACH European economic zone.",
  },
  {
    slug: "india",
    name: "India",
    flag: "🇮🇳",
    code: "IN",
    region: "Asia-Pacific",
    currency: "INR",
    keywords: [
      "india",
      "bangalore",
      "bengaluru",
      "mumbai",
      "delhi",
      "new delhi",
      "hyderabad",
      "pune",
      "chennai",
      "gurugram",
      "noida",
      "hitachi india",
    ],
    description: "Engineering hubs, global capability centres, and high-growth remote roles for Indian talent.",
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    code: "CA",
    region: "North America",
    currency: "CAD",
    keywords: [
      "canada",
      "toronto",
      "vancouver",
      "montreal",
      "montréal",
      "ottawa",
      "calgary",
      "quebec",
      "ontario",
      "british columbia",
    ],
    description: "Canadian remote opportunities with North American market compensation and local labor compliance.",
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    code: "NL",
    region: "Europe",
    currency: "EUR",
    keywords: [
      "netherlands",
      "amsterdam",
      "rotterdam",
      "utrecht",
      "the hague",
      "den haag",
      "eindhoven",
      "noord-holland",
      "dutch",
    ],
    description: "High-compensation tech, fintech, and scale-up opportunities headquartered in the Netherlands.",
  },
  {
    slug: "france",
    name: "France",
    flag: "🇫🇷",
    code: "FR",
    region: "Europe",
    currency: "EUR",
    keywords: [
      "france",
      "paris",
      "lyon",
      "marseille",
      "toulouse",
      "bordeaux",
      "nantes",
      "lille",
    ],
    description: "Remote and hybrid opportunities in France's thriving tech ecosystem and international scale-ups.",
  },
  {
    slug: "switzerland",
    name: "Switzerland",
    flag: "🇨🇭",
    code: "CH",
    region: "Europe",
    currency: "CHF",
    keywords: [
      "switzerland",
      "zürich",
      "zurich",
      "geneva",
      "genève",
      "basel",
      "bern",
      "lausanne",
      "zug",
    ],
    description: "Top-tier compensation packages for remote engineers and leaders working with Swiss enterprises and startups.",
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    code: "AU",
    region: "Asia-Pacific",
    currency: "AUD",
    keywords: [
      "australia",
      "sydney",
      "melbourne",
      "brisbane",
      "perth",
      "adelaide",
      "canberra",
      "aus",
    ],
    description: "APAC time-zone remote roles for Australian candidates and international organizations operating Down Under.",
  },
  {
    slug: "poland",
    name: "Poland",
    flag: "🇵🇱",
    code: "PL",
    region: "Europe",
    currency: "PLN",
    keywords: [
      "poland",
      "polska",
      "warsaw",
      "warszawa",
      "krakow",
      "kraków",
      "wroclaw",
      "wrocław",
      "gdansk",
      "gdańsk",
      "poznan",
    ],
    description: "Central Europe's premier engineering and development capital with thriving international B2B contracts.",
  },
  {
    slug: "ireland",
    name: "Ireland",
    flag: "🇮🇪",
    code: "IE",
    region: "Europe",
    currency: "EUR",
    keywords: [
      "ireland",
      "dublin",
      "cork",
      "galway",
      "limerick",
      "irish",
    ],
    description: "European headquarters for global technology giants, SaaS leaders, and international remote employers.",
  },
  {
    slug: "sweden",
    name: "Sweden",
    flag: "🇸🇪",
    code: "SE",
    region: "Europe",
    currency: "SEK",
    keywords: [
      "sweden",
      "sverige",
      "stockholm",
      "gothenburg",
      "göteborg",
      "malmö",
      "malmo",
      "nordic",
    ],
    description: "Progressive work-life balance roles with Nordic innovators and unicorn technology companies.",
  },
  {
    slug: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    code: "SG",
    region: "Asia-Pacific",
    currency: "SGD",
    keywords: [
      "singapore",
      "sg",
    ],
    description: "Southeast Asia's premier financial and technology hub connecting global remote teams.",
  },
  {
    slug: "spain",
    name: "Spain",
    flag: "🇪🇸",
    code: "ES",
    region: "Europe",
    currency: "EUR",
    keywords: [
      "spain",
      "españa",
      "madrid",
      "barcelona",
      "valencia",
      "seville",
      "malaga",
      "bilbao",
    ],
    description: "Growing European tech ecosystem attracting international digital nomads and remote engineering centers.",
  },
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    code: "JP",
    region: "Asia-Pacific",
    currency: "JPY",
    keywords: [
      "japan",
      "tokyo",
      "osaka",
      "kyoto",
      "fukuoka",
    ],
    description: "Technology and multinational remote roles based in Tokyo and regional Japanese headquarters.",
  },
  {
    slug: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    code: "BR",
    region: "Latin America",
    currency: "BRL",
    keywords: [
      "brazil",
      "brasil",
      "são paulo",
      "sao paulo",
      "rio de janeiro",
      "curitiba",
      "florianópolis",
      "belo horizonte",
    ],
    description: "Latin America's leading tech talent ecosystem working with US nearshore and global remote companies.",
  },
  {
    slug: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    code: "MX",
    region: "Latin America",
    currency: "MXN",
    keywords: [
      "mexico",
      "méxico",
      "mexico city",
      "cdmx",
      "guadalajara",
      "monterrey",
    ],
    description: "Nearshore remote opportunities aligned with US Central and Pacific time zones.",
  },
  {
    slug: "israel",
    name: "Israel",
    flag: "🇮🇱",
    code: "IL",
    region: "Middle East",
    currency: "ILS",
    keywords: [
      "israel",
      "tel aviv",
      "jerusalem",
      "haifa",
      "herzliya",
    ],
    description: "Deep tech, cybersecurity, and high-growth startup opportunities in Silicon Wadi.",
  },
  {
    slug: "united-arab-emirates",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    code: "AE",
    region: "Middle East",
    currency: "AED",
    keywords: [
      "united arab emirates",
      "uae",
      "dubai",
      "abu dhabi",
    ],
    description: "Global business capital connecting remote professionals across Europe, Asia, and the Middle East.",
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    code: "NZ",
    region: "Asia-Pacific",
    currency: "NZD",
    keywords: [
      "new zealand",
      "auckland",
      "wellington",
      "christchurch",
      "nz",
    ],
    description: "Australasia time-zone roles for candidates based in New Zealand with international employers.",
  },
];

export const COUNTRY_REGIONS = [
  "All",
  "Worldwide",
  "North America",
  "Europe",
  "Asia-Pacific",
  "Latin America",
  "Middle East",
] as const;

export type CountryRegion = (typeof COUNTRY_REGIONS)[number];

/**
 * Normalizes text for matching location keywords
 */
function normalizeLoc(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if a job matches a given country definition
 */
export function jobMatchesCountry(job: Job, def: CountryDefinition): boolean {
  const haystack = normalizeLoc(
    `${job.location} ${job.remoteEligibility || ""} ${job.title} ${job.tags?.join(" ") || ""}`
  );

  // Worldwide matching
  if (def.slug === "worldwide") {
    return def.keywords.some((kw) => haystack.includes(normalizeLoc(kw)));
  }

  // Country specific keyword match
  return def.keywords.some((kw) => {
    const term = normalizeLoc(kw);
    // Boundary check for short acronyms like "us", "uk", "de", etc.
    if (term.length <= 3) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      return regex.test(haystack);
    }
    return haystack.includes(term);
  });
}

/**
 * Groups all jobs by defined countries and returns populated CountrySummary array
 */
export function groupJobsByCountry(jobs: Job[]): CountrySummary[] {
  const summaries: CountrySummary[] = [];

  for (const def of COUNTRY_DEFINITIONS) {
    const matchedJobs = jobs.filter((j) => jobMatchesCountry(j, def));

    if (matchedJobs.length === 0) continue;

    // Unique companies hiring in this country
    const companySet = new Set<string>();
    let salarySum = 0;
    let salaryCount = 0;

    for (const j of matchedJobs) {
      if (j.company) companySet.add(j.company);
      if (j.salaryMin && j.salaryMin > 0) {
        salarySum += j.salaryMin;
        salaryCount++;
      }
    }

    const avgSalary =
      salaryCount > 0 ? Math.round(salarySum / salaryCount) : null;

    summaries.push({
      slug: def.slug,
      name: def.name,
      code: def.code,
      flag: def.flag,
      region: def.region,
      currency: def.currency,
      jobCount: matchedJobs.length,
      companiesCount: companySet.size,
      companies: Array.from(companySet).slice(0, 8),
      averageSalary: avgSalary,
      description: def.description,
      jobs: matchedJobs,
    });
  }

  // Sort by job count descending by default
  return summaries.sort((a, b) => b.jobCount - a.jobCount);
}

/**
 * Fetches a single country summary by its slug
 */
export function getCountryBySlug(jobs: Job[], slug: string): CountrySummary | null {
  const def = COUNTRY_DEFINITIONS.find((c) => c.slug === slug.toLowerCase());
  if (!def) return null;

  const matchedJobs = jobs.filter((j) => jobMatchesCountry(j, def));

  const companySet = new Set<string>();
  let salarySum = 0;
  let salaryCount = 0;

  for (const j of matchedJobs) {
    if (j.company) companySet.add(j.company);
    if (j.salaryMin && j.salaryMin > 0) {
      salarySum += j.salaryMin;
      salaryCount++;
    }
  }

  const avgSalary =
    salaryCount > 0 ? Math.round(salarySum / salaryCount) : null;

  return {
    slug: def.slug,
    name: def.name,
    code: def.code,
    flag: def.flag,
    region: def.region,
    currency: def.currency,
    jobCount: matchedJobs.length,
    companiesCount: companySet.size,
    companies: Array.from(companySet).slice(0, 12),
    averageSalary: avgSalary,
    description: def.description,
    jobs: matchedJobs,
  };
}
