/**
 * Shared input validation.
 *
 * Every rule here exists because the permissive default let something through:
 *
 *  - `type="email"` follows the HTML5 spec regex, whose local part is
 *    `[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+`. Dots are unrestricted inside it, so
 *    `a..b@example.com` and `.....@gmail.com` both validate. It also accepts
 *    `test@test` with no TLD at all.
 *  - `if (!value.trim()) return;` rejects the empty string but says nothing to
 *    the user, so a form submitted with only spaces appears to do nothing.
 *  - `type="number"` with no `min` accepts negatives, so a percentage or a
 *    count can be set to -2.
 *
 * Validators return `null` when the value is acceptable and a human-readable
 * message when it is not, so a caller can render the message directly.
 */

export type ValidationResult = string | null;

/** True when a value is empty or consists only of whitespace. */
export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Required text. Rejects whitespace-only input with an explicit message rather
 * than silently returning.
 */
export function validateRequired(value: string, label = "This field"): ValidationResult {
  if (!value || value.length === 0) return `${label} is required.`;
  if (value.trim().length === 0) return `${label} cannot be only spaces.`;
  return null;
}

export function validateLength(
  value: string,
  { min = 0, max = Infinity, label = "This field" }: { min?: number; max?: number; label?: string }
): ValidationResult {
  const len = value.trim().length;
  if (len < min) return `${label} must be at least ${min} characters.`;
  if (len > max) return `${label} must be ${max} characters or fewer.`;
  return null;
}

// ── Email ───────────────────────────────────────────────────────────────────

/**
 * Stricter than the HTML5 rule on the three points that matter in practice:
 * a dot may not start, end, or repeat inside the local part or the domain, and
 * a real TLD of at least two letters is required.
 */
const EMAIL_LOCAL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const EMAIL_DOMAIN_LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

export function validateEmail(raw: string, { required = true, label = "Email" } = {}): ValidationResult {
  const value = (raw ?? "").trim();
  if (!value) return required ? `${label} is required.` : null;
  if (/\s/.test(value)) return `${label} cannot contain spaces.`;
  if (value.length > 254) return `${label} is too long.`;

  const at = value.lastIndexOf("@");
  if (at <= 0 || at === value.length - 1) return `Enter a valid ${label.toLowerCase()}, like name@example.com.`;

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);

  if (local.length > 64) return `${label} is too long before the @.`;
  if (!EMAIL_LOCAL.test(local)) {
    return local.includes("..")
      ? `${label} cannot contain two dots in a row.`
      : `Enter a valid ${label.toLowerCase()}, like name@example.com.`;
  }

  if (domain.includes("..")) return `${label} cannot contain two dots in a row.`;
  const labels = domain.split(".");
  if (labels.length < 2) return `${label} needs a domain ending, like .com.`;
  if (!labels.every((l) => EMAIL_DOMAIN_LABEL.test(l))) {
    return `Enter a valid ${label.toLowerCase()}, like name@example.com.`;
  }
  if (!/^[A-Za-z]{2,}$/.test(labels[labels.length - 1])) {
    return `${label} needs a valid domain ending, like .com.`;
  }
  return null;
}

export function isValidEmail(value: string): boolean {
  return validateEmail(value) === null;
}

// ── Phone ───────────────────────────────────────────────────────────────────

/**
 * Accepts an optional leading +, then 7-15 digits, allowing spaces, hyphens,
 * parentheses and dots purely as separators. A string of separators with no
 * digits — "-----" — has no digits and is rejected.
 */
export function validatePhone(raw: string, { required = true, label = "Phone number" } = {}): ValidationResult {
  const value = (raw ?? "").trim();
  if (!value) return required ? `${label} is required.` : null;
  if (/[A-Za-z]/.test(value)) return `${label} cannot contain letters.`;
  if (/[^0-9+()\-.\s]/.test(value)) return `${label} contains invalid characters.`;
  if (value.indexOf("+") > 0) return `${label} may only start with +.`;

  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return `Enter a valid ${label.toLowerCase()}.`;
  if (digits.length < 7) return `${label} is too short.`;
  if (digits.length > 15) return `${label} is too long.`;
  return null;
}

export function isValidPhone(value: string): boolean {
  return validatePhone(value) === null;
}

// ── URL ─────────────────────────────────────────────────────────────────────

/** Absolute http(s) URLs, or site-relative paths beginning with a slash. */
export function validateUrl(
  raw: string,
  { required = false, allowRelative = true, label = "URL" } = {}
): ValidationResult {
  const value = (raw ?? "").trim();
  if (!value) return required ? `${label} is required.` : null;
  if (/\s/.test(value)) return `${label} cannot contain spaces.`;
  if (value.startsWith("/")) {
    return allowRelative ? null : `${label} must be a full URL starting with https://.`;
  }
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return `${label} must start with http:// or https://.`;
    }
    if (!u.hostname.includes(".")) return `${label} needs a valid domain.`;
    return null;
  } catch {
    return `Enter a valid ${label.toLowerCase()}, like https://example.com.`;
  }
}

// ── Numbers ─────────────────────────────────────────────────────────────────

/**
 * Clamps a numeric field to its allowed range. Number inputs across the studio
 * carried no `min`, so counts and percentages accepted negatives and
 * percentages could exceed 100.
 */
export function clampNumber(
  raw: string | number,
  { min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0, integer = true } = {}
): number {
  const n = typeof raw === "number" ? raw : parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  const bounded = Math.min(max, Math.max(min, n));
  return integer ? Math.round(bounded) : bounded;
}

export function validateNumber(
  raw: string | number,
  { min = -Infinity, max = Infinity, label = "This value", required = true } = {}
): ValidationResult {
  const str = typeof raw === "number" ? String(raw) : (raw ?? "").trim();
  if (!str) return required ? `${label} is required.` : null;
  const n = Number(str);
  if (!Number.isFinite(n)) return `${label} must be a number.`;
  if (n < min) return `${label} cannot be less than ${min}.`;
  if (n > max) return `${label} cannot be more than ${max}.`;
  return null;
}
