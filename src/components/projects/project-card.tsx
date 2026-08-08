"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Project } from "@/types";
import { GlassSpotlightCard } from "@/components/glass/glass-spotlight-card";
import { useFavoritesStore } from "@/stores/favorites-store";
import { cn, relativeTime } from "@/lib/utils";

import { ProjectImage } from "@/components/ui/project-image";

interface ProjectCardProps {
  project: Project;
}

const categoryGradients: Record<string, string> = {
  ai: "from-violet-500/20 to-purple-500/20",
  web: "from-blue-500/20 to-cyan-500/20",
  mobile: "from-emerald-500/20 to-teal-500/20",
  automation: "from-orange-500/20 to-amber-500/20",
  devops: "from-cyan-500/20 to-blue-500/20",
  research: "from-rose-500/20 to-red-500/20",
  saas: "from-blue-500/20 to-indigo-500/20",
  "open-source": "from-emerald-500/20 to-green-500/20",
  blockchain: "from-orange-500/20 to-yellow-500/20",
  ml: "from-violet-500/20 to-fuchsia-500/20",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(project.id);
  const gradient = categoryGradients[project.category] || "from-gray-500/20 to-slate-500/20";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(project.id);
  };

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full outline-none group rounded-2xl">
      <GlassSpotlightCard className="h-full flex flex-col p-0 overflow-hidden border border-glass-border group-hover:border-glass-border-hover transition-all">
        {/* Cover Image & Category Gradient Overlay */}
        <div className={cn("relative h-[180px] w-full bg-gradient-to-br overflow-hidden border-b border-glass-border", gradient)}>
          {/* Architectural Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] opacity-40 pointer-events-none" />
          
          <ProjectImage
            src={project.coverImage}
            alt={project.name}
            category={project.category}
            className="w-full h-full object-cover opacity-60 group-hover:scale-102 group-hover:opacity-85 transition-all duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/10 to-transparent" />

          {/* Status & Version Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-glass-bg backdrop-blur-md border border-glass-border">
              <div
                className={cn("w-2.5 h-2.5 rounded-full", {
                  "bg-emerald-500": project.status === "completed",
                  "bg-amber-500": project.status === "in-progress",
                  "bg-rose-500": project.status === "archived",
                })}
              />
              <span className="text-[11px] font-semibold text-text-primary capitalize">{project.status.replace("-", " ")}</span>
            </div>

            {project.version && (
              <div className="px-2.5 py-1 rounded-full bg-glass-bg backdrop-blur-md border border-glass-border">
                <span className="text-[11px] font-mono font-medium text-text-secondary">{project.version}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-1">
                {project.name}
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-glass-bg border border-glass-border text-text-secondary">
                {project.category}
              </span>
            </div>

            <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
              {project.tagline || project.description}
            </p>
          </div>

          <div>
            {/* Tech Stack Pills.
                Guarded: a project saved from the admin studio, or read mid-write
                from the database, can arrive without techStack. Reading .slice
                off undefined here threw and tripped the page-level error
                boundary — which is what surfaced as "System Diagnostics Notice"
                over the whole projects grid. */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(project.techStack || []).slice(0, 4).map((tech) => (
                <span key={tech.name} className="px-2 py-0.5 text-[10px] font-mono rounded bg-glass-bg border border-glass-border text-text-secondary">
                  {tech.name}
                </span>
              ))}
              {(project.techStack || []).length > 4 && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-glass-bg border border-glass-border text-text-secondary">
                  +{(project.techStack || []).length - 4}
                </span>
              )}
            </div>

            {/* Progress Bar & Favorite Button */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-divider">
              <div className="flex-1">
                <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${project.completionPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-accent-blue rounded-full"
                  />
                </div>
                <div className="mt-1.5 text-[10px] text-text-secondary flex justify-between font-mono">
                  <span>{project.completionPercent}% Complete</span>
                  <span>{relativeTime(project.lastUpdated)}</span>
                </div>
              </div>

              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full hover:bg-glass-bg-hover transition-colors"
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <motion.div animate={favorite ? { scale: [1, 1.2, 1] } : {}}>
                  <Heart className={cn("w-4 h-4 transition-colors", favorite ? "fill-rose-500 text-rose-500" : "text-text-secondary")} />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </GlassSpotlightCard>
    </Link>
  );
}
