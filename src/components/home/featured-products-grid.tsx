"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { textLink } from "@/components/layout/page-intro";
import { AppleCoverflowCarousel } from "./apple-coverflow-carousel";
import { useSiteCMS } from "@/stores/site-cms-store";
import { FEATURED_COPY } from "@/data/home-content";

export function FeaturedProductsGrid() {
  const cms = useSiteCMS();
  const projectsPage = cms.projectsPage;

  const title = projectsPage?.title || FEATURED_COPY.title;
  const subtitle = projectsPage?.description || FEATURED_COPY.description;

  return (
    <section id="featured-products-section" className="py-14 md:py-20 px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto relative z-20">
      
      <div className="mx-auto mb-6 max-w-5xl text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.08] text-text-primary">{title}</h2>
        <p className="mt-4 text-lg text-text-secondary text-pretty">{subtitle}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <AppleCoverflowCarousel />
      </motion.div>

      <p className="mt-2 text-center">
        <Link href="/projects" className={textLink}>See all our work</Link>
      </p>
    </section>
  );
}
