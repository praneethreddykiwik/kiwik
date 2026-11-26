"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowRight, ChevronsLeftRight } from "lucide-react";
import { BrandGradient } from "@/components/gl/brand-gradient";
import { LiquidGlass } from "@/components/gl/liquid-glass";
import { FAQ, PROBLEMS } from "@/data/home-content";
import { cn } from "@/lib/utils";
import { Shot, useWork, type Work } from "./kit";
import { MessCard } from "./mess-card";
import { SCENES, type MessScene } from "./mess";

const DISPLAY = { fontFamily: "var(--font-archivo), sans-serif", fontStretch: "116%" } as React.CSSProperties;
const TEAL: [string, string, string] = ["#0a5c5a", "#0d8a80", "#0b3d52"];

// Where each piece of paperwork lies on the desk: left %, top %, turn, width %.
const DESK: [number, number, number, number][] = [
  [2, 6, -7, 21], [21, 2, 5, 18], [40, 9, -3, 21], [63, 3, 8, 19], [80, 12, -6, 20],
  [0, 40, 6, 19], [18, 34, -4, 22], [42, 42, 7, 18], [60, 36, -8, 21], [82, 48, 5, 18],
  [6, 70, -5, 20], [30, 69, 4, 21],
];

/** Concept 2: the same Monday, on either side of a line the visitor drags. */
export default function BeforeAfter() {
  const work = useWork();
  return (
    <div className="bg-[#d9d5ce] text-[#1d1f1e]">
      <Hero work={work} />
      <Ledger />
      {work.slice(1).map((w) => <ScrollWipe key={w.slug} work={w} scene={SCENES.find((s) => s.slug === w.slug)!} />)}
      <Turn />
      <Ask />
    </div>
  );
}

function Desk({ scene, dense = 12 }: { scene: MessScene; dense?: number }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#cfcac1]">
      {scene.pieces.slice(0, dense).map((p, i) => {
        const [l, t, r, w] = DESK[i];
        return <MessCard key={i} piece={p} className="absolute rounded-[6px] shadow-[0_10px_24px_rgba(40,34,24,0.28)]" style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, minWidth: 150, transform: `rotate(${r}deg)`, filter: "grayscale(0.55) contrast(0.94)" }} />;
      })}
    </div>
  );
}

