"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, Clock, Filter, Search, Sparkles } from "lucide-react";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMS } from "@/stores/site-cms-store";
import { PremiumShowcaseCard } from "@/components/projects/premium-showcase-card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectStatus, ProjectCategory, SortMode } from "@/types";
import { cn } from "@/lib/utils";
import { MovableCardSlider } from "@/components/Hero/movable-card-slider";

type LayoutMode = "grid" | "rows" | "timeline";

export default function ProjectsPage() {
  const projects = useProjects();
  const cms = useSiteCMS();
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  
  // Every field below is treated as optional. Projects are authored in the admin
  // studio and stored as free-form JSON, so a row can legitimately arrive
  // without a tagline, category or date — and calling .toLowerCase() on one of
  // those threw during render, which the page error boundary turned into a
  // full-page "System Diagnostics Notice" instead of one imperfect card.
  const safeProjects = useMemo(
    () => (Array.isArray(projects) ? projects.filter(Boolean) : []),
    [projects]
  );

  const categories = useMemo(() => {
    const cats = new Set<string>();
    safeProjects.forEach(p => { if (p.category) cats.add(p.category); });
    return ["all", ...Array.from(cats)] as (ProjectCategory | "all")[];
  }, [safeProjects]);

  const filteredAndSorted = useMemo(() => {
    const q = search.toLowerCase();
    let result = safeProjects.filter(p => {
      const haystack = `${p.name || ""} ${p.tagline || ""}`.toLowerCase();
      const matchSearch = haystack.includes(q);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });

    const time = (v?: string) => {
      const t = v ? new Date(v).getTime() : 0;
      return Number.isFinite(t) ? t : 0;
    };

    result.sort((a, b) => {
      switch (sortMode) {
        case "newest": return time(b.createdAt) - time(a.createdAt);
        case "oldest": return time(a.createdAt) - time(b.createdAt);
        case "recently-updated": return time(b.lastUpdated) - time(a.lastUpdated);
        case "alphabetical": return (a.name || "").localeCompare(b.name || "");
        case "most-viewed": return (b.views || 0) - (a.views || 0);
        case "popularity": return (b.stars || 0) - (a.stars || 0);
        default: return 0;
      }
    });

    return result;
  }, [safeProjects, search, statusFilter, categoryFilter, sortMode]);

  const projectsPageCMS = cms.projectsPage || {
    badgeText: "FEATURED PRODUCTS",
    title: "Next-Generation Enterprise Stack",
    description: "Explore world-class autonomous systems, managed cloud platforms, payment engines, and developer infrastructure powered by Kiwik."
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          FEATURED PRODUCTS SHOWCASE HEADER
         ───────────────────────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-6 space-y-3"
      >
        <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#52525B] dark:text-[#A1A1AA]">
          {projectsPageCMS.badgeText || "FEATURED PRODUCTS"}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold tracking-tight text-[#18181B] dark:text-white leading-[1.05]">
          {projectsPageCMS.title || "Next-Generation Enterprise Stack"}
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] font-sans font-medium max-w-xl mx-auto">
          {projectsPageCMS.description || "Explore world-class autonomous systems, managed cloud platforms, payment engines, and developer infrastructure powered by Kiwik."}
        </p>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          MOVABLE 3D MODEL STREAM CAROUSEL SLIDER
         ───────────────────────────────────────────────────────────── */}
      <div className="mb-12 rounded-3xl bg-[#0A0A0B] p-4 sm:p-6 border border-white/10 shadow-2xl">
        <MovableCardSlider />
      </div>
      
      {/* ─────────────────────────────────────────────────────────────
          FLOATING CONTROLS & SEARCH BAR
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
          <input 
            type="text" 
            placeholder="Search products by name or capability..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-[#18181B] dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 shadow-sm transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-1 shrink-0 shadow-sm">
            <button onClick={() => setLayout("grid")} className={cn("p-2 rounded-xl transition-colors", layout === "grid" ? "bg-black/10 dark:bg-white/15 text-[#18181B] dark:text-white" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white")} aria-label="Grid layout"><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setLayout("rows")} className={cn("p-2 rounded-xl transition-colors", layout === "rows" ? "bg-black/10 dark:bg-white/15 text-[#18181B] dark:text-white" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white")} aria-label="Rows layout"><List className="w-4 h-4" /></button>
            <button onClick={() => setLayout("timeline")} className={cn("p-2 rounded-xl transition-colors", layout === "timeline" ? "bg-black/10 dark:bg-white/15 text-[#18181B] dark:text-white" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white")} aria-label="Timeline layout"><Clock className="w-4 h-4" /></button>
          </div>
          
          <select 
            value={sortMode} 
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-2 text-xs font-mono font-semibold text-[#18181B] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shrink-0 shadow-sm"
          >
            <option value="newest" className="bg-[#18181B] text-white">Newest Release</option>
            <option value="oldest" className="bg-[#18181B] text-white">Oldest Release</option>
            <option value="recently-updated" className="bg-[#18181B] text-white">Recently Updated</option>
            <option value="alphabetical" className="bg-[#18181B] text-white">Alphabetical</option>
            <option value="most-viewed" className="bg-[#18181B] text-white">Most Viewed</option>
            <option value="popularity" className="bg-[#18181B] text-white">Popularity</option>
          </select>
        </div>
      </div>
      
      {/* ─────────────────────────────────────────────────────────────
          FLOATING CATEGORY & STATUS FILTER PILLS
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/50 dark:text-white/50 whitespace-nowrap">Status:</span>
          <div className="flex gap-2">
            {(["all", "completed", "in-progress", "archived"] as const).map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                  statusFilter === status 
                    ? "bg-[#18181B] text-white dark:bg-white dark:text-black border-transparent shadow-md" 
                    : "bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-white dark:hover:bg-white/10"
                )}
              >
                {status.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/50 dark:text-white/50 whitespace-nowrap">Category:</span>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border capitalize",
                  categoryFilter === cat 
                    ? "bg-[#18181B] text-white dark:bg-white dark:text-black border-transparent shadow-md" 
                    : "bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-white dark:hover:bg-white/10"
                )}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* ─────────────────────────────────────────────────────────────
          2-COLUMN LARGE PREMIUM PRODUCT SHOWCASE GRID
         ───────────────────────────────────────────────────────────── */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-24 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl">
          <Filter className="w-12 h-12 text-black/30 dark:text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold mb-2 text-[#18181B] dark:text-white">No products found</h3>
          <p className="text-xs sm:text-sm text-black/50 dark:text-white/50">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <motion.div 
          layout
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-8 sm:gap-10",
            layout === "grid" ? "grid-cols-1 lg:grid-cols-2" : "",
            layout === "rows" ? "grid-cols-1" : "",
            layout === "timeline" ? "grid-cols-1 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 dark:before:via-white/10 before:to-transparent" : ""
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSorted.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "h-full",
                  layout === "rows" ? "w-full" : "",
                  layout === "timeline" ? cn(
                    "relative md:w-[calc(50%-2rem)]", 
                    index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                  ) : ""
                )}
              >
                <div className="h-full">
                  {layout === "grid" ? (
                    <PremiumShowcaseCard project={project} />
                  ) : (
                    <ProjectCard project={project} />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
