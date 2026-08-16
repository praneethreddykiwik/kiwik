import { NextResponse } from "next/server";

/**
 * Cache headers for the read-only endpoints the site polls.
 *
 * These routes were served `no-store`, and the client poller also passed
 * `cache: "no-store"`, so every tab re-read ~66KB of rows every 15 seconds
 * whether or not anything had changed. That repetition — not data volume; the
 * whole database is 1.31MB — is what put Supabase 162% over its 5GB egress
 * allowance.
 *
 * The fix is two-layered, because caching a fixed URL is not sufficient on its
 * own: Vercel's CDN honours `s-maxage`, but `revalidatePath()` does NOT purge an
 * entry the CDN stored from a Cache-Control header. Verified in production —
 * after a write the database and a cache-busted URL both returned the new value
 * while the plain URL kept serving the old one. Relying on revalidation alone
 * would have reintroduced "my edits do not show up".
 *
 * So freshness comes from the URL instead of from a TTL:
 *
 *   /api/version   ~62 bytes, cached 10s. The poller asks this first, and only
 *                  fetches a full payload when a stamp actually moves. It also
 *                  collapses three polls into one.
 *   /api/cms?v=N   one immutable URL per version. A change yields a new stamp
 *                  and therefore a new cache key, so the CDN can hold each
 *                  version for a year and still never serve a superseded copy.
 *
 * The bare-URL window below is only the fallback for a caller that arrives
 * without a stamp.
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

  // A request carrying ?v=<stamp> names one specific version of this content,
  // so that URL can never go stale — a change produces a different stamp and
  // therefore a different cache key. Holding it for a year means a repeat
  // visitor's poll is answered by the CDN and never reaches Postgres, while a
  // publish is picked up immediately via the new URL rather than waiting for a
  // TTL to lapse.
  let cacheHeaders: Record<string, string> = { ...PUBLIC_READ_CACHE };
  try {
    if (request && new URL(request.url).searchParams.has("v")) {
      cacheHeaders = { "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable" };
    }
  } catch {
    /* unparseable URL — keep the default window */
  }

  const ifNoneMatch = request?.headers.get("if-none-match");
  // A revalidating client may send W/"..." or a comma-separated list.
  if (ifNoneMatch && ifNoneMatch.split(",").some((t) => t.trim().replace(/^W\//, "") === etag)) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, ...cacheHeaders, ...extraHeaders },
    });
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ETag: etag,
      ...cacheHeaders,
      ...extraHeaders,
    },
  });
}

/**
 * Invalidates Next's own route cache after a write.
 *
 * Note what this does NOT do: it does not purge a Vercel CDN entry created by a
 * Cache-Control header — that was measured, not assumed. Correct propagation
 * comes from the versioned URLs described above; this only keeps Next's
 * internal cache honest and is kept because it costs nothing.
 *
 * Best-effort: it must never turn a successful save into a failed request, so
 * errors are logged and swallowed.
 */
export async function revalidateApiPath(path: string) {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(path);
  } catch (error) {
    console.warn(`revalidatePath(${path}) failed:`, error);
  }
}
