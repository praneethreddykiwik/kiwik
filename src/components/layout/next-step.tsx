"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** The path through the site, in the order a client decides. */
const STEPS = [
  { id: "problem", label: "What we build", href: "/#what-we-build" },
  { id: "services", label: "What we can build", href: "/#capabilities" },
  { id: "work", label: "What we have built", href: "/projects" },
  { id: "how", label: "How it works", href: "/#how-we-work" },
  { id: "start", label: "Start a project", href: "/contact" },
];

interface Place {
  at: string;
  text: string;
  next: { label: string; href: string };
}

function placeOf(path: string): Place | null {
  if (path.startsWith("/projects/")) return { at: "work", text: "Need something like this, or something new?", next: { label: "See what we can build", href: "/#capabilities" } };
  if (path === "/projects") return { at: "work", text: "That is what we have built. Here is how we would build yours.", next: { label: "See how it works", href: "/#how-we-work" } };
  if (path === "/partners") return { at: "services", text: "Marketing brings people in. The product makes them stay.", next: { label: "See what we can build", href: "/#capabilities" } };
  if (path.startsWith("/partners/")) return { at: "work", text: "This is one brand we work with.", next: { label: "See what we do for brands", href: "/partners" } };
  if (path === "/about") return { at: "services", text: "You know who we are. See what we have made.", next: { label: "See our work", href: "/projects" } };
  if (path === "/contact") return { at: "start", text: "Still deciding? Look at what we have built first.", next: { label: "See our work", href: "/projects" } };
  return null;
}

/** Closes every inside page with where it leads, so no page is a dead end. */
export function NextStep() {
  const place = placeOf(usePathname() || "");
  if (!place) return null;
  return (
    <section aria-label="Where to go next" className="relative z-20 mx-auto mt-8 w-full max-w-[1400px] px-4 sm:px-6 md:px-8">
      <div className="border-t border-text-primary/10 pt-10 md:pt-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-3xl md:text-4xl font-serif font-bold leading-[1.12] tracking-tight text-text-primary text-balance">{place.text}</h2>
          <Link href={place.next.href} className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border-2 border-[#1a2150] px-6 py-3 text-base font-bold text-text-primary transition-colors hover:bg-[#1a2150] hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#10142e]">
            {place.next.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ol className="mt-10 grid gap-x-3 gap-y-4 sm:grid-cols-5">
          {STEPS.map((s) => {
            const on = s.id === place.at;
            return (
              <li key={s.id}>
                <Link href={s.href} aria-current={on ? "step" : undefined} className="group flex items-center gap-3 sm:block">
                  <span aria-hidden="true" className={cn("block h-1.5 w-10 shrink-0 rounded-full transition-colors sm:w-full", on ? "bg-[#008080]" : "bg-text-primary/12 group-hover:bg-[#008080]/50")} />
                  <span className={cn("block text-base sm:mt-3", on ? "font-bold text-text-primary" : "text-text-secondary group-hover:text-text-primary")}>
                    {s.label}
                    {on && <span className="sr-only"> (you are here)</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
