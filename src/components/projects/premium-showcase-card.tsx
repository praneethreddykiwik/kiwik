"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Cpu, Cloud, Layers, CreditCard, Shield, Activity, Terminal } from "lucide-react";
import { Project } from "@/types";
import { ProjectImage } from "@/components/ui/project-image";
import { useFavoritesStore } from "@/stores/favorites-store";
import { cn } from "@/lib/utils";

interface PremiumShowcaseCardProps {
  project: Project;
}

// Tailored Light & Dark Mode Gradients per category
const CATEGORY_STYLES: Record<string, { lightGradient: string; darkGradient: string; glow: string; accentText: string; pulseColor: string }> = {
  ai: {
    lightGradient: "from-[#F5F0FF] via-[#EFE6FF] to-[#E9E0FF]",
    darkGradient: "from-[#1E122A]/90 via-[#160D20]/90 to-[#100818]/90",
    glow: "rgba(168,85,247,0.15)",
    accentText: "text-purple-600 dark:text-purple-400",
    pulseColor: "bg-purple-500",
  },
  cloud: {
    lightGradient: "from-[#EEF5FF] via-[#E4F0FF] to-[#DCEBFF]",
    darkGradient: "from-[#101E36]/90 via-[#0C1628]/90 to-[#080E1A]/90",
    glow: "rgba(59,130,246,0.15)",
    accentText: "text-blue-600 dark:text-blue-400",
    pulseColor: "bg-blue-500",
  },
  payments: {
    lightGradient: "from-[#F7F2FF] via-[#F0E8FF] to-[#EDE8FF]",
    darkGradient: "from-[#1A122E]/90 via-[#120B22]/90 to-[#0B0616]/90",
    glow: "rgba(139,92,246,0.15)",
    accentText: "text-indigo-600 dark:text-indigo-400",
    pulseColor: "bg-indigo-500",
  },
  automation: {
    lightGradient: "from-[#EEF9F3] via-[#E2F5EA] to-[#D8F5E8]",
    darkGradient: "from-[#0F261B]/90 via-[#0A1A12]/90 to-[#05100B]/90",
    glow: "rgba(16,185,129,0.15)",
    accentText: "text-emerald-600 dark:text-emerald-400",
    pulseColor: "bg-emerald-500",
  },
  research: {
    lightGradient: "from-[#FFF7ED] via-[#FFEDD5] to-[#FFEBD6]",
    darkGradient: "from-[#2A180C]/90 via-[#1C1008]/90 to-[#120A05]/90",
    glow: "rgba(249,115,22,0.15)",
    accentText: "text-orange-600 dark:text-orange-400",
    pulseColor: "bg-orange-500",
  },
  web: {
    lightGradient: "from-[#EEF6FF] via-[#E0F0FF] to-[#D8EAFF]",
    darkGradient: "from-[#0D1D30]/90 via-[#081220]/90 to-[#040A14]/90",
    glow: "rgba(14,165,233,0.15)",
    accentText: "text-sky-600 dark:text-sky-400",
    pulseColor: "bg-sky-500",
  },
  saas: {
    lightGradient: "from-[#F0F4FF] via-[#E4ECFF] to-[#DCE6FF]",
    darkGradient: "from-[#121B33]/90 via-[#0B1122]/90 to-[#060914]/90",
    glow: "rgba(99,102,241,0.15)",
    accentText: "text-indigo-600 dark:text-indigo-400",
    pulseColor: "bg-indigo-500",
  }
};

const DEFAULT_STYLE = {
  lightGradient: "from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]",
  darkGradient: "from-[#1E293B]/90 via-[#0F172A]/90 to-[#020617]/90",
  glow: "rgba(148,163,184,0.15)",
  accentText: "text-slate-600 dark:text-slate-400",
  pulseColor: "bg-emerald-500",
};

export function PremiumShowcaseCard({ project }: PremiumShowcaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(project.id);

  // 3D Spring Tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const categoryKey = project.category.toLowerCase();
  const style = CATEGORY_STYLES[categoryKey] || DEFAULT_STYLE;

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "ai": return <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case "cloud": return <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "payments": return <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case "automation": return <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "research": return <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      default: return <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(project.id);
  };

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full group outline-none select-none">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full min-h-[480px] sm:min-h-[520px] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-black/10 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.4)] transition-all duration-500 transform-gpu"
      >
        {/* Soft Category Light & Dark Background Gradient */}
        <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-700 opacity-95 group-hover:opacity-100", style.lightGradient, "dark:" + style.darkGradient)} />

        {/* Ambient Glow Aura */}
        <div
          className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl"
          style={{ background: style.glow }}
        />

        {/* ─────────────────────────────────────────────────────────────
            TOP CARD HEADER (Icon + Name + Description + Status Badge)
           ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            
            {/* Top Left: Icon & Project Name */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md flex items-center justify-center shadow-md border border-white/40 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                {getCategoryIcon(project.category)}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#18181B] dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <span className="text-[11px] font-mono uppercase tracking-wider text-black/50 dark:text-white/50">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Top Right: Status Badge with Animated Pulse */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", style.pulseColor)} />
                  <span className={cn("relative inline-flex rounded-full h-2 w-2", style.pulseColor)} />
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#18181B] dark:text-white/90">
                  {project.status.replace("-", " ")}
                </span>
              </div>

              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
                aria-label={favorite ? "Remove favorite" : "Add favorite"}
              >
                <Heart className={cn("w-4 h-4 transition-colors", favorite ? "fill-rose-500 text-rose-500" : "text-black/40 dark:text-white/40")} />
              </button>
            </div>

          </div>

          <p className="text-xs sm:text-sm text-[#52525B] dark:text-white/70 leading-relaxed font-sans line-clamp-2 max-w-xl">
            {project.tagline || project.description}
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CENTER HERO SCREENSHOT MOCKUP FRAME
           ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 my-4 sm:my-6 transform-gpu">
          <div className="relative rounded-2xl overflow-hidden bg-[#0F1015] border border-black/20 dark:border-white/15 shadow-2xl group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:rotate-[0.3deg] transition-all duration-500">
            
            {/* macOS Browser Header Frame (● ● ●) */}
            <div className="px-4 py-2.5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-white/40 tracking-wider">
                {project.slug}.criska.io
              </span>
              <div className="w-8" />
            </div>

            {/* Browser Content Screenshot View */}
            <div className="relative h-[180px] sm:h-[210px] w-full overflow-hidden bg-[#0A0B10]">
              <ProjectImage
                src={project.coverImage}
                alt={project.name}
                category={project.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Specular Edge Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-white/5 opacity-70" />
            </div>

          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            BOTTOM CARD FOOTER (Tech Stack Pills + CTA Link)
           ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 pt-2 flex items-center justify-between gap-4 border-t border-black/10 dark:border-white/10">
          
          {/* Bottom Left: Tech Stack Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(project.techStack || []).slice(0, 4).map((tech) => (
              <span
                key={tech.name}
                className="px-2.5 py-1 text-[10px] font-mono font-medium rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-[#18181B] dark:text-white/80"
              >
                {tech.name}
              </span>
            ))}
            {(project.techStack || []).length > 4 && (
              <span className="px-2 py-1 text-[10px] font-mono font-medium rounded-full bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60">
                +{(project.techStack || []).length - 4}
              </span>
            )}
          </div>

          {/* Bottom Right: CTA Link with Sliding Arrow */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>

        </div>
      </motion.div>
    </Link>
  );
}
