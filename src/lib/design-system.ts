/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KIWIK OS DESIGN SYSTEM (Surfaces, Elevation, Section Rhythm)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const KiwikSurfaces = {
  // Surface Materials
  primary: "bg-[#070708] dark:bg-[#070708] light:bg-[#FAFAF8] text-text-primary",
  secondary: "bg-[#0D0D0E] dark:bg-[#0D0D0E] light:bg-[#F4F4F0] border border-white/[0.08] dark:border-white/[0.08] light:border-black/[0.06]",
  glass: "bg-[#0D0D0E]/75 dark:bg-[#0D0D0E]/75 light:bg-white/85 backdrop-blur-2xl border border-white/[0.08] dark:border-white/[0.08] light:border-black/[0.06]",
  card: "bg-[#131314] dark:bg-[#131314] light:bg-white border border-white/[0.08] dark:border-white/[0.08] light:border-black/[0.06] shadow-md hover:shadow-xl transition-all duration-300",
  hero: "relative overflow-hidden bg-gradient-to-b from-[#070708] via-[#0D0D0E] to-[#070708]",
  footer: "bg-[#070708] border-t border-white/[0.08] text-text-secondary",
};

export const KiwikElevation = {
  elevation0: "shadow-none",
  elevation1: "shadow-xs border border-white/[0.06] dark:border-white/[0.06]",
  elevation2: "shadow-md hover:shadow-lg border border-white/[0.08] dark:border-white/[0.08]",
  elevation3: "shadow-xl border border-white/[0.12] dark:border-white/[0.12] backdrop-blur-2xl",
  elevation4: "shadow-2xl border border-white/[0.16] dark:border-white/[0.16] backdrop-blur-3xl",
  elevation5: "shadow-[0_35px_110px_rgba(0,0,0,0.45)] border border-white/[0.2]",
};

export const KiwikLayoutRhythm = {
  // Normalized 160px Section Vertical Padding System
  sectionPadding: "py-24 sm:py-32 md:py-40 lg:py-44 px-4 sm:px-6 md:px-8 max-w-[1550px] mx-auto",
  sectionHeaderSpace: "mb-16 sm:mb-20 md:mb-24 text-center space-y-4 max-w-3xl mx-auto",
};
