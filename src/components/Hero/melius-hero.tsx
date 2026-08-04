"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PaperBackground } from "./paper-background";
import { ImageRibbon } from "./ribbon";
import { PromptCTA } from "./prompt-cta";
import { useSiteCMS } from "@/stores/site-cms-store";
import { cn } from "@/lib/utils";

export function MeliusHero() {
  const cms = useSiteCMS();
  const hero = cms.hero;

  const headlinePrefix = hero?.headlinePrefix || "The Operating System for";
  const headlineHighlight = hero?.headlineHighlightWord || "future";
  const description = hero?.description || "Be the creative director. Let agents be your team. Brief our agent Mel, watch the work assemble, and steer any prompt until the output lands exactly as you imagined.";

  return (
    <PaperBackground className="min-h-screen flex flex-col justify-between pt-12 pb-12 overflow-hidden">
      {/* Hero Center Section */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-10 my-auto text-center px-4 relative z-10">
        
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
              <span>{hero?.versionBadge || "Kiwik.1 v1.0.0-beta"}</span>
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
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium tracking-wide leading-[1.15] py-1 text-text-primary">
            {headlinePrefix} <br />
            <span className="italic font-semibold text-text-primary">
              {headlineHighlight}
            </span>
          </h1>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            INTERACTIVE PARALLAX INFINITE IMAGE EMITTER GALLERY
           ───────────────────────────────────────────────────────────── */}
        <ImageRibbon />

        {/* ─────────────────────────────────────────────────────────────
            SUBTITLE & DESCRIPTION
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg mx-auto text-center"
        >
          <p className="text-sm sm:text-base text-text-secondary leading-loose tracking-wide font-sans font-medium">
            {description}
          </p>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            INTERACTIVE PROMPT INPUT CTA
           ───────────────────────────────────────────────────────────── */}
        <PromptCTA />

      </main>
    </PaperBackground>
  );
}
