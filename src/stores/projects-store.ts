"use client";
// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Projects Store (Zustand + Persist + DB Sync)
// ─────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Project } from "@/types";
import { projects as defaultProjects } from "@/data/projects";
import { subscribeToEndpoint } from "@/lib/shared-poller";

const categoryFallbacks: Record<string, string> = {
  ai: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  devops: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  payments: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
  research: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  automation: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
  saas: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
  web: "/images/kiwik-cover.jpg",
};

// Async DB Sync Helpers
//
// `fetch` only rejects on a network-level failure, so an HTTP 401 (expired
// admin session) or 503 (database down) used to pass through unnoticed here.
// The local store had already been mutated, so a delete looked like it worked
// while the row survived in the database and reappeared on the next sync —
// which is exactly why deleted projects kept coming back. Every response is
// now inspected, and a failure is announced so the studio can surface it.
export const SYNC_ERROR_EVENT = "kiwik-sync-error";

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

async function syncProjectToDb(project: Project) {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      reportSyncFailure(`Saving "${project.name}"`, await describeFailure(res));
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kiwik-data-updated"));
    }
  } catch (err) {
    reportSyncFailure(`Saving "${project.name}"`, "network error");
    console.error("Failed to sync project to DB:", err);
  }
}

async function deleteProjectFromDb(id: string) {
  try {
    const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      reportSyncFailure("Deleting the project", await describeFailure(res));
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kiwik-data-updated"));
    }
  } catch (err) {
    reportSyncFailure("Deleting the project", "network error");
    console.error("Failed to delete project from DB:", err);
  }
}

interface ProjectsState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (newOrder: Project[]) => void;
  movePriority: (id: string, direction: "up" | "down") => void;
  duplicateProject: (id: string) => void;
  resetToDefaults: () => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: defaultProjects,

      setProjects: (projects) => set({ projects }),

      addProject: (newProject) => {
        set((state) => ({
          projects: [newProject, ...state.projects],
        }));
        syncProjectToDb(newProject);
      },

      updateProject: (id, updated) => {
        set((state) => {
          const newProjects = state.projects.map((p) =>
            p.id === id ? { ...p, ...updated, lastUpdated: new Date().toISOString().split("T")[0] } : p
          );
          const target = newProjects.find((p) => p.id === id);
          if (target) syncProjectToDb(target);
          return { projects: newProjects };
        });
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
        deleteProjectFromDb(id);
      },

      reorderProjects: (newOrder) => {
        set({ projects: newOrder });
        newOrder.forEach((p) => syncProjectToDb(p));
      },

      movePriority: (id, direction) =>
        set((state) => {
          const index = state.projects.findIndex((p) => p.id === id);
          if (index === -1) return state;

          const targetIndex = direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.projects.length) return state;

          const updated = [...state.projects];
          const [movedItem] = updated.splice(index, 1);
          updated.splice(targetIndex, 0, movedItem);

          return { projects: updated };
        }),

      duplicateProject: (id) =>
        set((state) => {
          const target = state.projects.find((p) => p.id === id);
          if (!target) return state;

          const timestamp = Date.now();
          const duplicated: Project = {
            ...target,
            id: `proj-${timestamp}`,
            slug: `${target.slug}-copy-${timestamp.toString().slice(-4)}`,
            name: `${target.name} (Copy)`,
            createdAt: new Date().toISOString().split("T")[0],
            lastUpdated: new Date().toISOString().split("T")[0],
          };

          const index = state.projects.findIndex((p) => p.id === id);
          const updated = [...state.projects];
          updated.splice(index + 1, 0, duplicated);

          syncProjectToDb(duplicated);
          return { projects: updated };
        }),

      resetToDefaults: () => set({ projects: defaultProjects }),
    }),
    {
      name: "kiwik-projects-store-v2",
    }
  )
);

// SSR Hydration & Global DB Sync Hook
export function useProjects() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const storeProjects = useProjectsStore((s) => s.projects);
  const setProjects = useProjectsStore((s) => s.setProjects);

  useEffect(() => {
    setHasHydrated(true);
    // One shared poller per endpoint (see lib/shared-poller). Previously every
    // component calling this hook opened its own timer against the same URL.
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) return;
    return subscribeToEndpoint("/api/projects", (data) => {
      if (data?.status === "ok" && Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects);
      }
    });
  }, [setProjects]);

  // Filtering happens here rather than at each call site: this hook is mounted
  // globally (the command palette lives in the root layout), so a single
  // malformed entry — a null element, or one with no slug — used to throw on
  // every route, not just /projects. Anything unusable is dropped before it can
  // reach a component.
  const source = hasHydrated ? storeProjects : defaultProjects;
  const sanitizedProjects = (Array.isArray(source) ? source : [])
    .filter((p): p is Project => Boolean(p && typeof p === "object" && p.id && p.slug))
    .map((p) => {
      if (!p.coverImage) {
        const defaultP = defaultProjects.find((dp) => dp.id === p.id || dp.slug === p.slug);
        return {
          ...p,
          coverImage:
            defaultP?.coverImage ||
            categoryFallbacks[p.category || ""] ||
            "/images/kiwik-cover.jpg",
        };
      }
      return p;
    });

  return sanitizedProjects;
}
