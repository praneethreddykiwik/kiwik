"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInView, useReducedMotion } from "framer-motion";
import { CASE_NOTES, projectState, type CaseNote } from "@/data/case-notes";
import { optimizedImage } from "@/lib/media";
import { useProjects } from "@/stores/projects-store";

export interface Work {
  slug: string;
  name: string;
  cover: string;
  note: CaseNote;
  state: string;
}

const ORDER = ["helm-events", "fooducia", "clean-ai", "sowcha"];

/** Kiwik's published products, with their stories. */
export function useWork(): Work[] {
  const projects = useProjects();
  return ORDER.flatMap((slug) => {
    const p = projects.find((x) => x.slug === slug && (x as { visible?: boolean }).visible !== false);
    return p?.coverImage && CASE_NOTES[slug] ? [{ slug, name: p.name, cover: p.coverImage, note: CASE_NOTES[slug], state: projectState(p) }] : [];
  });
}

/** Exactly n items, repeating from the start if there are fewer, so a 3D scene built for four still runs with one. */
export function fourOf<T>(xs: T[], n = 4): T[] {
  return xs.length ? Array.from({ length: n }, (_, i) => xs[i % xs.length]) : [];
}

export function Shot({ work, className }: { work: Work; className?: string }) {
  return (
    <img
      src={optimizedImage(work.cover, 1200)}
      onError={(e) => {
        if (e.currentTarget.getAttribute("src") !== work.cover) e.currentTarget.src = work.cover;
      }}
      alt=""
      loading="lazy"
      className={className}
    />
  );
}

/** Same-origin picture for a WebGL texture. */
export const textureUrl = (work: Work) => optimizedImage(work.cover, 1200);

const BRIEF = "kiwik-brief";
/** Carries what the visitor wrote to the contact form. Kept in the tab, never in the address. */
export function useSendBrief() {
  const router = useRouter();
  return (message: string, service?: string) => {
    try {
      sessionStorage.setItem(BRIEF, message);
    } catch {
      /* the form simply starts empty */
    }
    router.push(service ? `/contact?service=${encodeURIComponent(service)}` : "/contact");
  };
}

/** True once seen; immediately true under reduced motion. */
export function useSeen<T extends Element>(amount = 0.3) {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { once: true, amount });
  return [ref, Boolean(useReducedMotion()) || seen] as const;
}

/** Scroll position through a tall section, 0 to 1, read without re-rendering. */
export function useScrollRef(ref: React.RefObject<HTMLElement | null>, onChange?: (p: number) => void) {
  const progress = useRef(0);
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      progress.current = span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 0;
      cb.current?.(progress.current);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [ref]);
  return progress;
}

export function useIndexByScroll(ref: React.RefObject<HTMLElement | null>, count: number) {
  const [index, setIndex] = useState(0);
  const progress = useScrollRef(ref, (p) => setIndex(Math.min(count - 1, Math.floor(p * count * 0.9999))));
  return [index, progress] as const;
}

/** True once the handwriting on the paperwork can be drawn into a canvas. */
export function useHandFont(ref: React.RefObject<HTMLElement | null>): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let live = true;
    const done = () => live && setOk(true);
    const family = ref.current ? getComputedStyle(ref.current).getPropertyValue("--font-hand").trim() : "";
    const t = setTimeout(done, 2500);
    if (!family || !document.fonts?.load) done();
    else document.fonts.load(`700 40px ${family}`, "call").then(done, done);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [ref]);
  return ok;
}
