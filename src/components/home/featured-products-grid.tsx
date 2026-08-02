"use client";

import React from "react";
import { motion } from "framer-motion";
import { AppleCoverflowCarousel } from "./apple-coverflow-carousel";
import { useSiteCMS } from "@/stores/site-cms-store";

export function FeaturedProductsGrid() {
  const cms = useSiteCMS();
  const projectsPage = cms.projectsPage;

  const badgeText = projectsPage?.badgeText || "FEATURED PRODUCTS";
  const title = projectsPage?.title || "Explore Kiwik Products";
  const subtitle = projectsPage?.description || "Understand what each product does, who it helps, its current status, and request real-time access. Fully synchronised with the Admin CMS panel.";

  return (
    <section id="featured-products-section" className="py-20 md:py-28 px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto relative z-20 select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION HEADER (Light & Dark Mode Compatible)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-10 space-y-3"
      >
        <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-[#A1A1AA]">
          {badgeText}
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-neutral-900 dark:text-white tracking-wide leading-snug py-1">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-[#A1A1AA] font-sans font-medium max-w-2xl mx-auto leading-relaxed tracking-wide">
          {subtitle}
        </p>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          3D APPLE COVER-FLOW CENTER CAROUSEL
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <AppleCoverflowCarousel />
      </motion.div>

    </section>
  );
}