function Hero({ work }: { work: Work[] }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const glassArea = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const x = useMotionValue(62);
  const clip = useMotionTemplate`inset(0 0 0 ${x}%)`;
  const left = useMotionTemplate`${x}%`;
  const [value, setValue] = useState(62);
  const touched = useRef(false);
  const now = SCENES[scene];
  const product = work.find((w) => w.slug === now.slug);

  useEffect(() => x.on("change", (v) => setValue(Math.round(v))), [x]);

  // Shows that the line moves, then leaves it to the visitor.
  useEffect(() => {
    if (reduced) return;
    const run = animate(x, [82, 34, 58], { duration: 3.4, delay: 0.6, ease: [0.65, 0, 0.35, 1], times: [0, 0.6, 1] });
    return () => run.stop();
  }, [x, reduced, scene]);

  const moveTo = (clientX: number) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    x.stop();
    touched.current = true;
    x.set(Math.min(97, Math.max(3, ((clientX - box.left) / box.width) * 100)));
  };
  const dragging = useRef(false);

  return (
    <section className="relative">
      <div
        ref={stage}
        className="relative h-[84svh] min-h-[560px] touch-pan-y select-none overflow-hidden"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("a,button")) return;
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <div className="absolute inset-0">
          <Desk scene={now} />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#cfcac1] via-[#cfcac1]/55 to-transparent" />
          <Words tone="before" title="Before" text={now.before} />
        </div>

        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-[#0b4d4d] text-white">
          <div ref={glassArea} className="absolute inset-0"><BrandGradient colors={TEAL} strength={1.4} density={1} distance={2.3} brightness={1.2} /></div>
          {product && (
            <div aria-hidden="true" className="absolute inset-x-[6%] top-[13%] bottom-[33%] sm:inset-x-[16%]">
              <Shot work={product} className="h-full w-full rounded-[18px] object-cover object-top shadow-[0_40px_90px_rgba(0,20,20,0.5)]" />
            </div>
          )}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07393c] to-transparent" />
          <Words tone="after" title="After" text={product ? `${product.name}. ${now.after}.` : now.after} />
        </motion.div>

        <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 z-20 w-0">
          <span aria-hidden="true" className="absolute inset-y-0 -left-px w-[3px] bg-white shadow-[0_0_24px_rgba(0,0,0,0.35)]" />
          <span className="pointer-events-auto absolute left-0 top-[46%] -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full">
            <LiquidGlass behind={glassArea} base="#8b8a84" tint={0.2} className="rounded-full">
              <span className="flex h-[76px] w-[76px] items-center justify-center text-white"><ChevronsLeftRight className="h-8 w-8" aria-hidden="true" /></span>
            </LiquidGlass>
            <input
              type="range" min={3} max={97} value={value}
              aria-label="Move between before and after"
              onChange={(e) => { x.stop(); x.set(Number(e.target.value)); }}
              className="absolute inset-0 m-0 h-full w-full cursor-ew-resize opacity-0"
              onPointerDown={(e) => { e.preventDefault(); }}
            />
          </span>
        </motion.div>
      </div>

      <div className="relative z-30 bg-[#1d1f1e] text-white">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-6 px-5 py-7 md:px-10 lg:flex-row lg:items-center lg:justify-between">
          <h1 style={DISPLAY} className="max-w-2xl text-2xl font-extrabold leading-[1.08] tracking-[-0.025em] md:text-4xl">The same Monday, before and after. Kiwik builds the software in between.</h1>
          <div className="flex flex-wrap items-center gap-2">
            {SCENES.map((s, i) => (
              <button key={s.slug} type="button" aria-pressed={scene === i} onClick={() => setScene(i)} className={cn("cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-colors", scene === i ? "bg-white text-[#1d1f1e]" : "bg-white/12 hover:bg-white/20")}>{s.tab}</button>
            ))}
            <Link href="/contact" className="ml-1 inline-flex items-center gap-2 rounded-full bg-[#16a394] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#12887b]">Start a project <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Words({ tone, title, text }: { tone: "before" | "after"; title: React.ReactNode; text: string }) {
  return (
    <div className={cn("pointer-events-none absolute bottom-8 w-full px-5 md:bottom-10 md:px-10", tone === "after" && "text-right")}>
      <p style={DISPLAY} className="text-[clamp(3.2rem,10.5vw,10rem)] font-extrabold leading-[0.86] tracking-[-0.04em]">{title}</p>
      <p className={cn("mt-5 max-w-[42vw] text-base sm:max-w-[26rem] sm:text-lg font-semibold leading-snug sm:text-xl", tone === "after" && "ml-auto")}>{text}</p>
    </div>
  );
}

