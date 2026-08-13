"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PaperBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function PaperBackground({ className, children }: PaperBackgroundProps) {
  return (
    <div className={cn("relative w-full min-h-screen bg-bg-primary text-text-primary overflow-hidden select-none", className)}>
      {/* Subtle Dotted Paper Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.06]" 
        style={{
          backgroundImage: `radial-gradient(#18181b 1.2px, transparent 1.2px)`,
          backgroundSize: `18px 18px`
        }}
      />

      {/* Soft Radial Center Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-radial-[circle_at_center,var(--glass-bg)_0%,transparent_75%]" />

      {/* Soft Edge Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-radial-[circle_at_center,transparent_60%,rgba(0,0,0,0.03)_100%]" />

      {/* Extremely Soft Noise Texture */}
      <div 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.015]"
      />

      <div className="relative z-10 flex flex-col flex-1 w-full">{children}</div>
    </div>
  );
}
