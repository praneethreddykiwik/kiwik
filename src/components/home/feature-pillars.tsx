"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useSiteCMSStore } from "@/stores/site-cms-store";

export function FeaturePillars() {
  const whyCriskaPills = useSiteCMSStore((state) => state.cms.whyCriskaPills);

  const getIcon = (iconName?: string, customColor?: string) => {
    const IconComponent = iconName ? ((LucideIcons as any)[iconName] || LucideIcons.Cpu) : LucideIcons.Cpu;
    
    // Determine fallback colors if no customColor is provided
    let colorClass = customColor || "text-purple-400";
    if (!customColor) {
      if (iconName === "Shield") colorClass = "text-emerald-400";
      else if (iconName === "Layers") colorClass = "text-amber-400";
      else if (iconName === "Cloud") colorClass = "text-accent-blue";
      else if (iconName === "Zap") colorClass = "text-cyan-400";
      else if (iconName === "Sparkles") colorClass = "text-pink-400";
    }
    
    return <IconComponent className={`w-4 h-4 ${colorClass}`} />;
  };

  const pillars = [...(whyCriskaPills || [])]
    .filter(p => p.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activePillars = pillars.length > 0 ? pillars : [
    { id: "w-1", text: "AI-Powered Intelligence", iconName: "Cpu", order: 1, visible: true },
    { id: "w-2", text: "Security First", iconName: "Shield", order: 2, visible: true },
    { id: "w-3", text: "Enterprise Ready", iconName: "Layers", order: 3, visible: true },
    { id: "w-4", text: "Cloud Native", iconName: "Cloud", order: 4, visible: true },
    { id: "w-5", text: "Scalable by Design", iconName: "Sparkles", order: 5, visible: true }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto relative z-20">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-[10px] font-mono font-bold tracking-widest text-accent-blue uppercase bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">
          Core Principles
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {activePillars.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-5 py-3 rounded-full bg-glass-bg border border-glass-border hover:border-accent-blue/40 backdrop-blur-xl flex items-center gap-3 text-xs font-bold text-text-primary shadow-lg transition-all cursor-pointer group"
          >
            <div className="p-1.5 rounded-full bg-bg-secondary border border-glass-border group-hover:scale-110 transition-transform">
              {getIcon(p.iconName, p.color)}
            </div>
            <span>{p.text}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
