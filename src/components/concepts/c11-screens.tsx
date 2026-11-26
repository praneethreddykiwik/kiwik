"use client";

import React, { useEffect, useRef } from "react";
import { HeroShell, SLOT } from "./hero-shell";
import { MINI_CSS, MINI_SCREENS } from "./mini-ui";

const PER_LANE = 6;
const SPEED = 0.055;

/** Concept 11: the live ribbon's motion, but every card is a working product screen, not a photo. */
export default function Screens() {
  const box = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = cards.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progress = els.map((_, i) => (Math.floor(i / 2) + (i % 2) * 0.5) / PER_LANE);
    let raf = 0;
    let last = performance.now();
    let on = true;
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const wide = box.current?.clientWidth ?? 1200;
      const reach = Math.min(wide * 0.52, 860);
      els.forEach((el, i) => {
        if (!el) return;
        if (!still) progress[i] = (progress[i] + SPEED * dt) % 1;
        const p = progress[i];
        const side = i % 2 ? 1 : -1;
        const x = side * Math.pow(p, 1.25) * reach;
        const s = 0.2 + Math.pow(p, 1.15) * 1.1;
        const fade = Math.min(p / 0.12, 1) * Math.min((1 - p) / 0.1, 1);
        el.style.transform = `translate3d(-50%,-50%,0) translate3d(${x.toFixed(1)}px,0,0) scale(${s.toFixed(3)}) rotateY(${(side * -p * 28).toFixed(1)}deg)`;
        el.style.opacity = fade.toFixed(2);
        el.style.zIndex = String(10 + Math.floor(p * 100));
      });
      if (on) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });
    if (box.current) io.observe(box.current);
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <HeroShell>
      <style>{MINI_CSS}</style>
      <div ref={box} className={`${SLOT} overflow-hidden [perspective:1400px]`} aria-label="Examples of software Kiwik builds" role="img">
        {MINI_SCREENS.map(({ name, View }, i) => (
          <div
            key={name}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 w-[150px] sm:w-[250px] opacity-0 [transform-style:preserve-3d] will-change-transform"
          >
            <div className="h-[170px] sm:h-[280px] overflow-hidden rounded-[16px] sm:rounded-[20px] border border-black/[0.06] bg-white shadow-[0_20px_50px_-20px_rgba(20,26,58,0.35)]">
              <View />
            </div>
            <div className="mt-2 text-center text-[10px] sm:text-xs font-semibold text-text-secondary">{name}</div>
          </div>
        ))}
      </div>
    </HeroShell>
  );
}
