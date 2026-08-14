"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Cpu, Cloud, CreditCard, Layers, Activity, Play, StopCircle, Terminal, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorialProductPanelProps {
  id: string;
  slug: string;
  name: string;
  status: string;
  category: string;
  tagline: string;
  ctaText: string;
  layoutVariant: "orb" | "telemetry" | "browser" | "terminal";
  glowColor: string; // e.g. "rgba(168,85,247,0.08)"
  accentText: string;
}

export function EditorialProductPanel({
  slug,
  name,
  status,
  category,
  tagline,
  ctaText,
  layoutVariant,
  glowColor,
  accentText,
}: EditorialProductPanelProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // 3D Spring Tilt physics (Max 4 deg as specified)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 220 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Link href={`/projects/${slug}`} className="block h-full group outline-none select-none">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-[540px] sm:h-[600px] rounded-[28px] bg-[#0C0D12] dark:bg-[#09090D] border border-black/10 dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.6)] transition-all duration-500 transform-gpu group-hover:-translate-y-2 group-hover:scale-[1.01]"
      >
        {/* Soft Category Ambient Backlight Glow (6% opacity) */}
        <div
          className="absolute -inset-10 opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl"
          style={{ background: glowColor }}
        />

        {/* Cursor Mouse Light Spotlight (5% radial opacity) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.06), transparent 80%)`,
          }}
        />

        {/* ─────────────────────────────────────────────────────────────
            70% CINEMATIC PRODUCT VISUAL (Obsidian Editorial Style)
           ───────────────────────────────────────────────────────────── */}
        <div className="relative w-full h-[68%] rounded-2xl bg-[#12131C] dark:bg-[#0A0B10] border border-black/10 dark:border-white/10 overflow-hidden flex items-center justify-center p-4 shadow-inner group-hover:scale-[1.015] transition-transform duration-700">
          
          {/* Background Metallic Shader Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />

          {/* ── VARIANT A: 3D Glowing Organic Neural Orb + Waveform (Kiwik AI) ── */}
          {layoutVariant === "orb" && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Glowing Orb Sphere */}
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-600 opacity-80 blur-xl animate-pulse" />
              <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-[0_0_80px_rgba(245,158,11,0.6)] group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Cpu className="w-10 h-10 text-amber-300" />
                </div>
              </div>

              {/* Glass Audio Recording Bar Overlay */}
              <div className="absolute bottom-6 left-6 right-6 px-4 py-3 rounded-2xl bg-black/60 dark:bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-white/80 font-semibold">02:04 Recording meeting</span>
                  <div className="flex items-end gap-1 h-4">
                    {[40, 70, 45, 90, 60, 100, 75, 50, 85, 40].map((h, i) => (
                      <div key={i} className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-mono text-white font-bold">
                  <StopCircle className="w-3 h-3 text-rose-400" />
                  <span>Stop</span>
                </div>
              </div>
            </div>
          )}

          {/* ── VARIANT B: Dark Monolith + Financial Telemetry Glass Chart (Kiwik Cloud) ── */}
          {layoutVariant === "telemetry" && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Background 3D Rock/Monolith texture */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-neutral-900 to-slate-950 opacity-90" />
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-br from-blue-600/30 to-indigo-900/40 border border-blue-500/20 rotate-12 blur-sm" />

              {/* Glass Chart Overlay Panel */}
              <div className="relative z-10 w-[90%] p-5 rounded-2xl bg-black/70 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/60">Return by fund</span>
                  <span className="text-white/40">Closed: Jan 7, 08:11 EST</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">18.5%</div>
                
                {/* SVG Telemetry Line Chart */}
                <div className="h-14 w-full pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                    <path
                      d="M 0 30 Q 30 10, 60 25 T 120 15 T 180 5 L 200 2"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono text-white/70">
                  <div>Positions<br /><span className="text-white font-bold">SPX</span></div>
                  <div>Current<br /><span className="text-white font-bold">45.0%</span></div>
                  <div>Target<br /><span className="text-white font-bold">50.0%</span></div>
                  <div>Trade size<br /><span className="text-emerald-400 font-bold">+5%</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ── VARIANT C: Encrypted Billing Glass Frame (Kiwik Secure) ── */}
          {layoutVariant === "browser" && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div className="w-full h-full p-4 rounded-xl bg-[#090A0F] border border-white/15 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">kiwik-secure.enc</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase">Total Settled</span>
                    <h4 className="text-xl font-bold font-mono text-white">$1,420,890.00</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">● Active Settlement</span>
                </div>

                <div className="flex items-end gap-1.5 h-16 pt-2">
                  {[45, 65, 80, 50, 95, 110, 85, 70, 120, 140, 90, 105, 130, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-emerald-600/30 to-emerald-400 rounded-t-sm" style={{ height: `${(h / 140) * 100}%` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── VARIANT D: Raycast Command Terminal (Kiwik) ── */}
          {layoutVariant === "terminal" && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div className="w-full h-full p-4 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-xs text-white/80 flex flex-col justify-between">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-white/40 text-[10px]">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span>kiwik-cli --pipeline-status</span>
                </div>
                <div className="space-y-1.5 text-[11px] my-auto">
                  <p className="text-emerald-400">✓ 47 Nodes active in cluster [us-east-1]</p>
                  <p className="text-sky-300">⚡ Edge latency stable at 14ms</p>
                  <p className="text-white/60">→ Deploying build v2.4.0 to production...</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-white/40">STATUS: ALL PIPELINES GREEN</span>
                  <span className="text-emerald-400 font-bold">99.98% UPTIME</span>
                </div>
              </div>
            </div>
          )}

          {/* Glass Top Specular Edge Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-white/5 opacity-60 pointer-events-none" />
        </div>

        {/* ─────────────────────────────────────────────────────────────
            30% EDITORIAL TEXT CONTENT (Matching Obsidian Reference)
           ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 pt-4 space-y-2">
          
          {/* Eyebrow Status Chip */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 dark:text-emerald-400">
              ● {status.toUpperCase()}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
              {category}
            </span>
          </div>

          {/* Large Editorial Serif Title (32px-40px Canela style) */}
          <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
            {name}
          </h3>

          {/* Description Paragraph */}
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans line-clamp-2 max-w-md">
            {tagline}
          </p>

          {/* CTA Link with Sliding Arrow */}
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>

        </div>
      </motion.div>
    </Link>
  );
}
