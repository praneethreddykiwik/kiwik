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

// See the note in projects-store: a non-2xx response here is not a thrown
// error, so an expired session or an unreachable database silently discarded
// the write while the local store carried on as if it had succeeded.
import { SYNC_ERROR_EVENT } from "@/stores/projects-store";

function reportSyncFailure(action: string, detail: string) {
  const message = `${action} failed — ${detail}`;
  console.error(`[kiwik] ${message}`);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SYNC_ERROR_EVENT, { detail: message }));
  }
}

async function describeFailure(res: Response): Promise<string> {
  if (res.status === 401) return "your admin session expired, sign in again";
  const body = await res.json().catch(() => ({} as any));
  return body?.error || `HTTP ${res.status}`;
}

async function syncProductToDb(product: PartnerProduct) {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      reportSyncFailure(`Saving "${product.name}"`, await describeFailure(res));
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kiwik-data-updated"));
    }
  } catch (err) {
    reportSyncFailure(`Saving "${product.name}"`, "network error");
    console.error("Failed to sync product to DB:", err);
  }
}

async function deleteProductFromDb(id: string) {
  try {
    const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      reportSyncFailure("Deleting the product", await describeFailure(res));
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kiwik-data-updated"));
    }
  } catch (err) {
    reportSyncFailure("Deleting the product", "network error");
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
    // Key bumped to v2 to drop every browser's cached product list.
    //
    // The admin studio posts whatever this store holds, so a browser still
    // caching a retired seed product will write it back to the database on the
    // next "Save All Changes" — which is exactly how the old placeholder
    // partners kept reappearing after being deleted. Discarding the cache lets
    // the database (polled below) be the single source of truth.
    { name: "kiwik-products-store-v2" }
  )
);

// SSR-safe hydration + global sync (mount + 30s + focus + kiwik-data-updated).
export function useProducts() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const storeProducts = useProductsStore((s) => s.products);
  const setProducts = useProductsStore((s) => s.setProducts);

  useEffect(() => {
    setHasHydrated(true);

    const POLL_MS = 3000;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = (delay: number) => {
      if (timer) clearTimeout(timer);
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
        const res = await fetch("/api/products", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
        });
        const data = await res.json();
        if (data.status === "ok" && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        schedule(POLL_MS);
      } catch {
        schedule(POLL_MS);
      }
    }

    tick();

    const handleSync = () => tick();
    window.addEventListener("focus", handleSync);
    window.addEventListener("kiwik-data-updated", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel("kiwik-global-sync");
        bc.onmessage = (msg) => {
          if (msg.data === "kiwik-data-updated") tick();
        };
      } catch {
        /* ignore */
      }
    }

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      if (bc) bc.close();
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("kiwik-data-updated", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, [setProducts]);

  // Same guard as the projects hook: drop unusable entries before they reach a
  // component, since this hook is rendered on public pages.
  const source = hasHydrated ? storeProducts : defaultProducts;
  return (Array.isArray(source) ? source : []).filter(
    (p): p is PartnerProduct => Boolean(p && typeof p === "object" && p.id && p.slug)
  );
}
