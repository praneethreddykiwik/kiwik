"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock, Croissant, HeartPulse, MapPin, PartyPopper, Search, Shirt, ShoppingBag, Star, Stethoscope, UtensilsCrossed, Wrench, type LucideIcon } from "lucide-react";
import { BrandGradient } from "@/components/gl/brand-gradient";
import { cn } from "@/lib/utils";
import { useSendBrief } from "./kit";
import { Closing, ProblemTiles, StepStack, WorkWall, type Look } from "./sections";

const FONT = { fontFamily: "var(--font-bricolage), sans-serif" } as React.CSSProperties;
const HEAD = "font-extrabold tracking-[-0.045em]";
const LOOK: Look = { bg: "#fff8f2", ink: "#1c1a2e", accent: "#1c1a2e", onAccent: "#fff", font: FONT, head: HEAD };

interface Kind {
  id: string;
  label: string;
  sample: string;
  line: string;
  text: string;
  button: string;
  tabs: string[];
  items: [string, string, LucideIcon][];
  phone: [string, string][];
  done: string;
  desk: [string, string, string][];
}
const KINDS: Kind[] = [
  { id: "shop", label: "Shop", sample: "Marigold Lane", line: "Made slowly. Delivered quickly.", text: "New pieces every Friday, in small runs.", button: "Shop the collection", tabs: ["New", "Dresses", "About"], items: [["Linen wrap", "in 4 sizes", Shirt], ["Day bag", "2 colours", ShoppingBag], ["Silk scarf", "just in", Star]], phone: [["Linen wrap, M", "1"], ["Delivery", "Tomorrow"]], done: "Order placed", desk: [["Linen wrap, M", "Paid", "8:15 pm"], ["Day bag, sand", "Packed", "7:50 pm"], ["Silk scarf", "Sent", "6:02 pm"]] },
  { id: "food", label: "Restaurant", sample: "The Blue Door", line: "Dinner, without the phone call.", text: "Book a table or order in. It takes a minute.", button: "Book a table", tabs: ["Menu", "Book", "Find us"], items: [["Saffron risotto", "tonight", UtensilsCrossed], ["Almond croissant", "till noon", Croissant], ["Chef's table", "6 seats", Star]], phone: [["Table for", "4"], ["Tonight", "8:30 pm"]], done: "Table booked", desk: [["Table 6, four people", "Confirmed", "8:30 pm"], ["Order in, flat 803", "Cooking", "8:05 pm"], ["Table 2, two people", "Seated", "7:45 pm"]] },
  { id: "clinic", label: "Clinic", sample: "Cedar Health", line: "See a doctor this week.", text: "Pick a time that suits you. We will remind you.", button: "Book a visit", tabs: ["Doctors", "Visits", "Contact"], items: [["General check", "30 minutes", Stethoscope], ["Heart health", "45 minutes", HeartPulse], ["Children", "30 minutes", Star]], phone: [["General check", "Thu"], ["Time", "10:15 am"]], done: "Visit booked", desk: [["General check", "Arrived", "10:15 am"], ["Children", "Reminder sent", "11:00 am"], ["Heart health", "Booked", "2:30 pm"]] },
  { id: "events", label: "Events", sample: "Lantern & Co", line: "Weddings, without the spreadsheets.", text: "See your date, your plan and your costs in one place.", button: "Check our dates", tabs: ["Work", "Dates", "Contact"], items: [["Garden wedding", "120 guests", PartyPopper], ["Product launch", "evening", Star], ["Birthday", "40 guests", CalendarDays]], phone: [["Garden wedding", "14 Feb"], ["Guests", "120"]], done: "Date held", desk: [["Florist", "Confirmed", "today"], ["Sound", "Waiting", "due Fri"], ["Lights", "Paid", "done"]] },
  { id: "service", label: "Services", sample: "Fixwell", line: "A price in a minute. A person tomorrow.", text: "Send a photo of the job and get an itemised price.", button: "Get a price", tabs: ["Services", "Prices", "Areas"], items: [["Deep clean", "from 2 hours", Wrench], ["Repairs", "same week", Clock], ["Moving day", "any size", MapPin]], phone: [["Deep clean, 2 bed", "3 h"], ["Tomorrow", "9:00 am"]], done: "Job booked", desk: [["Deep clean, 2 bed", "Assigned", "9:00 am"], ["Repairs, kitchen", "Quoted", "11:30 am"], ["Moving day", "Done", "yesterday"]] },
];
const COLORS = ["#ff6a3d", "#0f8f83", "#5b4bff", "#d6336c", "#1f7a3f", "#1c1a2e"];

/** Concept 5: the visitor's own name on working software. */
export default function YourName() {
  return (
    <div style={FONT}>
      <Maker />
      <ProblemTiles look={{ ...LOOK, bg: "#ffffff", accent: "#ff6a3d", onAccent: "#1c1a2e" }} title="What should yours fix first?" tile="#fff1e7" />
      <WorkWall look={LOOK} title="These started as a name, too" />
      <StepStack look={{ ...LOOK, bg: "#1c1a2e", ink: "#ffffff" }} cardInk="#1c1a2e" title="From a name to the real thing" colors={["#ffd9c7", "#ffe9a8", "#cdeee4", "#d9d4ff", "#ffd3e2"]} />
      <Closing look={{ ...LOOK, bg: "#ff6a3d", accent: "#1c1a2e" }} title="Now make it a real one." />
    </div>
  );
}

