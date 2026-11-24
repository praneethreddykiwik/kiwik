"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { 
  ArrowRight, 
  Layers, 
  Play, 
  Terminal as TerminalIcon,
  Activity,
  Cpu,
  Zap,
  Globe,
  Sparkles,
  Shield,
  Cloud,
  CheckCircle,
  Code,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MeliusHero } from "@/components/Hero/melius-hero";
import { Centerpiece } from "@/components/home/centerpiece";
import { MacosDashboard } from "@/components/home/macos-dashboard";
import { AiRaycastPanel } from "@/components/home/ai-raycast-panel";
import { AIChatbot } from "@/components/home/ai-chatbot";
import { HowWeWorkCycle } from "@/components/home/how-we-work-cycle";
import { FeaturePillars } from "@/components/home/feature-pillars";
import { FeaturedProductsGrid } from "@/components/home/featured-products-grid";
import { ServicesSection } from "@/components/home/services-section";
import { FutureVision } from "@/components/home/future-vision";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMS } from "@/stores/site-cms-store";
import { GlassCard } from "@/components/glass/glass-card";

export function HomePageClient() {
  const [bootStep, setBootStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const projects = useProjects();
  
  const cms = useSiteCMS();
  const featuredSection = cms.featuredSection || {
    title: "Explore Kiwik Products",
    subtitle: "Understand what each product does, who it helps, its current status, and request real-time access. Fully synchronised with the Admin CMS panel."
  };
  const trust = cms.trust || { sectionTitle: "Trust & Delivery", items: [] };

  // Dynamic Projects loaded from the CMS database store to reflect edits immediately
  const featuredCMS = projects.slice(0, 3);

  // Visits are recorded by TelemetryProvider in the root layout. A second,
  // body-less POST here used to run on every home load; with no sessionId the
  // API minted a fresh random session each time, inflating unique visitors.

  return (
    <div className="min-h-screen text-text-primary overflow-x-hidden relative">
      {/* Pixel-Perfect Melius Reference Hero Experience */}
      <MeliusHero />

      {/* FEATURED PRODUCTS */}
      <FeaturedProductsGrid />

      {/* HOW WE WORK (circular process) */}
      <HowWeWorkCycle />

      {/* FEATURE PILLARS */}
      <FeaturePillars />

      {/* LOWER GRID SECTION: macOS Control Dashboard & Raycast AI Panel */}
      <section id="macos-dashboard-widget" className="relative z-20 py-8 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch justify-center">
          {/* Interactive Desktop Workspace Dashboard */}
          <div className="flex-1">
            <MacosDashboard />
          </div>

          {/* Floating Raycast AI side panel */}
          <div className="xl:mt-12 flex-shrink-0">
            <AiRaycastPanel />
          </div>
        </div>
      </section>

      {/* EARTH INFRASTRUCTURE SHOWCASE SECTION */}
      {(() => {
        const earthShowcase = cms.earthShowcase || {
          headline: "Access the largest enterprise telemetry network.",
          description: "Kiwik connects the edge telemetry, managed node clusters, and database replication pipelines on every cloud stack you operate.",
          earthImageUrl: "https://cdn.prod.website-files.com/68513e75563291f5d48ada9b/696df7aeb646a7a2198327de_36fa0c4d18a844367e1911df246f6613_earth.webp",
          stats: [
            { id: "st-1", value: "99.9%", label: "System Uptime", description: "Automated multi-region deployments." },
            { id: "st-2", value: "14ms", label: "Edge Latency", description: "Average edge request roundtrip latency." },
            { id: "st-3", value: "24/7", label: "Monitoring", description: "Operational intelligence and telemetry monitoring." },
            { id: "st-4", value: "3M+", label: "Daily Events", description: "Daily edge events processed and synced." }
          ]
        };

        const activeStats = (earthShowcase.stats || []);

        return (
          <section className="relative w-full overflow-hidden bg-[#050608] text-white py-28 sm:py-36 md:py-40 lg:py-44 px-6 md:px-12 border-t border-b border-white/[0.06] select-none">
            {/* Immersive Curved Earth Background */}
            <div
              className="absolute inset-0 bg-cover bg-left md:bg-center pointer-events-none z-0 scale-[1.05]"
              style={{ 
                backgroundImage: `url('${earthShowcase.earthImageUrl || "https://cdn.prod.website-files.com/68513e75563291f5d48ada9b/696df7aeb646a7a2198327de_36fa0c4d18a844367e1911df246f6613_earth.webp"}')`,
                backgroundRepeat: "no-repeat",
                opacity: earthShowcase.overlayOpacity !== undefined ? earthShowcase.overlayOpacity : 0.8,
                filter: earthShowcase.blurPx ? `blur(${earthShowcase.blurPx}px)` : undefined
              }}
            />
            {/* Soft Radial Ambient Lighting to Blend Edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/90 via-transparent to-[#050608] pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050608] via-transparent to-[#050608] pointer-events-none z-10" />

            <div className="max-w-[1400px] mx-auto relative z-20 text-center md:text-left flex flex-col justify-between h-full min-h-[460px] md:min-h-[500px]">
              {/* Centered Premium Typography Content */}
              <div className="max-w-3xl mx-auto text-center space-y-6 mt-6">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                  {earthShowcase.headline || "Access the largest enterprise telemetry network."}
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
                  {earthShowcase.description || "Kiwik connects the edge telemetry, managed node clusters, and database replication pipelines on every cloud stack you operate."}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  {earthShowcase.cta1Text && (() => {
                    const demoMailto =
                      "mailto:praneeth@kiwik.one?subject=Book%20a%20Demo%20-%20Kiwik%20Platform&body=Hi%20Praneeth%2C%0A%0AI%20would%20like%20to%20book%20a%20demo%20for%20the%20Kiwik%20platform.%0A%0ACompany%2FTeam%3A%20%0APpreferred%20Time%3A%20%0A%0AThanks!";
                    const href =
                      earthShowcase.cta1Href && earthShowcase.cta1Href !== "/docs"
                        ? earthShowcase.cta1Href
                        : demoMailto;
                    const isExternal = /^https?:\/\//i.test(href);
                    return (
                      <a
                        href={href}
                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="px-6 py-2.5 rounded-full bg-white text-black font-sans font-bold text-xs hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
                      >
                        {earthShowcase.cta1Text}
                      </a>
                    );
                  })()}
                  {earthShowcase.cta2Text && (
                    <Link 
                      href={earthShowcase.cta2Href || "/projects"} 
                      className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-sans font-semibold text-xs hover:bg-white/20 transition-colors"
                    >
                      {earthShowcase.cta2Text}
                    </Link>
                  )}
                </div>
              </div>

              {/* Row of Metrics (Reference Style) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-auto border-t border-white/10 max-w-5xl mx-auto w-full">
                {activeStats.map((stat, i) => (
                  <div key={stat.id || i} className="space-y-1.5 text-center md:text-left">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">{stat.value}</h3>
                    <p className="text-[11px] text-neutral-400 leading-normal max-w-[180px] mx-auto md:mx-0 font-medium">
                      {stat.description || stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* SERVICES */}
      <ServicesSection />

      {/* TRUST & DELIVERY */}
      <section className="pb-16 md:pb-24 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto relative z-20 text-left">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary tracking-tight">
            {trust.sectionTitle || "Trust & Delivery"}
          </h2>
        </div>

        <GlassCard className="p-6 border border-glass-border select-none shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...(trust.items || [])]
              .filter(item => item.visible !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, i) => {
                const TrustIcon = item.iconName ? ((LucideIcons as any)[item.iconName]) : null;
                return (
                  <div key={item.id || i} className="flex gap-3 text-left group">
                    <div className="p-1 h-fit rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5 animate-pulse-slow">
                      {TrustIcon ? <TrustIcon className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary leading-tight group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed mt-1 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </GlassCard>
      </section>

      {/* THE FUTURE WE ARE BUILDING (Cosmic Horizon reference section) */}
      <FutureVision />

      {/* Floating AI voice search assistant */}
      <AIChatbot />

      {/* Interactive macOS styled Video Demo Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="vision-glass w-full max-w-3xl rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header bar chrome */}
              <div className="px-4 py-3 bg-bg-secondary/40 border-b border-divider flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span onClick={() => setIsVideoModalOpen(false)} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer hover:opacity-85" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest font-bold">
                  Kiwik.1 Video Overview
                </span>
                <span className="w-10" />
              </div>

              {/* simulated video contents */}
              <div className="relative aspect-video bg-neutral-950 flex flex-col items-center justify-center p-8 select-none">
                <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%]" />
                
                {/* Simulated visual timeline waves */}
                <div className="flex items-end gap-1.5 h-32 mb-6">
                  {[40, 60, 45, 90, 75, 50, 110, 85, 60, 130, 95, 70, 120, 150, 80, 100, 50, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [h * 0.4, h, h * 0.4] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5 + (i % 3) * 0.3,
                        ease: "easeInOut"
                      }}
                      className="w-2 bg-accent-blue/80 rounded-full"
                      style={{ height: h }}
                    />
                  ))}
                </div>

                <div className="relative z-10 text-center space-y-2">
                  <h3 className="text-sm font-bold text-white font-mono">
                    System Telemetry Diagnostic Playback
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    All pipelines synchronized. Real-time edge latency stable at 14ms.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
