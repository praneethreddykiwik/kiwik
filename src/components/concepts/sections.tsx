"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FAQ, PROBLEMS, PROCESS_STEPS } from "@/data/home-content";
import { cn } from "@/lib/utils";
import { Shot, useWork, type Work } from "./kit";

export interface Look {
  bg: string;
  ink: string;
  accent: string;
  onAccent: string;
  font?: React.CSSProperties;
  /** Weight and spacing of headings. */
  head?: string;
}
const HEAD = "font-bold tracking-[-0.035em]";
const wrap = "mx-auto max-w-[1560px] px-5 md:px-10";
const big = "text-[clamp(2.4rem,5vw,5rem)] leading-[1]";
const contact = (service: string) => `/contact?service=${encodeURIComponent(service)}`;

export function Cta({ look, children = "Start a project", href = "/contact" }: { look: Look; children?: React.ReactNode; href?: string }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]" style={{ background: look.accent, color: look.onAccent }}>
      {children} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

/** Problems as one long list; the chosen one opens beside it with its proof. */
export function ProblemList({ look, title, lead }: { look: Look; title: string; lead?: string }) {
  const work = useWork();
  const [open, setOpen] = useState(PROBLEMS[0].id);
  return (
    <section id="problems" className="scroll-mt-16" style={{ background: look.bg, color: look.ink }}>
      <div className={cn(wrap, "py-24 md:py-32")}>
        <h2 style={look.font} className={cn(big, look.head || HEAD, "max-w-4xl")}>{title}</h2>
        {lead && <p className="mt-4 max-w-xl text-lg opacity-75">{lead}</p>}
        <ul className="mt-12 border-t border-current/15">
          {PROBLEMS.map((p) => {
            const on = open === p.id;
            const proof = work.find((w) => w.slug === p.projectSlug);
            return (
              <li key={p.id} className="border-b border-current/15">
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? "" : p.id)} className={cn("flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-2xl transition-opacity md:text-[2.1rem]", look.head || HEAD, on ? "opacity-100" : "opacity-55 hover:opacity-100")}>
                  {p.problem}
                  <span aria-hidden="true" className="text-3xl font-normal leading-none transition-transform duration-300" style={{ transform: on ? "rotate(45deg)" : "none", color: on ? look.accent : "inherit" }}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <div className="grid gap-8 pb-10 pt-1 lg:grid-cols-[1.2fr_1fr]">
                        <div>
                          <p className="max-w-xl text-lg leading-relaxed opacity-80">{p.fix}</p>
                          <p className="mt-4 max-w-xl text-xl font-semibold leading-snug">{p.after}</p>
                          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                            <Cta look={look} href={contact(p.service)}>Start with this</Cta>
                            {proof && <Link href={`/projects/${proof.slug}`} className="text-base font-bold underline underline-offset-4">See {proof.name}</Link>}
                          </div>
                        </div>
                        {proof && <Shot work={proof} className="hidden aspect-[16/8] w-full rounded-2xl object-cover object-top lg:block" />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Problems as tiles that swap to their answer. */
export function ProblemTiles({ look, title, tile }: { look: Look; title: string; tile: string }) {
  return (
    <section id="problems" className="scroll-mt-16" style={{ background: look.bg, color: look.ink }}>
      <div className={cn(wrap, "py-24 md:py-32")}>
        <h2 style={look.font} className={cn(big, look.head || HEAD, "max-w-4xl")}>{title}</h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PROBLEMS.map((p) => (
            <li key={p.id}>
              <Link href={contact(p.service)} className="group relative block h-[250px] overflow-hidden rounded-[24px] p-7" style={{ background: tile }}>
                <span className="block text-2xl font-bold leading-[1.15] tracking-[-0.02em] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-6 group-hover:opacity-0 group-focus-visible:opacity-0">{p.problem}</span>
                <span className="absolute inset-0 flex translate-y-10 flex-col justify-between p-7 opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" style={{ background: look.accent, color: look.onAccent }}>
                  <span className="text-2xl font-bold leading-[1.15] tracking-[-0.02em]">{p.after}</span>
                  <span className="flex items-center gap-2 text-base font-bold">Start with this <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </span>
                <span aria-hidden="true" className="absolute bottom-6 left-7 text-base font-semibold opacity-60 transition-opacity group-hover:opacity-0">{p.service}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Each product fills in from a letterbox as it arrives. */
export function WorkReel({ look, title }: { look: Look; title: string }) {
  const work = useWork();
  return (
    <section id="work" className="scroll-mt-16" style={{ background: look.bg, color: look.ink }}>
      <div className={cn(wrap, "pt-24 md:pt-32")}><h2 style={look.font} className={cn(big, look.head || HEAD, "max-w-4xl")}>{title}</h2></div>
      {work.map((w, i) => <ReelRow key={w.slug} work={w} look={look} flip={i % 2 === 1} />)}
      <div className="h-24" />
    </section>
  );
}
function ReelRow({ work, look, flip }: { work: Work; look: Look; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "center 55%"] });
  const inset = useTransform(scrollYProgress, [0, 1], [34, 0]);
  const clip = useMotionTemplate`inset(${inset}% 0 ${inset}% 0 round 26px)`;
  return (
    <div ref={ref} className={cn(wrap, "grid items-center gap-8 pt-20 lg:grid-cols-12 lg:gap-14")}>
      <motion.div style={{ clipPath: clip }} className={cn("lg:col-span-8", flip && "lg:order-2")}><Shot work={work} className="aspect-[16/9.4] w-full object-cover object-top" /></motion.div>
      <div className="lg:col-span-4">
        <p className="text-lg leading-relaxed opacity-65">{work.note.problem}</p>
        <h3 style={look.font} className={cn("mt-4 text-4xl md:text-5xl", look.head || HEAD)}>{work.name}</h3>
        <p className="mt-3 text-lg font-medium leading-relaxed">{work.note.built}</p>
        <Link href={`/projects/${work.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-base font-bold underline decoration-2 underline-offset-[6px]" style={{ textDecorationColor: look.accent }}>See {work.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </div>
  );
}

/** Four products in an uneven wall. */
export function WorkWall({ look, title }: { look: Look; title: string }) {
  const work = useWork();
  return (
    <section id="work" className="scroll-mt-16" style={{ background: look.bg, color: look.ink }}>
      <div className={cn(wrap, "py-24 md:py-32")}>
        <h2 style={look.font} className={cn(big, look.head || HEAD, "max-w-4xl")}>{title}</h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-12">
          {work.map((w, i) => (
            <motion.li key={w.slug} initial={{ y: 60 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }} className={["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"][i]}>
              <Link href={`/projects/${w.slug}`} className="group relative block h-[360px] overflow-hidden rounded-[28px] md:h-[460px]">
                <Shot work={w} className="h-full w-full object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                <span className="absolute inset-x-3 bottom-3 rounded-[20px] p-6" style={{ background: look.ink, color: look.bg }}>
                  <span className="block text-2xl font-bold tracking-[-0.02em]">{w.name}</span>
                  <span className="mt-1 block text-base leading-relaxed opacity-80">{w.note.built}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Steps as cards that stack on one another while scrolling. */
export function StepStack({ look, title, colors, cardInk }: { look: Look; title: string; colors: string[]; cardInk?: string }) {
  return (
    <section id="how-we-work" className="scroll-mt-16" style={{ background: look.bg, color: look.ink }}>
      <div className={cn(wrap, "grid gap-12 py-24 md:py-32 lg:grid-cols-[1fr_1.3fr]")}>
        <div className="lg:sticky lg:top-32 lg:h-fit"><h2 style={look.font} className={cn(big, look.head || HEAD)}>{title}</h2><p className="mt-5 max-w-sm text-lg opacity-75">You always know which step you are on, and what comes next.</p></div>
        <ol>
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.id} className="sticky mb-5 min-h-[230px] rounded-[30px] p-8 sm:p-10" style={{ top: 100 + i * 22, background: colors[i % colors.length], color: cardInk || look.ink }}>
              <span className="text-lg font-bold opacity-60">Step {i + 1}</span>
              <h3 style={look.font} className={cn("mt-2 text-4xl md:text-5xl", look.head || HEAD)}>{s.title}</h3>
              <p className="mt-4 max-w-lg text-xl leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Steps along one line that fills as it is scrolled. */
export function StepLine({ look, title }: { look: Look; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  return (
    <section id="how-we-work" className="scroll-mt-16" style={{ background: look.bg, color: look.ink }}>
      <div ref={ref} className={cn(wrap, "py-24 md:py-32")}>
        <h2 style={look.font} className={cn(big, look.head || HEAD, "max-w-4xl")}>{title}</h2>
        <div className="relative mt-16">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[11px] hidden h-1 rounded-full bg-current opacity-15 md:block" />
          <motion.span aria-hidden="true" style={{ scaleX: scrollYProgress, background: look.accent }} className="absolute left-0 right-0 top-[11px] hidden h-1 origin-left rounded-full md:block" />
          <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
            {PROCESS_STEPS.map((s) => (
              <li key={s.id}>
                <span aria-hidden="true" className="block h-[26px] w-[26px] rounded-full border-[6px]" style={{ borderColor: look.accent, background: look.bg }} />
                <h3 className="mt-6 text-2xl font-bold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 text-lg leading-relaxed opacity-75">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Closing({ look, title, text, faq = true }: { look: Look; title: string; text?: string; faq?: boolean }) {
  return (
    <section id="faq" className="scroll-mt-16" style={{ background: look.bg, color: look.ink }}>
      <div className={cn(wrap, "py-24 md:py-36")}>
        {faq && (
          <dl className="mb-24 grid gap-x-12 gap-y-8 border-b border-current/15 pb-20 md:grid-cols-2">
            {FAQ.slice(0, 4).map(({ q, a }) => <div key={q}><dt className="text-xl font-bold">{q}</dt><dd className="mt-2 text-lg leading-relaxed opacity-75">{a}</dd></div>)}
          </dl>
        )}
        <div className="flex flex-col justify-between gap-9 lg:flex-row lg:items-end">
          <div><h2 style={look.font} className={cn("max-w-5xl text-[clamp(2.8rem,7vw,7rem)] leading-[0.95]", look.head || "font-bold tracking-[-0.045em]")}>{title}</h2>{text && <p className="mt-5 max-w-xl text-xl leading-relaxed opacity-80">{text}</p>}</div>
          <Cta look={look}>Start a project</Cta>
        </div>
      </div>
    </section>
  );
}
