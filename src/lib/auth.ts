// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Admin session auth (single shared password).
// Edge-compatible: uses Web Crypto only, so it runs in middleware too.
// ─────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "kiwik_admin";
/** Short-lived CSRF state for the Google OAuth round trip. */
export const OAUTH_STATE_COOKIE = "kiwik_oauth_state";
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
 * The HMAC key that signs admin session cookies.
 *
 * A session token is `HMAC(secret, expiry)` and binds nothing else, so anyone
 * holding the secret can mint an admin cookie. This repository is public, so a
 * committed fallback is equivalent to publishing admin access. Returns null
 * when unset and every caller fails closed.
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
 * Constant-time comparison against ADMIN_PASSWORD.
 *
 * There is deliberately no built-in password. A hardcoded one in a public
 * repository is an open door: anyone could POST it to /api/auth/login, receive
 * a valid session cookie, and then write to every content endpoint.
 */
/**
 * Password login is opt-in and disabled by default.
 *
 * A shared password is a single secret that cannot be scoped, rotated per
 * person, or revoked for one individual — and this project's previous password
 * is in public git history, so it must be assumed known. Google sign-in with an
 * explicit allowlist is the intended route in; the password remains available
 * only as a deliberate fallback, enabled by setting ADMIN_PASSWORD_LOGIN=true.
 */
export function isPasswordLoginEnabled(): boolean {
  return process.env.ADMIN_PASSWORD_LOGIN === "true" && Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyPassword(input: string): boolean {
  if (!isPasswordLoginEnabled()) {
    console.warn("Password login attempted while disabled (set ADMIN_PASSWORD_LOGIN=true to allow it).");
    return false;
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (!input) return false;
  return timingSafeEqual(input, expected);
}

/**
 * The allowlist of Google accounts permitted into the studio.
 *
 * Signing in with Google proves *who* someone is, not that they are allowed in
 * — without this check any Google account on earth would become an admin. Set
 * ADMIN_ALLOWED_EMAILS to a comma-separated list; an empty list denies
 * everyone, which is the safe default for a misconfigured deployment.
 */
export function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowed = getAllowedAdminEmails();
  if (allowed.length === 0) {
    console.error(
      "ADMIN_ALLOWED_EMAILS is not set — Google sign-in is disabled so an unlisted account cannot become an admin."
    );
    return false;
  }
  return allowed.includes(email.trim().toLowerCase());
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
