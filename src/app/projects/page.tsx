"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { PageIntro, primaryButton, textLink } from "@/components/layout/page-intro";
import { CASE_NOTES, hostOf, projectState, realText } from "@/data/case-notes";
import { FEATURED_COPY } from "@/data/home-content";
import { optimizedImage } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMS } from "@/stores/site-cms-store";
import type { Project } from "@/types";

/** Below this, a search box is more to read than the list itself. */
const SEARCH_FROM = 9;

export default function ProjectsPage() {
  const projects = useProjects();
  const cms = useSiteCMS();
  const [search, setSearch] = useState("");

  // Projects are authored in the studio and stored as free-form JSON, so every
  // field is treated as optional.
  const all = useMemo(
    () =>
      (Array.isArray(projects) ? projects.filter(Boolean) : [])
        .filter((p) => (p as { visible?: boolean }).visible !== false)
        .sort((a, b) => Number(b.status === "completed") - Number(a.status === "completed")),
    [projects]
  );
  const q = search.trim().toLowerCase();
  const shown = q ? all.filter((p) => `${p.name || ""} ${p.tagline || ""}`.toLowerCase().includes(q)) : all;
  const live = all.filter((p) => projectState(p) === "Live").length;
  const copy = cms.projectsPage || FEATURED_COPY;

  return (
    <div className="pb-16">
      <PageIntro
        title={copy.title || FEATURED_COPY.title}
        lead={copy.description || FEATURED_COPY.description}
        points={live > 0 ? [`${live} live, with links to visit`, `${all.length - live} in progress`].filter((t) => !t.startsWith("0 ")) : undefined}
      />

      {all.length >= SEARCH_FROM && (
        <div className="relative mx-auto mb-10 max-w-[1400px] px-4 sm:px-6 md:px-8">
          <Search className="absolute left-9 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary md:left-12" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search projects by name"
            placeholder="Search projects by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-full border border-text-primary/15 bg-transparent py-3 pl-11 pr-5 text-base text-text-primary placeholder:text-text-secondary focus:border-[#008080] focus:outline-none"
          />
        </div>
      )}

      {shown.length === 0 ? (
        <p className="mx-auto max-w-[1400px] px-4 py-16 text-lg text-text-secondary sm:px-6 md:px-8">
          {q ? "No project has that name." : "Our projects will appear here soon."}
        </p>
      ) : (
        <ul className="mx-auto max-w-[1400px] space-y-20 px-4 sm:px-6 md:space-y-28 md:px-8">
          {shown.map((p, i) => <ProjectRow key={p.id || p.slug} project={p} flip={i % 2 === 1} first={i === 0} />)}
        </ul>
      )}
    </div>
  );
}

function ProjectRow({ project, flip, first }: { project: Project; flip: boolean; first: boolean }) {
  const note = CASE_NOTES[project.slug];
  const state = projectState(project);
  const href = `/projects/${project.slug}`;
  return (
    <li className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <Link href={href} tabIndex={-1} aria-hidden="true" className={cn("group block overflow-hidden rounded-[28px] border border-text-primary/10 bg-bg-secondary lg:col-span-7", flip && "lg:order-2")}>
        {project.coverImage ? (
          <img
            src={optimizedImage(project.coverImage, 1200)}
            onError={(e) => {
              if (e.currentTarget.getAttribute("src") !== project.coverImage) e.currentTarget.src = project.coverImage;
            }}
            alt=""
            loading={first ? "eager" : "lazy"}
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
          />
        ) : (
          <span className="flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,#232b62,#033a35)] p-8 text-center text-4xl font-serif font-bold text-white">{project.name}</span>
        )}
      </Link>
      <div className="lg:col-span-5">
        <p className={cn("text-base font-semibold", state === "Live" ? "text-[#007a78] dark:text-[#4fc3bd]" : "text-text-secondary")}>{state}</p>
        <h2 className="mt-1 text-4xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary">{project.name}</h2>
        {note ? (
          <dl className="mt-6 space-y-5">
            <Fact term="Who it is for">{note.who}</Fact>
            <Fact term="The problem">{note.problem}</Fact>
            <Fact term="What we built">{note.built}</Fact>
          </dl>
        ) : (
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">{realText(project.description) || project.tagline}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={href} className={primaryButton}>
            See {project.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {project.liveUrl && state === "Live" && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={cn(textLink, "inline-flex items-center gap-1")}>
              Visit {hostOf(project.liveUrl)} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-bold text-text-primary">{term}</dt>
      <dd className="mt-1 text-base sm:text-lg leading-relaxed text-text-secondary text-pretty">{children}</dd>
    </div>
  );
}
