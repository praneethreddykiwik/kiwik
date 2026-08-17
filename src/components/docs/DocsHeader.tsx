"use client";

import React from "react";
import { Search, Sparkles, Terminal, FileText, Box, Globe, Folder, Command } from "lucide-react";
import { motion } from "framer-motion";

interface DocsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCommandPalette: () => void;
}

export function DocsHeader({ searchQuery, onSearchChange, onOpenCommandPalette }: DocsHeaderProps) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl bg-white dark:bg-[#0D0D0E] border border-neutral-200/80 dark:border-white/10 p-6 sm:p-8 md:p-10 transition-all shadow-sm">
      <div className="relative z-10 space-y-6 text-left">
        {/* Top Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-bold tracking-tight">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Kiwik.1 Platform Specs</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold tracking-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Current Version v1.0.0-beta</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 dark:text-white tracking-wide">
            Documentation Center
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg max-w-2xl font-medium leading-relaxed">
            Everything about Kiwik in one place. Explore system blueprints, API specifications, component libraries, and live telemetry engines.
          </p>
        </div>

        {/* Search & Command Palette Button Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search documentation, APIs, components, commands... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-black/60 border border-neutral-200 dark:border-white/15 focus:outline-none focus:border-neutral-900 dark:focus:border-white text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-xs transition-all"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-white/10 text-[10px] font-mono text-neutral-600 dark:text-neutral-400 font-bold border border-neutral-300 dark:border-white/10">
              /
            </kbd>
          </div>

          <button
            onClick={onOpenCommandPalette}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Command className="w-4 h-4" />
            <span>Command Palette</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/20 dark:bg-black/20 text-[10px] font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-200/80 dark:border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">120+</span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Documentation Pages</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-1">
              <Box className="w-4 h-4" />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">48</span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">UI Components</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <Globe className="w-4 h-4" />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">16</span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">API Modules</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <Folder className="w-4 h-4" />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">24</span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Active Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
}
