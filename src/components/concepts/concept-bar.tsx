"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CONCEPTS } from "./list";

/** Moves between the concepts. Left and right arrow keys work too. */
export function ConceptBar({ id }: { id: number }) {
  const router = useRouter();
  const n = CONCEPTS.length;
  const prev = ((id - 2 + n) % n) + 1;
  const next = (id % n) + 1;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("input,textarea,select,[role=slider],[data-keys]")) return;
      if (e.key === "ArrowLeft") router.push(`/concepts/${prev}`);
      if (e.key === "ArrowRight") router.push(`/concepts/${next}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev, next]);
  const btn = "flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/15 transition-colors";
  return (
    <nav aria-label="Concepts" className="fixed bottom-4 right-4 z-[70] flex items-center gap-1 rounded-full bg-[#0c1030]/95 p-1.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <Link href={`/concepts/${prev}`} aria-label="Previous concept" className={btn}><ChevronLeft className="h-5 w-5" /></Link>
      <Link href="/concepts" className="px-2 text-sm font-semibold whitespace-nowrap"><span className="tabular-nums">{id} / {n}</span> <span className="max-sm:hidden">{CONCEPTS[id - 1].name}</span></Link>
      <Link href={`/concepts/${next}`} aria-label="Next concept" className={btn}><ChevronRight className="h-5 w-5" /></Link>
    </nav>
  );
}
