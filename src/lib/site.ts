/**
 * Single source of truth for the site's public identity.
 *
 * Every canonical URL, sitemap entry, robots directive and Open Graph tag
 * derives from SITE_URL so the origin is never hardcoded per-file. Override it
 * with NEXT_PUBLIC_SITE_URL if the canonical host ever changes.
 *
 * Note: at the time of writing, https://kiwik.one 308-redirects to
 * https://www.kiwik.one. Whichever host is canonical must be the one that
 * serves 200 directly — otherwise every URL published here costs a redirect
 * hop. See the deployment note in the SEO report.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kiwik.one"
).replace(/\/$/, "");

export const SITE_NAME = "Kiwik";

/**
 * Kept under 60 characters so Google shows it whole rather than truncating it,
 * and brand-first so the name is the first thing read on a brand-name query.
 */
export const SITE_TITLE = "Kiwik — The Operating System for Digital Products";

/**
 * Roughly 150 characters: long enough to say what Kiwik is, short enough that
 * Google is unlikely to rewrite or clip it.
 */
export const SITE_DESCRIPTION =
  "Kiwik is the operating system for digital products — projects, documentation, AI, cloud infrastructure, automation and deployments in one workspace.";

/** Absolute URL for any app path. Accepts "/", "docs", "/projects/x". */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "/" : clean.replace(/\/$/, "")}`;
}

/** Paths that must never be indexed or appear in the sitemap. */
export const PRIVATE_PATHS = [
  "/admin",
  "/api",
  "/login",
  "/auth",
  "/dashboard",
  "/private",
];

/**
 * Public routes that actually exist in src/app.
 *
 * Deliberately excludes /capabilities and /how-we-work: those are sections on
 * the home page (`#capabilities`, `#how-we-work`), not routes. Listing them
 * here would publish URLs that 404, which is what breaks a sitemap in Search
 * Console.
 */
export const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/projects", priority: 0.9, changeFrequency: "daily" },
  { path: "/partners", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
];
