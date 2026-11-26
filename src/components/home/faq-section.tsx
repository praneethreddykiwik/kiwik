import React from "react";
import { Plus } from "lucide-react";
import { FAQ, FAQ_TITLE } from "@/data/home-content";

export function FaqSection() {
  return (
    <section id="faq" className="relative z-20 mx-auto grid max-w-[1400px] scroll-mt-24 gap-8 px-4 py-16 sm:px-6 md:px-8 md:py-24 lg:grid-cols-[1fr_1.6fr]">
      <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-[1.08] text-text-primary text-balance">{FAQ_TITLE}</h2>
      <div className="divide-y divide-text-primary/10 border-y border-text-primary/10">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
              {q}
              <Plus className="h-5 w-5 shrink-0 text-[#007a78] transition-transform duration-300 group-open:rotate-45 dark:text-[#4fc3bd]" aria-hidden="true" />
            </summary>
            <p className="max-w-2xl pb-6 text-base leading-relaxed text-text-secondary text-pretty">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
