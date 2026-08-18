"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Sparkles, ArrowRight, Radar, Layers, Handshake, Activity } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { PartnerCard } from "@/components/partners/partner-card";
import { useProducts } from "@/stores/products-store";
import { useSiteCMS } from "@/stores/site-cms-store";

// Distinctive, non-generic defaults. Overridable via the admin (cms.partnersPage).
const DEFAULTS = {
  eyebrow: "THE ALLIANCE",
  headline: "We don't chase reach.",
  headlineAccent: "We compound it.",
  subhead:
    "Kiwik operates as your embedded growth partner — part studio, part signal engine — turning scattered attention into durable momentum for the ventures we back.",
  servicesTitle: "How the partnership works",
  servicesSub: "Four disciplines, one compounding loop.",
  showcaseEyebrow: "BRAND PARTNERS",
  showcaseTitle: "Brands we build with",
  showcaseSub: "The partners we back — and the momentum we build with them.",
};

const SERVICES = [
  {
    icon: Radar,
    name: "Signal Architecture",
    body: "We map where your audience already leans, then build the shortest path from curiosity to conviction.",
  },
  {
    icon: Layers,
    name: "Compounding Creative",
    body: "Assets engineered to age well — each one earns attention and quietly feeds the next.",
  },
  {
    icon: Handshake,
    name: "Partner Economics",
    body: "Revenue-aligned affiliate structures where our upside is your growth, never your ad spend.",
  },
  {
    icon: Activity,
    name: "Momentum Ops",
    body: "Always-on measurement and iteration, so nothing plateaus quietly on our watch.",
  },
];

export default function PartnersPage() {
  const products = useProducts();
  const cms = useSiteCMS();
  const p = (cms as any).partnersPage || {};
  const copy = { ...DEFAULTS, ...p };
  const services = Array.isArray(p.services) && p.services.length > 0 ? p.services : SERVICES;
  const contactEmail = cms.settings?.contactEmail || "praneeth@kiwik.one";

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 md:px-10 pt-16 sm:pt-24 pb-16 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-bg border border-glass-border mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text-secondary">
            {copy.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-text-primary leading-[1.05] tracking-tight"
        >
          {copy.headline}
          <br />
          <span className="bg-gradient-to-r from-accent-blue via-indigo-400 to-purple-400 bg-clip-text text-transparent italic">
            {copy.headlineAccent}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed font-sans"
        >
          {copy.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#showcase"
            className="px-5 py-2.5 rounded-full bg-text-primary text-bg-primary font-bold text-sm flex items-center gap-2 hover:scale-[1.03] transition-transform"
          >
            See the work <ArrowRight className="w-4 h-4" />
          </a>
          {/* This was a Next <Link> wrapping a mailto: URL. Link is for
              internal routes — it intercepts the click for the client router,
              which cannot navigate to mailto:, so the button did nothing.
              It now opens the contact form with the partnership service
              already selected, which also lands the enquiry in the studio
              inbox instead of depending on the visitor's mail client. */}
          <Link
            href="/contact?service=Digital%20Market%20Partnership"
            className="px-5 py-2.5 rounded-full bg-glass-bg border border-glass-border text-text-primary font-bold text-sm hover:bg-bg-secondary transition-colors"
          >
            Start a conversation
          </Link>
        </motion.div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-10 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-text-primary">{copy.servicesTitle}</h2>
          <p className="mt-2 text-sm sm:text-base text-text-secondary">{copy.servicesSub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s: any, i: number) => {
            const Icon =
              (s.iconName && (LucideIcons as any)[s.iconName]) || s.icon || Sparkles;
            return (
              <GlassCard key={s.name || i} className="p-6 h-full space-y-3 text-left" tilt={false}>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent-blue/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-blue" />
                </div>
                <h3 className="text-base font-bold text-text-primary">{s.name}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ── SHOWCASE ─────────────────────────────────────── */}
      <section id="showcase" className="px-4 sm:px-6 md:px-10 py-14 max-w-6xl mx-auto scroll-mt-24">
        <div className="mb-10">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-accent-blue">
            {copy.showcaseEyebrow}
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-text-primary">
            {copy.showcaseTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-2xl">{copy.showcaseSub}</p>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center text-text-muted text-sm font-mono">
            No work published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <PartnerCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <GlassCard className="p-8 sm:p-12 text-center space-y-4" tilt={false}>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary">
            Think there's momentum to unlock?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
            We take on a small number of partners at a time — enough to stay obsessive about each one.
          </p>
          <div className="pt-2">
            {/* The contact page exists now and stores enquiries in the studio
                inbox, so the form beats a mailto: an enquiry no longer depends
                on the visitor having a configured mail client, and nothing is
                lost if they abandon the draft. */}
            <a
              href="/contact?service=Digital%20Market%20Partnership"
              className="inline-flex px-6 py-3 rounded-full bg-accent-blue text-white font-bold text-sm items-center gap-2 hover:scale-[1.03] transition-transform"
            >
              Become a partner <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
