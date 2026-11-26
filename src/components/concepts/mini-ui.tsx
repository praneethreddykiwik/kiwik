"use client";

import React from "react";
import { Check, MessageCircle, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";

/**
 * Small, drawn product screens: the kind of software Kiwik builds, in place of
 * stock photos. Each fills its parent and moves on its own with CSS only.
 */

export const MINI_CSS = `
@keyframes mu-grow { 0%,10% { transform: scaleY(.15) } 55%,100% { transform: scaleY(1) } }
@keyframes mu-type { 0%,15% { width: 0 } 60%,100% { width: var(--w,100%) } }
@keyframes mu-pop { 0%,30% { opacity: 0; transform: translateY(6px) scale(.96) } 45%,100% { opacity: 1; transform: none } }
@keyframes mu-run { 0% { offset-distance: 0% } 100% { offset-distance: 100% } }
@keyframes mu-scan { 0% { top: 8% } 50% { top: 84% } 100% { top: 8% } }
@keyframes mu-fill { 0%,20% { width: 8% } 70%,100% { width: var(--w,80%) } }
@keyframes mu-stamp { 0%,55% { opacity: 0; transform: rotate(-14deg) scale(1.6) } 65%,100% { opacity: 1; transform: rotate(-14deg) scale(1) } }
@keyframes mu-dot { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
.mu * { animation-duration: 4.8s; animation-iteration-count: infinite; animation-timing-function: cubic-bezier(.22,1,.36,1) }
@media (prefers-reduced-motion: reduce) { .mu * { animation: none !important } }
`;

const Card = ({ title, children, tone = "#ffffff" }: { title: string; children: React.ReactNode; tone?: string }) => (
  <div className="mu flex h-full w-full flex-col overflow-hidden rounded-[inherit] text-left text-[#141a3a]" style={{ background: tone }}>
    <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-3 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
      <span className="ml-1.5 truncate text-[10px] font-bold tracking-tight text-black/55 sm:text-[11px]">{title}</span>
    </div>
    <div className="relative flex-1 p-3">{children}</div>
  </div>
);

const Line = ({ w = "70%", c = "#e6e9f2", h = 6, delay = 0, type = false }: { w?: string; c?: string; h?: number; delay?: number; type?: boolean }) => (
  <div className="rounded-full" style={{ width: type ? undefined : w, height: h, background: c, ["--w" as string]: w, animationName: type ? "mu-type" : undefined, animationDelay: `${delay}s` }} />
);

function Booking() {
  const taken = [1, 4, 6, 9, 11, 14, 17, 18];
  return (
    <Card title="Table bookings">
      <div className="text-[11px] font-bold">Friday</div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-5 rounded-md sm:h-7" style={{ background: taken.includes(i) ? "#1a2150" : "#eef1f8", animationName: taken.includes(i) ? "mu-pop" : undefined, animationDelay: `${(i % 7) * 0.18}s` }} />
        ))}
      </div>
      <div className="absolute inset-x-3 bottom-3 rounded-lg bg-[#0d8a80] px-2 py-1.5 text-[10px] font-bold text-white" style={{ animationName: "mu-pop", animationDelay: "1.2s" }}>8 new bookings today</div>
    </Card>
  );
}

