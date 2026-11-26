"use client";

import React, { useEffect, useState } from "react";
import { PulsingBorder } from "@paper-design/shaders-react";
import { ArrowUp, Check, Sparkles } from "lucide-react";
import { HeroShell, SLOT } from "./hero-shell";
import { PaperLayer } from "./paper-slot";
import Link from "next/link";

const TALKS = [
  { ask: "Customers keep calling to book tables. Can they book online?", plan: ["Booking page on your website", "SMS confirmation and reminders", "Your daily list on one screen"] },
  { ask: "We answer the same 50 questions on WhatsApp every day.", plan: ["AI assistant trained on your answers", "Hands hard ones to your team", "Works at 3am too"] },
  { ask: "Our stock lives in five spreadsheets and nobody trusts them.", plan: ["One stock system for every shop", "Alerts before something runs out", "Reports you can open on a phone"] },
];

/**
 * Concept 17: a conversation, the way a project really starts with us. A
 * client describes the problem and the plan writes itself underneath.
 */
export default function Ask() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"type" | "plan">("type");
  const talk = TALKS[i];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(talk.ask.length);
      setPhase("plan");
      return;
    }
    if (phase === "type") {
      if (typed < talk.ask.length) {
        const id = setTimeout(() => setTyped((t) => t + 1), 32);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase("plan"), 500);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setI((x) => (x + 1) % TALKS.length);
      setTyped(0);
      setPhase("type");
    }, 5200);
    return () => clearTimeout(id);
  }, [typed, phase, talk.ask.length]);

  return (
    <HeroShell>
      <div className={`${SLOT} flex items-center justify-center px-4`}>
        <div className="relative w-full max-w-[680px]">
          <PaperLayer still="transparent" className="-inset-6 sm:-inset-10 pointer-events-none">
            <PulsingBorder
              colors={["#5b6cff", "#5ee0d0", "#c7d2ff", "#1a2150"]}
              colorBack="#00000000"
              roundness={0.18}
              thickness={0.04}
              softness={0.75}
              intensity={0.35}
              bloom={0.4}
              spots={4}
              spotSize={0.45}
              pulse={0.25}
              smoke={0.35}
              smokeSize={0.6}
              speed={phase === "type" ? 1.2 : 0.6}
              style={{ width: "100%", height: "100%" }}
            />
          </PaperLayer>
          <div className="relative rounded-[28px] border border-glass-border bg-white/90 dark:bg-[#0f1430]/90 p-4 sm:p-7 text-left shadow-[0_30px_80px_-30px_rgba(20,26,58,.45)] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-secondary"><Sparkles className="h-4 w-4 text-[#5b6cff]" /> Tell Kiwik the problem</div>
            <div className="mt-3 min-h-[3.2em] text-base sm:text-2xl font-serif font-medium leading-snug text-text-primary">
              {talk.ask.slice(0, typed)}
              {phase === "type" && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-[#5b6cff]" />}
            </div>
            <ul className="mt-4 sm:mt-6 grid gap-2 sm:gap-2.5" aria-live="polite">
              {talk.plan.map((p, k) => (
                <li
                  key={p}
                  className="flex items-center gap-2.5 text-sm sm:text-base text-text-primary transition-all duration-500"
                  style={{ opacity: phase === "plan" ? 1 : 0, transform: phase === "plan" ? "none" : "translateY(6px)", transitionDelay: `${k * 180}ms` }}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0d8a80] text-white"><Check className="h-3 w-3" /></span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-4 sm:mt-6 flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold text-[#0d8a80] dark:text-[#5ee0d0] transition-opacity duration-500" style={{ opacity: phase === "plan" ? 1 : 0, transitionDelay: "600ms" }}>Example of a first plan</span>
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-full bg-[#1a2150] dark:bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-white dark:text-[#10142e] transition-transform hover:scale-[1.03]"
              >
                Ask about mine <ArrowUp className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HeroShell>
  );
}
