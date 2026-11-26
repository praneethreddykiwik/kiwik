"use client";

import React from "react";
import { BarChart3, CalendarCheck, MessageCircle } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { HeroShell, GLSlot } from "./hero-shell";

const TAGS = [
  { label: "Orders, live", Icon: BarChart3, at: "left-[6%] top-[18%]" },
  { label: "Bookings this week", Icon: CalendarCheck, at: "right-[8%] top-[8%]" },
  { label: "Messages answered by AI", Icon: MessageCircle, at: "right-[22%] bottom-[10%]" },
];

/** Without WebGL: a still chart. */
function Flat() {
  return (
    <div className="flex h-full items-end justify-center gap-1.5 sm:gap-2 px-6 pb-8 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      {Array.from({ length: 34 }).map((_, i) => (
        <div key={i} className="w-full max-w-[22px] rounded-t-md bg-[#1a2150] dark:bg-[#5ee0d0]" style={{ height: `${20 + (i / 34) * 55 + Math.sin(i * 0.7) * 12}%`, opacity: 0.25 + (i / 34) * 0.75 }} />
      ))}
    </div>
  );
}

/** Concept 18: your business as a living landscape of numbers, the view a good dashboard gives you. */
export default function Data() {
  const dark = useThemeStore((s) => s.mode) === "dark";
  return (
    <HeroShell>
      <div className="relative">
        <GLSlot load={() => import("./c18-canvas") as never} fallback={<Flat />} props={{ dark }} className="[mask-image:radial-gradient(ellipse_70%_80%_at_50%_55%,#000_45%,transparent_85%)]" />
        {TAGS.map(({ label, Icon, at }) => (
          <span key={label} className={`absolute ${at} z-10 hidden sm:flex items-center gap-2 rounded-full border border-glass-border bg-white/80 dark:bg-white/10 px-4 py-2 text-sm font-semibold text-text-primary shadow-[0_14px_40px_-16px_rgba(20,26,58,.4)] backdrop-blur-md`}>
            <Icon className="h-4 w-4 text-[#0d8a80] dark:text-[#5ee0d0]" aria-hidden="true" /> {label}
          </span>
        ))}
      </div>
    </HeroShell>
  );
}
