"use client";
// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Partner Products Store (Zustand + Persist + DB Sync)
// Mirrors the projects store; powers the Alliance showcase.
// ─────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { PartnerProduct } from "@/types/partner";
import { partnerProducts as defaultProducts } from "@/data/partner-products";

async function syncProductToDb(product: PartnerProduct) {
  try {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kiwik-data-updated"));
    }
  } catch (err) {
    console.error("Failed to sync product to DB:", err);
  }
}

async function deleteProductFromDb(id: string) {
  try {
    await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kiwik-data-updated"));
    }
  } catch (err) {
    console.error("Failed to delete product from DB:", err);
  }
}

interface ProductsState {
  products: PartnerProduct[];
  setProducts: (products: PartnerProduct[]) => void;
  addProduct: (product: PartnerProduct) => void;
  updateProduct: (id: string, updated: Partial<PartnerProduct>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (newOrder: PartnerProduct[]) => void;
  resetToDefaults: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      products: defaultProducts,

      setProducts: (products) => set({ products }),

      addProduct: (newProduct) => {
        set((state) => ({ products: [newProduct, ...state.products] }));
        syncProductToDb(newProduct);
      },

      updateProduct: (id, updated) => {
        set((state) => {
          const products = state.products.map((p) =>
            p.id === id ? { ...p, ...updated, lastUpdated: new Date().toISOString().split("T")[0] } : p
          );
          const target = products.find((p) => p.id === id);
          if (target) syncProductToDb(target);
          return { products };
        });
      },

      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        deleteProductFromDb(id);
      },

      reorderProducts: (newOrder) => {
        const ordered = newOrder.map((p, i) => ({ ...p, sortOrder: i }));
        set({ products: ordered });
        ordered.forEach((p) => syncProductToDb(p));
      },

      resetToDefaults: () => set({ products: defaultProducts }),
    }),
    { name: "kiwik-products-store-v1" }
  )
);

// SSR-safe hydration + global sync (mount + 30s + focus + kiwik-data-updated).
export function useProducts() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const storeProducts = useProductsStore((s) => s.products);
  const setProducts = useProductsStore((s) => s.setProducts);

  useEffect(() => {
    setHasHydrated(true);

    const POLL_MS = 30000;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = (delay: number) => {
      if (timer) clearTimeout(delay);
      timer = setTimeout(tick, delay);
    };

    async function tick() {
      if (stopped) return;
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        schedule(POLL_MS);
        return;
      }
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        schedule(POLL_MS);
        return;
      }
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.status === "ok" && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        schedule(data.fallback ? POLL_MS * 10 : POLL_MS);
      } catch {
        schedule(POLL_MS * 4);
      }
    }

    tick();

    const handleSync = () => tick();
    window.addEventListener("focus", handleSync);
    window.addEventListener("kiwik-data-updated", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("kiwik-data-updated", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, [setProducts]);

  return hasHydrated ? storeProducts : defaultProducts;
}
