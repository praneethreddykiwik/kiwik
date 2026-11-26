"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { cn } from "@/lib/utils";
import { textureUrl, useScrollRef, useHandFont, useWork, fourOf } from "./kit";
import { Closing, Cta, ProblemTiles, StepStack, type Look } from "./sections";
import type { PeelState } from "./c07-canvas";

const Peel = dynamic(() => import("./c07-canvas"), { ssr: false });
const FONT = { fontFamily: "var(--font-archivo), sans-serif" } as React.CSSProperties;
const HEAD = "font-extrabold tracking-[-0.045em]";
const LOOK: Look = { bg: "#f6f6f2", ink: "#15181c", accent: "#2e7d4f", onAccent: "#fff", font: FONT, head: HEAD };
const SHEETS = ["", "Now the messages.", "Now the bills and the sticky notes.", "And the inbox."];

/** Concept 7: the paperwork peels off and the product is underneath. */
export default function PeelBack() {
  return (
    <div style={FONT}>
      <Sheets />
      <ProblemTiles look={{ ...LOOK, bg: "#ffffff" }} title="Which sheet comes off first?" tile="#eef3ee" />
      <StepStack look={LOOK} title="How we lift it off" colors={["#dff0e5", "#fff3c4", "#ffe1dc", "#e6e1ee", "#dfe5ea"]} />
      <Closing look={{ ...LOOK, bg: "#2e7d4f", ink: "#ffffff", accent: "#ffffff", onAccent: "#1d5335" }} title="There is a better business under yours." />
    </div>
  );
}

function Sheets() {
  const ref = useRef<HTMLElement>(null);
  const work = fourOf(useWork());
  const gl = useGL(ref, "0px");
  const hand = useHandFont(ref);
  const state = useRef<PeelState>({ p: 0, tug: 0 });
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(0);
  const key = work.map(textureUrl).join("|");
  const shots = useMemo(() => (key ? key.split("|") : []), [key]);
  useScrollRef(ref, (p) => {
    // Each sheet peels for a stretch, then rests on what it revealed.
    const f = p * 7.35;
    const i = Math.floor(f);
    const k = f - i;
    state.current.p = Math.min(7, i + Math.min(1, Math.max(0, (k - 0.28) / 0.62)));
    setAt(Math.min(7, Math.floor(f + 0.28)));
  });
  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);
  const product = at % 2 === 1 ? work[(at - 1) / 2] : undefined;

  return (
    <section ref={ref} id="work" className="relative h-[1050vh] bg-[#f6f6f2]">
      <div className="sticky top-0 h-[100svh] overflow-hidden" onPointerEnter={() => (state.current.tug = 0.3)} onPointerLeave={() => (state.current.tug = 0)}>
        <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}>
          {gl === "on" && hand && shots.length === 4 && <GLBoundary><Peel state={state} shots={shots} onReady={() => setReady(true)} /></GLBoundary>}
        </div>

        <div className={cn("absolute bottom-0 left-0 max-w-[860px] bg-[#15181c] px-6 pb-9 pt-8 text-white transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:px-12 md:pb-12 md:pt-11", at === 0 ? "" : "pointer-events-none -translate-x-full")}>
          <h1 className={cn("text-[clamp(2.6rem,5.4vw,5.6rem)] leading-[0.94]", HEAD)}>Your next business is under this spreadsheet.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">Kiwik builds the websites, apps, AI and systems that replace it. Scroll to peel it back.</p>
          <div className="mt-7"><Cta look={{ ...LOOK, accent: "#4cc07f", onAccent: "#0d2415" }}>Start a project</Cta></div>
        </div>

        {SHEETS.map((t, i) => i > 0 && (
          <p key={t} aria-hidden={at !== i * 2} className={cn("absolute bottom-0 left-0 bg-[#15181c] px-6 py-7 text-4xl leading-none text-white transition-transform duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] md:px-12 md:py-9 md:text-6xl", HEAD, at === i * 2 ? "" : "-translate-x-full")}>{t}</p>
        ))}

        {work.map((w, i) => {
          const on = at === i * 2 + 1;
          return (
            <div key={`${w.slug}-${i}`} aria-hidden={!on} inert={!on} className={cn("absolute bottom-0 right-0 max-w-[620px] bg-white px-6 pb-8 pt-7 text-[#15181c] transition-transform delay-200 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-11 md:pb-11 md:pt-9", on ? "" : "pointer-events-none translate-y-full !delay-0")}>
              <p className="text-base leading-relaxed opacity-65">{w.note.problem}</p>
              <h2 className={cn("mt-3 text-5xl md:text-6xl", HEAD)}>{w.name}</h2>
              <p className="mt-3 text-lg font-medium leading-relaxed md:text-xl">{w.note.built}</p>
              <Link href={`/projects/${w.slug}`} className="mt-5 inline-block text-base font-bold underline decoration-[#2e7d4f] decoration-2 underline-offset-[6px]">See {w.name}</Link>
            </div>
          );
        })}
        {gl === "off" && product && <img src={textureUrl(product)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-top" />}
      </div>
    </section>
  );
}
