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

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      lerp: 0.12,
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
