"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSeen } from "./kit";
import { Closing, Cta, ProblemList, StepLine, WorkReel, type Look } from "./sections";

const FONT = { fontFamily: "var(--font-archivo), sans-serif" } as React.CSSProperties;
const HEAD = "font-extrabold tracking-[-0.045em]";
const LOOK: Look = { bg: "#eef2f6", ink: "#1d232d", accent: "#0c8f68", onAccent: "#fff", font: FONT, head: HEAD };

type Bubble = { at: number; who: "customer" | "shop" | "wait"; text: string };
type Screen = { at: number; title: string; rows: [string, string][]; button?: string; done?: boolean };
type Note = { at: number; text: string; good?: boolean };
interface Story {
  id: string;
  tab: string;
  customer: string;
  clock: (t: number) => string;
  chat: Bubble[];
  app: Screen[];
  mine: Note[];
  ours: Note[];
  endBad: string;
  endGood: string;
  service: string;
}

/** Minutes from the start of the story to a clock time. */
const from = (h: number, m: number, jump = 0) => (t: number) => {
  const mins = h * 60 + m + Math.floor(t) + (jump && t > 12 ? jump : 0);
  const hh = Math.floor(mins / 60) % 24;
  return `${((hh + 11) % 12) + 1}:${String(mins % 60).padStart(2, "0")} ${hh < 12 ? "am" : "pm"}`;
};

const STORIES: Story[] = [
  {
    id: "buy", tab: "Someone wants to buy", customer: "A customer wants the green dress", clock: from(20, 14, 13 * 60 + 20), service: "E-commerce",
    chat: [{ at: 0.5, who: "customer", text: "hi, is the green dress available in M?" }, { at: 4, who: "wait", text: "Delivered" }, { at: 6, who: "customer", text: "hello?" }, { at: 8, who: "customer", text: "also how much is it" }, { at: 11, who: "customer", text: "ok never mind" }, { at: 14, who: "shop", text: "Hi! So sorry, yes we have M" }, { at: 16, who: "wait", text: "Not seen" }],
    app: [{ at: 0.5, title: "Green dress", rows: [["Size", "S  M  L"], ["Stock", "M, 3 left"]], button: "Add to bag" }, { at: 3, title: "Your bag", rows: [["Green dress, M", "1"], ["Delivery", "Thursday"]], button: "Pay" }, { at: 6, title: "Thank you", rows: [["Order", "Paid"], ["Arrives", "Thursday"]], done: true }, { at: 13, title: "On its way", rows: [["Green dress, M", "Sent"], ["Arrives", "Thursday"]], done: true }],
    mine: [{ at: 4, text: "Phone in the other room" }, { at: 13, text: "11 messages, start at the bottom" }, { at: 16, text: "Customer gone" }],
    ours: [{ at: 6, text: "New order, paid", good: true }, { at: 8, text: "Stock for M: 3 to 2", good: true }, { at: 13, text: "Label printed, parcel sent", good: true }],
    endBad: "She bought it somewhere else.", endGood: "Paid while you were having dinner.",
  },
  {
    id: "book", tab: "Someone wants to book", customer: "A patient wants to come in this week", clock: from(9, 2), service: "Software & Product Development",
    chat: [{ at: 0.5, who: "customer", text: "can I come on Thursday?" }, { at: 3, who: "shop", text: "let me check with the front desk" }, { at: 6, who: "customer", text: "morning is better" }, { at: 9, who: "shop", text: "10:15 ok?" }, { at: 11, who: "customer", text: "yes!" }, { at: 13, who: "shop", text: "sorry, 10:15 just went. 4pm?" }, { at: 16, who: "customer", text: "I'm at work at 4" }],
    app: [{ at: 0.5, title: "Thursday", rows: [["10:15", "Free"], ["11:00", "Free"], ["4:00", "Free"]], button: "Choose 10:15" }, { at: 3, title: "Booked", rows: [["Thursday", "10:15 am"], ["Reminder", "Wednesday"]], done: true }],
    mine: [{ at: 3, text: "Walks to the front desk" }, { at: 9, text: "Two phones, one diary" }, { at: 13, text: "Same slot given twice" }],
    ours: [{ at: 3, text: "10:15 booked, and closed to others", good: true }, { at: 9, text: "Reminder set for Wednesday", good: true }, { at: 13, text: "Nobody had to call anybody", good: true }],
    endBad: "Sixteen minutes, and still no visit.", endGood: "Booked in under a minute.",
  },
  {
    id: "price", tab: "Someone wants a price", customer: "Someone wants a flat cleaned", clock: from(11, 30, 4 * 60), service: "AI Development",
    chat: [{ at: 0.5, who: "customer", text: "how much for a 2 bed flat?" }, { at: 3, who: "shop", text: "depends, can you describe it?" }, { at: 5, who: "customer", text: "normal? one bathroom is bad" }, { at: 8, who: "shop", text: "will call you after lunch" }, { at: 13, who: "wait", text: "Missed call, 4:12 pm" }, { at: 15, who: "customer", text: "already found someone, thanks" }],
    app: [{ at: 0.5, title: "Send a photo", rows: [["Bathroom", "1 photo"], ["Kitchen", "1 photo"]], button: "Get my price" }, { at: 4, title: "Your price", rows: [["Kitchen", "1 h"], ["Bathroom, deep", "2 h"], ["Travel", "included"]], button: "Book tomorrow" }, { at: 8, title: "Booked", rows: [["Tomorrow", "9:00 am"], ["Who", "Meera, verified"]], done: true }],
    mine: [{ at: 3, text: "Guesses from a description" }, { at: 8, text: "Adds it to the list for later" }, { at: 15, text: "Job lost" }],
    ours: [{ at: 4, text: "AI read two photos and priced the job", good: true }, { at: 8, text: "Booked, nearest person assigned", good: true }, { at: 13, text: "Calendar is up to date", good: true }],
    endBad: "Four hours to lose a job.", endGood: "Priced and booked before lunch.",
  },
];
const LENGTH = 18;

