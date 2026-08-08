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

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "5adcef323766ad324b3ffdc5fa0c7fa715b99e0bce69afd89d9d4b43489535df";
}

/**
 * Constant-time comparison of the submitted password against ADMIN_PASSWORD.
 * Defaults to "kiwik" when ADMIN_PASSWORD environment variable is not explicitly defined.
 */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "kiwik";
  if (!input) return false;
  return timingSafeEqual(input, expected);
}

/** Creates a signed, expiring session token: `<expiryMs>.<hmac>`. */
export async function createSessionToken(): Promise<string> {
  const secret = getAuthSecret();
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
