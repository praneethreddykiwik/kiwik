"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { cn } from "@/lib/utils";
import { useHandFont, useSendBrief } from "./kit";
import { Closing, ProblemTiles, StepLine, WorkReel, type Look } from "./sections";
import type { PileControl } from "./c10-canvas";

const Pile = dynamic(() => import("./c10-canvas"), { ssr: false });
const FONT = { fontFamily: "var(--font-archivo), sans-serif", fontStretch: "108%" } as React.CSSProperties;
const HEAD = "font-extrabold tracking-[-0.045em]";
const LOOK: Look = { bg: "#ffffff", ink: "#15161c", accent: "#15161c", onAccent: "#ffffff", font: FONT, head: HEAD };
const WEEKS = 48;

const n = (x: number) => Math.round(x).toLocaleString("en-US");

/** Concept 10: the visitor's own lost hours, as a pile of paper. */
export default function Hours() {
  return (
    <div style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
      <Counter />
      <ProblemTiles look={LOOK} title="Where do the hours go?" tile="#f4f2e6" />
      <WorkReel look={{ ...LOOK, bg: "#ffe45c" }} title="Hours other people no longer spend" />
      <StepLine look={LOOK} title="How we get them back" />
      <Closing look={{ ...LOOK, bg: "#15161c", ink: "#ffffff", accent: "#ffe45c", onAccent: "#15161c" }} title="What would you do with the time?" />
    </div>
  );
}

function Counter() {
  const ref = useRef<HTMLDivElement>(null);
  const gl = useGL(ref, "0px");
  const hand = useHandFont(ref);
  const send = useSendBrief();
  const control = useRef<PileControl>({ sheets: 0, kept: 1 });
  const [ready, setReady] = useState(false);
  const [people, setPeople] = useState(4);
  const [hours, setHours] = useState(6);
  const [off, setOff] = useState(0);
  const year = people * hours * WEEKS;
  const back = Math.round((year * off) / 100);

  useEffect(() => {
    control.current.sheets = year;
    control.current.kept = 1 - off / 100;
  }, [year, off]);
  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#ffe45c] text-[#15161c]">
      <div className="mx-auto grid min-h-[100svh] max-w-[1640px] items-center gap-6 px-5 pb-12 pt-28 md:px-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:py-20">
        <div className="relative z-10">
          <h1 style={FONT} className={cn("text-[clamp(2.6rem,4.8vw,5rem)] leading-[0.94]", HEAD)}>This is your year, in paperwork.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed sm:text-xl">Every sheet is one hour spent copying, chasing and typing things twice. Set your numbers.</p>

          <div className="mt-6 max-w-lg space-y-5">
            <Slider label="People doing it" value={people} min={1} max={20} onChange={setPeople} show={`${people}`} />
            <Slider label="Hours a week, each" value={hours} min={1} max={20} onChange={setHours} show={`${hours}`} />
            <Slider label="Suppose software did this much of it" value={off} min={0} max={90} step={5} onChange={setOff} show={`${off}%`} strong />
          </div>

          <div aria-live="polite" className="mt-6">
            <p style={FONT} className={cn("text-[clamp(2.1rem,3.6vw,3.6rem)] leading-none tabular-nums", HEAD)}>{off === 0 ? `${n(year)} hours a year` : `${n(back)} hours back`}</p>
            <p className="mt-2 text-lg font-medium">{off === 0 ? `About ${n(year / 8)} working days, at ${WEEKS} weeks a year.` : `About ${n(back / 8)} working days a year to spend on something else.`}</p>
          </div>
          <button type="button" onClick={() => send(`${people} of us spend about ${hours} hours a week each on paperwork and manual work. We would like to get some of that back.`, "Automation & Workflows")} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#15161c] px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]">Get your hours back <ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div aria-hidden="true" className={cn("relative h-[56svh] min-h-[360px] transition-opacity duration-700 lg:h-[86svh]", ready ? "opacity-100" : "opacity-0")}>
          {gl === "on" && hand && <div className="absolute inset-0 lg:-right-[6%]"><GLBoundary><Pile control={control} onReady={() => setReady(true)} /></GLBoundary></div>}
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, show, strong }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; show: string; strong?: boolean }) {
  const id = `c10-${label.replace(/\W+/g, "-")}`;
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4"><label htmlFor={id} className="text-lg font-bold">{label}</label><span className={cn("text-3xl tabular-nums leading-none", HEAD)}>{show}</span></div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 h-3 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[6px] [&::-moz-range-thumb]:border-[#15161c] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[6px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[#15161c] [&::-webkit-slider-thumb]:bg-white" style={{ background: `linear-gradient(90deg, ${strong ? "#1f5bff" : "#15161c"} ${pct}%, rgba(21,22,28,0.16) ${pct}%)` }} />
    </div>
  );
}