/** Concept 6: the same customer, at the same minute, two ways. */
export default function TwoWays() {
  return (
    <div style={FONT}>
      <Duel />
      <WorkReel look={{ ...LOOK, bg: "#ffffff" }} title="The second way, already running" />
      <ProblemList look={LOOK} title="Which minute are you losing?" />
      <StepLine look={{ ...LOOK, bg: "#ffffff" }} title="How we get you to the second way" />
      <Closing look={{ ...LOOK, bg: "#0c5c46", ink: "#f2fff9", accent: "#fff", onAccent: "#0c5c46" }} title="The next message is already on its way." text="Let us make sure something answers it." />
    </div>
  );
}

function Duel() {
  const reduced = useReducedMotion();
  const [ref, seen] = useSeen<HTMLDivElement>(0.2);
  const [story, setStory] = useState(STORIES[0]);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const last = useRef(0);

  useEffect(() => {
    if (reduced) {
      setT(LENGTH);
      setPlaying(false);
    }
  }, [reduced]);

  useEffect(() => {
    if (!playing || !seen) return;
    let raf = 0;
    let shown = -1;
    last.current = performance.now();
    let now = t;
    const tick = (ms: number) => {
      raf = requestAnimationFrame(tick);
      now += Math.min(0.1, (ms - last.current) / 1000) * 1.25;
      last.current = ms;
      if (now > LENGTH + 4) now = 0;
      const q = Math.round(Math.min(now, LENGTH) * 10) / 10;
      if (q !== shown) {
        shown = q;
        setT(q);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Restarts only when play, story or visibility changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, seen, story]);

  const over = t >= LENGTH - 0.6;
  return (
    <section className="bg-[#eef2f6] text-[#1d232d]">
      <div ref={ref} className="mx-auto max-w-[1640px] px-5 pb-16 pt-24 md:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className={cn("text-[clamp(2.4rem,4.3vw,4.6rem)] leading-[0.96]", HEAD)}>Same customer. Same minute.<br className="max-sm:hidden" /> Two ways.</h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#1d232d]/75">Watch one message, without Kiwik and with the software we build.</p>
          </div>
          <Cta look={LOOK}>Start a project</Cta>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {STORIES.map((s) => <button key={s.id} type="button" aria-pressed={s.id === story.id} onClick={() => { setStory(s); setT(reduced ? LENGTH : 0); setPlaying(!reduced); }} className={cn("cursor-pointer rounded-full px-5 py-2.5 text-base font-bold transition-colors", s.id === story.id ? "bg-[#1d232d] text-white" : "bg-white hover:bg-white/60")}>{s.tab}</button>)}
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <Side tone="bad" title="Without" end={over ? story.endBad : ""} notes={story.mine.filter((n) => n.at <= t)}>
            <Device tone="bad" clock={story.clock(t)}><Chat bubbles={story.chat.filter((b) => b.at <= t)} /></Device>
          </Side>
          <Side tone="good" title="With Kiwik" end={over ? story.endGood : ""} notes={story.ours.filter((n) => n.at <= t)}>
            <Device tone="good" clock={story.clock(t)}><App screen={[...story.app].reverse().find((s) => s.at <= t) || story.app[0]} /></Device>
          </Side>
        </div>

        <div className="mt-4 flex items-center gap-5 rounded-full bg-white px-4 py-2.5 sm:px-6">
          <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => { if (!playing && t >= LENGTH) setT(0); setPlaying(!playing); }} className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1d232d] text-white">{playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}</button>
          <input type="range" min={0} max={LENGTH} step={0.1} value={t} aria-label="Time in the story" aria-valuetext={story.clock(t)} onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} className="h-2 min-w-0 flex-1 cursor-pointer accent-[#0c8f68]" />
          <span className={cn("w-24 shrink-0 text-right text-xl tabular-nums sm:w-32 sm:text-2xl", HEAD)}>{story.clock(t)}</span>
        </div>
      </div>
    </section>
  );
}

