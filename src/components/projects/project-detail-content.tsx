"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { primaryButton, textLink } from "@/components/layout/page-intro";
import { CASE_NOTES, hostOf, projectState, realCaption, realText, SAMPLE_TIMELINE } from "@/data/case-notes";
import { cn } from "@/lib/utils";
import { useHistoryStore } from "@/stores/history-store";
import { useProjects } from "@/stores/projects-store";
import type { Project } from "@/types";

/**
 * A project, told to someone deciding whether Kiwik can help them: who it is
 * for, what was wrong, what was built and what it looks like. The technology
 * comes last.
 *
 * @param projectOverride the studio's live preview.
 * @param serverProject the published record, so the page has its words before any script runs.
 */
export function ProjectDetailContent({ projectOverride, serverProject }: { projectOverride?: Project; serverProject?: Partial<Project> }) {
  const projects = useProjects();
  const params = useParams();
  const slug = params?.slug as string;
  const { addToHistory } = useHistoryStore();
  const [mounted, setMounted] = useState(false);
  const [zoomed, setZoomed] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => setMounted(true), []);

  const saved = mounted ? projects.find((p) => p.slug === slug || p.id === slug) : undefined;
  const project = (projectOverride || saved || serverProject) as Project | undefined;

  useEffect(() => {
    if (saved && !projectOverride) addToHistory(saved.id);
  }, [saved, addToHistory, projectOverride]);

  useEffect(() => {
    if (!zoomed) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [zoomed]);

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-4xl font-serif font-bold text-text-primary">We cannot find that project</h1>
        <Link href="/projects" className={primaryButton}>See all our work</Link>
      </div>
    );
  }

  const note = CASE_NOTES[project.slug];
  const state = project.heroStatusBadge || projectState(project);
  const lead = project.heroSubtitle || project.tagline;
  const intro = realText(project.heroDescription) || realText(project.description);
  const story = (project.overviewParagraph || realText(project.longDescription) || "").split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  const features = project.features || [];
  const shots = (project.images || []).filter((img) => img?.src && img.src !== project.coverImage);
  const tech = (project.techStack || []).map((t) => (typeof t === "string" ? t : t?.name)).filter(Boolean) as string[];
  const timeline = (project.timeline || []).filter((t) => !SAMPLE_TIMELINE.has(t.title));
  const people = (project.contributors || []).filter((c) => c?.name && c.name !== "Kiwik");
  const contact = note ? `/contact?service=${encodeURIComponent(note.service)}` : "/contact";
  const Wide = "mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8";

  const index = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = !projectOverride && mounted && projects.length > 1 && index >= 0 ? projects[(index + 1) % projects.length] : undefined;

  return (
    <article className="pb-12 text-text-primary">
      <header className={cn(Wide, "pt-10 sm:pt-14")}>
        {!projectOverride && (
          <Link href="/projects" className="inline-flex items-center gap-2 text-base font-semibold text-text-secondary transition-colors hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {project.heroBackButtonLabel && project.heroBackButtonLabel !== "Back to Projects" ? project.heroBackButtonLabel : "All our work"}
          </Link>
        )}
        <div className="mt-8 flex items-center gap-4">
          {project.logo && <img src={project.logo} alt="" className="h-14 w-14 rounded-2xl object-contain" />}
          <p className={cn("text-base font-semibold", state === "Live" ? "text-[#007a78] dark:text-[#4fc3bd]" : "text-text-secondary")}>{state}</p>
        </div>
        <h1 className="mt-3 text-5xl sm:text-7xl font-serif font-bold tracking-tight leading-[1.04]">{project.name}</h1>
        {lead && <p className="mt-4 max-w-3xl text-xl sm:text-2xl leading-snug text-text-secondary text-pretty">{lead}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={primaryButton}>
              {project.heroCta1Text || `Visit ${hostOf(project.liveUrl)}`} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          <Link href={contact} className={project.liveUrl ? textLink : primaryButton}>We need something like this</Link>
        </div>
      </header>

      {project.coverImage && (
        <div className={cn(Wide, "mt-12")}>
          <img src={project.coverImage} alt={`${project.name}, the opening screen`} className="aspect-[16/9] w-full rounded-[28px] border border-text-primary/10 object-cover object-top" />
        </div>
      )}

      {note && (
        <dl className={cn(Wide, "mt-14 grid gap-10 md:mt-20 md:grid-cols-3")}>
          {([["Who it is for", note.who], ["The problem", note.problem], ["What we built", note.built]] as const).map(([term, text]) => (
            <div key={term}>
              <dt className="text-base font-bold text-[#007a78] dark:text-[#4fc3bd]">{term}</dt>
              <dd className="mt-2 text-xl leading-relaxed text-pretty">{text}</dd>
            </div>
          ))}
        </dl>
      )}

      {(note || features.length > 0) && (
        <section className={cn(Wide, "mt-16 md:mt-24")}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">What it does for the people using it</h2>
          {features.length > 0 && !note ? (
            <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <li key={f.title || i}>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-text-secondary">{f.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {note!.gives.map((g) => (
                <li key={g} className="flex items-baseline gap-4 border-t border-text-primary/10 py-4 text-lg">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 -translate-y-0.5 rounded-full bg-[#008080]" /> {g}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {(story.length > 0 || intro || (project.overviewHighlights || []).length > 0) && (
        <section className={cn(Wide, "mt-16 grid gap-6 md:mt-24 lg:grid-cols-[1fr_2fr]")}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">{project.overviewHeading || `About ${project.name}`}</h2>
          <div className="max-w-[68ch] space-y-5 text-lg leading-relaxed text-text-secondary">
            {(story.length > 0 ? story : [intro]).map((t) => <p key={t}>{t}</p>)}
            {(project.overviewHighlights || []).length > 0 && (
              <ul className="list-disc space-y-1.5 pl-5">
                {project.overviewHighlights!.map((h) => <li key={h}>{h}</li>)}
              </ul>
            )}
            {project.overviewImage && <img src={project.overviewImage} alt="" className="w-full rounded-2xl border border-text-primary/10" />}
          </div>
        </section>
      )}

      {shots.length > 0 && (
        <section className={cn(Wide, "mt-16 md:mt-24")}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">See it</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {shots.map((img, i) => (
              <li key={img.src} className={cn(shots.length % 2 === 1 && i === 0 && "sm:col-span-2")}>
                <button type="button" onClick={() => setZoomed({ src: img.src, alt: img.alt || project.name })} className="group block w-full cursor-zoom-in overflow-hidden rounded-[20px] border border-text-primary/10 text-left">
                  <img src={img.src} alt={img.alt || `${project.name} screen`} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" />
                </button>
                {realCaption(img.caption) && <p className="mt-2.5 text-base text-text-secondary">{realCaption(img.caption)}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {timeline.length > 0 && (
        <section className={cn(Wide, "mt-16 md:mt-24")}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">How it came together</h2>
          <ol className="mt-6 divide-y divide-text-primary/10">
            {timeline.map((t, i) => (
              <li key={i} className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[10rem_1fr]">
                <span className="text-base text-text-secondary">{t.date}</span>
                <div>
                  <h3 className="text-lg font-bold">{t.title}</h3>
                  <p className="mt-1 text-base leading-relaxed text-text-secondary">{t.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {people.length > 0 && (
        <section className={cn(Wide, "mt-16 md:mt-24")}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Who worked on it</h2>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
            {people.map((c, i) => (
              <li key={i} className="flex items-center gap-3">
                {c.avatar && <img src={c.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />}
                <span><span className="block text-base font-bold">{c.name}</span><span className="block text-base text-text-secondary">{c.role}</span></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(tech.length > 0 || project.githubUrl || (project.quickActions || []).length > 0) && (
        <footer className={cn(Wide, "mt-16 md:mt-20")}>
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-text-primary/10 pt-6 text-base text-text-secondary">
            {tech.length > 0 && <p><span className="font-bold text-text-primary">Built with</span> {tech.join(", ")}</p>}
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-text-primary">{project.heroCta2Text || "Source code"}</a>}
            {(project.quickActions || []).filter((a) => a.visible !== false).map((a) => (
              <a key={a.label} href={a.externalUrl || a.route || "#"} target={a.newTab ? "_blank" : "_self"} rel="noopener noreferrer" className="underline underline-offset-4 hover:text-text-primary">{a.label}</a>
            ))}
          </div>
        </footer>
      )}

      {nextProject && (
        <nav aria-label="Next project" className={cn(Wide, "mt-12")}>
          <Link href={`/projects/${nextProject.slug}`} className="group flex items-center justify-between gap-6 rounded-[28px] bg-[#1a2150] p-7 text-white sm:p-10">
            <span>
              <span className="block text-base text-white/70">Next project</span>
              <span className="mt-1 block text-3xl sm:text-4xl font-serif font-bold">{nextProject.name}</span>
            </span>
            <ArrowRight className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
          </Link>
        </nav>
      )}

      {zoomed && (
        <div role="dialog" aria-modal="true" aria-label={zoomed.alt} onClick={() => setZoomed(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <button type="button" aria-label="Close" autoFocus onClick={() => setZoomed(null)} className="absolute right-5 top-5 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"><X className="h-5 w-5" /></button>
          <img src={zoomed.src} alt={zoomed.alt} className="max-h-full max-w-full rounded-2xl object-contain" />
        </div>
      )}
    </article>
  );
}
