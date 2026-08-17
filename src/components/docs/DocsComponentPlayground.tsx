"use client";

import React, { useState } from "react";
import { Copy, Check, MousePointerClick, Tag, Square, SwitchCamera } from "lucide-react";

interface ComponentPropSpec {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface ComponentVariantSpec {
  name: string;
  code: string;
  previewType: "button" | "badge" | "card" | "switch" | "slider" | "input" | "avatar" | "progress";
}

interface DocsComponentPlaygroundProps {
  componentName: string;
  description: string;
  props: ComponentPropSpec[];
  variants: ComponentVariantSpec[];
}

export function DocsComponentPlayground({ componentName, description, props, variants }: DocsComponentPlaygroundProps) {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);

  const currentVariant = variants[activeVariantIndex] || variants[0];

  const handleCopyCode = () => {
    if (typeof window !== "undefined" && currentVariant) {
      navigator.clipboard.writeText(currentVariant.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6 my-8">
      {/* Live Interactive Preview Box */}
      <div className="rounded-3xl border border-slate-300/60 dark:border-white/10 overflow-hidden bg-neutral-200/40 dark:bg-white/5 backdrop-blur-xl shadow-lg">
        {/* Header Tabs */}
        <div className="px-6 py-4 border-b border-slate-300/40 dark:border-white/10 flex items-center justify-between flex-wrap gap-3 bg-white/40 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Component Preview: {componentName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {variants.map((v, idx) => (
              <button
                key={idx}
                onClick={() => setActiveVariantIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeVariantIndex === idx
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-neutral-200 dark:hover:bg-white/10"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Canvas Area */}
        <div className="p-10 flex items-center justify-center min-h-[180px] bg-slate-100/80 dark:bg-[#060607]/90 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          
          <div className="relative z-10 flex items-center gap-4 flex-wrap justify-center">
            {currentVariant.previewType === "button" && (
              <button className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 active:scale-95 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer">
                {currentVariant.name}
              </button>
            )}

            {currentVariant.previewType === "badge" && (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational</span>
              </span>
            )}

            {currentVariant.previewType === "switch" && (
              <button
                onClick={() => setSwitchChecked(!switchChecked)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                  switchChecked ? "bg-indigo-600" : "bg-slate-300 dark:bg-white/20"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-300 shadow-md ${
                    switchChecked ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            )}

            {currentVariant.previewType === "card" && (
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-white/10 border border-slate-300/50 dark:border-white/20 shadow-xl max-w-sm text-left backdrop-blur-xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Frosted Glass Surface</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                  Multi-layered specular backdrop blur with mouse lighting.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="p-4 bg-slate-900 text-slate-100 text-xs font-mono flex items-center justify-between border-t border-slate-800">
          <code className="text-indigo-300 overflow-x-auto custom-scrollbar pr-4">
            {currentVariant.code}
          </code>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors shrink-0 cursor-pointer"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Component Props Table */}
      {props.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Props Specification</h4>
          <div className="overflow-x-auto rounded-2xl border border-slate-300/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Prop Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/40 dark:divide-white/10 text-slate-700 dark:text-slate-300">
                {props.map((p, idx) => (
                  <tr key={idx} className="hover:bg-neutral-200/40 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-cyan-600 dark:text-cyan-400">{p.type}</td>
                    <td className="px-4 py-3 font-mono opacity-70">{p.default || "-"}</td>
                    <td className="px-4 py-3">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
