"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteCMSStore } from "@/stores/site-cms-store";

export function PromptCTA() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  const promptBar = useSiteCMSStore((state) => state.cms.promptBar) || {
    placeholder: "Brief our AI agent...",
    buttonLabel: "Submit Prompt",
    gradientStart: "#fb923c",
    gradientMiddle: "#ec4899",
    gradientEnd: "#818cf8",
    rotatingWords: [],
    suggestionChips: [],
    iconName: "Sparkles",
    buttonIcon: "ArrowRight",
    buttonLink: "/projects"
  };

  const samplePrompts = (promptBar.rotatingWords && promptBar.rotatingWords.length > 0)
    ? promptBar.rotatingWords
    : [
        "Design a product launch campaign for a new sneaker drop...",
        "Build an autonomous AI agent workflow for customer onboarding...",
        "Generate a 3D glassmorphic dashboard design system...",
        "Architect a zero-latency serverless cloud infrastructure..."
      ];

  useEffect(() => {
    if (userPrompt) return; // Pause auto typewriter if user is typing custom text

    const currentFullPrompt = samplePrompts[promptIndex % samplePrompts.length];
    let charIdx = 0;

    const typingInterval = setInterval(() => {
      if (charIdx <= currentFullPrompt.length) {
        setDisplayedText(currentFullPrompt.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setPromptIndex((prev) => (prev + 1) % samplePrompts.length);
        }, 3000);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [promptIndex, userPrompt, samplePrompts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeText = userPrompt || displayedText;
    if (!activeText) return;
    alert(`Submitting prompt request to Kiwik AI Agent: "${activeText}"`);
  };

  // Resolve Lucide Icon dynamically
  const IconComponent = (LucideIcons as any)[promptBar.iconName] || LucideIcons.Sparkles;
  const ButtonIconComponent = (LucideIcons as any)[promptBar.buttonIcon] || LucideIcons.ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto px-4 select-none"
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-[#18181B] text-white p-2 rounded-full border border-white/10 shadow-2xl hover:border-white/20 transition-all group"
      >
        {/* Dynamic Gradient Bowtie / Capsule Icon badge */}
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 ml-1 text-white/80 group-hover:text-white group-hover:scale-105 transition-all">
          <div 
            className="w-4 h-2.5 rounded-full"
            style={{
              background: `linear-gradient(to right, ${promptBar.gradientStart || '#fb923c'}, ${promptBar.gradientMiddle || '#ec4899'}, ${promptBar.gradientEnd || '#818cf8'})`
            }}
          />
        </div>

        {/* Input Text / Animated Typewriter */}
        <input
          type="text"
          value={userPrompt || displayedText}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={promptBar.placeholder || "Brief our AI agent..."}
          className="flex-1 bg-transparent px-3 text-xs font-sans font-medium text-white/90 placeholder-white/40 focus:outline-none truncate"
        />

        {/* Action Submit Button */}
        <button
          type="submit"
          title={promptBar.buttonLabel || "Submit"}
          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white text-white hover:text-black flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md group-hover:scale-105"
        >
          <ButtonIconComponent className="w-4 h-4" />
        </button>
      </form>

      {/* Suggestion Chips */}
      {promptBar.suggestionChips && promptBar.suggestionChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3.5">
          {promptBar.suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setUserPrompt(chip)}
              className="px-2.5 py-1 rounded-full bg-neutral-900/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[9px] font-mono font-bold uppercase tracking-tight text-neutral-600 dark:text-neutral-300 hover:border-neutral-800/30 dark:hover:border-white/20 transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