/** Two columns: what is said today, what is said afterwards. */
function Ledger() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="bg-[#d9d5ce] px-5 pt-24 md:px-10"><h2 style={DISPLAY} className="text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">What you say now</h2></div>
      <div className="hidden bg-[#f3fbf9] px-10 pt-24 md:block"><h2 style={DISPLAY} className="text-5xl font-extrabold tracking-[-0.03em] text-[#0a5c5a]">What you say after</h2></div>
      {PROBLEMS.map((p) => (
        <React.Fragment key={p.id}>
          <div className="bg-[#d9d5ce] px-5 py-8 md:px-10 md:py-10">
            <p className="max-w-md text-2xl font-medium leading-snug text-[#1d1f1e]/65 md:text-[1.75rem]">&ldquo;{p.problem}.&rdquo;</p>
          </div>
          <motion.div initial="off" whileInView="on" viewport={{ once: true, amount: 0.6 }} className="bg-[#d9d5ce]">
            <motion.div variants={{ off: { clipPath: "inset(0 100% 0 0)" }, on: { clipPath: "inset(0 0% 0 0)" } }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-[#f3fbf9] px-5 py-8 md:px-10 md:py-10">
            <Link href={`/contact?service=${encodeURIComponent(p.service)}`} className="group block">
              <span className="block max-w-lg text-2xl font-bold leading-snug text-[#083f40] md:text-[1.75rem]">{p.after}</span>
              <span className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[#0a7a72]">Start with this <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
            </motion.div>
          </motion.div>
        </React.Fragment>
      ))}
      <div className="h-24 bg-[#d9d5ce]" /><div className="hidden h-24 bg-[#f3fbf9] md:block" />
    </section>
  );
}

/** Scrolling pulls the line across a whole screen. */
function ScrollWipe({ work, scene }: { work: Work; scene: MessScene }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cut = useTransform(scrollYProgress, [0.08, 0.78], [100, 0]);
  const clip = useMotionTemplate`inset(${cut}% 0 0 0)`;
  const top = useMotionTemplate`${cut}%`;
  return (
    <section ref={ref} className="relative h-[210vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Desk scene={scene} />
        <div className="absolute inset-0 flex items-center justify-center bg-[#cfcac1]/60 px-5">
          <p style={DISPLAY} className="max-w-5xl text-center text-[clamp(2rem,5.6vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.035em]">{scene.before}</p>
        </div>
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-[#0b4d4d] text-white">
          <Shot work={work} className="absolute inset-0 h-full w-full object-cover object-top" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#042c2e] via-[#042c2e]/88 to-transparent px-5 pb-10 pt-48 md:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h3 style={DISPLAY} className="text-5xl font-extrabold tracking-[-0.035em] md:text-7xl">{work.name}</h3>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">{work.note.built}</p>
              </div>
              <Link href={`/projects/${work.slug}`} className="w-fit shrink-0 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#083f40]">See {work.name}</Link>
            </div>
          </div>
        </motion.div>
        <motion.span aria-hidden="true" style={{ top }} className="absolute inset-x-0 h-[3px] bg-white shadow-[0_0_24px_rgba(0,0,0,0.4)]" />
      </div>
    </section>
  );
}

/** What the client does, what Kiwik does: the line runs down the middle of the work itself. */
function Turn() {
  const rows = [
    ["You tell us what is going wrong", "We ask until we understand it"],
    ["You look at the screens", "We draw them before building"],
    ["You try it while it grows", "We build it in the open"],
    ["You open the doors", "We protect it first, then launch it"],
    ["You run your business", "We look after the software"],
  ];
  return (
    <section className="bg-[#f3fbf9] text-[#083f40]">
      <div className="mx-auto max-w-[1560px] px-5 py-24 md:px-10 md:py-32">
        <h2 style={DISPLAY} className="text-4xl font-extrabold tracking-[-0.03em] md:text-6xl">Getting there, line by line</h2>
        <ol className="mt-14">
          {rows.map(([you, us], i) => (
            <li key={you} className="grid border-t-2 border-[#083f40]/15 md:grid-cols-[1fr_4rem_1fr]">
              <p className="py-5 text-xl font-semibold md:py-8 md:text-2xl"><span className="mr-2 text-[#083f40]/55 md:hidden">You:</span>{you}</p>
              <span aria-hidden="true" className="hidden items-center justify-center text-2xl font-bold text-[#16a394] md:flex">{i + 1}</span>
              <p className="pb-5 text-xl text-[#083f40]/75 md:py-8 md:text-2xl"><span className="mr-2 text-[#083f40]/55 md:hidden">Us:</span>{us}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Ask() {
  return (
    <section className="bg-[#1d1f1e] text-white">
      <div className="mx-auto grid max-w-[1560px] gap-12 px-5 py-24 md:px-10 lg:grid-cols-2">
        <h2 style={DISPLAY} className="text-[clamp(2.6rem,6vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">Which side of the line is your Monday on?</h2>
        <dl className="space-y-7">
          {FAQ.slice(0, 4).map(({ q, a }) => (
            <div key={q}>
              <dt className="text-xl font-bold">{q}</dt>
              <dd className="mt-1.5 text-lg leading-relaxed text-white/70">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
