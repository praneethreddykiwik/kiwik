"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";

type Row = { key: string; count: number };
type Data = {
  totals: { sessions30d: number; pageviews30d: number; activeNow: number };
  searches: Row[];
  projects: Row[];
  countries: Row[];
};

function flagFor(code: string): string {
  if (!/^[A-Z]{2}$/i.test(code)) return "🌐";
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

let regionNames: Intl.DisplayNames | null = null;
function countryName(code: string): string {
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code.toUpperCase()) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

/**
 * Real analytics, read from the database (see lib/analytics.ts). Replaces a
 * panel that rendered seeded demo figures from the CMS defaults.
 */
export function AnalyticsPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `Could not load analytics (${res.status}).`);
      setData(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const list = (rows: Row[] | undefined, render: (r: Row) => React.ReactNode, unit: string, empty: string, tone: string) => (
    <div className="space-y-2">
      {!rows || rows.length === 0 ? (
        <p className="text-[11px] text-text-muted leading-relaxed py-2">{empty}</p>
      ) : (
        rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-bg-secondary text-xs">
            <span className="min-w-0 truncate font-bold text-text-primary">{render(r)}</span>
            <span className={`shrink-0 px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${tone}`}>
              {r.count.toLocaleString()} {unit}
            </span>
          </div>
        ))
      )}
    </div>
  );

  const stat = (label: string, value: number | undefined) => (
    <div className="p-4 rounded-xl bg-bg-secondary border border-glass-border">
      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">{label}</div>
      <div className="text-2xl font-mono font-bold text-text-primary mt-1">{value === undefined ? "—" : value.toLocaleString()}</div>
    </div>
  );

  return (
    <div className="space-y-6 text-left">
      <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Site Analytics
          </h3>
          <p className="text-xs text-text-secondary">
            Live from the database: visits and page views (last 30 days), command-palette searches, project page views and visitor countries.
            No IP addresses are stored.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="shrink-0 self-start sm:self-auto px-4 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Refresh
        </button>
      </div>

      {error && (
        <p className="text-xs font-semibold text-rose-500" role="alert">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stat("Online now", data?.totals.activeNow)}
        {stat("Visits · 30 days", data?.totals.sessions30d)}
        {stat("Page views · 30 days", data?.totals.pageviews30d)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard tilt={false} hover={false} className="p-5 space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Top Searches</h4>
          {list(data?.searches, (r) => <span className="font-mono">{r.key}</span>, "searches", "No searches yet. Searches from the site's ⌘K palette appear here.", "bg-accent-blue/10 text-accent-blue")}
        </GlassCard>

        <GlassCard tilt={false} hover={false} className="p-5 space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Project Page Views</h4>
          {list(data?.projects, (r) => <span className="font-mono">/projects/{r.key}</span>, "views", "No project views yet. Visits to /projects/… pages appear here.", "bg-emerald-500/10 text-emerald-500")}
        </GlassCard>

        <GlassCard tilt={false} hover={false} className="p-5 space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Visitors by Country</h4>
          {list(
            data?.countries,
            (r) => (
              <span className="flex items-center gap-2">
                <span>{flagFor(r.key)}</span>
                <span>{countryName(r.key)}</span>
              </span>
            ),
            "visits",
            "No country data yet. New visits on the live site are counted by country.",
            "bg-text-primary/5 text-text-secondary"
          )}
        </GlassCard>
      </div>
    </div>
  );
}
