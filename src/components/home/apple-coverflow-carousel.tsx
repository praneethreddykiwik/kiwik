"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useProjects } from "@/stores/projects-store";
import { CASE_NOTES, projectState, realText } from "@/data/case-notes";
import { cn } from "@/lib/utils";

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

  // The list is empty on first paint, before the store hydrates.
  if (displayProjects.length === 0) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onWheel={handleWheel}
      className="relative w-full max-w-[1400px] min-h-[620px] mx-auto flex flex-col items-center justify-center select-none overflow-hidden py-4"
    >
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
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[1150px] h-auto min-h-[460px] lg:h-[540px] rounded-[32px] bg-[#0a0a0b] shadow-[0_30px_70px_-20px_rgba(16,20,46,0.55)] overflow-hidden flex flex-col lg:flex-row cursor-pointer transition-all duration-300 transform-gpu",
                isCenter ? "pointer-events-auto" : "pointer-events-auto hover:opacity-60"
              )}
            >
              {/* ── 70% CINEMATIC PRODUCT VISUAL AREA ── */}
              <div className="relative w-full lg:w-[62%] h-[240px] sm:h-[300px] lg:h-full bg-[#0E1017] overflow-hidden flex items-center justify-center p-6 group">
                
                {/* Background Specular Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04] pointer-events-none" />

                {/* A project's own screenshot is the best visual it has, so it
                    wins whenever one is set. The category mock-ups below are the
                    fallback for entries that have no cover art yet. */}
                {project.coverImage && (
                  <div className="absolute inset-0">
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    
                  </div>
                )}

                {/* No cover art yet: the project's own name, never an invented screen. */}
                {!project.coverImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#232b62] to-[#033a35] p-8">
                    <span className="text-4xl sm:text-6xl font-serif font-bold text-white text-center text-balance">{project.name}</span>
                  </div>
                )}

              </div>

              {/* The problem, and what was built for it */}
              <div className="flex w-full flex-col justify-between gap-6 bg-[#0a0a0b] p-6 text-white sm:p-8 lg:w-[38%]">
                <div>
                  <p className="text-sm font-semibold text-[#8fe3dd]">{projectState(project)}</p>
                  <h3 className="mt-1 text-3xl sm:text-4xl font-serif font-bold tracking-tight">{project.name}</h3>
                  {CASE_NOTES[project.slug] ? (
                    <dl className="mt-5 space-y-4">
                      <div>
                        <dt className="text-sm font-bold">The problem</dt>
                        <dd className="mt-0.5 text-base leading-relaxed text-white/80">{CASE_NOTES[project.slug].problem}</dd>
                      </div>
                      <div className="max-sm:hidden">
                        <dt className="text-sm font-bold">What we built</dt>
                        <dd className="mt-0.5 text-base leading-relaxed text-white/80">{CASE_NOTES[project.slug].built}</dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-4 text-base leading-relaxed text-white/80 line-clamp-5">{project.tagline || realText(project.description)}</p>
                  )}
                </div>
                <Link
                  href={`/projects/${project.slug}`}
                  tabIndex={isCenter ? undefined : -1}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-[#10142e] transition-transform duration-200 hover:scale-[1.03]"
                >
                  See {project.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
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
    </div>
  );
}
