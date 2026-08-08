"use client";

import React, { useEffect, useRef } from "react";
import { useSiteCMS } from "@/stores/site-cms-store";

// 12 Curated Unique High-Resolution Art-Directed Tech Gallery Pool (AI, Blockchain, Cyber Security)
const MASTER_GALLERY_POOL = [
  { url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop", title: "AI Neural Core", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop", title: "Blockchain Ledger", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop", title: "Cyber Security Grid", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", title: "Quantum Photonic Chip", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop", title: "Autonomous Agent Core", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop", title: "Holographic Data Stream", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop", title: "High-Speed Fiber Telemetry", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=600&auto=format&fit=crop", title: "Cybernetic Microchip", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=600&auto=format&fit=crop", title: "Decentralized Web3 Node", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop", title: "Global Edge Telemetry", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop", title: "Cryptographic Security Vault", linkUrl: "/projects" },
  { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop", title: "Autonomous Robotics Engine", linkUrl: "/projects" }
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
  const cardElementRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const imageElementRefs = useRef<(HTMLImageElement | null)[]>([]);
  const titleElementRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const poolIndexRef = useRef<number>(0);
  const activeImageUrlsRef = useRef<Set<string>>(new Set());

  const cms = useSiteCMS();
  const hero = cms.hero;
  const cmsGalleryImages = hero?.galleryImages;
  const currentPool = cmsGalleryImages && cmsGalleryImages.length > 0 ? cmsGalleryImages : MASTER_GALLERY_POOL;

  const poolRef = useRef([...currentPool]);

  const shufflePool = () => {
    const arr = [...currentPool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

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
    const fallback = MASTER_GALLERY_POOL[Math.floor(Math.random() * MASTER_GALLERY_POOL.length)];
    activeImageUrlsRef.current.add(fallback.url);
    return fallback;
  };

  const releaseImage = (url: string) => {
    activeImageUrlsRef.current.delete(url);
  };

  // Generate initial cards data in ref
  const cardsDataRef = useRef<EmitterCardState[]>([]);

  useEffect(() => {
    poolRef.current = shufflePool();
    poolIndexRef.current = 0;
    activeImageUrlsRef.current = new Set();

    const countPerLane = 12;
    let cardIdCounter = 0;
    const initialCards: EmitterCardState[] = [];

    for (let i = 0; i < countPerLane; i++) {
      const progress = i / countPerLane;
      const img = getNextUniqueImage();
      initialCards.push({
        id: `left-card-${cardIdCounter++}`,
        lane: "left",
        progress,
        imageUrl: img.url,
        title: img.title,
        linkUrl: img.linkUrl || "/projects",
        rotation: (Math.random() - 0.5) * 8,
      });
    }

    for (let i = 0; i < countPerLane; i++) {
      const progress = (i + 0.5) / countPerLane;
      const img = getNextUniqueImage();
      initialCards.push({
        id: `right-card-${cardIdCounter++}`,
        lane: "right",
        progress,
        imageUrl: img.url,
        title: img.title,
        linkUrl: img.linkUrl || "/projects",
        rotation: (Math.random() - 0.5) * 8,
      });
    }

    cardsDataRef.current = initialCards;
  }, []);

  // 60 FPS Procedural Emitter RAF Loop mutating DOM elements directly (ZERO REACT RE-RENDERS)
  useEffect(() => {
    let animId: number | null = null;
    let isVisible = true;
    let lastTime = performance.now();

    // Card width/height used to be written on every card on every frame. Those
    // properties dirty layout, which turned an otherwise composited animation
    // into a layout pass per frame. The size is now a plain responsive class on
    // the element (see the `sm:` sizes below) and the frame loop touches nothing
    // but `transform`, `opacity` and `z-index` — all composited.
    const mobileQuery = window.matchMedia("(max-width: 639px)");
    let isMobile = mobileQuery.matches;
    const onBreakpoint = (e: MediaQueryListEvent) => { isMobile = e.matches; };
    mobileQuery.addEventListener("change", onBreakpoint);

    const updateEmitter = (now: number) => {
      // Pause all work when the hero is scrolled out of view so scrolling the
      // rest of the page stays smooth (the loop restarts when it re-enters view).
      if (!isVisible) { animId = null; return; }
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const speed = hero?.gallerySpeed !== undefined ? hero.gallerySpeed : 0.065;
      const perspectiveScale = hero?.galleryPerspective !== undefined ? hero.galleryPerspective : 0.18;
      const maxScale = hero?.galleryScale !== undefined ? hero.galleryScale : 1.35;
      const baseOpacity = hero?.galleryOpacity !== undefined ? hero.galleryOpacity : 0.95;

      const maxDistancePx = isMobile ? 220 : 820;

      const cards = cardsDataRef.current;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card) continue;

        let p = card.progress + speed * dt;

        if (p >= 1.0) {
          releaseImage(card.imageUrl);
          const newImg = getNextUniqueImage();
          card.progress = p - 1.0;
          card.imageUrl = newImg.url;
          card.title = newImg.title;
          card.linkUrl = newImg.linkUrl || "/projects";
          card.rotation = (Math.random() - 0.5) * 8;

          // Update image src and title text directly on DOM node
          const imgEl = imageElementRefs.current[i];
          if (imgEl) imgEl.src = card.imageUrl;
          const titleEl = titleElementRefs.current[i];
          if (titleEl) titleEl.textContent = card.title;
        } else {
          card.progress = p;
        }

        const clampedP = Math.max(0, Math.min(1, card.progress));
        const scale = perspectiveScale + Math.pow(clampedP, 1.15) * (maxScale - perspectiveScale);
        const direction = card.lane === "left" ? -1 : 1;
        const translateX = direction * Math.pow(clampedP, 1.25) * maxDistancePx;
        const zIndex = Math.floor(clampedP * 100) + 10;
        
        // Continuous smooth fade in at center (0-0.12) & smooth fade out at edge (0.88-1.0)
        let fadeIn = Math.min(clampedP / 0.12, 1.0);
        let fadeOut = Math.min((1.0 - clampedP) / 0.12, 1.0);
        const opacity = Math.max(0, fadeIn * fadeOut * baseOpacity);

        const el = cardElementRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(calc(-50% + ${translateX.toFixed(1)}px), -50%, 0px) scale(${scale.toFixed(3)}) rotate(${card.rotation.toFixed(1)}deg)`;
          el.style.zIndex = `${zIndex}`;
          el.style.opacity = `${opacity.toFixed(2)}`;
        }
      }

      animId = requestAnimationFrame(updateEmitter);
    };

    // `will-change` permanently promotes each card to its own compositor layer.
    // 24 of them is a lot of GPU memory to hold while the hero is off-screen, so
    // the hint is only set while the loop is actually running.
    const setWillChange = (value: string) => {
      for (const el of cardElementRefs.current) {
        if (el) el.style.willChange = value;
      }
    };

    const start = () => {
      if (animId == null) {
        setWillChange("transform, opacity");
        lastTime = performance.now();
        animId = requestAnimationFrame(updateEmitter);
      }
    };
    const stop = () => {
      if (animId != null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
      setWillChange("auto");
    };

    // Only animate while on-screen and the tab is visible.
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && document.visibilityState === "visible") start();
        else stop();
      },
      { threshold: 0 }
    );
    if (containerRef.current) io.observe(containerRef.current);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && isVisible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      io.disconnect();
      mobileQuery.removeEventListener("change", onBreakpoint);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hero?.gallerySpeed, hero?.galleryPerspective, hero?.galleryScale, hero?.galleryOpacity]);

  const initialCardsCount = 24;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[1700px] h-[260px] sm:h-[440px] md:h-[480px] mx-auto flex items-center justify-center overflow-hidden select-none transform-gpu my-2 sm:my-6"
    >
      <div className="relative w-full h-full flex items-center justify-center transform-gpu z-10">
        {Array.from({ length: initialCardsCount }).map((_, idx) => (
          <a
            key={idx}
            ref={(el) => { cardElementRefs.current[idx] = el; }}
            href="/projects"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate3d(-50%, -50%, 0px) scale(0.3)",
              transformOrigin: "center center",
            }}
            className="group block w-[150px] h-[185px] sm:w-[260px] sm:h-[320px] overflow-hidden rounded-[16px] sm:rounded-[20px] bg-bg-secondary border border-glass-border transition-colors duration-300 transform-gpu shadow-xl cursor-pointer"
          >
            <img
              ref={(el) => { imageElementRefs.current[idx] = el; }}
              src={MASTER_GALLERY_POOL[idx % MASTER_GALLERY_POOL.length].url}
              alt="Showcase Product"
              onError={(e) => { e.currentTarget.src = "/images/kiwik-hero.jpg"; }}
              className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-500"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-white">
              <span ref={(el) => { titleElementRefs.current[idx] = el; }} className="text-[10px] sm:text-xs font-bold font-sans truncate">
                {MASTER_GALLERY_POOL[idx % MASTER_GALLERY_POOL.length].title}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-accent-blue underline">Open ↗</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 opacity-30 pointer-events-none" />
          </a>
        ))}
      </div>
    </div>
  );
}
