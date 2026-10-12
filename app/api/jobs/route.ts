import { NextResponse } from "next/server";
import { aggregateJobs, isSourceName } from "@/lib/aggregate";
import type { SourceName } from "@/lib/types";

/**
 * Stateless aggregation proxy — required because Himalayas sends no CORS
 * headers (server-only per their docs) and RemoteOK needs a custom
 * User-Agent (403 from browsers). Fetches live, returns JSON, saves nothing.
 */
export const revalidate = 600;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sourceParam = url.searchParams.get("source");
  const limitParam = Number(url.searchParams.get("limit") || "0");

  let sources: SourceName[] | undefined;
  if (sourceParam && sourceParam !== "all") {
    if (!isSourceName(sourceParam)) {
      return NextResponse.json({ error: "Unknown source" }, { status: 400 });
    }
    sources = [sourceParam];
  }

  try {
    const result = await aggregateJobs(sources);
    const jobs =
      limitParam > 0 ? result.jobs.slice(0, Math.min(limitParam, 200)) : result.jobs;
    return NextResponse.json(
      { ...result, jobs },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600",
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { jobs: [], total: 0, errors: [{ source: "jobicy", message: String(err) }] },
      { status: 502 },
    );
  }
}
