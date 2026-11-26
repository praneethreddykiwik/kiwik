"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { cn } from "@/lib/utils";
import { Shot, textureUrl, useScrollRef, useHandFont, useWork, fourOf } from "./kit";
import { Closing, Cta, ProblemList, StepLine, type Look } from "./sections";

const Desk = dynamic(() => import("./c08-canvas"), { ssr: false });
const HEAD = "font-bold tracking-[-0.035em]";
const SERIF = { fontFamily: "var(--font-fraunces), serif", fontVariationSettings: '"SOFT" 60' } as React.CSSProperties;
const LOOK: Look = { bg: "#f7f3ea", ink: "#22201c", accent: "#4b59e8", onAccent: "#fff", font: SERIF, head: HEAD };

/** Concept 8: the desk is cleared and the laptop opens. */
export default function ClearTheDesk() {
  return (
    <div>
      <Desktop />
      <ProblemList look={{ ...LOOK, bg: "#ffffff" }} title="What is on top of your pile?" />
      <StepLine look={LOOK} title="How we clear it together" />
      <Closing look={{ ...LOOK, bg: "#22201c", ink: "#f7f3ea", accent: "#8f9bff", onAccent: "#15131f" }} title="Imagine the desk empty." text="Tell us what is on it, and we will start there." />
    </div>
  );
}

function Desktop() {
  const ref = useRef<HTMLElement>(null);
  const work = fourOf(useWork());
  const gl = useGL(ref, "0px");
  const hand = useHandFont(ref);
  const progress = useRef(0);
  const index = useRef(0);
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(-1);
  const key = work.map(textureUrl).join("|");
  const shots = useMemo(() => (key ? key.split("|") : []), [key]);
  useScrollRef(ref, (p) => {
    // The first part clears the desk, the rest moves through the work.
    progress.current = Math.min(1, p / 0.42);
    const k = p < 0.36 ? -1 : Math.min(3, Math.floor((p - 0.36) / 0.16));
    index.current = Math.max(0, k);
    setAt(p < 0.07 ? -2 : k);
  });
  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);

  return (
    <section ref={ref} id="work" className="relative h-[760vh] bg-[#e2d8c7] text-[#22201c]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
          {gl === "on" && hand && shots.length === 4 && <GLBoundary><Desk progress={progress} index={index} shots={shots} onReady={() => setReady(true)} /></GLBoundary>}
        </div>

        <div className={cn("absolute inset-0 flex flex-col items-center justify-center px-5 text-center transition-[opacity,transform] duration-500", at === -2 ? "opacity-100" : "pointer-events-none -translate-y-10 opacity-0")}>
          <div className="rounded-[40px] bg-[#f7f3ea]/95 px-7 py-9 shadow-[0_40px_90px_-20px_rgba(60,48,24,0.45)] sm:px-12 sm:py-10">
            <h1 style={SERIF} className={cn("max-w-[9ch] text-[clamp(2.8rem,5.4vw,5.4rem)] leading-[0.94]", HEAD)}>Let us clear your desk.</h1>
            <p className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-[#22201c]/80 sm:text-xl">Kiwik turns the paper, the messages and the sheets into one piece of software. Scroll to see it go.</p>
            <div className="mt-7 flex justify-center"><Cta look={LOOK}>Start a project</Cta></div>
          </div>
        </div>

        {work.map((w, i) => (
          <div key={`${w.slug}-${i}`} aria-hidden={at !== i} inert={at !== i} className={cn("absolute inset-x-5 bottom-8 max-w-[560px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:inset-x-10 lg:bottom-auto lg:right-12 lg:left-auto lg:top-1/2 lg:w-[34%] lg:-translate-y-1/2", at === i ? "opacity-100" : "pointer-events-none translate-y-8 opacity-0 lg:translate-y-[-35%]")}>
            <p className="text-lg leading-relaxed text-[#22201c]/70">{w.note.problem}</p>
            <h2 style={SERIF} className={cn("mt-3 text-[clamp(2.8rem,4.6vw,4.8rem)] leading-[0.96]", HEAD)}>{w.name}</h2>
            <p className="mt-4 text-lg font-medium leading-relaxed sm:text-xl">{w.note.built}</p>
            <Link href={`/projects/${w.slug}`} className="mt-5 inline-block text-base font-bold underline decoration-[#4b59e8] decoration-2 underline-offset-[6px]">See {w.name}</Link>
          </div>
        ))}
        {gl === "off" && work[Math.max(0, at)] && <Shot work={work[Math.max(0, at)]} className="absolute left-[6%] top-[18%] h-[52%] w-[52%] rounded-3xl object-cover object-top" />}
      </div>
    </section>
  );
}
