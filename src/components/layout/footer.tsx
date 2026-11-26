"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as LucideIcons from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandGradient } from "@/components/gl/brand-gradient";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { LiquidGlass } from "@/components/gl/liquid-glass";
import { useGL } from "@/components/gl/use-gl";
import { officeTimeZone, splitOffices, useLocalTime } from "@/lib/offices";
import { validateEmail } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMS } from "@/stores/site-cms-store";
import { BAR, LEFT_BOTTOM, LEFT_TOP, VIEW, W_LEFT, W_RIGHT } from "./intro-splash";
import { KiwikWordmark } from "./kiwik-wordmark";

const LiquidLogo = dynamic(() => import("@/components/gl/liquid-logo"), { ssr: false });

const PANEL_COLORS: [string, string, string] = ["#232b62", "#007a78", "#131738"];

/** False for placeholders such as "https://twitter.com", which lead nowhere useful. */
function isProfileUrl(url: string): boolean {
  try {
    return new URL(url).pathname.replace(/\/+$/, "") !== "";
  } catch {
    return false;
  }
}

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
  const panel = useRef<HTMLDivElement>(null);

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

  const services = (cms.capabilities?.items || []).filter((c) => c.visible !== false);
  const projects = useProjects().filter((p) => (p as { visible?: boolean }).visible !== false);
  const offices = splitOffices(footerCMS.address);
  const socials = (footerCMS.socialLinks || []).filter((l) => isProfileUrl(l.url));
  // "Projects" already heads the list of work above.
  const bottomLinks = (footerCMS.bottomLinks || []).filter((l) => (l as { visible?: boolean }).visible !== false && l.href !== "/projects");

  // The admin CMS studio is a full-height app — no marketing footer there.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative z-20 mt-20 w-full overflow-hidden text-text-secondary">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Start a project: not where the visitor is already doing that. */}
        {pathname !== "/contact" && <section className="relative overflow-hidden rounded-[28px] md:rounded-[40px] text-white bg-[linear-gradient(112deg,#151a40_0%,#232b62_42%,#0a4f55_78%,#007a78_100%)]">
          <div ref={panel} className="absolute inset-0">
            <BrandGradient colors={PANEL_COLORS} brightness={1.15} strength={1.3} density={1} distance={2.1} />
          </div>
          {/* Keeps the text side dark whatever the gradient is doing. */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#10142e]/75 via-[#10142e]/35 to-transparent" />
          <FooterMark />
          <div className="relative px-6 pt-8 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:py-24 max-w-3xl lg:max-w-[54%]">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.08] text-balance">
              Have an idea? Let&rsquo;s build it.
            </h2>
            <p className="mt-5 max-w-lg text-base sm:text-lg text-white/80">
              A website, an app, an AI system or an online store. Tell us what you need and we will come back with a plan.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#151a40] transition-transform duration-200 hover:scale-[1.03]"
              >
                Start a project <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              {footerCMS.contactEmail && (
                <LiquidGlass behind={panel} base="#1d2557" className="rounded-full max-w-full">
                  <a href={`mailto:${footerCMS.contactEmail}`} className="rounded-full px-7 py-3.5 text-base font-semibold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] break-all focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
                    {footerCMS.contactEmail}
                  </a>
                </LiquidGlass>
              )}
            </div>
          </div>
        </section>}

        {/* Links */}
        <div className="pt-16 md:pt-20 pb-14 grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-12">
          {services.length > 0 && (
            <nav aria-label="Services" className="col-span-2 lg:col-span-4">
              <FooterHeading>What we build</FooterHeading>
              <ul className="mt-5 sm:columns-2 gap-x-6 space-y-3 [&>li]:break-inside-avoid">
                {services.map((s, i) => <FooterItem key={s.id || i} href="/#capabilities">{s.title}</FooterItem>)}
              </ul>
            </nav>
          )}
          {projects.length > 0 && (
            <nav aria-label="Our work" className="lg:col-span-2">
              <FooterHeading>Our work</FooterHeading>
              <ul className="mt-5 space-y-3">
                {projects.slice(0, 5).map((p) => <FooterItem key={p.slug} href={`/projects/${p.slug}`}>{p.name}</FooterItem>)}
                <FooterItem href="/projects">All projects</FooterItem>
              </ul>
            </nav>
          )}
          {(footerCMS.columns || []).map((col, idx) => (
            <nav key={col.id || idx} aria-label={col.title} className="lg:col-span-2">
              <FooterHeading>{col.title}</FooterHeading>
              <ul className="mt-5 space-y-3">
                {(col.links || []).map((link, i) => (
                  <FooterItem key={link.id || i} href={link.href} target={link.target}>
                    {link.label}
                    {link.badge && <span className="ml-2 px-1.5 py-0.5 text-[11px] font-bold rounded bg-[#008080]/10 text-[#008080] dark:text-[#4fc3bd]">{link.badge}</span>}
                  </FooterItem>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 lg:col-span-4 lg:pl-6">
            {offices.length > 0 && (
              <>
                <FooterHeading>Where we are</FooterHeading>
                <ul className="mt-5 space-y-3">
                  {offices.map((office) => <Office key={office} name={office} />)}
                </ul>
              </>
            )}
            {footerCMS.contactPhone && (
              <a href={`tel:${footerCMS.contactPhone.replace(/[^+\d]/g, "")}`} className="mt-3 inline-block text-base text-text-primary hover:underline">{footerCMS.contactPhone}</a>
            )}
            <form onSubmit={handleSubscribe} noValidate className={offices.length > 0 ? "mt-9" : ""}>
              <label htmlFor="footer-email" className="block text-sm font-bold text-text-primary">
                {footerCMS.newsletterHeadline || "News from Kiwik"}
              </label>
              <div className="mt-3 flex items-center rounded-full border border-text-primary/15 bg-text-primary/[0.03] pl-5 pr-1.5 py-1.5 focus-within:border-[#008080] transition-colors">
                <input
                  id="footer-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                  aria-describedby="footer-email-status"
                  placeholder={footerCMS.newsletterPlaceholder || "Enter your email"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className="min-w-0 flex-1 bg-transparent py-2 text-base text-text-primary placeholder:text-text-secondary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="shrink-0 rounded-full bg-[#232b62] hover:bg-[#008080] text-white px-5 py-2.5 text-sm font-bold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {submitting ? "Subscribing…" : subscribed ? "Subscribed" : footerCMS.newsletterButtonText || "Subscribe"}
                </button>
              </div>
              <p id="footer-email-status" role={error ? "alert" : "status"} className={cn("mt-2 text-sm", error ? "font-medium text-rose-600 dark:text-rose-400" : statusMessage ? "font-medium text-[#008080] dark:text-[#4fc3bd]" : "")}>
                {error || statusMessage || footerCMS.newsletterDescription}
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* The name, full width */}
      <div className="px-4 sm:px-6 md:px-8 pb-4 md:pb-6 max-w-[1400px] mx-auto">
        <KiwikWordmark text={footerCMS.logoText || "Kiwik"} />
      </div>

      <div className="border-t border-divider">
        {/* Room on the right for the floating "Ask Kiwik AI" button. */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 pb-24 sm:pb-6 sm:pr-48 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <p>{footerCMS.copyrightText || `© ${new Date().getFullYear()} Kiwik. All rights reserved.`}</p>
          {bottomLinks.map((l, i) => (
            <Link key={l.href || i} href={l.href || "/"} className="hover:text-text-primary transition-colors">{l.label}</Link>
          ))}
          {socials.map((link, idx) => (
            <a key={link.id || idx} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-text-primary transition-colors">
              {renderSocialIcon(link.platform, link.iconName)} {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/** The logo, coming together as the panel scrolls into view and then turning to liquid metal. Lighter than the original, to read on the dark panel. */
function FooterMark() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const gl = useGL(ref, "0px");
  const inView = useInView(ref, { amount: 0.4 });
  const [melted, setMelted] = useState(false);

  // Only once the pieces have met.
  useEffect(() => {
    if (gl !== "on" || !inView) {
      if (gl !== "on") setMelted(false);
      return;
    }
    const t = setTimeout(() => setMelted(true), 2300);
    return () => clearTimeout(t);
  }, [gl, inView]);

  const piece = (from: { x?: number; y?: number }, delay: number) => ({
    initial: { opacity: 0, ...from },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: reduced ? { duration: 0 } : { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });
  return (
    <div ref={ref} aria-hidden="true" className="relative mx-6 mt-10 sm:mx-10 w-56 sm:w-72 lg:m-0 lg:absolute lg:top-1/2 lg:right-[5%] lg:w-[40%] aspect-[960/530] lg:-translate-y-1/2">
      <svg viewBox={VIEW} className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id="kf-navy" gradientUnits="userSpaceOnUse" x1="205" y1="425" x2="312" y2="560">
          <stop stopColor="#4a5aae" /><stop offset=".6" stopColor="#7c90d0" /><stop offset="1" stopColor="#c3d6f6" />
        </linearGradient>
        <linearGradient id="kf-teal" gradientUnits="userSpaceOnUse" x1="252" y1="530" x2="130" y2="690">
          <stop stopColor="#05534d" /><stop offset="1" stopColor="#1cbdb6" />
        </linearGradient>
        <linearGradient id="kf-bar" gradientUnits="userSpaceOnUse" x1="370" y1="560" x2="400" y2="730">
          <stop stopColor="#1cbdb6" /><stop offset="1" stopColor="#05534d" />
        </linearGradient>
        <linearGradient id="kf-w1" gradientUnits="userSpaceOnUse" x1="375" y1="770" x2="560" y2="545">
          <stop stopColor="#c3d6f6" /><stop offset=".35" stopColor="#4a5aae" /><stop offset=".8" stopColor="#4a5aae" /><stop offset="1" stopColor="#a9bff0" />
        </linearGradient>
        <linearGradient id="kf-w2" gradientUnits="userSpaceOnUse" x1="550" y1="610" x2="650" y2="765">
          <stop stopColor="#262f6e" /><stop offset=".5" stopColor="#4a5aae" /><stop offset="1" stopColor="#c3d6f6" />
        </linearGradient>
        <radialGradient id="kf-dot" cx=".66" cy=".27" r=".8">
          <stop stopColor="#ffffff" /><stop offset=".45" stopColor="#b9c2d4" /><stop offset="1" stopColor="#6c7690" />
        </radialGradient>
        <symbol id="kf-mark" viewBox={VIEW}>
          <path d={LEFT_BOTTOM} fill="url(#kf-teal)" /><path d={LEFT_TOP} fill="url(#kf-navy)" />
          <g transform="rotate(180 511.5 511.8)"><path d={LEFT_BOTTOM} fill="url(#kf-teal)" /><path d={LEFT_TOP} fill="url(#kf-navy)" /></g>
          <path d={BAR} fill="url(#kf-bar)" /><path d={BAR} fill="url(#kf-bar)" transform="matrix(-1 0 0 1 1024 0)" />
          <path d={W_RIGHT} fill="url(#kf-w2)" /><path d={W_LEFT} fill="url(#kf-w1)" />
        </symbol>
      </defs>
      <motion.g {...piece({ x: -220 }, 0.1)}>
        <path d={LEFT_BOTTOM} fill="url(#kf-teal)" />
        <path d={LEFT_TOP} fill="url(#kf-navy)" />
      </motion.g>
      <motion.g {...piece({ x: 220 }, 0.1)}>
        <g transform="rotate(180 511.5 511.8)">
          <path d={LEFT_BOTTOM} fill="url(#kf-teal)" />
          <path d={LEFT_TOP} fill="url(#kf-navy)" />
        </g>
      </motion.g>
      <motion.g {...piece({ y: 160 }, 0.3)}>
        <path d={BAR} fill="url(#kf-bar)" />
        <path d={BAR} fill="url(#kf-bar)" transform="matrix(-1 0 0 1 1024 0)" />
        <path d={W_RIGHT} fill="url(#kf-w2)" />
        <path d={W_LEFT} fill="url(#kf-w1)" />
      </motion.g>
      <motion.g {...piece({ y: -120 }, 0.6)}>
        <circle cx="438" cy="295" r="41.5" fill="url(#kf-dot)" />
        <circle cx="585" cy="295" r="41.5" fill="url(#kf-dot)" />
      </motion.g>
      </svg>
      {gl === "on" && inView && (
        <div className={cn("absolute inset-0 transition-opacity duration-[1400ms]", melted ? "opacity-100" : "opacity-0")}>
          <GLBoundary>
            <LiquidLogo />
            {/* The logo's own colours over the metal's light and shade. */}
            <svg viewBox={VIEW} className="absolute inset-0 h-full w-full mix-blend-color opacity-80"><use href="#kf-mark" x="32" y="246" width="960" height="530" /></svg>
          </GLBoundary>
        </div>
      )}
    </div>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-text-primary">{children}</h3>;
}

function FooterItem({ href, target, children }: { href: string; target?: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        target={target || "_self"}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className="inline-block text-base bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] hover:bg-[length:100%_1px] hover:text-text-primary transition-[background-size,color] duration-300"
      >
        {children}
      </Link>
    </li>
  );
}

/** A location, with its local time when the city is one we know. */
function Office({ name }: { name: string }) {
  const time = useLocalTime(officeTimeZone(name));

  return (
    <li className="flex items-baseline justify-between gap-4 text-base">
      <span className="text-text-primary">{name}</span>
      {time && <time className="tabular-nums whitespace-nowrap">{time}</time>}
    </li>
  );
}
