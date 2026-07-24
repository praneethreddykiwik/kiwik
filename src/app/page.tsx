"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Workflow,
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
import { EcosystemPipeline } from "@/components/home/ecosystem-pipeline";
import { FeaturePillars } from "@/components/home/feature-pillars";
import { FeaturedProductsGrid } from "@/components/home/featured-products-grid";
import { FutureVision } from "@/components/home/future-vision";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMSStore } from "@/stores/site-cms-store";
import { GlassCard } from "@/components/glass/glass-card";

export default function HomePage() {
  const [bootStep, setBootStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const projects = useProjects();
  
  const cms = useSiteCMSStore((state) => state.cms);
  const featuredSection = cms.featuredSection || {
    title: "Explore Kiwik Products",
    subtitle: "Understand what each product does, who it helps, its current status, and request real-time access. Fully synchronised with the Admin CMS panel."
  };
  const capabilities = cms.capabilities || { sectionTitle: "Our Capabilities", items: [] };
  const trust = cms.trust || { sectionTitle: "Trust & Delivery", items: [] };
  const howWeWork = cms.howWeWork || { badge: "Execution Workflow", sectionTitle: "How We Work", steps: [] };

  // Dynamic Projects loaded from the CMS database store to reflect edits immediately
  const featuredCMS = projects.slice(0, 3);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "Shield": return <Shield className="w-4 h-4 text-rose-400" />;
      case "Workflow": return <Workflow className="w-4 h-4 text-amber-400" />;
      case "Cloud": return <Cloud className="w-4 h-4 text-accent-blue" />;
      default: return <Cpu className="w-4 h-4 text-accent-blue" />;
    }
  };

  useEffect(() => {
    // Record visitor session
    fetch("/api/visitors", { method: "POST" }).catch((err) =>
      console.error("Error logging visitor session", err)
    );
  }, []);

  return (
    <div className="min-h-screen text-text-primary overflow-x-hidden relative">
      {/* Pixel-Perfect Melius Reference Hero Experience */}
      <MeliusHero />

      {/* THE CRISKA ECOSYSTEM PIPELINE (Matching Reference Image) */}
      <EcosystemPipeline />

      {/* WHY CRISKA FEATURE PILLARS (Matching Reference Image) */}
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

      {/* FEATURED PRODUCTS SECTION (Matching Reference Screenshot 2) */}
      <FeaturedProductsGrid />

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

        return (
          <section className="relative w-full overflow-hidden bg-[#050608] text-white py-28 sm:py-36 md:py-40 lg:py-44 px-6 md:px-12 border-t border-b border-white/[0.06] select-none">
            {/* Immersive Curved Earth Background */}
            <div 
              className="absolute inset-0 bg-cover bg-left md:bg-center opacity-65 md:opacity-80 mix-blend-screen pointer-events-none z-0 scale-[1.05]"
              style={{ 
                backgroundImage: `url('${earthShowcase.earthImageUrl || "https://cdn.prod.website-files.com/68513e75563291f5d48ada9b/696df7aeb646a7a2198327de_36fa0c4d18a844367e1911df246f6613_earth.webp"}')`,
                backgroundRepeat: "no-repeat"
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
                  <Link 
                    href="/docs" 
                    className="px-6 py-2.5 rounded-full bg-white text-black font-sans font-bold text-xs hover:bg-neutral-200 transition-colors shadow-lg"
                  >
                    Book a demo
                  </Link>
                  <Link 
                    href="/projects" 
                    className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-sans font-semibold text-xs hover:bg-white/20 transition-colors"
                  >
                    Telemetry integration
                  </Link>
                </div>
              </div>

              {/* Row of Metrics (Reference Style) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-auto border-t border-white/10 max-w-5xl mx-auto w-full">
                {(earthShowcase.stats || []).map((stat, i) => (
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

      {/* SECTION B: HOW WE WORK (5-Step Engineering Pipeline) */}
      <section id="how-we-work" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 border-t border-divider/60 max-w-[1400px] mx-auto relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Workflow className="w-3.5 h-3.5" />
            <span>{howWeWork.badge || "Execution Workflow"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary tracking-tight">
            {howWeWork.sectionTitle || "How We Work"}
          </h2>
        </div>

        {/* Timeline Grid with Glowing Connecting Line */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/40 to-cyan-500/20 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5 relative z-10">
            {(howWeWork.steps || []).map((item, idx) => (
              <GlassCard key={item.id || idx} className="p-6 border border-glass-border relative hover:border-accent-blue/40 transition-all select-none text-left shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue font-mono font-bold text-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                    0{idx + 1}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-text-muted">
                    Phase {idx + 1}
                  </span>
                </div>
                
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-text-primary group-hover:text-accent-blue transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium mt-2">
                  {item.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C: CAPABILITIES & TRUST ASSURANCE */}
      <section id="capabilities" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 border-t border-divider/60 max-w-[1400px] mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Capabilities Grid */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary tracking-tight">
                {capabilities.sectionTitle || "Our Capabilities"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(capabilities.items || []).map((cap, i) => (
                <div key={cap.id || i} className="p-5 rounded-2xl bg-bg-secondary/40 border border-glass-border hover:border-accent-blue/30 transition-all flex gap-4 select-none backdrop-blur-xl group">
                  <div className="p-2.5 rounded-xl bg-bg-primary border border-glass-border text-accent-blue flex-shrink-0 h-fit group-hover:scale-110 transition-transform">
                    {getIcon(cap.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-text-primary tracking-tight leading-tight group-hover:text-accent-blue transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-[11px] text-text-secondary font-medium leading-relaxed mt-1">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust & Delivery Panel */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary tracking-tight">
                {trust.sectionTitle || "Trust & Delivery"}
              </h2>
            </div>

            <GlassCard className="p-6 border border-glass-border space-y-5 select-none shadow-xl">
              {(trust.items || []).map((item, i) => (
                <div key={item.id || i} className="flex gap-3 text-left group">
                  <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
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
              ))}
            </GlassCard>
          </div>

        </div>
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
