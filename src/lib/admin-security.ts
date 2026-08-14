import { sql, ensureDbTables } from "@/lib/db";

/**
 * Admin access control, stored in the database so it can be managed from the
 * studio instead of requiring an environment change and a redeploy.
 *
 * Resolution order for the allowlist:
 *   1. the stored list, once an administrator has set one;
 *   2. otherwise ADMIN_ALLOWED_EMAILS from the environment.
 *
 * The environment list is also always honoured as a break-glass route, so a
 * mistake in the studio can never lock every administrator out permanently.
 */

export type AdminSecurity = {
  allowedEmails: string[];
  passwordHash?: string;
  passwordSalt?: string;
  passwordLoginEnabled: boolean;
  updatedAt?: string;
};

const DEFAULTS: AdminSecurity = {
  allowedEmails: [],
  passwordLoginEnabled: false,
};

function envEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export async function readAdminSecurity(): Promise<AdminSecurity> {
  try {
    await ensureDbTables();
    const rows = await sql`SELECT data FROM admin_security WHERE key = 'main' LIMIT 1;`;
    if (rows.length && rows[0].data && typeof rows[0].data === "object") {
      const d = rows[0].data as Partial<AdminSecurity>;
      return {
        ...DEFAULTS,
        ...d,
        allowedEmails: Array.isArray(d.allowedEmails)
          ? d.allowedEmails.map(normaliseEmail).filter(Boolean)
          : [],
      };
    }
  } catch {
    /* fall through to environment-only mode */
  }
  return { ...DEFAULTS };
}

export async function writeAdminSecurity(next: AdminSecurity): Promise<void> {
  await ensureDbTables();
  await sql`
    INSERT INTO admin_security (key, data, updated_at)
    VALUES ('main', ${sql.json({ ...next, updatedAt: new Date().toISOString() })}, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `;
}

/** Everyone permitted to sign in: the stored list plus the environment fallback. */
export async function resolveAllowedEmails(): Promise<string[]> {
  const stored = await readAdminSecurity();
  const merged = new Set<string>([...stored.allowedEmails, ...envEmails()]);
  return [...merged];
}

/**
 * Authorisation check for a Google-verified email.
 *
 * Authenticating with Google proves identity only. An empty allowlist denies
 * everyone rather than admitting everyone — the safe direction for a
 * half-configured deployment.
 */
export async function isEmailAllowed(email: string | undefined | null): Promise<boolean> {
  if (!email) return false;
  const allowed = await resolveAllowedEmails();
  if (allowed.length === 0) {
    console.error("No admin emails configured — Google sign-in denies everyone.");
    return false;
  }
  return allowed.includes(normaliseEmail(email));
}

// ── Password hashing ────────────────────────────────────────────────────────
// PBKDF2 via Web Crypto: no dependency, and the stored password is never
// recoverable from the database the way the old plaintext env value was.

const PBKDF2_ITERATIONS = 210_000;

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
    : crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return { hash: toHex(bits), salt: toHex(salt.buffer as ArrayBuffer) };
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Verifies a password against the stored hash, falling back to the environment
 * password only while no hash has been set yet — so an existing deployment
 * keeps working until an administrator sets one from the studio.
 */
export async function verifyAdminPassword(input: string): Promise<boolean> {
  if (!input) return false;
  const stored = await readAdminSecurity();

  if (stored.passwordHash && stored.passwordSalt) {
    const { hash } = await hashPassword(input, stored.passwordSalt);
    return constantTimeEqual(hash, stored.passwordHash);
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) return false;
  return constantTimeEqual(input, envPassword);
}

/** Password login is off unless explicitly turned on, in the studio or the environment. */
export async function isPasswordLoginOn(): Promise<boolean> {
  const stored = await readAdminSecurity();
  if (stored.passwordLoginEnabled) return true;
  return process.env.ADMIN_PASSWORD_LOGIN === "true" && Boolean(process.env.ADMIN_PASSWORD);
}
