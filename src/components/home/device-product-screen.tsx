import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import type { DeviceShowcaseCard } from "@/types/site-cms-types";

/** "Live" needs an address to visit; finishing a project does not make it live. */
function statusLabel({ status, liveUrl }: Project): string | undefined {
  if (status === "in-progress") return "In progress";
  if (status === "completed") return liveUrl ? "Live" : "Completed";
  return undefined;
}

/** Phone screen for a Kiwik product, or for Kiwik itself when no project is linked. */
export function DeviceProductScreen({ card, project, isDark }: { card: DeviceShowcaseCard; project?: Project; isDark: boolean }) {
  const accent = card.accentColor || (isDark ? "#ffffff" : "#222C62");
  const points = (card.blocks || [])
    .filter((b) => b.visible !== false)
    .flatMap((b) => b.items || [])
    .map((i) => i.title)
    .filter(Boolean);
  // Kiwik's own mark; a project shows its logo, or its initial if it has none.
  const logoUrl = project ? card.avatarUrl || project.logo : card.avatarUrl || "/logo.png";
  // Some projects link a logo on another site, which can disappear.
  const [failedLogo, setFailedLogo] = useState<string | null>(null);
  const logo = logoUrl && logoUrl !== failedLogo ? logoUrl : undefined;
  const status = project ? statusLabel(project) : undefined;

  return (
    <div className="relative z-10 flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn("w-8 h-8 shrink-0 rounded-[10px] overflow-hidden flex items-center justify-center text-xs font-bold", project ? "" : "bg-white")}
          style={project ? { backgroundColor: logo ? "#ffffff" : accent, color: isDark ? "#0b0f19" : "#ffffff" } : undefined}
        >
          {logo ? <img src={logo} alt="" loading="lazy" onError={() => setFailedLogo(logo)} className="w-full h-full object-contain p-0.5" /> : card.name.charAt(0)}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-xs font-bold truncate">{card.name}</span>
          <span className="block text-[10px] font-semibold truncate" style={{ color: accent }}>{card.role}</span>
        </span>
        {status && (
          <span className={cn("ml-auto shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold", isDark ? "bg-white/15 text-white" : "bg-black/[0.07] text-neutral-800")}>
            {status}
          </span>
        )}
      </div>

      <h3 className="mt-3.5 text-lg sm:text-xl font-serif font-bold tracking-tight leading-tight">{card.quote}</h3>
      <p className={cn("mt-1.5 text-[11px] leading-relaxed", isDark ? "text-neutral-300" : "text-neutral-600")}>{card.description}</p>

      {project ? (
        <>
          <div className={cn("mt-3.5 flex-1 min-h-[90px] rounded-2xl overflow-hidden border", isDark ? "border-white/15 bg-white/5" : "border-black/10 bg-white")}>
            <img src={project.coverImage} alt={`${card.name} screenshot`} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {points.map((p) => (
              <li key={p} className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", isDark ? "bg-white/10 text-white" : "bg-black/[0.06] text-neutral-800")}>
                {p}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className="mt-4 flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          {points.map((p) => (
            <li key={p} className={cn("flex-1 max-h-16 flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold", isDark ? "bg-white/[0.06] border-white/10" : "bg-white border-black/10")}>
              <Check className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      )}

      <Link
        href={card.buttonLink || "/contact"}
        className={cn("mt-3.5 shrink-0 w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-85", isDark ? "text-neutral-950" : "text-white")}
        style={{ backgroundColor: accent }}
      >
        {card.ctaText || `View ${card.name}`} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
