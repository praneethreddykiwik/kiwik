"use client";

import React from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { BarChart3, Bot, CalendarCheck, CreditCard, Globe, Lock, Package, Smartphone, ShoppingCart, Truck, Users, Workflow } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { HeroShell, SLOT } from "./hero-shell";
import { PaperLayer } from "./paper-slot";

const ROWS = [
  [["Website", Globe], ["Mobile app", Smartphone], ["AI chatbot", Bot], ["Online store", ShoppingCart], ["Booking system", CalendarCheck]],
  [["Sales dashboard", BarChart3], ["Automation", Workflow], ["Cybersecurity", Lock], ["Payments", CreditCard]],
  [["Stock control", Package], ["Customer portal", Users], ["Delivery app", Truck], ["AI reports", Bot], ["Staff app", Smartphone]],
] as const;

const CSS = `
@keyframes gw-l { to { transform: translateX(-50%) } }
@keyframes gw-r { from { transform: translateX(-50%) } to { transform: translateX(0) } }
@media (prefers-reduced-motion: reduce) { .gw-row { animation: none !important } }
`;

/** Concept 12: what we build, as liquid glass pills drifting over a living colour field. */
export default function GlassWords() {
  return (
    <HeroShell>
      <GlassWordsVisual />
    </HeroShell>
  );
}

/** The moving glass pills on their colour field, as used in the hero and on the home page. */
export function GlassWordsVisual() {
  const dark = useThemeStore((st) => st.mode) === "dark";
  return (
    <>
      <style>{CSS}</style>
      <div className={`${SLOT} overflow-hidden`}>
        {/* Soft colour that fades out well inside the box, so there is never an edge. */}
        <PaperLayer
          key={dark ? "dark" : "light"}
          still={dark ? "radial-gradient(50% 50% at 50% 50%, #1b2a5e 0%, #0a3d3a 50%, transparent 80%)" : "radial-gradient(50% 50% at 50% 50%, #dfe6ff 0%, #d4f3ec 50%, transparent 80%)"}
          className="[mask-image:radial-gradient(ellipse_58%_52%_at_50%_50%,#000_25%,transparent_100%)]"
        >
          <MeshGradient
            colors={dark ? ["#16204f", "#0b4a46", "#2a1f5a", "#000000"] : ["#dfe6ff", "#cdf1e9", "#ffe4d6", "#f4f0ff"]}
            distortion={0.7}
            swirl={0.4}
            speed={0.25}
            style={{ width: "100%", height: "100%" }}
          />
        </PaperLayer>
        <div className="absolute inset-0 flex flex-col justify-center gap-4 sm:gap-7 [perspective:900px]" role="list" aria-label="What Kiwik builds">
          {ROWS.map((row, r) => (
            <div key={r} style={{ transform: `rotateX(${(r - 1) * -10}deg) translateZ(${r === 1 ? 40 : 0}px)` }}>
              <div className="gw-row flex w-max gap-3 sm:gap-5" style={{ animation: `${r % 2 ? "gw-r" : "gw-l"} ${38 + r * 9}s linear infinite` }}>
                {[...row, ...row, ...row, ...row].map(([label, Icon], i) => (
                  <span
                    key={i}
                    role={i < row.length ? "listitem" : undefined}
                    aria-hidden={i >= row.length || undefined}
                    className="flex shrink-0 items-center gap-2 sm:gap-3 rounded-full border border-white/70 bg-white/25 px-4 py-2.5 sm:px-7 sm:py-4 text-sm sm:text-2xl font-semibold text-[#141a3a] dark:text-white dark:border-white/25 dark:bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,.9),inset_0_-8px_20px_rgba(255,255,255,.25),0_16px_40px_-18px_rgba(20,26,58,.45)] backdrop-blur-xl backdrop-saturate-150"
                  >
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
