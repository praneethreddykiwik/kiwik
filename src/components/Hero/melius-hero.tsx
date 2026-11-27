"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useSiteCMS } from "@/stores/site-cms-store";
import { HERO_COPY } from "@/data/home-content";

// The orbit's box, sized so the whole hero fits one screen.
const ORBIT_BOX = "relative mx-auto w-full max-w-[1500px] h-[300px] sm:h-[clamp(220px,37svh,420px)]";
const MetalOrbit = dynamic(() => import("@/components/concepts/c13-metal-orbit").then((m) => m.MetalOrbitVisual), {
  ssr: false,
  loading: () => <div className={ORBIT_BOX} />,
});

export function MeliusHero() {
  const cms = useSiteCMS();
  const hero = cms.hero;

  const headlinePrefix = hero?.headlinePrefix || HERO_COPY.headlinePrefix;
  const headlineHighlight = hero?.headlineHighlightWord || HERO_COPY.headlineHighlightWord;
  const description = hero?.description || HERO_COPY.description;

  return (
    // Plain white or plain black behind the hero, nothing else, and it runs up under the menu bar.
    <section className="relative -mt-[72px] min-h-[100svh] flex flex-col justify-between pt-[calc(72px+1.5rem)] pb-8 overflow-hidden bg-white dark:bg-black text-text-primary select-none">
      {/* Hero Center Section */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-5 sm:space-y-7 [@media(min-width:640px)_and_(max-height:800px)]:space-y-4 my-auto text-center px-4 relative z-10">
        
        {/* Version Badge */}
        {hero?.badgeVisible !== false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              href={hero?.badgeLink || "/projects"}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-glass-bg border border-glass-border text-[10px] font-mono font-bold tracking-tight text-text-primary hover:border-accent-blue/40 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
              <span>{hero?.versionBadge || HERO_COPY.versionBadge}</span>
            </Link>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            HEADLINE (Large Editorial Serif)
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1 sm:space-y-2 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium tracking-wide leading-[1.15] py-1 text-text-primary text-balance">
            <span className="block text-balance">{headlinePrefix}</span>
            <span className="italic font-semibold text-text-primary">
              {headlineHighlight}
            </span>
          </h1>
        </motion.div>

        {/* The Kiwik mark in liquid metal, with what we build circling it. */}
        <div className="w-full">
          <MetalOrbit className={ORBIT_BOX} glow={false} />
        </div>

        {/* ─────────────────────────────────────────────────────────────
            SUBTITLE & DESCRIPTION
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto text-center"
        >
          <p className="text-sm sm:text-base text-text-secondary leading-loose tracking-wide font-sans font-medium">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href={HERO_COPY.primary.href} className="inline-flex items-center gap-2 rounded-full bg-[#1a2150] dark:bg-white px-6 py-3 text-sm sm:text-base font-bold text-white dark:text-[#10142e] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
              {HERO_COPY.primary.text} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={HERO_COPY.secondary.href} className="text-sm sm:text-base font-bold text-text-primary underline decoration-[#008080]/50 decoration-2 underline-offset-[6px] hover:decoration-[#008080] transition-colors">
              {HERO_COPY.secondary.text}
            </Link>
          </div>
        </motion.div>

      </main>
    </section>
  );
}
