import type { MetadataRoute } from "next";
import { SITE_URL, STATIC_ROUTES, absoluteUrl } from "@/lib/site";
import { getPublicProjects, getPublicProducts } from "@/lib/seo-data";

// Rebuilt on every request so a project added, renamed or deleted in the admin
// studio is reflected immediately rather than at the next deploy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Projects and partners come from the database — the same rows the public
  // pages render — so the sitemap can never drift from what is actually live.
  const [projects, products] = await Promise.all([
    getPublicProjects().catch(() => []),
    getPublicProducts().catch(() => []),
  ]);

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: absoluteUrl(`/projects/${p.slug}`),
    // Real update timestamps only; a fabricated lastmod is worse than none.
    lastModified: p.lastModified ?? undefined,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/partners/${p.slug}`),
    lastModified: p.lastModified ?? undefined,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const all = [...staticEntries, ...projectEntries, ...productEntries];

  // Defensive: never publish a URL that isn't on the canonical origin, and
  // never publish a duplicate.
  const seen = new Set<string>();
  return all.filter((entry) => {
    if (!entry.url.startsWith(SITE_URL)) return false;
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
