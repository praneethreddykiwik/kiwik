"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function AuroraBackground({ intensity = "medium", className }: AuroraBackgroundProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState("dark");
  
  // Relative Parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Absolute pixel tracking for full-screen cursor spotlight
  const mousePxX = useMotionValue(0);
  const mousePxY = useMotionValue(0);
  
  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const springPxX = useSpring(mousePxX, { damping: 30, stiffness: 80 });
  const springPxY = useSpring(mousePxY, { damping: 30, stiffness: 80 });
  
  const parallaxX1 = useTransform(springX, [-1, 1], ["-3%", "3%"]);
  const parallaxY1 = useTransform(springY, [-1, 1], ["-3%", "3%"]);
  
  const parallaxX2 = useTransform(springX, [-1, 1], ["4%", "-4%"]);
  const parallaxY2 = useTransform(springY, [-1, 1], ["4%", "-4%"]);

  useEffect(() => {
    setIsMounted(true);
    
    // Check initial theme
    const activeTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(activeTheme);
    
    // Monitor theme changes
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
      
      mousePxX.set(e.clientX);
      mousePxY.set(e.clientY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, [mouseX, mouseY, mousePxX, mousePxY]);

  const intensityOpacity = {
    low: "opacity-35",
    medium: "opacity-55",
    high: "opacity-80",
  };

  // Convert motion pixel coordinate values to radial spotlight style string
  const cursorSpotlight = useTransform(
    [springPxX, springPxY],
    ([x, y]) => theme === "light"
      ? `radial-gradient(700px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.03), transparent 70%)`
      : `radial-gradient(700px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.05), transparent 70%)`
  );

  if (!isMounted) return null;

  const isLight = theme === "light";

  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-bg-primary transition-colors duration-500", className)}>
      {/* Background layer 1: Mesh gradients with parallax */}
      <div className={cn("absolute inset-0 filter blur-[80px] transform-gpu will-change-transform transition-opacity duration-700 select-none", intensityOpacity[intensity])}>
        {/* Blob 1 - Premium Teal/Cyan light wave */}
        <motion.div
          style={{ x: parallaxX1, y: parallaxY1 }}
          className={cn(
            "absolute top-[-15%] left-[-15%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-teal-500/25 via-cyan-500/20 to-blue-600/15 animate-aurora-blob will-change-transform transition-all duration-500",
            isLight ? "mix-blend-multiply opacity-25" : "mix-blend-screen opacity-70"
          )}
        />
        {/* Blob 2 - Soft Blue/Indigo mesh glow */}
        <motion.div
          style={{ x: parallaxX2, y: parallaxY2, animationDelay: "2.5s" }}
          className={cn(
            "absolute top-[10%] right-[-20%] w-[85%] h-[85%] rounded-full bg-gradient-to-bl from-blue-500/20 via-indigo-500/15 to-cyan-500/10 animate-aurora-blob-alt will-change-transform transition-all duration-500",
            isLight ? "mix-blend-multiply opacity-20" : "mix-blend-screen opacity-60"
          )}
        />
        {/* Blob 3 - Ambient Violet/Magenta deep wave */}
        <motion.div
          style={{ x: parallaxX1, y: parallaxY2, animationDelay: "4.5s" }}
          className={cn(
            "absolute bottom-[-30%] left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-600/20 to-pink-500/10 animate-aurora-blob will-change-transform transition-all duration-500",
            isLight ? "mix-blend-multiply opacity-25" : "mix-blend-screen opacity-75"
          )}
        />
        {/* Blob 4 - Delicate Gold highlight */}
        <motion.div
          style={{ x: parallaxX2, y: parallaxY1, animationDelay: "6.5s" }}
          className={cn(
            "absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-cyan-500/15 via-teal-400/10 to-amber-500/5 animate-aurora-blob-alt will-change-transform transition-all duration-500",
            isLight ? "mix-blend-multiply opacity-15" : "mix-blend-screen opacity-50"
          )}
        />
      </div>

      {/* Background layer 2: Dynamic interactive cursor spotlight */}
      <motion.div 
        style={{ background: cursorSpotlight }} 
        className="absolute inset-0 z-0 transition-opacity duration-300"
      />

      {/* Background layer 3: Ambient soft edge vignette shading */}
      <div className={cn(
        "absolute inset-0 z-10 opacity-90 transition-all duration-500",
        isLight
          ? "bg-radial-[circle_at_center,rgba(0,0,0,0)_70%,#f0f3f8_100%]"
          : "bg-radial-[circle_at_center,rgba(0,0,0,0)_60%,var(--bg-primary)_100%]"
      )} />

      {/* Background layer 4: Jittering micro-noise weathering overlay */}
      <div 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
        className={cn(
          "absolute inset-[-100%] z-20 pointer-events-none animate-noise-jitter transition-opacity duration-500",
          isLight ? "opacity-[0.015] mix-blend-color-burn" : "opacity-[0.025] mix-blend-overlay"
        )} 
      />
    </div>
  );
}
