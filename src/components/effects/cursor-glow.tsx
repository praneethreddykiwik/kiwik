"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Skip entirely on touch pointers and when the visitor asked for less motion.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;
    setIsDesktop(true);

    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    // The glow is a large composited layer sitting above the whole page; keeping
    // it out of the way while the page scrolls leaves the compositor free to do
    // nothing but scroll.
    const handleScroll = () => {
      setIsVisible(false);
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsVisible(true), 140);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!isDesktop) return null;

  // No `mix-blend-mode` on the layer below: a blended element at this scale forces
  // the compositor to re-blend everything beneath it on every scrolled frame, and
  // over the near-black canvas `screen` looked the same as plain source-over.
  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed top-0 left-0 w-[480px] h-[480px] -ml-[240px] -mt-[240px] rounded-full pointer-events-none z-50 transition-opacity duration-300 will-change-transform"
    >
      <div
        className="w-full h-full rounded-full"
        style={{ background: "radial-gradient(circle at center, hsl(var(--accent-h) var(--accent-s) var(--accent-l) / 0.13) 0%, transparent 55%)" }}
      />
    </motion.div>
  );
}
