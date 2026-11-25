import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { PROCESS_STEPS, SERVICES } from "@/data/home-content";
import { getPublicProjects } from "@/lib/seo-data";

export const dynamic = "force-dynamic";

const TITLE = "About Kiwik — Software, App and AI Development";
const DESCRIPTION =
  "Kiwik designs, builds and supports websites, mobile apps, AI systems and online stores. What we do, how we work and the products we have built.";

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
          Kiwik designs, builds and supports software for businesses: websites, mobile apps, AI
          systems, online stores and custom platforms.
        </p>

        <h2>What we build</h2>
        <ul>
          {SERVICES.map((s) => (
            <li key={s.id}>
              <strong>{s.title}.</strong> {s.desc}
            </li>
          ))}
        </ul>

        <h2>How we work</h2>
        <ol>
          {PROCESS_STEPS.map((s) => (
            <li key={s.id}>
              <strong>{s.title}.</strong> {s.desc}
            </li>
          ))}
        </ol>

        <h2>Products we have built</h2>
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
          <p>Our projects will appear here soon.</p>
        )}

        <h2>Where to go next</h2>
        <ul>
          <li>
            <Link href="/projects">Projects</Link>: see what we have built.
          </li>
          <li>
            <Link href="/partners">Digital Market Partner</Link>: brands we work with.
          </li>
          <li>
            <Link href="/contact">Contact</Link>: tell us about your project.
          </li>
        </ul>
      </article>
    </div>
  );
}