function Maker() {
  const send = useSendBrief();
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [kind, setKind] = useState(KINDS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const touched = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const shown = name.trim() || kind.sample;

  // Shows a few businesses by itself until someone types.
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (touched.current || document.hidden) return;
      setKind((k) => {
        const i = (KINDS.indexOf(k) + 1) % KINDS.length;
        setColor(COLORS[i]);
        return KINDS[i];
      });
    }, 3600);
    return () => clearInterval(t);
  }, [reduced]);

  const tilt = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || reduced) return;
    const b = el.getBoundingClientRect();
    el.style.setProperty("--ry", `${(((e.clientX - b.left) / b.width - 0.5) * 9 - 6).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-((e.clientY - b.top) / b.height - 0.5) * 6 + 3).toFixed(2)}deg`);
  };

  return (
    <section onPointerMove={tilt} className="relative min-h-[100svh] overflow-hidden bg-[#fff1e7] text-[#1c1a2e]">
      <BrandGradient key={color} colors={[mix(color, 0.62), "#fff3ea", mix(color, 0.84)]} strength={1.4} density={1} distance={2.4} brightness={1.35} opacity={0.85} />
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1640px] items-center gap-10 px-5 pb-16 pt-28 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:pb-10">
        <div className="relative z-10">
          <h1 className={cn("text-[clamp(3rem,6.6vw,6.8rem)] leading-[0.92]", HEAD)}>See your business, finished.</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#1c1a2e]/80 sm:text-xl">Type its name. Kiwik builds the website, the app and the system behind it, and this is how they fit together.</p>
          <label htmlFor="c5-name" className="mt-8 block text-base font-bold">Your business name</label>
          <input
            id="c5-name" value={name} maxLength={26} autoComplete="off" placeholder={kind.sample}
            onChange={(e) => { touched.current = true; setName(e.target.value); }}
            onFocus={() => (touched.current = true)}
            className="mt-2 w-full max-w-md rounded-2xl border-2 border-[#1c1a2e] bg-white px-5 py-4 text-2xl font-bold tracking-[-0.02em] outline-none placeholder:text-[#1c1a2e]/35 focus:shadow-[0_0_0_4px_rgba(28,26,46,0.15)]"
          />
          <div role="radiogroup" aria-label="Kind of business" className="mt-4 flex flex-wrap gap-2">
            {KINDS.map((k) => <button key={k.id} type="button" role="radio" aria-checked={kind.id === k.id} onClick={() => { touched.current = true; setKind(k); }} className={cn("cursor-pointer rounded-full px-5 py-2.5 text-base font-bold transition-colors", kind.id === k.id ? "bg-[#1c1a2e] text-white" : "bg-white/75 hover:bg-white")}>{k.label}</button>)}
          </div>
          <div role="radiogroup" aria-label="Colour" className="mt-4 flex gap-2.5">
            {COLORS.map((c) => <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={`Colour ${c}`} onClick={() => { touched.current = true; setColor(c); }} className={cn("h-10 w-10 cursor-pointer rounded-full transition-transform", color === c ? "scale-110 ring-2 ring-[#1c1a2e] ring-offset-2 ring-offset-transparent" : "hover:scale-105")} style={{ background: c }} />)}
          </div>
          <button type="button" onClick={() => send(`We are ${name.trim() || "a business"} (${kind.label.toLowerCase()}). We would like software like the preview we made.`, "Software & Product Development")} className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1c1a2e] px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]">Make it real <ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
        </div>

        <div ref={stage} className="relative h-[560px] [perspective:1500px] [--rx:3deg] [--ry:-8deg] sm:h-[640px]">
          <div aria-label={`Preview for ${shown}`} role="img" className="absolute inset-0 transition-transform duration-300 ease-out [transform-style:preserve-3d]" style={{ transform: "rotateX(var(--rx)) rotateY(var(--ry))" }}>
            <Site name={shown} kind={kind} color={color} />
            <Desk name={shown} kind={kind} color={color} />
            <Phone name={shown} kind={kind} color={color} />
          </div>
          <p className="absolute -bottom-9 right-1 text-sm text-[#1c1a2e]/70">A preview with sample content</p>
        </div>
      </div>
    </section>
  );
}

