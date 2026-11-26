"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PaperBackground } from "@/components/Hero/paper-background";
import { BrandGradient } from "@/components/gl/brand-gradient";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { useThemeStore } from "@/stores/theme-store";
import { FeaturedProductsGrid } from "@/components/home/featured-products-grid";
import { ServicesSection } from "@/components/home/services-section";
import { HowWeWorkCycle } from "@/components/home/how-we-work-cycle";

/** The live kiwik.one hero copy, word for word. */
export const LIVE = {
  badge: "Software · Apps · AI",
  line1: "Software and AI built for",
  line2: "your business",
  text: "Kiwik designs, builds and looks after websites, mobile apps, AI systems and online stores. Tell us what you need and we take it from idea to launch.",
};

const HERO_COLORS: Record<"light" | "dark", [string, string, string]> = {
  light: ["#d3def8", "#cdefea", "#fafafd"],
  dark: ["#1b2358", "#05504f", "#070708"],
};

/** The same slot the photo ribbon fills on the live site. */
export const SLOT = "relative mx-auto w-full max-w-[1700px] h-[300px] sm:h-[440px] md:h-[480px] my-2 sm:my-6";

/**
 * The live hero, unchanged: badge, serif headline with the italic second line,
 * the moving brand gradient and the line under it. Only the picture in the
 * middle is swapped for each concept.
 */
export function HeroShell({ children, gradient = true }: { children: React.ReactNode; gradient?: boolean }) {
  const dark = useThemeStore((s) => s.mode) === "dark";
  return (
    <>
      <PaperBackground className="min-h-screen flex flex-col justify-between pt-[calc(72px+3rem)] pb-12 overflow-hidden">
        {gradient && (
          <BrandGradient
            key={dark ? "dark" : "light"}
            colors={HERO_COLORS[dark ? "dark" : "light"]}
            brightness={dark ? 0.9 : 1.3}
            strength={1.5}
            opacity={dark ? 0.85 : 0.9}
            className="[mask-image:radial-gradient(ellipse_62%_50%_at_50%_50%,#000_20%,transparent_100%)]"
          />
        )}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-10 my-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <a href="/projects" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-glass-bg border border-glass-border text-[10px] font-mono font-bold tracking-tight text-text-primary hover:border-accent-blue/40 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
              <span>{LIVE.badge}</span>
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 sm:space-y-2 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium tracking-wide leading-[1.15] py-1 text-text-primary text-balance">
              {LIVE.line1} <br />
              <span className="italic font-semibold text-text-primary">{LIVE.line2}</span>
            </h1>
          </motion.div>
          <div className="w-full">{children}</div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg mx-auto text-center"
          >
            <p className="text-sm sm:text-base text-text-secondary leading-loose tracking-wide font-sans font-medium">{LIVE.text}</p>
          </motion.div>
        </div>
      </PaperBackground>
      <FeaturedProductsGrid />
      <ServicesSection />
      <HowWeWorkCycle />
    </>
  );
}

/**
 * A WebGL picture that waits for the page to settle, only draws on screen,
 * and shows `fallback` on phones without a real GPU or with reduced motion.
 */
export function GLSlot({
  load,
  fallback,
  className,
  props = {},
}: {
  load: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>;
  fallback: React.ReactNode;
  className?: string;
  props?: Record<string, unknown>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const gl = useGL(ref);
  const Scene = useRef(dynamic(load, { ssr: false })).current;
  return (
    <div ref={ref} className={cn(SLOT, className)}>
      {gl === "on" ? (
        <GLBoundary fallback={fallback}>
          <Scene {...props} />
        </GLBoundary>
      ) : gl === "off" ? (
        fallback
      ) : null}
    </div>
  );
}
