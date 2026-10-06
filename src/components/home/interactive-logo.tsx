"use client";

import React, { useState, useEffect, useRef } from "react";

export function InteractiveLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Eye positions are written straight to the DOM once per animation frame.
  // They used to be two pieces of React state set on every window mousemove,
  // re-rendering the logo dozens of times a second while the page scrolled.
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Periodic blinking interval
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150); // Blink duration 150ms
    }, 4000 + Math.random() * 2000); // Blink every 4-6 seconds

    let rafId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const updateEyes = () => {
      rafId = null;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Prevent calculation glitch before layout loads or sizes are stable
      if (width === 0 || height === 0) return;

      // Estimate center positions of the eyes inside the logo wrapper (width x height)
      // Left eye: 42.7% left, 28.8% top
      // Right eye: 57.1% left, 28.8% top
      const leftEyeCenter = {
        x: rect.left + width * 0.427,
        y: rect.top + height * 0.288,
      };
      const rightEyeCenter = {
        x: rect.left + width * 0.571,
        y: rect.top + height * 0.288,
      };

      // Calculate vector from eye centers to mouse cursor
      const maxDistance = 10; // Maximum travel distance of eyeball inside socket (in px)

      const calculateOffset = (center: { x: number; y: number }) => {
        const dx = lastX - center.x;
        const dy = lastY - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) return { x: 0, y: 0 };

        // Clamp offset to maxDistance
        const scale = Math.min(maxDistance, distance) / (distance + 150); // smooth dampening
        return {
          x: dx * scale,
          y: dy * scale,
        };
      };

      const l = calculateOffset(leftEyeCenter);
      const r = calculateOffset(rightEyeCenter);
      if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate(${l.x}px, ${l.y}px)`;
      if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate(${r.x}px, ${r.y}px)`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(updateEyes);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearInterval(blinkInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[300px] sm:w-[340px] md:w-[380px] aspect-square select-none pointer-events-none"
    >
      {/* Light Mode Logo Base */}
      <img
        src="/logo.png"
        alt="Kiwik Logo"
        className="w-full h-full object-contain block dark:hidden"
      />
      {/* Dark Mode Logo Base */}
      <img
        src="/logo-dark.png"
        alt="Kiwik Logo"
        className="w-full h-full object-contain hidden dark:block"
      />

      {/* Left Eyeball Container */}
      <div
        className="absolute overflow-hidden rounded-full flex items-center justify-center bg-[#1a1a1a] z-10"
        style={{
          left: "42.7%",
          top: "28.8%",
          width: "10.2%",
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Eyeball sphere with specular highlight tracking the cursor */}
        <div
          ref={leftEyeRef}
          className="w-full h-full rounded-full transition-transform duration-75 ease-out"
          style={{
            background: "radial-gradient(circle at 32% 28%, #5a5a5a 0%, #2a2a2a 20%, #0d0d0d 70%)",
            boxShadow: "inset -2px -3px 6px rgba(0,0,0,0.8), inset 1px 2px 4px rgba(255,255,255,0.25)",
          }}
        />

        {/* Eyelid overlay for blink animation */}
        <div
          className={`absolute inset-0 bg-[#FAFAF8] dark:bg-[#070708] ${
            mounted ? "transition-transform duration-100 ease-in-out" : ""
          }`}
          style={{
            transform: isBlinking ? "translateY(0)" : "translateY(-100%)",
          }}
        />
      </div>

      {/* Right Eyeball Container */}
      <div
        className="absolute overflow-hidden rounded-full flex items-center justify-center bg-[#1a1a1a] z-10"
        style={{
          left: "57.1%",
          top: "28.8%",
          width: "10.2%",
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Eyeball sphere with specular highlight tracking the cursor */}
        <div
          ref={rightEyeRef}
          className="w-full h-full rounded-full transition-transform duration-75 ease-out"
          style={{
            background: "radial-gradient(circle at 32% 28%, #5a5a5a 0%, #2a2a2a 20%, #0d0d0d 70%)",
            boxShadow: "inset -2px -3px 6px rgba(0,0,0,0.8), inset 1px 2px 4px rgba(255,255,255,0.25)",
          }}
        />

        {/* Eyelid overlay for blink animation */}
        <div
          className={`absolute inset-0 bg-[#FAFAF8] dark:bg-[#070708] ${
            mounted ? "transition-transform duration-100 ease-in-out" : ""
          }`}
          style={{
            transform: isBlinking ? "translateY(0)" : "translateY(-100%)",
          }}
        />
      </div>
    </div>
  );
}
