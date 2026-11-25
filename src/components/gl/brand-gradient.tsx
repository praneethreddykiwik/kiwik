"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { GLBoundary } from "./gl-boundary";
import { useGL } from "./use-gl";

const Canvas = dynamic(() => import("./brand-gradient-canvas"), { ssr: false });

/** A slow moving gradient in the logo's colours. Fades in over whatever the parent already shows. */
export function BrandGradient({
  colors,
  brightness = 1.2,
  strength = 2.4,
  density = 1.2,
  distance = 3.4,
  opacity = 1,
  className,
}: {
  colors: [string, string, string];
  brightness?: number;
  strength?: number;
  density?: number;
  distance?: number;
  opacity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const gl = useGL(ref);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("absolute inset-0 pointer-events-none transition-opacity duration-1000", className)}
      style={{ opacity: ready ? opacity : 0 }}
    >
      {gl === "on" && (
        <GLBoundary>
          <Canvas key={colors.join()} colors={colors} brightness={brightness} strength={strength} density={density} distance={distance} onReady={() => setReady(true)} />
        </GLBoundary>
      )}
    </div>
  );
}
