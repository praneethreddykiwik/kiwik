"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springConfig = { damping: 50, stiffness: 350, mass: 0.2 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;
    setIsDesktop(true);

    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      const clientX = e.clientX;
      const clientY = e.clientY;
      rafId = requestAnimationFrame(() => {
        mouseX.set(clientX);
        mouseY.set(clientY);
        setIsVisible(true);
        rafId = null;
      });
    };

    const handleMouseLeave = () => setIsVisible(false);

    const handleScroll = () => {
      setIsVisible(false);
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsVisible(true), 100);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed top-0 left-0 w-[380px] h-[380px] -ml-[190px] -mt-[190px] rounded-full pointer-events-none z-50 transition-opacity duration-200 gpu-accelerate"
    >
      <div
        className="w-full h-full rounded-full"
        style={{ background: "radial-gradient(circle at center, hsl(var(--accent-h) var(--accent-s) var(--accent-l) / 0.12) 0%, transparent 60%)" }}
      />
    </motion.div>
  );
}
