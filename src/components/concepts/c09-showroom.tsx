"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { LiquidGlass } from "@/components/gl/liquid-glass";
import { useGL } from "@/components/gl/use-gl";
import { cn } from "@/lib/utils";
import { Shot, textureUrl, useHandFont, useWork, fourOf } from "./kit";
import { SCENES } from "./mess";
import { Closing, Cta, ProblemList, StepStack, type Look } from "./sections";
import type { RoomControl } from "./c09-canvas";

const Room = dynamic(() => import("./c09-canvas"), { ssr: false });
const HEAD = "font-semibold tracking-[-0.045em]";
const LOOK: Look = { bg: "#0d1122", ink: "#eef2ff", accent: "#5ee0d0", onAccent: "#08121f", head: HEAD };

/** Concept 9: a ring of screens. Turn round, and turn them over. */
export default function Showroom() {
  return (
    <div>
      <Ring />
      <ProblemList look={{ ...LOOK, bg: "#f3f5fb", ink: "#0d1122", accent: "#1d3fd0", onAccent: "#fff" }} title="Which screen would be yours?" />
      <StepStack look={LOOK} cardInk="#0d1122" title="From the back of the screen to the front" colors={["#c9d4ff", "#bdf0e8", "#ffe6b8", "#ffd3dd", "#dcd3ff"]} />
      <Closing look={{ ...LOOK, bg: "#5ee0d0", ink: "#08121f", accent: "#08121f", onAccent: "#fff" }} title="There is room for one more screen." />
    </div>
  );
}

function Ring() {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const work = fourOf(useWork());
  const reduced = useReducedMotion();
  const gl = useGL(ref, "0px");
  const hand = useHandFont(ref);
  const control = useRef<RoomControl>({ turn: 0, drag: 0, before: true });
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(0);
  const [before, setBefore] = useState(true);
  const held = useRef(false);
  const start = useRef<number | null>(null);
  const key = work.map(textureUrl).join("|");
  const shots = useMemo(() => (key ? key.split("|") : []), [key]);
  const i = ((at % 4) + 4) % 4;
  const now = work[i];
  const scene = now && SCENES.find((s) => s.slug === now.slug);

  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);

  const go = (n: number) => {
    control.current.turn = n;
    setAt(n);
  };
  const face = (b: boolean) => {
    control.current.before = b;
    setBefore(b);
  };

  // Shows the problem, then the product, then turns to the next one.
  useEffect(() => {
    if (!ready || reduced) return;
    let b = true;
    const t = setInterval(() => {
      if (held.current || document.hidden) return;
      if (b) face(false);
      else {
        control.current.turn += 1;
        setAt(control.current.turn);
        face(true);
      }
      b = !b;
    }, 3400);
    return () => clearInterval(t);
  }, [ready, reduced]);

  return (
    <section ref={ref} id="work" className="relative bg-[#0d1122] text-[#eef2ff]">
      <div className="relative h-[100svh] min-h-[680px] overflow-hidden">
        <div
          ref={stage}
          aria-hidden="true"
          className={cn("absolute inset-0 cursor-grab touch-pan-y transition-opacity duration-1000 active:cursor-grabbing", ready ? "opacity-100" : "opacity-0")}
          onPointerDown={(e) => { start.current = e.clientX; held.current = true; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { if (start.current !== null) control.current.drag = ((e.clientX - start.current) / window.innerWidth) * 2.4; }}
          onPointerUp={(e) => {
            if (start.current === null) return;
            const d = e.clientX - start.current;
            start.current = null;
            control.current.drag = 0;
            if (Math.abs(d) > 60) go(control.current.turn + (d > 0 ? 1 : -1));
          }}
          onPointerCancel={() => { start.current = null; control.current.drag = 0; }}
        >
          {gl === "on" && hand && shots.length === 4 && <GLBoundary><Room control={control} shots={shots} onReady={() => setReady(true)} /></GLBoundary>}
        </div>
        {gl === "off" && now && <Shot work={now} className="absolute inset-x-[8%] top-[24%] h-[46%] rounded-3xl object-cover object-top" />}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,17,34,0.96),rgba(13,17,34,0.5)_20%,transparent_34%,transparent_62%,rgba(13,17,34,0.95)_88%)]" />

        <div className="pointer-events-none absolute inset-x-5 top-24 flex flex-col justify-between gap-5 md:inset-x-10 lg:flex-row lg:items-start">
          <div><h1 className={cn("text-[clamp(2.6rem,5vw,5.2rem)] leading-[0.96]", HEAD)}>See it before you believe it.</h1><p className="mt-3 max-w-lg text-lg leading-relaxed text-[#eef2ff]/80">Every screen had a mess behind it. Kiwik built the front.</p></div>
          <div className="pointer-events-auto"><Cta look={LOOK}>Start a project</Cta></div>
        </div>

        <div className="absolute inset-x-5 bottom-8 flex flex-col gap-5 max-md:bottom-20 md:inset-x-10 md:bottom-20 lg:flex-row lg:items-end lg:justify-between">
          <div aria-live="polite" className="min-h-[110px] max-w-2xl">
            <AnimatePresence mode="wait" initial={false}>
              {now && scene && (
                <motion.div key={`${i}${before}`} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <p className={cn("text-[clamp(1.8rem,3vw,3rem)] leading-[1.02]", HEAD, before ? "text-[#eef2ff]/80" : "text-[#5ee0d0]")}>{before ? scene.before : now.name}</p>
                  <p className="mt-3 text-lg leading-relaxed text-[#eef2ff]/85">{before ? "Turn it over to see what we built." : now.note.built} {!before && <Link href={`/projects/${now.slug}`} className="font-bold text-white underline underline-offset-4">See {now.name}</Link>}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3">
            <LiquidGlass behind={stage} base="#151b35" tint={0.1} className="rounded-full"><button type="button" aria-label="Previous screen" onClick={() => { held.current = true; go(at - 1); }} className="flex h-14 w-14 cursor-pointer items-center justify-center"><ChevronLeft className="h-6 w-6" /></button></LiquidGlass>
            <LiquidGlass behind={stage} base="#151b35" tint={0.12} className="rounded-full"><button type="button" onClick={() => { held.current = true; face(!before); }} className="h-14 cursor-pointer px-8 text-lg font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">{before ? "Turn it over" : "Show the problem"}</button></LiquidGlass>
            <LiquidGlass behind={stage} base="#151b35" tint={0.1} className="rounded-full"><button type="button" aria-label="Next screen" onClick={() => { held.current = true; go(at + 1); }} className="flex h-14 w-14 cursor-pointer items-center justify-center"><ChevronRight className="h-6 w-6" /></button></LiquidGlass>
          </div>
        </div>
      </div>
    </section>
  );
}
