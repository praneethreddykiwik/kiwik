"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerProduct } from "@/types/partner";

export function PartnerCard({ product, index = 0 }: { product: PartnerProduct; index?: number }) {
  const gradient = product.accentGradient || "from-accent-blue to-indigo-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
    >
      <Link
        href={`/partners/${product.slug}`}
        className="group block h-full rounded-3xl overflow-hidden bg-glass-bg border border-glass-border hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Cover */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden">
          <img
            src={product.coverImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className={cn("absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r", gradient)} />
          {product.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
              {product.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-serif font-bold text-text-primary leading-tight">
              {product.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent-blue transition-colors shrink-0 mt-1" />
          </div>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {product.summary || product.tagline}
          </p>
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-bg-secondary border border-white/5 text-[10px] font-mono font-bold text-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
