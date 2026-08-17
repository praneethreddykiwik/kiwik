"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { 
  Mail, 
  MapPin, 
  MessageSquare, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Terminal,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { validateEmail } from "@/lib/validation";
import { cn } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.475 20.455 12 20.455 12 20.455s7.524 0 9.388-.51a3.002 3.002 0 0 0 2.11-2.108C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

import { useSiteCMS } from "@/stores/site-cms-store";

export function Footer() {
  const cms = useSiteCMS();
  const footerCMS = cms.footer || {
    columns: [],
    socialLinks: [],
    copyrightText: "",
    newsletterHeadline: "",
    newsletterDescription: "",
    newsletterButtonText: "",
    policyBadges: [],
    bottomLinks: []
  };

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // `type="email"` follows the HTML5 rule, which accepts "a..b@example.com",
    // ".....@gmail.com" and "test@test". And the old guard — `if
    // (!email.trim()) return;` — swallowed a spaces-only entry with no message,
    // so the form looked broken rather than invalid.
    const problem = validateEmail(email);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Only claim success once the address is actually stored.
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubscribed(true);
      setStatusMessage(footerCMS.newsletterSuccessMessage || "Subscribed successfully!");
      setEmail("");
      setTimeout(() => {
        setSubscribed(false);
        setStatusMessage("");
      }, 4000);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderSocialIcon = (platform: string, iconName: string) => {
    const platLower = platform.toLowerCase();
    const iconLower = iconName ? iconName.toLowerCase() : "";

    if (platLower.includes("github") || iconLower === "github") {
      return <GithubIcon className="w-4 h-4" />;
    }
    if (platLower === "x" || platLower.includes("twitter") || iconLower === "x" || iconLower === "twitter") {
      return <XIcon className="w-4 h-4" />;
    }
    if (platLower.includes("linkedin") || iconLower === "linkedin") {
      return <LinkedInIcon className="w-4 h-4" />;
    }
    if (platLower.includes("youtube") || iconLower === "youtube") {
      return <YoutubeIcon className="w-4 h-4" />;
    }
    if (platLower.includes("discord") || iconLower === "discord") {
      return <DiscordIcon className="w-4 h-4" />;
    }
    
    const LucideIcon = (LucideIcons as any)[iconName] || LucideIcons.Globe;
    return <LucideIcon className="w-4 h-4" />;
  };

  // The admin CMS studio is a full-height app — no marketing footer there.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full mt-20 pt-16 pb-8 px-4 sm:px-6 md:px-8 border-t border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#070708] text-neutral-700 dark:text-neutral-300 relative z-20 transition-colors"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Newsletter Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 mb-16 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 text-left mr-auto">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-wide">
                {footerCMS.newsletterHeadline || "Stay in the Loop"}
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-1 max-w-md font-medium leading-relaxed">
                {footerCMS.newsletterDescription || "Get product updates, launch notes, and insights directly in your inbox."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-center gap-3 w-full md:w-auto relative min-w-full sm:min-w-[360px] md:min-w-[400px]">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="email"
                required
                aria-label="Email address for newsletter"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "newsletter-error" : undefined}
                placeholder={footerCMS.newsletterPlaceholder || "Enter your email"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-black/60 border border-neutral-300 dark:border-white/15 focus:outline-none focus:border-indigo-500 text-xs font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 shrink-0 cursor-pointer"
            >
              {submitting ? "Subscribing…" : subscribed ? "Subscribed!" : (footerCMS.newsletterButtonText || "Subscribe")}
            </button>
          </form>
          {error && (
            <p
              id="newsletter-error"
              role="alert"
              className="mt-2 text-[11px] font-semibold text-rose-500 dark:text-rose-400"
            >
              {error}
            </p>
          )}
          {statusMessage && (
            <div className="absolute bottom-2 right-6 text-[10px] font-mono text-emerald-500 animate-fade-in">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Main Sitemap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 lg:gap-6 pb-14 border-b border-neutral-200/80 dark:border-white/10 overflow-hidden">
          
          {/* Brand block */}
          <div className="sm:col-span-2 md:col-span-6 lg:col-span-3 space-y-4 text-left pr-0 lg:pr-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold text-neutral-900 dark:text-white tracking-wide">
                {footerCMS.logoText || "Kiwik"}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed max-w-sm font-medium">
              The operating system for digital products. Build, ship, document, and scale your ideas with engineering excellence.
            </p>
            {footerCMS.statusBadgeVisible !== false && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{footerCMS.statusBadgeText || "All Systems Operational"}</span>
              </div>
            )}

            {/* Social Icons row */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              {(footerCMS.socialLinks || []).map((link, idx) => (
                <Link 
                  key={link.id || idx}
                  href={link.url} 
                  target="_blank" 
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {renderSocialIcon(link.platform, link.iconName)}
                </Link>
              ))}
            </div>
          </div>

          {/* Dynamic Sitemap columns */}
          {(footerCMS.columns || []).map((col, idx) => (
            <div 
              key={col.id || idx} 
              className="col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-2 text-left space-y-3"
            >
              <h5 className="text-xs font-mono tracking-wider text-neutral-900 dark:text-white uppercase font-bold">
                {col.title}
              </h5>
              <ul className="space-y-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {(col.links || []).map((link, lIdx) => (
                  <li key={link.id || lIdx}>
                    <Link 
                      href={link.href} 
                      target={link.target || "_self"}
                      className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-bold rounded-sm bg-indigo-500/10 text-indigo-500 uppercase tracking-tight">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Get in Touch Card */}
          <div className="col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-3 p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 flex flex-col gap-4 text-left shadow-sm w-full max-w-full">
            <h5 className="text-xs font-mono tracking-wider text-neutral-900 dark:text-white uppercase font-bold">Get in Touch</h5>
            
            <div className="space-y-3.5">
              {footerCMS.contactEmail && (
                <div className="flex gap-2.5 items-start">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <a href={`mailto:${footerCMS.contactEmail}`} className="text-xs font-bold text-neutral-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all">
                      {footerCMS.contactEmail}
                    </a>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">We usually reply within 24 hours</p>
                  </div>
                </div>
              )}

              {footerCMS.address && (
                <div className="flex gap-2.5 items-start border-t border-neutral-200/80 dark:border-white/10 pt-3">
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-slate-100">Kiwik HQ</span>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">{footerCMS.address}</p>
                  </div>
                </div>
              )}

              {footerCMS.contactPhone && (
                <div className="flex gap-2.5 items-start border-t border-neutral-200/80 dark:border-white/10 pt-3">
                  <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-slate-100">Live Support</span>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">{footerCMS.contactPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Lower Row Copyright & Telemetry Metrics */}
        <div className="pt-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">
          
          {/* Copyright block */}
          <div className="text-left space-y-1 select-none">
            <div className="text-xs font-bold text-neutral-900 dark:text-white">
              {footerCMS.copyrightText || `© ${new Date().getFullYear()} Kiwik. All rights reserved.`}
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
              Kiwik.1 is a registered trademark of Kiwik Inc. <br />
              Built with ❤️ by the Kiwik Engineering Team.
            </p>

            {/* The CMS has carried `bottomLinks` all along but nothing rendered
                them, so the privacy notice had nowhere to be linked from — and a
                notice nobody can reach does not discharge the obligation to give
                one. */}
            {(footerCMS.bottomLinks || []).length > 0 && (
              <nav aria-label="Legal and secondary links" className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                {(footerCMS.bottomLinks || [])
                  .filter((l: { visible?: boolean }) => l?.visible !== false)
                  .map((l: { href?: string; label?: string }, i: number) => (
                    <Link
                      key={l.href || i}
                      href={l.href || "/"}
                      className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
              </nav>
            )}
          </div>

          {/* Metrics grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 select-none flex-1 max-w-4xl w-full xl:w-auto">
            
            {/* Status metric */}
            <div className="text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>System Status</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">All services running smoothly</p>
              <Link href="#macos-dashboard-widget" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>View status page</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            {/* Performance metric */}
            <div className="text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                <Cpu className="w-3.5 h-3.5 text-amber-500" />
                <span>Performance</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">99.9% uptime this month</p>
              <Link href="#macos-dashboard-widget" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>View metrics</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            {/* Security metric */}
            <div className="text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Security</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">SOC 2 Type II Compliant</p>
              <Link href="#macos-dashboard-widget" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>View security</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            {/* Made for developers */}
            <div className="text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                <Terminal className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Made for developers</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Designed with precision. <br />
                Engineered for scale.
              </p>
            </div>

          </div>

        </div>

      </div>
    </motion.footer>
  );
}
