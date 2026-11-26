"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { cn } from "@/lib/utils";
import { Shot, textureUrl, useScrollRef, useHandFont, useWork, fourOf } from "./kit";
import { Closing, Cta, ProblemList, StepLine, type Look } from "./sections";

const Walk = dynamic(() => import("./c04-canvas"), { ssr: false });
const FONT = { fontFamily: "var(--font-bricolage), sans-serif" } as React.CSSProperties;
const HEAD = "font-extrabold tracking-[-0.045em]";
const LOOK: Look = { bg: "#f4fbfa", ink: "#0d2b2e", accent: "#0d8a80", onAccent: "#fff", font: FONT, head: HEAD };

/** Concept 4: out of the paperwork, into the light. */
export default function WalkThrough() {
  return (
    <div style={FONT}>
      <Corridor />
      <ProblemList look={{ ...LOOK, bg: "#ffffff" }} title="Where are you stuck?" lead="Pick the door that sounds like yours." />
      <StepLine look={LOOK} title="Five steps, and you are out" />
      <Closing look={{ ...LOOK, bg: "#0d2b2e", ink: "#f4fbfa", accent: "#5fe0cf", onAccent: "#0d2b2e" }} title="The last frame is empty. It is for you." />
    </div>
  );
}

function Corridor() {
  const ref = useRef<HTMLElement>(null);
  const work = fourOf(useWork());
  const gl = useGL(ref, "0px");
  const hand = useHandFont(ref);
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(0);
  const key = work.map(textureUrl).join("|");
  const shots = useMemo(() => (key ? key.split("|") : []), [key]);
  // 0 start, 1 inside, 2 door, 3 to 6 products, 7 the empty frame.
  const progress = useScrollRef(ref, (p) => {
    const z = 2.2 + (-74.5 - 2.2) * p;
    setAt(z > -1.2 ? 0 : z > -18 ? 1 : z > -33 ? 2 : z > -45 ? 3 : z > -55 ? 4 : z > -64 ? 5 : z > -72 ? 6 : 7);
  });
  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);
  const product = at >= 3 && at <= 6 ? work[at - 3] : undefined;
  const bright = at >= 3;

  return (
    <section ref={ref} id="work" className="relative h-[900vh] bg-[#b9b2a6]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
          {gl === "on" && hand && shots.length === 4 && <GLBoundary><Walk progress={progress} shots={shots} onReady={() => setReady(true)} /></GLBoundary>}
        </div>

        <div className={cn("absolute inset-0 flex flex-col items-center justify-center px-5 text-center transition-[opacity,transform] duration-700", at === 0 ? "opacity-100" : "pointer-events-none scale-110 opacity-0")}>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_46%_at_50%_50%,rgba(244,241,235,0.9),rgba(244,241,235,0.5)_55%,transparent_78%)]" />
          <h1 className={cn("relative max-w-5xl text-[clamp(3rem,8.4vw,8.4rem)] leading-[0.92] text-[#22201c]", HEAD)}>There is a way out of the paperwork.</h1>
          <p className="relative mt-6 max-w-xl text-lg font-medium leading-relaxed text-[#22201c]/80 sm:text-xl">Kiwik builds the websites, apps, AI and systems at the other end. Scroll, and walk towards the light.</p>
          <div className="relative mt-8"><Cta look={LOOK}>Start a project</Cta></div>
        </div>

        {[["Orders in one place. Payments in another.", 1], ["And the answer always in somebody else's phone.", 2]].map(([t, i]) => (
          <p key={t as string} aria-hidden={at !== i} className={cn("absolute inset-x-5 top-[16%] mx-auto w-fit max-w-3xl rounded-[22px] bg-[#22201c] px-8 py-5 text-center text-2xl font-bold leading-tight tracking-[-0.02em] text-white transition-[opacity,transform] duration-600 sm:text-4xl", at === i ? "opacity-100" : "translate-y-6 opacity-0")}>{t}</p>
        ))}

        {work.map((w, i) => (
          <div key={`${w.slug}-${i}`} aria-hidden={at !== i + 3} inert={at !== i + 3} className={cn("absolute inset-x-5 bottom-8 mx-auto max-w-[560px] rounded-[28px] bg-white p-7 text-[#0d2b2e] shadow-[0_30px_80px_rgba(13,43,46,0.22)] transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-9 md:bottom-12", i % 2 ? "md:left-12 md:right-auto md:mx-0" : "md:left-auto md:right-12 md:mx-0 md:mr-0", at === i + 3 ? "opacity-100" : "pointer-events-none translate-y-10 opacity-0")}>
            <p className="text-base leading-relaxed opacity-65">{w.note.problem}</p>
            <h2 className={cn("mt-3 text-4xl", HEAD)}>{w.name}</h2>
            <p className="mt-2 text-lg font-medium leading-relaxed">{w.note.built}</p>
            <Link href={`/projects/${w.slug}`} className="mt-4 inline-block text-base font-bold underline decoration-[#0d8a80] decoration-2 underline-offset-[6px]">See {w.name}</Link>
          </div>
        ))}

        <div aria-hidden={at !== 7} inert={at !== 7} className={cn("absolute inset-0 flex flex-col items-center justify-center px-5 pb-[8vh] text-center text-[#0d2b2e] transition-opacity duration-700", at === 7 ? "opacity-100" : "pointer-events-none opacity-0")}>
          <p className={cn("text-[clamp(2.6rem,6.4vw,6.2rem)] leading-[0.95]", HEAD)}>And yours goes here.</p>
          <div className="mt-8"><Cta look={LOOK}>Start a project</Cta></div>
        </div>
        {gl === "off" && product && <Shot work={product} className="absolute inset-x-[10%] top-[14%] h-[50%] rounded-3xl object-cover object-top" />}
        <span aria-hidden="true" className={cn("absolute bottom-0 left-0 h-1.5 transition-colors", bright ? "bg-[#0d8a80]" : "bg-[#22201c]")} style={{ width: `${(at / 7) * 100}%`, transition: "width .6s" }} />
      </div>
    </section>
  );
}
