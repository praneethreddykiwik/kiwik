import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { sql, ensureDbTables } from "@/lib/db";
import { topAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/** Admin-only: the numbers behind the studio's Analytics tab. */
export async function GET() {
  const isAdmin = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });

  try {
    await ensureDbTables();
    const [searches, projects, countries, totals] = await Promise.all([
      topAnalytics("search", 10),
      topAnalytics("project", 10),
      topAnalytics("country", 10),
      sql`
        SELECT
          COUNT(*)::int AS sessions,
          COALESCE(SUM(pageviews), 0)::int AS pageviews,
          COUNT(*) FILTER (WHERE last_ping >= NOW() - INTERVAL '45 seconds')::int AS active
        FROM site_visitor_sessions;
      `,
    ]);
    return NextResponse.json(
      {
        status: "ok",
        // Session rows are kept for 30 days (see lib/db retention).
        totals: { sessions30d: totals[0]?.sessions ?? 0, pageviews30d: totals[0]?.pageviews ?? 0, activeNow: totals[0]?.active ?? 0 },
        searches,
        projects,
        countries,
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("GET /api/analytics failed:", error);
    return NextResponse.json({ error: "Database unavailable." }, { status: 503, headers: NO_STORE });
  }
}
