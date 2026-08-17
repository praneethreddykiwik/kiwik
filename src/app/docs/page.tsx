"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { useDocsStore } from "@/stores/docs-store";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsRightSidebar } from "@/components/docs/DocsRightSidebar";
import { DocsMarkdownRenderer } from "@/components/docs/DocsMarkdownRenderer";
import { DocsComponentPlayground } from "@/components/docs/DocsComponentPlayground";
import { DocsApiExplorer } from "@/components/docs/DocsApiExplorer";
import { DocsArchitectureDiagram } from "@/components/docs/DocsArchitectureDiagram";
import { DocsDatabaseViewer } from "@/components/docs/DocsDatabaseViewer";
import { DocsAiPanel } from "@/components/docs/DocsAiPanel";

function DocsMainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { categories, articles } = useDocsStore();
  
  // Default to 'introduction' if no slug query param is supplied
  const initialSlug = searchParams.get("slug") || "introduction";
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Sync activeSlug from searchParams if query string changes
  useEffect(() => {
    const slugFromParam = searchParams.get("slug");
    if (slugFromParam && articles[slugFromParam]) {
      setActiveSlug(slugFromParam);
    }
  }, [searchParams, articles]);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("kiwik-docs-bookmarks");
        if (saved) setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed loading bookmarks:", e);
      }
    }
  }, []);

  // Keyboard Navigation Listeners ('/', 'G+P', 'G+D', 'G+A', etc.)
  useEffect(() => {
    let lastKey = "";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/'
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search documentation"]') as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      // Quick Key combinations: G then P/D/A
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        const key = e.key.toLowerCase();
        if (lastKey === "g") {
          if (key === "p") {
            e.preventDefault();
            router.push("/projects");
          } else if (key === "d") {
            e.preventDefault();
            router.push("/docs");
          } else if (key === "a") {
            e.preventDefault();
            router.push("/admin");
          }
          lastKey = "";
          return;
        }
        if (key === "g") {
          lastKey = "g";
          setTimeout(() => { lastKey = ""; }, 1000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const currentArticle = articles[activeSlug] || articles["introduction"] || Object.values(articles)[0];

  const handleSelectArticle = (slug: string) => {
    setActiveSlug(slug);
    router.push(`/docs?slug=${slug}`, { scroll: false });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleBookmark = () => {
    let updated: string[];
    if (bookmarks.includes(activeSlug)) {
      updated = bookmarks.filter(b => b !== activeSlug);
    } else {
      updated = [...bookmarks, activeSlug];
    }
    setBookmarks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kiwik-docs-bookmarks", JSON.stringify(updated));
    }
  };

  const handleScrollToSection = (id: string) => {
    setActiveSectionId(id);
    const elem = document.getElementById(id);
    elem?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenCommandPalette = () => {
    if (typeof window !== "undefined") {
      const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
      window.dispatchEvent(event);
    }
  };

  return (
    // pt-24 matches every other route. This was py-8, which left only ~58px
    // between the fixed navbar and the first card — the nav floats at top-3 and
    // is ~58px tall, so the content sat tucked underneath it.
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white px-4 sm:px-6 md:px-8 pt-24 pb-8 max-w-[1500px] mx-auto">
      
      {/* Top Hero Header */}
      <DocsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCommandPalette={handleOpenCommandPalette}
      />

      {/* Main 3-Column Desktop Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Navigation Sidebar */}
        <DocsSidebar
          categories={categories}
          activeSlug={activeSlug}
          onSelectArticle={handleSelectArticle}
          bookmarksCount={bookmarks.length}
        />

        {/* Center Main Content Deck */}
        <main className="flex-1 w-full min-w-0 bg-white dark:bg-[#0D0D0E] border border-neutral-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-8">
          
          {/* Article Header */}
          <div className="space-y-3 border-b border-neutral-200/80 dark:border-white/10 pb-6 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              {currentArticle.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-bold border border-neutral-200 dark:border-white/10">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-wide">
              {currentArticle.title}
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 text-base font-medium leading-relaxed">
              {currentArticle.subtitle}
            </p>
          </div>

          {/* Standard Markdown Content Sections */}
          <DocsMarkdownRenderer sections={currentArticle.sections} />

          {/* Interactive Component Playground (If Component Article) */}
          {currentArticle.componentSpec && (
            <DocsComponentPlayground
              componentName={currentArticle.componentSpec.componentName}
              description={currentArticle.componentSpec.description}
              props={currentArticle.componentSpec.props}
              variants={currentArticle.componentSpec.variants}
            />
          )}

          {/* Interactive API Explorer (If API Article) */}
          {currentArticle.apiEndpoints && (
            <DocsApiExplorer endpoints={currentArticle.apiEndpoints} />
          )}

          {/* Interactive Architecture Diagram (If Architecture Article) */}
          {currentArticle.architectureDiagrams && (
            <DocsArchitectureDiagram nodes={currentArticle.architectureDiagrams} />
          )}

          {/* Interactive Database Schema Browser (If Database Article) */}
          {currentArticle.databaseTables && (
            <DocsDatabaseViewer tables={currentArticle.databaseTables} />
          )}

        </main>

        {/* Right Info & Table of Contents Sidebar */}
        <DocsRightSidebar
          toc={currentArticle.toc}
          activeSectionId={activeSectionId}
          onSelectToc={handleScrollToSection}
          readingTimeMinutes={currentArticle.readingTimeMinutes}
          lastUpdated={currentArticle.lastUpdated}
          author={currentArticle.author}
          isBookmarked={bookmarks.includes(activeSlug)}
          onToggleBookmark={toggleBookmark}
          onOpenAiAssistant={() => setIsAiOpen(true)}
        />

      </div>

      {/* Embedded "Ask Kiwik AI" Panel Drawer */}
      <DocsAiPanel
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentArticle={currentArticle}
      />
    </div>
  );
}

export default function DocsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-sm font-mono text-indigo-400">
        Loading Documentation Deck...
      </div>
    }>
      <DocsMainContent />
    </Suspense>
  );
}
