"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowUp, ArrowDown, CornerDownLeft, X, LayoutTemplate } from "lucide-react";
import Fuse from "fuse.js";
import { cn } from "@/lib/utils";
import { useProjects } from "@/stores/projects-store";
import { Project } from "@/types";

export function CommandPalette() {
  const projects = useProjects();
  // Searches are counted on the server for the admin Analytics tab. Each term
  // is sent at most once per palette opening, and only once the visitor has
  // paused or picked a result — not on every keystroke ("sow", "sowc", …).
  const sentSearches = useRef<Set<string>>(new Set());
  const recordSearch = (q: string) => {
    const term = q.trim().toLowerCase();
    if (term.length < 3 || sentSearches.current.has(term)) return;
    sentSearches.current.add(term);
    fetch("/api/analytics/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: term }),
      keepalive: true,
    }).catch(() => {});
  };
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    
    const handleToggle = () => {
      setIsOpen((open) => !open);
    };

    document.addEventListener("keydown", down);
    window.addEventListener("toggle-command-palette", handleToggle);
    
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("toggle-command-palette", handleToggle);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  const fuse = new Fuse(projects, {
    keys: ["name", "tagline", "tags", "techStack.name", "category"],
    threshold: 0.4,
  });

  const results: Project[] = query
    ? fuse.search(query).map((result) => result.item).slice(0, 8)
    : projects.slice(0, 8);

  useEffect(() => {
    setActiveIndex(0);
    if (query.trim().length < 3) return;
    const t = setTimeout(() => recordSearch(query), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (!isOpen) sentSearches.current.clear();
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  const handleSelect = (project: Project) => {
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev].slice(0, 5));
    }
    if (query) {
      recordSearch(query);
    }
    setIsOpen(false);
    router.push(`/projects/${project.slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-bg-secondary/95 dark:bg-bg-secondary/90 border border-glass-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto backdrop-blur-2xl"
            >
              <div className="flex items-center px-4 bg-neutral-200/20 dark:bg-black/15 border-b border-divider">
                <Search className="w-4 h-4 text-text-secondary shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search projects, tags, or categories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-3.5 bg-transparent border-0 border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent text-text-primary placeholder:text-text-secondary/40 text-base"
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                  }}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <div className="space-y-1">
                    {query === "" && recentSearches.length > 0 && (
                      <div className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Recent Searches
                      </div>
                    )}
                    {results.map((project, index) => (
                      <div
                        key={project.id}
                        onClick={() => handleSelect(project)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                          activeIndex === index ? "bg-[var(--accent)]/20" : "hover:bg-glass-bg-hover"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-glass-bg border border-glass-border flex items-center justify-center text-text-secondary">
                            <LayoutTemplate className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text-primary">{project.name}</span>
                              <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-glass-bg-hover border border-glass-border text-text-secondary">
                                {project.category}
                              </span>
                            </div>
                            <span className="text-sm text-text-secondary line-clamp-1">
                              {project.tagline}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn("w-2 h-2 rounded-full", {
                              "bg-emerald-500": project.status === "completed",
                              "bg-amber-500": project.status === "in-progress",
                              "bg-rose-500": project.status === "archived",
                              "bg-neutral-500": project.status === "private",
                            })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-14 text-center">
                    <Search className="w-12 h-12 text-text-secondary/30 mx-auto mb-4" />
                    <p className="text-text-primary font-medium">No results found</p>
                    <p className="text-text-secondary text-sm mt-1">
                      Try searching for a different keyword
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-divider bg-glass-bg text-xs text-text-secondary">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-glass-bg-hover border border-glass-border">
                      <ArrowUp className="w-3 h-3" />
                    </span>
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-glass-bg-hover border border-glass-border">
                      <ArrowDown className="w-3 h-3" />
                    </span>
                    <span className="ml-1">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-glass-bg-hover border border-glass-border">
                      <CornerDownLeft className="w-3 h-3" />
                    </span>
                    <span className="ml-1">Open</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="flex items-center justify-center px-1.5 h-5 rounded bg-glass-bg-hover border border-glass-border">
                    esc
                  </span>
                  <span className="ml-1">Close</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
