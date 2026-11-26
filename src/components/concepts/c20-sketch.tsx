"use client";

import React, { useEffect, useRef } from "react";
import { HeroShell, SLOT } from "./hero-shell";

type Mode = "sketch" | "real";

const HAND = { fontFamily: "var(--font-hand), cursive" } as React.CSSProperties;

/** One box of the page: a pencil outline with a note, or the finished thing. */
function Box({ mode, note, className = "", real, children }: { mode: Mode; note: string; className?: string; real: string; children?: React.ReactNode }) {
  if (mode === "sketch")
    return (
      <div className={`relative rounded-lg border-2 border-dashed border-[#3a4fb0]/55 ${className}`}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#3a4fb0" strokeOpacity=".18" strokeWidth="1.5" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="#3a4fb0" strokeOpacity=".18" strokeWidth="1.5" />
        </svg>
        <span className="absolute left-2 top-1 text-[13px] sm:text-xl leading-none text-[#3a4fb0]" style={HAND}>{note}</span>
      </div>
    );
  return <div className={`relative overflow-hidden rounded-lg ${real} ${className}`}>{children}</div>;
}

function Page({ mode }: { mode: Mode }) {
  const s = mode === "sketch";
  return (
    <div className={`flex h-full flex-col gap-2 sm:gap-3 p-3 sm:p-6 text-left ${s ? "bg-[#f4f7ff] [background-image:linear-gradient(#3a4fb012_1px,transparent_1px),linear-gradient(90deg,#3a4fb012_1px,transparent_1px)] [background-size:22px_22px]" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        {s ? <span className="text-sm sm:text-2xl text-[#3a4fb0]" style={HAND}>logo</span> : <span className="font-serif text-sm sm:text-xl font-bold italic text-[#1a2150]">Rose Café</span>}
        <div className="flex gap-2 sm:gap-4">
          {["Menu", "Book", "Visit"].map((x) => (s ? <span key={x} className="text-xs sm:text-lg text-[#3a4fb0]" style={HAND}>{x.toLowerCase()}?</span> : <span key={x} className="text-[10px] sm:text-sm font-semibold text-[#1a2150]/70">{x}</span>))}
        </div>
      </div>
      <div className="grid flex-1 grid-cols-[1.1fr_1fr] gap-2 sm:gap-4">
        <div className="flex flex-col justify-center gap-2 sm:gap-3">
          {s ? (
            <>
              <span className="text-base sm:text-3xl leading-tight text-[#3a4fb0]" style={HAND}>big headline about the food</span>
              <span className="text-xs sm:text-lg text-[#3a4fb0]/80" style={HAND}>one line, why people love it</span>
              <span className="w-fit rounded-full border-2 border-dashed border-[#3a4fb0]/60 px-3 py-0.5 text-xs sm:text-lg text-[#3a4fb0]" style={HAND}>book button!!</span>
            </>
          ) : (
            <>
              <span className="font-serif text-base sm:text-4xl font-semibold leading-tight text-[#1a2150]">Wood-fired, <i>every night</i></span>
              <span className="text-[10px] sm:text-sm text-[#1a2150]/60">Fresh bread, slow coffee, a table by the window.</span>
              <span className="w-fit rounded-full bg-[#0d8a80] px-3 py-1 sm:px-5 sm:py-2 text-[10px] sm:text-sm font-bold text-white">Book a table</span>
            </>
          )}
        </div>
        <Box mode={mode} note="photo of the place" real="bg-[radial-gradient(circle_at_30%_30%,#ffd7c2,#e8a97f_45%,#7a3f2a)]">
          <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] sm:text-xs font-bold text-[#1a2150]">Open till 11pm</div>
        </Box>
      </div>
      <div className="grid h-[26%] grid-cols-3 gap-2 sm:gap-4">
        {[
          ["menu card", "bg-[#fbe7a1]", "Menu"],
          ["reviews", "bg-[#c9e9df]", "4.8 from 1,200"],
          ["map", "bg-[#d9dcff]", "Find us"],
        ].map(([n, c, t]) => (
          <Box key={n} mode={mode} note={n} real={c}>
            <span className="absolute bottom-1.5 left-2 text-[9px] sm:text-sm font-bold text-[#1a2150]">{t}</span>
          </Box>
        ))}
      </div>
    </div>
  );
}

/**
 * Concept 20: a rough sketch, the kind you might draw on a napkin, wiped
 * into the finished software by a passing line of light.
 */
export default function Sketch() {
  const real = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      real.current!.style.clipPath = "inset(0 0 0 50%)";
      bar.current!.style.left = "50%";
      return;
    }
    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      // 0 → 1 → hold → 0, about nine seconds a loop.
      const t = ((now - start) / 1000) % 9;
      const p = t < 3.5 ? ease(t / 3.5) : t < 5.5 ? 1 : t < 8 ? 1 - ease((t - 5.5) / 2.5) : 0;
      // The page may be leaving: one frame can still arrive after the elements are gone.
      if (!real.current || !bar.current) return;
      real.current!.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
      bar.current!.style.left = `${(p * 100).toFixed(2)}%`;
      bar.current!.style.opacity = p > 0.01 && p < 0.99 ? "1" : "0";
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <HeroShell>
      <div className={`${SLOT} flex items-center justify-center px-3`}>
        <div className="relative h-[92%] w-full max-w-[960px] overflow-hidden rounded-2xl border border-black/[0.07] shadow-[0_40px_90px_-40px_rgba(20,26,58,.55)]" role="img" aria-label="A rough sketch of a café website turning into the finished site.">
          <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-white px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 truncate rounded-md bg-[#f3f5fa] px-2 py-0.5 text-[10px] sm:text-xs text-black/50">rosecafe.com</span>
          </div>
          <div className="relative h-[calc(100%-34px)]">
            <div className="absolute inset-0"><Page mode="sketch" /></div>
            <div ref={real} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}><Page mode="real" /></div>
            <div ref={bar} aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#5ee0d0] shadow-[0_0_24px_6px_rgba(94,224,208,.6)]" style={{ left: 0, opacity: 0 }} />
          </div>
        </div>
        <span className="absolute left-[4%] top-[6%] hidden md:block -rotate-6 text-3xl text-[#3a4fb0]" style={HAND}>your idea</span>
        <span className="absolute right-[4%] top-[6%] hidden md:block rotate-3 text-3xl text-[#0d8a80]" style={HAND}>your software</span>
      </div>
    </HeroShell>
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
