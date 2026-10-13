import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Static routes only — never fabricate per-job URLs in the sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/jobs", "/companies", "/about", "/contact", "/privacy"];
  return routes.map((r) => ({
    url: `${siteUrl}${r || "/"}`,
    lastModified: now,
    changeFrequency: r === "" || r === "/jobs" || r === "/companies" ? "hourly" : "monthly",
    priority: r === "" ? 1 : r === "/jobs" ? 0.9 : r === "/companies" ? 0.8 : 0.5,
  }));
}
