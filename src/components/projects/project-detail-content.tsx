"use client";

import React, { useEffect, useState, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ProjectImage } from "@/components/ui/project-image";
import * as LucideIcons from "lucide-react";
import { 
  ExternalLink, 
  Star, 
  GitFork, 
  Eye, 
  CheckCircle, 
  X, 
  ArrowLeft, 
  Code,
  Clock,
  BookOpen,
  Menu,
  ChevronRight,
  Sparkles,
  Layers,
  Calendar,
  Users
} from "lucide-react";
import { useProjects, useProjectsStore } from "@/stores/projects-store";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { useHistoryStore } from "@/stores/history-store";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export function ProjectDetailContent({ projectOverride }: { projectOverride?: Project }) {
  const projects = useProjects();
  const params = useParams();
  const slug = params?.slug as string;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const project = projectOverride || 
    projects.find(p => p.slug === slug || p.id === slug) || 
    (typeof window !== "undefined" ? useProjectsStore.getState().projects.find(p => p.slug === slug || p.id === slug) : undefined);

  const { addToHistory } = useHistoryStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (project && !projectOverride) {
      addToHistory(project.id);
    }
  }, [project, addToHistory, projectOverride]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-4xl font-bold font-serif">Project Not Found</h1>
        <p className="text-text-secondary max-w-md">The project entity matching target key slug could not be resolved from local store memory or Neon cloud database.</p>
        <Link href="/projects" className="px-6 py-2.5 rounded-xl bg-accent-blue text-white font-bold text-sm hover:opacity-90 transition-opacity">
          Return to Projects Hub
        </Link>
      </div>
    );
  }

  const renderIcon = (name?: string, className: string = "w-4 h-4") => {
    if (!name) return null;
    const Component = (LucideIcons as any)[name];
    if (!Component) return null;
    return <Component className={className} />;
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-24 relative select-none">
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div className="h-full bg-accent-blue transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-bg-secondary/80 to-bg-primary">
        {/* The hero previously rendered a flat glow and ignored the project's own
            artwork, which is what made every detail page look generic. The cover
            image now backs the hero, blurred and faded into the page so the
            headline stays legible over any screenshot. */}
        {project.heroBgImage || project.coverImage ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={project.heroBgImage || project.coverImage}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-top scale-110 blur-[2px]"
              style={{ opacity: project.heroBgOpacity ?? 0.32 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-bg-primary/92 to-bg-primary" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_10%,var(--bg-primary)_78%)]" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
          {!projectOverride && (
            <div className="flex items-center justify-between mb-8">
              <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors group px-3 py-1.5 rounded-lg bg-bg-secondary/50 border border-white/10 backdrop-blur-md">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>{project.heroBackButtonLabel || "Back to Projects"}</span>
              </Link>

              <div className="flex items-center gap-2">
                <button onClick={copyShareLink} className="p-2 rounded-lg bg-bg-secondary/50 border border-white/10 text-text-secondary hover:text-text-primary transition-colors backdrop-blur-md" title="Copy Page Link">
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
              {project.heroCategoryBadge || project.category}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 text-text-secondary border border-white/10">
              {project.heroVersionBadge || project.version}
            </span>
            <span className={cn(
              "text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
              project.deploymentStatus === "live" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            )}>
              {project.heroStatusBadge || project.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-text-primary">
                {project.heroTitle || project.name}
              </h1>
              <p className="text-lg sm:text-xl text-accent-blue font-sans font-medium">
                {project.heroSubtitle || project.tagline}
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
                {project.heroDescription || project.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold transition-all shadow-lg shadow-accent-blue/20 flex items-center gap-2">
                    {renderIcon(project.heroCta1Icon, "w-4 h-4")}
                    <span>{project.heroCta1Text || "Launch Live Application"}</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary text-text-primary border border-white/10 text-xs font-bold transition-all flex items-center gap-2">
                    {renderIcon(project.heroCta2Icon, "w-4 h-4")}
                    <span>{project.heroCta2Text || "View Source Repository"}</span>
                  </a>
                )}
              </div>

              {/* Lead with the product itself, in a browser chrome frame, rather
                  than dropping straight from a headline into body copy. */}
              {project.coverImage && (
                <div className="pt-8">
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0B0C10] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                      <span className="flex-1 text-center text-[10px] font-mono text-white/40 truncate px-3">
                        {project.liveUrl
                          ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
                          : project.slug}
                      </span>
                    </div>
                    <img
                      src={project.coverImage}
                      alt={`${project.name} interface`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto aspect-[16/10] object-cover object-top"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                {project.logo ? (
                  <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-lg">
                    {(project.name || "?").charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-text-primary">{project.name}</h3>
                  <span className="text-xs text-text-secondary font-mono">{project.owner || "Kiwik Core Team"}</span>
                </div>
              </div>

              {/* Only real figures. Stars/forks/views used to fall back to 142,
                  28 and 4820 — invented numbers shown even for a project with no
                  repository at all. A metric with no value is now simply absent. */}
              <div className="grid grid-cols-2 gap-4 py-2">
                {typeof project.stars === "number" && (
                  <div>
                    <span className="text-[10px] font-mono text-text-secondary uppercase block">Stars</span>
                    <span className="text-sm font-bold font-mono text-text-primary flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {project.stars}
                    </span>
                  </div>
                )}
                {typeof project.forks === "number" && (
                  <div>
                    <span className="text-[10px] font-mono text-text-secondary uppercase block">Forks</span>
                    <span className="text-sm font-bold font-mono text-text-primary flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-accent-blue" /> {project.forks}
                    </span>
                  </div>
                )}
                {typeof project.completionPercent === "number" && (
                  <div>
                    <span className="text-[10px] font-mono text-text-secondary uppercase block">Completion</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">{project.completionPercent}%</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Status</span>
                  <span className="text-sm font-bold font-mono text-cyan-400 capitalize">
                    {(project.status || "—").replace("-", " ")}
                  </span>
                </div>
              </div>

              {project.quickActions && project.quickActions.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-text-secondary uppercase block">Quick Actions</span>
                  <div className="flex flex-wrap gap-2">
                    {project.quickActions.filter(a => a.visible !== false).map(act => (
                      <a key={act.label} href={act.externalUrl || act.route || "#"} target={act.newTab ? "_blank" : "_self"} rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-bg-tertiary hover:bg-white/10 text-xs font-medium text-text-primary border border-white/10 flex items-center gap-1.5 transition-colors">
                        {renderIcon(act.icon, "w-3 h-3 text-accent-blue")}
                        <span>{act.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: <BookOpen className="w-4 h-4" /> },
            { id: "features", label: `Features (${project.features?.length || 0})`, icon: <Sparkles className="w-4 h-4" /> },
            { id: "tech", label: `Tech Stack (${project.techStack?.length || 0})`, icon: <Code className="w-4 h-4" /> },
            { id: "gallery", label: `Gallery (${project.images?.length || 0})`, icon: <Layers className="w-4 h-4" /> },
            { id: "timeline", label: `Timeline (${project.timeline?.length || 0})`, icon: <Clock className="w-4 h-4" /> },
            { id: "contributors", label: `Team (${project.contributors?.length || 0})`, icon: <Users className="w-4 h-4" /> },
            { id: "readme", label: "Documentation", icon: <Code className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border",
                activeTab === tab.id
                  ? "bg-accent-blue text-white border-accent-blue shadow-lg shadow-accent-blue/20"
                  : "bg-bg-secondary text-text-secondary border-white/5 hover:text-text-primary hover:bg-bg-tertiary"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-bg-secondary/60 border border-white/10 backdrop-blur-xl space-y-4">
                <h3 className="text-2xl font-bold font-serif text-text-primary">
                  {project.overviewHeading || "System Specification Overview"}
                </h3>
                <p className="text-text-secondary leading-relaxed font-sans text-base">
                  {project.overviewParagraph || project.longDescription || project.description}
                </p>

                {project.overviewHighlights && project.overviewHighlights.length > 0 && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.overviewHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-bg-tertiary/50 border border-white/5">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-medium text-text-primary">{hl}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {project.overviewImage && (
                <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/40 max-h-[450px]">
                  <img src={project.overviewImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {activeTab === "features" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(project.features || []).map((feat, idx) => (
                <GlassCard key={idx} className="p-6 space-y-3">
                  <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 w-fit text-accent-blue">
                    {renderIcon(feat.icon, "w-5 h-5")}
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">{feat.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{feat.description}</p>
                </GlassCard>
              ))}
            </div>
          )}

          {activeTab === "tech" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(project.techStack || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-bg-secondary border border-white/10 flex flex-col items-center justify-center text-center space-y-2 group hover:border-accent-blue/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                    {renderIcon(item.icon || "Code", "w-5 h-5")}
                  </div>
                  <span className="text-xs font-bold text-text-primary">{item.name}</span>
                  <span className="text-[9px] font-mono text-text-secondary uppercase">{item.category}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(project.images || []).map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 group cursor-pointer relative" onClick={() => setLightboxImage(img.src)}>
                  <img src={img.src} alt={img.alt} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">Expand Preview</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {(project.timeline || []).map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-bg-secondary border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent-blue">{item.date}</span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-text-secondary border border-white/10">{item.status}</span>
                  </div>
                  <h4 className="text-base font-bold text-text-primary">{item.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "contributors" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(project.contributors || []).map((usr, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-bg-secondary border border-white/10 flex items-center gap-4">
                  <img src={usr.avatar || "/logo.png"} alt={usr.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{usr.name}</h4>
                    <span className="text-xs text-accent-blue font-medium block">{usr.role}</span>
                    {usr.contributionPercent && (
                      <span className="text-[10px] font-mono text-text-secondary block mt-0.5">{usr.contributionPercent}% contribution</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "readme" && (
            <div className="p-8 rounded-3xl bg-bg-secondary/60 border border-white/10 backdrop-blur-xl prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {project.readme || project.architecture || "# Documentation\n\nNo detailed Markdown documentation provided for this project entity yet."}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            NEXT & PREVIOUS PROJECT FOOTER NAVIGATION
           ───────────────────────────────────────────────────────────── */}
        {!projectOverride && (
          <div className="mt-16 pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
            {(() => {
              const currIdx = projects.findIndex(p => p.id === project.id || p.slug === project.slug);
              const prevP = projects[(currIdx - 1 + projects.length) % projects.length];
              const nextP = projects[(currIdx + 1) % projects.length];
              return (
                <>
                  <Link
                    href={`/projects/${prevP.slug}`}
                    className="w-full sm:w-auto flex items-center gap-3 p-4 rounded-2xl bg-glass-bg border border-glass-border hover:border-accent-blue/40 transition-all group cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 text-accent-blue group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Previous Project</span>
                      <span className="text-sm font-bold text-text-primary tracking-tight">{prevP.name}</span>
                    </div>
                  </Link>

                  <Link
                    href={`/projects/${nextP.slug}`}
                    className="w-full sm:w-auto flex items-center justify-end gap-3 p-4 rounded-2xl bg-glass-bg border border-glass-border hover:border-accent-blue/40 transition-all group cursor-pointer text-right"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Next Project</span>
                      <span className="text-sm font-bold text-text-primary tracking-tight">{nextP.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-accent-blue group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <button className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" onClick={() => setLightboxImage(null)}>
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImage} alt="Fullscreen view" className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl border border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
