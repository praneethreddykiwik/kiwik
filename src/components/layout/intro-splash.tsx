"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./logo";

export function IntroSplash() {
  const [show, setShow] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Check if splash has played in this tab session
    const hasPlayed = sessionStorage.getItem("kiwik-intro-played");
    if (!hasPlayed) {
      setShow(true);
      // Automatically disable after 2.4 seconds
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("kiwik-intro-played", "true");
      }, 2400);
      setHasChecked(true);
      return () => clearTimeout(timer);
    } else {
      setHasChecked(true);
    }
  }, []);

  if (!hasChecked || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary/98 backdrop-blur-2xl select-none"
        >
          {/* Glowing background blob behind the logo */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-accent-blue/10 blur-[80px] animate-pulse pointer-events-none" />
          
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
              animate={{ 
                scale: [0.3, 1.1, 1], 
                opacity: 1, 
                rotate: 0 
              }}
              transition={{ 
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1] // easeOutExpo
              }}
              className="relative filter drop-shadow-2xl"
            >
              <img src="/logo.png" alt="Kiwik Logo" className="w-32 h-32 md:w-40 md:h-40 object-contain dark:hidden" style={{ imageRendering: "auto" }} />
              <img src="/logo-dark.png" alt="Kiwik Logo" className="w-32 h-32 md:w-40 md:h-40 object-contain hidden dark:block" style={{ imageRendering: "auto" }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-center space-y-1.5"
            >
              <h1 className="text-3xl font-serif font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
                KIWIK
              </h1>
              <p className="text-[10px] font-mono tracking-[0.25em] text-text-secondary uppercase">
                Initializing Edge Core OS...
              </p>
            </motion.div>
          </div>

          {/* Loader bar */}
          <div className="absolute bottom-16 w-48 h-[2px] bg-divider rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-accent-blue to-teal-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
