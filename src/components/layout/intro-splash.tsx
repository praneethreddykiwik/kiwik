"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IntroSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("kiwik-intro-played");
    if (hasPlayed) {
      setShow(false);
      return;
    }
    // Lock scroll briefly while the intro plays
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("kiwik-intro-played", "true");
      document.body.style.overflow = "";
    }, 1100);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary select-none"
        >
          {/* Subtle ambient light behind logo */}
          <div className="absolute w-[240px] h-[240px] rounded-full bg-accent-blue/10 blur-[60px] animate-pulse pointer-events-none" />
          
          <div className="relative flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1 
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative"
            >
              <img src="/logo.png" alt="Kiwik Logo" className="w-28 h-28 md:w-32 md:h-32 object-contain dark:hidden" style={{ imageRendering: "auto" }} />
              <img src="/logo-dark.png" alt="Kiwik Logo" className="w-28 h-28 md:w-32 md:h-32 object-contain hidden dark:block" style={{ imageRendering: "auto" }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center space-y-1"
            >
              {/* Decorative wordmark for the loading splash — not the page's
                  primary heading. It was an <h1>, so every route emitted this
                  generic "KIWIK" as its first (and identical) h1 ahead of the
                  page's real heading, giving crawlers a meaningless top heading
                  on every URL. A styled div carries the same visual without
                  claiming the h1 slot. aria-hidden because the logo above
                  already labels the splash. */}
              <div
                aria-hidden="true"
                className="text-2xl font-serif font-bold tracking-widest text-text-primary"
              >
                KIWIK
              </div>
              <p className="text-[9px] font-mono tracking-[0.2em] text-text-secondary uppercase">
                Initializing Edge Core...
              </p>
            </motion.div>
          </div>

          {/* Loader bar */}
          <div className="absolute bottom-16 w-36 h-[2px] bg-divider rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-accent-blue to-teal-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
