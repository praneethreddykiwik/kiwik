import { sql, ensureDbTables } from "@/lib/db";
import { cachedJson } from "@/lib/api-cache";

/**
 * Content version stamps — the cheapest possible "has anything changed?".
 *
 * The site used to poll /api/cms, /api/projects and /api/products directly
 * every 15 seconds, which meant re-transferring ~66KB per tab per cycle whether
 * or not a single byte had changed. That is what exhausted the Supabase egress
 * allowance.
 *
 * This answers the same question in ~90 bytes with three max(updated_at) reads,
 * and lets the poller fetch a full payload only when a stamp actually moves.
 *
 * It also replaces three polls with one.
 *
 * Caching this on the CDN is deliberately short: it is the freshness signal for
 * everything else, so a stale stamp would delay every update. 10s is small
 * enough to feel immediate and still collapses concurrent visitors onto a
 * single origin read.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureDbTables();
    const [row] = await sql`
      SELECT
        (SELECT EXTRACT(EPOCH FROM updated_at)::bigint FROM site_cms WHERE key = 'main') AS cms,
        (SELECT EXTRACT(EPOCH FROM MAX(updated_at))::bigint FROM projects) AS projects,
        (SELECT EXTRACT(EPOCH FROM MAX(updated_at))::bigint FROM products) AS products;
    `;
    return cachedJson(
      {
        cms: Number(row?.cms ?? 0),
        projects: Number(row?.projects ?? 0),
        products: Number(row?.products ?? 0),
      },
      request,
      { "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=30" }
    );
  } catch (error) {
    console.warn("GET /api/version failed:", error);
    // A zero stamp tells the poller "unknown" — it falls back to fetching.
    return cachedJson({ cms: 0, projects: 0, products: 0, fallback: true }, request, {
      "Cache-Control": "no-store",
    });
  }
}
