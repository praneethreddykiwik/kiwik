"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Wraps the routed page content. On marketing routes it leaves room for the
 * fixed navbar via `pt-[72px]`. On the admin CMS (`/admin`) it renders a
 * self-contained full-height shell with no top offset so the studio can own
 * the full viewport and manage its own internal scrolling.
 */
export function LayoutMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main
      className={cn(
        "flex-1 overflow-x-hidden w-full max-w-full",
        isAdmin ? "pt-0 h-screen overflow-hidden" : "pt-[72px]"
      )}
    >
      {children}
    </main>
  );
}
