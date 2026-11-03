import { NextResponse } from "next/server";
import { ensureDbTables } from "@/lib/db";
import { bumpAnalytics } from "@/lib/analytics";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Public: records one search from the site's command palette. Anonymous by
 * design (only the query text is counted), so it is rate limited and the query
 * is length-capped and normalised before it is stored.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "analytics-search"), 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const body = await request.json().catch(() => ({}));
  const query = String(body?.query ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
  if (query.length < 2) return NextResponse.json({ status: "ignored" });

  try {
    await ensureDbTables();
    await bumpAnalytics("search", query);
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "skipped" }, { status: 503 });
  }
}
