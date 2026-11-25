"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useSiteCMS } from "@/stores/site-cms-store";
import { GLBoundary } from "@/components/gl/gl-boundary";
import { LiquidGlass } from "@/components/gl/liquid-glass";
import { useGL } from "@/components/gl/use-gl";
import type { GlobeControl, GlobePlace } from "@/components/gl/earth-globe";
import { officeTimeZone, splitOffices, useLocalTime } from "@/lib/offices";
import { cn } from "@/lib/utils";

const EarthGlobe = dynamic(() => import("@/components/gl/earth-globe"), { ssr: false });

const EARTH_IMAGE =
  "https://cdn.prod.website-files.com/68513e75563291f5d48ada9b/696df7aeb646a7a2198327de_36fa0c4d18a844367e1911df246f6613_earth.webp";

/** Cities the globe knows where to find. */
const PLACES: GlobePlace[] = [
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Hyderabad", lat: 17.39, lon: 78.49 },
];

/** What working with Kiwik means, beside the Earth. Content is the CMS "Earth Section". */
export function EarthSection() {
  const { earthShowcase, footer } = useSiteCMS();
  const stats = earthShowcase?.stats || [];
  // Saved content may still point at the retired docs page.
  const primaryHref = earthShowcase?.cta1Href && earthShowcase.cta1Href !== "/docs" ? earthShowcase.cta1Href : "/contact";
  const primaryClass =
    "inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#10142e] font-bold text-sm hover:bg-neutral-200 transition-colors";
  // A picture chosen in the studio is shown as chosen, in place of the globe.
  const ownImage = earthShowcase?.earthImageUrl && earthShowcase.earthImageUrl !== EARTH_IMAGE ? earthShowcase.earthImageUrl : "";
  const offices = splitOffices(footer?.address);

  return (
    <section className="relative w-full overflow-hidden bg-[#050608] text-white py-20 sm:py-28 px-6 md:px-12 border-y border-white/[0.06]">
      {ownImage ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-[1.05]"
            style={{
              backgroundImage: `url('${ownImage}')`,
              opacity: earthShowcase?.overlayOpacity ?? 0.8,
              filter: earthShowcase?.blurPx ? `blur(${earthShowcase.blurPx}px)` : undefined,
            }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#050608] via-[#050608]/40 to-[#050608] pointer-events-none" />
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_70%_at_74%_42%,rgba(0,128,128,0.20),transparent_70%),radial-gradient(ellipse_50%_60%_at_10%_10%,rgba(35,43,98,0.45),transparent_70%)]" />
      )}

      <div className="max-w-[1320px] mx-auto relative z-10">
        <div className={cn("grid items-center gap-10 lg:gap-6", !ownImage && "lg:grid-cols-[1fr_1.05fr]")}>
          <div className={cn("text-center", ownImage ? "max-w-3xl mx-auto" : "lg:text-left")}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-[1.1] text-balance">{earthShowcase?.headline}</h2>
            <p className={cn("mt-6 text-base sm:text-lg text-neutral-200 max-w-xl mx-auto leading-relaxed text-pretty", !ownImage && "lg:mx-0")}>{earthShowcase?.description}</p>
            <div className={cn("mt-9 flex flex-wrap items-center justify-center gap-3", !ownImage && "lg:justify-start")}>
              {earthShowcase?.cta1Text &&
                (primaryHref.startsWith("/") ? (
                  <Link href={primaryHref} className={primaryClass}>{earthShowcase.cta1Text} <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
                ) : (
                  <a href={primaryHref} className={primaryClass} {...(/^https?:/i.test(primaryHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {earthShowcase.cta1Text} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              {earthShowcase?.cta2Text && (
                <Link href={earthShowcase.cta2Href || "/projects"} className="px-7 py-3.5 rounded-full bg-black/40 border border-white/25 font-semibold text-sm hover:bg-white/15 transition-colors">
                  {earthShowcase.cta2Text}
                </Link>
              )}
            </div>
          </div>
          {!ownImage && <Globe offices={offices} />}
        </div>

        {stats.length > 0 && (
          <dl className="mt-14 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {stats.map((stat, i) => (
              <div key={stat.id || i} className="flex flex-col border-t border-white/20 pt-5">
                <dt className="order-2 mt-1 text-base font-semibold">{stat.label}</dt>
                <dd className="order-1 text-4xl sm:text-5xl font-serif font-bold tracking-tight lining-nums">{stat.value}</dd>
                {stat.description && <dd className="order-3 mt-1.5 text-sm text-neutral-300 leading-relaxed text-balance">{stat.description}</dd>}
              </div>
            ))}
          </dl>
        )}

        {!ownImage && (
          <p className="mt-10 text-xs text-neutral-400">
            Earth imagery:{" "}
            <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">Solar System Scope</a>, CC BY 4.0
          </p>
        )}
      </div>
    </section>
  );
}

const cityOf = (office: string) => office.split(",")[0].trim();

function Globe({ offices }: { offices: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const gl = useGL(ref, "300px");
  const [ready, setReady] = useState(false);
  const [focus, setFocus] = useState("");
  const [grabbing, setGrabbing] = useState(false);
  const labels = useRef(new Map<string, HTMLElement>());
  const control = useRef<GlobeControl>({ focus: null, dragLon: 0, dragLat: 0, touchedAt: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  const key = offices.map(cityOf).join("|").toLowerCase();
  const places = React.useMemo(() => PLACES.filter((p) => key.split("|").includes(p.name.toLowerCase())), [key]);

  useEffect(() => {
    if (gl !== "on") setReady(false);
  }, [gl]);

  const look = (place: GlobePlace) => {
    const next = focus === place.name ? "" : place.name;
    setFocus(next);
    Object.assign(control.current, { focus: next ? place : null, dragLon: 0, dragLat: 0 });
  };

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div
        ref={ref}
        role="img"
        aria-label={places.length ? `The Earth, with Kiwik's locations: ${places.map((p) => p.name).join(" and ")}` : "The Earth"}
        className={cn("relative aspect-square touch-pan-y select-none", gl === "on" && (grabbing ? "cursor-grabbing" : "cursor-grab"))}
        onPointerDown={(e) => {
          if (gl !== "on") return;
          drag.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
          setGrabbing(true);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const c = control.current;
          c.dragLon -= (e.clientX - drag.current.x) * 0.28;
          c.dragLat += (e.clientY - drag.current.y) * 0.2;
          c.touchedAt = performance.now();
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          drag.current = null;
          setGrabbing(false);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setGrabbing(false);
        }}
      >
        {/* Shown until the globe is drawn, and kept where it cannot be. */}
        <div
          aria-hidden="true"
          className={cn("absolute inset-[13.5%] rounded-full transition-opacity duration-700 shadow-[inset_-24px_-18px_70px_#020308,0_0_70px_rgba(22,140,150,0.35)]", ready ? "opacity-0" : "opacity-100")}
          style={{ backgroundImage: "url('/textures/earth-night.webp')", backgroundSize: "400% 200%", backgroundPosition: "69% 38%" }}
        />
        <div ref={stage} className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          {gl === "on" && (
            <GLBoundary>
              <EarthGlobe places={places} control={control} labels={labels} onReady={() => setReady(true)} />
            </GLBoundary>
          )}
        </div>
        {ready &&
          places.map((p) => (
            <span
              key={p.name}
              ref={(el) => {
                if (el) labels.current.set(p.name, el);
                else labels.current.delete(p.name);
              }}
              aria-hidden="true"
              className="absolute left-0 top-0 pointer-events-none opacity-0"
            >
              <span className={cn("absolute -translate-y-1/2 whitespace-nowrap text-sm font-semibold [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]", p.name === "Dubai" ? "right-4" : "left-4")}>{p.name}</span>
            </span>
          ))}
      </div>

      {offices.length > 0 && (
        <ul className="relative -mt-[34%] sm:-mt-[23%] flex flex-wrap justify-center gap-3">
          {offices.map((office) => {
            const place = places.find((p) => p.name.toLowerCase() === cityOf(office).toLowerCase());
            return (
              <li key={office}>
                <LiquidGlass behind={stage} base="#071016" className="rounded-[22px]">
                  <OfficeChip office={office} active={Boolean(place) && focus === place?.name} onClick={place && gl !== "off" ? () => look(place) : undefined} />
                </LiquidGlass>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function OfficeChip({ office, active, onClick }: { office: string; active: boolean; onClick?: () => void }) {
  const time = useLocalTime(officeTimeZone(office));
  const body = (
    <>
      <MapPin className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-[#4fe0d6]" : "text-white/80")} aria-hidden="true" />
      <span className="font-semibold">{office}</span>
      {time && <time className="tabular-nums text-white/85">{time}</time>}
    </>
  );
  const className = "flex items-center gap-2.5 px-5 py-3 text-sm sm:text-base text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]";
  return onClick ? (
    <button type="button" aria-pressed={active} aria-label={`Show ${office} on the globe`} onClick={onClick} className={cn(className, "cursor-pointer rounded-[22px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white")}>
      {body}
    </button>
  ) : (
    <span className={className}>{body}</span>
  );
}
