import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro, primaryButton, textLink } from "@/components/layout/page-intro";
import { CASE_NOTES } from "@/data/case-notes";
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
    <div className="pb-8">
      <PageIntro
        title="One team, from your first message to long after launch"
        lead="Kiwik designs, builds and looks after software for businesses: websites, mobile apps, AI systems, online stores and custom platforms."
        points={["Your message reaches the team directly", "Plain language, not jargon", "Dubai and Hyderabad"]}
      >
        <Link href="/contact" className={primaryButton}>Start a project <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <Link href="/projects" className={textLink}>See our work</Link>
      </PageIntro>

      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:grid-cols-[1fr_2fr]">
        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-text-primary">What we can do for you</h2>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <li key={s.id} className="border-t border-text-primary/10 py-5">
              <h3 className="text-lg font-bold text-text-primary">{s.title}</h3>
              <p className="mt-1 text-base leading-relaxed text-text-secondary text-pretty">{s.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:grid-cols-[1fr_2fr]">
        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-text-primary">What working with us is like</h2>
        <ol>
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.id} className="grid grid-cols-[3rem_1fr] border-t border-text-primary/10 py-5">
              <span aria-hidden="true" className="text-2xl font-serif font-bold text-[#007a78] dark:text-[#4fc3bd] lining-nums">{i + 1}</span>
              <div>
                <h3 className="text-lg font-bold text-text-primary">{s.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-text-secondary">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:grid-cols-[1fr_2fr]">
        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-text-primary">What we have built</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((p) => (
              <li key={p.slug} className="border-t border-text-primary/10">
                <Link href={`/projects/${p.slug}`} className="group flex items-center justify-between gap-6 py-5">
                  <span>
                    <span className="block text-2xl font-serif font-bold text-text-primary">{p.name}</span>
                    <span className="mt-1 block text-base text-text-secondary">{CASE_NOTES[p.slug]?.built || p.tagline}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-text-secondary">Our projects will appear here soon.</p>
        )}
      </section>
    </div>
  );
}
