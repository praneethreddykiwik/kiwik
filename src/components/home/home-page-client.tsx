"use client";

import * as LucideIcons from "lucide-react";
import { CheckCircle, Shield } from "lucide-react";
import { MeliusHero } from "@/components/Hero/melius-hero";
import { MacosDashboard } from "@/components/home/macos-dashboard";
import { AiRaycastPanel } from "@/components/home/ai-raycast-panel";
import { AIChatbot } from "@/components/home/ai-chatbot";
import { HowWeWorkCycle } from "@/components/home/how-we-work-cycle";
import { FeaturePillars } from "@/components/home/feature-pillars";
import { FeaturedProductsGrid } from "@/components/home/featured-products-grid";
import { EarthSection } from "@/components/home/earth-section";
import { ServicesSection } from "@/components/home/services-section";
import { FutureVision } from "@/components/home/future-vision";
import { useSiteCMS } from "@/stores/site-cms-store";
import { GlassCard } from "@/components/glass/glass-card";

export function HomePageClient() {
  const cms = useSiteCMS();
  const trust = cms.trust || { sectionTitle: "Trust & Delivery", items: [] };

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

      {/* WHAT WORKING WITH KIWIK MEANS */}
      <EarthSection />

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
    </div>
  );
}
