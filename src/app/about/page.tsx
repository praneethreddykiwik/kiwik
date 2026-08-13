import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { getPublicProjects } from "@/lib/seo-data";

export const dynamic = "force-dynamic";

const TITLE = "About Kiwik — The Operating System for Digital Products";
const DESCRIPTION =
  "Kiwik is the operating system for digital products built by Criska. Learn what Kiwik is, how Kiwik OS relates to the Criska ecosystem, the projects it runs, and the technology behind it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/about"),
    siteName: SITE_NAME,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function AboutPage() {
  // The project list is read from the same database the rest of the site uses,
  // so this page can never describe projects that no longer exist.
  const projects = await getPublicProjects();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-24">
      <article className="markdown-body">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary mb-6">
          About Kiwik
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed">
          Kiwik is the operating system for the <strong>Criska</strong> digital product
          ecosystem. It brings projects, documentation, AI assistance, cloud infrastructure,
          automation, deployments and engineering workflows into one unified workspace,
          so the work and the record of the work live in the same place.
        </p>

        <h2>What Kiwik is</h2>
        <p>
          Most teams keep their products in one system, their documentation in another and
          their operational knowledge in a third. Kiwik exists to collapse that. Every
          project has a single page that carries its description, status, stack,
          screenshots and links — and that page is generated from one record, edited once,
          in the Kiwik CMS.
        </p>

        <h2>Kiwik OS and Kiwik.1</h2>
        <p>
          <strong>Kiwik OS</strong> is the platform layer: the content model, the admin
          studio, the search, the AI assistant and the publishing pipeline.{" "}
          <strong>Kiwik.1</strong> is the current generation of that platform — the version
          running this site.
        </p>

        <h2>Kiwik and Criska</h2>
        <p>
          Criska is the studio; Kiwik is the operating system Criska builds and runs its
          products on. Work delivered for partners is published through the same system, so
          what you see on this site is the platform describing itself.
        </p>

        <h2>Projects in the ecosystem</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`}>{p.name}</Link>
                {p.tagline ? ` — ${p.tagline}` : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>Projects are published from the Kiwik CMS and appear here automatically.</p>
        )}

        <h2>Technology</h2>
        <p>
          Kiwik is built on Next.js, React and TypeScript with Tailwind CSS, backed by
          PostgreSQL, and deployed on Vercel. The assistant runs on a hosted language model
          constrained to the site&apos;s own project data, so it answers from what is
          actually published rather than from guesswork.
        </p>

        <h2>Who it&apos;s for</h2>
        <p>
          Teams that ship digital products and want one authoritative place for what
          exists, what state it is in, and how it works — without maintaining that record
          by hand in three different tools.
        </p>

        <h2>Where to go next</h2>
        <ul>
          <li>
            <Link href="/projects">Projects</Link> — everything currently published.
          </li>
          <li>
            <Link href="/partners">Digital Market Partner</Link> — brands built with Kiwik.
          </li>
          <li>
            <Link href="/docs">Documentation</Link> — architecture and platform reference.
          </li>
        </ul>
      </article>
    </div>
  );
}
