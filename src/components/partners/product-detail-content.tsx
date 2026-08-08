"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowUpRight, FileDown, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass/glass-card";
import { PartnerVideoPlayer } from "@/components/partners/partner-video";
import { useProducts, useProductsStore } from "@/stores/products-store";

export function ProductDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const [hasMounted, setHasMounted] = useState(false);
  const products = useProducts();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const product =
    products.find((p) => p.slug === slug || p.id === slug) ||
    (typeof window !== "undefined"
      ? useProductsStore.getState().products.find((p) => p.slug === slug || p.id === slug)
      : undefined);

  if (!hasMounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-white/20 border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-serif font-bold text-text-primary">Work not found</h1>
        <p className="text-sm text-text-secondary">This partner story doesn't exist or was moved.</p>
        <Link
          href="/partners"
          className="px-5 py-2.5 rounded-full bg-glass-bg border border-glass-border text-text-primary font-bold text-sm hover:bg-bg-secondary transition-colors"
        >
          Back to the Alliance
        </Link>
      </div>
    );
  }

  const gradient = product.accentGradient || "from-accent-blue to-indigo-600";

  const videos = (product.videos || []).filter(
    (v) => v && typeof v.url === "string" && v.url.trim()
  );
  const gallery = (product.gallery || []).filter(
    (src) => typeof src === "string" && src.trim()
  );
  const hasVideos = videos.length > 0;
  const hasGallery = gallery.length > 0;

  return (
    <article className="relative w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          {product.coverImage ? (
            <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className={cn("w-full h-full bg-gradient-to-br opacity-70", gradient)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
        </div>

        {/* Same container as the body below, so the title, prose and media grid
            all share one left edge instead of stepping in and out. */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 -mt-24 relative z-10">
          <Link
            href="/partners"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> THE ALLIANCE
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {product.category && (
              <span className={cn("inline-block px-3 py-1 rounded-full bg-gradient-to-r text-white text-[10px] font-mono font-bold uppercase tracking-wider mb-3", gradient)}>
                {product.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-text-primary leading-tight">
              {product.name}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-text-secondary max-w-2xl">{product.tagline}</p>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {product.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-bg-secondary border border-white/5 text-[11px] font-mono font-bold text-text-muted">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* `minmax(0,1fr)` rather than `1fr`: a bare 1fr track takes its minimum
          from the content, so one wide table or long URL would stretch the
          column and push the whole layout off-centre. */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-14 items-start">
        {/* Body */}
        <div className="min-w-0 space-y-10">
          <div className="markdown-body prose-invert">
            {product.body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{product.body}</ReactMarkdown>
            ) : (
              <p className="text-text-secondary">{product.summary || product.tagline}</p>
            )}
          </div>

        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {product.metrics && product.metrics.length > 0 && (
            <GlassCard className="p-5 space-y-4" tilt={false}>
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted">
                By the numbers
              </h3>
              <div className="space-y-3">
                {product.metrics.map((m, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-3">
                    <span className="text-xs text-text-secondary">{m.label}</span>
                    <span className="text-lg font-serif font-bold text-text-primary">{m.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {product.liveUrl && (
            <a
              href={product.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl bg-accent-blue text-white font-bold text-sm hover:scale-[1.02] transition-transform"
            >
              Visit {product.name} <ArrowUpRight className="w-4 h-4" />
            </a>
          )}

          {product.repoUrl && (
            <a
              href={product.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl bg-bg-secondary border border-glass-border text-text-primary font-bold text-sm hover:border-accent-blue/40 transition-colors"
            >
              <Code2 className="w-4 h-4" /> View source
            </a>
          )}

          {product.brochureUrl && (
            <a
              href={product.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl bg-bg-secondary border border-glass-border text-text-primary font-bold text-sm hover:border-accent-blue/40 transition-colors"
            >
              <FileDown className="w-4 h-4" /> Download brochure
            </a>
          )}
        </aside>
      </div>

      {/* Media lives outside the two-column block on purpose. Inside it, the
          300px sidebar left roughly 570px for images and video, which read as a
          cramped left-hung strip. Full container width lets the grid breathe
          and stay visually centred. */}
      {(hasVideos || hasGallery) && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-20 space-y-16">
          {hasVideos && (
            <section className="space-y-5">
              <SectionHeading
                title="Walkthrough"
                subtitle={videos.length > 1 ? `${videos.length} films` : undefined}
              />
              {/* Two up on desktop so a pair of films reads as a set rather
                  than a vertical queue. A lone video stays full width. */}
              <div
                className={cn(
                  "grid gap-6",
                  videos.length === 1 ? "grid-cols-1 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-2"
                )}
              >
                {videos.map((v, i) => (
                  <PartnerVideoPlayer key={v.url + i} video={v} />
                ))}
              </div>
            </section>
          )}

          {hasGallery && (
            <section className="space-y-5">
              <SectionHeading title="Gallery" subtitle={`${gallery.length} images`} />
              {/* 4:5 matches the portrait creatives these decks ship as, so
                  nothing important gets cropped out of frame. */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {gallery.map((src, i) => (
                  <a
                    key={src + i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl overflow-hidden border border-glass-border bg-bg-secondary hover:border-accent-blue/40 transition-colors"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <img
                        src={src}
                        alt={`${product.name} — image ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </article>
  );
}

/** Centred rule-and-label heading used by the media sections. */
function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted whitespace-nowrap">
        {title}
      </h2>
      <span className="h-px flex-1 bg-divider" />
      {subtitle && (
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted whitespace-nowrap">
          {subtitle}
        </span>
      )}
    </div>
  );
}
