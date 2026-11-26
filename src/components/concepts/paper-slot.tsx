"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { useGL } from "@/components/gl/use-gl";

/** A Paper Shaders layer that only runs on screen, with a still CSS look as the fallback. */
export function PaperLayer({ children, still, className }: { children: React.ReactNode; still: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const gl = useGL(ref);
  return (
    <div ref={ref} aria-hidden="true" className={cn("absolute inset-0", className)} style={{ background: still }}>
      {gl === "on" && <GLBoundary>{children}</GLBoundary>}
    </div>
  );
}
