"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Cpu, Layers, Cloud, Shield, ArrowRight } from "lucide-react";
import { useSiteCMSStore } from "@/stores/site-cms-store";
import { cn } from "@/lib/utils";

import { ArchitectureNodeCMS } from "@/types/site-cms-types";

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 text-purple-400" />,
  Layers: <Layers className="w-5 h-5 text-cyan-400" />,
  Cloud: <Cloud className="w-5 h-5 text-blue-400" />,
  Shield: <Shield className="w-5 h-5 text-emerald-400" />
};

export function EcosystemPipeline() {
  const cmsNodes = useSiteCMSStore((state) => state.cms.architectureNodes);

  const defaultNodes: ArchitectureNodeCMS[] = [
    {
      id: "criska-ai",
      title: "CriskaAI",
      subtitle: "Enterprise Intelligence",
      iconName: "Cpu",
      color: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/30 hover:border-purple-500/60",
      glow: "shadow-purple-500/10",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      badgeText: "Active Node",
      order: 1,
      visible: true
    },
    {
      id: "kiwik",
      title: "Kiwik",
      subtitle: "Product & Knowledge Hub",
      iconName: "Layers",
      color: "from-cyan-500/20 to-blue-600/5",
      border: "border-cyan-500/30 hover:border-cyan-500/60",
      glow: "shadow-cyan-500/10",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      badgeText: "Active Node",
      order: 2,
      visible: true
    },
    {
      id: "criska-cloud",
      title: "CriskaCloud",
      subtitle: "Cloud & Infrastructure Platform",
      iconName: "Cloud",
      color: "from-blue-500/20 to-indigo-600/5",
      border: "border-blue-500/30 hover:border-blue-500/60",
      glow: "shadow-blue-500/10",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      badgeText: "Active Node",
      order: 3,
      visible: true
    }
  ];

  // Filter & sort nodes by order
  const nodes = [...(cmsNodes && cmsNodes.length > 0 ? cmsNodes : defaultNodes)]
    .filter((n) => n.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Cpu;
    let colorClass = "text-purple-400";
    if (iconName === "Layers") colorClass = "text-cyan-400";
    else if (iconName === "Cloud") colorClass = "text-blue-400";
    else if (iconName === "Shield") colorClass = "text-emerald-400";
    return <IconComponent className={cn("w-5 h-5", colorClass)} />;
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-20 relative select-none">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-mono font-bold tracking-widest text-accent-blue uppercase bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">
          Integrated Ecosystem
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight font-serif mt-4">
          Headless Nodes Pipeline
        </h2>
      </div>

      {/* Horizontal Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative items-center">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative group"
            >
              <a
                href={node.link || "/projects"}
                target={node.link?.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={cn(
                  "block p-6 rounded-2xl bg-gradient-to-b border backdrop-blur-xl transition-all duration-300 shadow-xl group",
                  node.color,
                  node.border,
                  node.glow
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-bg-primary/80 border border-white/10 shadow-inner">
                    {getIcon(node.iconName)}
                  </div>
                  <span className={cn("text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", node.badgeColor)}>
                    {node.badgeText || "Active Node"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary tracking-tight group-hover:text-accent-blue transition-colors">
                  {node.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium mt-1">
                  {node.subtitle}
                </p>
              </a>
            </motion.div>

            {/* Connecting Arrow for larger screens */}
            {index < nodes.length - 1 && (
              <div className="hidden md:flex items-center justify-center absolute z-30 pointer-events-none" style={{ left: `${(index + 1) * 25 - 1.5}%`, top: "50%", transform: "translate(-50%, -50%)" }}>
                <div className="w-8 h-8 rounded-full bg-bg-secondary border border-glass-border flex items-center justify-center text-accent-blue shadow-md">
                  <LucideIcons.ArrowRight className="w-4 h-4 animate-pulse" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="text-xs font-mono text-text-muted tracking-wider uppercase font-semibold">
          Seamlessly connected. Built for scale. Secured by design.
        </p>
      </div>
    </section>
  );
}
