"use client";

import React from "react";
import { HeroShell, GLSlot } from "./hero-shell";
import { MINI_CSS, MINI_SCREENS } from "./mini-ui";

/** Without WebGL: the same three things, flat. */
function Flat() {
  const pick = [MINI_SCREENS[3], MINI_SCREENS[7], MINI_SCREENS[4]];
  return (
    <div className="flex h-full items-center justify-center gap-3 sm:gap-6 px-4">
      <style>{MINI_CSS}</style>
      {pick.map(({ name, View }, i) => (
        <div key={name} className={i === 1 ? "h-[85%] w-[46%] max-w-[520px]" : "h-[62%] w-[24%] max-w-[240px]"}>
          <div className="h-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_24px_60px_-24px_rgba(20,26,58,.45)]"><View /></div>
        </div>
      ))}
    </div>
  );
}

/** Concept 14: a laptop, a phone and a tablet, each running something we would build for you. */
export default function Devices() {
  return (
    <HeroShell>
      <GLSlot load={() => import("./c14-canvas") as never} fallback={<Flat />} />
    </HeroShell>
  );
}
