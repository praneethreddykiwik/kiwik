"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUp } from "lucide-react";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { LiquidGlass } from "@/components/gl/liquid-glass";
import { useGL } from "@/components/gl/use-gl";
import { PROBLEMS, PROCESS_STEPS, type ClientProblem } from "@/data/home-content";
import { cn } from "@/lib/utils";
import { Shot, useSendBrief, useWork } from "./kit";

const Orb = dynamic(() => import("./orb-canvas"), { ssr: false });
const FONT = { fontFamily: "var(--font-bricolage), sans-serif" } as React.CSSProperties;
const COLORS: [string, string, string] = ["#8ff0d8", "#b4bfff", "#ffffff"];

const TYPED = ["Customers keep asking the same questions", "We take orders on paper", "I have an idea for an app", "Nobody can find us online"];

// Words that point to one of the eight problems. Everything else goes to a person.
const HINTS: [RegExp, string][] = [
  [/\b(ai|chatbot|assistant|automat\w* repl|predict|model)/i, "ai"],
  [/\b(app|iphone|android|mobile|phone)\b/i, "app"],
  [/\b(sell|shop|store|order|buy|checkout|cart|payment|catalog)/i, "sell"],
  [/\b(spreadsheet|excel|paper|manual|whats|message|copy|sheet|same question|paperwork|booking|invoice)/i, "manual"],
  [/\b(hack|secur|data|privacy|password|login|leak|safe)/i, "security"],
  [/\b(server|host|down|crash|cloud|slow system|update|maintain)/i, "hosting"],
  [/\b(website|site|online|google|find us|enquir|seo|landing|visitors)/i, "website"],
  [/\b(idea|startup|start up|product|platform|build|saas|mvp)/i, "idea"],
];
function match(text: string): ClientProblem | null {
  const id = HINTS.find(([re]) => re.test(text))?.[1];
  return PROBLEMS.find((p) => p.id === id) || null;
}

