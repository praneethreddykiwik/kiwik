"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { PROCESS_BADGE } from "@/data/home-content";
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

// Entrance: each phase starts this long after the previous one (seconds).
const STAGGER = 0.28;
// Loop: time for the dot to travel one arrow, and the rest on each phase.
const TRAVEL = 1.5;
const DWELL = 0.7;
const EASE = [0.16, 1, 0.3, 1] as const;

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
  const diagramRef = useRef<HTMLDivElement>(null);
  const entered = useInView(diagramRef, { once: true, amount: 0.2 });
  const onScreen = useInView(diagramRef, { amount: 0.15 });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [auto, setAuto] = useState<number | null>(null);

  // Where the travelling dot is on the ring. Motion values, so a frame of the
  // animation moves one SVG circle instead of re-rendering the section.
  const dotAngle = useMotionValue(0);
  const dotX = useTransform(dotAngle, (a) => RING * Math.cos(a));
  const dotY = useTransform(dotAngle, (a) => RING * Math.sin(a));

  const steps = [...(howWeWork?.steps || [])]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const count = steps.length;
  const current = hovered ?? (reduced ? null : auto);
  // A phase can be removed in the studio while the loop is on it.
  const active = current !== null && current < count ? current : null;
  const isCycle = count >= MIN_CYCLE && count <= MAX_CYCLE;
  const turn = (2 * Math.PI) / Math.max(count, 1);
  // Angle hidden behind a node, so each arrow starts and stops clear of it.
  const clear = 2 * Math.asin((NODE + ARROW_GAP) / (2 * RING));

  // Advance one phase at a time while visible; hovering holds it in place.
  useEffect(() => {
    if (!isCycle || reduced || !entered || !onScreen || hovered !== null) return;
    const delay = auto === null ? count * STAGGER + 0.9 : TRAVEL + DWELL;
    const t = setTimeout(() => setAuto((i) => (i === null ? 0 : (i + 1) % count)), delay * 1000);
    return () => clearTimeout(t);
  }, [isCycle, reduced, entered, onScreen, hovered, auto, count]);

  useEffect(() => {
    if (active === null || reduced || !onScreen) return;
    const start = -Math.PI / 2 + active * turn;
    dotAngle.set(start + clear);
    const run = animate(dotAngle, start + turn - clear, { duration: TRAVEL, ease: "easeInOut" });
    return () => run.stop();
  }, [active, reduced, onScreen, turn, clear, dotAngle]);

  const timing = <T extends object>(t: T) => (reduced ? { duration: 0 } : t);

  const enter = (i: number) => () => setHovered(i);
  const leave = (i: number) => () => {
    setHovered(null);
    setAuto(i); // carry on from the phase that was being read
  };

  if (count === 0) return null;

  const placed: Placed[] = steps.map((step, i) => {
    const angle = -Math.PI / 2 + i * turn;
    return { step, angle, ...point(angle) };
  });

  const arrows = placed.map(({ angle }) => {
    const from = point(angle + clear);
    const end = angle + turn - clear;
    const to = point(end);
    return {
      d: `M ${from.x} ${from.y} A ${RING} ${RING} 0 0 1 ${to.x} ${to.y}`,
      // Drawn separately from the line: an SVG marker would show at full
      // opacity from the start, before the line has reached it.
      head: `translate(${to.x} ${to.y}) rotate(${round((end * 180) / Math.PI + 87)})`,
    };
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
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.08] text-text-primary">
          {howWeWork.sectionTitle || "How we work"}
        </h2>
        <p className="mt-4 text-lg text-text-secondary">{howWeWork.badge || PROCESS_BADGE}</p>
      </div>

      <div
        ref={diagramRef}
        className={cn("relative mx-auto max-w-[1040px]", isCycle && "lg:h-[var(--diagram-h)]")}
        style={{ "--diagram-h": `${diagramHeight}px` } as React.CSSProperties}
      >
        {isCycle && (
          <div
            className="mx-auto mb-10 w-full max-w-[320px] sm:max-w-[400px] lg:mb-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:max-w-none lg:w-[var(--ring)] lg:top-[var(--ring-top)]"
            style={{ "--ring": `${VIEW}px`, "--ring-top": `${centerY - VIEW / 2}px` } as React.CSSProperties}
          >
            {/* The steps are read from the ordered list below; this is the picture of them. */}
            <svg viewBox={`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`} className="block w-full h-auto overflow-visible" aria-hidden="true">
              {arrows.map(({ d, head }, i) => {
                const at = i * STAGGER + 0.25;
                return (
                  <g key={i} className={cn("transition-opacity duration-500", active === null ? "opacity-100" : "opacity-40")}>
                    <motion.path
                      d={d}
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      className="stroke-[#0a8f8b]"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={entered ? { pathLength: 1, opacity: 1 } : undefined}
                      transition={timing({ pathLength: { duration: 0.6, delay: at, ease: "easeInOut" as const }, opacity: { duration: 0.01, delay: at } })}
                    />
                    <g transform={head}>
                      <motion.path
                        data-arrow-head=""
                        d="M-8 -6.5 L5 0 L-8 6.5 L-4.5 0 Z"
                        className="fill-[#0a8f8b]"
                        initial={{ opacity: 0 }}
                        animate={entered ? { opacity: 1 } : undefined}
                        transition={timing({ duration: 0.2, delay: at + 0.5 })}
                      />
                    </g>
                  </g>
                );
              })}

              {/* The arrow being travelled, lit up behind the dot. */}
              {active !== null && (
                <g key={`lit-${active}`}>
                  <motion.path
                    d={arrows[active].d}
                    fill="none"
                    strokeWidth={3}
                    strokeLinecap="round"
                    className="stroke-[#0a8f8b]"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: TRAVEL, ease: "easeInOut" }}
                  />
                  <g transform={arrows[active].head}>
                    <motion.path
                      d="M-8 -6.5 L5 0 L-8 6.5 L-4.5 0 Z"
                      className="fill-[#0a8f8b]"
                      initial={{ opacity: reduced ? 1 : 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: reduced ? 0 : TRAVEL * 0.85 }}
                    />
                  </g>
                </g>
              )}

              {active !== null && !reduced && (
                <g>
                  <motion.circle cx={dotX} cy={dotY} r={11} className="fill-[#0a8f8b]/25" />
                  <motion.circle data-dot="" cx={dotX} cy={dotY} r={5} className="fill-[#0a8f8b]" />
                </g>
              )}

              <g className="motion-safe:animate-[spin_14s_linear_infinite]" style={{ transformBox: "fill-box", transformOrigin: "center", animationPlayState: onScreen ? "running" : "paused" }}>
                <LoopIcon x={-17} y={-40} width={34} height={34} strokeWidth={1.5} className="text-[#0a8f8b]" />
              </g>
              <AnimatePresence mode="wait" initial={false}>
                <motion.g
                  key={active ?? "idle"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                >
                  {active === null ? (
                    <text y={26} textAnchor="middle" className="fill-text-secondary font-semibold" fontSize={15}>
                      {count} steps
                    </text>
                  ) : (
                    <>
                      <text y={24} textAnchor="middle" className="fill-text-primary font-bold" fontSize={21}>
                        {steps[active].title}
                      </text>
                      <text y={46} textAnchor="middle" className="fill-text-secondary font-medium" fontSize={14}>
                        Step {active + 1} of {count}
                      </text>
                    </>
                  )}
                </motion.g>
              </AnimatePresence>

              {placed.map(({ step, x, y }, i) => {
                const Icon = step.iconName ? (LucideIcons as any)[step.iconName] : null;
                const on = active === i;
                return (
                  <motion.g
                    key={step.id || i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={entered ? { scale: 1, opacity: 1 } : undefined}
                    transition={timing({ type: "spring" as const, stiffness: 260, damping: 18, delay: i * STAGGER })}
                    onMouseEnter={enter(i)}
                    onMouseLeave={leave(i)}
                  >
                    {on && !reduced && (
                      <motion.circle
                        cx={x}
                        cy={y}
                        fill="none"
                        strokeWidth={2}
                        className="stroke-[#0a8f8b]"
                        initial={{ r: NODE, opacity: 0.7 }}
                        animate={{ r: NODE + 18, opacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                      />
                    )}
                    <g
                      className="transition-transform duration-500 ease-out"
                      style={{ transformBox: "fill-box", transformOrigin: "center", transform: on && !reduced ? "scale(1.1)" : "scale(1)" }}
                    >
                      <circle
                        data-node=""
                        cx={x}
                        cy={y}
                        r={NODE}
                        strokeWidth={on ? 2.5 : 1.5}
                        className={cn("fill-bg-secondary transition-colors duration-500", on ? "stroke-[#0a8f8b]" : "stroke-[#0a8f8b]/40")}
                      />
                      <circle cx={x} cy={y} r={NODE} className={cn("fill-[#0a8f8b] transition-opacity duration-500", on ? "opacity-15" : "opacity-0")} />
                      {Icon ? (
                        <Icon x={x - 13} y={y - 13} width={26} height={26} className="text-[#0a8f8b]" />
                      ) : (
                        <text x={x} y={y} dy="0.35em" textAnchor="middle" fontSize={22} className="fill-[#0a8f8b] font-bold">
                          {step.step || String(i + 1).padStart(2, "0")}
                        </text>
                      )}
                    </g>
                  </motion.g>
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
                onMouseEnter={enter(i)}
                onMouseLeave={leave(i)}
                className={cn(
                  "flex gap-3 text-left",
                  // Below lg the list is in normal flow, so the desktop offsets
                  // and transform above have to be neutralised.
                  isCycle && "max-lg:!transform-none lg:absolute lg:block lg:w-[250px]",
                  isCycle && (cos < -0.2 ? "lg:text-right" : cos <= 0.2 && "lg:text-center")
                )}
              >
                <span className={cn("shrink-0 w-8 h-8 rounded-xl bg-[#0a8f8b]/10 border border-[#0a8f8b]/20 text-[#0a8f8b] text-xs font-mono font-bold flex items-center justify-center", isCycle && "lg:hidden")}>
                  {p.step.step || String(i + 1).padStart(2, "0")}
                </span>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={entered ? { opacity: 1, y: 0 } : undefined}
                  transition={timing({ duration: 0.6, delay: i * STAGGER + 0.15, ease: EASE })}
                >
                                    <h3 className={cn("text-xl font-bold transition-colors duration-500", active === i ? "text-[#0a8f8b]" : "text-text-primary")}>
                    {p.step.title}
                  </h3>
                  <p className={cn("mt-1 text-base leading-relaxed transition-colors duration-500", active === i ? "text-text-primary" : "text-text-secondary")}>{p.step.desc}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
