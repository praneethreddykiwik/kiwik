"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Key } from "lucide-react";

/**
 * The only thing an unauthenticated visitor to /admin is allowed to see.
 *
 * It is rendered by the server-side gate in admin/layout.tsx, so the studio
 * itself — and every byte of CMS content it holds — is never sent to the
 * browser without a valid session.
 */
export function AdminLogin({ passwordLoginEnabled }: { passwordLoginEnabled: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // The Google callback can only report failure by redirecting back with a
  // reason; surface it here and strip it so a refresh doesn't repeat it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      setError(err);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invalid password");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white flex items-center justify-center p-4 select-none relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-blue/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative z-10 bg-neutral-900/80 backdrop-blur-2xl"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-blue via-indigo-500 to-purple-600 p-[1px] mx-auto shadow-lg">
            <div className="w-full h-full bg-neutral-950 rounded-[15px] flex items-center justify-center font-bold text-lg text-white">
              K
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Kiwik OS Studio</h1>
          <p className="text-xs text-neutral-400 font-sans">
            Restricted to approved administrators.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <a
          href="/api/auth/google"
          className="w-full py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          <span>Continue with Google</span>
        </a>

        {passwordLoginEnabled && (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="admin-password"
                  className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400"
                >
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    id="admin-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950/60 border border-white/10 focus:border-accent-blue text-xs text-white placeholder-neutral-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Authenticate Session</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="pt-2 text-center border-t border-white/5">
          <span className="text-[10px] text-neutral-500 font-mono">
            Authorized access only · Kiwik OS Studio
          </span>
        </div>
      </motion.div>
    </div>
  );
}
