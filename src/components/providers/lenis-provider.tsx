"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // The admin CMS studio manages its own internal panel scrolling
    if (pathname?.startsWith("/admin")) return;

    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Disable Lenis on touch/mobile devices to preserve 100% native 120Hz/60Hz touch scrolling without lag
    const isTouchOrMobile = typeof window !== "undefined" && (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768
    );
    if (isTouchOrMobile) return;

    // `duration`/`easing` are ignored whenever `lerp` is set, so only `lerp` is
    // given here. It is the whole feel of the scroll: the fraction of the
    // remaining distance covered each frame. The previous 0.12 needed ~18
    // frames to close a gap, which reads as the scroll trailing behind the
    // wheel. 0.2 still glides but tracks the input closely.
    const lenis = new Lenis({
      lerp: 0.2,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
