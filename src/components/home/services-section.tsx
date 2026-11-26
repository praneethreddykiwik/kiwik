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
import { MINI_CSS, MINI_SCREENS } from "@/components/concepts/mini-ui";

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

/** Cloud & DevOps has no product to show, so it shows the work itself: a release going out. */
function DeployPanel() {
  const rows: [string, string][] = [
    ["Build", "passed"],
    ["Tests", "128 passed"],
    ["Security scan", "no issues"],
    ["Deploy", "live"],
  ];
  return (
    <div className="h-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-[#0b0d14] shadow-[0_24px_60px_-20px_rgba(16,20,46,0.45)]">
      <div aria-hidden="true" className="flex gap-1.5 px-3 py-2 bg-[#141722]">
        <span className="w-2 h-2 rounded-full bg-[#5a6cae]" />
        <span className="w-2 h-2 rounded-full bg-[#8fabd9]" />
        <span className="w-2 h-2 rounded-full bg-[#008080]" />
      </div>
      <ul className="p-4 font-mono text-[12px] sm:text-[13px] leading-6 text-white/80">
        {rows.map(([step, result], i) => (
          <li key={step} className="flex items-center justify-between gap-3 border-b border-white/[0.06] last:border-0 py-1">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#4fc3bd]" style={{ opacity: 0.5 + i * 0.15 }} />{step}</span>
            <span className="text-[#4fc3bd]">{result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A service with no product of its own shows a drawn screen of that kind of work, never a repeated screenshot. */
function drawnFor(service: CapabilityItem): React.ReactNode | "deploy" {
  const t = `${service.title} ${service.iconName}`.toLowerCase();
  if (/cloud|devops|server/.test(t)) return "deploy";
  const pick = (name: string) => {
    const View = MINI_SCREENS.find((m) => m.name === name)!.View;
    return <View />;
  };
  if (/web|globe/.test(t)) return pick("Website");
  if (/secur|identity|shield|lock/.test(t)) return pick("Cybersecurity");
  if (/automat|workflow|zap/.test(t)) return pick("Invoicing");
  if (/commerce|store|shop/.test(t)) return pick("Online store");
  if (/ai|bot|spark/.test(t)) return pick("AI assistant");
  if (/app|phone/.test(t)) return pick("Delivery app");
  return pick("Sales dashboard");
}

/**
 * What a client can hire Kiwik for, shown with products it has built. Every
 * card has the same shape: what it is, what it does, and a picture of real
 * work at the same size along the bottom. Cards slide in but never fade, so
 * they are readable before scripts have loaded.
 */
export function ServicesSection() {
  const { capabilities } = useSiteCMS();
  const projects = useProjects().filter((p) => (p as { visible?: boolean }).visible !== false);

  const services = [...(capabilities?.items || [])]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (services.length === 0) return null;


  return (
    <section id="capabilities" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto relative z-20 scroll-mt-24">
      <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-text-primary tracking-tight leading-[1.08] text-balance">
            {capabilities.sectionTitle || "What we can build for you"}
          </h2>
          <p className="mt-4 text-lg text-text-secondary text-pretty">Pick what you need. Where we have built it for a client, the card shows the real product.</p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 w-fit inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-text-primary text-bg-primary text-sm font-bold hover:opacity-85 transition-opacity"
        >
          Tell us what you need <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <style>{MINI_CSS}</style>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {services.map((service, i) => {
          const Icon = iconFor(service.iconName);
          const example = service.projectSlug ? projects.find((p) => p.slug === service.projectSlug) : undefined;
          const drawn = example?.coverImage ? undefined : drawnFor(service);
          return (
            <motion.li
              key={service.id || i}
              initial={{ y: 28 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
              className="group relative flex flex-col overflow-hidden rounded-[24px] bg-bg-elevated dark:bg-bg-secondary border border-glass-border hover:border-[#8fabd9]/60 transition-colors"
            >
              <div aria-hidden="true" className={cn("absolute inset-0 bg-radial-[at_80%_100%] to-transparent to-65% pointer-events-none", WASHES[i % 2])} />
              <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#008080]/10 dark:bg-[#4fc3bd]/10">
                    <Icon className="w-5 h-5 text-[#008080] dark:text-[#4fc3bd]" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">{service.title}</h3>
                </div>
                <p className="mt-3 text-base text-text-secondary leading-relaxed">{service.desc}</p>
                {example ? (
                  <Link
                    href={`/projects/${example.slug}`}
                    // The whole card is the click target.
                    className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-bold text-[#34407f] dark:text-[#a9c0e6] after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    See {example.name}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href="/contact"
                    className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-bold text-[#34407f] dark:text-[#a9c0e6] after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    Ask about this
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
              <div className="relative px-6 sm:px-7 pb-6 sm:pb-7">
                <div className="aspect-[16/10] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  {example?.coverImage ? (
                    <Screenshot project={example} className="h-full [&_img]:h-[calc(100%-26px)] [&_img]:aspect-auto" />
                  ) : drawn === "deploy" ? (
                    <DeployPanel />
                  ) : (
                    <div className="h-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white shadow-[0_24px_60px_-20px_rgba(16,20,46,0.45)]">{drawn}</div>
                  )}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
