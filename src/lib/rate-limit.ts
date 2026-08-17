/**
 * Best-effort rate limiting for public endpoints.
 *
 * Honest description of what this is: a fixed-window counter held in the
 * module scope of a serverless function. It is *not* a distributed limiter.
 * Vercel may run several instances concurrently, and each keeps its own map, so
 * the real ceiling is roughly `limit x instances`. A determined attacker with
 * many source addresses is not stopped by this.
 *
 * It is still worth having, because the realistic abuse here is a single client
 * looping a request — a script hammering the AI endpoint, or a bot filling the
 * newsletter table — and that is exactly the case a per-instance window catches
 * at near-zero cost.
 *
 * Where the limit protects data rather than budget (the contact form), the
 * counter is derived from the database instead, in the route itself, so it
 * holds across instances.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Bounded so a stream of unique keys cannot grow the map without limit. */
const MAX_TRACKED_KEYS = 5000;

function sweep(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
  // Still oversized after dropping expired entries: this is memory pressure,
  // not correctness, so clear it and start the window fresh.
  if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
}

/**
 * Identifies the caller for limiting purposes only. The value is hashed into a
 * bucket key and never stored, logged, or written to the database — the site
 * deliberately does not retain visitor IP addresses.
 */
export function clientKey(request: Request, scope: string): string {
  const fwd = request.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  let h = 0x811c9dc5;
  const s = `${scope}:${ip}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${scope}:${(h >>> 0).toString(36)}`;
}

export type RateVerdict = { allowed: boolean; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateVerdict {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
