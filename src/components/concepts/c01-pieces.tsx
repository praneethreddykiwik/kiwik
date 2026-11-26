"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";
import { FAQ, PROBLEMS, PROCESS_STEPS } from "@/data/home-content";
import { cn } from "@/lib/utils";
import { Shot, textureUrl, useHandFont, useWork, type Work, fourOf } from "./kit";
import { MessCard } from "./mess-card";
import { SCENES } from "./mess";
import type { PiecesControl } from "./c01-canvas";

const Stage = dynamic(() => import("./c01-canvas"), { ssr: false });

const NAVY = "#141a44";

/** Concept 1: scattered paperwork becomes a working product. */
export default function Pieces() {
  const work = useWork();
  return (
    <div className="bg-[#eef3fb] text-[#141a44]">
      <Hero work={fourOf(work, SCENES.length)} />
      <Exchange />
      {work.map((w, i) => <Case key={w.slug} work={w} index={i} />)}
      <Steps />
      <Questions />
    </div>
  );
}

function Hero({ work }: { work: Work[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const gl = useGL(ref, "100px");
  const hand = useHandFont(ref);
  const control = useRef<PiecesControl>({ scene: 0, clock: 0, paused: false });
  const [scene, setScene] = useState(0);
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const key = work.map(textureUrl).join("|");
  const screens = useMemo(() => (key ? key.split("|") : []), [key]);
  const now = SCENES[scene];
  const product = work[scene];

  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);

  const pick = (i: number) => {
    Object.assign(control.current, { scene: i, clock: 0 });
    setScene(i);
    setDone(false);
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_72%_46%,#ffffff,transparent_70%)]" />
      <div className="relative mx-auto grid w-full max-w-[1560px] flex-1 items-center gap-4 px-5 pt-28 pb-8 md:px-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:pt-20">
        <div className="relative z-10">
          <h1 className="font-serif text-[clamp(2.6rem,5.4vw,5.2rem)] font-bold leading-[1.02] tracking-tight">
            Your business,
            <span className="block">put together.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-[#48507a] sm:text-xl">
            Orders in messages, prices by guesswork, seven versions of one spreadsheet. Kiwik takes the pieces you already have and builds the one piece of software that runs it all.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#141a44] px-8 py-4 text-base font-bold text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
              Start a project <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="#work" className="text-base font-bold underline decoration-[#008080]/50 decoration-2 underline-offset-[6px] hover:decoration-[#008080]">See what we have built</a>
          </div>
        </div>

        <div ref={ref} className="relative -mx-5 h-[54svh] min-h-[340px] sm:mx-0 lg:h-[76svh]">
          {gl === "on" && hand && screens.length > 0 ? (
            <div className={cn("absolute inset-0 transition-opacity duration-700 lg:-left-[14%] lg:-right-[4%]", ready ? "opacity-100" : "opacity-0")}>
              <GLBoundary>
                <Stage control={control} screens={screens} onPhase={(s, d) => { setScene(s); setDone(d); }} onReady={() => setReady(true)} />
              </GLBoundary>
            </div>
          ) : gl === "off" && product ? (
            <div className="grid h-full grid-cols-[0.8fr_auto_1.2fr] items-center gap-4 px-5">
              <div className="grid grid-cols-2 gap-2">{now.pieces.slice(0, 6).map((p, i) => <MessCard key={i} piece={p} className="w-full rounded-lg shadow-md" style={{ transform: `rotate(${[-5, 4, 3, -4, -2, 6][i]}deg)` }} />)}</div>
              <ArrowRight className="h-8 w-8" aria-hidden="true" />
              <Shot work={product} className="aspect-[16/10] w-full rounded-2xl object-cover object-top shadow-2xl" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1560px] px-5 pb-8 md:px-10">
        <div className="flex flex-col gap-5 border-t border-[#141a44]/12 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <p aria-live="polite" className="text-lg font-semibold sm:text-xl">
            {done && product ? (
              <>
                <Link href={`/projects/${product.slug}`} className="text-[#00706d] underline decoration-2 underline-offset-4">{product.name}</Link>: {now.after.charAt(0).toLowerCase() + now.after.slice(1)}
              </>
            ) : now.before}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {SCENES.map((s, i) => (
              <button key={s.slug} type="button" aria-pressed={scene === i} onClick={() => pick(i)} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors", scene === i ? "bg-[#141a44] text-white" : "bg-white/70 hover:bg-white")}>
                {s.tab}
              </button>
            ))}
            <button type="button" aria-label={paused ? "Play" : "Pause"} onClick={() => { control.current.paused = !paused; setPaused(!paused); }} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/70 hover:bg-white">
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Each problem on a card that turns over to its answer. */
function Exchange() {
  return (
    <section id="problems" className="scroll-mt-16 bg-white">
      <span id="capabilities" className="block scroll-mt-16" />
      <div className="mx-auto max-w-[1560px] px-5 py-24 md:px-10 md:py-32">
        <h2 className="max-w-3xl font-serif text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl">Which piece is yours?</h2>
        <p className="mt-4 text-lg text-[#48507a]">Turn over the one that sounds familiar.</p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PROBLEMS.map((p, i) => <FlipCard key={p.id} problem={p} color={["#ffe89a", "#ffd9d2", "#e3efd9", "#dce8fb"][i % 4]} tilt={[-1.4, 1, 0.8, -1][i % 4]} />)}
        </ul>
      </div>
    </section>
  );
}

function FlipCard({ problem, color, tilt }: { problem: (typeof PROBLEMS)[number]; color: string; tilt: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="[perspective:1200px]">
      <div className="relative h-[300px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]" style={{ transform: open ? "rotateY(180deg)" : `rotateZ(${tilt}deg)` }}>
        <button type="button" aria-expanded={open} onClick={() => setOpen(true)} tabIndex={open ? -1 : 0} className="absolute inset-0 flex cursor-pointer flex-col justify-between p-7 text-left shadow-[0_18px_40px_-18px_rgba(20,26,68,0.35)] [backface-visibility:hidden]" style={{ background: color, color: "#3a3320" }}>
          <span className="text-[2.1rem] font-bold leading-[1.05]" style={{ fontFamily: "var(--font-hand), cursive" }}>{problem.problem}</span>
          <span className="text-sm font-bold">Turn it over</span>
        </button>
        <div aria-hidden={!open} className="absolute inset-0 flex flex-col justify-between rounded-2xl p-7 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ background: NAVY }}>
          <div>
            <p className="font-serif text-2xl font-bold leading-snug">{problem.after}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{problem.fix}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Link href={`/contact?service=${encodeURIComponent(problem.service)}`} tabIndex={open ? 0 : -1} className="text-base font-bold underline underline-offset-4">Start with this</Link>
            <button type="button" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="cursor-pointer text-sm text-white/70 hover:text-white">Turn back</button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** The product slides up over its own paperwork as you reach it. */
function Case({ work, index }: { work: Work; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0.25, 1], ["38%", "0%"]);
  const rot = useTransform(scrollYProgress, [0.25, 1], [5, 0]);
  const scene = SCENES.find((s) => s.slug === work.slug)!;
  return (
    <section ref={ref} id={index === 0 ? "work" : undefined} className={cn("overflow-hidden", index % 2 ? "bg-white" : "bg-[#eef3fb]")}>
      <div className="mx-auto grid max-w-[1560px] items-center gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12">
        <div className={cn("lg:col-span-4", index % 2 === 1 && "lg:order-2")}>
          <h2 className="font-serif text-4xl font-bold tracking-tight md:text-6xl">{work.name}</h2>
          <p className="mt-5 text-lg leading-relaxed text-[#48507a]">{work.note.problem}</p>
          <p className="mt-4 text-lg font-semibold leading-relaxed">{work.note.built}</p>
          <Link href={`/projects/${work.slug}`} className="mt-7 inline-flex items-center gap-2 text-base font-bold underline decoration-[#008080]/50 decoration-2 underline-offset-[6px]">See {work.name}</Link>
        </div>
        <div className={cn("relative lg:col-span-8", index % 2 === 1 && "lg:order-1")}>
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 content-start gap-3 md:grid-cols-4">
            {scene.pieces.slice(0, 8).map((p, i) => <MessCard key={i} piece={p} className="w-full rounded-lg shadow-lg" style={{ transform: `rotate(${[-6, 4, -3, 7, 5, -4, 3, -7][i]}deg)` }} />)}
          </div>
          <motion.div style={{ y, rotate: rot }} className="relative">
            <Shot work={work} className="aspect-[16/10] w-full rounded-[22px] object-cover object-top shadow-[0_40px_80px_-30px_rgba(20,26,68,0.55)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section id="how-we-work" className="scroll-mt-16 bg-[#141a44] text-white">
      <div className="mx-auto max-w-[1560px] px-5 py-24 md:px-10 md:py-32">
        <h2 className="max-w-3xl font-serif text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl">How the pieces come together</h2>
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((s, i) => (
            <motion.li key={s.id} initial={{ y: 40, rotate: i % 2 ? 4 : -4 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}>
              <span className="block font-serif text-5xl font-bold text-[#8fd9d3] lining-nums">{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/75">{s.desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Questions({ className = "bg-white" }: { className?: string }) {
  return (
    <section id="faq" className={className}>
      <div className="mx-auto grid max-w-[1560px] gap-8 px-5 py-24 md:px-10 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">Before you get in touch</h2>
        <div className="divide-y divide-current/15 border-y border-current/15">
          {FAQ.slice(0, 5).map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="flex cursor-pointer list-none justify-between gap-4 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">{q}<span aria-hidden="true" className="text-2xl leading-none transition-transform group-open:rotate-45">+</span></summary>
              <p className="max-w-2xl pb-6 text-base leading-relaxed opacity-75">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
