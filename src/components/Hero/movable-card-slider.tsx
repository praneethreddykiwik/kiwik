"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { useProjects } from "@/stores/projects-store";
import { useSiteCMS } from "@/stores/site-cms-store";
import { MovableSliderCard } from "@/types/site-cms-types";

export function MovableCardSlider() {
  const cms = useSiteCMS();
  const projects = useProjects();
  // Kiwik's own projects, unless the studio has its own cards.
  const displayCards: MovableSliderCard[] = cms.projectsPage?.sliderCards?.length
    ? cms.projectsPage.sliderCards
    : projects.filter((p) => p.coverImage).map((p) => ({
        id: p.slug,
        name: p.name,
        tag: p.tagline || "",
        image: p.coverImage as string,
        domain: p.liveUrl ? p.liveUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "") : `kiwik.one/projects/${p.slug}`,
        gradient: "",
      }));

  const [activeIndex, setActiveIndex] = useState(1);
  const [dragStartX, setDragStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Keyboard Left/Right Arrow Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayCards.length]);

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, displayCards.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 20) {
      if (e.deltaX > 0) handleNext();
      else handlePrev();
    } else if (Math.abs(e.deltaY) > 40 && Math.abs(e.deltaX) < 10) {
      // Optional trackpad wheel swipe fallback
    }
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const targetIdx = Math.round(clickRatio * (displayCards.length - 1));
    setActiveIndex(targetIdx);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -40) handleNext();
    else if (info.offset.x > 40) handlePrev();
  };

  const progressPercent = displayCards.length > 1 ? ((activeIndex) / (displayCards.length - 1)) * 100 : 100;

  return (
    <div 
      onWheel={handleWheel}
      className="relative w-full max-w-[1450px] mx-auto py-4 sm:py-10 flex flex-col items-center justify-center select-none overflow-hidden transform-gpu"
    >
      {/* Morphing ambient glow behind active card */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full blur-[90px] pointer-events-none z-0 opacity-40 transform-gpu"
        animate={{
          background: activeIndex % 3 === 0 
            ? "rgba(59, 130, 246, 0.25)" 
            : activeIndex % 3 === 1 
              ? "rgba(168, 85, 247, 0.25)" 
              : "rgba(16, 185, 129, 0.25)"
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* ─────────────────────────────────────────────────────────────
          MOVABLE 3D CARDS PERSPECTIVE STREAM
         ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[290px] sm:h-[380px] flex items-center justify-center transform-gpu overflow-visible z-10">
        
        {/* Floating Side Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-black/60 dark:hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all z-40 cursor-pointer shadow-lg group"
          aria-label="Previous card"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing transform-gpu overflow-visible"
        >
        {displayCards.map((model, idx) => {
          const offset = idx - activeIndex;
          const absOffset = Math.abs(offset);

          // 3D Perspective Calculations (Responsive for Mobile, Tablet, & Desktop)
          const spacing = isMobile ? 135 : 220;
          const translateX = offset * spacing;
          const scale = 1 - absOffset * (isMobile ? 0.08 : 0.1);
          const rotateY = offset * (isMobile ? -8 : -14);
          const opacity = absOffset > 3 ? 0 : 1 - absOffset * 0.2;
          const zIndex = 30 - absOffset * 5;

          return (
            <motion.div
              key={model.id}
              onClick={() => setActiveIndex(idx)}
              animate={{
                x: translateX,
                scale,
                rotateY: `${rotateY}deg`,
                opacity,
                zIndex,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[285px] h-[270px] sm:h-[325px] rounded-2xl bg-[#12131A] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden group cursor-pointer transform-gpu will-change-transform"
            >
              {/* Top Window Header (Single Red Dot 🔴 on Left) */}
              <div className="px-3.5 py-2.5 bg-[#181924] border-b border-white/10 flex items-center justify-between">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                <span className="text-[9px] font-mono text-white/30 tracking-wider">
                  {model.domain || ""}
                </span>
                <div className="w-2" />
              </div>

              {/* Window Body with Image & Bold Brand Overlay */}
              <div className="relative w-full h-[calc(100%-35px)] overflow-hidden bg-[#0A0A0B]">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  loading="eager"
                />

                {/* Dark Gradient Overlay */}
                <div className={cn("absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent")} />

                {/* Name */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white drop-shadow-md group-hover:scale-105 transition-transform">
                    {model.name}
                  </h3>
                  <span className="text-[10px] font-mono font-medium text-white/70 mt-1 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 max-w-full line-clamp-2">
                    {model.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

        {/* Floating Side Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={activeIndex === displayCards.length - 1}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-black/60 dark:hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all z-40 cursor-pointer shadow-lg group"
          aria-label="Next card"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM INTERACTIVE SLIDER CONTROLS (← Track Indicator →)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 mt-4 z-20">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-2 rounded-full text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer"
          aria-label="Previous card"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Progress Slider Track */}
        <div
          onClick={handleSliderClick}
          className="w-44 sm:w-56 h-1.5 bg-white/15 rounded-full overflow-hidden cursor-pointer relative group"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={activeIndex === displayCards.length - 1}
          className="p-2 rounded-full text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer"
          aria-label="Next card"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
