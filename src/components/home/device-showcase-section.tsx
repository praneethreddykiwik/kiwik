"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteCMS } from "@/stores/site-cms-store";
import { InteractiveLogo } from "./interactive-logo";

export function DeviceShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const cms = useSiteCMS();
  const deviceShowcase = cms.deviceShowcase || {
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

  // Render cards sorted and filtered
  const activeCards = [...(deviceShowcase.cards || [])]
    .filter(c => c.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const cardSettings = [
    { width: "w-[250px] sm:w-[280px] md:w-[300px]", height: "h-[520px] sm:h-[590px] md:h-[630px]", baseScale: 0.82, hoverScale: 0.86, yOffset: 0, zIndex: "z-10" },
    { width: "w-[255px] sm:w-[285px] md:w-[310px]", height: "h-[535px] sm:h-[610px] md:h-[650px]", baseScale: 0.89, hoverScale: 0.94, yOffset: -8, zIndex: "z-20" },
    { width: "w-[275px] sm:w-[310px] md:w-[335px]", height: "h-[570px] sm:h-[650px] md:h-[690px]", baseScale: 1.00, hoverScale: 1.05, yOffset: -18, zIndex: "z-40" },
    { width: "w-[255px] sm:w-[285px] md:w-[310px]", height: "h-[535px] sm:h-[610px] md:h-[650px]", baseScale: 0.89, hoverScale: 0.94, yOffset: -8, zIndex: "z-20" },
    { width: "w-[250px] sm:w-[280px] md:w-[300px]", height: "h-[520px] sm:h-[590px] md:h-[630px]", baseScale: 0.82, hoverScale: 0.86, yOffset: 0, zIndex: "z-10" },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      id="device-showcase-section"
      className="py-24 sm:py-32 md:py-36 lg:py-40 px-0 sm:px-4 max-w-[1700px] mx-auto relative z-20 select-none overflow-hidden bg-bg-primary transition-colors duration-300 scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Centered Kiwik Logo */}
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
          className="flex justify-center relative animate-fade-in"
        >
          <InteractiveLogo />
        </motion.div>
      </div>

      {/* Dynamic Coverflow Device Wrapper */}
      <motion.div
        style={{ y: smoothY }}
        className="relative w-full flex items-center justify-center -space-x-4 sm:space-x-3 md:space-x-6 overflow-x-auto pt-16 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20 md:pb-24 lg:pb-28 no-scrollbar px-6 sm:px-12"
      >
        {activeCards.map((card, idx) => {
          const isHovered = hoveredIndex === idx;
          let settings = cardSettings[idx % cardSettings.length] || cardSettings[0];
          
          // Override dimensions based on CMS config phoneSize
          if (card.phoneSize === "small") {
            settings = { ...settings, baseScale: settings.baseScale * 0.9, hoverScale: settings.hoverScale * 0.9 };
          } else if (card.phoneSize === "large") {
            settings = { ...settings, baseScale: settings.baseScale * 1.1, hoverScale: settings.hoverScale * 1.1 };
          }

          const bg = card.themeColor || card.backgroundColor || (card.template === "investor" ? "#ffffff" : card.template === "designer" ? "#EBF2FE" : card.template === "pm" ? "#0C0D12" : card.template === "botanist" ? "#0E1F18" : "#0D150B");
          const isDarkBg = bg.startsWith("#0") || bg === "black" || bg === "#111" || bg === "#0C0D12" || bg === "#0E1F18" || bg === "#0D150B" || card.template === "pm" || card.template === "botanist" || card.template === "marketer";

          return (
            <motion.div
              key={card.id || idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                y: isHovered ? settings.yOffset - 8 : settings.yOffset + mousePos.y * (0.8 - (idx % 3) * 0.15),
                x: mousePos.x * (0.8 - (idx % 3) * 0.15),
                scale: isHovered ? settings.hoverScale : settings.baseScale,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.8 }}
              className={cn(
                "relative flex-shrink-0 shadow-[25px_35px_80px_rgba(0,0,0,0.18)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer group rounded-[48px] sm:rounded-[54px] transition-shadow duration-300",
                settings.width,
                settings.height,
                isHovered ? "z-50 shadow-[0_50px_120px_rgba(0,0,0,0.35)] dark:shadow-[0_50px_130px_rgba(0,0,0,0.95)]" : settings.zIndex
              )}
            >
              {/* Screen Container */}
              <div 
                className="absolute inset-[6px] sm:inset-[8px] rounded-[36px] sm:rounded-[42px] p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-inner pt-7 sm:pt-8 text-left"
                style={{ backgroundColor: bg, color: isDarkBg ? "#ffffff" : "#171717" }}
              >
                {/* 1. BACKGROUNDS (Image, Gradient, Blur, Noise, Overlay) */}
                {card.backgroundImageUrl && (
                  <img 
                    src={card.backgroundImageUrl} 
                    alt={card.profileAltText || card.name} 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                    style={{ filter: card.backgroundBlur ? `blur(${card.backgroundBlur}px)` : undefined }}
                  />
                )}
                {card.backgroundGradient && (
                  <div 
                    className="absolute inset-0 pointer-events-none z-1" 
                    style={{ background: card.backgroundGradient }} 
                  />
                )}
                {card.backgroundOverlayOpacity !== undefined && (
                  <div 
                    className="absolute inset-0 bg-black pointer-events-none z-2" 
                    style={{ opacity: card.backgroundOverlayOpacity }} 
                  />
                )}
                {card.backgroundNoise && (
                  <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none z-3" />
                )}

                {/* Specular Light Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-30 pointer-events-none z-20" />

                {/* Template Shaders Top */}
                {card.template === "designer" && (
                  <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-300/40 via-blue-200/20 to-transparent pointer-events-none" />
                )}
                {card.template === "pm" && (
                  <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-br from-blue-600/40 via-indigo-600/30 to-transparent blur-xl pointer-events-none" />
                )}
                {card.template === "botanist" && (
                  <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-emerald-700/40 via-teal-900/30 to-transparent pointer-events-none" />
                )}
                {card.template === "marketer" && (
                  <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-lime-600/40 via-emerald-800/20 to-transparent pointer-events-none" />
                )}

                {/* Header Content */}
                <div className="relative z-10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {card.avatarUrl ? (
                        <img 
                          src={card.avatarUrl} 
                          alt={card.profileAltText || card.name} 
                          className="w-8 h-8 rounded-full object-cover border border-black/10 dark:border-white/10" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                          {getInitials(card.name)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("text-xs font-bold", isDarkBg ? "text-white/90" : "text-neutral-800")}>{card.name}</span>
                          {card.onlineBadge && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block" />
                          )}
                        </div>
                        {(card.jobTitle || card.company) && (
                          <span className="text-[8px] opacity-75 font-medium truncate max-w-[120px]">
                            {card.jobTitle || card.role}{card.company ? ` @ ${card.company}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    {card.statusBadge && (
                      <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/10 font-bold uppercase tracking-wider text-white">
                        {card.statusBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight leading-tight">
                    {card.quote}
                  </h3>
                  {card.supportHeading && (
                    <h4 className="text-xs font-sans font-semibold opacity-85 mt-0.5 leading-snug">
                      {card.supportHeading}
                    </h4>
                  )}

                  <p className={cn("text-[10px] sm:text-[11px] font-sans leading-relaxed", isDarkBg ? "text-neutral-300" : "text-neutral-600")}>
                    {card.description}
                  </p>
                  {card.bodyText && (
                    <p className={cn("text-[9.5px] font-sans leading-relaxed", isDarkBg ? "text-neutral-400" : "text-neutral-500")}>
                      {card.bodyText}
                    </p>
                  )}

                  {/* Buttons Grid */}
                  <div className="space-y-1.5">
                    {card.ctaText && (
                      <Link
                        href={card.buttonLink || "/#docs"}
                        target={card.primaryButtonNewTab ? "_blank" : "_self"}
                        style={{ 
                          backgroundColor: card.primaryButtonColor || (isDarkBg ? "#ffffff" : "#2563eb"),
                          color: card.primaryButtonColor ? "#ffffff" : (isDarkBg ? "#000000" : "#ffffff") 
                        }}
                        className={cn(
                          "block w-full py-2 text-center rounded-full text-xs font-bold transition-all shadow-md",
                          card.primaryButtonStyle === "outline" ? "bg-transparent border border-current" : 
                          card.primaryButtonStyle === "glass" ? "backdrop-blur bg-white/10 border border-white/20" : ""
                        )}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          {card.primaryButtonIcon && (() => {
                            const Icon = (LucideIcons as any)[card.primaryButtonIcon];
                            return Icon ? <Icon className="w-3 h-3" /> : null;
                          })()}
                          {card.ctaText}
                        </span>
                      </Link>
                    )}

                    {card.secondaryButtonVisible && card.secondaryButtonLabel && (
                      <Link
                        href={card.secondaryButtonLink || "#"}
                        className={cn(
                          "block w-full py-2 text-center rounded-full text-xs font-bold transition-all border border-neutral-300/40 bg-neutral-100/5 hover:bg-neutral-100/10 text-neutral-300 shadow-sm"
                        )}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          {card.secondaryButtonIcon && (() => {
                            const Icon = (LucideIcons as any)[card.secondaryButtonIcon];
                            return Icon ? <Icon className="w-3 h-3" /> : null;
                          })()}
                          {card.secondaryButtonLabel}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Footer Blocks (Dynamic Blocks OR Legacy Fallback Templates) */}
                {card.blocks && card.blocks.length > 0 ? (
                  <div className="relative z-10 pt-3 border-t border-neutral-200/20 dark:border-white/10 space-y-3 overflow-y-auto max-h-[300px] pr-1 no-scrollbar">
                    {card.blocks.map((block, bIdx) => {
                      if (block.visible === false) return null;
                      switch (block.type) {
                        case "resume":
                        case "experience":
                        case "projects":
                          return (
                            <div key={block.id || bIdx} className="space-y-1">
                              <span className={cn("text-[9px] font-bold uppercase tracking-wider block", isDarkBg ? "text-neutral-400" : "text-neutral-500")}>
                                {block.title || "Experience"}
                              </span>
                              <div className="space-y-1.5 font-sans">
                                {(block.items || []).map((item, iIdx) => (
                                  <div key={iIdx} className={cn("p-2 rounded-xl border space-y-0.5", isDarkBg ? "bg-white/5 border-white/10" : "bg-neutral-50 border-neutral-100")}>
                                    <div className="text-xs font-bold">{item.title}</div>
                                    {item.subtitle && <p className="text-[10px] opacity-75">{item.subtitle}</p>}
                                    {item.desc && <p className="text-[9.5px] opacity-60 leading-tight">{item.desc}</p>}
                                    {item.date && (
                                      <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono mt-1", isDarkBg ? "bg-white/10 text-neutral-300" : "bg-neutral-200/50 text-neutral-600")}>
                                        <LucideIcons.Calendar className="w-2.5 h-2.5" />
                                        <span>{item.date}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        case "testimonial":
                          return (
                            <div key={block.id || bIdx} className="space-y-2">
                              <span className={cn("text-[9px] font-bold uppercase tracking-wider block", isDarkBg ? "text-neutral-400" : "text-neutral-500")}>
                                {block.title || "Testimonials"}
                              </span>
                              <div className="space-y-2">
                                {(block.items || []).map((item, iIdx) => (
                                  <div key={iIdx} className={cn("p-2.5 rounded-2xl border space-y-1 shadow-sm", isDarkBg ? "bg-white/5 border-white/10" : "bg-white/80 backdrop-blur-sm border-blue-100")}>
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-neutral-300 text-[9px] font-bold flex items-center justify-center text-neutral-800">
                                        {getInitials(item.title)}
                                      </div>
                                      <span className="text-[10px] font-bold">{item.title}</span>
                                    </div>
                                    <p className="text-[9.5px] opacity-85 leading-tight">
                                      {item.subtitle}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        case "faq":
                          return (
                            <div key={block.id || bIdx} className="space-y-2">
                              <span className={cn("text-[9px] font-bold uppercase tracking-wider block", isDarkBg ? "text-neutral-400" : "text-neutral-500")}>
                                {block.title || "FAQ"}
                              </span>
                              <div className="space-y-2">
                                {(block.items || []).map((item, iIdx) => (
                                  <div key={iIdx} className={cn("p-2.5 rounded-xl border space-y-1", isDarkBg ? "bg-white/5 border-white/10" : "bg-neutral-50 border-neutral-200")}>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-blue">
                                      <LucideIcons.HelpCircle className="w-3.5 h-3.5" />
                                      <span>{item.title}</span>
                                    </div>
                                    <p className="text-[9.5px] opacity-75">{item.subtitle}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        case "socials":
                          return (
                            <div key={block.id || bIdx} className="flex items-center justify-between px-1 py-1">
                              {(block.items || []).map((item, iIdx) => {
                                const Icon = (LucideIcons as any)[item.iconName || "Globe"] || LucideIcons.Globe;
                                return (
                                  <Link key={iIdx} href={item.link || "#"} className={cn("w-7 h-7 rounded-full border flex items-center justify-center shadow-sm", isDarkBg ? "bg-white/10 border-white/10 text-white" : "bg-white border-neutral-200 text-neutral-800")}>
                                    <Icon className="w-3.5 h-3.5" />
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        case "form":
                          return (
                            <div key={block.id || bIdx} className="space-y-1.5">
                              <span className={cn("text-[9px] font-bold uppercase tracking-wider block", isDarkBg ? "text-neutral-400" : "text-neutral-500")}>
                                {block.title || "Contact"}
                              </span>
                              <div className="space-y-1 text-[9px] font-mono">
                                <input placeholder="Name" disabled className={cn("w-full px-2.5 py-1 rounded-lg border", isDarkBg ? "bg-white/10 border-white/15 text-white placeholder-white/40" : "bg-neutral-50 border-neutral-200 text-neutral-800 placeholder-neutral-400")} />
                                <input placeholder="Email" disabled className={cn("w-full px-2.5 py-1 rounded-lg border", isDarkBg ? "bg-white/10 border-white/15 text-white placeholder-white/40" : "bg-neutral-50 border-neutral-200 text-neutral-800 placeholder-neutral-400")} />
                              </div>
                            </div>
                          );
                        case "skills":
                          return (
                            <div key={block.id || bIdx} className="space-y-1.5">
                              {block.title && <span className={cn("text-[9px] font-bold uppercase tracking-wider block", isDarkBg ? "text-neutral-400" : "text-neutral-500")}>{block.title}</span>}
                              <div className="flex flex-wrap gap-1">
                                {(block.items || []).map((item, iIdx) => (
                                  <span key={iIdx} className={cn("px-2 py-0.5 rounded-full text-[9px] font-semibold border", isDarkBg ? "bg-white/10 border-white/10 text-white" : "bg-neutral-100 border-neutral-200 text-neutral-800")}>
                                    {item.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        case "stats":
                          return (
                            <div key={block.id || bIdx} className="space-y-1">
                              {block.title && <span className={cn("text-[9px] font-bold uppercase tracking-wider block", isDarkBg ? "text-neutral-400" : "text-neutral-500")}>{block.title}</span>}
                              <div className="grid grid-cols-2 gap-2">
                                {(block.items || []).map((item, iIdx) => (
                                  <div key={iIdx} className={cn("p-2 rounded-xl text-center border", isDarkBg ? "bg-white/5 border-white/10" : "bg-neutral-50 border-neutral-100")}>
                                    <div className="text-sm font-bold text-accent-blue">{item.title}</div>
                                    <div className="text-[8.5px] opacity-75">{item.subtitle}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                ) : (
                  <>
                    {/* Fallback legacy template items */}
                    {card.template === "investor" && (
                      <div className="relative z-10 pt-2 border-t border-neutral-100 space-y-2">
                        <span className="text-[10px] font-bold text-neutral-400">Projects Funded</span>
                        <div className="space-y-1.5 font-sans">
                          {(card.subitems || []).map((sub, sIdx) => (
                            <div key={sIdx} className="p-2 rounded-xl bg-neutral-50 border border-neutral-100 space-y-0.5">
                              <div className="text-xs font-bold text-neutral-800">{sub.title}</div>
                              <p className="text-[10px] text-neutral-400">{sub.subtitle}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {card.template === "designer" && (
                      <div className="relative z-10 pt-2 border-t border-blue-200/60 space-y-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-600">
                          <span className="font-serif italic text-base">“</span> Testimonials
                        </div>
                        <div className="space-y-2">
                          {(card.subitems || []).map((sub, sIdx) => (
                            <div key={sIdx} className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 space-y-1 shadow-sm">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-neutral-300 text-[9px] font-bold flex items-center justify-center">
                                  {getInitials(sub.title)}
                                </div>
                                <span className="text-[10px] font-bold text-neutral-800">{sub.title}</span>
                              </div>
                              <p className="text-[9.5px] text-neutral-600 leading-tight">
                                {sub.subtitle}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {card.template === "pm" && (
                      <div className="relative z-10 pt-3 border-t border-white/10 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-white/70">
                          <LucideIcons.Briefcase className="w-3 h-3 text-blue-400" />
                          <span>Experience</span>
                        </div>
                        <div className="space-y-1.5">
                          {(card.subitems || []).map((sub, sIdx) => (
                            <div key={sIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                              <div className="text-xs font-bold text-white">{sub.title}</div>
                              <div className="text-[10px] text-neutral-400">{sub.subtitle}</div>
                              {sub.date && (
                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-mono text-neutral-300 mt-1">
                                  <LucideIcons.Calendar className="w-2.5 h-2.5" />
                                  <span>{sub.date}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {card.template === "botanist" && (
                      <div className="relative z-10 pt-2 border-t border-emerald-800/60 space-y-2">
                        <div className="flex items-center justify-between px-1">
                          {[LucideIcons.Globe, LucideIcons.MessageSquare, LucideIcons.Share2, LucideIcons.Send, LucideIcons.Lock].map((Icon, idx) => (
                            <div key={idx} className="w-6 h-6 rounded-full bg-white/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                              <Icon className="w-3 h-3" />
                            </div>
                          ))}
                        </div>

                        {(card.subitems || []).map((sub, sIdx) => (
                          <div key={sIdx} className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-emerald-500/20 space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-200">
                              <LucideIcons.HelpCircle className="w-3 h-3 text-emerald-400" /> FAQ
                            </div>
                            <p className="text-[9.5px] text-emerald-100 font-medium">{sub.title}</p>
                            <p className="text-[9px] text-emerald-300/80">{sub.subtitle}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {card.template === "marketer" && (
                      <div className="relative z-10 pt-2 border-t border-lime-900/60 space-y-1.5">
                        <span className="text-[10px] font-bold text-lime-300">Contact {card.name}</span>
                        <div className="space-y-1 text-[9px] font-mono">
                          <input placeholder="Name" disabled className="w-full px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40" />
                          <input placeholder="Email" disabled className="w-full px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40" />
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Premium Device Bezel Frame Overlay */}
              <img 
                src={card.phoneFrame || "https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048"} 
                alt="Device Frame" 
                className="absolute inset-0 w-full h-full object-fill pointer-events-none z-30"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
