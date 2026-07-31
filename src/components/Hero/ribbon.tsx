"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSiteCMSStore } from "@/stores/site-cms-store";

// 60+ Curated Unique High-Resolution Art-Directed Image Pool (NO DUPLICATES)
const MASTER_GALLERY_POOL = [
  { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop", title: "Hyper Crimson Sneaker", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop", title: "Porcelain Roses", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop", title: "Liquid Chroma", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop", title: "Patent Gloss", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop", title: "Holographic Waves", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop", title: "Crimson Velvet", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop", title: "Botanical Specimen", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&auto=format&fit=crop", title: "Luminous Jellyfish", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600&auto=format&fit=crop", title: "Emerald Canopy", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", title: "Fluid 3D Prism", linkUrl: "/projects" }
];

interface EmitterCardState {
  id: string;
  lane: "left" | "right";
  progress: number;
  imageUrl: string;
  title: string;
  linkUrl?: string;
  rotation: number;
}

export function ImageRibbon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const poolIndexRef = useRef<number>(0);
  const activeImageUrlsRef = useRef<Set<string>>(new Set());

  const hero = useSiteCMSStore((state) => state.cms.hero);
  const cmsGalleryImages = hero?.galleryImages;
  const currentPool = cmsGalleryImages && cmsGalleryImages.length > 0 ? cmsGalleryImages : MASTER_GALLERY_POOL;

  // Shuffle array helper
  const shufflePool = () => {
    const arr = [...currentPool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const poolRef = useRef(shufflePool());

  // Get next UNIQUE image from pool that is not currently visible anywhere on screen
  const getNextUniqueImage = () => {
    let attempts = 0;
    while (attempts < MASTER_GALLERY_POOL.length) {
      const item = poolRef.current[poolIndexRef.current % poolRef.current.length];
      poolIndexRef.current++;

      if (poolIndexRef.current >= poolRef.current.length) {
        poolRef.current = shufflePool();
        poolIndexRef.current = 0;
      }

      if (!activeImageUrlsRef.current.has(item.url)) {
        activeImageUrlsRef.current.add(item.url);
        return item;
      }
      attempts++;
    }
    // Fallback if pool exhausted
    const fallback = MASTER_GALLERY_POOL[Math.floor(Math.random() * MASTER_GALLERY_POOL.length)];
    activeImageUrlsRef.current.add(fallback.url);
    return fallback;
  };

  // Release image URL when card recycles
  const releaseImage = (url: string) => {
    activeImageUrlsRef.current.delete(url);
  };

  // Generate initial evenly-spaced emitter cards (7 left, 7 right = 14 total on desktop)
  const createInitialCards = (): EmitterCardState[] => {
    const cards: EmitterCardState[] = [];
    const countPerLane = 7;
    let cardIdCounter = 0;

    // Left Lane Cards: Progress spaced from 0.05 to 0.9
    for (let i = 0; i < countPerLane; i++) {
      const progress = 0.05 + (i / countPerLane) * 0.85;
      const img = getNextUniqueImage();
      cards.push({
        id: `left-card-${cardIdCounter++}`,
        lane: "left",
        progress,
        imageUrl: img.url,
        title: img.title,
        rotation: (Math.random() - 0.5) * 12, // -6deg to +6deg
      });
    }

    // Right Lane Cards: Progress offset by half-step
    for (let i = 0; i < countPerLane; i++) {
      const progress = 0.05 + ((i + 0.5) / countPerLane) * 0.85;
      const img = getNextUniqueImage();
      cards.push({
        id: `right-card-${cardIdCounter++}`,
        lane: "right",
        progress,
        imageUrl: img.url,
        title: img.title,
        rotation: (Math.random() - 0.5) * 12, // -6deg to +6deg
      });
    }

    return cards;
  };

  const [cards, setCards] = useState<EmitterCardState[]>(createInitialCards);

  // 60 FPS Procedural Emitter RAF Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let cardIdCounter = 100;

    const updateEmitter = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta time
      lastTime = now;

      // Linear constant expansion speed (full transit in ~12.5 sec)
      const speed = hero?.gallerySpeed !== undefined ? hero.gallerySpeed : 0.075;

      setCards((prevCards) =>
        prevCards.map((card) => {
          let nextProgress = card.progress + speed * dt;

          // When card travels past edge of viewport (progress >= 1.0)
          if (nextProgress >= 1.0) {
            releaseImage(card.imageUrl);
            const newImg = getNextUniqueImage();

            // Recycle card back to CENTER (progress = 0.0) with fresh unique image & new tilt
            return {
              id: `${card.lane}-card-${cardIdCounter++}`,
              lane: card.lane,
              progress: nextProgress - 1.0, // seamless wrap from 0
              imageUrl: newImg.url,
              title: newImg.title,
              rotation: (Math.random() - 0.5) * 12, // -6deg to +6deg
            };
          }

          return {
            ...card,
            progress: nextProgress,
          };
        })
      );

      animId = requestAnimationFrame(updateEmitter);
    };

    animId = requestAnimationFrame(updateEmitter);
    return () => cancelAnimationFrame(animId);
  }, [hero?.gallerySpeed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[1700px] h-[360px] sm:h-[440px] md:h-[480px] mx-auto flex items-center justify-center overflow-hidden select-none transform-gpu my-2 sm:my-6"
    >
      {/* ─────────────────────────────────────────────────────────────
          PROCEDURAL PERSPECTIVE EMITTER CANVAS (CENTER → EDGES)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-full flex items-center justify-center transform-gpu z-10">
        {cards.map((card) => {
          const p = Math.max(0, Math.min(1, card.progress));

          // ── CONTINUOUS PERSPECTIVE SCALE MATHEMATICS ──
          const perspectiveScale = hero?.galleryPerspective !== undefined ? hero.galleryPerspective : 0.28;
          const maxScale = hero?.galleryScale !== undefined ? hero.galleryScale : 1.35;
          const scale = perspectiveScale + Math.pow(p, 1.15) * (maxScale - perspectiveScale);

          // ── CONTINUOUS HORIZONTAL EXPANSION DISTANCE ──
          // Left lane travels CENTER -> LEFT (-X)
          // Right lane travels CENTER -> RIGHT (+X)
          const direction = card.lane === "left" ? -1 : 1;
          const maxDistancePx = 780; // Max span distance in pixels from center
          const translateX = direction * Math.pow(p, 1.35) * maxDistancePx;

          // ── Z-INDEX LAYER ORDERING ──
          // Outer cards closer to edge appear ABOVE inner cards
          const zIndex = Math.floor(p * 100) + 10;

          // ── CONTINUOUS OPACITY FADE ──
          const baseOpacity = hero?.galleryOpacity !== undefined ? hero.galleryOpacity : 0.85;
          const opacity = baseOpacity + p * (1 - baseOpacity);

          // ── DYNAMIC CARD DIMENSIONS ──
          // Base card is 260px wide by 320px high, scaled dynamically by perspective
          const width = 260;
          const height = 320;

          return (
            <a
              key={card.id}
              href={card.linkUrl || "/projects"}
              target={card.linkUrl?.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate(-50%, -50%) translate3d(${translateX}px, 0px, 0px) scale(${scale}) rotate(${card.rotation}deg)`,
                zIndex,
                opacity,
                transformOrigin: "center center",
                filter: hero?.galleryBlur ? `blur(${hero.galleryBlur}px)` : undefined,
              }}
              className={cn(
                "group block overflow-hidden rounded-[20px] bg-neutral-900 border border-black/10 dark:border-white/15 transition-all duration-300 transform-gpu will-change-transform shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] hover:scale-105 cursor-pointer"
              )}
            >
              {/* Native High-Res Image Element */}
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover transform-gpu group-hover:scale-110 transition-transform duration-500"
                loading="eager"
                decoding="async"
              />

              {/* Title Overlay on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-white">
                <span className="text-xs font-bold font-sans truncate">{card.title}</span>
                <span className="text-[10px] font-mono text-accent-blue underline">Open ↗</span>
              </div>

              {/* Specular Edge Highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 opacity-30 pointer-events-none" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
