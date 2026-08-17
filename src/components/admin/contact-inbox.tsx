"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Mail, Trash2, RefreshCw, Building2, Phone } from "lucide-react";

type Submission = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
};

const STATUSES: Submission["status"][] = ["new", "read", "replied", "archived"];

const STATUS_STYLE: Record<Submission["status"], string> = {
  new: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  read: "bg-white/5 text-text-secondary border-glass-border",
  replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  archived: "bg-white/5 text-text-muted border-glass-border",
};

/**
 * Contact inbox.
 *
 * Reads straight from /api/contact, which is session-gated, so submissions are
 * never held in localStorage or any client-side store — reopening the studio in
 * a different browser shows exactly the same list, because the database is the
 * only copy.
 *
 * Message bodies are rendered as text nodes. Nothing here uses
 * dangerouslySetInnerHTML: this is untrusted input from anonymous visitors, and
 * React escapes it on the way in.
 */
export function ContactInbox() {
  const [items, setItems] = useState<Submission[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | Submission["status"]>("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/contact", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status === 401 ? "Session expired — sign in again." : "Couldn't load submissions.");
      const data = await res.json();
      setItems(data.submissions || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load submissions.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mutate = async (id: number, payload: Record<string, unknown>) => {
    setBusyId(id);
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "That didn't save.");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const shown = (items || []).filter((s) => filter === "all" || s.status === filter);
  const newCount = (items || []).filter((s) => s.status === "new").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Mail className="h-4 w-4 text-accent-blue" />
          <h3 className="text-sm font-bold text-text-primary">
            Contact submissions
            {newCount > 0 && (
              <span className="ml-2 rounded-full bg-accent-blue px-2 py-0.5 text-[10px] font-bold text-white">
                {newCount} new
              </span>
            )}
          </h3>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-xl border border-glass-border px-3 py-1.5 text-[11px] font-bold text-text-secondary hover:border-accent-blue/40"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${
              filter === f ? "border-accent-blue bg-accent-blue/10 text-accent-blue" : "border-glass-border text-text-muted hover:text-text-secondary"
            }`}
          >
            {f}
            {f !== "all" && ` (${(items || []).filter((s) => s.status === f).length})`}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3 text-xs font-bold text-rose-300">
          {error}
        </p>
      )}

      {items === null && !error && <p className="text-xs text-text-muted">Loading…</p>}

      {items !== null && shown.length === 0 && (
        <p className="rounded-2xl border border-glass-border bg-bg-secondary/40 p-8 text-center text-xs text-text-muted">
          {items.length === 0 ? "No messages yet." : `No ${filter} messages.`}
        </p>
      )}

      <ul className="space-y-3">
        {shown.map((s) => (
          <li key={s.id} className="rounded-2xl border border-glass-border bg-bg-secondary/40 p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary">{s.subject}</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {s.name} ·{" "}
                  <a href={`mailto:${s.email}`} className="text-accent-blue hover:underline">
                    {s.email}
                  </a>
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-muted">
                  {s.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {s.company}
                    </span>
                  )}
                  {s.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {s.phone}
                    </span>
                  )}
                  <span>{new Date(s.created_at).toLocaleString()}</span>
                </div>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${STATUS_STYLE[s.status]}`}>
                {s.status}
              </span>
            </div>

            {/* Rendered as a text node — never as HTML. */}
            <p className="whitespace-pre-wrap break-words rounded-xl bg-bg-primary/60 p-3 text-xs leading-relaxed text-text-secondary">
              {s.message}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {STATUSES.filter((st) => st !== s.status).map((st) => (
                <button
                  key={st}
                  disabled={busyId === s.id}
                  onClick={() => mutate(s.id, { status: st })}
                  className="rounded-lg border border-glass-border px-2.5 py-1 text-[10px] font-bold uppercase text-text-secondary hover:border-accent-blue/40 disabled:opacity-50"
                >
                  Mark {st}
                </button>
              ))}
              <button
                disabled={busyId === s.id}
                onClick={() => {
                  if (confirm(`Delete the message from ${s.name}? This cannot be undone.`)) {
                    mutate(s.id, { delete: true });
                  }
                }}
                className="ml-auto flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
