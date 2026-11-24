"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMS } from "@/stores/site-cms-store";

/** What a client can hire Kiwik for, each backed by a published project where one exists. */
export function ServicesSection() {
  const { capabilities } = useSiteCMS();
  const projects = useProjects();

  const services = [...(capabilities?.items || [])]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (services.length === 0) return null;

  return (
    <section id="capabilities" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto relative z-20 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-text-secondary">Our services</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-primary tracking-tight">
          {capabilities.sectionTitle || "What we can build for you"}
        </h2>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, i) => {
          const Icon = (LucideIcons as any)[service.iconName] || LucideIcons.Code;
          const example = service.projectSlug ? projects.find((p) => p.slug === service.projectSlug) : undefined;
          return (
            <motion.li
              key={service.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col p-6 rounded-2xl bg-bg-secondary/60 border border-glass-border hover:border-accent-blue/40 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-bold text-text-primary tracking-tight">{service.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{service.desc}</p>
              {example && (
                <Link
                  href={`/projects/${example.slug}`}
                  className="mt-auto pt-5 inline-flex items-center gap-1 text-xs font-bold text-accent-blue hover:underline w-fit"
                >
                  See {example.name} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              )}
            </motion.li>
          );
        })}
      </ul>

      <div className="mt-10 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-bg-primary text-sm font-bold hover:opacity-85 transition-opacity"
        >
          Tell us what you need <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