/** Concept 3: the visitor says what is wrong, and the page answers. */
export default function SayIt() {
  const work = useWork();
  const reduced = useReducedMotion();
  const send = useSendBrief();
  const stage = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const gl = useGL(stage, "100px");
  const [ready, setReady] = useState(false);
  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const [asked, setAsked] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);

  // Examples type themselves until the visitor does.
  useEffect(() => {
    if (text || reduced) {
      setHint(reduced ? TYPED[0] : "");
      return;
    }
    let i = 0;
    let n = 0;
    let back = false;
    const t = setInterval(() => {
      const line = TYPED[i];
      if (!back) {
        n++;
        if (n > line.length + 22) back = true;
      } else {
        n = Math.min(n, line.length) - 2;
        if (n <= 0) {
          n = 0;
          back = false;
          i = (i + 1) % TYPED.length;
        }
      }
      setHint(line.slice(0, Math.max(0, n)));
    }, 46);
    return () => clearInterval(t);
  }, [text, reduced]);

  const ask = (value: string) => {
    const v = value.trim();
    if (!v) return;
    setText(v);
    setBusy(true);
    setAsked("");
    setTimeout(() => {
      setAsked(v);
      setBusy(false);
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }), 60);
    }, reduced ? 0 : 900);
  };

  const found = asked ? match(asked) : null;
  const proof = found && work.find((w) => w.slug === found.projectSlug);

  return (
    <div style={FONT} className="bg-[#f2fbf8] text-[#10233a]">
      <section ref={stage} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-32 text-center">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,#c9f4e8_0%,#dfe6ff_34%,#f2fbf8_66%)]" />
        <div ref={orb} aria-hidden="true" className={cn("absolute left-1/2 top-[46%] h-[min(112vw,112vh)] w-[min(112vw,112vh)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 [mask-image:radial-gradient(circle,#000_52%,transparent_70%)]", ready ? "opacity-100" : "opacity-0")}>
          {gl === "on" && <GLBoundary><Orb colors={COLORS} busy={busy} distance={8.5} onReady={() => setReady(true)} /></GLBoundary>}
        </div>
        <div className="relative z-10 w-full max-w-6xl">
          <h1 className="text-[clamp(2.7rem,7.4vw,6.8rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">What is slowing your business down?</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#10233a]/75 sm:text-xl">Say it the way you would say it to a friend. We will tell you what we would build.</p>

          <form onSubmit={(e) => { e.preventDefault(); ask(text || hint); }} className="mx-auto mt-10 w-full max-w-3xl">
            <LiquidGlass behind={orb} base="#dff5ee" tint={0.34} className="w-full rounded-[34px]">
              <span className="flex w-full items-center gap-3 p-2.5 pl-7">
                <label htmlFor="c3-say" className="sr-only">What is slowing you down?</label>
                <span className="relative min-w-0 flex-1">
                  <input id="c3-say" value={text} onChange={(e) => setText(e.target.value)} maxLength={300} autoComplete="off" className="w-full bg-transparent py-3 text-left text-lg font-medium text-[#10233a] outline-none sm:text-2xl" />
                  {!text && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-lg font-medium text-[#10233a]/60 sm:text-2xl">{hint}<span className="ml-0.5 inline-block h-6 w-[2px] animate-pulse bg-[#10233a]/60" /></span>}
                </span>
                <button type="submit" aria-label="Ask" className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#10233a] text-white transition-transform duration-200 hover:scale-105 active:scale-95"><ArrowUp className="h-6 w-6" /></button>
              </span>
            </LiquidGlass>
          </form>

          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {PROBLEMS.slice(0, 6).map((p) => (
              <li key={p.id}><button type="button" onClick={() => ask(p.problem)} className="cursor-pointer rounded-full bg-white/65 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white">{p.problem}</button></li>
            ))}
          </ul>
        </div>
      </section>

      <div ref={answerRef} aria-live="polite">
        <AnimatePresence mode="wait">
          {asked && (
            <motion.section key={asked} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10">
              <div className="overflow-hidden rounded-[40px] bg-[#10233a] text-white">
                <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
                  <div>
                    <p className="w-fit rounded-[22px] rounded-bl-md bg-white/12 px-5 py-3 text-lg">{asked}</p>
                    {found ? (
                      <>
                        <p className="mt-8 text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">{found.after}</p>
                        <p className="mt-4 text-lg leading-relaxed text-white/75">{found.fix}</p>
                      </>
                    ) : (
                      <>
                        <p className="mt-8 text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">That needs a proper answer from a person.</p>
                        <p className="mt-4 text-lg leading-relaxed text-white/75">Send it to the team as it is. We read everything that comes in and usually reply within two working days.</p>
                      </>
                    )}
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <button type="button" onClick={() => send(asked, found?.service)} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#7fe8cf] px-7 py-4 text-base font-bold text-[#10233a] transition-transform hover:scale-[1.03]">Send this to Kiwik <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                      {proof && <Link href={`/projects/${proof.slug}`} className="text-base font-semibold underline underline-offset-4">See {proof.name}</Link>}
                    </div>
                  </div>
                  <Drawing key={asked} kind={found?.id || "idea"}>{proof && <Shot work={proof} className="h-full w-full object-cover object-top" />}</Drawing>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* The rest of the page is the rest of the conversation. */}
      <Line who="You">Show me something you have built.</Line>
      <section className="mx-auto max-w-[1560px] px-5 pb-10 md:px-10">
        <ul className="grid gap-6 md:grid-cols-2">
          {work.map((w, i) => (
            <motion.li key={w.slug} initial={{ y: 60, scale: 0.96 }} whileInView={{ y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <Link href={`/projects/${w.slug}`} className="group block overflow-hidden rounded-[32px] bg-white">
                <Shot work={w} className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="block p-7"><span className="block text-2xl font-bold tracking-tight">{w.name}</span><span className="mt-1.5 block text-lg leading-relaxed text-[#10233a]/70">{w.note.built}</span></span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>
      <Line who="You">How would we work together?</Line>
      <section className="mx-auto max-w-5xl space-y-3 px-5 md:px-10">
        {PROCESS_STEPS.map((s, i) => (
          <motion.p key={s.id} initial={{ x: 40, opacity: 0.2 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }} className="ml-auto w-fit max-w-[46rem] rounded-[28px] rounded-br-md bg-[#10233a] px-7 py-5 text-lg leading-snug text-white sm:text-2xl">
            {s.desc}
          </motion.p>
        ))}
      </section>
      <Line who="You">And what do you need from me?</Line>
      <section className="px-5 pb-32 text-center md:px-10">
        <p className="mx-auto max-w-5xl text-[clamp(2.6rem,7vw,6rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">Just the problem.</p>
        <Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#10233a] px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03]">Tell us <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
      </section>
    </div>
  );
}

function Line({ who, children }: { who: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-10 md:py-20">
      <motion.p initial={{ x: -40, opacity: 0.2 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-fit max-w-[44rem] rounded-[28px] rounded-bl-md bg-white px-7 py-5 text-2xl font-bold leading-snug tracking-tight sm:text-4xl">
        <span className="sr-only">{who}: </span>{children}
      </motion.p>
    </div>
  );
}

/** The answer sketched, then shown for real where there is something real to show. */
function Drawing({ kind, children }: { kind: string; children?: React.ReactNode }) {
  const phone = kind === "app";
  const d = (delay: number) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.8, delay, ease: "easeInOut" as const } });
  return (
    <div className="relative flex min-h-[300px] items-center justify-center">
      <div className={cn("relative w-full overflow-hidden rounded-[22px]", phone ? "aspect-[9/15] max-w-[240px]" : "aspect-[16/11]")}>
        <svg viewBox={phone ? "0 0 180 300" : "0 0 320 220"} fill="none" stroke="#7fe8cf" strokeWidth="1.6" strokeLinecap="round" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {phone ? (
            <>
              <motion.rect x="3" y="3" width="174" height="294" rx="26" {...d(0)} /><motion.path d="M70 16h40M20 48h90M20 66h140" {...d(0.5)} /><motion.rect x="20" y="86" width="140" height="92" rx="12" {...d(0.8)} /><motion.path d="M20 200h140M20 224h110M20 248h124" {...d(1.1)} /><motion.rect x="50" y="266" width="80" height="20" rx="10" {...d(1.4)} />
            </>
          ) : (
            <>
              <motion.rect x="3" y="3" width="314" height="214" rx="16" {...d(0)} /><motion.path d="M3 34h314M18 19h4M30 19h4M42 19h4" {...d(0.4)} /><motion.path d="M24 66h120M24 84h92M24 102h106" {...d(0.7)} /><motion.rect x="24" y="122" width="74" height="22" rx="11" {...d(1)} /><motion.rect x="176" y="56" width="120" height="88" rx="10" {...d(0.9)} /><motion.path d="M24 172h80M120 172h80M216 172h80M24 190h60M120 190h66M216 190h54" {...d(1.2)} />
            </>
          )}
        </svg>
        {children && <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 1.1, delay: 1.9, ease: [0.65, 0, 0.35, 1] }} className="absolute inset-0">{children}</motion.div>}
      </div>
    </div>
  );
}
