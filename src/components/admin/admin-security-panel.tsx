"use client";

import React, { useCallback, useEffect, useState } from "react";
import { X, ShieldCheck, Trash2, Plus, KeyRound } from "lucide-react";

type SecurityState = {
  allowedEmails: string[];
  passwordLoginEnabled: boolean;
  hasStoredPassword: boolean;
  envEmails: string[];
};

/**
 * Admin access control, editable in the studio.
 *
 * Who may sign in used to live only in ADMIN_ALLOWED_EMAILS, so granting or
 * revoking access meant editing an environment variable and redeploying. It is
 * now stored in the database and changes take effect on the next sign-in.
 * Addresses that come from the environment are shown but not removable here,
 * since they are the break-glass route back in.
 */
export function AdminSecurityPanel({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<SecurityState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/security", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load security settings.");
      setState(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load security settings.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const post = async (payload: Record<string, unknown>, successMessage: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`);
        return false;
      }
      setNotice(successMessage);
      await load();
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    if (await post({ action: "addEmail", email: newEmail }, `${newEmail.trim()} can now sign in.`)) {
      setNewEmail("");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }
    if (await post({ action: "changePassword", currentPassword, newPassword }, "Password updated.")) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const envSet = new Set(state?.envEmails || []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Admin security"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-bg-secondary border border-glass-border shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-divider sticky top-0 bg-bg-secondary z-10">
          <h2 className="text-xl font-serif font-bold text-text-primary flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-accent-blue" /> Admin security
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-white/10 text-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold">
              {error}
            </div>
          )}
          {notice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
              {notice}
            </div>
          )}

          {/* ── Who can access ── */}
          <section className="space-y-3">
            <div>
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Who can access admin
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Only these Google accounts can sign in. Signing in with Google is never enough on
                its own — the address must be listed here.
              </p>
            </div>

            <ul className="space-y-2">
              {(state?.allowedEmails || []).map((email) => (
                <li
                  key={email}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-bg-primary border border-glass-border"
                >
                  <span className="text-xs font-mono text-text-primary truncate">{email}</span>
                  {envSet.has(email) ? (
                    <span className="text-[10px] font-mono uppercase text-text-muted shrink-0">
                      from env
                    </span>
                  ) : (
                    <button
                      onClick={() => post({ action: "removeEmail", email }, `${email} removed.`)}
                      disabled={busy}
                      className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 shrink-0 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </li>
              ))}
              {state && state.allowedEmails.length === 0 && (
                <li className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  No administrators configured — nobody can sign in with Google.
                </li>
              )}
            </ul>

            <form onSubmit={addEmail} className="flex gap-2">
              <label htmlFor="new-admin-email" className="sr-only">
                Add administrator email
              </label>
              <input
                id="new-admin-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="add-admin@example.com"
                className="flex-1 px-4 py-2.5 rounded-xl bg-bg-primary border border-glass-border text-xs text-text-primary placeholder:text-text-muted focus:border-accent-blue outline-none"
              />
              <button
                type="submit"
                disabled={busy || !newEmail.trim()}
                className="px-4 py-2.5 rounded-xl bg-accent-blue text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </section>

          {/* ── Password ── */}
          <section className="space-y-3 pt-2 border-t border-divider">
            <div className="pt-4">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Password login
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {state?.passwordLoginEnabled
                  ? "Enabled — the studio accepts a password as well as Google."
                  : "Disabled — Google sign-in is the only way in. Recommended."}
              </p>
            </div>

            <button
              onClick={() =>
                post(
                  { action: "setPasswordLogin", enabled: !state?.passwordLoginEnabled },
                  state?.passwordLoginEnabled ? "Password login disabled." : "Password login enabled."
                )
              }
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs font-bold text-text-primary hover:border-accent-blue/40 disabled:opacity-50"
            >
              {state?.passwordLoginEnabled ? "Disable password login" : "Enable password login"}
            </button>

            <form onSubmit={changePassword} className="space-y-3 pt-2">
              {[
                { id: "cur", label: "Current password", value: currentPassword, set: setCurrentPassword },
                { id: "new", label: "New password (min 8)", value: newPassword, set: setNewPassword },
                { id: "cfm", label: "Confirm new password", value: confirmPassword, set: setConfirmPassword },
              ].map((f) => (
                <div key={f.id} className="space-y-1">
                  <label
                    htmlFor={`pw-${f.id}`}
                    className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted"
                  >
                    {f.label}
                  </label>
                  <input
                    id={`pw-${f.id}`}
                    type="password"
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-glass-border text-xs text-text-primary focus:border-accent-blue outline-none"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={busy || !newPassword || !confirmPassword}
                className="w-full py-2.5 rounded-xl bg-text-primary text-bg-primary text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <KeyRound className="w-3.5 h-3.5" /> Update password
              </button>
              <p className="text-[11px] text-text-muted">
                Stored as a PBKDF2 hash, so the password is never readable from the database.
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
