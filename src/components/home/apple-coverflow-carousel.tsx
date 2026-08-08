"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Cpu, ShieldCheck, Terminal } from "lucide-react";
import { useProjects } from "@/stores/projects-store";
import { cn } from "@/lib/utils";

// Category Ambient Color Config for Morphing Background
const CATEGORY_COLORS: Record<string, { glow: string; text: string; badge: string }> = {
  ai: {
    glow: "rgba(168, 85, 247, 0.18)",
    text: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30",
  },
  cloud: {
    glow: "rgba(59, 130, 246, 0.18)",
    text: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30",
  },
  payments: {
    glow: "rgba(16, 185, 129, 0.18)",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
  },
  automation: {
    glow: "rgba(249, 115, 22, 0.18)",
    text: "text-orange-400",
    badge: "bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/30",
  },
  web: {
    glow: "rgba(14, 165, 233, 0.18)",
    text: "text-sky-400",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/30",
  },
  saas: {
    glow: "rgba(99, 102, 241, 0.18)",
    text: "text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/30",
  },
};

const DEFAULT_COLOR = {
  glow: "rgba(148, 163, 184, 0.18)",
  text: "text-slate-300",
  badge: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30",
};

export function AppleCoverflowCarousel() {
  const rawProjects = useProjects();
  // Include all projects from store, sorting featured projects to the top
  const displayProjects = [...rawProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.priority || 0) - (b.priority || 0);
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = displayProjects.length || 1;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard Navigation (Left / Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total]);

  // Autoplay every 6 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  // Mouse Wheel Navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 25) {
      if (e.deltaX > 0) handleNext();
      else handlePrev();
    }
  };

  const activeProject = displayProjects[activeIndex];
  const colorStyle = CATEGORY_COLORS[activeProject.category.toLowerCase()] || DEFAULT_COLOR;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onWheel={handleWheel}
      className="relative w-full max-w-[1400px] min-h-[660px] sm:min-h-[720px] mx-auto flex flex-col items-center justify-center select-none overflow-hidden py-4"
    >
      {/* ─────────────────────────────────────────────────────────────
          MORPHING AMBIENT BACKGROUND BACKLIGHT (Smooth 500ms)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[420px] rounded-full blur-[80px] pointer-events-none z-0 transform-gpu will-change-transform"
        animate={{ background: colorStyle.glow }}
        transition={{ duration: 0.5 }}
      />

      {/* ─────────────────────────────────────────────────────────────
          3D COVER-FLOW CAROUSEL CONTAINER (Hardware Accelerated)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[500px] sm:h-[560px] flex items-center justify-center perspective-[1200px] z-10 overflow-visible">
        {displayProjects.map((project, idx) => {
          let offset = idx - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;

          // Hardware Accelerated Transforms (No CSS filters during animation for 60 FPS)
          const translateX = offset * 420;
          const scale = isCenter ? 1 : 0.82;
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.35 : 0;
          const rotateY = offset * -18;
          const zIndex = 30 - Math.abs(offset) * 10;

          return (
            <motion.div
              key={project.id}
              onClick={() => setActiveIndex(idx)}
              animate={{
                x: translateX,
                scale,
                rotateY: `${rotateY}deg`,
                opacity,
                zIndex,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{ transformStyle: "preserve-3d" }}
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[1150px] h-[460px] sm:h-[540px] rounded-[32px] bg-[#0A0C12] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col lg:flex-row cursor-pointer transition-all duration-300 transform-gpu",
                isCenter ? "pointer-events-auto" : "pointer-events-auto hover:opacity-60"
              )}
            >
              {/* ── 70% CINEMATIC PRODUCT VISUAL AREA ── */}
              <div className="relative w-full lg:w-[68%] h-[55%] lg:h-full bg-[#0E1017] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden flex items-center justify-center p-6 group">
                
                {/* Background Specular Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04] pointer-events-none" />

                {/* Visual Variant per Category */}
                {project.category.toLowerCase() === "ai" && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-purple-600 via-rose-600 to-amber-500 opacity-80 blur-xl" />
                    <div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-purple-500 via-rose-500 to-amber-400 shadow-[0_0_80px_rgba(168,85,247,0.6)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <Cpu className="w-10 h-10 text-purple-300" />
                      </div>
                    </div>
                    {/* Audio Bar Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-white/90 font-semibold">02:04 Neural Operations Assistant</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-[10px] font-mono text-purple-300 font-bold">● Active Agent</span>
                    </div>
                  </div>
                )}

                {project.category.toLowerCase() === "cloud" && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-900 to-slate-950 opacity-90" />
                    <div className="w-52 h-52 rounded-3xl bg-gradient-to-br from-blue-600/30 to-indigo-900/40 border border-blue-500/20 rotate-12" />
                    <div className="relative z-10 w-[88%] p-6 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white/60">Cluster Telemetry</span>
                        <span className="text-emerald-400 font-bold">99.98% UPTIME</span>
                      </div>
                      <div className="text-3xl font-bold font-mono text-white tracking-tight">47 Active Nodes</div>
                      <div className="h-16 w-full pt-2">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                          <path d="M 0 30 Q 30 10, 60 25 T 120 15 T 180 5 L 200 2" fill="none" stroke="#3B82F6" strokeWidth="3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {project.category.toLowerCase() === "payments" && (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div className="w-full h-full p-5 rounded-2xl bg-[#090A0F] border border-white/15 flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-xs font-mono text-white/50">criskapay-settlement.enc</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-mono text-white/50 uppercase">Total Settled Volume</span>
                          <h4 className="text-2xl font-bold font-mono text-white">$1,420,890.00</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">● Active Ledger</span>
                      </div>
                    </div>
                  </div>
                )}

                {project.category.toLowerCase() !== "ai" && project.category.toLowerCase() !== "cloud" && project.category.toLowerCase() !== "payments" && (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div className="w-full h-full p-5 rounded-2xl bg-[#0B0C10] border border-white/15 font-mono text-xs text-white/80 flex flex-col justify-between">
                      <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-white/40">
                        <Terminal className="w-4 h-4 text-sky-400" />
                        <span>kiwik-command-hub</span>
                      </div>
                      <div className="space-y-2 my-auto">
                        <p className="text-emerald-400">✓ All pipelines operational</p>
                        <p className="text-sky-300">⚡ Real-time edge latency: 14ms</p>
                        <p className="text-white/60">→ Synchronized with Admin CMS</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Glass Specular Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-white/5 opacity-60 pointer-events-none" />
              </div>

              {/* ── 30% EDITORIAL CONTENT AREA ── */}
              <div className="w-full lg:w-[32%] p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-[#0A0C12]">
                <div className="space-y-3">
                  
                  {/* Status & Category Badge */}
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border", colorStyle.badge)}>
                      ● {project.status.replace("-", " ")}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-white/40">
                      {project.category}
                    </span>
                  </div>

                  {/* Large Editorial Headline */}
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-white tracking-tight leading-tight">
                    {project.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans line-clamp-3">
                    {project.tagline || project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(project.techStack || []).slice(0, 3).map((t) => (
                      <span key={t.name} className="px-2.5 py-1 text-[10px] font-mono font-medium rounded-full bg-white/10 border border-white/10 text-white/80">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dynamic CTA Action Links */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-sans font-bold text-xs hover:bg-white/90 transition-all shadow-md group-hover:scale-105"
                  >
                    <span>Explore Platform</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </motion.div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING NAVIGATION CONTROLS (Light & Dark Mode Support)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 mt-6 z-20">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/15 flex items-center justify-center text-neutral-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all shadow-md cursor-pointer"
          aria-label="Previous project"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Interactive Progress Step Indicators */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/15 text-xs font-mono text-neutral-800 dark:text-white">
          {displayProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                activeIndex === i ? "w-6 bg-neutral-900 dark:bg-white" : "w-2 bg-neutral-400/60 dark:bg-white/30 hover:bg-neutral-600 dark:hover:bg-white/50"
              )}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
          <span className="ml-2 text-[10px] text-neutral-600 dark:text-white/60 font-bold">
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/15 flex items-center justify-center text-neutral-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all shadow-md cursor-pointer"
          aria-label="Next project"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING CORNER SIDE NAVIGATION ARROWS
         ───────────────────────────────────────────────────────────── */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-[40%] sm:top-[45%] -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-xl border border-black/15 dark:border-white/20 flex items-center justify-center text-white hover:bg-black/60 dark:hover:bg-white/20 active:scale-95 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-40 cursor-pointer hidden md:flex group"
        aria-label="Previous project"
      >
        <ArrowLeft className="w-6 h-6 text-white/80 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-[40%] sm:top-[45%] -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-xl border border-black/15 dark:border-white/20 flex items-center justify-center text-white hover:bg-black/60 dark:hover:bg-white/20 active:scale-95 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-40 cursor-pointer hidden md:flex group"
        aria-label="Next project"
      >
        <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </button>
    </div>
  );
}
