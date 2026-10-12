import { NextResponse } from "next/server";
import { findJob, isSourceName } from "@/lib/aggregate";

/** Stateless single-job lookup (live re-fetch, no storage). */
export const revalidate = 600;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ source: string; id: string }> },
) {
  const { source, id } = await ctx.params;
  if (!isSourceName(source)) {
    return NextResponse.json({ error: "Unknown source" }, { status: 400 });
  }
  const job = await findJob(source, id);
  if (!job) {
    return NextResponse.json({ error: "Job not found or expired" }, { status: 404 });
  }
  return NextResponse.json(
    { job },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600" } },
  );
}
