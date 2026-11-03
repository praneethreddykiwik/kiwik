import { sql } from "@/lib/db";

/**
 * Real analytics for the admin Analytics tab.
 *
 * The tab used to render seeded demo numbers from the CMS defaults (420,000
 * visitors from the United States, clicks on projects that do not exist), and
 * "search tracking" only incremented a counter in each visitor's own browser,
 * so nothing ever reached the server. Counts now live in site_analytics_counts:
 * one row per (kind, key), holding nothing but the counted value.
 */

export type AnalyticsKind = "search" | "project" | "country";

export async function bumpAnalytics(kind: AnalyticsKind, rawKey: string): Promise<void> {
  const key = rawKey.trim().toLowerCase().slice(0, 120);
  if (!key) return;
  await sql`
    INSERT INTO site_analytics_counts (kind, key, count, updated_at)
    VALUES (${kind}, ${key}, 1, CURRENT_TIMESTAMP)
    ON CONFLICT (kind, key) DO UPDATE
    SET count = site_analytics_counts.count + 1, updated_at = CURRENT_TIMESTAMP;
  `;
}

export async function topAnalytics(kind: AnalyticsKind, limit = 10) {
  const rows = await sql`
    SELECT key, count FROM site_analytics_counts
    WHERE kind = ${kind}
    ORDER BY count DESC, updated_at DESC
    LIMIT ${limit};
  `;
  return rows.map((r: any) => ({ key: String(r.key), count: Number(r.count) }));
}

/** Project slug from a pathname like /projects/sowcha, else null. */
export function projectSlugFromPath(pathname: string): string | null {
  const m = /^\/projects\/([a-z0-9][a-z0-9-]{0,80})\/?$/i.exec(pathname || "");
  return m ? m[1].toLowerCase() : null;
}
