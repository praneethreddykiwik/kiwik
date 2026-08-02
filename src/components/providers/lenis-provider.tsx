"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // The admin CMS studio manages its own internal panel scrolling — Lenis
    // smooth-scroll hijacks the wheel on the whole window and breaks it.
    if (pathname?.startsWith("/admin")) return;

    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