function Side({ tone, title, end, notes, children }: { tone: "bad" | "good"; title: string; end: string; notes: Note[]; children: React.ReactNode }) {
  const good = tone === "good";
  return (
    <div className={cn("relative grid items-center gap-6 overflow-hidden rounded-[36px] p-6 sm:grid-cols-[auto_1fr] sm:p-6", good ? "bg-[#0c8f68] text-white" : "bg-[#cfd5dd]")}>
      {children}
      <div className="min-h-[200px] self-stretch sm:flex sm:flex-col sm:justify-center">
        <h2 className={cn("text-4xl sm:text-5xl", HEAD)}>{title}</h2>
        <p className={cn("mt-1 text-base font-semibold", good ? "text-white/80" : "text-[#1d232d]/65")}>What you see</p>
        <ul className="mt-4 space-y-2.5">
          <AnimatePresence initial={false}>
            {notes.map((n) => (
              <motion.li key={n.text} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn("flex w-fit items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold", good ? "bg-white text-[#0c5c46]" : "bg-[#b9c1cb]")}>
                {n.good ? <Check className="h-5 w-5 shrink-0" aria-hidden="true" /> : <X className="h-5 w-5 shrink-0 text-[#a3372a]" aria-hidden="true" />}{n.text}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <p aria-live="polite" className={cn("mt-5 min-h-[3.4rem] text-2xl leading-tight transition-opacity duration-500", HEAD, end ? "opacity-100" : "opacity-0")}>{end}</p>
      </div>
    </div>
  );
}

function Device({ tone, clock, children }: { tone: "bad" | "good"; clock: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[256px] shrink-0 rounded-[44px] bg-[#14181f] p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
      <div className={cn("relative flex h-[500px] flex-col lg:h-[min(500px,48svh)] overflow-hidden rounded-[37px]", tone === "good" ? "bg-white" : "bg-[#e9edf1]")}>
        <div className="flex items-center justify-between px-6 pt-3.5 text-sm font-bold tabular-nums text-[#1d232d]"><span>{clock.replace(/ [ap]m/, "")}</span><span aria-hidden="true" className="h-5 w-20 rounded-full bg-[#14181f]" /><span aria-hidden="true" className="h-2.5 w-6 rounded-sm border-2 border-[#1d232d]" /></div>
        {children}
      </div>
    </div>
  );
}

function Chat({ bubbles }: { bubbles: Bubble[] }) {
  return (
    <div className="flex flex-1 flex-col justify-end gap-2 p-4 text-[#1d232d]">
      <AnimatePresence initial={false}>
        {bubbles.slice(-7).map((b) => (
          <motion.p layout key={b.text} initial={{ y: 24, opacity: 0, scale: 0.94 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className={cn(b.who === "wait" ? "text-right text-xs text-[#1d232d]/60" : "w-fit max-w-[86%] rounded-[20px] px-4 py-2.5 text-[15px] leading-snug", b.who === "customer" && "ml-auto rounded-br-md bg-[#cfe3ff]", b.who === "shop" && "rounded-bl-md bg-white")}>{b.text}</motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

function App({ screen }: { screen: Screen }) {
  return (
    <div className="relative flex flex-1 flex-col p-4 pt-6 text-[#1d232d]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={screen.title} initial={{ x: 46, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -46, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="flex flex-1 flex-col">
          <div className={cn("relative flex h-[112px] shrink items-center justify-center overflow-hidden rounded-[26px]", screen.done ? "bg-[#0c8f68]" : "bg-[#d8f1e7]")}>
            {screen.done ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0c8f68]"><Check className="h-10 w-10" strokeWidth={3} /></motion.span>
            ) : (
              <><span aria-hidden="true" className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#0c8f68]/25" /><span aria-hidden="true" className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#0c8f68]/40" /></>
            )}
          </div>
          <p className={cn("mt-5 text-3xl", HEAD)}>{screen.title}</p>
          <ul className="mt-3 divide-y divide-[#1d232d]/10">{screen.rows.map(([a, b]) => <li key={a} className="flex justify-between gap-3 py-2.5 text-[15px]"><span className="text-[#1d232d]/70">{a}</span><span className="text-right font-bold">{b}</span></li>)}</ul>
          {screen.button && <span className="mt-auto rounded-full bg-[#1d232d] py-4 text-center text-base font-bold text-white">{screen.button}</span>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
