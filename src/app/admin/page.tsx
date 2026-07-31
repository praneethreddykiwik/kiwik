"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectImage } from "@/components/ui/project-image";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Code,
  ListPlus,
  GitBranch,
  FileText,
  Users,
  Calendar,
  Image as ImageIcon,
  Check,
  Eye,
  Star,
  LayoutDashboard,
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  Shield,
  History,
  Settings,
  Palette,
  Compass,
  Database,
  Terminal,
  Activity,
  Workflow,
  Globe,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Sliders,
  Play,
  RefreshCw,
  FolderPlus,
  Tag,
  ShieldCheck,
  HelpCircle,
  Lock,
  UserCheck,
  Folder,
  MousePointer,
  Cpu,
  Mail,
  Share2,
  FileCode,
  MessageSquare,
  BarChart3,
  Globe2,
  Laptop
} from "lucide-react";

import { useProjectsStore, useProjects } from "@/stores/projects-store";
import { useSiteCMSStore } from "@/stores/site-cms-store";
import { useDocsStore } from "@/stores/docs-store";
import { GlassCard } from "@/components/glass/glass-card";
import type {
  Project,
  ProjectStatus,
  ProjectCategory,
  TechCategory,
  TechItem,
  Feature,
} from "@/types";
import { cn } from "@/lib/utils";

// Navigation Types
type MainSidebarTab =
  | "dashboard"
  | "pages"
  | "media"
  | "projects"
  | "documentation"
  | "ai"
  | "analytics"
  | "users"
  | "appearance"
  | "settings";

type PageSubTab =
  | "home"
  | "projects-page"
  | "project-detail"
  | "docs-page"
  | "doc-article"
  | "about"
  | "contact"
  | "footer-page"
  | "404";

type HomeSectionTab =
  | "hero"
  | "floating-gallery"
  | "prompt-bar"
  | "architecture"
  | "why-criska"
  | "dashboard-showcase"
  | "featured-products"
  | "earth-section"
  | "device-showcase"
  | "capabilities"
  | "how-we-work"
  | "trust"
  | "newsletter"
  | "footer";

// Blank Project Template
const emptyProject: Project = {
  id: "",
  slug: "",
  name: "",
  tagline: "",
  description: "",
  longDescription: "",
  status: "in-progress",
  category: "web",
  tags: ["new"],
  version: "1.0.0",
  completionPercent: 50,
  liveUrl: "",
  githubUrl: "",
  coverImage: "/images/kiwik-cover.jpg",
  images: [],
  techStack: [],
  features: [],
  changelog: [],
  contributors: [],
  timeline: [],
  readme: "",
  architecture: "",
  lastUpdated: new Date().toISOString().split("T")[0],
  createdAt: new Date().toISOString().split("T")[0],
  owner: "Kiwik",
  stars: 0,
  forks: 0,
  views: 0,
  deploymentStatus: "live"
};

