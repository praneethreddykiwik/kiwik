"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Centerpiece } from "@/components/home/centerpiece";

// ─────────────────────────────────────────────────────────────
// 1. COUNT-UP ANIMATED NUMBER COMPONENT
// ─────────────────────────────────────────────────────────────
interface CountUpProps {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

function CountUpNumber({ end, suffix = "", decimals = 0, duration = 2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // EaseOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = easeProgress * end;

      setDisplayValue(currentValue.toFixed(decimals));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, decimals, duration]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. MAGNETIC GLASS BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────
interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

function MagneticGlassButton({ children, onClick, href, variant = "primary", className }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 14, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.25;
    const distanceY = (e.clientY - centerY) * 0.25;
    x.set(Math.max(-10, Math.min(10, distanceX)));
    y.set(Math.max(-10, Math.min(10, distanceY)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative group cursor-pointer inline-flex items-center justify-center rounded-full p-[1px] overflow-hidden transition-all duration-300 select-none",
        className
      )}
    >
      {/* Animated Gradient Border Overlay */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
      
      {/* Inner Button Glow & Reflection */}
      <span className={cn(
        "relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-xl backdrop-blur-2xl",
        variant === "primary"
          ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border border-neutral-800 dark:border-white/30 group-hover:shadow-indigo-500/20"
          : "bg-glass-bg border border-glass-border text-text-primary hover:bg-glass-bg-hover group-hover:border-glass-border-hover"
      )}>
        {/* Reflection Highlight line */}
        <span className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:via-white/80 transition-all duration-500" />
        {children}
      </span>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
}

import { useSiteCMS } from "@/stores/site-cms-store";

// ─────────────────────────────────────────────────────────────
// 3. MAIN ANIMATED HERO COMPONENT
// ─────────────────────────────────────────────────────────────
export interface AnimatedHeroProps {
  onWatchOverview?: () => void;
  className?: string;
}

export function AnimatedHero({ onWatchOverview, className }: AnimatedHeroProps) {
  const cms = useSiteCMS();
  const heroCMS = cms.hero;
  const rotatingWords = heroCMS.rotatingWords && heroCMS.rotatingWords.length > 0
    ? heroCMS.rotatingWords
    : ["Digital Products.", "AI Platforms.", "Enterprise Apps.", "Automation.", "Research.", "Innovation."];

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, (heroCMS.animationSpeedSeconds || 2.5) * 1000);
    return () => clearInterval(timer);
  }, [rotatingWords.length, heroCMS.animationSpeedSeconds]);

  return (
    <section
      className={cn(
        "relative min-h-[85svh] flex items-center pt-28 pb-12 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto overflow-visible select-none",
        className
      )}
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT PANEL: TYPOGRAPHY, PERFECT INLINE ROTATING HEADLINE & CTAS
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="col-span-1 lg:col-span-6 flex flex-col justify-center space-y-6 text-left relative z-20"
        >
          {/* Version Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-glass-bg border border-glass-border shadow-sm w-fit group cursor-pointer hover:border-glass-border-hover transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider group-hover:text-text-primary transition-colors">
              {heroCMS.versionBadge || "Kiwik.1 v1.0.0-beta"}
            </span>
          </div>

          {/* Title Header with Perfectly Aligned Inline Baseline Rotating Word */}
          <h1 className="text-4xl sm:text-5xl md:text-[62px] font-serif font-semibold leading-[1.08] tracking-tight text-text-primary">
            {heroCMS.headlinePrefix || "The Operating System"} <br />
            <span className="inline-flex items-baseline flex-wrap gap-x-3">
              <span>{heroCMS.headlineHighlightWord || "for"}</span>
              <span className="inline-block relative overflow-hidden h-[1.22em] min-w-[280px] sm:min-w-[340px] align-baseline">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 26,
                      mass: 0.8,
                    }}
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-accent-blue via-indigo-500 to-accent-cyan font-serif font-bold italic drop-shadow-sm whitespace-nowrap leading-[1.22]"
                  >
                    {rotatingWords[wordIndex % rotatingWords.length]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>

          {/* Description Paragraph */}
          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-medium max-w-[480px]">
            {heroCMS.description || "Build. Ship. Document. Scale. Everything. Unified workspace for projects, documentation, deployments, analytics, and AI assistant layers."}
          </p>

          {/* CTA Buttons with Magnetic Micro-interactions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {heroCMS.primaryButton?.visible !== false && (
              <MagneticGlassButton href={heroCMS.primaryButton?.link || "/projects"} variant="primary">
                <span>{heroCMS.primaryButton?.text || "Explore Projects"}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </MagneticGlassButton>
            )}

            {heroCMS.secondaryButton?.visible !== false && (
              <MagneticGlassButton
                onClick={() => onWatchOverview && onWatchOverview()}
                variant="secondary"
              >
                <Play className="w-3.5 h-3.5 text-accent-blue fill-accent-blue/20 group-hover:scale-110 transition-transform" />
                <span>{heroCMS.secondaryButton?.text || "Watch Overview"}</span>
              </MagneticGlassButton>
            )}
          </div>

          {/* Core Telemetry Metrics Grid with CountUp Animation */}
          <div className="grid grid-cols-4 gap-3 pt-8 border-t border-divider/60 max-w-[500px]">
            {(heroCMS.metrics || []).map((st, i) => (
              <div key={st.id || i} className="text-left select-none group">
                <div className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-mono group-hover:text-accent-blue transition-colors">
                  <CountUpNumber end={st.val} suffix={st.suffix} decimals={st.decimals} />
                </div>
                <div className="text-[9px] text-text-secondary uppercase tracking-widest font-bold mt-0.5">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT PANEL: RESTORED ORIGINAL CENTERPIECE WITH ECOSYSTEM CARDS
           ───────────────────────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center relative min-h-[520px] overflow-visible">
          <Centerpiece />
        </div>

      </div>
    </section>
  );
}