function mix(hex: string, white: number) {
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${n.map((v) => Math.round(v + (255 - v) * white).toString(16).padStart(2, "0")).join("")}`;
}
const Swap = ({ k, children, className }: { k: string; children: React.ReactNode; className?: string }) => (
  <AnimatePresence mode="popLayout" initial={false}>
    <motion.span key={k} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className={cn("block", className)}>{children}</motion.span>
  </AnimatePresence>
);

function Site({ name, kind, color }: { name: string; kind: Kind; color: string }) {
  return (
    <div className="absolute left-0 top-[2%] w-[92%] overflow-hidden rounded-[22px] bg-white shadow-[0_50px_100px_-30px_rgba(28,26,46,0.45)] sm:w-[86%]">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <span className="truncate text-xl font-extrabold tracking-[-0.03em]" style={{ color }}>{name}</span>
        <span className="hidden gap-5 text-sm font-semibold text-[#1c1a2e]/70 sm:flex">{kind.tabs.map((t) => <span key={t}>{t}</span>)}</span>
        <Search className="h-4 w-4 shrink-0 text-[#1c1a2e]/60" />
      </div>
      <div className="relative overflow-hidden px-6 pb-8 pt-9 text-white transition-colors duration-500 sm:px-9 sm:pb-11 sm:pt-12" style={{ background: color }}>
        <span aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/15" />
        <span aria-hidden="true" className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-black/10" />
        <div className="relative min-h-[132px] max-w-[21rem] sm:min-h-[150px]">
          <Swap k={kind.line} className="text-3xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[2.7rem]">{kind.line}</Swap>
          <Swap k={kind.text} className="mt-3 text-base leading-snug text-white/90">{kind.text}</Swap>
        </div>
        <span className="relative mt-4 inline-block rounded-full bg-white px-6 py-3 text-base font-bold" style={{ color }}>{kind.button}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4 sm:gap-4 sm:p-6">
        {kind.items.map(([t, d, Icon], i) => (
          <div key={i} className="rounded-2xl p-3 sm:p-4" style={{ background: mix(color, 0.88) }}>
            <span className="flex h-20 items-center justify-center rounded-xl transition-colors duration-500 sm:h-24" style={{ background: mix(color, [0.55, 0.68, 0.42][i]) }}><Icon className="h-9 w-9 text-white" strokeWidth={1.6} /></span>
            <Swap k={t} className="mt-3 text-sm font-bold leading-tight">{t}</Swap>
            <Swap k={d} className="text-xs text-[#1c1a2e]/70">{d}</Swap>
          </div>
        ))}
      </div>
    </div>
  );
}

function Phone({ name, kind, color }: { name: string; kind: Kind; color: string }) {
  return (
    <div className="absolute bottom-[3%] right-0 w-[200px] rounded-[38px] bg-[#15131f] p-[7px] shadow-[0_50px_90px_-20px_rgba(28,26,46,0.6)] sm:w-[232px]" style={{ transform: "translateZ(110px)" }}>
      <div className="relative flex h-[400px] flex-col overflow-hidden rounded-[32px] bg-white sm:h-[460px]">
        <span aria-hidden="true" className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-[#15131f]" />
        <div className="px-5 pb-5 pt-11 text-white transition-colors duration-500" style={{ background: color }}>
          <span className="block truncate text-lg font-extrabold tracking-[-0.02em]">{name}</span>
          <Swap k={kind.button} className="text-sm text-white/85">{kind.button}</Swap>
        </div>
        <div className="flex-1 space-y-2.5 p-4">
          {kind.phone.map(([a, b], i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-2xl px-4 py-3.5" style={{ background: mix(color, 0.88) }}><Swap k={a} className="text-sm font-semibold">{a}</Swap><Swap k={b} className="whitespace-nowrap text-sm font-extrabold">{b}</Swap></div>
          ))}
          <div className="flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-sm font-semibold" style={{ borderColor: mix(color, 0.7) }}>Pay now <ChevronRight className="h-4 w-4" /></div>
        </div>
        <motion.div key={kind.id + name} initial={{ y: 90 }} animate={{ y: 0 }} transition={{ delay: 0.9, type: "spring", stiffness: 190, damping: 18 }} className="m-3 flex items-center gap-3 rounded-2xl bg-[#15131f] px-4 py-3.5 text-white"><span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: color }}><Check className="h-4 w-4" /></span><span className="text-sm font-bold">{kind.done}</span></motion.div>
      </div>
    </div>
  );
}

function Desk({ name, kind, color }: { name: string; kind: Kind; color: string }) {
  return (
    <div className="absolute -bottom-[3%] -left-[3%] w-[54%] rounded-[22px] bg-[#15131f] p-5 text-white shadow-[0_40px_80px_-20px_rgba(28,26,46,0.6)] max-sm:hidden" style={{ transform: "translateZ(60px)" }}>
      <p className="flex items-center justify-between text-base font-bold"><span className="truncate">{name}, today</span><span className="ml-3 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: mix(color, 0.25) }} /></p>
      <ul className="mt-3 divide-y divide-white/10">
        {kind.desk.map(([a, b, c], i) => (
          <motion.li key={kind.id + i} initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 + (2 - i) * 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2.5 text-sm"><span className="truncate font-semibold">{a}</span><span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: i === 0 ? mix(color, 0.2) : "rgba(255,255,255,.12)", color: i === 0 ? "#15131f" : "#fff" }}>{b}</span><span className="w-16 text-right text-white/65">{c}</span></motion.li>
        ))}
      </ul>
    </div>
  );
}
