"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteCMSStore } from "@/stores/site-cms-store";

export function HeroNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navCMS = useSiteCMSStore((state) => state.cms.navigation);

  const logoText = navCMS?.logoText || "Kiwik";
  const navItems = navCMS?.items || [
    { id: "n-1", label: "Home", href: "/", order: 1, visible: true },
    { id: "n-2", label: "Explore Projects", href: "/projects", order: 2, visible: true },
    { id: "n-3", label: "Developer Documentation", href: "/docs", order: 3, visible: true },
    { id: "n-4", label: "Admin CMS Console", href: "/admin", order: 4, visible: true }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-5 flex items-center justify-between pointer-events-none select-none">
      {/* Top Left: Floating Black Rounded Navigation Pill */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto bg-[#18181B] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-[10px] text-black">
          K
        </div>
        <span className="text-xs font-bold tracking-tight font-sans">{logoText}</span>
        <div className="w-px h-3.5 bg-white/20 ml-1" />
        <button className="text-white/80 hover:text-white transition-colors cursor-pointer p-0.5">
          {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Top Right: Two Pill Buttons (Sign In + Start for Free) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex items-center gap-3"
      >
        <Link 
          href="/admin" 
          className="px-5 py-2.5 rounded-full bg-[#FDF08A] hover:bg-[#fef08a]/90 text-[#18181B] text-xs font-bold transition-all hover:scale-105 shadow-md border border-amber-300/40"
        >
          Sign In
        </Link>
        <Link 
          href={navCMS?.ctaButtonHref || "/projects"} 
          className="px-5 py-2.5 rounded-full bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/25 border border-orange-400/40 flex items-center gap-1.5 group"
        >
          <span>{navCMS?.ctaButtonText || "Start for Free"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>

      {/* Dropdown Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-16 left-6 w-64 bg-[#18181B] text-white rounded-2xl p-4 border border-white/10 shadow-2xl space-y-2 z-50"
          >
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2 py-1">
              Navigation
            </div>
            {navItems.filter(item => item.visible !== false).map((item) => (
              <Link 
                key={item.id} 
                href={item.href} 
                onClick={() => setIsMenuOpen(false)} 
                className="block px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-semibold transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