function Assistant() {
  return (
    <Card title="AI assistant">
      <div className="flex flex-col gap-2 text-[10px] leading-snug sm:text-[11px]">
        <div className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-[#1a2150] px-2.5 py-1.5 text-white">Is my order shipped?</div>
        <div className="flex max-w-[86%] items-start gap-1.5" style={{ animationName: "mu-pop", animationDelay: ".6s" }}>
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#6b5cff]" />
          <div className="rounded-2xl rounded-tl-sm bg-[#eef0ff] px-2.5 py-1.5">Yes. It left this morning and arrives Thursday.</div>
        </div>
        <div className="max-w-[70%] self-end rounded-2xl rounded-br-sm bg-[#1a2150] px-2.5 py-1.5 text-white" style={{ animationName: "mu-pop", animationDelay: "1.4s" }}>Thank you!</div>
        <div className="flex gap-1 pl-5">
          {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#6b5cff]" style={{ animationName: "mu-dot", animationDuration: "1.2s", animationDelay: `${i * 0.2}s` }} />)}
        </div>
      </div>
    </Card>
  );
}

function Store() {
  return (
    <Card title="Online store">
      <div className="grid grid-cols-2 gap-2">
        {["#ffd7c2", "#c9e9df", "#d9dcff", "#fbe7a1"].map((c, i) => (
          <div key={c} className="rounded-lg p-1.5" style={{ background: "#f6f7fb" }}>
            <div className="h-8 rounded-md sm:h-14" style={{ background: c }} />
            <Line w="70%" h={4} />
            <div className="mt-1 text-[9px] font-bold">₹{(i + 2) * 450}</div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-[#1a2150] px-2.5 py-1 text-[10px] font-bold text-white" style={{ animationName: "mu-pop", animationDelay: "1s" }}>
        <ShoppingBag className="h-3 w-3" /> 3 in cart
      </div>
    </Card>
  );
}

function Sales() {
  const bars = [35, 48, 42, 60, 55, 74, 88];
  return (
    <Card title="Sales this week">
      <div className="text-lg font-black tracking-tight sm:text-2xl">+38%</div>
      <div className="text-[10px] text-black/50">orders since launch</div>
      <div className="absolute inset-x-3 bottom-3 flex h-[45%] items-end gap-1.5">
        {bars.map((b, i) => <div key={i} className="flex-1 origin-bottom rounded-t-md" style={{ height: `${b}%`, background: i === bars.length - 1 ? "#0d8a80" : "#c9d3ee", animationName: "mu-grow", animationDelay: `${i * 0.08}s` }} />)}
      </div>
    </Card>
  );
}

function Delivery() {
  const path = "M 12 90 C 40 20, 80 110, 110 50 S 170 20, 188 30";
  return (
    <Card title="Delivery tracking" tone="#f7fbfa">
      <svg viewBox="0 0 200 120" className="h-[70%] w-full">
        <path d={path} fill="none" stroke="#cfe5e1" strokeWidth="8" strokeLinecap="round" />
        <path d={path} fill="none" stroke="#0d8a80" strokeWidth="2.5" strokeDasharray="4 6" />
        <circle cx="188" cy="30" r="6" fill="#1a2150" />
      </svg>
      <div className="absolute left-3 top-[20%] h-6 w-6 rounded-full bg-white shadow-md" style={{ offsetPath: `path("${path}")`, animationName: "mu-run" } as React.CSSProperties}>
        <Truck className="m-1 h-4 w-4 text-[#0d8a80]" />
      </div>
      <div className="absolute inset-x-3 bottom-3 text-[10px] font-bold">Arriving in 12 min</div>
    </Card>
  );
}

function Invoice() {
  return (
    <Card title="Invoices">
      <div className="flex flex-col gap-2">
        <Line w="45%" c="#1a2150" h={7} />
        {[80, 65, 72, 50].map((w, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <Line w={`${w}%`} />
            <Line w="14%" c="#d6dbe8" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 rounded-md border-2 border-[#12a67a] px-2 py-0.5 text-sm font-black tracking-widest text-[#12a67a]" style={{ animationName: "mu-stamp" }}>PAID</div>
    </Card>
  );
}

function Tasks() {
  const cols = [["#ffd7c2", "#d9dcff", "#fbe7a1"], ["#c9e9df", "#d9dcff"], ["#c9e9df"]];
  return (
    <Card title="Team tasks">
      <div className="grid h-full grid-cols-3 gap-1.5">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1.5 rounded-md bg-[#f3f5fa] p-1">
            <div className="text-[8px] font-bold text-black/45 sm:text-[9px]">{["To do", "Doing", "Done"][ci]}</div>
            {col.map((c, i) => <div key={i} className="h-5 rounded sm:h-8" style={{ background: c, animationName: ci === 2 ? "mu-pop" : undefined, animationDelay: "1s" }} />)}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Website() {
  return (
    <Card title="yourbusiness.com">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-10 rounded bg-[#1a2150]" />
        <div className="flex gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-1.5 w-6 rounded bg-[#d6dbe8]" />)}</div>
      </div>
      <div className="mt-4 flex flex-col gap-1.5">
        <Line w="85%" c="#1a2150" h={9} type />
        <Line w="60%" c="#1a2150" h={9} type delay={0.4} />
        <div className="mt-1"><Line w="75%" h={5} /></div>
      </div>
      <div className="mt-3 inline-block rounded-full bg-[#0d8a80] px-3 py-1 text-[9px] font-bold text-white" style={{ animationName: "mu-pop", animationDelay: "1.2s" }}>Book now</div>
      <div className="absolute inset-x-3 bottom-3 h-[22%] rounded-lg bg-gradient-to-r from-[#d9dcff] to-[#c9e9df]" />
    </Card>
  );
}

function Security() {
  return (
    <Card title="Security check" tone="#0f1430">
      <div className="flex h-full flex-col items-center justify-center text-white">
        <ShieldCheck className="h-10 w-10 text-[#5ee0d0] sm:h-14 sm:w-14" />
        <div className="mt-2 text-[11px] font-bold">All 214 checks passed</div>
        <div className="text-[9px] text-white/50">Logins, data and payments</div>
      </div>
      <div className="absolute inset-x-3 h-px bg-[#5ee0d0] shadow-[0_0_12px_#5ee0d0]" style={{ animationName: "mu-scan", animationTimingFunction: "linear" }} />
    </Card>
  );
}

function Report() {
  return (
    <Card title="AI summary">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6b5cff]"><Sparkles className="h-3 w-3" /> 212 emails read for you</div>
      <div className="mt-3 flex flex-col gap-2">
        {["90%", "75%", "84%", "60%"].map((w, i) => <Line key={i} w={w} type delay={i * 0.35} c={i === 0 ? "#c9c2ff" : "#e6e9f2"} />)}
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-1 text-[10px] font-bold text-[#12a67a]" style={{ animationName: "mu-pop", animationDelay: "1.8s" }}><Check className="h-3 w-3" /> 3 need a reply</div>
    </Card>
  );
}

function Stock() {
  const rows: [string, string, string][] = [["Rice 25kg", "82%", "#0d8a80"], ["Olive oil", "34%", "#e2a33a"], ["Basmati", "64%", "#0d8a80"], ["Saffron", "12%", "#e5484d"]];
  return (
    <Card title="Stock levels">
      <div className="flex flex-col gap-2.5">
        {rows.map(([n, w, c]) => (
          <div key={n}>
            <div className="mb-1 flex justify-between text-[9px] font-bold sm:text-[10px]"><span>{n}</span><span className="text-black/45">{w}</span></div>
            <div className="h-1.5 rounded-full bg-[#eef1f8]"><div className="h-full rounded-full" style={{ background: c, ["--w" as string]: w, width: w, animationName: "mu-fill" }} /></div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Support() {
  return (
    <Card title="Customer messages">
      {["Priya", "Omar", "Lena", "Kabir"].map((n, i) => (
        <div key={n} className="mb-2 flex items-center gap-2" style={{ animationName: "mu-pop", animationDelay: `${i * 0.3}s` }}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: ["#1a2150", "#0d8a80", "#6b5cff", "#e2a33a"][i] }}>{n[0]}</div>
          <div className="flex-1"><div className="text-[10px] font-bold">{n}</div><Line w="80%" h={4} /></div>
          {i < 2 && <MessageCircle className="h-3 w-3 text-[#0d8a80]" />}
        </div>
      ))}
    </Card>
  );
}

export const MINI_SCREENS: { name: string; View: () => React.ReactElement }[] = [
  { name: "Booking system", View: Booking },
  { name: "AI assistant", View: Assistant },
  { name: "Online store", View: Store },
  { name: "Sales dashboard", View: Sales },
  { name: "Delivery app", View: Delivery },
  { name: "Invoicing", View: Invoice },
  { name: "Team tool", View: Tasks },
  { name: "Website", View: Website },
  { name: "Cybersecurity", View: Security },
  { name: "AI reports", View: Report },
  { name: "Stock control", View: Stock },
  { name: "Customer inbox", View: Support },
];
