"use client";

import { useEffect, useState, type RefObject } from "react";

let supported: boolean | undefined;

/** Real GPU, no "reduce motion", no data saver, not a very small device. */
function canRunGL(): boolean {
  if (supported !== undefined) return supported;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory < 3)) return (supported = false);
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    supported = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    supported = false;
  }
  return supported;
}

/**
 * "pending" until known, "off" when the plain version should stay, "on" while
 * the element is near the screen. Leaving the screen unmounts the canvas, so
 * nothing is drawn, and no WebGL context is held, for sections out of view.
 */
export function useGL(ref: RefObject<Element | null>, margin = "250px"): "pending" | "off" | "idle" | "on" {
  const [state, setState] = useState<"pending" | "off" | "idle" | "on">("pending");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let io: IntersectionObserver | undefined;

    const start = () => {
      io?.disconnect();
      if (motion.matches || !canRunGL()) {
        setState("off");
        return;
      }
      io = new IntersectionObserver(([entry]) => setState(entry.isIntersecting ? "on" : "idle"), { rootMargin: margin });
      io.observe(el);
    };

    // Never in the way of the first paint.
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 400);
    motion.addEventListener("change", start);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
      motion.removeEventListener("change", start);
      io?.disconnect();
    };
  }, [ref, margin]);

  return state;
}
