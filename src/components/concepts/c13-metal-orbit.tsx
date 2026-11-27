"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Bot, BarChart3, Globe, Lock, ShoppingCart, Smartphone, Workflow, CalendarCheck } from "lucide-react";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { HeroShell, SLOT } from "./hero-shell";

const LiquidLogo = dynamic(() => import("@/components/gl/liquid-logo"), { ssr: false });

const ORBIT = [
  ["Digital Flagships", Globe],
  ["Native Apps", Smartphone],
  ["Autonomous Agents", Bot],
  ["Commerce Engines", ShoppingCart],
  ["Live Dashboards", BarChart3],
  ["Workflow Autopilot", Workflow],
  ["Smart Scheduling", CalendarCheck],
  ["Zero-Trust Security", Lock],
] as const;

/** Concept 13: the Kiwik mark in liquid metal, with everything we build circling it. */
export default function MetalOrbit() {
  return (
    <HeroShell>
      <MetalOrbitVisual />
    </HeroShell>
  );
}

/** The liquid metal mark with services circling it, as used in the hero and on the home page. */
export function MetalOrbitVisual({ className = "", glow = true }: { className?: string; glow?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const gl = useGL(mark);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 0;
    let held = false;
    const hold = (e: Event) => {
      held = e.type === "pointerover" && !!(e.target as Element).closest?.("a");
    };
    box.current?.addEventListener("pointerover", hold);
    box.current?.addEventListener("pointerleave", hold);
    let last = performance.now();
    const n = ORBIT.length;
    const draw = (now: number) => {
      if (!still && !held) t += Math.min((now - last) / 1000, 0.05) * 0.06;
      last = now;
      const w = box.current?.clientWidth ?? 1000;
      const h = box.current?.clientHeight ?? 480;
      const rx = Math.min(w * (w < 640 ? 0.3 : 0.42), 640);
      const ry = h * (w < 640 ? 0.4 : 0.3);
      items.current.forEach((el, i) => {
        if (!el) return;
        const a = t * Math.PI * 2 + (i / n) * Math.PI * 2;
        const depth = Math.sin(a); // 1 in front, -1 behind
        // On a phone the ring is small, so the labels grow less as they come forward.
        const s = w < 640 ? 0.78 + (depth + 1) * 0.11 : 0.72 + (depth + 1) * 0.2;
        el.style.transform = `translate3d(-50%,-50%,0) translate3d(${(Math.cos(a) * rx).toFixed(1)}px,${(depth * ry).toFixed(1)}px,0) scale(${s.toFixed(3)})`;
        el.style.opacity = (0.6 + (depth + 1) * 0.2).toFixed(2);
        el.style.zIndex = depth > 0 ? "30" : "5";
        el.style.filter = depth < -0.4 ? `blur(${((-depth - 0.4) * 1.2).toFixed(1)}px)` : "none";
      });
      if (on) raf = requestAnimationFrame(draw);
    };
    // Only moves while on screen.
    let on = false;
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });
    const el = box.current;
    if (el) io.observe(el);
    return () => {
      el?.removeEventListener("pointerover", hold);
      el?.removeEventListener("pointerleave", hold);
      on = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={box} className={className || SLOT}>
        {/* The orbit's path, drawn faintly so the ring reads as one. */}
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[80%] sm:h-[60%] w-[min(84%,1280px)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-text-primary/15" />
        {/* A soft light behind the mark, so the metal has something to reflect. */}
        {glow && <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[70%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,108,255,0.22),rgba(13,138,128,0.12)_45%,transparent_70%)] blur-2xl" />}
        <div ref={mark} className="absolute left-1/2 top-1/2 z-20 h-[40%] sm:h-[62%] aspect-square -translate-x-1/2 -translate-y-1/2">
          {gl === "on" ? (
            <GLBoundary fallback={<img src="/kiwik-mark.svg" alt="" className="h-full w-full object-contain" />}>
              <LiquidLogo />
            </GLBoundary>
          ) : (
            <img src="/kiwik-mark.svg" alt="" className="h-full w-full object-contain p-[12%]" />
          )}
        </div>
        <ul aria-label="What Kiwik builds">
          {ORBIT.map(([label, Icon], i) => (
            <li key={label}>
              <a
                href="/#capabilities"
                ref={(el) => {
                  items.current[i] = el;
                }}
                // Hidden until the first frame places it on the ring.
                style={{ opacity: 0 }}
                className="absolute left-1/2 top-1/2 flex items-center whitespace-nowrap rounded-full border border-glass-border bg-white/80 px-2.5 py-1.5 gap-1.5 sm:gap-2 sm:px-5 sm:py-3 text-[12px] sm:text-lg font-semibold text-[#141a3a] shadow-[0_14px_40px_-16px_rgba(20,26,58,.4)] backdrop-blur-md dark:bg-white/10 dark:text-white will-change-transform transition-[background-color,border-color] hover:border-[#5ee0d0]/60 hover:bg-white dark:hover:bg-white/20"
              >
                <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-[#0d8a80] dark:text-[#5ee0d0]" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
