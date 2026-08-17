import { cache } from "react";
// Server-only module: imported exclusively by server components and route
// handlers (sitemap, generateMetadata), never by a client component.
import { sql, ensureDbTables } from "@/lib/db";
import { projects as defaultProjects } from "@/data/projects";
import { partnerProducts as defaultProducts } from "@/data/partner-products";

/**
 * Server-side reads of the same records the public pages render.
 *
 * The sitemap and per-page metadata must never keep their own copy of the
 * content — a separate list would drift the moment a project is added, renamed
 * or deleted in the admin studio. These helpers read the `projects` and
 * `products` tables directly, which is the same source `/api/projects` and
 * `/api/products` serve to the client.
 */

export type SeoEntity = {
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  coverImage?: string;
  category?: string;
  status?: string;
  visibility?: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack?: string[];
  lastModified?: Date;
  seo?: Record<string, unknown>;
};

/**
 * A record counts as publicly indexable unless it is explicitly hidden.
 * Absent visibility means public, so existing rows keep working; setting
 * `visibility` to PRIVATE/DRAFT/ARCHIVED, or `seo.noIndex`, removes it.
 */
export function isPublic(record: any): boolean {
  const visibility = String(record?.visibility ?? record?.data?.visibility ?? "PUBLIC").toUpperCase();
  if (["PRIVATE", "DRAFT", "ARCHIVED"].includes(visibility)) return false;
  if (record?.seo?.noIndex === true || record?.seo?.includeInSitemap === false) return false;
  if (record?.visible === false || record?.published === false) return false;
  return true;
}

function toDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function normalise(row: any, fallbackDate?: Date): SeoEntity | null {
  const data = row?.data && typeof row.data === "object" ? row.data : row;
  const slug = row?.slug || data?.slug;
  const name = row?.name || data?.name;
  if (!slug || !name) return null;
  return {
    slug,
    name,
    tagline: data?.tagline,
    description: data?.description || data?.summary,
    coverImage: row?.cover_image || data?.coverImage,
    category: data?.category,
    status: data?.status,
    visibility: data?.visibility,
    liveUrl: data?.liveUrl,
    githubUrl: data?.githubUrl || data?.repoUrl,
    techStack: Array.isArray(data?.techStack)
      ? data.techStack.map((t: any) => (typeof t === "string" ? t : t?.name)).filter(Boolean)
      : undefined,
    lastModified: toDate(row?.updated_at) || toDate(data?.lastUpdated) || fallbackDate,
    seo: data?.seo,
  };
}

/** Public projects, straight from the database the admin studio writes to. */
export const getPublicProjects = cache(async function getPublicProjects(): Promise<SeoEntity[]> {
  try {
    await ensureDbTables();
    const rows = await sql`
      SELECT id, slug, name, cover_image, data, updated_at
      FROM projects
      ORDER BY sort_order ASC NULLS LAST, created_at DESC;
    `;
    const mapped = rows.map((r: any) => normalise(r)).filter(Boolean) as SeoEntity[];
    // Only fall back to seeds when the database itself is unreachable — an
    // empty table is a real state and must produce an empty list, or deleted
    // projects would reappear in the sitemap.
    return mapped.filter((p) => isPublic(p));
  } catch {
    return defaultProjects.map((p) => normalise(p)).filter(Boolean) as SeoEntity[];
  }
});

/** Public partner products (the /partners showcase). */
export const getPublicProducts = cache(async function getPublicProducts(): Promise<SeoEntity[]> {
  try {
    await ensureDbTables();
    const rows = await sql`
      SELECT id, slug, name, data, updated_at FROM products
      ORDER BY sort_order ASC NULLS LAST, created_at DESC;
    `;
    const mapped = rows.map((r: any) => normalise(r)).filter(Boolean) as SeoEntity[];
    return mapped.filter((p) => isPublic(p));
  } catch {
    return defaultProducts.map((p) => normalise(p)).filter(Boolean) as SeoEntity[];
  }
});

/**
 * Deduplicated per request.
 *
 * A project page called this from generateMetadata and again from the component,
 * and each call read the whole projects table — three full reads to render one
 * page. React's cache() memoises for the lifetime of a single request, so the
 * table is read once and the other two callers get the same promise.
 */
export const getProjectBySlug = cache(async function getProjectBySlug(slug: string): Promise<SeoEntity | null> {
  const all = await getPublicProjects();
  return all.find((p) => p.slug === slug) || null;
});

export async function getProductBySlug(slug: string): Promise<SeoEntity | null> {
  const all = await getPublicProducts();
  return all.find((p) => p.slug === slug) || null;
}