export default function AdminPage() {
  // Navigation State
  const [mainTab, setMainTab] = useState<MainSidebarTab>("pages");
  const [activePage, setActivePage] = useState<PageSubTab>("home");
  const [homeSection, setHomeSection] = useState<HomeSectionTab>("hero");

  // Theme & Live Preview State
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState<"dark" | "light">("dark");

  // Store Hooks
  const projects = useProjects();
  const { addProject, updateProject, deleteProject } = useProjectsStore();

  const {
    cms,
    updateSettings,
    updateHero,
    updateNavigation,
    updateFooter,
    updateTheme,
    updateSEO,
    addMediaItem,
    deleteMediaItem,
    createSnapshot,
    rollbackSnapshot,
    addAuditLog
  } = useSiteCMSStore();

  const docsCategories = useDocsStore((state) => state.categories);
  const { addArticle, updateArticle, deleteArticle } = useDocsStore();

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter & Modal States
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [mediaSearch, setMediaSearch] = useState("");

  // Media Picker popup states
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    onSelect: (url: string) => void;
    title: string;
  } | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerFolder, setPickerFolder] = useState("all");

  // Phone Showcase & Projects Editor States
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Prompt-less Media additions
  const [showAddMediaForm, setShowAddMediaForm] = useState(false);
  const [newMediaName, setNewMediaName] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [showPickerAddForm, setShowPickerAddForm] = useState(false);
  const [newPickerAssetName, setNewPickerAssetName] = useState("");
  const [newPickerAssetUrl, setNewPickerAssetUrl] = useState("");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesStatus =
      projectStatusFilter === "all" || p.status === projectStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans select-none antialiased">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          TOP CONTROL BAR (Enterprise CMS Studio Header)
         ───────────────────────────────────────────────────────────── */}
      <header className="h-16 px-6 bg-glass-bg border-b border-glass-border backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-blue via-indigo-500 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-bg-primary rounded-[11px] flex items-center justify-center font-bold text-xs text-text-primary group-hover:scale-105 transition-transform">
                K
              </div>
            </div>
            <span className="font-serif font-bold text-base tracking-tight text-text-primary">Kiwik OS Studio</span>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry Synced
          </span>
        </div>

        {/* Device Switcher & Mode Tools */}
        <div className="flex items-center gap-3">
          {/* Viewport Frame Toggle */}
          <button
            onClick={() => {
              if (mainTab === ("live-preview" as any)) {
                setMainTab("pages");
              } else {
                setMainTab("live-preview" as any);
              }
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border",
              mainTab === ("live-preview" as any)
                ? "bg-accent-blue text-white border-transparent shadow-md"
                : "bg-bg-secondary border-glass-border text-text-primary hover:bg-bg-primary"
            )}
          >
            <Monitor className="w-4 h-4" />
            <span>{mainTab === ("live-preview" as any) ? "Back to Studio" : "Live Device Frame"}</span>
          </button>

          {/* Device Switcher Segment */}
          <div className="flex items-center p-1 rounded-xl bg-bg-secondary border border-glass-border">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer",
                previewDevice === "desktop" ? "bg-accent-blue text-white shadow-sm" : "text-text-secondary hover:text-text-primary"
              )}
              title="Desktop / Laptop View (1280px)"
            >
              <Laptop className="w-3.5 h-3.5" /> Laptop
            </button>
            <button
              onClick={() => setPreviewDevice("tablet")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer",
                previewDevice === "tablet" ? "bg-accent-blue text-white shadow-sm" : "text-text-secondary hover:text-text-primary"
              )}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" /> Tablet
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer",
                previewDevice === "mobile" ? "bg-accent-blue text-white shadow-sm" : "text-text-secondary hover:text-text-primary"
              )}
              title="Mobile Smartphone View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          <button
            onClick={() => setPreviewMode(previewMode === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl bg-bg-secondary border border-glass-border text-text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {previewMode === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{previewMode === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold shadow-md hover:scale-102 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> View Public Site
          </Link>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN STUDIO LAYOUT (Sidebar + Main Content Canvas)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR HIERARCHY */}
        <aside className="w-64 bg-glass-bg border-r border-glass-border p-4 flex flex-col justify-between shrink-0 space-y-4 overflow-y-auto">
          <div className="space-y-6">
            
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Enterprise Studio
              </span>

              <button
                onClick={() => setMainTab("dashboard")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "dashboard" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>

              <button
                onClick={() => setMainTab("pages")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer text-left",
                  mainTab === "pages" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4" /> Pages
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Collapsible Pages Tree */}
              {mainTab === "pages" && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-accent-blue/30 ml-3 my-1">
                  {[
                    { id: "home", label: "HOME", icon: Sparkles },
                    { id: "projects-page", label: "PROJECTS", icon: Folder },
                    { id: "project-detail", label: "PROJECT DETAILS", icon: FileText },
                    { id: "docs-page", label: "DOCUMENTATION", icon: BookOpenIcon },
                    { id: "doc-article", label: "DOC ARTICLE", icon: Code },
                    { id: "about", label: "ABOUT", icon: Users },
                    { id: "contact", label: "CONTACT", icon: Terminal },
                    { id: "footer-page", label: "FOOTER", icon: Layers },
                    { id: "404", label: "404 PAGE", icon: AlertCircle }
                  ].map((pg) => (
                    <button
                      key={pg.id}
                      onClick={() => setActivePage(pg.id as PageSubTab)}
                      className={cn(
                        "w-full px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-colors cursor-pointer text-left",
                        activePage === pg.id ? "bg-white/10 text-accent-blue font-extrabold" : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <pg.icon className="w-3 h-3" /> {pg.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setMainTab("media")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "media" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <ImageIcon className="w-4 h-4" /> Media Library
              </button>

              <button
                onClick={() => setMainTab("projects")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "projects" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Folder className="w-4 h-4" /> Projects
              </button>

              <button
                onClick={() => setMainTab("documentation")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "documentation" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <FileText className="w-4 h-4" /> Documentation
              </button>

              <button
                onClick={() => setMainTab("ai")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "ai" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Terminal className="w-4 h-4" /> AI Assistant
              </button>

              <button
                onClick={() => setMainTab("analytics")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "analytics" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Activity className="w-4 h-4" /> Analytics
              </button>

              <button
                onClick={() => setMainTab("users")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "users" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Users className="w-4 h-4" /> Users & Roles
              </button>

              <button
                onClick={() => setMainTab("appearance")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "appearance" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Palette className="w-4 h-4" /> Appearance
              </button>

              <button
                onClick={() => setMainTab("settings")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "settings" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>

          </div>

          {/* System Snapshots */}
          <div className="p-3 rounded-2xl bg-bg-secondary/60 border border-glass-border space-y-2 text-left">
            <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">System Control</span>
            <button
              onClick={() => {
                const name = `Backup - ${new Date().toLocaleString()}`;
                createSnapshot(name, "Manual Admin Backup");
                showToast(`Created Snapshot [${name}]`);
              }}
              className="w-full py-1.5 rounded-lg bg-glass-bg border border-glass-border text-text-primary text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-bg-secondary transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-accent-blue" /> Create Snapshot
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CANVAS */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* LIVE DEVICE PREVIEW TAB */}
          {mainTab === ("live-preview" as any) && (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex items-center justify-between w-full p-4 rounded-2xl bg-glass-bg border border-glass-border">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-accent-blue" />
                  <div className="text-left">
                    <h3 className="text-sm font-serif font-bold text-text-primary">Live Responsive Device Canvas</h3>
                    <p className="text-[11px] text-text-secondary">Simulating Kiwik Public Site in real-time viewports.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent-blue">
                    Viewport: {previewDevice === "desktop" ? "Laptop / Desktop (1280px)" : previewDevice === "tablet" ? "iPad / Tablet (768px)" : "iPhone / Mobile (375px)"}
                  </span>
                </div>
              </div>

              {/* DEVICE FRAME CONTAINER */}
              <div className="w-full flex justify-center py-4 overflow-x-auto">
                <div
                  className={cn(
                    "transition-all duration-300 rounded-2xl bg-black border-4 border-neutral-800 shadow-2xl overflow-hidden relative flex flex-col",
                    previewDevice === "desktop" && "w-full max-w-[1280px] h-[780px]",
                    previewDevice === "tablet" && "w-[768px] h-[850px] rounded-[32px] border-[12px] border-neutral-800",
                    previewDevice === "mobile" && "w-[375px] h-[720px] rounded-[40px] border-[14px] border-neutral-800"
                  )}
                >
                  {/* macOS / Mobile Device Header Bar */}
                  <div className="h-8 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="px-3 py-0.5 rounded-full bg-black/60 text-[10px] font-mono text-zinc-400 border border-white/10">
                      https://kiwik-xi.vercel.app/
                    </div>
                    <div className="w-8" />
                  </div>

                  {/* REAL-TIME PUBLIC SITE IFRAME */}
                  <iframe
                    src="/"
                    className="w-full flex-1 border-0 bg-bg-primary"
                    title="Kiwik Live Responsive Site Preview"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB */}
          {mainTab === "dashboard" && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border space-y-2">
                <h2 className="text-xl font-serif font-bold text-text-primary flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-accent-blue" /> Enterprise Command Center
                </h2>
                <p className="text-xs text-text-secondary">Overview of live site telemetry, CMS store updates, audit trails, and system health.</p>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Total Visitors</span>
                  <div className="text-2xl font-bold font-mono text-text-primary">{cms.analytics.totalVisitors.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">↑ +14.2% this month</span>
                </GlassCard>

                <GlassCard className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Total Projects</span>
                  <div className="text-2xl font-bold font-mono text-text-primary">{projects.length}</div>
                  <span className="text-[10px] text-accent-blue font-mono font-bold">● Active Catalog</span>
                </GlassCard>

                <GlassCard className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Media Assets</span>
                  <div className="text-2xl font-bold font-mono text-text-primary">{cms.media.length}</div>
                  <span className="text-[10px] text-purple-400 font-mono font-bold">Managed DAM Pool</span>
                </GlassCard>

                <GlassCard className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Docs Articles</span>
                  <div className="text-2xl font-bold font-mono text-text-primary">
                    {docsCategories.reduce((acc, c) => acc + c.articles.length, 0)}
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">Published Articles</span>
                </GlassCard>
              </div>
            </div>
          )}

          {/* PAGES TAB (EVERY SINGLE SUB-PAGE IMPLEMENTED) */}
          {mainTab === "pages" && (
            <div className="space-y-6">
              
              {/* PAGE SELECTION TITLE */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-glass-bg border border-glass-border text-left">
                <div>
                  <h2 className="text-lg font-serif font-bold text-text-primary flex items-center gap-2">
                    <Compass className="w-5 h-5 text-accent-blue" /> Page Editor: <span className="uppercase text-accent-blue font-mono font-extrabold">{activePage}</span>
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">Visually configure text, media, buttons, parameters, and live preview for this page.</p>
                </div>
              </div>

              {/* HOME PAGE SECTION SELECTOR RIBBON */}
              {activePage === "home" && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-glass-border">
                  {[
                    { id: "hero", label: "Hero" },
                    { id: "floating-gallery", label: "Floating Gallery" },
                    { id: "prompt-bar", label: "Prompt Bar" },
                    { id: "architecture", label: "Architecture" },
                    { id: "why-criska", label: "Why Criska" },
                    { id: "dashboard-showcase", label: "Dashboard Showcase" },
                    { id: "featured-products", label: "Featured Products" },
                    { id: "earth-section", label: "Earth Section" },
                    { id: "device-showcase", label: "Device Showcase" },
                    { id: "capabilities", label: "Capabilities" },
                    { id: "how-we-work", label: "How We Work" },
                    { id: "trust", label: "Trust Section" },
                    { id: "newsletter", label: "Newsletter" },
                    { id: "footer", label: "Footer" }
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setHomeSection(sec.id as HomeSectionTab)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border",
                        homeSection === sec.id
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-transparent shadow"
                          : "bg-bg-secondary/60 text-text-secondary border-glass-border hover:text-text-primary"
                      )}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 1. HERO SECTION EDITOR */}
              {activePage === "home" && homeSection === "hero" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  <div className="lg:col-span-6 space-y-6">
                    <GlassCard className="p-6 space-y-4">
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-blue" /> Hero Headlines & Subtitle
                      </h3>
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Headline Prefix</label>
                        <input
                          type="text"
                          value={cms.hero.headlinePrefix}
                          onChange={(e) => {
                            updateHero({ headlinePrefix: e.target.value });
                            showToast("Updated headline prefix!");
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Highlight Word / Phrase</label>
                        <input
                          type="text"
                          value={cms.hero.headlineHighlightWord}
                          onChange={(e) => {
                            updateHero({ headlineHighlightWord: e.target.value });
                            showToast("Updated highlight word!");
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Hero Description Copy</label>
                        <textarea
                          rows={3}
                          value={cms.hero.description}
                          onChange={(e) => {
                            updateHero({ description: e.target.value });
                            showToast("Updated hero description!");
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-medium"
                        />
                      </div>
                    </GlassCard>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW */}
                  <div className="lg:col-span-6">
                    <GlassCard className="p-6 space-y-4 sticky top-24">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted block">Live Visual Preview</span>
                      <div className="p-8 rounded-2xl bg-black text-center space-y-4 border border-white/20">
                        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight leading-tight">
                          {cms.hero.headlinePrefix} <br />
                          <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                            {cms.hero.headlineHighlightWord}
                          </span>
                        </h1>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                          {cms.hero.description}
                        </p>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* 2. FLOATING GALLERY EDITOR */}
              {activePage === "home" && homeSection === "floating-gallery" && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-glass-bg border border-glass-border">
                    <div>
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-purple-400" /> Parallax Ribbon Image Gallery Manager ({(cms.hero.galleryImages || []).length})
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">Add, edit, delete, and attach click target URLs for 3D ribbon floating images.</p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = [
                          ...(cms.hero.galleryImages || []),
                          {
                            id: `g-${Date.now()}`,
                            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
                            title: "New Featured Artwork",
                            linkUrl: "/projects"
                          }
                        ];
                        updateHero({ galleryImages: updated });
                        showToast("Added new placeholder image card. Edit details inline below!");
                      }}
                      className="px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Ribbon Image
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {(cms.hero.galleryImages || []).map((img, idx) => (
                      <GlassCard key={img.id || idx} className="p-4 space-y-3 flex flex-col justify-between">
                        <div className="h-36 w-full rounded-xl bg-black/40 overflow-hidden relative border border-white/10">
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-text-muted block">Image Title</label>
                            <input
                              type="text"
                              value={img.title}
                              onChange={(e) => {
                                const updated = (cms.hero.galleryImages || []).map((g) => (g.id === img.id ? { ...g, title: e.target.value } : g));
                                updateHero({ galleryImages: updated });
                                showToast("Updated image title!");
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-text-muted block">Click Target Link URL</label>
                            <input
                              type="text"
                              value={img.linkUrl || "/projects"}
                              onChange={(e) => {
                                const updated = (cms.hero.galleryImages || []).map((g) => (g.id === img.id ? { ...g, linkUrl: e.target.value } : g));
                                updateHero({ galleryImages: updated });
                                showToast("Updated click target URL!");
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-mono text-accent-blue"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-text-muted block">Image URL</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={img.url}
                                onChange={(e) => {
                                  const updated = (cms.hero.galleryImages || []).map((g) => (g.id === img.id ? { ...g, url: e.target.value } : g));
                                  updateHero({ galleryImages: updated });
                                  showToast("Updated image URL!");
                                }}
                                className="flex-1 px-3 py-1.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => setMediaPickerTarget({
                                  title: `Ribbon Image #${idx + 1} (${img.title})`,
                                  onSelect: (url) => {
                                    const updated = (cms.hero.galleryImages || []).map((g) => (g.id === img.id ? { ...g, url } : g));
                                    updateHero({ galleryImages: updated });
                                    showToast("Linked ribbon image from DAM!");
                                  }
                                })}
                                className="px-3 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 text-[10px] font-bold text-white transition-colors cursor-pointer"
                              >
                                Browse
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-divider">
                          <span className="text-[10px] font-mono text-text-muted">Index #{idx + 1}</span>
                          <button
                            onClick={() => {
                              const updated = (cms.hero.galleryImages || []).filter((g) => g.id !== img.id);
                              updateHero({ galleryImages: updated });
                              showToast(`Deleted image [${img.title}]`);
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PROMPT BAR EDITOR */}
              {activePage === "home" && homeSection === "prompt-bar" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-accent-blue" /> Hero Prompt Bar Typewriter Suggestions ({(cms.hero.rotatingWords || []).length})
                    </h3>
                    <button
                      onClick={() => {
                        const updated = [...(cms.hero.rotatingWords || []), "New autonomous request suggestion..."];
                        updateHero({ rotatingWords: updated });
                        showToast("Added new suggestion! Edit it inline below.");
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Prompt
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(cms.hero.rotatingWords || []).map((promptText, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-glass-border">
                        <input
                          type="text"
                          value={promptText}
                          onChange={(e) => {
                            const updated = [...(cms.hero.rotatingWords || [])];
                            updated[idx] = e.target.value;
                            updateHero({ rotatingWords: updated });
                            showToast("Updated prompt suggestion!");
                          }}
                          className="flex-1 bg-transparent text-xs font-mono font-medium text-text-primary focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const updated = (cms.hero.rotatingWords || []).filter((_, i) => i !== idx);
                            updateHero({ rotatingWords: updated });
                            showToast("Deleted prompt suggestion!");
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* 4. UNIFIED ARCHITECTURE EDITOR */}
              {activePage === "home" && homeSection === "architecture" && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-glass-bg border border-glass-border">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-purple-400" /> Unified Operating Architecture Nodes ({(cms.architectureNodes || []).length})
                    </h3>
                    <button
                      onClick={() => {
                        const count = (cms.architectureNodes || []).length;
                        useSiteCMSStore.getState().addArchitectureNode({
                          id: `node-${Date.now()}`,
                          title: `New Node ${count + 1}`,
                          subtitle: "Active Service",
                          iconName: "Cpu",
                          color: "from-purple-500/20 to-purple-600/5",
                          border: "border-purple-500/30 hover:border-purple-500/60",
                          glow: "shadow-purple-500/10",
                          badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
                          badgeText: "Active Node",
                          order: count + 1
                        });
                        showToast(`Added new architecture node! Edit details inline below.`);
                      }}
                      className="px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Node
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {(cms.architectureNodes || []).map((node) => (
                      <GlassCard key={node.id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={node.title}
                            onChange={(e) => {
                              useSiteCMSStore.getState().updateArchitectureNode(node.id, { title: e.target.value });
                              showToast("Updated title!");
                            }}
                            className="font-bold text-xs text-text-primary bg-transparent focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              useSiteCMSStore.getState().deleteArchitectureNode(node.id);
                              showToast(`Deleted node [${node.title}]`);
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block">Subtitle</label>
                          <input
                            type="text"
                            value={node.subtitle}
                            onChange={(e) => {
                              useSiteCMSStore.getState().updateArchitectureNode(node.id, { subtitle: e.target.value });
                              showToast("Updated subtitle!");
                            }}
                            className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-text-primary"
                          />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. WHY CRISKA EDITOR */}
              {activePage === "home" && homeSection === "why-criska" && (
                <div className="space-y-6 text-left">
                  <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Why Criska Pills Manager ({(cms.whyCriskaPills || []).length})
                      </h3>
                      <button
                        onClick={() => {
                          const updated = [...(cms.whyCriskaPills || []), { id: `w-${Date.now()}`, text: "New High Performance Node", iconName: "Cpu", visible: true, order: (cms.whyCriskaPills || []).length + 1 }];
                          useSiteCMSStore.setState({ cms: { ...cms, whyCriskaPills: updated } });
                          showToast("Added new placeholder pill. Edit inline below!");
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Pill
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(cms.whyCriskaPills || []).map((pill) => (
                        <div key={pill.id} className="p-4 rounded-xl bg-bg-secondary/60 border border-glass-border space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-text-muted block mb-1">Pill Label</label>
                            <input
                              type="text"
                              value={pill.text}
                              onChange={(e) => {
                                const updated = (cms.whyCriskaPills || []).map((p) => (p.id === pill.id ? { ...p, text: e.target.value } : p));
                                useSiteCMSStore.setState({ cms: { ...cms, whyCriskaPills: updated } });
                                showToast("Updated pill label!");
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-divider">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-secondary">
                              <input
                                type="checkbox"
                                checked={pill.visible !== false}
                                onChange={(e) => {
                                  const updated = (cms.whyCriskaPills || []).map((p) => (p.id === pill.id ? { ...p, visible: e.target.checked } : p));
                                  useSiteCMSStore.setState({ cms: { ...cms, whyCriskaPills: updated } });
                                  showToast("Toggled pill visibility!");
                                }}
                                className="rounded text-accent-blue"
                              />
                              Visible on Home
                            </label>
                            <button
                              onClick={() => {
                                const updated = (cms.whyCriskaPills || []).filter((p) => p.id !== pill.id);
                                useSiteCMSStore.setState({ cms: { ...cms, whyCriskaPills: updated } });
                                showToast(`Deleted pill [${pill.text}]`);
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              {/* 6. DASHBOARD SHOWCASE EDITOR */}
              {activePage === "home" && homeSection === "dashboard-showcase" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-cyan-400" /> macOS Telemetry Dashboard Showcase Config
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Section Title</label>
                      <input
                        type="text"
                        value={cms.dashboardShowcase?.sectionTitle || "KIWIK OS Kernel"}
                        onChange={(e) => {
                          useSiteCMSStore.setState({ cms: { ...cms, dashboardShowcase: { ...cms.dashboardShowcase, sectionTitle: e.target.value } } });
                          showToast("Updated section title!");
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Search Input Placeholder</label>
                      <input
                        type="text"
                        value={cms.dashboardShowcase?.searchPlaceholder || "Search projects, docs..."}
                        onChange={(e) => {
                          useSiteCMSStore.setState({ cms: { ...cms, dashboardShowcase: { ...cms.dashboardShowcase, searchPlaceholder: e.target.value } } });
                          showToast("Updated search placeholder!");
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-medium text-text-primary"
                      />
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* 7. FEATURED PRODUCTS EDITOR */}
              {activePage === "home" && homeSection === "featured-products" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Folder className="w-4 h-4 text-indigo-400" /> Featured Products Section Config
                  </h3>
                  <div className="space-y-4 pb-4 border-b border-divider">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Section Title</label>
                      <input
                        type="text"
                        value={cms.featuredSection?.title || "The Enterprise Operating System"}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateFeaturedSection({ title: e.target.value });
                          showToast("Updated featured section title!");
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Section Subtitle / Description</label>
                      <textarea
                        rows={2}
                        value={cms.featuredSection?.subtitle || "One featured platform at a time..."}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateFeaturedSection({ subtitle: e.target.value });
                          showToast("Updated featured section subtitle!");
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-medium text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted block">Projects Catalog ({projects.length})</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="p-4 rounded-xl bg-bg-secondary/60 border border-glass-border space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-text-muted block">Project Name</label>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => {
                                useProjectsStore.getState().updateProject(proj.id, { name: e.target.value });
                                showToast("Updated project name!");
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-text-muted block">Tagline / Description</label>
                            <input
                              type="text"
                              value={proj.tagline || proj.description}
                              onChange={(e) => {
                                useProjectsStore.getState().updateProject(proj.id, { tagline: e.target.value, description: e.target.value });
                                showToast("Updated tagline!");
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-medium text-text-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* 8. EARTH SECTION EDITOR */}
              {activePage === "home" && homeSection === "earth-section" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" /> Earth Telemetry Section Header & Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Headline Text</label>
                      <input
                        type="text"
                        value={cms.earthShowcase?.headline || ""}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateEarthShowcase({ headline: e.target.value });
                          showToast("Updated Earth headline!");
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Description Copy</label>
                      <textarea
                        rows={2}
                        value={cms.earthShowcase?.description || ""}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateEarthShowcase({ description: e.target.value });
                          showToast("Updated Earth description!");
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-medium text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Earth Background WebP Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cms.earthShowcase?.earthImageUrl || ""}
                          onChange={(e) => {
                            useSiteCMSStore.getState().updateEarthShowcase({ earthImageUrl: e.target.value });
                            showToast("Updated Earth background image!");
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-mono text-text-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget({
                            title: "Earth Background Image",
                            onSelect: (url) => {
                              useSiteCMSStore.getState().updateEarthShowcase({ earthImageUrl: url });
                              showToast("Linked Earth background image!");
                            }
                          })}
                          className="px-4 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-divider">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted block">Telemetry Metric Cards ({(cms.earthShowcase?.stats || []).length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {(cms.earthShowcase?.stats || []).map((st) => (
                        <div key={st.id} className="p-4 rounded-xl bg-bg-secondary border border-glass-border space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-text-muted block">Metric Value (e.g. 99.9%)</label>
                            <input
                              type="text"
                              value={st.value}
                              onChange={(e) => {
                                const updated = (cms.earthShowcase?.stats || []).map((s) => (s.id === st.id ? { ...s, value: e.target.value } : s));
                                useSiteCMSStore.getState().updateEarthShowcase({ stats: updated });
                                showToast("Updated metric value!");
                              }}
                              className="w-full px-2 py-1 rounded bg-bg-primary text-xs font-mono font-bold text-text-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-text-muted block">Metric Label</label>
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const updated = (cms.earthShowcase?.stats || []).map((s) => (s.id === st.id ? { ...s, label: e.target.value } : s));
                                useSiteCMSStore.getState().updateEarthShowcase({ stats: updated });
                                showToast("Updated metric label!");
                              }}
                              className="w-full px-2 py-1 rounded bg-bg-primary text-xs font-bold text-text-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* 9. DEVICE SHOWCASE EDITOR */}
              {activePage === "home" && homeSection === "device-showcase" && (
                <GlassCard className="p-6 space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" /> Device Showcase Cards ({(cms.deviceShowcase?.cards || []).length})
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">Configure advanced profiles, dynamic header badges, multiline copywriting, buttons, custom overlay styles, and dynamic cards blocks.</p>
                    </div>
                    <button
                      onClick={() => {
                        const id = `card-${Date.now()}`;
                        useSiteCMSStore.getState().addDeviceCard({
                          id,
                          name: "New Creator",
                          role: "Product Designer",
                          quote: "Helping founders launch zero latency products.",
                          tag: "Design",
                          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                          frameOverlayUrl: "https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048",
                          accentColor: "#3B82F6",
                          backgroundColor: "#0C0D12",
                          visible: true,
                          order: (cms.deviceShowcase?.cards || []).length + 1,
                          template: "custom",
                          blocks: [
                            {
                              id: `blk-1-${Date.now()}`,
                              type: "experience",
                              title: "Experience",
                              visible: true,
                              items: [
                                { title: "Lead Architect", subtitle: "Kiwik Studio", date: "2026 - Present", desc: "Building modular edge routers." }
                              ]
                            }
                          ]
                        });
                        setExpandedCardId(id); // immediately expand for editing
                        showToast("Created Phone card mockup!");
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Phone Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Top Badge Banner Text</label>
                      <input
                        type="text"
                        value={cms.deviceShowcase?.topBadgeText || "No Credit Card Required"}
                        onChange={(e) => {
                          useSiteCMSStore.setState({ cms: { ...cms, deviceShowcase: { ...cms.deviceShowcase, topBadgeText: e.target.value } } });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary"
                      />
                    </div>

                    <div className="space-y-4">
                      {(cms.deviceShowcase?.cards || []).map((card, cardIdx) => {
                        const isExpanded = expandedCardId === card.id;
                        return (
                          <div key={card.id} className="p-5 rounded-2xl bg-bg-secondary/40 border border-glass-border space-y-4">
                            {/* Card Header summary info */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-accent-blue/15 text-accent-blue text-xs font-mono font-bold flex items-center justify-center">
                                  #{cardIdx + 1}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                    {card.name || "Unnamed Mockup"}
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-text-secondary uppercase">
                                      {card.template || "custom"}
                                    </span>
                                  </h4>
                                  <p className="text-[10px] text-text-muted mt-0.5">{card.role || "No Role Specified"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
                                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-glass-border hover:bg-white/10 text-[10px] font-bold text-white transition-colors cursor-pointer"
                                >
                                  {isExpanded ? "Collapse Specs Editor" : "Edit Specs Editor"}
                                </button>
                                <button
                                  onClick={() => {
                                    useSiteCMSStore.getState().deleteDeviceCard(card.id);
                                    showToast(`Deleted card [${card.name}]`);
                                  }}
                                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="space-y-6 pt-2">
                                
                                {/* GENERAL SETTINGS */}
                                <div className="p-4 rounded-xl bg-black/10 border border-white/5 space-y-4">
                                  <span className="text-xs font-bold text-accent-blue uppercase tracking-wider block">1. General Configuration</span>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Display Name</label>
                                      <input
                                        type="text"
                                        value={card.name || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { name: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Job Title</label>
                                      <input
                                        type="text"
                                        value={card.jobTitle || card.role || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { jobTitle: e.target.value, role: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Company</label>
                                      <input
                                        type="text"
                                        value={card.company || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { company: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Role Badge Text</label>
                                      <input
                                        type="text"
                                        value={card.tag || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { tag: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Theme Color (Hex)</label>
                                      <input
                                        type="text"
                                        value={card.themeColor || card.backgroundColor || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { themeColor: e.target.value, backgroundColor: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Accent Color (Hex)</label>
                                      <input
                                        type="text"
                                        value={card.accentColor || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { accentColor: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Layout Template</label>
                                      <select
                                        value={card.template || "custom"}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { template: e.target.value as any })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs text-white"
                                      >
                                        <option value="custom">Custom Block Layout</option>
                                        <option value="investor">Investor Template</option>
                                        <option value="designer">Designer Template</option>
                                        <option value="pm">PM Resume Template</option>
                                        <option value="botanist">Botanist FAQ Template</option>
                                        <option value="marketer">Marketer Form Template</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Phone Size Profile</label>
                                      <select
                                        value={card.phoneSize || "medium"}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { phoneSize: e.target.value as any })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs text-white"
                                      >
                                        <option value="small">Small (0.9x scale)</option>
                                        <option value="medium">Medium (1.0x scale)</option>
                                        <option value="large">Large (1.1x scale)</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Sort Display Order</label>
                                      <input
                                        type="number"
                                        value={card.order || 0}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                      <input
                                        type="checkbox"
                                        checked={card.visible !== false}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { visible: e.target.checked })}
                                        id={`vis-${card.id}`}
                                        className="rounded accent-accent-blue"
                                      />
                                      <label htmlFor={`vis-${card.id}`} className="text-xs font-bold text-text-secondary cursor-pointer">Visible on Carousel</label>
                                    </div>
                                  </div>
                                </div>

                                {/* HEADER SETTINGS */}
                                <div className="p-4 rounded-xl bg-black/10 border border-white/5 space-y-4">
                                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">2. Header Details</span>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Profile Photo (Avatar URL)</label>
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          value={card.avatarUrl || ""}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { avatarUrl: e.target.value })}
                                          className="flex-1 px-2 py-1 rounded bg-bg-primary text-[10px] font-mono"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setMediaPickerTarget({
                                            title: `Avatar for ${card.name}`,
                                            onSelect: (url) => useSiteCMSStore.getState().updateDeviceCard(card.id, { avatarUrl: url })
                                          })}
                                          className="px-3 rounded bg-white/5 border border-glass-border hover:bg-white/10 text-[10px] text-white"
                                        >
                                          Browse
                                        </button>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Status Badge Text</label>
                                      <input
                                        type="text"
                                        value={card.statusBadge || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { statusBadge: e.target.value })}
                                        placeholder="e.g. Active Node / Available"
                                        className="w-full px-2 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 pt-2">
                                      <input
                                        type="checkbox"
                                        checked={card.onlineBadge || false}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { onlineBadge: e.target.checked })}
                                        id={`online-${card.id}`}
                                        className="rounded accent-accent-blue"
                                      />
                                      <label htmlFor={`online-${card.id}`} className="text-xs font-bold text-text-secondary cursor-pointer">Pulsing Online Green Status Dot</label>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Header Background (Hex/Gradient)</label>
                                      <input
                                        type="text"
                                        value={card.headerBackground || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { headerBackground: e.target.value })}
                                        className="w-full px-2.5 py-1 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* MAIN TITLE & TEXTS */}
                                <div className="p-4 rounded-xl bg-black/10 border border-white/5 space-y-4">
                                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">3. Large Heading & Descriptions</span>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Large Heading (Quote / Hook)</label>
                                      <textarea
                                        rows={2}
                                        value={card.quote || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { quote: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Support Subheading</label>
                                      <input
                                        type="text"
                                        value={card.supportHeading || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { supportHeading: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Card Description Copy</label>
                                      <textarea
                                        rows={2}
                                        value={card.description || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { description: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Additional Body Text (Multiline)</label>
                                      <textarea
                                        rows={2}
                                        value={card.bodyText || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { bodyText: e.target.value })}
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* PRIMARY & SECONDARY BUTTONS */}
                                <div className="p-4 rounded-xl bg-black/10 border border-white/5 space-y-4">
                                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">4. Action Triggers & Links</span>
                                  
                                  {/* Primary Button */}
                                  <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Primary Button Config</span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-text-muted block mb-1">Button Text Label</label>
                                        <input
                                          type="text"
                                          value={card.ctaText || ""}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { ctaText: e.target.value })}
                                          className="w-full px-2.5 py-1 rounded bg-bg-primary text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-text-muted block mb-1">Open Link target</label>
                                        <div className="flex gap-2">
                                          <select
                                            value={(["/", "/projects", "/docs", "/admin", "/#features", "/#capabilities", "/#how-we-work"].includes(card.buttonLink || "")) ? (card.buttonLink || "") : "custom"}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              if (val !== "custom") {
                                                useSiteCMSStore.getState().updateDeviceCard(card.id, { buttonLink: val });
                                              }
                                            }}
                                            className="px-2 py-1 rounded bg-bg-primary text-xs text-white"
                                          >
                                            <option value="/">Home (/)</option>
                                            <option value="/projects">Projects (/projects)</option>
                                            <option value="/docs">Docs (/docs)</option>
                                            <option value="/admin">Admin (/admin)</option>
                                            <option value="/#features">Features</option>
                                            <option value="/#capabilities">Capabilities</option>
                                            <option value="custom">Custom Url</option>
                                          </select>
                                          <input
                                            type="text"
                                            value={card.buttonLink || ""}
                                            onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { buttonLink: e.target.value })}
                                            className="flex-1 px-2 py-1 rounded bg-bg-primary text-[10px] font-mono"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-text-muted block mb-1">Button Icon</label>
                                        <select
                                          value={card.primaryButtonIcon || ""}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { primaryButtonIcon: e.target.value })}
                                          className="w-full px-2 py-1.5 rounded bg-bg-primary text-xs text-white"
                                        >
                                          <option value="">No Icon</option>
                                          <option value="ArrowRight">ArrowRight</option>
                                          <option value="Play">Play</option>
                                          <option value="ExternalLink">ExternalLink</option>
                                          <option value="Mail">Mail</option>
                                          <option value="Briefcase">Briefcase</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-text-muted block mb-1">Button Color override</label>
                                        <input
                                          type="text"
                                          value={card.primaryButtonColor || ""}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { primaryButtonColor: e.target.value })}
                                          placeholder="#3B82F6"
                                          className="w-full px-2.5 py-1 rounded bg-bg-primary text-xs font-mono"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-text-muted block mb-1">Button Style Shape</label>
                                        <select
                                          value={card.primaryButtonStyle || "solid"}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { primaryButtonStyle: e.target.value as any })}
                                          className="w-full px-2 py-1.5 rounded bg-bg-primary text-xs text-white"
                                        >
                                          <option value="solid">Solid Box</option>
                                          <option value="glass">Glass Transparent</option>
                                          <option value="outline">Border Outline</option>
                                        </select>
                                      </div>
                                      <div className="flex items-center gap-2 pt-4">
                                        <input
                                          type="checkbox"
                                          checked={card.primaryButtonNewTab || false}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { primaryButtonNewTab: e.target.checked })}
                                          id={`new-tab-${card.id}`}
                                          className="rounded accent-accent-blue"
                                        />
                                        <label htmlFor={`new-tab-${card.id}`} className="text-[10px] font-bold text-text-secondary cursor-pointer">Open New Tab</label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Secondary Button */}
                                  <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Secondary Button Config</span>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="checkbox"
                                          checked={card.secondaryButtonVisible || false}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { secondaryButtonVisible: e.target.checked })}
                                          id={`sec-vis-${card.id}`}
                                          className="rounded accent-accent-blue"
                                        />
                                        <label htmlFor={`sec-vis-${card.id}`} className="text-[10px] font-bold text-text-muted cursor-pointer">Activate Secondary</label>
                                      </div>
                                    </div>
                                    
                                    {card.secondaryButtonVisible && (
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                          <label className="text-[10px] font-bold text-text-muted block mb-1">Button Text</label>
                                          <input
                                            type="text"
                                            value={card.secondaryButtonLabel || ""}
                                            onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { secondaryButtonLabel: e.target.value })}
                                            className="w-full px-2.5 py-1 rounded bg-bg-primary text-xs"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[10px] font-bold text-text-muted block mb-1">Action URL</label>
                                          <input
                                            type="text"
                                            value={card.secondaryButtonLink || ""}
                                            onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { secondaryButtonLink: e.target.value })}
                                            className="w-full px-2.5 py-1 rounded bg-bg-primary text-xs font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[10px] font-bold text-text-muted block mb-1">Action Icon</label>
                                          <select
                                            value={card.secondaryButtonIcon || ""}
                                            onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { secondaryButtonIcon: e.target.value })}
                                            className="w-full px-2 py-1.5 rounded bg-bg-primary text-xs text-white"
                                          >
                                            <option value="">No Icon</option>
                                            <option value="ArrowRight">ArrowRight</option>
                                            <option value="Play">Play</option>
                                            <option value="ExternalLink">ExternalLink</option>
                                            <option value="Mail">Mail</option>
                                          </select>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* BACKGROUND DETAILS */}
                                <div className="p-4 rounded-xl bg-black/10 border border-white/5 space-y-4">
                                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">5. Screen Background Details</span>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Background Image URL</label>
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          value={card.backgroundImageUrl || ""}
                                          onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { backgroundImageUrl: e.target.value })}
                                          className="flex-1 px-2 py-1 rounded bg-bg-primary text-[10px] font-mono"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setMediaPickerTarget({
                                            title: `BG for ${card.name}`,
                                            onSelect: (url) => useSiteCMSStore.getState().updateDeviceCard(card.id, { backgroundImageUrl: url })
                                          })}
                                          className="px-3 rounded bg-white/5 border border-glass-border hover:bg-white/10 text-[10px] text-white"
                                        >
                                          Browse
                                        </button>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Gradient Overlay Style</label>
                                      <input
                                        type="text"
                                        value={card.backgroundGradient || ""}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { backgroundGradient: e.target.value })}
                                        placeholder="linear-gradient(to right, #000, #555)"
                                        className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Overlay Opacity ({(card.backgroundOverlayOpacity ?? 0) * 100}%)</label>
                                      <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={card.backgroundOverlayOpacity ?? 0}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { backgroundOverlayOpacity: parseFloat(e.target.value) })}
                                        className="w-full"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-text-muted block mb-1">Blur Amount ({card.backgroundBlur || 0}px)</label>
                                      <input
                                        type="number"
                                        value={card.backgroundBlur || 0}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { backgroundBlur: parseInt(e.target.value) || 0 })}
                                        className="w-full px-2.5 py-1 rounded bg-bg-primary text-xs"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                      <input
                                        type="checkbox"
                                        checked={card.backgroundNoise || false}
                                        onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { backgroundNoise: e.target.checked })}
                                        id={`noise-${card.id}`}
                                        className="rounded accent-accent-blue"
                                      />
                                      <label htmlFor={`noise-${card.id}`} className="text-[10px] font-bold text-text-secondary cursor-pointer">Activate Noise Texture</label>
                                    </div>
                                  </div>
                                </div>

                                {/* PROFILE PHOTO METADATA */}
                                <div className="p-4 rounded-xl bg-black/10 border border-white/5 space-y-3">
                                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">6. Profile Image Metadata</span>
                                  <div>
                                    <label className="text-[10px] font-bold text-text-muted block mb-1">Image Alt Text (SEO)</label>
                                    <input
                                      type="text"
                                      value={card.profileAltText || ""}
                                      onChange={(e) => useSiteCMSStore.getState().updateDeviceCard(card.id, { profileAltText: e.target.value })}
                                      placeholder="A description of the image asset for screen readers."
                                      className="w-full px-2.5 py-1.5 rounded bg-bg-primary text-xs text-text-primary"
                                    />
                                  </div>
                                </div>

                                {/* DYNAMIC CONTENT BLOCKS MANAGER */}
                                <div className="p-4 rounded-xl bg-black/10 border border-white/5 space-y-4">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">7. Dynamic Content Blocks</span>
                                    <select
                                      onChange={(e) => {
                                        const type = e.target.value;
                                        if (!type) return;
                                        const newBlock = {
                                          id: `blk-${Date.now()}`,
                                          type: type as any,
                                          title: type.toUpperCase(),
                                          visible: true,
                                          items: []
                                        };
                                        const updated = [...(card.blocks || []), newBlock];
                                        useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updated });
                                        e.target.value = "";
                                        showToast(`Added block [${type}]`);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer focus:outline-none"
                                    >
                                      <option value="">+ Add Block...</option>
                                      <option value="resume">Resume Block</option>
                                      <option value="experience">Experience Block</option>
                                      <option value="projects">Projects Block</option>
                                      <option value="testimonial">Testimonial Block</option>
                                      <option value="faq">FAQ Block</option>
                                      <option value="socials">Social Links</option>
                                      <option value="form">Contact Form</option>
                                      <option value="skills">Skills Block</option>
                                      <option value="stats">Statistics Block</option>
                                    </select>
                                  </div>

                                  <div className="space-y-3">
                                    {(card.blocks || []).map((block, bIdx) => (
                                      <div key={block.id} className="p-4 rounded-xl bg-bg-primary/40 border border-glass-border space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-neutral-400">{block.type}</span>
                                            <input
                                              type="text"
                                              value={block.title || ""}
                                              onChange={(e) => {
                                                const updated = (card.blocks || []).map((b) => b.id === block.id ? { ...b, title: e.target.value } : b);
                                                useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updated });
                                              }}
                                              placeholder="Block Title"
                                              className="text-xs font-bold text-white bg-transparent border-b border-transparent focus:border-white/20 focus:outline-none max-w-[150px]"
                                            />
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <button
                                              onClick={() => {
                                                if (bIdx > 0) {
                                                  const updated = [...(card.blocks || [])];
                                                  const temp = updated[bIdx];
                                                  updated[bIdx] = updated[bIdx - 1];
                                                  updated[bIdx - 1] = temp;
                                                  useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updated });
                                                }
                                              }}
                                              className="p-1 rounded bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
                                            >
                                              <ChevronUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => {
                                                if (bIdx < (card.blocks || []).length - 1) {
                                                  const updated = [...(card.blocks || [])];
                                                  const temp = updated[bIdx];
                                                  updated[bIdx] = updated[bIdx + 1];
                                                  updated[bIdx + 1] = temp;
                                                  useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updated });
                                                }
                                              }}
                                              className="p-1 rounded bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
                                            >
                                              <ChevronDown className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => {
                                                const newBlock = { ...block, id: `blk-${Date.now()}` };
                                                const updated = [...(card.blocks || []), newBlock];
                                                useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updated });
                                                showToast("Duplicated block!");
                                              }}
                                              className="p-1 rounded bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
                                            >
                                              <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => {
                                                const updated = (card.blocks || []).filter((b) => b.id !== block.id);
                                                useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updated });
                                                showToast("Deleted block!");
                                              }}
                                              className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>

                                        {block.type !== "form" && (
                                          <div className="space-y-2 pl-2 border-l border-white/5">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] font-mono text-text-muted">Block Items ({(block.items || []).length})</span>
                                              <button
                                                onClick={() => {
                                                  const newItem = { title: "New Sub-item", subtitle: "", desc: "", date: "" };
                                                  const updatedItems = [...(block.items || []), newItem];
                                                  const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                  useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                }}
                                                className="text-[9px] font-bold text-accent-blue hover:underline cursor-pointer"
                                              >
                                                + Add Item
                                              </button>
                                            </div>

                                            <div className="space-y-2">
                                              {(block.items || []).map((item, itemIdx) => (
                                                <div key={itemIdx} className="p-2.5 rounded bg-bg-secondary/40 border border-white/5 space-y-1.5">
                                                  <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                      <input
                                                        type="text"
                                                        value={item.title}
                                                        placeholder="Item Title"
                                                        onChange={(e) => {
                                                          const updatedItems = (block.items || []).map((it, idx) => idx === itemIdx ? { ...it, title: e.target.value } : it);
                                                          const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                          useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                        }}
                                                        className="w-full px-2 py-1 rounded bg-bg-primary text-[10px] text-white"
                                                      />
                                                    </div>
                                                    <div>
                                                      <input
                                                        type="text"
                                                        value={item.subtitle || ""}
                                                        placeholder="Subtitle / Label"
                                                        onChange={(e) => {
                                                          const updatedItems = (block.items || []).map((it, idx) => idx === itemIdx ? { ...it, subtitle: e.target.value } : it);
                                                          const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                          useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                        }}
                                                        className="w-full px-2 py-1 rounded bg-bg-primary text-[10px] text-white"
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                      <input
                                                        type="text"
                                                        value={item.date || ""}
                                                        placeholder="Date Info (e.g. 2026)"
                                                        onChange={(e) => {
                                                          const updatedItems = (block.items || []).map((it, idx) => idx === itemIdx ? { ...it, date: e.target.value } : it);
                                                          const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                          useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                        }}
                                                        className="w-full px-2 py-1 rounded bg-bg-primary text-[10px] text-white"
                                                      />
                                                    </div>
                                                    {block.type === "socials" ? (
                                                      <div>
                                                        <select
                                                          value={item.iconName || "Globe"}
                                                          onChange={(e) => {
                                                            const updatedItems = (block.items || []).map((it, idx) => idx === itemIdx ? { ...it, iconName: e.target.value } : it);
                                                            const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                            useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                          }}
                                                          className="w-full px-2 py-1 rounded bg-bg-primary text-[10px] text-white focus:outline-none"
                                                        >
                                                          <option value="Globe">Globe</option>
                                                          <option value="MessageSquare">MessageSquare</option>
                                                          <option value="Share2">Share2</option>
                                                          <option value="Send">Send</option>
                                                          <option value="Lock">Lock</option>
                                                          <option value="Github">Github</option>
                                                          <option value="Twitter">Twitter</option>
                                                          <option value="Linkedin">Linkedin</option>
                                                        </select>
                                                      </div>
                                                    ) : (
                                                      <div>
                                                        <input
                                                          type="text"
                                                          value={item.link || ""}
                                                          placeholder="Action Link URL"
                                                          onChange={(e) => {
                                                            const updatedItems = (block.items || []).map((it, idx) => idx === itemIdx ? { ...it, link: e.target.value } : it);
                                                            const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                            useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                          }}
                                                          className="w-full px-2 py-1 rounded bg-bg-primary text-[10px] text-white"
                                                        />
                                                      </div>
                                                    )}
                                                  </div>

                                                  <div>
                                                    <textarea
                                                      rows={1}
                                                      value={item.desc || ""}
                                                      placeholder="Detailed Item Copy"
                                                      onChange={(e) => {
                                                        const updatedItems = (block.items || []).map((it, idx) => idx === itemIdx ? { ...it, desc: e.target.value } : it);
                                                        const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                        useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                      }}
                                                      className="w-full px-2 py-1 rounded bg-bg-primary text-[10px] text-white"
                                                    />
                                                  </div>

                                                  <div className="flex justify-end pt-1">
                                                    <button
                                                      onClick={() => {
                                                        const updatedItems = (block.items || []).filter((_, idx) => idx !== itemIdx);
                                                        const updatedBlocks = (card.blocks || []).map((b) => b.id === block.id ? { ...b, items: updatedItems } : b);
                                                        useSiteCMSStore.getState().updateDeviceCard(card.id, { blocks: updatedBlocks });
                                                      }}
                                                      className="text-[9px] text-rose-500 hover:underline cursor-pointer"
                                                    >
                                                      Delete Item
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* 10. CAPABILITIES EDITOR */}
              {activePage === "home" && homeSection === "capabilities" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" /> Capabilities Grid Manager ({(cms.capabilities?.items || []).length})
                    </h3>
                    <button
                      onClick={() => {
                        const updated = [...(cms.capabilities?.items || []), { id: `cap-${Date.now()}`, title: "New Enterprise Capability", desc: "Configure high-throughput nodes and custom APIs instantly.", iconName: "Cpu" }];
                        useSiteCMSStore.getState().updateCapabilities({ items: updated });
                        showToast("Added new capability card. Edit inline below!");
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Capability
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(cms.capabilities?.items || []).map((cap) => (
                      <div key={cap.id} className="p-4 rounded-xl bg-bg-secondary/60 border border-glass-border space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={cap.title}
                            onChange={(e) => {
                              const updated = (cms.capabilities?.items || []).map((c) => (c.id === cap.id ? { ...c, title: e.target.value } : c));
                              useSiteCMSStore.getState().updateCapabilities({ items: updated });
                              showToast("Updated title!");
                            }}
                            className="w-full font-bold text-xs text-text-primary bg-transparent focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const updated = (cms.capabilities?.items || []).filter((c) => c.id !== cap.id);
                              useSiteCMSStore.getState().updateCapabilities({ items: updated });
                              showToast(`Deleted capability [${cap.title}]`);
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block">Description Copy</label>
                          <textarea
                            rows={2}
                            value={cap.desc}
                            onChange={(e) => {
                              const updated = (cms.capabilities?.items || []).map((c) => (c.id === cap.id ? { ...c, desc: e.target.value } : c));
                              useSiteCMSStore.getState().updateCapabilities({ items: updated });
                              showToast("Updated description!");
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-bg-secondary border border-glass-border text-xs text-text-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* 11. HOW WE WORK EDITOR */}
              {activePage === "home" && homeSection === "how-we-work" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-accent-blue" /> Workflow Timeline Steps Builder ({(cms.howWeWork?.steps || []).length})
                    </h3>
                    <button
                      onClick={() => {
                        const stepNum = String((cms.howWeWork?.steps || []).length + 1);
                        const updated = [...(cms.howWeWork?.steps || []), { id: `step-${Date.now()}`, step: stepNum, title: `Phase ${stepNum}: Development Node`, desc: "We launch standard and secure micro-services within 15 minutes of staging approval.", duration: "15 mins", iconName: "Cpu" }];
                        useSiteCMSStore.getState().updateHowWeWork({ steps: updated });
                        showToast("Added new timeline phase step. Edit inline below!");
                      }}
                      className="px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Step
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(cms.howWeWork?.steps || []).map((step) => (
                      <div key={step.id} className="p-4 rounded-xl bg-bg-secondary border border-glass-border space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-mono font-bold text-accent-blue">Step #{step.step}</span>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const updated = (cms.howWeWork?.steps || []).map((s) => (s.id === step.id ? { ...s, title: e.target.value } : s));
                                useSiteCMSStore.getState().updateHowWeWork({ steps: updated });
                                showToast("Updated step title!");
                              }}
                              className="font-bold text-xs text-text-primary bg-transparent focus:outline-none flex-1"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const updated = (cms.howWeWork?.steps || []).filter((s) => s.id !== step.id);
                              useSiteCMSStore.getState().updateHowWeWork({ steps: updated });
                              showToast(`Deleted step [${step.title}]`);
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-text-muted block">Step Description</label>
                          <textarea
                            rows={2}
                            value={step.desc}
                            onChange={(e) => {
                              const updated = (cms.howWeWork?.steps || []).map((s) => (s.id === step.id ? { ...s, desc: e.target.value } : s));
                              useSiteCMSStore.getState().updateHowWeWork({ steps: updated });
                              showToast("Updated step description!");
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-bg-primary text-xs text-text-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* 12. TRUST SECTION EDITOR */}
              {activePage === "home" && homeSection === "trust" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Trust Section Badges & Metrics ({(cms.trust?.items || []).length})
                    </h3>
                    <button
                      onClick={() => {
                        const updated = [...(cms.trust?.items || []), { id: `t-${Date.now()}`, title: "100%", desc: "Production Uptime SLA", icon: "Shield" }];
                        useSiteCMSStore.getState().updateTrust({ items: updated });
                        showToast("Added new trust metric card. Edit inline below!");
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Metric
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {(cms.trust?.items || []).map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-bg-secondary border border-glass-border space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = (cms.trust?.items || []).map((t) => (t.id === item.id ? { ...t, title: e.target.value } : t));
                              useSiteCMSStore.getState().updateTrust({ items: updated });
                              showToast("Updated metric title!");
                            }}
                            className="font-bold text-sm font-mono text-text-primary bg-transparent focus:outline-none w-full"
                          />
                          <button
                            onClick={() => {
                              const updated = (cms.trust?.items || []).filter((t) => t.id !== item.id);
                              useSiteCMSStore.getState().updateTrust({ items: updated });
                              showToast(`Deleted trust item [${item.title}]`);
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted block">Subtitle / Description</label>
                          <input
                            type="text"
                            value={item.desc}
                            onChange={(e) => {
                              const updated = (cms.trust?.items || []).map((t) => (t.id === item.id ? { ...t, desc: e.target.value } : t));
                              useSiteCMSStore.getState().updateTrust({ items: updated });
                              showToast("Updated metric description!");
                            }}
                            className="w-full px-2 py-1 rounded bg-bg-primary text-xs text-text-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* 13. NEWSLETTER EDITOR */}
              {activePage === "home" && homeSection === "newsletter" && (
                <GlassCard className="p-6 space-y-5 text-left max-w-xl">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" /> Newsletter Subscription Config
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Newsletter Headline</label>
                      <input
                        type="text"
                        value={cms.footer?.newsletterHeadline || "Stay in the Loop"}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateFooter({ newsletterHeadline: e.target.value });
                          showToast("Updated newsletter headline!");
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Newsletter Description Copy</label>
                      <textarea
                        rows={2}
                        value={cms.footer?.newsletterDescription || "Get product updates, launch notes, and insights directly in your inbox."}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateFooter({ newsletterDescription: e.target.value });
                          showToast("Updated newsletter description!");
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-medium text-text-primary"
                      />
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* 14. FOOTER EDITOR */}
              {(homeSection === "footer" || activePage === "footer-page") && (
                <GlassCard className="p-6 space-y-6 text-left">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent-blue" /> Footer Layout & Details Editor
                  </h3>
                  
                  {/* Brand logo & Copyright */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/5 pb-4">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Footer Brand Logo Text</label>
                      <input
                        type="text"
                        value={cms.footer?.logoText || "Kiwik"}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateFooter({ logoText: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-bold text-text-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Copyright Text Notice</label>
                      <input
                        type="text"
                        value={cms.footer?.copyrightText || "© 2026 Kiwik. All rights reserved."}
                        onChange={(e) => {
                          useSiteCMSStore.getState().updateFooter({ copyrightText: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold text-text-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Status Badge Indicator</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cms.footer?.statusBadgeText || "All Systems Operational"}
                          onChange={(e) => {
                            useSiteCMSStore.getState().updateFooter({ statusBadgeText: e.target.value });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-text-primary"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={cms.footer?.statusBadgeVisible !== false}
                            onChange={(e) => {
                              useSiteCMSStore.getState().updateFooter({ statusBadgeVisible: e.target.checked });
                            }}
                            id="status-visible"
                            className="rounded accent-accent-blue"
                          />
                          <label htmlFor="status-visible" className="text-[10px] font-bold text-text-muted cursor-pointer">
                            Visible
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columns links */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted block">
                      Footer Column Links Manager
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {(cms.footer?.columns || []).map((col) => (
                        <div key={col.id} className="p-4 rounded-xl bg-bg-secondary border border-glass-border space-y-3">
                          <input
                            type="text"
                            value={col.title}
                            onChange={(e) => {
                              const updated = (cms.footer?.columns || []).map((c) => (c.id === col.id ? { ...c, title: e.target.value } : c));
                              useSiteCMSStore.getState().updateFooter({ columns: updated });
                              showToast("Updated column title!");
                            }}
                            className="text-xs font-bold text-text-primary bg-transparent border-b border-divider pb-1 w-full focus:outline-none"
                          />
                          <div className="space-y-2">
                            {col.links.map((lnk) => (
                              <div key={lnk.id} className="space-y-1">
                                <input
                                  type="text"
                                  value={lnk.label}
                                  onChange={(e) => {
                                    const updatedCols = (cms.footer?.columns || []).map((c) => {
                                      if (c.id !== col.id) return c;
                                      const updatedLinks = c.links.map((l) => (l.id === lnk.id ? { ...l, label: e.target.value } : l));
                                      return { ...c, links: updatedLinks };
                                    });
                                    useSiteCMSStore.getState().updateFooter({ columns: updatedCols });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-bg-primary text-[11px] font-semibold text-text-primary"
                                />
                                <input
                                  type="text"
                                  value={lnk.href}
                                  onChange={(e) => {
                                    const updatedCols = (cms.footer?.columns || []).map((c) => {
                                      if (c.id !== col.id) return c;
                                      const updatedLinks = c.links.map((l) => (l.id === lnk.id ? { ...l, href: e.target.value } : l));
                                      return { ...c, links: updatedLinks };
                                    });
                                    useSiteCMSStore.getState().updateFooter({ columns: updatedCols });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-bg-primary text-[10px] font-mono text-text-secondary"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* OTHER PAGES: PROJECTS PAGE EDITOR */}
              {activePage === "projects-page" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Folder className="w-4 h-4 text-accent-blue" /> Projects Directory Catalog Page Editor
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Catalog Page Title</label>
                    <input type="text" defaultValue="Kiwik Engineering Showcase" className="w-full px-3 py-2 rounded-xl bg-bg-secondary text-xs font-bold" />
                  </div>
                </GlassCard>
              )}

              {/* OTHER PAGES: PROJECT DETAILS BUILDER */}
              {activePage === "project-detail" && (
                <GlassCard className="p-6 space-y-5 text-left">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent-blue" /> Project Detail Page Template & Specs Builder
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Default Template Tabs</label>
                      <input type="text" defaultValue="Overview, Screenshots, Tech Stack, README, FAQs" className="w-full px-3 py-2 rounded-xl bg-bg-secondary text-xs font-mono" />
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* OTHER PAGES: ABOUT / CONTACT / 404 */}
              {activePage === "about" && (
                <GlassCard className="p-6 space-y-4 text-left">
                  <h3 className="text-base font-bold text-text-primary">About Page Mission & Values</h3>
                  <textarea rows={4} defaultValue="Kiwik is the enterprise operating system for modern software products." className="w-full p-3 rounded-xl bg-bg-secondary text-xs font-medium" />
                </GlassCard>
              )}

              {activePage === "contact" && (
                <GlassCard className="p-6 space-y-4 text-left">
                  <h3 className="text-base font-bold text-text-primary">Contact Page Details</h3>
                  <input type="text" defaultValue={cms.settings.contactEmail} className="w-full px-3 py-2 rounded-xl bg-bg-secondary text-xs font-mono" />
                </GlassCard>
              )}

              {activePage === "404" && (
                <GlassCard className="p-6 space-y-4 text-left">
                  <h3 className="text-base font-bold text-text-primary">404 Error Page Copy</h3>
                  <input type="text" defaultValue="404 - System Route Not Found" className="w-full px-3 py-2 rounded-xl bg-bg-secondary text-xs font-bold" />
                </GlassCard>
              )}

            </div>
          )}

          {/* MEDIA LIBRARY TAB */}
          {mainTab === "media" && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-accent-blue" /> Digital Asset Management (DAM) Library ({cms.media.length})
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">Upload, crop, replace, and check usage locations of website images, logos, and videos.</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddMediaForm(!showAddMediaForm);
                  }}
                  className="px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" /> {showAddMediaForm ? "Cancel Upload" : "Upload New Asset"}
                </button>
              </div>

              {/* Inline Upload Form */}
              {showAddMediaForm && (
                <GlassCard className="p-5 space-y-4">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Configure Image Metadata & Link</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-text-muted block mb-1">Asset Name</label>
                      <input
                        type="text"
                        value={newMediaName}
                        onChange={(e) => setNewMediaName(e.target.value)}
                        placeholder="e.g. Profile Photo Leslie"
                        className="w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-muted block mb-1">Image Asset Link / URL (Unsplash or local path)</label>
                      <input
                        type="text"
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowAddMediaForm(false);
                        setNewMediaName("");
                        setNewMediaUrl("");
                      }}
                      className="px-4 py-1.5 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newMediaName && newMediaUrl) {
                          addMediaItem({
                            id: `med-${Date.now()}`,
                            name: newMediaName,
                            url: newMediaUrl,
                            type: "image",
                            sizeBytes: 18400,
                            mimeType: "image/png",
                            folder: "General",
                            tags: ["asset"],
                            usedIn: ["Hero Section", "Public Navbar"],
                            createdAt: new Date().toISOString()
                          });
                          showToast(`Uploaded Asset [${newMediaName}] to Library`);
                          setNewMediaName("");
                          setNewMediaUrl("");
                          setShowAddMediaForm(false);
                        } else {
                          showToast("Please enter both Name and Image URL!");
                        }
                      }}
                      className="px-4 py-1.5 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Save Asset
                    </button>
                  </div>
                </GlassCard>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cms.media.map((med) => (
                  <GlassCard key={med.id} className="p-3 space-y-2.5 flex flex-col justify-between group relative">
                    <div className="h-28 w-full rounded-xl bg-black/40 overflow-hidden flex items-center justify-center border border-white/10 relative">
                      <img src={med.url} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-left space-y-1">
                      <div>
                        <label className="text-[8px] font-bold text-text-muted block uppercase">Asset Name</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => {
                            const updated = cms.media.map((m) => (m.id === med.id ? { ...m, name: e.target.value } : m));
                            useSiteCMSStore.setState({ cms: { ...cms, media: updated } });
                          }}
                          className="w-full text-xs font-bold text-text-primary bg-transparent focus:outline-none border-b border-transparent focus:border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-text-muted block uppercase">Image Link / URL</label>
                        <input
                          type="text"
                          value={med.url}
                          onChange={(e) => {
                            const updated = cms.media.map((m) => (m.id === med.id ? { ...m, url: e.target.value } : m));
                            useSiteCMSStore.setState({ cms: { ...cms, media: updated } });
                          }}
                          className="w-full text-[9px] font-mono text-text-muted bg-transparent focus:outline-none border-b border-transparent focus:border-white/10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-divider">
                      <span className="text-[9px] text-text-muted">{med.mimeType.split("/")[1]}</span>
                      <button
                        onClick={() => {
                          deleteMediaItem(med.id);
                          showToast(`Deleted media [${med.name}]`);
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {mainTab === "projects" && (
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-glass-bg border border-glass-border">
                <div>
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Folder className="w-4 h-4 text-accent-blue" /> Central Projects Catalog ({projects.length})
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">Manage modular products, codebases, cover assets, status indicators, and deployment paths.</p>
                </div>
                <button
                  onClick={() => {
                    const slug = `project-${Date.now()}`;
                    const newProj = {
                      ...emptyProject,
                      id: slug,
                      slug,
                      name: "New Kiwik Project",
                      tagline: "High-performance modular service node.",
                      description: "Detailed system architecture parameters and specifications will be updated here.",
                      status: "in-progress" as const,
                      category: "web" as const,
                      lastUpdated: new Date().toISOString().split("T")[0]
                    };
                    addProject(newProj);
                    setEditingProject(newProj);
                    showToast("Created project catalog card! Opening editor specs...");
                  }}
                  className="px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((proj) => (
                  <GlassCard key={proj.id} className="p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-text-primary">{proj.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold uppercase">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{proj.tagline || proj.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-divider">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                        }}
                        className="text-xs font-bold text-accent-blue flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Specs
                      </button>
                      <button
                        onClick={() => {
                          deleteProject(proj.id);
                          showToast(`Deleted project [${proj.name}]`);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTATION TAB */}
          {mainTab === "documentation" && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" /> Documentation Categories & Articles
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">Manage docs sidebar categories, article markdown content, and playgrounds.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {docsCategories.map((cat) => (
                  <GlassCard key={cat.id} className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-divider pb-3">
                      <h4 className="text-sm font-bold text-text-primary">{cat.name}</h4>
                      <span className="text-[10px] font-mono font-bold text-accent-blue">{cat.articles.length} Articles</span>
                    </div>

                    <div className="space-y-2">
                      {cat.articles.map((art) => (
                        <div key={art.id} className="p-3 rounded-xl bg-bg-secondary/60 border border-glass-border flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-text-primary">{art.title}</div>
                            <div className="text-[10px] font-mono text-text-muted">/docs?slug={art.slug}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* AI ASSISTANT TAB */}
          {mainTab === "ai" && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border space-y-2">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent-blue" /> AI Assistant Knowledge Collections
                </h3>
                <p className="text-xs text-text-secondary">Upload markdown, repository specs, and knowledge articles for real-time prompt reasoning.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(cms.aiKnowledge?.articles || []).map((art) => (
                  <GlassCard key={art.id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-text-primary">{art.title}</h4>
                      <span className="text-[10px] font-mono text-accent-blue uppercase font-bold">{art.category}</span>
                    </div>
                    <textarea
                      rows={4}
                      value={art.content}
                      onChange={(e) => {
                        useSiteCMSStore.getState().updateAiKnowledgeArticle(art.id, { content: e.target.value });
                        showToast("Updated knowledge content!");
                      }}
                      className="w-full p-3 rounded-xl bg-bg-secondary border border-glass-border text-xs font-mono leading-relaxed"
                    />
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {mainTab === "analytics" && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border space-y-2">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Real-time Analytics & Search Telemetry
                </h3>
                <p className="text-xs text-text-secondary">Tracks visitor activity, command palette searches, project clicks, and country breakdown.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-5 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Top Search Queries</h4>
                  <div className="space-y-2">
                    {(cms.analytics?.searches || []).map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-bg-secondary text-xs">
                        <span className="font-mono font-bold text-text-primary">{s.query}</span>
                        <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue font-mono font-bold text-[10px]">{s.count} searches</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-5 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Project Clicks Leaderboard</h4>
                  <div className="space-y-2">
                    {Object.entries(cms.analytics?.projectClicks || {}).map(([slug, count], i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-bg-secondary text-xs">
                        <span className="font-mono font-bold text-text-primary">/projects/{slug}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">{count} clicks</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-5 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Visitor Geographic Breakdown</h4>
                  <div className="space-y-2">
                    {(cms.analytics?.countryBreakdown || []).map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-bg-secondary text-xs">
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span className="font-bold text-text-primary">{c.country}</span>
                        </div>
                        <span className="font-mono text-text-secondary text-[11px] font-semibold">{c.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {mainTab === "users" && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border space-y-2">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" /> User Permissions & Role Governance
                </h3>
                <p className="text-xs text-text-secondary">Assign granular roles (Owner, Admin, Editor, Developer, Viewer).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Vivek Shaganti", role: "Owner", email: "shagantivivekgoud@gmail.com" },
                  { name: "Sarah Lin", role: "Admin", email: "sarah@kiwik.io" },
                  { name: "Alex Mercer", role: "Developer", email: "alex@kiwik.io" }
                ].map((usr, i) => (
                  <GlassCard key={i} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-text-primary">{usr.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue font-mono font-bold text-[10px]">{usr.role}</span>
                    </div>
                    <div className="text-xs font-mono text-text-secondary">{usr.email}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {mainTab === "appearance" && (
            <GlassCard className="p-6 space-y-5 text-left max-w-2xl">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-400" /> Theme System & Design Engine
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Color Theme Mode</label>
                  <select
                    value={cms.theme.mode}
                    onChange={(e) => {
                      updateTheme({ mode: e.target.value as any });
                      showToast("Updated theme mode!");
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-bg-secondary text-xs font-bold"
                  >
                    <option value="system">System Default</option>
                    <option value="dark">Dark Mode</option>
                    <option value="light">Light Mode</option>
                  </select>
                </div>
              </div>
            </GlassCard>
          )}

          {/* SETTINGS TAB */}
          {mainTab === "settings" && (
            <GlassCard className="p-6 space-y-5 text-left max-w-2xl">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Settings className="w-4 h-4 text-accent-blue" /> Website Branding & General Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Site Title</label>
                  <input
                    type="text"
                    value={cms.settings.siteName}
                    onChange={(e) => {
                      updateSettings({ siteName: e.target.value });
                      showToast("Updated site name!");
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Contact Email</label>
                  <input
                    type="text"
                    value={cms.settings.contactEmail}
                    onChange={(e) => {
                      updateSettings({ contactEmail: e.target.value });
                      showToast("Updated contact email!");
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs font-mono"
                  />
                </div>
              </div>
            </GlassCard>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MEDIA ASSET LIBRARY DAM PICKER MODAL (Glassmorphism Modal UI)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mediaPickerTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-[#0d0f13] border border-white/10 rounded-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl text-left"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-accent-blue animate-pulse-slow" /> Media Library Assets DAM Picker
                  </h3>
                  <p className="text-[10px] text-text-secondary mt-0.5">
                    Selecting asset link for: <span className="text-accent-blue font-bold">{mediaPickerTarget.title}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setMediaPickerTarget(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Subheader: Search, Folders & Quick Add */}
              <div className="p-4 bg-black/20 border-b border-white/5 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <input 
                      type="text"
                      placeholder="Search assets by name..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent-blue"
                    />
                  </div>

                  {/* Quick Add Asset Option */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPickerAddForm(!showPickerAddForm)}
                      className="px-4 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> {showPickerAddForm ? "Cancel Add" : "Upload File"}
                    </button>
                  </div>
                </div>

                {/* Inline form inside picker */}
                {showPickerAddForm && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block mb-1">Asset Name</label>
                        <input
                          type="text"
                          value={newPickerAssetName}
                          onChange={(e) => setNewPickerAssetName(e.target.value)}
                          placeholder="e.g. Logo Icon"
                          className="w-full px-2.5 py-1.5 rounded bg-bg-primary border border-glass-border text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary block mb-1">Image Link / URL</label>
                        <input
                          type="text"
                          value={newPickerAssetUrl}
                          onChange={(e) => setNewPickerAssetUrl(e.target.value)}
                          placeholder="e.g. /logo.png"
                          className="w-full px-2.5 py-1.5 rounded bg-bg-primary border border-glass-border text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (newPickerAssetName && newPickerAssetUrl) {
                            addMediaItem({
                              id: `med-${Date.now()}`,
                              name: newPickerAssetName,
                              url: newPickerAssetUrl,
                              type: "image",
                              sizeBytes: 15400,
                              mimeType: "image/png",
                              folder: "General",
                              tags: ["uploaded"],
                              usedIn: ["Media Picker"],
                              createdAt: new Date().toISOString()
                            });
                            showToast(`Uploaded Asset [${newPickerAssetName}] to Library`);
                            setNewPickerAssetName("");
                            setNewPickerAssetUrl("");
                            setShowPickerAddForm(false);
                          } else {
                            showToast("Please fill in both Name and URL fields.");
                          }
                        }}
                        className="px-4 py-1.5 rounded-xl bg-accent-blue text-xs text-white font-bold cursor-pointer"
                      >
                        Save Asset
                      </button>
                    </div>
                  </div>
                )}

                {/* Folder filter chips */}
                <div className="flex flex-wrap gap-1.5">
                  {["all", "Avatars", "Logos", "Banners", "General"].map((folder) => (
                    <button
                      key={folder}
                      onClick={() => setPickerFolder(folder)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer",
                        pickerFolder === folder
                          ? "bg-accent-blue text-white"
                          : "bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white"
                      )}
                    >
                      {folder}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of assets */}
              <div className="flex-1 overflow-y-auto p-5 no-scrollbar min-h-[300px]">
                {(() => {
                  const items = (cms.media || []).filter((med) => {
                    const matchesSearch = med.name.toLowerCase().includes(pickerSearch.toLowerCase());
                    const matchesFolder = pickerFolder === "all" || med.folder === pickerFolder;
                    return matchesSearch && matchesFolder;
                  });

                  if (items.length === 0) {
                    return (
                      <div className="h-48 flex flex-col items-center justify-center text-text-muted space-y-2">
                        <ImageIcon className="w-8 h-8 opacity-40 animate-pulse-slow" />
                        <span className="text-xs font-bold">No assets found in library</span>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {items.map((med) => (
                        <div 
                          key={med.id}
                          onClick={() => {
                            mediaPickerTarget.onSelect(med.url);
                            setMediaPickerTarget(null);
                            showToast(`Linked image to [${med.name}]`);
                          }}
                          className="p-2 bg-white/5 border border-white/10 hover:border-accent-blue/60 rounded-2xl cursor-pointer group flex flex-col justify-between space-y-2 transition-all hover:bg-white/[0.08]"
                        >
                          <div className="h-20 w-full rounded-xl bg-black/40 overflow-hidden flex items-center justify-center border border-white/5 relative">
                            <img 
                              src={med.url} 
                              alt={med.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-[10px] font-bold text-white truncate group-hover:text-accent-blue transition-colors">
                              {med.name}
                            </div>
                            <div className="text-[8px] font-mono text-text-muted truncate">
                              {med.folder} • {med.mimeType.split("/")[1]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="p-4 bg-black/25 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-mono">
                  Double-click or click to insert.
                </span>
                <button
                  onClick={() => setMediaPickerTarget(null)}
                  className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROJECT SPECS DIALOG MODAL */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-[#0d0f13] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-left"
            >
              {/* Header */}
              <div className="p-5 bg-black/20 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Project Catalog Specifications</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">ID: {editingProject.id}</p>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Form */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted block mb-1">Project Name</label>
                    <input
                      type="text"
                      value={editingProject.name}
                      onChange={(e) => {
                        const updated = { ...editingProject, name: e.target.value };
                        setEditingProject(updated);
                        updateProject(editingProject.id, updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-muted block mb-1">Project Slug</label>
                    <input
                      type="text"
                      value={editingProject.slug}
                      onChange={(e) => {
                        const updated = { ...editingProject, slug: e.target.value };
                        setEditingProject(updated);
                        updateProject(editingProject.id, updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingProject.tagline || ""}
                    onChange={(e) => {
                      const updated = { ...editingProject, tagline: e.target.value };
                      setEditingProject(updated);
                      updateProject(editingProject.id, updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => {
                      const updated = { ...editingProject, description: e.target.value };
                      setEditingProject(updated);
                      updateProject(editingProject.id, updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted block mb-1">Status</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) => {
                        const updated = { ...editingProject, status: e.target.value as any };
                        setEditingProject(updated);
                        updateProject(editingProject.id, updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#111318] border border-glass-border text-xs text-white"
                    >
                      <option value="active">Active / Operational</option>
                      <option value="in-progress">In Development</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-muted block mb-1">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => {
                        const updated = { ...editingProject, category: e.target.value as any };
                        setEditingProject(updated);
                        updateProject(editingProject.id, updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#111318] border border-glass-border text-xs text-white"
                    >
                      <option value="web">Web Application</option>
                      <option value="mobile">Mobile App</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="design">Design Brand</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted block mb-1">Project Icon (Lucide)</label>
                    <input
                      type="text"
                      value={editingProject.icon || ""}
                      onChange={(e) => {
                        const updated = { ...editingProject, icon: e.target.value };
                        setEditingProject(updated);
                        updateProject(editingProject.id, updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-muted block mb-1">Cover Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingProject.coverImage || ""}
                        onChange={(e) => {
                          const updated = { ...editingProject, coverImage: e.target.value };
                          setEditingProject(updated);
                          updateProject(editingProject.id, updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-bg-primary border border-glass-border text-xs text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget({
                          title: `Cover for ${editingProject.name}`,
                          onSelect: (url) => {
                            const updated = { ...editingProject, coverImage: url };
                            setEditingProject(updated);
                            updateProject(editingProject.id, updated);
                          }
                        })}
                        className="px-3 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 text-xs text-white font-bold cursor-pointer"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-black/20 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    showToast("Saved project specifications!");
                  }}
                  className="px-5 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                >
                  Save & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Auxiliary BookOpenIcon helper
function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
