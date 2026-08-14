'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command, Search, Sparkles, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from './theme-switcher';
import { useThemeStore } from '@/stores/theme-store';
import { useSiteCMS } from '@/stores/site-cms-store';

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const pathname = usePathname();

  const cms = useSiteCMS();
  const navCMS = cms.navigation || { items: [] };
  const { mode, toggleMode } = useThemeStore();

  React.useEffect(() => {
    // Passive (so the listener can never delay the scroll itself) and coalesced
    // into one rAF, so `scrollY` is read at most once per frame instead of once
    // per scroll event.
    let frame: number | null = null;
    const handleScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setScrolled(window.scrollY > 25);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = (navCMS.items || []).filter(item => item.visible !== false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      if (pathname === '/') {
        e.preventDefault();
        const targetEl = document.querySelector(href);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // The admin CMS studio owns its own full-height chrome — hide the marketing navbar there.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <motion.header
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'pointer-events-auto w-[92%] max-w-[1500px] h-[54px] sm:h-[58px] rounded-full transition-all duration-400 border flex items-center justify-between px-3 sm:px-5 relative select-none',
          // The navbar is fixed above the scrolling page, so its backdrop-filter is
          // re-rasterised on every scrolled frame — the one place where the blur
          // radius is paid continuously. Trimmed to 12px and the extra
          // `saturate()` pass dropped; at 85-90% background opacity the
          // difference is not visible, the per-frame cost is.
          scrolled
            ? 'scale-[0.99] bg-[#FAFAF8]/90 dark:bg-[#0A0C10]/90 backdrop-blur-[12px] border-black/[0.08] dark:border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)]'
            : 'bg-[#FAFAF8]/85 dark:bg-[#0A0C10]/85 backdrop-blur-[12px] border-black/[0.06] dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)]'
        )}
      >
        {/* ─────────────────────────────────────────────────────────────
            BRANDING — the mark alone, no tile and no wordmark
           ───────────────────────────────────────────────────────────── */}
        {/* The wordmark used to make this link comfortably wide. With just the
            mark it would be a 35px tap target, under the 44px minimum, so the
            padding grows the hit area and the negative margin cancels the
            layout shift it would otherwise cause. */}
        <Link
          href="/"
          aria-label="Kiwik — home"
          className="flex items-center group relative z-10 p-1.5 -m-1.5"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25 }}
            /* The wrapper carries the dimensions, not the images. Tailwind's
               preflight sets `img { max-width: 100% }`, which resolves against
               the parent — so sizing the images inside an auto-width flex
               parent collapses them to zero. */
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0"
          >
            {/* The mark used to sit in a bordered white tile beside the word
                "Kiwik". Without the tile it reads as part of the bar rather than
                a button pinned to it, and without the wordmark it has to carry
                the brand alone — so it takes the space both used to. The alt
                text is what a screen reader announces for this link now. */}
            <img
              src="/logo.png"
              alt="Kiwik"
              width={44}
              height={44}
              className="w-full h-full object-contain dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Kiwik"
              width={44}
              height={44}
              className="w-full h-full object-contain hidden dark:block"
            />
          </motion.div>
        </Link>

        {/* ─────────────────────────────────────────────────────────────
            CENTER NAVIGATION LINKS (Sleek Compact Inter Fonts)
           ───────────────────────────────────────────────────────────── */}
        <nav 
          onMouseLeave={() => setHoveredIndex(null)}
          className="hidden xl:flex items-center gap-5 lg:gap-7 z-10 px-2 flex-1 justify-center max-w-xl mx-auto relative"
        >
          {navItems.map((item, idx) => {
            const normalizedHref = item.href.startsWith('#')
              ? (pathname === '/' ? item.href : `/${item.href}`)
              : item.href;

            const isActive = item.href === '/' 
              ? pathname === '/' 
              : item.href !== '/' && !item.href.startsWith('#') && pathname.startsWith(item.href);

            return (
              <motion.div
                key={item.id || item.href}
                whileHover={{ y: -1 }}
                onMouseEnter={() => setHoveredIndex(idx)}
                className="relative"
              >
                <Link
                  href={normalizedHref}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "relative text-xs sm:text-[13px] font-medium font-sans px-2.5 py-1 transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap select-none",
                    isActive 
                      ? "text-[#111111] dark:text-white font-bold" 
                      : "text-[#555555] dark:text-neutral-300 hover:text-[#111111] dark:hover:text-white"
                  )}
                >
                  {/* Sliding Glass Hover Pill */}
                  {hoveredIndex === idx && (
                    <motion.span
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-neutral-200/60 dark:bg-white/10 rounded-full z-[-1] border border-black/5 dark:border-white/10 shadow-2xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}

                  {/* Active Page Glowing Dot */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT SIDE: COMPACT SEARCH & PRIMARY "ASK KIWIK AI" CTA
           ───────────────────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2.5 relative z-10 flex-shrink-0">
          
          {/* Merged Search Capsule (160px -> 190px) */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-palette"))}
            className="w-[150px] lg:w-[170px] hover:w-[190px] focus:w-[190px] transition-all duration-300 h-8 px-3 rounded-full bg-neutral-100/90 dark:bg-white/10 border border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-1.5">
              <Search className="w-3 h-3 text-neutral-400 group-hover:text-blue-500 transition-colors" />
              <span className="font-sans font-medium text-[11.5px]">Search...</span>
            </div>
            <kbd className="hidden sm:flex items-center gap-0.5 font-sans text-[9px] font-bold bg-white dark:bg-white/10 px-1 py-0.5 rounded border border-black/5 dark:border-white/10 text-neutral-500 dark:text-neutral-300">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </motion.button>
          
          {/* Theme Switcher Button */}
          <ThemeSwitcher />

          {/* Compact Primary CTA Button: Ask Kiwik AI */}
          {navCMS.ctaButtonVisible !== false && (
            <motion.div 
              whileHover={{ y: -1, scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={navCMS.ctaButtonHref || "#ai"}
                onClick={(e) => handleNavClick(e, navCMS.ctaButtonHref || "#ai")}
                className="h-[36px] px-4 rounded-full bg-gradient-to-b from-white to-neutral-100 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 border border-black/10 dark:border-white/20 text-[#111111] dark:text-white text-xs font-bold font-sans flex items-center gap-1.5 transition-all shadow-sm hover:shadow-blue-500/20"
              >
                <Sparkles className="w-3 h-3 text-blue-500 dark:text-blue-200 animate-pulse" />
                <span>{navCMS.ctaButtonText || "Ask Kiwik AI"}</span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Action Controls & Drawer Trigger */}
        <div className="flex items-center gap-1 xl:hidden relative z-10">
          <button
            onClick={toggleMode}
            className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors text-neutral-800 dark:text-white cursor-pointer md:hidden"
            aria-label="Toggle light/dark theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'dark' ? (
                <motion.div
                  key="dark"
                  initial={{ y: -10, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="light"
                  initial={{ y: -10, opacity: 0, rotate: 90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer text-neutral-800 dark:text-white"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full inset-x-0 mt-3 p-4 rounded-3xl bg-white/95 dark:bg-[#07080B]/95 border border-black/10 dark:border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col gap-1.5 xl:hidden overflow-hidden z-50"
            >
              {navItems.map((item) => {
                const normalizedHref = item.href.startsWith('#')
                  ? (pathname === '/' ? item.href : `/${item.href}`)
                  : item.href;

                return (
                  <Link
                    key={item.id || item.href}
                    href={normalizedHref}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, item.href);
                    }}
                    className="px-4 py-2.5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/10 text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge && <span className="text-[9px] font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </Link>
                );
              })}

              {/* Mobile Light/Dark Mode Quick Toggle */}
              <button
                onClick={toggleMode}
                className="mt-1 px-4 py-2.5 rounded-2xl bg-neutral-100/80 dark:bg-white/5 hover:bg-neutral-200/80 dark:hover:bg-white/10 text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between transition-colors cursor-pointer md:hidden border border-black/5 dark:border-white/10"
                aria-label="Toggle light/dark mode"
              >
                <span className="flex items-center gap-2">
                  {mode === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 uppercase">
                  {mode}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>
    </div>
  );
}
