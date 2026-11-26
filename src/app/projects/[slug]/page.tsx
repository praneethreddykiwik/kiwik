import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";
import { getProjectBySlug, getPublicProjects } from "@/lib/seo-data";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import type { Project } from "@/types";

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

/** The studio's sample description, for projects where nobody has replaced it. */
function withoutPlaceholder<T extends { description?: string; tagline?: string }>(project: T | null): T | null {
  return project?.description && /will be updated here/i.test(project.description)
    ? { ...project, description: undefined }
    : project;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = withoutPlaceholder(await getProjectBySlug(slug));

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
    `${project.name} — a project built by Kiwik.`;
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
  const project = withoutPlaceholder(await getProjectBySlug(slug));
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
        ...(project.coverImage ? { image: project.coverImage.startsWith("/") ? absoluteUrl(project.coverImage) : project.coverImage } : {}),
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

      <ProjectDetailContent
        serverProject={{
          slug: project.slug,
          name: project.name,
          tagline: project.tagline,
          description: project.description,
          coverImage: project.coverImage,
          status: project.status as Project["status"],
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          techStack: techNames.map((name) => ({ name }) as Project["techStack"][number]),
        }}
      />

      {/* Crawlable related links. The detail view navigates client-side, so
          without real anchors these relationships are invisible to a crawler. */}
      {related.length > 0 && (
        <nav
          aria-label="Related projects"
          className="mx-auto max-w-[1400px] px-4 pb-4 sm:px-6 md:px-8"
        >
          <h2 className="sr-only">More of our work</h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/projects/${p.slug}`}
                  className="inline-flex items-center rounded-full border border-text-primary/15 px-5 py-2.5 text-base font-semibold text-text-primary transition-colors hover:border-[#008080]"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
