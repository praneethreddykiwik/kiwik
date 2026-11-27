"use client";

import React, { useEffect, useRef, useState } from "react";
import { Metaballs } from "@paper-design/shaders-react";
import { FileSpreadsheet, Mail, MessageCircle, Receipt, ShoppingCart, BarChart3, CheckCircle2, Package, Send } from "lucide-react";
import { HeroShell, SLOT } from "./hero-shell";
import { PaperLayer } from "./paper-slot";

const IN = [
  ["Customer emails", Mail],
  ["WhatsApp chats", MessageCircle],
  ["New orders", ShoppingCart],
  ["Spreadsheets", FileSpreadsheet],
  ["Supplier invoices", Receipt],
] as const;

const OUT = [
  ["Replies drafted", Send],
  ["Inventory synced live", Package],
  ["Payments chased", CheckCircle2],
  ["Insights in your inbox", BarChart3],
] as const;

const W = 1000;
const H = 440;
const CX = W / 2;
const CY = H / 2;
const ys = (n: number) => Array.from({ length: n }, (_, i) => 50 + (i * (H - 100)) / (n - 1));
const inY = ys(IN.length);
const outY = ys(OUT.length);
const inPath = (y: number) => `M 210 ${y} C 340 ${y}, 360 ${CY}, ${CX - 70} ${CY}`;
const outPath = (y: number) => `M ${CX + 70} ${CY} C ${W - 360} ${CY}, ${W - 340} ${y}, ${W - 210} ${y}`;

const Chip = ({ label, Icon, x, y, side }: { label: string; Icon: React.ComponentType<{ className?: string }>; x: number; y: number; side: "in" | "out" }) => (
  <div
    className={`absolute flex -translate-y-1/2 items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold shadow-[0_12px_30px_-16px_rgba(20,26,58,.4)] ${
      side === "in" ? "-translate-x-full border-glass-border bg-white/85 text-[#141a3a] dark:bg-white/10 dark:text-white" : "border-transparent bg-[#1a2150] text-white dark:bg-white dark:text-[#10142e]"
    }`}
    style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
  >
    <Icon className="h-4 w-4" />
    {label}
  </div>
);

/**
 * Concept 19: what "AI for your business" actually means. The everyday mess
 * flows in on the left, through one system we build, and comes out done.
 */
export default function Flow() {
  return (
    <HeroShell>
      <FlowVisual />
    </HeroShell>
  );
}

/** The in, through, out diagram, as used in the hero and on the home page. */
export function FlowVisual() {
  // Drawn at one fixed size and scaled to fit, so phones get the same picture.
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1.15, e.contentRect.width / W, e.contentRect.height / H)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <>
      <PhoneFlow />
      <div ref={box} className={`${SLOT} max-sm:hidden flex items-center justify-center overflow-hidden`}>
        <div className="relative shrink-0" style={{ width: W, height: H, transform: `scale(${scale})` }} role="img" aria-label="Customer emails, WhatsApp chats, new orders, spreadsheets and supplier invoices go into one system Kiwik builds, and come out as written replies, up-to-date stock, followed-up payments and reports in your inbox.">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            {inY.map((y, i) => (
              <g key={`i${i}`}>
                <path d={inPath(y)} fill="none" stroke="currentColor" className="text-text-primary/15" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle r="4" className="fill-[#5b6cff]">
                  <animateMotion dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" path={inPath(y)} begin={`${i * 0.4}s`} />
                </circle>
              </g>
            ))}
            {outY.map((y, i) => (
              <g key={`o${i}`}>
                <path d={outPath(y)} fill="none" stroke="currentColor" className="text-[#0d8a80]/40" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle r="4" className="fill-[#0d8a80]">
                  <animateMotion dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" path={outPath(y)} begin={`${0.6 + i * 0.35}s`} />
                </circle>
              </g>
            ))}
          </svg>
          {IN.map(([l, I], i) => <Chip key={l} label={l} Icon={I} x={205} y={inY[i]} side="in" />)}
          {OUT.map(([l, I], i) => <Chip key={l} label={l} Icon={I} x={W - 205} y={outY[i]} side="out" />)}
          <div className="absolute left-1/2 top-1/2 h-[46%] aspect-square -translate-x-1/2 -translate-y-1/2">
            <Core />
          </div>
        </div>
      </div>
    </>
  );
}

/** On a phone: the same story top to bottom. */
function PhoneFlow() {
  const row = "flex flex-wrap justify-center gap-1.5";
  const chip = "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold";
  return (
    <div className="sm:hidden flex flex-col items-center gap-3 py-4" aria-label="Customer emails, WhatsApp chats, new orders, spreadsheets and supplier invoices go into one system Kiwik builds, and come out as written replies, up-to-date stock, followed-up payments and reports in your inbox." role="img">
      <div className={row}>{IN.map(([l, I]) => <span key={l} className={`${chip} border border-glass-border bg-white/85 text-[#141a3a] dark:bg-white/10 dark:text-white`}><I className="h-3.5 w-3.5" />{l}</span>)}</div>
      <div className="h-6 w-px bg-gradient-to-b from-[#5b6cff]/0 to-[#5b6cff]" />
      <div className="relative h-28 w-28"><Core /></div>
      <div className="h-6 w-px bg-gradient-to-b from-[#0d8a80] to-[#0d8a80]/0" />
      <div className={row}>{OUT.map(([l, I]) => <span key={l} className={`${chip} bg-[#1a2150] text-white dark:bg-white dark:text-[#10142e]`}><I className="h-3.5 w-3.5" />{l}</span>)}</div>
    </div>
  );
}

const CORE_CSS = `
@keyframes core-spin { to { transform: rotate(1turn) } }
@keyframes core-pulse { 0% { transform: scale(.85); opacity: .55 } 100% { transform: scale(1.55); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .core-move { animation: none !important } }
`;

/** The system in the middle: a turning ring of light, pulses going out, living colour inside and the Kiwik mark. */
function Core() {
  return (
    <div className="relative h-full w-full">
      <style>{CORE_CSS}</style>
      {[0, 1.3].map((d) => (
        <span key={d} aria-hidden="true" className="core-move absolute inset-0 rounded-full border border-[#5ee0d0]/50" style={{ animation: `core-pulse 2.6s ${d}s cubic-bezier(.2,.6,.3,1) infinite` }} />
      ))}
      <span aria-hidden="true" className="core-move absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#5b6cff,#5ee0d0,#c7d2ff,transparent_70%,#5b6cff)] shadow-[0_0_70px_-6px_rgba(91,108,255,.75)]" style={{ animation: "core-spin 6s linear infinite" }} />
      <div className="absolute inset-[3px] overflow-hidden rounded-full bg-[#0b0e24]">
        <PaperLayer still="radial-gradient(circle at 40% 40%, #5b6cff, #0d8a80 60%, #0b0e24)">
          <Metaballs colors={["#5b6cff", "#5ee0d0", "#c7d2ff"]} colorBack="#0b0e24" count={10} size={0.85} speed={0.9} style={{ width: "100%", height: "100%" }} />
        </PaperLayer>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(11,14,36,.65)_75%)]" />
        <img src="/kiwik-mark.svg" alt="" className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 brightness-0 invert drop-shadow-[0_4px_18px_rgba(0,0,0,.55)]" />
      </div>
    </div>
  );
}
