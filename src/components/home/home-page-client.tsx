"use client";

import * as LucideIcons from "lucide-react";
import { CheckCircle } from "lucide-react";
import { MeliusHero } from "@/components/Hero/melius-hero";
import { AIChatbot } from "@/components/home/ai-chatbot";
import { MacosDashboard } from "@/components/home/macos-dashboard";
import { AiRaycastPanel } from "@/components/home/ai-raycast-panel";
import { HowWeWorkCycle } from "@/components/home/how-we-work-cycle";
import { FeaturedProductsGrid } from "@/components/home/featured-products-grid";
import { EarthSection } from "@/components/home/earth-section";
import { FaqSection } from "@/components/home/faq-section";
import { ServicesSection } from "@/components/home/services-section";
import { FutureVision } from "@/components/home/future-vision";
import { AiFlowSection, OneTeamSection, WhatWeBuildSection } from "@/components/home/motion-sections";
import { TRUST_TITLE } from "@/data/home-content";
import { useSiteCMS } from "@/stores/site-cms-store";

/** In the order a client asks: is this me, has it been done before, what can they do, how, and can I rely on them? */
export function HomePageClient() {
  const cms = useSiteCMS();
  const trust = cms.trust;

  return (
    <div className="min-h-screen text-text-primary overflow-x-hidden relative">
      <MeliusHero />
      <WhatWeBuildSection />
      <FeaturedProductsGrid />
      <AiFlowSection />
      <ServicesSection />
      <OneTeamSection />
      <HowWeWorkCycle />

      {/* Featured projects: the desktop-style dashboard with the AI panel beside it. */}
      <section id="macos-dashboard-widget" className="relative z-20 py-8 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch justify-center">
          <div className="flex-1">
            <MacosDashboard />
          </div>
          <div className="xl:mt-12 flex-shrink-0">
            <AiRaycastPanel />
          </div>
        </div>
      </section>
      <EarthSection />

      <section className="relative z-20 mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 md:px-8 md:pt-24">
        <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-[1.08] text-text-primary">{trust?.sectionTitle || TRUST_TITLE}</h2>
        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {[...(trust?.items || [])]
            .filter((item) => item.visible !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item, i) => {
              const Icon = (item.iconName && (LucideIcons as any)[item.iconName]) || CheckCircle;
              return (
                <li key={item.id || i}>
                  <Icon className="h-6 w-6 text-[#007a78] dark:text-[#4fc3bd]" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold text-text-primary">{item.title}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-text-secondary text-pretty">{item.desc}</p>
                </li>
              );
            })}
        </ul>
      </section>

      <FutureVision />
      <FaqSection />
      <AIChatbot />
    </div>
  );
}
