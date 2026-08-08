"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { PartnerVideo } from "@/types/partner";

/**
 * Poster-first video embed.
 *
 * Nothing but the poster image is fetched until the visitor asks to play, so a
 * 30MB clip never competes with the rest of the page for bandwidth, and the
 * slot keeps a fixed 16:9 box so the page never reflows when the media lands.
 * `<source>` is attached only on first play — a bare `preload="none"` still
 * costs a connection on some browsers.
 */
export function PartnerVideoPlayer({ video }: { video: PartnerVideo }) {
  const [activated, setActivated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!activated) return;
    const el = videoRef.current;
    if (!el) return;
    // load() is required after injecting <source> into a mounted <video>.
    el.load();
    el.play().catch(() => {
      /* autoplay refused — the visitor still has native controls */
    });
  }, [activated]);

  // Pause when scrolled out of view so audio never trails the visitor and the
  // decoder stops doing work off-screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !activated) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !el.paused) el.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [activated]);

  return (
    <figure className="space-y-2">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-glass-border bg-black">
        {activated ? (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="auto"
            poster={video.poster}
            className="w-full h-full object-cover"
          >
            <source src={video.url} type="video/mp4" />
            Your browser doesn&apos;t support embedded video.{" "}
            <a href={video.url}>Download the clip</a> instead.
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play ${video.title || "video"}`}
            className="group absolute inset-0 w-full h-full cursor-pointer"
          >
            {video.poster ? (
              <img
                src={video.poster}
                alt={video.title || "Video preview"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 bg-bg-secondary" />
            )}
            <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-black translate-x-0.5" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      {video.title && (
        <figcaption className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
          {video.title}
        </figcaption>
      )}
    </figure>
  );
}
