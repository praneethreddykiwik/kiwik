// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Admin session auth (single shared password).
// Edge-compatible: uses Web Crypto only, so it runs in middleware too.
// ─────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "kiwik_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toHex(signature);
}

/**
 * The HMAC key that signs admin session cookies. Never give this a fallback:
 * a session token is just HMAC(secret, expiry), so anyone who can read the
 * secret can mint an admin cookie and write to every content endpoint. In a
 * public repository a hardcoded default is equivalent to no auth at all.
 */
export function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    console.error("AUTH_SECRET is not set — admin authentication is disabled.");
    return null;
  }
  return secret;
}

/**
 * Constant-time comparison against ADMIN_PASSWORD. Fails closed when unset,
 * rather than accepting a publicly-known default.
 */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error("ADMIN_PASSWORD is not set — admin login is disabled.");
    return false;
  }
  if (!input) return false;
  return timingSafeEqual(input, expected);
}

/** Creates a signed, expiring session token: `<expiryMs>.<hmac>`. */
export async function createSessionToken(): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;
  const exp = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  const sig = await hmacHex(secret, exp);
  return `${exp}.${sig}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = getAuthSecret();
  if (!secret || !token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacHex(secret, exp);
  if (!timingSafeEqual(sig, expected)) return false;
  const expMs = Number(exp);
  return Number.isFinite(expMs) && expMs > Date.now();
}

export function sessionCookieOptions(maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
