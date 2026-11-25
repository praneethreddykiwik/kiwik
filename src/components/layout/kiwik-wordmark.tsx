"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./kiwik-wordmark.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The company name at full width, in the logo's colours. */
export function KiwikWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();

  // The spheres' highlight follows the pointer; written to CSS variables so a
  // pointer move never re-renders.
  useEffect(() => {
    const el = ref.current;
    if (!el || !visible || reduced || !window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const box = el.getBoundingClientRect();
        const clamp = (n: number) => Math.max(-1, Math.min(1, n));
        el.style.setProperty("--ex", clamp((e.clientX - box.left - box.width / 2) / (box.width / 2)).toFixed(2));
        el.style.setProperty("--ey", clamp((e.clientY - box.top - box.height / 3) / 300).toFixed(2));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [visible, reduced]);

  return (
    <div ref={ref} role="img" aria-label={text} className={styles.word}>
      <div aria-hidden="true" className={styles.letters}>
        {Array.from(text).map((char, i) => {
          const dotted = char === "i";
          return (
            <motion.span
              key={i}
              className={styles.letter}
              initial={{ y: "12%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
            >
              <span className={`${styles.ink} ${styles[`ink${i % 5}`]}`}>{dotted ? "ı" : char}</span>
              {dotted && (
                <motion.span
                  className={styles.ball}
                  initial={{ y: "-70%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.5 + i * 0.07 }}
                >
                  <span className={`block ${styles.sphere}`} />
                </motion.span>
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
