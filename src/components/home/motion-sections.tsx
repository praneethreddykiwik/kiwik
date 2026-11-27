"use client";

import React from "react";
import dynamic from "next/dynamic";

/*
 * Three moving pictures from the landing page concepts (12, 15 and 19); 13 is the hero,
 * placed between the home page's own sections. Each one loads only when the
 * page needs it, and pauses or falls back to a still version off screen,
 * under reduced motion and on devices without a real GPU.
 */

// Holds the picture's height while its code loads, so nothing below jumps.
const loading = () => <div className="mx-auto w-full max-w-[1700px] h-[300px] sm:h-[440px] md:h-[480px] my-2 sm:my-6" />;

const GlassWords = dynamic(() => import("@/components/concepts/c12-glass-words").then((m) => m.GlassWordsVisual), { ssr: false, loading });
const Particles = dynamic(() => import("@/components/concepts/c15-particles").then((m) => m.ParticleVisual), { ssr: false, loading });
const Flow = dynamic(() => import("@/components/concepts/c19-flow").then((m) => m.FlowVisual), { ssr: false, loading });

function Section({ id, title, text, children }: { id: string; title: React.ReactNode; text: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative z-20 overflow-hidden py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 text-center">
        <h2 className="mx-auto max-w-4xl text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.08] text-text-primary text-balance">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary text-pretty">{text}</p>
      </div>
      <div className="mt-6 md:mt-10">{children}</div>
    </section>
  );
}

export function WhatWeBuildSection() {
  return (
    <Section id="what-we-build" title={<>Everything your business <i className="font-semibold">runs on</i></>} text="The flagship your customers see, the app in their pocket and the command centre your team runs on. We design and engineer all of it.">
      <GlassWords />
    </Section>
  );
}

export function AiFlowSection() {
  return (
    <Section id="ai-for-your-business" title={<>The busywork goes in. <i className="font-semibold">The results come out.</i></>} text="Emails, chats, orders and spreadsheets stream into one intelligent engine built around your business. Replies, inventory, payments and insights flow out, and your team steps in only where a human touch matters.">
      <Flow />
    </Section>
  );
}

export function OneTeamSection() {
  return (
    <Section id="one-team" title={<>One crew, <i className="font-semibold">every layer of the stack</i></>} text="Digital flagships, native apps, autonomous agents, commerce engines and live dashboards, engineered and cared for by the same people.">
      <Particles />
    </Section>
  );
}
