"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, Sparkles, ShoppingBag } from "lucide-react";
import { HeroShell, SLOT } from "./hero-shell";

interface Build {
  file: string;
  url: string;
  code: string[];
  View: ({ step }: { step: number }) => React.ReactElement;
}

const pop = (on: boolean) => `transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`;

const BUILDS: Build[] = [
  {
    file: "booking.tsx",
    url: "rosecafe.com/book",
    code: ["<Page title=\"Book a table\">", "  <DatePicker days={14} />", "  <Times from=\"18:00\" to=\"22:00\" />", "  <Guests max={8} />", "  <Confirm sendSMS />", "</Page>"],
    View: ({ step }) => (
      <div className="flex h-full flex-col gap-3 p-4 sm:p-6 text-left">
        <div className={`${pop(step > 0)} text-lg sm:text-2xl font-serif font-semibold text-[#141a3a]`}>Book a table</div>
        <div className={`${pop(step > 1)} grid grid-cols-7 gap-1`}>{Array.from({ length: 14 }).map((_, i) => <div key={i} className={`h-6 sm:h-7 rounded-md text-[9px] sm:text-[10px] font-bold flex items-center justify-center ${i === 4 ? "bg-[#1a2150] text-white" : "bg-[#eef1f8] text-[#141a3a]"}`}>{i + 12}</div>)}</div>
        <div className={`${pop(step > 2)} flex flex-wrap gap-1.5`}>{["18:00", "19:30", "20:00", "21:15"].map((t, i) => <span key={t} className={`rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold ${i === 1 ? "bg-[#0d8a80] text-white" : "bg-[#eef1f8] text-[#141a3a]"}`}>{t}</span>)}</div>
        <div className={`${pop(step > 3)} text-xs sm:text-sm text-[#141a3a]`}>Guests: <b>4</b></div>
        <div className={`${pop(step > 4)} mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#1a2150] py-2.5 text-xs sm:text-sm font-bold text-white`}><CalendarCheck className="h-4 w-4" /> Confirm booking</div>
      </div>
    ),
  },
  {
    file: "assistant.ts",
    url: "help.yourshop.com",
    code: ["const agent = new Assistant({", "  knows: [orders, products, faq],", "  tone: \"friendly\",", "  handOff: humanTeam,", "})", "agent.reply(customer)"],
    View: ({ step }) => (
      <div className="flex h-full flex-col gap-2.5 p-4 sm:p-6 text-left text-xs sm:text-sm">
        <div className={`${pop(step > 0)} self-end rounded-2xl rounded-br-sm bg-[#1a2150] px-3 py-2 text-white`}>Where is my order #2041?</div>
        <div className={`${pop(step > 1)} flex items-start gap-2`}><Sparkles className="mt-1 h-3.5 w-3.5 text-[#6b5cff]" /><div className="rounded-2xl rounded-tl-sm bg-[#eef0ff] px-3 py-2 text-[#141a3a]">It shipped today and arrives Thursday.</div></div>
        <div className={`${pop(step > 2)} self-end rounded-2xl rounded-br-sm bg-[#1a2150] px-3 py-2 text-white`}>Can I change the address?</div>
        <div className={`${pop(step > 3)} flex items-start gap-2`}><Sparkles className="mt-1 h-3.5 w-3.5 text-[#6b5cff]" /><div className="rounded-2xl rounded-tl-sm bg-[#eef0ff] px-3 py-2 text-[#141a3a]">Done. The courier has the new one.</div></div>
        <div className={`${pop(step > 4)} mt-auto text-[10px] sm:text-xs text-[#0d8a80] font-bold`}>Answered in 2 seconds, day or night</div>
      </div>
    ),
  },
  {
    file: "store.tsx",
    url: "sowcha.store",
    code: ["<Store currency=\"INR\">", "  <Products grid={3} />", "  <Cart />", "  <Checkout upi cards />", "  <TrackOrder />", "</Store>"],
    View: ({ step }) => (
      <div className="flex h-full flex-col gap-3 p-4 sm:p-6 text-left">
        <div className={`${pop(step > 0)} grid grid-cols-3 gap-2`}>{["#ffd7c2", "#c9e9df", "#d9dcff"].map((c, i) => <div key={c} className="rounded-lg bg-[#f6f7fb] p-1.5"><div className="h-10 sm:h-16 rounded-md" style={{ background: c }} /><div className="mt-1 text-[9px] sm:text-[11px] font-bold text-[#141a3a]">₹{(i + 2) * 600}</div></div>)}</div>
        <div className={`${pop(step > 1)} flex items-center justify-between rounded-lg bg-[#f6f7fb] px-3 py-2 text-xs font-bold text-[#141a3a]`}><span className="flex items-center gap-1.5"><ShoppingBag className="h-3.5 w-3.5" /> 2 items</span><span>₹3,000</span></div>
        <div className={`${pop(step > 2)} flex gap-1.5`}>{["UPI", "Card", "COD"].map((p, i) => <span key={p} className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${i === 0 ? "bg-[#0d8a80] text-white" : "bg-[#eef1f8] text-[#141a3a]"}`}>{p}</span>)}</div>
        <div className={`${pop(step > 3)} mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#1a2150] py-2.5 text-xs sm:text-sm font-bold text-white`}>Pay ₹3,000 <ArrowRight className="h-4 w-4" /></div>
        <div className={`${pop(step > 4)} text-center text-[10px] sm:text-xs font-bold text-[#12a67a]`}>Order placed. Tracking sent by SMS.</div>
      </div>
    ),
  },
];

const CHAR_MS = 28;

/** Concept 16: on the left, code being written; on the right, the product it becomes, line by line. */
export default function CodeToProduct() {
  const [b, setB] = useState(0);
  const [chars, setChars] = useState(0);
  const build = BUILDS[b];
  const total = build.code.join("\n").length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChars(total);
      return;
    }
    const id = setInterval(() => {
      setChars((c) => {
        if (c < total + 60) return c + 1;
        setB((x) => (x + 1) % BUILDS.length);
        return 0;
      });
    }, CHAR_MS);
    return () => clearInterval(id);
  }, [total]);

  // How many lines are finished: each one adds a piece on the right.
  let left = chars;
  let step = 0;
  const lines = build.code.map((l) => {
    const shown = l.slice(0, Math.max(0, left));
    if (left >= l.length) step++;
    left -= l.length + 1;
    return shown;
  });

  return (
    <HeroShell>
      <div className={`${SLOT} flex items-center justify-center gap-3 sm:gap-8 px-3 [perspective:1600px]`}>
        <div aria-hidden="true" className="h-[86%] w-[48%] max-w-[600px] overflow-hidden rounded-2xl bg-[#0f1430] text-left shadow-[0_30px_80px_-30px_rgba(15,20,48,.7)] [transform:rotateY(16deg)] origin-right">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[10px] sm:text-xs text-white/50">{build.file}</span>
          </div>
          <pre className="p-3 sm:p-5 font-mono text-[9px] leading-[1.7] sm:text-[13px] text-[#c9d1ff] whitespace-pre-wrap">
            {lines.map((l, i) => (
              <div key={i} className="flex gap-3 sm:gap-4">
                <span className="w-4 text-right text-white/25">{i + 1}</span>
                <span>
                  {l.replace(/(".*?"|\{.*?\})/g, "\u0000$1\u0000").split("\u0000").map((part, k) => (
                    <span key={k} className={k % 2 ? "text-[#5ee0d0]" : ""}>{part}</span>
                  ))}
                  {i === lines.findIndex((x, j) => x.length < build.code[j].length) && <span className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[2px] animate-pulse bg-[#5ee0d0]" />}
                </span>
              </div>
            ))}
          </pre>
        </div>
        <div className="h-[86%] w-[42%] max-w-[480px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white text-left shadow-[0_30px_80px_-30px_rgba(20,26,58,.45)] [transform:rotateY(-14deg)] origin-left" aria-live="polite">
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-3 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-1 flex-1 truncate rounded-md bg-[#f3f5fa] px-2 py-0.5 text-[10px] sm:text-xs text-black/50">{build.url}</span>
          </div>
          <div className="h-[calc(100%-38px)]"><build.View step={step} /></div>
        </div>
      </div>
    </HeroShell>
  );
}
