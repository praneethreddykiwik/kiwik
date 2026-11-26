import React from "react";

/** The top of every inside page: what it is, in one line, and what a client gets from it. */
export function PageIntro({ title, lead, points, children }: { title: React.ReactNode; lead: string; points?: string[]; children?: React.ReactNode }) {
  return (
    <header className="mx-auto max-w-[1400px] px-4 pt-14 pb-12 sm:px-6 sm:pt-20 md:px-8 md:pb-16">
      <h1 className="max-w-4xl text-4xl sm:text-6xl font-serif font-bold leading-[1.06] tracking-tight text-text-primary text-balance">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed text-text-secondary text-pretty">{lead}</p>
      {points && (
        <ul className="mt-7 flex flex-col gap-x-8 gap-y-2.5 sm:flex-row sm:flex-wrap">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-base font-semibold text-text-primary">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#008080]" />
              {p}
            </li>
          ))}
        </ul>
      )}
      {children && <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{children}</div>}
    </header>
  );
}

export const primaryButton =
  "inline-flex items-center gap-2 rounded-full bg-[#1a2150] dark:bg-white px-7 py-3.5 text-base font-bold text-white dark:text-[#10142e] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]";
export const textLink =
  "text-base font-bold text-text-primary underline decoration-[#008080]/50 decoration-2 underline-offset-[6px] hover:decoration-[#008080] transition-colors";
