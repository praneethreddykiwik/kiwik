/**
 * Allowed values for the contact form's constrained fields.
 *
 * Shared by the form and by /api/contact so the two cannot drift: the server
 * validates against this exact list rather than accepting whatever the select
 * happened to submit, which is what makes the dropdown a real constraint and
 * not just a UI affordance.
 */

/** Drawn from the capabilities the site actually advertises. */
export const SERVICE_OPTIONS = [
  "Digital Flagships",
  "Native Mobile Engineering",
  "Applied Intelligence",
  "Commerce Engines",
  "Product Engineering",
  "Cloud Foundations",
  "Workflow Autopilot",
  "Zero-Trust Security",
  "Growth Marketing Partnership",
  "Something else",
] as const;

/** Names the services had before, so old links and saved forms still resolve. */
const LEGACY_SERVICES: Record<string, (typeof SERVICE_OPTIONS)[number]> = {
  "Website Development": "Digital Flagships",
  "App Development": "Native Mobile Engineering",
  "AI Development": "Applied Intelligence",
  "E-commerce": "Commerce Engines",
  "Software & Product Development": "Product Engineering",
  "Cloud & DevOps": "Cloud Foundations",
  "Automation & Workflows": "Workflow Autopilot",
  "Security & Identity": "Zero-Trust Security",
  "Digital Market Partnership": "Growth Marketing Partnership",
};

/** The current option for a value that may use an old service name, or "" if it is not one. */
export function toServiceOption(value: string | undefined | null): (typeof SERVICE_OPTIONS)[number] | "" {
  if (!value) return "";
  if ((SERVICE_OPTIONS as readonly string[]).includes(value)) return value as (typeof SERVICE_OPTIONS)[number];
  return LEGACY_SERVICES[value] || "";
}

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export function isServiceOption(value: string): value is ServiceOption {
  return (SERVICE_OPTIONS as readonly string[]).includes(value);
}

/** Dialling codes offered by the phone field. */
export const COUNTRY_CODES = [
  { code: "+91", label: "IN", flag: "🇮🇳" },
  { code: "+1", label: "US", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+61", label: "AU", flag: "🇦🇺" },
  { code: "+65", label: "SG", flag: "🇸🇬" },
  { code: "+971", label: "AE", flag: "🇦🇪" },
  { code: "+49", label: "DE", flag: "🇩🇪" },
  { code: "+33", label: "FR", flag: "🇫🇷" },
  { code: "+81", label: "JP", flag: "🇯🇵" },
  { code: "+86", label: "CN", flag: "🇨🇳" },
] as const;

export const DEFAULT_COUNTRY_CODE = "+91";

export function isCountryCode(value: string): boolean {
  return COUNTRY_CODES.some((c) => c.code === value);
}

/**
 * The national part only — the country code is a separate field, so a caller
 * pasting "+91 98765 43210" into the number box would otherwise store the code
 * twice. Digits are counted after stripping the usual separators.
 */
export function validateNationalNumber(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/[A-Za-z]/.test(value)) return "Phone number cannot contain letters.";
  if (value.includes("+")) return "Choose the country code from the dropdown instead of typing +.";
  if (/[^0-9()\-.\s]/.test(value)) return "Phone number contains invalid characters.";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "Enter a valid phone number.";
  if (digits.length < 6) return "Phone number is too short.";
  if (digits.length > 14) return "Phone number is too long.";
  return null;
}
