import { NextResponse } from "next/server";

/**
 * Cache headers for the read-only endpoints the site polls.
 *
 * These three routes were served with `no-store`, so every poll from every open
 * tab ran the serverless function and read the row out of Postgres again. At a
 * 15s interval that is 4 reads/minute per tab, and /api/cms alone answers with
 * ~47KB, so a single tab left open costs roughly 11MB/hour of Supabase egress —
 * which is what put the project 162% over its 5GB monthly allowance.
 *
 * Two independent savings:
 *
 *  1. `s-maxage` lets Vercel's CDN answer repeat polls itself. The function
 *     never runs and Postgres is never touched, so origin reads become a flat
 *     ~3/minute for the whole world instead of scaling with traffic.
 *  2. A strong ETag lets a client that already holds the current copy get a
 *     bodiless 304 instead of the payload again.
 *
 * `stale-while-revalidate` keeps the CDN serving instantly while it refreshes
 * in the background, so the cache never adds latency to a request.
 *
 * The window is deliberately short. Publishing from the studio has to look
 * immediate, so this trades a few seconds of staleness — not minutes — for the
 * bandwidth. Writes still respond `no-store`; only GETs are cached.
 */
/**
 * The window is sized from the quota, not from taste.
 *
 * Every origin miss costs one Postgres read of ~66KB across the three polled
 * routes. At s-maxage=20 that is 3 misses/minute sustained, which projects to
 * ~8.2GB/month — still over the 5GB allowance, so it would not have solved
 * anything. 60s caps it at ~1.4GB/month, leaving real headroom.
 *
 * Staleness does not follow from this, because writes call revalidateApiPath()
 * below and purge the entry immediately. The 60s is the ceiling for the case
 * where a row changes without going through our own POST — a manual edit in the
 * Supabase dashboard, say — not the normal publish path.
 */
export const PUBLIC_READ_CACHE = {
  "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
} as const;

export const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
} as const;

/** FNV-1a over the serialized body. Cheap, stable, and good enough to detect change. */
function etagFor(body: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < body.length; i++) {
    h ^= body.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `"${(h >>> 0).toString(16)}-${body.length.toString(16)}"`;
}

/**
 * JSON response with an ETag, returning 304 when the caller already has it.
 * Pass the incoming Request so `If-None-Match` can be honoured.
 */
export function cachedJson(data: unknown, request?: Request, extraHeaders: Record<string, string> = {}) {
  const body = JSON.stringify(data);
  const etag = etagFor(body);

  const ifNoneMatch = request?.headers.get("if-none-match");
  // A revalidating client may send W/"..." or a comma-separated list.
  if (ifNoneMatch && ifNoneMatch.split(",").some((t) => t.trim().replace(/^W\//, "") === etag)) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, ...PUBLIC_READ_CACHE, ...extraHeaders },
    });
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ETag: etag,
      ...PUBLIC_READ_CACHE,
      ...extraHeaders,
    },
  });
}

/**
 * Purges the CDN copy of a read route after a write, so publishing from the
 * studio is visible immediately rather than after the cache window.
 *
 * Best-effort by design: it must never turn a successful save into a failed
 * request, so a revalidation error is logged and swallowed. The `s-maxage`
 * above remains the correctness backstop.
 */
export async function revalidateApiPath(path: string) {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(path);
  } catch (error) {
    console.warn(`revalidatePath(${path}) failed:`, error);
  }
}
