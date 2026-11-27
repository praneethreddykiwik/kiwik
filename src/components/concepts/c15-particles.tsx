"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { useThemeStore } from "@/stores/theme-store";
import { HeroShell, SLOT } from "./hero-shell";

const WORDS = ["Digital Flagships", "Native Apps", "AI Agents", "Commerce Engines", "Live Dashboards"];

/** Without WebGL: the words simply take turns. */
function Flat() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full items-center justify-center">
      <span key={i} className="animate-in fade-in text-6xl sm:text-8xl font-serif italic font-semibold text-[#1a2150] dark:text-[#9fb3ff]">{WORDS[i]}</span>
    </div>
  );
}

/** Concept 15: thousands of points that keep re-forming into the next thing we build. */
export default function Particles() {
  return (
    <HeroShell>
      <ParticleVisual />
    </HeroShell>
  );
}

const Canvas = dynamic(() => import("./c15-canvas"), { ssr: false });

/** The particle words, as used in the hero and on the home page. */
export function ParticleVisual() {
  const dark = useThemeStore((s) => s.mode) === "dark";
  const [word, setWord] = useState(0);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Starts well before it scrolls into view, so it is already moving on arrival.
  const gl = useGL(ref, "1200px");
  useEffect(() => {
    void import("./c15-canvas");
  }, []);
  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);
  return (
    <div ref={ref} className={SLOT}>
      {gl === "off" ? (
        <Flat />
      ) : (
        <>
          {/* The first word, still, until the points take over. */}
          <div aria-hidden="true" className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
            <span className="text-6xl sm:text-8xl md:text-[9rem] font-serif italic font-semibold text-[#1a2150]/25 dark:text-[#5ee0d0]/25 whitespace-nowrap">{WORDS[0]}</span>
          </div>
          {gl === "on" && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
              <GLBoundary fallback={<Flat />}>
                <Canvas dark={dark} onWord={setWord} onReady={() => setReady(true)} />
              </GLBoundary>
            </div>
          )}
        </>
      )}
      <p className="sr-only" aria-live="polite">{WORDS[word]}</p>
    </div>
  );
}
