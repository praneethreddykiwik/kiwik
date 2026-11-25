"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { optimizedImage } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMS } from "@/stores/site-cms-store";
import type { CapabilityItem } from "@/types/site-cms-types";
import type { Project } from "@/types";

/** Services shown as a large card with a picture; the rest go in the list beside the last one. */
const FEATURED = 5;
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-7"];
// Alternating washes in the logo's two ribbon colours.
const WASHES = [
  "from-[#5a6cae]/25 dark:from-[#5a6cae]/30",
  "from-[#008080]/20 dark:from-[#008080]/30",
];
const EASE = [0.16, 1, 0.3, 1] as const;

const iconFor = (name: string) => (LucideIcons as any)[name] || LucideIcons.Code;

function Screenshot({ project, className }: { project: Project; className?: string }) {
  const src = project.coverImage || "";
  return (
    <div className={cn("overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-[#eef0f4] dark:bg-[#1c1e24] shadow-[0_24px_60px_-20px_rgba(16,20,46,0.45)]", className)}>
      <div aria-hidden="true" className="flex gap-1.5 px-3 py-2 bg-[#eef0f4] dark:bg-[#1c1e24]">
        <span className="w-2 h-2 rounded-full bg-[#5a6cae]" />
        <span className="w-2 h-2 rounded-full bg-[#8fabd9]" />
        <span className="w-2 h-2 rounded-full bg-[#008080]" />
      </div>
      <img
        src={optimizedImage(src, 1200)}
        onError={(e) => {
          if (e.currentTarget.getAttribute("src") !== src) e.currentTarget.src = src;
        }}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full aspect-[16/9] object-cover object-top"
      />
    </div>
  );
}

function Visual({ service, example, sites }: { service: CapabilityItem; example?: Project; sites: Project[] }) {
  // An app: zoom in on the lower right of the cover, where the app itself is shown.
  if (example && service.iconName === "Smartphone") {
    const src = example.coverImage || "";
    return (
      <div className="absolute inset-y-0 left-7 sm:left-9 right-0 overflow-hidden rounded-tl-2xl shadow-[0_24px_60px_-20px_rgba(16,20,46,0.45)]">
        <img
          src={optimizedImage(src, 1200)}
          onError={(e) => {
            if (e.currentTarget.getAttribute("src") !== src) e.currentTarget.src = src;
          }}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute right-[-18%] bottom-0 w-[150%] max-w-none min-h-full object-cover object-bottom origin-[80%_100%] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
    );
  }
  if (example) {
    return (
      <div className="absolute inset-y-0 left-7 sm:left-9 -right-10 transition-transform duration-500 ease-out group-hover:-translate-y-2">
        <Screenshot project={example} />
      </div>
    );
  }
  // No single example: a fan of sites we have built.
  if (sites.length === 0) return null;
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {sites.slice(0, 3).map((site, i) => (
        <div
          key={site.slug}
          style={{ left: `${6 + i * 17}%`, top: `${i * 34}px`, zIndex: i }}
          className={cn(
            "absolute w-[62%] transition-transform duration-500 ease-out",
            i === 0 && "group-hover:-translate-x-2 group-hover:-translate-y-2",
            i === 2 && "group-hover:translate-x-2 group-hover:translate-y-1"
          )}
        >
          <Screenshot project={site} />
        </div>
      ))}
    </div>
  );
}

/**
 * What a client can hire Kiwik for, shown with products it has built. Cards slide
 * in but never fade, so they are readable before scripts have loaded.
 */
export function ServicesSection() {
  const { capabilities } = useSiteCMS();
  const projects = useProjects().filter((p) => (p as { visible?: boolean }).visible !== false);

  const services = [...(capabilities?.items || [])]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (services.length === 0) return null;

  const featured = services.slice(0, FEATURED);
  const others = services.slice(FEATURED);
  const sites = projects.filter((p) => p.coverImage);

  return (
    <section id="capabilities" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto relative z-20 scroll-mt-24">
      <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-4xl">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-text-secondary">Our services</span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-text-primary tracking-tight leading-[1.08] text-balance">
            {capabilities.sectionTitle || "What we can build for you"}
          </h2>
        </div>
        <Link
          href="/contact"
          className="shrink-0 w-fit inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-text-primary text-bg-primary text-sm font-bold hover:opacity-85 transition-opacity"
        >
          Tell us what you need <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
        {featured.map((service, i) => {
          const Icon = iconFor(service.iconName);
          const example = service.projectSlug ? projects.find((p) => p.slug === service.projectSlug) : undefined;
          const lastAlone = i === featured.length - 1 && others.length === 0 && i % 2 === 0;
          return (
            <motion.li
              key={service.id || i}
              initial={{ y: 28 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.08, ease: EASE }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[28px] bg-bg-elevated dark:bg-bg-secondary border border-glass-border hover:border-[#8fabd9]/60 transition-colors",
                lastAlone ? "lg:col-span-12" : SPANS[i]
              )}
            >
              <div aria-hidden="true" className={cn("absolute inset-0 bg-radial-[at_80%_100%] to-transparent to-65% pointer-events-none", WASHES[i % 2])} />
              <div className="relative p-7 sm:p-9 pb-6 sm:pb-8">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-[#008080] dark:text-[#4fc3bd]" aria-hidden="true" />
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">{service.title}</h3>
                </div>
                <p className="mt-3 max-w-[42ch] text-base text-text-secondary leading-relaxed">{service.desc}</p>
                {example && (
                  <Link
                    href={`/projects/${example.slug}`}
                    // The whole card is the click target.
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#34407f] dark:text-[#a9c0e6] after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    See {example.name}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
              <div className="relative mt-auto h-[230px] sm:h-[290px]">
                <Visual service={service} example={example} sites={sites} />
              </div>
            </motion.li>
          );
        })}

        {others.length > 0 && (
          <motion.li
            initial={{ y: 28 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className={cn("rounded-[28px] bg-[#1a2150] text-white overflow-hidden", featured.length % 2 === 1 ? "lg:col-span-5" : "lg:col-span-12")}
          >
            <ul className="h-full flex flex-col divide-y divide-white/12">
              {others.map((service, i) => {
                const Icon = iconFor(service.iconName);
                return (
                  <li key={service.id || i} className="flex-1 flex items-center gap-5 p-7 sm:px-9 hover:bg-white/[0.06] transition-colors">
                    <Icon className="w-7 h-7 shrink-0 text-[#8fabd9]" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{service.title}</h3>
                      <p className="mt-1 text-sm text-white/75 leading-relaxed">{service.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.li>
        )}
      </ul>
    </section>
  );
}
