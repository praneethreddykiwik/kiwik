import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";
import { getProjectBySlug, getPublicProjects } from "@/lib/seo-data";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

/**
 * Server wrapper around the existing client detail view.
 *
 * The page itself stays exactly as it was — this only adds per-project
 * metadata, which a client component cannot export. Every field is read from
 * the same database record the page renders, so a rename or an SEO edit in the
 * admin studio changes the title, description, canonical, Open Graph and
 * structured data without a code change.
 */

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: true },
    };
  }

  const seo = (project.seo || {}) as Record<string, any>;
  const canonical = seo.canonicalUrl || absoluteUrl(`/projects/${project.slug}`);
  const title =
    seo.title || `${project.name}${project.tagline ? ` — ${project.tagline}` : ""}`;
  const description =
    seo.description ||
    project.description ||
    project.tagline ||
    `${project.name} — a project in the Kiwik ecosystem by Criska.`;
  const image = seo.ogImage || project.coverImage;

  return {
    title,
    description,
    keywords: Array.isArray(seo.keywords) ? seo.keywords : undefined,
    alternates: { canonical },
    robots:
      seo.noIndex === true
        ? { index: false, follow: seo.noFollow !== true }
        : { index: true, follow: seo.noFollow !== true },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: canonical,
      siteName: SITE_NAME,
      type: "article",
      images: image ? [{ url: image, alt: `${project.name} — ${project.tagline || "Kiwik project"}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || title,
      description: seo.twitterDescription || description,
      images: seo.twitterImage || image ? [seo.twitterImage || image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  // An unknown slug must be a real 404. Previously the client view rendered a
  // soft "not found" panel at HTTP 200, which lets search engines index dead
  // URLs and hides broken links from monitoring.
  if (!project) notFound();
  const all = await getPublicProjects();
  const related = all.filter((p) => p.slug !== slug).slice(0, 3);

  // Structured data describes only what the page actually shows.
  const jsonLd = project
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: project.name,
        description: project.description || project.tagline,
        url: absoluteUrl(`/projects/${project.slug}`),
        applicationCategory: project.category || "WebApplication",
        ...(project.coverImage ? { image: project.coverImage } : {}),
        ...(project.techStack?.length ? { keywords: project.techStack.join(", ") } : {}),
        ...(project.liveUrl ? { installUrl: project.liveUrl } : {}),
        publisher: { "@type": "Organization", name: "Criska", url: absoluteUrl("/") },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <ProjectDetailContent />

      {/* Crawlable related links. The detail view navigates client-side, so
          without real anchors these relationships are invisible to a crawler. */}
      {related.length > 0 && (
        <nav
          aria-label="Related projects"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        >
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
            More Kiwik projects
          </h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/projects/${p.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-glass-bg border border-glass-border text-sm font-medium text-text-primary hover:border-accent-blue/40 transition-colors"
                >
                  {p.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/docs"
                className="inline-flex items-center px-4 py-2 rounded-full bg-glass-bg border border-glass-border text-sm font-medium text-text-primary hover:border-accent-blue/40 transition-colors"
              >
                Documentation
              </a>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
