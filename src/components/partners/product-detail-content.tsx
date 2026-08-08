"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass/glass-card";
import { useProductsStore } from "@/stores/products-store";

export function ProductDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const [hasMounted, setHasMounted] = useState(false);
  const products = useProductsStore((s) => s.products);

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

  return (
    <article className="relative w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Body */}
        <div className="markdown-body prose-invert min-w-0">
          {product.body ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{product.body}</ReactMarkdown>
          ) : (
            <p className="text-text-secondary">{product.summary || product.tagline}</p>
          )}
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
        </aside>
      </div>
    </article>
  );
}
