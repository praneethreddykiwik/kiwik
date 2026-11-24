"use client";

import React, { useId, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteCMS } from "@/stores/site-cms-store";
import type { WorkflowStep } from "@/types/site-cms-types";

// Diagram geometry, in SVG units (1 unit = 1px at desktop size).
const RING = 180;
const NODE = 40;
const ARROW_GAP = 14;
const VIEW = 2 * (RING + NODE + 8);
// Beyond this range the labels no longer fit around a circle.
const MIN_CYCLE = 3;
const MAX_CYCLE = 6;

// Rounded so server and browser print identical numbers (trig results can
// differ in the last digit, which React reports as a hydration mismatch).
const round = (n: number) => Math.round(n * 100) / 100;
const point = (angle: number, radius = RING) => ({
  x: round(radius * Math.cos(angle)),
  y: round(radius * Math.sin(angle)),
});

type Placed = { step: WorkflowStep; angle: number; x: number; y: number };

/** Desktop position of a step's text: just outside its node, facing away from the ring. */
function labelStyle({ angle, x, y }: Placed, centerY: number): React.CSSProperties {
  const gap = NODE + 22;
  const cos = Math.cos(angle);
  if (cos > 0.2) return { left: `calc(50% + ${x + gap}px)`, top: centerY + y, transform: "translateY(-50%)" };
  if (cos < -0.2) return { right: `calc(50% - ${x - gap}px)`, top: centerY + y, transform: "translateY(-50%)" };
  return y < 0
    ? { left: "50%", top: centerY + y - NODE - 16, transform: "translate(-50%, -100%)" }
    : { left: "50%", top: centerY + y + NODE + 16, transform: "translateX(-50%)" };
}

export function HowWeWorkCycle() {
  const { howWeWork } = useSiteCMS();
  const [active, setActive] = useState<number | null>(null);
  const markerId = `hww-arrow-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const steps = [...(howWeWork?.steps || [])]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (steps.length === 0) return null;

  const isCycle = steps.length >= MIN_CYCLE && steps.length <= MAX_CYCLE;
  const turn = (2 * Math.PI) / steps.length;
  const placed: Placed[] = steps.map((step, i) => {
    const angle = -Math.PI / 2 + i * turn;
    return { step, angle, ...point(angle) };
  });

  // Angle hidden behind a node, so each arrow starts and stops clear of it.
  const clear = 2 * Math.asin((NODE + ARROW_GAP) / (2 * RING));
  const arrows = placed.map(({ angle }) => {
    const from = point(angle + clear);
    const to = point(angle + turn - clear);
    return `M ${from.x} ${from.y} A ${RING} ${RING} 0 0 1 ${to.x} ${to.y}`;
  });

  // Room for the top label, plus a bottom one when a node sits at 6 o'clock.
  const centerY = 130 + NODE + RING;
  const hasBottomLabel = placed.some((p) => Math.abs(Math.cos(p.angle)) <= 0.2 && p.y > 0);
  const diagramHeight = centerY + RING + NODE + (hasBottomLabel ? 130 : 20);

  const LoopIcon = LucideIcons.RefreshCw;

  return (
    <section
      id="how-we-work"
      className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto relative z-20 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Workflow className="w-3.5 h-3.5" />
          <span>{howWeWork.badge || "Execution Workflow"}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary tracking-tight">
          {howWeWork.sectionTitle || "How We Work"}
        </h2>
      </div>

      <div
        className={cn("relative mx-auto max-w-[1040px]", isCycle && "lg:h-[var(--diagram-h)]")}
        style={{ "--diagram-h": `${diagramHeight}px` } as React.CSSProperties}
      >
        {isCycle && (
          <div
            className="mx-auto mb-10 w-full max-w-[320px] sm:max-w-[400px] lg:mb-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:max-w-none lg:w-[var(--ring)] lg:top-[var(--ring-top)]"
            style={{ "--ring": `${VIEW}px`, "--ring-top": `${centerY - VIEW / 2}px` } as React.CSSProperties}
          >
            {/* The steps are read from the ordered list below; this is the picture of them. */}
            <svg viewBox={`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`} className="block w-full h-auto" aria-hidden="true">
              <defs>
                <marker id={markerId} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto">
                  <path d="M0 0.5 L9.5 5 L0 9.5 L2.6 5 Z" className="fill-accent-blue" />
                </marker>
              </defs>

              {arrows.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  markerEnd={`url(#${markerId})`}
                  className={cn("stroke-accent-blue transition-opacity duration-300", active === null || active === i ? "opacity-100" : "opacity-40")}
                />
              ))}

              <LoopIcon x={-17} y={-34} width={34} height={34} strokeWidth={1.5} className="text-accent-blue" />
              <text y={26} textAnchor="middle" className="fill-text-secondary font-mono font-bold uppercase" fontSize={13} letterSpacing={1.5}>
                {steps.length} phases
              </text>

              {placed.map(({ step, x, y }, i) => {
                const Icon = step.iconName ? (LucideIcons as any)[step.iconName] : null;
                const on = active === i;
                return (
                  <g key={step.id || i} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                    <circle
                      cx={x}
                      cy={y}
                      r={NODE}
                      strokeWidth={on ? 2 : 1.5}
                      className={cn("fill-bg-secondary transition-colors duration-300", on ? "stroke-accent-blue" : "stroke-accent-blue/40")}
                    />
                    {Icon ? (
                      <Icon x={x - 13} y={y - 13} width={26} height={26} className="text-accent-blue" />
                    ) : (
                      <text x={x} y={y} dy="0.35em" textAnchor="middle" fontSize={22} className="fill-accent-blue font-mono font-bold">
                        {step.step || String(i + 1).padStart(2, "0")}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        <ol className={cn("grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6", isCycle ? "max-w-2xl mx-auto lg:max-w-none lg:block" : "lg:grid-cols-4")}>
          {placed.map((p, i) => {
            const cos = Math.cos(p.angle);
            return (
              <li
                key={p.step.id || i}
                style={isCycle ? labelStyle(p, centerY) : undefined}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "flex gap-3 text-left",
                  // Below lg the list is in normal flow, so the desktop offsets
                  // and transform above have to be neutralised.
                  isCycle && "max-lg:!transform-none lg:absolute lg:block lg:w-[250px]",
                  isCycle && (cos < -0.2 ? "lg:text-right" : cos <= 0.2 && "lg:text-center")
                )}
              >
                <span className={cn("shrink-0 w-8 h-8 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-mono font-bold flex items-center justify-center", isCycle && "lg:hidden")}>
                  {p.step.step || String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-text-secondary">Phase {i + 1}</span>
                  <h3 className={cn("mt-1 text-sm font-mono font-bold uppercase tracking-wider transition-colors", active === i ? "text-accent-blue" : "text-text-primary")}>
                    {p.step.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-text-secondary leading-relaxed font-medium">{p.step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
