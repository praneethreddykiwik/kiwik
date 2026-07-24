"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  Share2, 
  HelpCircle, 
  ArrowUpRight,
  Send,
  Lock,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteCMSStore } from "@/stores/site-cms-store";

export function DeviceShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const deviceShowcase = useSiteCMSStore((state) => state.cms.deviceShowcase) || {
    topBadgeText: "No Credit Card Required",
    cards: []
  };

  // Scroll parallax translation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scrollY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const smoothY = useSpring(scrollY, { damping: 25, stiffness: 120 });

  // Mouse Parallax Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 12, y: y * 12 });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      id="device-showcase-section"
      className="py-28 sm:py-36 md:py-40 lg:py-44 px-0 sm:px-4 max-w-[1700px] mx-auto relative z-20 select-none overflow-hidden bg-[#FAFAF8] dark:bg-[#08090C]"
    >
      {/* ─────────────────────────────────────────────────────────────
          OFFICIAL KIWIK LOGO: Centered with subtle float animation
         ───────────────────────────────────────────────────────────── */}
      <div className="flex justify-center mb-[50px] relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ 
            opacity: 1, 
            y: [0, -3, 0]
          }}
          transition={{
            opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            y: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }
          }}
          className="flex justify-center relative"
        >
          <img 
            src="/logo.png" 
            alt="Kiwik Logo" 
            className="w-[80px] h-auto object-contain dark:hidden"
          />
          <img 
            src="/logo-dark.png" 
            alt="Kiwik Logo" 
            className="w-[80px] h-auto object-contain hidden dark:block"
          />
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5 REALISTIC IPHONE 16 PRO HARDWARE MOCKUPS (Infinite Horizon)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: smoothY }}
        className="relative w-full flex items-center justify-center -space-x-4 sm:space-x-3 md:space-x-6 overflow-x-auto pb-12 pt-4 no-scrollbar px-6 sm:px-12"
      >

        {/* ── PHONE 1: JOHN RICHARDSON (Far Left - Cropped Viewport) ── */}
        <motion.div
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            y: hoveredIndex === 0 ? -10 : mousePos.y * 0.8,
            x: mousePos.x * 0.8,
            scale: hoveredIndex === 0 ? 0.86 : 0.82,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative flex-shrink-0 w-[250px] sm:w-[280px] md:w-[300px] h-[520px] sm:h-[590px] md:h-[630px] shadow-[25px_35px_80px_rgba(0,0,0,0.18)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer group z-10 rounded-[48px] sm:rounded-[54px]"
        >
          {/* Screen Container */}
          <div className="absolute inset-[6px] sm:inset-[8px] rounded-[36px] sm:rounded-[42px] bg-white text-neutral-900 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-inner pt-7 sm:pt-8">
            
            {/* Specular Light Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-30 pointer-events-none z-20" />

            {/* Header Content */}
            <div className="relative z-15 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold text-xs font-serif text-neutral-700 shadow-sm">
                  JR
                </div>
                <span className="text-xs font-bold text-neutral-800">John Richardson</span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-neutral-900 tracking-tight leading-snug">
                Angel investor in San Antonio, TX
              </h3>

              <p className="text-[11px] font-sans text-neutral-500 leading-relaxed">
                Investing in web3 companies focused on DeFi systems and infrastructure.
              </p>

              <button className="w-full py-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-colors shadow-sm">
                Apply
              </button>
            </div>

            {/* Projects List */}
            <div className="relative z-15 pt-3 border-t border-neutral-100 space-y-2 text-left">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Projects</span>
              
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 space-y-0.5">
                <div className="text-xs font-bold text-neutral-800">Cooperative</div>
                <p className="text-[10px] text-neutral-400">Project description here.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 space-y-0.5">
                <div className="text-xs font-bold text-neutral-800">Ikigai Labs</div>
                <p className="text-[10px] text-neutral-400">Project description here.</p>
              </div>
            </div>

          </div>

          {/* Premium Device Bezel Frame Overlay */}
          <img 
            src="https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048" 
            alt="Device Frame" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30"
          />
        </motion.div>

        {/* ── PHONE 2: JET HAWKEN (Mid Left - Product Designer) ── */}
        <motion.div
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            y: hoveredIndex === 1 ? -12 : -8 + mousePos.y * 0.5,
            x: mousePos.x * 0.5,
            scale: hoveredIndex === 1 ? 0.94 : 0.89,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative flex-shrink-0 w-[255px] sm:w-[285px] md:w-[310px] h-[535px] sm:h-[610px] md:h-[650px] shadow-[30px_40px_90px_rgba(0,0,0,0.22)] dark:shadow-[0_45px_110px_rgba(0,0,0,0.85)] overflow-hidden cursor-pointer group z-20 rounded-[50px] sm:rounded-[56px]"
        >
          {/* Screen Container */}
          <div className="absolute inset-[6px] sm:inset-[8px] rounded-[38px] sm:rounded-[44px] bg-[#EBF2FE] text-neutral-900 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-inner pt-7 sm:pt-8">
            
            {/* Specular Light Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-40 pointer-events-none z-20" />

            {/* Top Blue Wave Shader */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-300/40 via-blue-200/20 to-transparent pointer-events-none" />

            {/* Header Content */}
            <div className="relative z-15 space-y-2.5 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                  JH
                </div>
                <span className="text-xs font-bold text-neutral-800">Jet Hawken</span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-neutral-900 tracking-tight leading-tight">
                Product Designer & UI UX Expert
              </h3>

              <p className="text-[10px] sm:text-[11px] font-sans text-neutral-600 leading-relaxed">
                A seasoned designer with 15 years experience specializing in product design and UI/UX. Known for creating impactful experiences.
              </p>

              <button className="w-full py-2 rounded-full bg-white text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors shadow-md border border-blue-100">
                Book an intro call
              </button>
            </div>

            {/* Testimonials Block */}
            <div className="relative z-15 pt-2 border-t border-blue-200/60 space-y-2 text-left">
              <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
                <span className="font-serif italic text-base">“</span> Testimonials
              </div>

              <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-neutral-300 text-[9px] font-bold flex items-center justify-center">JR</div>
                  <span className="text-[10px] font-bold text-neutral-800">John Richardson</span>
                </div>
                <p className="text-[9.5px] text-neutral-600 leading-tight">
                  "Jet helped us build an incredible platform from start to finish"
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">LP</div>
                  <span className="text-[10px] font-bold text-neutral-800">Leslie Putnam</span>
                </div>
                <p className="text-[9.5px] text-neutral-600 leading-tight">
                  "Is so talented and designs so fast, we beat every deadline..."
                </p>
              </div>
            </div>

          </div>

          {/* Premium Device Bezel Frame Overlay */}
          <img 
            src="https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048" 
            alt="Device Frame" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30"
          />
        </motion.div>

        {/* ── PHONE 3: LESLIE PUTNAM (Center Hero - Titanium iPhone 16 Pro Frame) ── */}
        <motion.div
          onMouseEnter={() => setHoveredIndex(2)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            y: hoveredIndex === 2 ? -20 : -18,
            scale: hoveredIndex === 2 ? 1.05 : 1.0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative flex-shrink-0 w-[275px] sm:w-[310px] md:w-[335px] h-[570px] sm:h-[650px] md:h-[690px] shadow-[35px_50px_110px_rgba(0,0,0,0.32)] dark:shadow-[0_50px_140px_rgba(0,0,0,0.95)] overflow-hidden cursor-pointer z-40 group rounded-[52px] sm:rounded-[58px]"
        >
          {/* Screen Container */}
          <div className="absolute inset-[6px] sm:inset-[8px] rounded-[40px] sm:rounded-[46px] bg-[#0C0D12] text-white p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-inner pt-8 sm:pt-9">
            
            {/* Glass Specular Reflection Highlight Diagonal */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-50 pointer-events-none z-20" />

            {/* Glowing Blue Mesh Shader Top */}
            <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-br from-blue-600/40 via-indigo-600/30 to-transparent blur-xl pointer-events-none" />

            {/* Header Content */}
            <div className="relative z-15 space-y-3 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-lg border border-white/20">
                  LP
                </div>
                <span className="text-xs font-bold text-white/90">Leslie Putnam</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug">
                Product Manager with 15 years of experience.
              </h3>

              <p className="text-[11px] font-sans text-neutral-300 leading-relaxed">
                Leslie Putnam is a Senior PM helping teams of designers, developers and stakeholders hit deadlines and build incredible things.
              </p>

              <button className="w-full py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-100 transition-colors shadow-lg">
                Contact Me
              </button>
            </div>

            {/* Resume Timeline Block */}
            <div className="relative z-15 pt-3 border-t border-white/10 space-y-2 text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-white/77">
                <Briefcase className="w-3 h-3 text-blue-400" />
                <span>Resume</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-white">Senior Product Manager</div>
                <div className="text-[10px] text-neutral-400">Apple</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-neutral-300">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>Jan, 2023 - Present</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-white">Product Manager</div>
                <div className="text-[10px] text-neutral-400">Meta Platforms</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-neutral-300">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>Aug, 2021 - Jan, 2023</span>
                </div>
              </div>
            </div>

          </div>

          {/* Premium Device Bezel Frame Overlay */}
          <img 
            src="https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048" 
            alt="Device Frame" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30"
          />
        </motion.div>

        {/* ── PHONE 4: TAYLOR BROWN (Mid Right - Botanist) ── */}
        <motion.div
          onMouseEnter={() => setHoveredIndex(3)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            y: hoveredIndex === 3 ? -12 : -8 + mousePos.y * 0.5,
            x: mousePos.x * 0.5,
            scale: hoveredIndex === 3 ? 0.94 : 0.89,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative flex-shrink-0 w-[255px] sm:w-[285px] md:w-[310px] h-[535px] sm:h-[610px] md:h-[650px] shadow-[30px_40px_90px_rgba(0,0,0,0.22)] dark:shadow-[0_45px_110px_rgba(0,0,0,0.85)] overflow-hidden cursor-pointer group z-20 rounded-[50px] sm:rounded-[56px]"
        >
          {/* Screen Container */}
          <div className="absolute inset-[6px] sm:inset-[8px] rounded-[38px] sm:rounded-[44px] bg-[#0E1F18] text-white p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-inner pt-7 sm:pt-8">
            
            {/* Specular Light Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-40 pointer-events-none z-20" />

            {/* Botanical Dark Green Background Texture */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-emerald-700/40 via-teal-900/30 to-transparent pointer-events-none" />

            {/* Header Content */}
            <div className="relative z-15 space-y-2.5 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-md border border-emerald-400/30">
                  TB
                </div>
                <span className="text-xs font-bold text-emerald-100">Taylor Brown</span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight leading-snug">
                Professional botanist sharing plant tips.
              </h3>

              <p className="text-[10px] sm:text-[11px] font-sans text-emerald-200/80 leading-relaxed">
                Passionate about plants and sustainability. Through social media, I share expert plant tips and advice.
              </p>

              <button className="w-full py-2 rounded-full bg-white text-emerald-950 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-md">
                Book a call about your plants
              </button>
            </div>

            {/* Social Icons & FAQ Block */}
            <div className="relative z-15 pt-2 border-t border-emerald-800/60 space-y-2 text-left">
              <div className="flex items-center justify-between px-1">
                {[Globe, MessageSquare, Share2, Send, Lock].map((Icon, idx) => (
                  <div key={idx} className="w-6 h-6 rounded-full bg-white/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <Icon className="w-3 h-3" />
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-200">
                  <HelpCircle className="w-3 h-3 text-emerald-400" /> FAQ
                </div>
                <p className="text-[9.5px] text-emerald-100 font-medium">
                  How long have you been a botanist?
                </p>
                <p className="text-[9px] text-emerald-300/80">
                  I've been passionate about plants for over 8 years.
                </p>
              </div>
            </div>

          </div>

          {/* Premium Device Bezel Frame Overlay */}
          <img 
            src="https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048" 
            alt="Device Frame" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30"
          />
        </motion.div>

        {/* ── PHONE 5: JASON MARKUS (Far Right - Cropped Viewport) ── */}
        <motion.div
          onMouseEnter={() => setHoveredIndex(4)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            y: hoveredIndex === 4 ? -10 : mousePos.y * 0.8,
            x: mousePos.x * 0.8,
            scale: hoveredIndex === 4 ? 0.86 : 0.82,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative flex-shrink-0 w-[250px] sm:w-[280px] md:w-[300px] h-[520px] sm:h-[590px] md:h-[630px] shadow-[25px_35px_80px_rgba(0,0,0,0.18)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer group z-10 rounded-[48px] sm:rounded-[54px]"
        >
          {/* Screen Container */}
          <div className="absolute inset-[6px] sm:inset-[8px] rounded-[36px] sm:rounded-[42px] bg-[#0D150B] text-white p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-inner pt-7 sm:pt-8">
            
            {/* Specular Light Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-30 pointer-events-none z-20" />

            {/* Lime Gradient Background Top */}
            <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-lime-600/40 via-emerald-800/20 to-transparent pointer-events-none" />

            {/* Header Content */}
            <div className="relative z-15 space-y-2.5 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-lime-600 text-black font-bold text-xs flex items-center justify-center shadow-md">
                  JM
                </div>
                <span className="text-xs font-bold text-lime-200">Jason Markus</span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight leading-snug">
                Viral marketer, helping founders grow their apps.
              </h3>

              <p className="text-[10px] sm:text-[11px] font-sans text-neutral-300 leading-relaxed line-clamp-3">
                I am Jason Markus, a viral marketer specializing in helping founders grow their apps through innovative strategies and modern marketing techniques.
              </p>

              <button className="w-full py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-100 transition-colors shadow-md">
                Purchase a marketing plan
              </button>
            </div>

            {/* Contact Form Block */}
            <div className="relative z-15 pt-2 border-t border-lime-900/60 space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-lime-300">Contact Jason Markus</span>

              <div className="space-y-1 text-[9px] font-mono">
                <input placeholder="Name" disabled className="w-full px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40" />
                <input placeholder="Email" disabled className="w-full px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40" />
                <input placeholder="Phone" disabled className="w-full px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40" />
              </div>
            </div>

          </div>

          {/* Premium Device Bezel Frame Overlay */}
          <img 
            src="https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048" 
            alt="Device Frame" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30"
          />
        </motion.div>

      </motion.div>
    </section>
  );
}
