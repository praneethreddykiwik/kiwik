"use client";

import React, { useState } from "react";
import { 
  Clock, Calendar, User, Copy, Check, ExternalLink, Printer, 
  FileDown, Bookmark, ThumbsUp, ThumbsDown, Share2, Sparkles 
} from "lucide-react";
import type { DocTocItem } from "@/types/docs-types";

interface DocsRightSidebarProps {
  toc: DocTocItem[];
  activeSectionId: string;
  onSelectToc: (id: string) => void;
  readingTimeMinutes: number;
  lastUpdated: string;
  author: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenAiAssistant: () => void;
}

export function DocsRightSidebar({
  toc,
  activeSectionId,
  onSelectToc,
  readingTimeMinutes,
  lastUpdated,
  author,
  isBookmarked,
  onToggleBookmark,
  onOpenAiAssistant
}: DocsRightSidebarProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExportMarkdown = () => {
    alert("Exporting documentation page as Markdown payload...");
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pl-2 custom-scrollbar select-none text-left">
      {/* Ask Kiwik AI Banner */}
      <button
        onClick={onOpenAiAssistant}
        className="w-full p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white/10 dark:hover:bg-white/15 text-white text-left transition-all shadow-md border border-neutral-800 dark:border-white/15 cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">AI Assistant</span>
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-xs font-bold leading-tight">Ask Kiwik AI about this document</p>
        <span className="text-[10px] text-neutral-400 font-medium mt-1 inline-block">Summarize, explain architecture, or generate code →</span>
      </button>

      {/* On-Page Table of Contents */}
      {toc.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-xs font-mono tracking-wider text-neutral-900 dark:text-white uppercase font-bold">
            On This Page
          </h5>
          <nav className="space-y-1 text-xs border-l border-neutral-200/80 dark:border-white/10 pl-3">
            {toc.map((item) => {
              const isActive = activeSectionId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectToc(item.id)}
                  className={`block text-left py-1 text-xs font-medium transition-all cursor-pointer ${
                    item.level === 3 ? "pl-3 text-[11px]" : ""
                  } ${
                    isActive
                      ? "text-neutral-900 dark:text-white font-bold translate-x-1"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Page Metadata Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 space-y-3 text-left shadow-xs">
        <h5 className="text-xs font-mono tracking-wider text-neutral-900 dark:text-white uppercase font-bold">
          Page Info
        </h5>

        <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
              <Clock className="w-3.5 h-3.5" /> Reading Time
            </span>
            <span className="font-bold text-slate-800 dark:text-white">{readingTimeMinutes} min</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
              <Calendar className="w-3.5 h-3.5" /> Last Updated
            </span>
            <span className="font-bold text-slate-800 dark:text-white">{lastUpdated}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
              <User className="w-3.5 h-3.5" /> Author
            </span>
            <span className="font-bold text-slate-800 dark:text-white">{author}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions List */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-mono tracking-widest text-slate-900 dark:text-white uppercase font-bold">
          Actions
        </h5>

        <div className="space-y-1.5 text-xs font-semibold">
          <button
            onClick={onToggleBookmark}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
              isBookmarked
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold"
                : "bg-white/40 dark:bg-white/5 border-slate-300/40 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-neutral-200/50 dark:hover:bg-white/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-indigo-500 text-indigo-500" : ""}`} />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark Page"}</span>
            </span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-slate-300/40 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-neutral-200/50 dark:hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
            </span>
          </button>

          <a
            href="https://github.com/praneethreddykiwik/kiwik"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-slate-300/40 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-neutral-200/50 dark:hover:bg-white/10 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Edit on GitHub</span>
            </span>
          </a>

          <button
            onClick={handlePrint}
            className="w-full p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-slate-300/40 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-neutral-200/50 dark:hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="w-full p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-slate-300/40 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-neutral-200/50 dark:hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </span>
          </button>
        </div>
      </div>

      {/* Feedback Widget */}
      <div className="p-4 rounded-2xl bg-neutral-200/40 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 space-y-3 text-left backdrop-blur-xl">
        <h5 className="text-[11px] font-mono tracking-widest text-slate-900 dark:text-white uppercase font-bold">
          Was this page helpful?
        </h5>

        {feedbackGiven ? (
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl text-center border border-emerald-500/20">
            Thank you for your feedback! ❤️
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setFeedbackGiven("up")}
              className="flex-1 py-2 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-emerald-500/10 border border-slate-300/40 dark:border-white/10 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Yes
            </button>
            <button
              onClick={() => setFeedbackGiven("down")}
              className="flex-1 py-2 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-rose-500/10 border border-slate-300/40 dark:border-white/10 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> No
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
