"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App runtime error caught by error boundary:", error);
  }, [error]);

  const handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
    reset();
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-bg-secondary/60 border border-white/10 backdrop-blur-2xl space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-text-primary tracking-tight">
            System Diagnostics Notice
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            A temporary client rendering variance occurred. The system telemetry engine is fully operational.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="w-full py-3 px-5 rounded-2xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-accent-blue/20"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>Reload & Refresh State</span>
          </button>
          
          <Link
            href="/"
            className="w-full py-3 px-5 rounded-2xl bg-bg-tertiary hover:bg-white/10 text-text-primary font-bold text-xs border border-white/10 flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
