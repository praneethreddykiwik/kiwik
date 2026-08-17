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

/**
 * Pre-rendered, not dynamic.
 *
 * `force-dynamic` meant every click re-rendered on the server and re-read the
 * database — measured at 0.9-4.4s against the list page's 0.12s. Worse, Next
 * cannot prefetch a force-dynamic route, so hovering a project card fetched
 * nothing and the click paid the whole cost with no head start.
 *
 * The pages are now built ahead of time from the slugs in the database and
 * served from the CDN, which is what makes the click feel immediate: the card
 * prefetches on hover and the transition is client-side.
 *
 * `revalidate` is the ceiling for a change made outside the app (a row edited
 * straight in the Supabase dashboard). Publishing through the studio does not
 * wait for it — the projects API calls revalidatePath, which regenerates these
 * pages on the spot. Unlike a CDN entry written from a Cache-Control header,
 * an ISR page is exactly what revalidatePath is built to purge.
 */
export const revalidate = 300;

/** Build a page for every project that exists at build time. */
export async function generateStaticParams() {
  try {
    const projects = await getPublicProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    // A build with no database reachable still succeeds; the pages render on
    // first request instead.
    return [];
  }
}

// A slug added after the build still renders on demand, then is cached.
export const dynamicParams = true;

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
    `${project.name} — a project built and run on Kiwik.`;
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

  // SeoEntity types techStack as string[], but rows in the database store it as
  // [{ name, color, category }]. Joining the raw array yielded "[object Object]"
  // in both the visible summary and the structured data, so normalise here.
  const techNames: string[] = (project.techStack || [])
    .map((t: unknown) => (typeof t === "string" ? t : (t as { name?: string })?.name))
    .filter((n): n is string => Boolean(n));

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
        ...(techNames.length ? { keywords: techNames.join(", ") } : {}),
        ...(project.liveUrl ? { installUrl: project.liveUrl } : {}),
        publisher: { "@type": "Organization", name: "Kiwik", url: absoluteUrl("/") },
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

      {/* Server-rendered summary of the record.

          ProjectDetailContent is a client component that reads the project from
          the store after hydration, so none of the project's own words reach
          the HTML — a crawler fetching this URL got about 1,200 characters of
          navigation and footer, with the project's name appearing once and its
          description, stack and status not at all. Search engines and AI
          crawlers do not run the JavaScript that fills that in. This section
          states the same facts as real text, from the same database record. */}
      <section
        aria-labelledby="project-summary-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4"
      >
        <h2
          id="project-summary-heading"
          className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted mb-4"
        >
          About {project.name}
        </h2>
        <div className="max-w-3xl space-y-4">
          {(project.description || project.tagline) && (
            <p className="text-base text-text-secondary leading-relaxed">
              <strong className="text-text-primary">{project.name}</strong>
              {project.tagline ? ` — ${project.tagline}. ` : " — "}
              {project.description}
            </p>
          )}
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {project.category && (
              <div className="flex gap-2">
                <dt className="text-text-muted">Category:</dt>
                <dd className="text-text-primary font-medium">{project.category}</dd>
              </div>
            )}
            {project.status && (
              <div className="flex gap-2">
                <dt className="text-text-muted">Status:</dt>
                <dd className="text-text-primary font-medium">{project.status}</dd>
              </div>
            )}
            {techNames.length > 0 && (
              <div className="flex gap-2">
                <dt className="text-text-muted">Built with:</dt>
                <dd className="text-text-primary font-medium">{techNames.join(", ")}</dd>
              </div>
            )}
          </dl>
          {(project.liveUrl || project.githubUrl) && (
            <p className="text-sm text-text-secondary">
              {project.liveUrl && (
                <a href={project.liveUrl} rel="noopener" className="text-accent-blue hover:underline">
                  Visit {project.name}
                </a>
              )}
              {project.liveUrl && project.githubUrl && <span className="mx-2 text-text-muted">·</span>}
              {project.githubUrl && (
                <a href={project.githubUrl} rel="noopener" className="text-accent-blue hover:underline">
                  Source on GitHub
                </a>
              )}
            </p>
          )}
        </div>
      </section>

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
