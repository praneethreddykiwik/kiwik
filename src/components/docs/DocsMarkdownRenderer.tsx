"use client";

import React, { useState } from "react";
import { Copy, Check, Info, AlertTriangle, Lightbulb, AlertCircle, FileCode } from "lucide-react";
import type { DocArticleSection } from "@/types/docs-types";

interface DocsMarkdownRendererProps {
  sections: DocArticleSection[];
}

export function DocsMarkdownRenderer({ sections }: DocsMarkdownRendererProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  return (
    <div className="space-y-10 my-6 text-left">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-4 scroll-mt-28">
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-300/40 dark:border-white/10 pb-2">
            {section.heading}
          </h2>

          {/* Body Markdown Content */}
          <div className="text-sm text-slate-600 dark:text-slate-300 font-sans font-normal leading-relaxed space-y-3 whitespace-pre-line">
            {section.bodyMarkdown}
          </div>

          {/* Custom Alert Callout */}
          {section.callout && (
            <div className={`p-4 rounded-2xl border backdrop-blur-xl flex gap-3 text-xs leading-relaxed ${
              section.callout.type === "note" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300" :
              section.callout.type === "warning" ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300" :
              section.callout.type === "tip" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" :
              "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            }`}>
              <div className="mt-0.5 shrink-0">
                {section.callout.type === "note" && <Info className="w-4 h-4 text-indigo-500" />}
                {section.callout.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {section.callout.type === "tip" && <Lightbulb className="w-4 h-4 text-emerald-500" />}
                {section.callout.type === "important" && <AlertCircle className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="space-y-0.5">
                {section.callout.title && <h5 className="font-bold">{section.callout.title}</h5>}
                <p className="font-medium">{section.callout.message}</p>
              </div>
            </div>
          )}

          {/* Code Block Component */}
          {section.codeBlock && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl my-4">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{section.codeBlock.filename || section.codeBlock.language}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(section.codeBlock!.code, section.id)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
                >
                  {copiedCodeId === section.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodeId === section.id ? "Copied" : "Copy Code"}</span>
                </button>
              </div>

              <div className="p-4 overflow-x-auto custom-scrollbar font-mono text-xs text-indigo-200">
                <pre>{section.codeBlock.code}</pre>
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
