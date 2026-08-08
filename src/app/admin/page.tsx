"use client";

import * as LucideIcons from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectImage } from "@/components/ui/project-image";
import { QuickAction, TimelineEntry, Contributor, ProjectImage as ProjectImageInterface } from "@/types";
import {
  Plus,
  ArrowUp,
  ArrowLeft,
  ArrowDown,
  ArrowRight,
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
  Camera,
  Image as ImageIcon,
  Check,
  Eye,
  Star,
  LayoutDashboard,
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  LogOut,
  Lock,
  Mail,
  Key,
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
  UserCheck,
  Folder,
  MousePointer,
  Cpu,
  Share2,
  FileCode,
  MessageSquare,
  BarChart3,
  Globe2,
  Laptop
} from "lucide-react";

import { useProjectsStore, useProjects } from "@/stores/projects-store";
import { useProductsStore, useProducts } from "@/stores/products-store";
import type { PartnerProduct } from "@/types/partner";
import { useSiteCMSStore } from "@/stores/site-cms-store";
import { useDocsStore } from "@/stores/docs-store";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";
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
  | "partners"
  | "documentation"
  | "ai"
  | "analytics"
  | "users"
  | "appearance"
  | "settings"
  | "version-history";

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

/**
 * Textarea for list-style fields (one item per line).
 *
 * These fields serialise a parsed array back into text, and a naive controlled
 * textarea makes them impossible to type in: the parser drops the trailing
 * empty line, so pressing Enter is erased on the very next render, and a
 * half-typed row disappears before it can be completed. The raw text therefore
 * lives here in local state while the parsed value propagates outward, and the
 * text is only re-seeded from the parent when the field isn't being edited.
 */
function LineListTextarea({
  serialized,
  onText,
  rows = 4,
  placeholder,
}: {
  serialized: string;
  onText: (text: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [text, setText] = React.useState(serialized);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    if (!editing) setText(serialized);
  }, [serialized, editing]);

  return (
    <textarea
      value={text}
      rows={rows}
      placeholder={placeholder}
      onFocus={() => setEditing(true)}
      onBlur={() => setEditing(false)}
      onChange={(e) => {
        setText(e.target.value);
        onText(e.target.value);
      }}
      className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none resize-y"
    />
  );
}

export default function AdminPage() {
  // Navigation State
  const [mainTab, setMainTab] = useState<MainSidebarTab>("pages");
  const [activePage, setActivePage] = useState<PageSubTab>("home");
  const [homeSection, setHomeSection] = useState<HomeSectionTab>("hero");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSelectTab = (tab: MainSidebarTab) => {
    setMainTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectPage = (page: PageSubTab) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "projects-page" || tabParam === "projects") {
        setMainTab("pages");
        setActivePage("projects-page");
      }
    }
  }, []);

  // Theme & Live Preview State
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState<"dark" | "light">("dark");
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);

  // Store Hooks
  const projects = useProjects();
  const { addProject, updateProject, deleteProject } = useProjectsStore();

  // Partner products (the Alliance showcase)
  const partnerProductsList = useProducts();
  const { addProduct, updateProduct, deleteProduct } = useProductsStore();

  // Reactive CMS state used for debounced global auto-save.
  const liveCms = useSiteCMSStore((s) => s.cms);
  const autoSaveArmedRef = useRef(false);

  // Hydrate the editor from the global DB state on mount (the DB is the source
  // of truth across devices). Auto-save is armed shortly after so we don't
  // immediately re-post the state we just loaded.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cms")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.status === "ok" && d.cms) {
          useSiteCMSStore.getState().setCMS(d.cms);
        }
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          autoSaveArmedRef.current = true;
        }, 1500);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced global auto-save of CMS, Projects, and Products edits to Postgres (Supabase).
  useEffect(() => {
    if (!autoSaveArmedRef.current) return;
    const t = setTimeout(async () => {
      try {
        const currentCMS = useSiteCMSStore.getState().cms;
        const currentProjects = useProjectsStore.getState().projects;
        const currentProducts = useProductsStore.getState().products;

        const postJSON = async (url: string, body: unknown) => {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          return res;
        };

        const results = await Promise.all([
          postJSON("/api/cms", currentCMS),
          ...currentProjects.map((p) => postJSON("/api/projects", p)),
          ...currentProducts.map((prod) => postJSON("/api/products", prod))
        ]);

        const failed = results.find((res) => !res.ok);
        if (failed) {
          if (failed.status === 401) {
            showToast("⚠️ Session expired — your edits are NOT being saved. Sign in again.");
          }
        } else {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("kiwik-data-updated"));
            try {
              const bc = new BroadcastChannel("kiwik-global-sync");
              bc.postMessage("kiwik-data-updated");
              bc.close();
            } catch {
              /* ignore */
            }
          }
        }
      } catch (err) {
        console.error("Global auto-save error:", err);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [liveCms, projects, partnerProductsList]);

  const handleSaveGlobalCMS = async () => {
    setIsSavingGlobal(true);
    try {
      const currentCMS = useSiteCMSStore.getState().cms;
      const currentProjects = useProjectsStore.getState().projects;
      const currentProducts = useProductsStore.getState().products;

      // `fetch` only rejects on a network-level failure, so an HTTP 401/503 used
      // to sail straight through and the save was reported as successful while
      // nothing had been written. Every response is now checked.
      const postJSON = async (url: string, body: unknown) => {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 401) throw new Error("Session expired — sign in again.");
          throw new Error(data.error || `${url} failed (HTTP ${res.status})`);
        }
        return res.json().catch(() => ({}));
      };

      // Save CMS, Projects, and Products concurrently in parallel for sub-400ms instant save speed
      await Promise.all([
        postJSON("/api/cms", currentCMS),
        ...currentProjects.map((p) => postJSON("/api/projects", p)),
        ...currentProducts.map((prod) => postJSON("/api/products", prod))
      ]);

      // 4. Trigger instant real-time data update across open tabs & windows
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kiwik-data-updated"));
        try {
          const bc = new BroadcastChannel("kiwik-global-sync");
          bc.postMessage("kiwik-data-updated");
          bc.close();
        } catch {
          /* ignore */
        }
      }

      // 5. Create a snapshot in store
      useSiteCMSStore.getState().createSnapshot(
        `Manual Save (${new Date().toLocaleTimeString()})`,
        "Saved via Admin Studio Save Button",
        JSON.stringify({ projects: currentProjects, products: currentProducts })
      );

      showToast("✅ All CMS settings, Projects & Products saved globally in Supabase DB!");
    } catch (err) {
      console.error("Global save error:", err);
      showToast(
        `⚠️ Save failed — nothing was written. ${err instanceof Error ? err.message : "Check the database connection."}`
      );
    } finally {
      setIsSavingGlobal(false);
    }
  };

  useEffect(() => {
    const handleSaveHotkey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveGlobalCMS();
      }
    };
    window.addEventListener("keydown", handleSaveHotkey);
    return () => window.removeEventListener("keydown", handleSaveHotkey);
  }, []);

  // Real-time visitor telemetry polling state
  const [visitorTelemetry, setVisitorTelemetry] = useState<{
    active: number;
    totalUnique: number;
    totalPageviews: number;
    recentSessions: Array<{
      sessionId: string;
      deviceType: string;
      browserName: string;
      pathname: string;
      pageviews: number;
      lastPing: string;
    }>;
  }>({
    active: 1,
    totalUnique: 1,
    totalPageviews: 1,
    recentSessions: []
  });

  useEffect(() => {
    const fetchTelemetry = () => {
      fetch("/api/visitors")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok" || typeof data.active !== "undefined") {
            setVisitorTelemetry({
              active: data.active || 1,
              totalUnique: data.totalUnique || 1,
              totalPageviews: data.totalPageviews || 1,
              recentSessions: data.recentSessions || []
            });
          }
        })
        .catch((err) => console.error("Telemetry poll error:", err));
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

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
    deleteSnapshot,
    exportSnapshot,
    addAuditLog,
    updateProjectsPage,
    addSliderCard,
    updateSliderCard,
    deleteSliderCard
  } = useSiteCMSStore();

  // Version History State
  const [versionName, setVersionName] = useState("");
  const [versionNote, setVersionNote] = useState("");
  const [snapshotFilter, setSnapshotFilter] = useState<"all" | "manual" | "auto">("all");
  const [snapshotSearch, setSnapshotSearch] = useState("");
  const [rollbackConfirmId, setRollbackConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [compareSnapshotId, setCompareSnapshotId] = useState<string | null>(null);
  const [autoSaveBeforeRollback, setAutoSaveBeforeRollback] = useState(true);

  // Projects Catalog Editor State
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<ProjectCategory | "all">("all");

  const docsCategories = useDocsStore((state) => state.categories);
  const { addArticle, updateArticle, deleteArticle } = useDocsStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Validate the httpOnly session cookie on mount (server is the source of truth).
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setIsAuthenticated(!!d.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Session lives in a secure httpOnly cookie — no token in localStorage.
        setIsAuthenticated(true);
        setToastMessage("✓ Authenticated Admin Session Established");
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setLoginError(data.error || "Invalid password");
      }
    } catch (err) {
      setLoginError("Connection failure to auth server");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false);
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string, detail?: string) => {
    const fullMsg = detail ? `${msg}: ${detail}` : msg;
    setToastMessage(fullMsg);
    setTimeout(() => setToastMessage(null), 3000);
    // CMS persistence is handled by the debounced auto-save effect below,
    // not coupled to toasts (which fire inconsistently).
  };

  const openMediaPicker = (onSelect: (selectedUrl: string) => void, title: string = "Select Media Asset") => {
    setMediaPickerTarget({ onSelect, title });
  };

  const movePriority = (projId: string, direction: "up" | "down") => {
    const sorted = [...projects].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const currIdx = sorted.findIndex((p) => p.id === projId);
    if (currIdx === -1) return;
    const targetIdx = direction === "up" ? currIdx - 1 : currIdx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    // Ensure distinct integer priorities before swapping
    sorted.forEach((p, idx) => {
      p.priority = p.priority ?? idx + 1;
    });

    const currentItem = sorted[currIdx];
    const targetItem = sorted[targetIdx];

    const tempP = currentItem.priority || (currIdx + 1);
    const targetP = targetItem.priority || (targetIdx + 1);
    const newCurrentP = tempP === targetP ? (direction === "up" ? targetP - 1 : targetP + 1) : targetP;
    const newTargetP = tempP === targetP ? targetP : tempP;

    updateProject(currentItem.id, { priority: newCurrentP });
    updateProject(targetItem.id, { priority: newTargetP });
    showToast("Reordered", `Updated catalog priority for ${currentItem.name}`);
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
  const [activeEditorTab, setActiveEditorTab] = useState<string>("general");

  const editorTabs = [
    { id: "general", label: "General Specs", icon: <LucideIcons.Settings className="w-3.5 h-3.5" /> },
    { id: "branding", label: "Branding/Identity", icon: <LucideIcons.Layers className="w-3.5 h-3.5" /> },
    { id: "hero", label: "Hero Showcase", icon: <LucideIcons.Layout className="w-3.5 h-3.5" /> },
    { id: "overview", label: "Overview Panel", icon: <LucideIcons.BookOpen className="w-3.5 h-3.5" /> },
    { id: "telemetry", label: "Telemetry & Logs", icon: <LucideIcons.Activity className="w-3.5 h-3.5" /> },
    { id: "quick", label: "Quick Actions", icon: <LucideIcons.Plus className="w-3.5 h-3.5" /> },
    { id: "features", label: "Feature Cards", icon: <LucideIcons.Sparkles className="w-3.5 h-3.5" /> },
    { id: "tech", label: "Tech Stack", icon: <LucideIcons.Cpu className="w-3.5 h-3.5" /> },
    { id: "readme", label: "Documentation", icon: <LucideIcons.FileText className="w-3.5 h-3.5" /> },
    { id: "gallery", label: "Gallery Assets", icon: <LucideIcons.Image className="w-3.5 h-3.5" /> },
    { id: "timeline", label: "Timeline Nodes", icon: <LucideIcons.Calendar className="w-3.5 h-3.5" /> },
    { id: "contributors", label: "Contributors", icon: <LucideIcons.Users className="w-3.5 h-3.5" /> },
    { id: "seo", label: "SEO Config", icon: <LucideIcons.Globe className="w-3.5 h-3.5" /> }
  ];

  // Prompt-less Media additions
  const [showAddMediaForm, setShowAddMediaForm] = useState(false);
  const [newMediaName, setNewMediaName] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [showPickerAddForm, setShowPickerAddForm] = useState(false);
  const [newPickerAssetName, setNewPickerAssetName] = useState("");
  const [newPickerAssetUrl, setNewPickerAssetUrl] = useState("");

  const updateProjField = (updatedFields: Partial<Project>) => {
    if (!editingProject) return;
    const nameChanged = updatedFields.name !== undefined;
    let newSlug = updatedFields.slug;
    if (nameChanged && updatedFields.name) {
      newSlug = updatedFields.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    const updated = {
      ...editingProject,
      ...updatedFields,
      ...(nameChanged && newSlug ? { slug: newSlug } : {})
    };
    setEditingProject(updated);
    updateProject(editingProject.id, updated);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesStatus =
      projectStatusFilter === "all" || p.status === projectStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // CMS Section Renderers
  const renderGeneralSection = () => {
    if (!editingProject) return null;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Project Name</label>
            <input
              type="text"
              value={editingProject.name || ""}
              onChange={(e) => updateProjField({ name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Project Slug</label>
            <input
              type="text"
              value={editingProject.slug || ""}
              onChange={(e) => updateProjField({ slug: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Short Description (Tagline)</label>
          <input
            type="text"
            value={editingProject.tagline || ""}
            onChange={(e) => updateProjField({ tagline: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Long Description</label>
          <textarea
            rows={3}
            value={editingProject.longDescription || ""}
            onChange={(e) => updateProjField({ longDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Status</label>
            <select
              value={editingProject.status || "in-progress"}
              onChange={(e) => updateProjField({ status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-[#111318] border border-glass-border text-xs text-white"
            >
              <option value="active">Active</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Category</label>
            <select
              value={editingProject.category || "web"}
              onChange={(e) => updateProjField({ category: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-[#111318] border border-glass-border text-xs text-white"
            >
              <option value="ai">AI / Machine Learning</option>
              <option value="web">Web App / Portal</option>
              <option value="mobile">Mobile Application</option>
              <option value="automation">Automation Pipeline</option>
              <option value="blockchain">Blockchain Ledger</option>
              <option value="ml">Machine Learning</option>
              <option value="devops">DevOps & Cloud</option>
              <option value="research">Academic Research</option>
              <option value="saas">SaaS Portal</option>
              <option value="open-source">Open Source Utility</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Version</label>
            <input
              type="text"
              value={editingProject.version || ""}
              onChange={(e) => updateProjField({ version: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Sort Order</label>
            <input
              type="number"
              value={editingProject.sortOrder || 0}
              onChange={(e) => updateProjField({ sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Priority</label>
            <input
              type="number"
              value={editingProject.priority || 0}
              onChange={(e) => updateProjField({ priority: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div className="flex items-center pt-5 gap-2">
            <input
              type="checkbox"
              id="proj-featured"
              checked={editingProject.featured || false}
              onChange={(e) => updateProjField({ featured: e.target.checked })}
              className="w-4 h-4 rounded bg-bg-secondary border-glass-border"
            />
            <label htmlFor="proj-featured" className="text-xs font-semibold text-text-secondary">Featured</label>
          </div>
          <div className="flex items-center pt-5 gap-2">
            <input
              type="checkbox"
              id="proj-visible"
              checked={editingProject.visible !== false}
              onChange={(e) => updateProjField({ visible: e.target.checked })}
              className="w-4 h-4 rounded bg-bg-secondary border-glass-border"
            />
            <label htmlFor="proj-visible" className="text-xs font-semibold text-text-secondary">Visible</label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Created Date</label>
            <input
              type="text"
              value={editingProject.createdAt || ""}
              onChange={(e) => updateProjField({ createdAt: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Publish Date</label>
            <input
              type="text"
              value={editingProject.publishDate || ""}
              onChange={(e) => updateProjField({ publishDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderBrandingSection = () => {
    if (!editingProject) return null;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Dark Logo</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.logoDark || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Dark Logo Asset", onSelect: (url) => updateProjField({ logoDark: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Light Logo</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.logoLight || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Light Logo Asset", onSelect: (url) => updateProjField({ logoLight: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Project Icon</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.logo || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Project Icon", onSelect: (url) => updateProjField({ logo: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Favicon Asset</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.favicon || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Favicon", onSelect: (url) => updateProjField({ favicon: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Accent Hex Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={editingProject.accentColor || "#3b82f6"}
                onChange={(e) => updateProjField({ accentColor: e.target.value })}
                className="w-10 h-8 rounded border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={editingProject.accentColor || ""}
                onChange={(e) => updateProjField({ accentColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Theme Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={editingProject.themeColor || "#0b0f19"}
                onChange={(e) => updateProjField({ themeColor: e.target.value })}
                className="w-10 h-8 rounded border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={editingProject.themeColor || ""}
                onChange={(e) => updateProjField({ themeColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Cover Image</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.coverImage || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Cover Image", onSelect: (url) => updateProjField({ coverImage: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Background Gradient</label>
            <input
              type="text"
              value={editingProject.brandingGradient || ""}
              onChange={(e) => updateProjField({ brandingGradient: e.target.value })}
              placeholder="e.g. from-blue-500/10 to-transparent"
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Thumbnail</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.thumbnail || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Thumbnail Image", onSelect: (url) => updateProjField({ thumbnail: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Card Image</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.cardImage || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Card Image Showcase", onSelect: (url) => updateProjField({ cardImage: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeroSection = () => {
    if (!editingProject) return null;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Back Button Label</label>
            <input
              type="text"
              value={editingProject.heroBackButtonLabel || ""}
              onChange={(e) => updateProjField({ heroBackButtonLabel: e.target.value })}
              placeholder="Back to systems"
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Status Badge Text</label>
            <input
              type="text"
              value={editingProject.heroStatusBadge || ""}
              onChange={(e) => updateProjField({ heroStatusBadge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Hero Title</label>
            <input
              type="text"
              value={editingProject.heroTitle || ""}
              onChange={(e) => updateProjField({ heroTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Hero Subtitle</label>
            <input
              type="text"
              value={editingProject.heroSubtitle || ""}
              onChange={(e) => updateProjField({ heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Hero Description</label>
          <textarea
            rows={2}
            value={editingProject.heroDescription || ""}
            onChange={(e) => updateProjField({ heroDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        {/* CTA 1 */}
        <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-3">
          <span className="text-[9px] font-mono font-bold text-accent-blue uppercase block">Primary CTA Button</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-text-secondary block mb-0.5">Label</label>
              <input
                type="text"
                value={editingProject.heroCta1Text || ""}
                onChange={(e) => updateProjField({ heroCta1Text: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-bg-secondary text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-text-secondary block mb-0.5">Target Link / URL</label>
              <input
                type="text"
                value={editingProject.heroCta1Link || ""}
                onChange={(e) => updateProjField({ heroCta1Link: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-bg-secondary text-xs font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-text-secondary block mb-0.5">Icon (Lucide name)</label>
              <input
                type="text"
                value={editingProject.heroCta1Icon || ""}
                onChange={(e) => updateProjField({ heroCta1Icon: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-bg-secondary text-xs font-mono"
              />
            </div>
            <div className="flex items-center pt-4 gap-2">
              <input
                type="checkbox"
                id="cta1-newtab"
                checked={editingProject.heroCta1NewTab !== false}
                onChange={(e) => updateProjField({ heroCta1NewTab: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="cta1-newtab" className="text-[10px] text-text-secondary">Open in New Tab</label>
            </div>
          </div>
        </div>

        {/* CTA 2 */}
        <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-3">
          <span className="text-[9px] font-mono font-bold text-text-muted uppercase block">Secondary CTA Button</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-text-secondary block mb-0.5">Label</label>
              <input
                type="text"
                value={editingProject.heroCta2Text || ""}
                onChange={(e) => updateProjField({ heroCta2Text: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-bg-secondary text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-text-secondary block mb-0.5">Target Link</label>
              <input
                type="text"
                value={editingProject.heroCta2Link || ""}
                onChange={(e) => updateProjField({ heroCta2Link: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-bg-secondary text-xs font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-text-secondary block mb-0.5">Icon (Lucide name)</label>
              <input
                type="text"
                value={editingProject.heroCta2Icon || ""}
                onChange={(e) => updateProjField({ heroCta2Icon: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded bg-bg-secondary text-xs font-mono"
              />
            </div>
            <div className="flex items-center pt-4 gap-2">
              <input
                type="checkbox"
                id="cta2-newtab"
                checked={editingProject.heroCta2NewTab !== false}
                onChange={(e) => updateProjField({ heroCta2NewTab: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="cta2-newtab" className="text-[10px] text-text-secondary">Open in New Tab</label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">GitHub Codebase link</label>
            <input
              type="text"
              value={editingProject.githubUrl || ""}
              onChange={(e) => updateProjField({ githubUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Live URL link</label>
            <input
              type="text"
              value={editingProject.liveUrl || ""}
              onChange={(e) => updateProjField({ liveUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Hero Background Image</label>
            <div className="flex gap-2">
              <input type="text" value={editingProject.heroBgImage || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMediaPickerTarget({ title: "Hero background image", onSelect: (url) => updateProjField({ heroBgImage: url }) })}
                className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
              >
                Browse
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Overlay Opacity (0 to 1)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={editingProject.heroBgOpacity !== undefined ? editingProject.heroBgOpacity : 0.95}
              onChange={(e) => updateProjField({ heroBgOpacity: parseFloat(e.target.value) || 0.95 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewSection = () => {
    if (!editingProject) return null;
    return (
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Overview Title / Heading</label>
          <input
            type="text"
            value={editingProject.overviewHeading || ""}
            onChange={(e) => updateProjField({ overviewHeading: e.target.value })}
            placeholder="Overview"
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Overview Description Paragraph</label>
          <textarea
            rows={4}
            value={editingProject.overviewParagraph || ""}
            onChange={(e) => updateProjField({ overviewParagraph: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Rich Text Override</label>
          <textarea
            rows={3}
            value={editingProject.overviewRichText || ""}
            onChange={(e) => updateProjField({ overviewRichText: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Key Quote / Callout Block</label>
          <input
            type="text"
            value={editingProject.overviewQuote || ""}
            onChange={(e) => updateProjField({ overviewQuote: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Callout Info Box Text</label>
          <input
            type="text"
            value={editingProject.overviewCallout || ""}
            onChange={(e) => updateProjField({ overviewCallout: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Featured Overview Image</label>
          <div className="flex gap-2">
            <input type="text" value={editingProject.overviewImage || ""} readOnly className="flex-1 px-3 py-1.5 rounded bg-bg-secondary text-[10px] text-white" />
            <button
              type="button"
              onClick={() => setMediaPickerTarget({ title: "Overview asset image", onSelect: (url) => updateProjField({ overviewImage: url }) })}
              className="px-2 py-1 rounded bg-white/5 border border-glass-border text-[10px] text-white"
            >
              Browse
            </button>
          </div>
        </div>

        {/* Highlights bullets manager */}
        <div className="p-4 rounded-xl bg-black/25 border border-white/5 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-accent-blue uppercase">Core Pillars / Highlights</span>
            <button
              type="button"
              onClick={() => {
                const hl = editingProject.overviewHighlights || [];
                updateProjField({ overviewHighlights: [...hl, "New Pillar Target"] });
              }}
              className="text-[9px] font-bold text-white px-2 py-0.5 rounded bg-white/10"
            >
              Add Bullet
            </button>
          </div>
          <div className="space-y-2">
            {(editingProject.overviewHighlights || []).map((bullet: string, bIdx: number) => (
              <div key={bIdx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => {
                    const hl = [...(editingProject.overviewHighlights || [])];
                    hl[bIdx] = e.target.value;
                    updateProjField({ overviewHighlights: hl });
                  }}
                  className="flex-1 px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const hl = (editingProject.overviewHighlights || []).filter((_: any, idx: number) => idx !== bIdx);
                    updateProjField({ overviewHighlights: hl });
                  }}
                  className="p-1 text-rose-500 rounded hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTelemetrySection = () => {
    if (!editingProject) return null;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Stars Count</label>
            <input
              type="number"
              value={editingProject.stars || 0}
              onChange={(e) => updateProjField({ stars: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Forks Count</label>
            <input
              type="number"
              value={editingProject.forks || 0}
              onChange={(e) => updateProjField({ forks: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Views Count</label>
            <input
              type="number"
              value={editingProject.views || 0}
              onChange={(e) => updateProjField({ views: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Downloads</label>
            <input
              type="number"
              value={editingProject.telemetryDownloads || 0}
              onChange={(e) => updateProjField({ telemetryDownloads: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Completion %</label>
            <input
              type="number"
              value={editingProject.completionPercent || 0}
              onChange={(e) => updateProjField({ completionPercent: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Reading Time (Mins)</label>
            <input
              type="text"
              value={editingProject.telemetryReadingTime || ""}
              onChange={(e) => updateProjField({ telemetryReadingTime: e.target.value })}
              placeholder="e.g. 5 min read"
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Last Updated String</label>
            <input
              type="text"
              value={editingProject.lastUpdated || ""}
              onChange={(e) => updateProjField({ lastUpdated: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Health Status</label>
            <input
              type="text"
              value={editingProject.telemetryHealthStatus || ""}
              onChange={(e) => updateProjField({ telemetryHealthStatus: e.target.value })}
              placeholder="e.g. Operational (Audited)"
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Status Color</label>
            <input
              type="text"
              value={editingProject.telemetryStatusColor || ""}
              onChange={(e) => updateProjField({ telemetryStatusColor: e.target.value })}
              placeholder="#10B981"
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Telemetry Badges tags list */}
        <div className="p-4 rounded-xl bg-black/25 border border-white/5 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-accent-blue uppercase">Telemetry Badges / Tags</span>
            <button
              type="button"
              onClick={() => {
                const bg = editingProject.telemetryBadges || [];
                updateProjField({ telemetryBadges: [...bg, "Stable v2"] });
              }}
              className="text-[9px] font-bold text-white px-2 py-0.5 rounded bg-white/10 animate-pulse-slow"
            >
              Add Badge Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(editingProject.telemetryBadges || []).map((badge: string, bIdx: number) => (
              <div key={bIdx} className="flex gap-1.5 items-center bg-white/5 px-2 py-1 rounded-xl border border-white/5">
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => {
                    const bg = [...(editingProject.telemetryBadges || [])];
                    bg[bIdx] = e.target.value;
                    updateProjField({ telemetryBadges: bg });
                  }}
                  className="w-20 px-1 py-0.5 bg-transparent border-0 text-[10px] font-bold text-white text-center focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const bg = (editingProject.telemetryBadges || []).filter((_: any, idx: number) => idx !== bIdx);
                    updateProjField({ telemetryBadges: bg });
                  }}
                  className="text-rose-500 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuickActionsSection = () => {
    if (!editingProject) return null;
    const actions = editingProject.quickActions || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold text-white uppercase">Quick Link Buttons ({actions.length})</span>
          <button
            type="button"
            onClick={() => {
              const newAct: QuickAction = {
                label: "Inspect Deployment",
                icon: "ExternalLink",
                route: "/projects",
                externalUrl: "https://kiwik.space",
                newTab: true,
                visible: true,
                order: actions.length + 1
              };
              updateProjField({ quickActions: [...actions, newAct] });
            }}
            className="px-3 py-1 rounded bg-accent-blue text-white text-[10px] font-bold"
          >
            Add Action
          </button>
        </div>

        <div className="space-y-3">
          {actions.sort((a: any,b: any) => a.order - b.order).map((act: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-3 relative">
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (idx > 0) {
                      const copy = [...actions];
                      const temp = copy[idx - 1].order;
                      copy[idx - 1].order = copy[idx].order;
                      copy[idx].order = temp;
                      updateProjField({ quickActions: copy });
                    }
                  }}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (idx < actions.length - 1) {
                      const copy = [...actions];
                      const temp = copy[idx + 1].order;
                      copy[idx + 1].order = copy[idx].order;
                      copy[idx].order = temp;
                      updateProjField({ quickActions: copy });
                    }
                  }}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const copy = actions.filter((_: any, i: number) => i !== idx);
                    updateProjField({ quickActions: copy });
                  }}
                  className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Label</label>
                  <input
                    type="text"
                    value={act.label || ""}
                    onChange={(e) => {
                      const copy = [...actions];
                      copy[idx] = { ...copy[idx], label: e.target.value };
                      updateProjField({ quickActions: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Icon (Lucide name)</label>
                  <input
                    type="text"
                    value={act.icon || ""}
                    onChange={(e) => {
                      const copy = [...actions];
                      copy[idx] = { ...copy[idx], icon: e.target.value };
                      updateProjField({ quickActions: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Route Path</label>
                  <input
                    type="text"
                    value={act.route || ""}
                    onChange={(e) => {
                      const copy = [...actions];
                      copy[idx] = { ...copy[idx], route: e.target.value };
                      updateProjField({ quickActions: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">External Link</label>
                  <input
                    type="text"
                    value={act.externalUrl || ""}
                    onChange={(e) => {
                      const copy = [...actions];
                      copy[idx] = { ...copy[idx], externalUrl: e.target.value };
                      updateProjField({ quickActions: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <input
                    type="checkbox"
                    checked={act.newTab || false}
                    onChange={(e) => {
                      const copy = [...actions];
                      copy[idx] = { ...copy[idx], newTab: e.target.checked };
                      updateProjField({ quickActions: copy });
                    }}
                    className="w-3.5 h-3.5 rounded"
                  />
                  New Tab
                </label>
                <label className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <input
                    type="checkbox"
                    checked={act.visible !== false}
                    onChange={(e) => {
                      const copy = [...actions];
                      copy[idx] = { ...copy[idx], visible: e.target.checked };
                      updateProjField({ quickActions: copy });
                    }}
                    className="w-3.5 h-3.5 rounded"
                  />
                  Visible
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeaturesSection = () => {
    if (!editingProject) return null;
    const feats = editingProject.features || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold text-white uppercase font-mono">Dynamic Features Cards ({feats.length})</span>
          <button
            type="button"
            onClick={() => {
              const newFeat: Feature = {
                title: "New Modular Pipeline",
                description: "Optimized for latency and dynamic edge configurations.",
                icon: "Sparkles",
                id: `feat-${Date.now()}`,
                visible: true,
                order: feats.length + 1
              };
              updateProjField({ features: [...feats, newFeat] });
            }}
            className="px-3 py-1 rounded bg-accent-blue text-white text-[10px] font-bold"
          >
            Add Feature
          </button>
        </div>

        <div className="space-y-4">
          {feats.sort((a: any,b: any) => a.order - b.order).map((feat: any, idx: number) => (
            <div key={feat.id || idx} className="p-4 rounded-2xl bg-bg-secondary/40 border border-glass-border space-y-3 relative">
              <div className="absolute top-3 right-3 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (idx > 0) {
                      const copy = [...feats];
                      const temp = copy[idx - 1].order;
                      copy[idx - 1].order = copy[idx].order;
                      copy[idx].order = temp;
                      updateProjField({ features: copy });
                    }
                  }}
                  className="p-1 rounded bg-white/5 text-white"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (idx < feats.length - 1) {
                      const copy = [...feats];
                      const temp = copy[idx + 1].order;
                      copy[idx + 1].order = copy[idx].order;
                      copy[idx].order = temp;
                      updateProjField({ features: copy });
                    }
                  }}
                  className="p-1 rounded bg-white/5 text-white"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const copy = feats.filter((_: any, i: number) => i !== idx);
                    updateProjField({ features: copy });
                  }}
                  className="p-1.5 rounded bg-rose-500/10 text-rose-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-text-secondary block mb-1">Feature Title</label>
                <input
                  type="text"
                  value={feat.title || ""}
                  onChange={(e) => {
                    const copy = [...feats];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    updateProjField({ features: copy });
                  }}
                  className="w-full px-3 py-1.5 rounded bg-bg-secondary border border-glass-border text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-text-secondary block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={feat.description || ""}
                  onChange={(e) => {
                    const copy = [...feats];
                    copy[idx] = { ...copy[idx], description: e.target.value };
                    updateProjField({ features: copy });
                  }}
                  className="w-full px-3 py-1.5 rounded bg-bg-secondary border border-glass-border text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Icon (Lucide)</label>
                  <input
                    type="text"
                    value={feat.icon || ""}
                    onChange={(e) => {
                      const copy = [...feats];
                      copy[idx] = { ...copy[idx], icon: e.target.value };
                      updateProjField({ features: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Accent Border Hex</label>
                  <input
                    type="text"
                    value={feat.accent || ""}
                    onChange={(e) => {
                      const copy = [...feats];
                      copy[idx] = { ...copy[idx], accent: e.target.value };
                      updateProjField({ features: copy });
                    }}
                    placeholder="e.g. #3b82f6"
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Feature Image</label>
                  <div className="flex gap-1.5">
                    <input type="text" value={feat.image || ""} readOnly className="flex-1 px-2 py-1.5 rounded bg-bg-secondary text-[9px] text-white" />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget({
                        title: `Image for feature ${feat.title}`,
                        onSelect: (url) => {
                          const copy = [...feats];
                          copy[idx] = { ...copy[idx], image: url };
                          updateProjField({ features: copy });
                        }
                      })}
                      className="px-2 rounded bg-white/5 border border-glass-border text-[9px] text-white"
                    >
                      Browse
                    </button>
                  </div>
                </div>
                <div className="flex items-center pt-4 gap-2">
                  <input
                    type="checkbox"
                    checked={feat.visible !== false}
                    onChange={(e) => {
                      const copy = [...feats];
                      copy[idx] = { ...copy[idx], visible: e.target.checked };
                      updateProjField({ features: copy });
                    }}
                    className="w-3.5 h-3.5 rounded"
                  />
                  <label className="text-[10px] text-text-secondary">Visible</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTechStackSection = () => {
    if (!editingProject) return null;
    const stack = editingProject.techStack || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold text-white uppercase font-mono">Technologies ({stack.length})</span>
          <button
            type="button"
            onClick={() => {
              const newTech: TechItem = {
                name: "React Next.js",
                logo: "/logo.png",
                category: "frontend",
                version: "16.2",
                website: "https://nextjs.org",
                order: stack.length + 1
              };
              updateProjField({ techStack: [...stack, newTech] });
            }}
            className="px-3 py-1 rounded bg-accent-blue text-white text-[10px] font-bold"
          >
            Add Tech Item
          </button>
        </div>

        <div className="space-y-3">
          {stack.sort((a: any,b: any) => a.order - b.order).map((tech: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-3 relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const copy = stack.filter((_: any, i: number) => i !== idx);
                    updateProjField({ techStack: copy });
                  }}
                  className="p-1 rounded bg-rose-500/10 text-rose-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Name</label>
                  <input
                    type="text"
                    value={tech.name || ""}
                    onChange={(e) => {
                      const copy = [...stack];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      updateProjField({ techStack: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Version</label>
                  <input
                    type="text"
                    value={tech.version || ""}
                    onChange={(e) => {
                      const copy = [...stack];
                      copy[idx] = { ...copy[idx], version: e.target.value };
                      updateProjField({ techStack: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Logo Icon</label>
                  <div className="flex gap-1.5">
                    <input type="text" value={tech.logo || ""} readOnly className="flex-1 px-2 py-1.5 rounded bg-bg-secondary text-[9px] text-white" />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget({
                        title: `Logo for ${tech.name}`,
                        onSelect: (url) => {
                          const copy = [...stack];
                          copy[idx] = { ...copy[idx], logo: url };
                          updateProjField({ techStack: copy });
                        }
                      })}
                      className="px-2 rounded bg-white/5 border border-glass-border text-[9px] text-white"
                    >
                      Browse
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Website URL</label>
                  <input
                    type="text"
                    value={tech.website || ""}
                    onChange={(e) => {
                      const copy = [...stack];
                      copy[idx] = { ...copy[idx], website: e.target.value };
                      updateProjField({ techStack: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReadmeSection = () => {
    if (!editingProject) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-text-secondary uppercase">Markdown README Content</label>
          <button
            type="button"
            onClick={() => {
              const defaultReadme = `# System Operations Specification\n\nConfigure custom node definitions inside this readme blocks.`;
              updateProjField({ readme: defaultReadme });
              showToast("Loaded markdown templates!");
            }}
            className="text-[9px] font-bold text-accent-blue hover:underline"
          >
            Load Template
          </button>
        </div>
        <textarea
          rows={15}
          value={editingProject.readme || ""}
          onChange={(e) => updateProjField({ readme: e.target.value })}
          className="w-full p-3.5 rounded-2xl bg-bg-secondary border border-glass-border text-xs text-white font-mono leading-relaxed"
          placeholder="# Project Operations Readme..."
        />
      </div>
    );
  };

  const renderGallerySection = () => {
    if (!editingProject) return null;
    const imgs = editingProject.images || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold text-white uppercase font-mono">System Gallery Screenshots ({imgs.length})</span>
          <button
            type="button"
            onClick={() => {
              const newImg: ProjectImageInterface = {
                src: "/logo.png",
                alt: "System Dashboard Screenshot",
                caption: "Console pipeline monitoring analytics",
                order: imgs.length + 1,
                mediaType: "image"
              };
              updateProjField({ images: [...imgs, newImg] });
            }}
            className="px-3 py-1 rounded bg-accent-blue text-white text-[10px] font-bold"
          >
            Add Asset Link
          </button>
        </div>

        <div className="space-y-3">
          {imgs.sort((a: any,b: any) => a.order - b.order).map((img: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-3 relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const copy = imgs.filter((_: any, i: number) => i !== idx);
                    updateProjField({ images: copy });
                  }}
                  className="p-1 rounded bg-rose-500/10 text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-[9px] text-text-secondary block">Select Image Asset</label>
                <div className="flex gap-1.5">
                  <input type="text" value={img.src || ""} readOnly className="flex-1 px-2 py-1.5 rounded bg-bg-secondary text-[9px] text-white" />
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget({
                      title: `Gallery image #${idx + 1}`,
                      onSelect: (url) => {
                        const copy = [...imgs];
                        copy[idx] = { ...copy[idx], src: url };
                        updateProjField({ images: copy });
                      }
                    })}
                    className="px-2 rounded bg-white/5 border border-glass-border text-[9px] text-white"
                  >
                    Browse
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Alt Text</label>
                  <input
                    type="text"
                    value={img.alt || ""}
                    onChange={(e) => {
                      const copy = [...imgs];
                      copy[idx] = { ...copy[idx], alt: e.target.value };
                      updateProjField({ images: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Caption label</label>
                  <input
                    type="text"
                    value={img.caption || ""}
                    onChange={(e) => {
                      const copy = [...imgs];
                      copy[idx] = { ...copy[idx], caption: e.target.value };
                      updateProjField({ images: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-1 text-[10px] text-text-secondary">
                  <input
                    type="checkbox"
                    checked={img.isVideo || img.mediaType === "video" || false}
                    onChange={(e) => {
                      const copy = [...imgs];
                      copy[idx] = { ...copy[idx], isVideo: e.target.checked, mediaType: e.target.checked ? "video" : "image" };
                      updateProjField({ images: copy });
                    }}
                    className="w-3.5 h-3.5 rounded"
                  />
                  Video Asset
                </label>
                {img.isVideo && (
                  <input
                    type="text"
                    value={img.videoUrl || ""}
                    onChange={(e) => {
                      const copy = [...imgs];
                      copy[idx] = { ...copy[idx], videoUrl: e.target.value };
                      updateProjField({ images: copy });
                    }}
                    placeholder="Video MP4/YouTube link"
                    className="flex-1 px-2 py-0.5 rounded bg-bg-secondary text-[10px] text-white font-mono"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTimelineSection = () => {
    if (!editingProject) return null;
    const timeline = editingProject.timeline || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold text-white uppercase font-mono">Timeline Releases ({timeline.length})</span>
          <button
            type="button"
            onClick={() => {
              const newEvent: TimelineEntry = {
                date: new Date().toISOString().split("T")[0],
                title: "Production Release v2",
                description: "Full cluster replication deployed to production nodes.",
                status: "completed",
                order: timeline.length + 1
              };
              updateProjField({ timeline: [...timeline, newEvent] });
            }}
            className="px-3 py-1 rounded bg-accent-blue text-white text-[10px] font-bold"
          >
            Add Event
          </button>
        </div>

        <div className="space-y-3">
          {timeline.sort((a: any,b: any) => a.order - b.order).map((event: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-3 relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const copy = timeline.filter((_: any, i: number) => i !== idx);
                    updateProjField({ timeline: copy });
                  }}
                  className="p-1 rounded bg-rose-500/10 text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Date String</label>
                  <input
                    type="text"
                    value={event.date || ""}
                    onChange={(e) => {
                      const copy = [...timeline];
                      copy[idx] = { ...copy[idx], date: e.target.value };
                      updateProjField({ timeline: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Badge text</label>
                  <input
                    type="text"
                    value={event.badge || ""}
                    onChange={(e) => {
                      const copy = [...timeline];
                      copy[idx] = { ...copy[idx], badge: e.target.value };
                      updateProjField({ timeline: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-text-secondary block">Event Title</label>
                <input
                  type="text"
                  value={event.title || ""}
                  onChange={(e) => {
                    const copy = [...timeline];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    updateProjField({ timeline: copy });
                  }}
                  className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[9px] text-text-secondary block">Description</label>
                <textarea
                  rows={2}
                  value={event.description || ""}
                  onChange={(e) => {
                    const copy = [...timeline];
                    copy[idx] = { ...copy[idx], description: e.target.value };
                    updateProjField({ timeline: copy });
                  }}
                  className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Release Status</label>
                  <select
                    value={event.status || "planned"}
                    onChange={(e) => {
                      const copy = [...timeline];
                      copy[idx] = { ...copy[idx], status: e.target.value as any };
                      updateProjField({ timeline: copy });
                    }}
                    className="w-full px-2 py-1.5 rounded bg-[#111318] text-xs text-white"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Optional image</label>
                  <div className="flex gap-1.5">
                    <input type="text" value={event.image || ""} readOnly className="flex-1 px-2 py-1.5 rounded bg-bg-secondary text-[9px] text-white" />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget({
                        title: `Image for event ${event.title}`,
                        onSelect: (url) => {
                          const copy = [...timeline];
                          copy[idx] = { ...copy[idx], image: url };
                          updateProjField({ timeline: copy });
                        }
                      })}
                      className="px-2 rounded bg-white/5 border border-glass-border text-[9px] text-white"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContributorsSection = () => {
    if (!editingProject) return null;
    const team = editingProject.contributors || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold text-white uppercase font-mono">Team Contributors ({team.length})</span>
          <button
            type="button"
            onClick={() => {
              const newUser: Contributor = {
                name: "Sarah Lin",
                role: "Lead DevOps",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
                contributionPercent: 40,
                featured: true,
                order: team.length + 1
              };
              updateProjField({ contributors: [...team, newUser] });
            }}
            className="px-3 py-1 rounded bg-accent-blue text-white text-[10px] font-bold"
          >
            Add Team Member
          </button>
        </div>

        <div className="space-y-3">
          {team.sort((a: any,b: any) => a.order - b.order).map((member: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-3 relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const copy = team.filter((_: any, i: number) => i !== idx);
                    updateProjField({ contributors: copy });
                  }}
                  className="p-1 rounded bg-rose-500/10 text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">Full Name</label>
                  <input
                    type="text"
                    value={member.name || ""}
                    onChange={(e) => {
                      const copy = [...team];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      updateProjField({ contributors: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Role Title</label>
                  <input
                    type="text"
                    value={member.role || ""}
                    onChange={(e) => {
                      const copy = [...team];
                      copy[idx] = { ...copy[idx], role: e.target.value };
                      updateProjField({ contributors: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-text-secondary block">Avatar</label>
                <div className="flex gap-1.5">
                  <input type="text" value={member.avatar || ""} readOnly className="flex-1 px-2 py-1.5 rounded bg-bg-secondary text-[9px] text-white" />
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget({
                      title: `Avatar for ${member.name}`,
                      onSelect: (url) => {
                        const copy = [...team];
                        copy[idx] = { ...copy[idx], avatar: url };
                        updateProjField({ contributors: copy });
                      }
                    })}
                    className="px-2 rounded bg-white/5 border border-glass-border text-[9px] text-white"
                  >
                    Browse
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-text-secondary block">GitHub URL</label>
                  <input
                    type="text"
                    value={member.github || ""}
                    onChange={(e) => {
                      const copy = [...team];
                      copy[idx] = { ...copy[idx], github: e.target.value };
                      updateProjField({ contributors: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-secondary block">Contribution %</label>
                  <input
                    type="number"
                    value={member.contributionPercent || 0}
                    onChange={(e) => {
                      const copy = [...team];
                      copy[idx] = { ...copy[idx], contributionPercent: parseInt(e.target.value) || 0 };
                      updateProjField({ contributors: copy });
                    }}
                    className="w-full px-2 py-1 rounded bg-bg-secondary text-xs text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSEOSection = () => {
    if (!editingProject) return null;
    const seo = editingProject.seo || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">SEO Metatags Title</label>
          <input
            type="text"
            value={seo.title || ""}
            onChange={(e) => updateProjField({ seo: { ...seo, title: e.target.value } })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">SEO Description</label>
          <textarea
            rows={3}
            value={seo.description || ""}
            onChange={(e) => updateProjField({ seo: { ...seo, description: e.target.value } })}
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-secondary block mb-1">Meta Keywords list</label>
          <input
            type="text"
            value={seo.keywords || ""}
            onChange={(e) => updateProjField({ seo: { ...seo, keywords: e.target.value } })}
            placeholder="e.g. modular, edge, router"
            className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Twitter Card type</label>
            <input
              type="text"
              value={seo.twitterCard || ""}
              onChange={(e) => updateProjField({ seo: { ...seo, twitterCard: e.target.value } })}
              placeholder="summary_large_image"
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary block mb-1">Sitemap Priority (0 to 1)</label>
            <input
              type="number"
              step="0.1"
              value={seo.sitemapPriority || 0.8}
              onChange={(e) => updateProjField({ seo: { ...seo, sitemapPriority: parseFloat(e.target.value) || 0.8 } })}
              className="w-full px-3 py-2 rounded-xl bg-bg-secondary border border-glass-border text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050608] text-white flex items-center justify-center p-4 select-none relative overflow-hidden font-sans">
        {/* Ambient Glowing Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-blue/15 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md vision-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative z-10 bg-neutral-900/80 backdrop-blur-2xl"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-blue via-indigo-500 to-purple-600 p-[1px] mx-auto shadow-lg">
              <div className="w-full h-full bg-neutral-950 rounded-[15px] flex items-center justify-center font-bold text-lg text-white">
                K
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Kiwik OS Studio Login</h1>
            <p className="text-xs text-neutral-400 font-sans">Enter admin credentials to manage platform telemetry & content.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950/60 border border-white/10 focus:border-accent-blue text-xs text-white placeholder-neutral-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-white/5">
            <span className="text-[10px] text-neutral-500 font-mono">
              Authorized access only · Kiwik OS Studio
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg-primary text-text-primary flex flex-col font-sans select-none antialiased overflow-hidden">
      
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
      <header className="h-16 shrink-0 px-6 bg-glass-bg border-b border-glass-border backdrop-blur-xl flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-bg-secondary border border-glass-border text-text-primary hover:bg-bg-primary cursor-pointer shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-blue via-indigo-500 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-bg-primary rounded-[11px] flex items-center justify-center font-bold text-xs text-text-primary group-hover:scale-105 transition-transform">
                K
              </div>
            </div>
            <span className="font-serif font-bold text-base tracking-tight text-text-primary hidden sm:inline">Kiwik OS Studio</span>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {visitorTelemetry.active} {visitorTelemetry.active === 1 ? "Visitor" : "Visitors"} Online Now
          </span>
        </div>

        {/* Device Switcher & Mode Tools */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
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
              "px-3 py-1.5 rounded-xl text-xs font-bold hidden md:flex items-center gap-1.5 transition-all cursor-pointer border",
              mainTab === ("live-preview" as any)
                ? "bg-accent-blue text-white border-transparent shadow-md"
                : "bg-bg-secondary border-glass-border text-text-primary hover:bg-bg-primary"
            )}
          >
            <Monitor className="w-4 h-4" />
            <span>{mainTab === ("live-preview" as any) ? "Back to Studio" : "Live Device Frame"}</span>
          </button>

          {/* Device Switcher Segment */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-bg-secondary border border-glass-border">
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
            className="p-2 rounded-xl bg-bg-secondary border border-glass-border text-text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {previewMode === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="hidden sm:inline">{previewMode === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          {/* Explicit Save All Changes Button */}
          <button
            onClick={handleSaveGlobalCMS}
            disabled={isSavingGlobal}
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            title="Save all CMS text & project edits globally to Neon DB (Cmd+S)"
          >
            {isSavingGlobal ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                <span>Save All Changes</span>
              </>
            )}
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3 sm:px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold shadow-md hover:scale-102 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View Public Site</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleAdminLogout}
            className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            title="Log out of Admin Studio"
          >
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN STUDIO LAYOUT (Sidebar + Main Content Canvas)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">

        {/* Mobile Backdrop Overlay */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* LEFT SIDEBAR HIERARCHY */}
        <aside
          className={cn(
            "bg-glass-bg border-r border-glass-border p-4 flex flex-col justify-between shrink-0 space-y-4 overflow-y-auto min-h-0 transition-transform duration-300 z-50",
            "fixed inset-y-0 left-0 w-72 lg:static lg:w-64",
            isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 hidden lg:flex"
          )}
        >
          <div className="space-y-6">
            
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                Enterprise Studio
              </span>

              <button
                onClick={() => handleSelectTab("dashboard")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "dashboard" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>

              <button
                onClick={() => handleSelectTab("pages")}
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
                      id={`admin-subtab-${pg.id}`}
                      onClick={() => handleSelectPage(pg.id as PageSubTab)}
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
                onClick={() => handleSelectTab("media")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "media" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <ImageIcon className="w-4 h-4" /> Media Library
              </button>

              <button
                onClick={() => handleSelectTab("projects")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "projects" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Folder className="w-4 h-4" /> Projects
              </button>

              <button
                onClick={() => handleSelectTab("partners")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "partners" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Sparkles className="w-4 h-4" /> Alliance / Products
              </button>

              <button
                onClick={() => handleSelectTab("documentation")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "documentation" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <FileText className="w-4 h-4" /> Documentation
              </button>

              <button
                onClick={() => handleSelectTab("ai")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "ai" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Terminal className="w-4 h-4" /> AI Assistant
              </button>

              <button
                onClick={() => handleSelectTab("analytics")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "analytics" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Activity className="w-4 h-4" /> Analytics
              </button>

              <button
                onClick={() => handleSelectTab("users")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "users" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Users className="w-4 h-4" /> Users & Roles
              </button>

              <button
                onClick={() => handleSelectTab("appearance")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "appearance" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Palette className="w-4 h-4" /> Appearance
              </button>

              <button
                onClick={() => handleSelectTab("settings")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "settings" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <Settings className="w-4 h-4" /> Settings
              </button>

              <button
                onClick={() => handleSelectTab("version-history")}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer text-left",
                  mainTab === "version-history" ? "bg-accent-blue text-white shadow-md" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                <History className="w-4 h-4" />
                <span className="flex-1">Version History</span>
                {cms.snapshots.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue text-[9px] font-mono font-bold">
                    {cms.snapshots.length}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* System Snapshots */}
          <div className="p-3 rounded-2xl bg-bg-secondary/60 border border-glass-border space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-text-muted">Version Control</span>
              <span className="text-[9px] font-mono text-accent-blue font-bold">
                {cms.snapshots.length} saved
              </span>
            </div>
            <button
              onClick={() => {
                const name = `Backup - ${new Date().toLocaleString()}`;
                const projectsData = JSON.stringify(useProjectsStore.getState().projects);
                createSnapshot(name, "Manual Admin Backup", projectsData, "manual");
                showToast(`✓ Saved version: ${name}`);
              }}
              className="w-full py-1.5 rounded-lg bg-glass-bg border border-glass-border text-text-primary text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-bg-secondary transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-accent-blue" /> Save Version
            </button>
            <button
              onClick={() => setMainTab("version-history")}
              className="w-full py-1 rounded-lg text-accent-blue text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-accent-blue/5 transition-colors cursor-pointer"
            >
              View History →
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CANVAS */}
        <main className="flex-1 w-full min-w-0 p-3 sm:p-6 overflow-y-auto space-y-6 min-h-0">
          
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

              {/* Real Empirical Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 space-y-2 border-emerald-500/30 bg-emerald-500/5">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Active Visitors
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">{visitorTelemetry.active}</div>
                  <span className="text-[10px] text-emerald-400/80 font-mono font-bold">● Live Online Now</span>
                </GlassCard>

                <GlassCard className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Total Pageviews</span>
                  <div className="text-2xl font-bold font-mono text-text-primary">{visitorTelemetry.totalPageviews.toLocaleString()}</div>
                  <span className="text-[10px] text-accent-blue font-mono font-bold">Empirical Database Count</span>
                </GlassCard>

                <GlassCard className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Unique Visitors</span>
                  <div className="text-2xl font-bold font-mono text-text-primary">{visitorTelemetry.totalUnique.toLocaleString()}</div>
                  <span className="text-[10px] text-purple-400 font-mono font-bold">Persistent Session Count</span>
                </GlassCard>

                <GlassCard className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-text-muted block">Active Projects</span>
                  <div className="text-2xl font-bold font-mono text-text-primary">{projects.length}</div>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">Catalog Inventory</span>
                </GlassCard>
              </div>

              {/* Real-time Active Sessions Table */}
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" /> Live Visitor Telemetry Sessions ({visitorTelemetry.active} Active)
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Auto-polling every 3s
                  </span>
                </div>

                {visitorTelemetry.recentSessions.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-text-secondary">
                    📡 Active Session Telemetry connected. Waiting for visitor pings...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10 text-text-muted text-[10px] uppercase">
                          <th className="pb-2">Session ID</th>
                          <th className="pb-2">Device</th>
                          <th className="pb-2">Browser</th>
                          <th className="pb-2">Current Route</th>
                          <th className="pb-2">Pageviews</th>
                          <th className="pb-2 text-right">Last Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {visitorTelemetry.recentSessions.map((sess, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 font-bold text-accent-blue">{sess.sessionId.substring(0, 16)}</td>
                            <td className="py-2.5 capitalize text-text-primary">
                              {sess.deviceType === "mobile" ? "📱 Mobile" : sess.deviceType === "tablet" ? "タブ Tablet" : "💻 Desktop"}
                            </td>
                            <td className="py-2.5 text-text-secondary">{sess.browserName}</td>
                            <td className="py-2.5 font-bold text-emerald-400">{sess.pathname}</td>
                            <td className="py-2.5 text-text-primary">{sess.pageviews}</td>
                            <td className="py-2.5 text-right text-text-muted text-[10px]">
                              {sess.lastPing ? `${Math.max(0, Math.round((Date.now() - new Date(sess.lastPing).getTime()) / 1000))}s ago` : "Active now"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                          onChange={(e) => updateHero({ headlinePrefix: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Highlight Word / Phrase</label>
                        <input
                          type="text"
                          value={cms.hero.headlineHighlightWord}
                          onChange={(e) => updateHero({ headlineHighlightWord: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Hero Description Copy</label>
                        <textarea
                          rows={3}
                          value={cms.hero.description}
                          onChange={(e) => updateHero({ description: e.target.value })}
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

              {/* OTHER PAGES: PROJECTS PAGE & CATALOG INVENTORY EDITOR */}
              {activePage === "projects-page" && (
                <div className="space-y-6">
                  {/* HEADER & HERO COPY EDITOR */}
                  <GlassCard className="p-6 space-y-5 text-left border border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Folder className="w-5 h-5 text-accent-blue" /> Catalog Page Header & Hero Customization
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue font-bold border border-accent-blue/20">
                        Live Sync Enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Header Badge Text</label>
                        <input
                          type="text"
                          value={cms.projectsPage?.badgeText || "FEATURED PRODUCTS"}
                          onChange={(e) => updateProjectsPage({ badgeText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-bg-secondary text-xs font-bold border border-white/5 focus:border-accent-blue outline-none"
                          placeholder="e.g. FEATURED PRODUCTS"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Catalog Main Headline</label>
                        <input
                          type="text"
                          value={cms.projectsPage?.title || "Next-Generation Enterprise Stack"}
                          onChange={(e) => updateProjectsPage({ title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-bg-secondary text-xs font-bold border border-white/5 focus:border-accent-blue outline-none"
                          placeholder="e.g. Next-Generation Enterprise Stack"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Catalog Description / Subtitle Copy</label>
                      <textarea
                        rows={3}
                        value={cms.projectsPage?.description || "Explore world-class autonomous systems, managed cloud platforms, payment engines, and developer infrastructure powered by Kiwik."}
                        onChange={(e) => updateProjectsPage({ description: e.target.value })}
                        className="w-full p-3 rounded-xl bg-bg-secondary text-xs font-medium border border-white/5 focus:border-accent-blue outline-none"
                        placeholder="Describe your project catalog..."
                      />
                    </div>
                  </GlassCard>

                  {/* 3D SHOWCASE SLIDER MEDIA & IMAGES STUDIO */}
                  <GlassCard className="p-6 space-y-6 text-left border border-white/10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-accent-cyan" /> Catalog 3D Showcase Slider & Media Studio
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Post, update, or change photos/images, titles, tags, and domain handles displayed in the 3D card stream on the /projects page.
                        </p>
                      </div>
                      <button
                        id="admin-btn-add-slider-card"
                        onClick={() => {
                          const newCard = {
                            id: `slider-card-${Date.now()}`,
                            name: "New Showcase Product",
                            tag: "Autonomous AI Engine",
                            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
                            domain: "newproduct.ai",
                            gradient: "from-blue-600/30 to-purple-600/30",
                          };
                          addSliderCard(newCard);
                          showToast("Success", "New showcase 3D image card added!");
                        }}
                        className="px-4 py-2 rounded-xl bg-accent-cyan hover:bg-accent-cyan/80 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent-cyan/20 shrink-0"
                      >
                        <Plus className="w-4 h-4" /> + Add Slider Image Card
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {(cms.projectsPage?.sliderCards || []).map((card, idx) => (
                        <div
                          key={card.id}
                          className="p-4 rounded-2xl bg-bg-secondary border border-white/10 space-y-3 relative group"
                        >
                          {/* Top Card Bar with Index & Delete */}
                          <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <span className="text-[10px] font-mono font-bold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-md">
                              Card #{String(idx + 1).padStart(2, "0")}
                            </span>
                            <button
                              onClick={() => {
                                deleteSliderCard(card.id);
                                showToast("Removed", `Deleted 3D card #${idx + 1}`);
                              }}
                              className="text-text-muted hover:text-red-400 p-1 transition-colors cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Image Thumbnail & Media Picker Button */}
                          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/40 border border-white/10 group/img">
                            <img
                              src={card.image}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <button
                                onClick={() => {
                                  openMediaPicker((selectedUrl) => {
                                    updateSliderCard(card.id, { image: selectedUrl });
                                    showToast("Image Updated", `Updated photo for ${card.name}`);
                                  });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer shadow-md"
                              >
                                <Camera className="w-3.5 h-3.5" /> Change Photo / Image
                              </button>
                            </div>
                          </div>

                          {/* Editable Image URL Input fallback */}
                          <div>
                            <label className="text-[10px] font-bold text-text-secondary block mb-1">Image URL / Media Source</label>
                            <input
                              type="text"
                              value={card.image}
                              onChange={(e) => updateSliderCard(card.id, { image: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-bg-primary text-[11px] font-mono text-text-primary border border-white/5 focus:border-accent-cyan outline-none"
                              placeholder="https://..."
                            />
                          </div>

                          {/* Card Name / Title */}
                          <div>
                            <label className="text-[10px] font-bold text-text-secondary block mb-1">Product Name / Title</label>
                            <input
                              type="text"
                              value={card.name}
                              onChange={(e) => updateSliderCard(card.id, { name: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-bg-primary text-xs font-bold text-text-primary border border-white/5 focus:border-accent-cyan outline-none"
                              placeholder="e.g. Meta, Kiwik AI, Vidu"
                            />
                          </div>

                          {/* Tag / Subtitle */}
                          <div>
                            <label className="text-[10px] font-bold text-text-secondary block mb-1">Tag / Subtitle Feature</label>
                            <input
                              type="text"
                              value={card.tag}
                              onChange={(e) => updateSliderCard(card.id, { tag: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-bg-primary text-[11px] font-medium text-text-secondary border border-white/5 focus:border-accent-cyan outline-none"
                              placeholder="e.g. High-Fidelity Motion"
                            />
                          </div>

                          {/* Domain Handle */}
                          <div>
                            <label className="text-[10px] font-bold text-text-secondary block mb-1">Domain Handle / Tagline</label>
                            <input
                              type="text"
                              value={card.domain || ""}
                              onChange={(e) => updateSliderCard(card.id, { domain: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-bg-primary text-[11px] font-mono text-text-secondary border border-white/5 focus:border-accent-cyan outline-none"
                              placeholder="e.g. kiwik.ai"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* PROJECTS INVENTORY, PICTURES & REORDERING STUDIO */}
                  <GlassCard className="p-6 space-y-6 text-left border border-white/10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                          <Layers className="w-5 h-5 text-accent-blue" /> Central Projects Inventory, Pictures & Ordering Studio
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Directly edit titles, upload pictures, sort order, priority, categories, status, and launch full spec builder.
                        </p>
                      </div>
                    </div>

                    {/* FILTER & SEARCH BAR */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search projects by name, tagline, or slug..."
                          value={projectSearchQuery}
                          onChange={(e) => setProjectSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-bg-secondary text-xs text-text-primary border border-white/5 focus:border-accent-blue outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs font-bold text-text-secondary whitespace-nowrap">Category:</span>
                        <select
                          value={projectCategoryFilter}
                          onChange={(e) => setProjectCategoryFilter(e.target.value as any)}
                          className="px-3 py-2 rounded-xl bg-bg-secondary text-xs font-bold text-text-primary border border-white/5 outline-none cursor-pointer w-full sm:w-auto"
                        >
                          <option value="all">All Categories</option>
                          <option value="web">Web</option>
                          <option value="ai">AI</option>
                          <option value="saas">SaaS</option>
                          <option value="mobile">Mobile</option>
                          <option value="automation">Automation</option>
                          <option value="devops">DevOps</option>
                          <option value="payments">Payments</option>
                          <option value="research">Research</option>
                        </select>
                      </div>
                    </div>

                    {/* PROJECTS LIST TABLE / CARDS */}
                    <div className="space-y-4">
                      {projects
                        .filter((p) => {
                          const matchesSearch =
                            p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                            p.tagline.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                            p.slug.toLowerCase().includes(projectSearchQuery.toLowerCase());
                          const matchesCategory = projectCategoryFilter === "all" || p.category === projectCategoryFilter;
                          return matchesSearch && matchesCategory;
                        })
                        .map((proj, idx) => (
                          <div
                            key={proj.id}
                            className="p-4 rounded-2xl bg-bg-secondary/60 border border-white/5 hover:border-accent-blue/30 transition-all space-y-4"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              {/* LEFT: COVER PICTURE & BASIC INFO */}
                              <div className="flex items-start gap-4 flex-1">
                                {/* COVER PICTURE PREVIEW & MEDIA PICKER TRIGGER */}
                                <div className="relative group shrink-0 w-24 h-16 rounded-xl overflow-hidden bg-bg-tertiary border border-white/10">
                                  <img
                                    src={proj.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"}
                                    alt={proj.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.target as HTMLElement).setAttribute("src", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80");
                                    }}
                                  />
                                  <button
                                    onClick={() =>
                                      setMediaPickerTarget({
                                        title: `Select Cover Picture for ${proj.name}`,
                                        onSelect: (url) => updateProject(proj.id, { coverImage: url })
                                      })
                                    }
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold text-white transition-opacity gap-1 cursor-pointer"
                                  >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Change</span>
                                  </button>
                                </div>

                                {/* INLINE EDITABLE NAME & TAGLINE */}
                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={proj.name}
                                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                                      className="text-sm font-bold text-text-primary bg-transparent border-b border-transparent hover:border-white/20 focus:border-accent-blue outline-none px-1 py-0.5 rounded w-full max-w-sm"
                                      placeholder="Project Name"
                                    />
                                    <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded-full bg-white/5 border border-white/10 shrink-0">
                                      /{proj.slug}
                                    </span>
                                  </div>

                                  <input
                                    type="text"
                                    value={proj.tagline}
                                    onChange={(e) => updateProject(proj.id, { tagline: e.target.value })}
                                    className="text-xs text-text-secondary bg-transparent border-b border-transparent hover:border-white/20 focus:border-accent-blue outline-none px-1 py-0.5 rounded w-full"
                                    placeholder="Project Tagline"
                                  />
                                </div>
                              </div>

                              {/* MIDDLE: CATEGORY & STATUS & PRIORITY */}
                              <div className="flex items-center gap-3 flex-wrap">
                                {/* CATEGORY DROPDOWN */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-text-secondary block">Category</span>
                                  <select
                                    value={proj.category}
                                    onChange={(e) => updateProject(proj.id, { category: e.target.value as any })}
                                    className="px-2.5 py-1.5 rounded-lg bg-bg-tertiary text-xs font-bold text-text-primary border border-white/10 outline-none cursor-pointer"
                                  >
                                    <option value="web">Web</option>
                                    <option value="ai">AI</option>
                                    <option value="saas">SaaS</option>
                                    <option value="mobile">Mobile</option>
                                    <option value="automation">Automation</option>
                                    <option value="devops">DevOps</option>
                                    <option value="payments">Payments</option>
                                    <option value="research">Research</option>
                                  </select>
                                </div>

                                {/* STATUS DROPDOWN */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-text-secondary block">Status</span>
                                  <select
                                    value={proj.status}
                                    onChange={(e) => updateProject(proj.id, { status: e.target.value as any })}
                                    className="px-2.5 py-1.5 rounded-lg bg-bg-tertiary text-xs font-bold text-text-primary border border-white/10 outline-none cursor-pointer"
                                  >
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Archived</option>
                                  </select>
                                </div>

                                {/* REORDERING & PRIORITY CONTROLS */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-text-secondary block">Order & Priority</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => movePriority(proj.id, "up")}
                                      disabled={idx === 0}
                                      title="Move Up in Catalog"
                                      className="p-1.5 rounded-lg bg-bg-tertiary hover:bg-accent-blue/20 text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors border border-white/10"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => movePriority(proj.id, "down")}
                                      disabled={idx === projects.length - 1}
                                      title="Move Down in Catalog"
                                      className="p-1.5 rounded-lg bg-bg-tertiary hover:bg-accent-blue/20 text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors border border-white/10"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <input
                                      type="number"
                                      value={proj.priority || idx + 1}
                                      onChange={(e) => updateProject(proj.id, { priority: parseInt(e.target.value) || 0 })}
                                      className="w-12 px-2 py-1 rounded-lg bg-bg-tertiary text-xs font-mono font-bold text-center border border-white/10 outline-none"
                                      title="Priority Index (Lower = Higher Rank)"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* RIGHT: TOGGLES & ACTIONS */}
                              <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5 shrink-0">
                                {/* FEATURED TOGGLE */}
                                <button
                                  onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                    proj.featured
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                      : "bg-white/5 text-text-secondary border-white/10 hover:text-text-primary"
                                  }`}
                                  title="Toggle Featured Badge"
                                >
                                  <Star className={`w-3.5 h-3.5 ${proj.featured ? "fill-amber-400 text-amber-400" : ""}`} />
                                  <span>{proj.featured ? "Featured" : "Standard"}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </GlassCard>
                </div>
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

          {/* GLOBAL FULLSCREEN PROJECT STUDIO EDITOR
              Rendered at the top level (not gated behind a specific tab) so it can be
              launched from BOTH the Pages ▸ Projects inventory and the standalone
              Projects tab. As a `fixed inset-0` overlay it covers the whole studio. */}
          {editingProject && (
              <div className="fixed inset-0 top-0 z-50 bg-bg-primary text-text-primary flex flex-col h-screen w-screen text-left overflow-hidden">
                {/* Control bar */}
                <div className="px-6 py-3.5 bg-bg-secondary/40 border-b border-divider flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        showToast("Returned to projects catalog");
                      }}
                      className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary text-text-primary border border-divider cursor-pointer transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="text-[10px] text-text-secondary flex items-center gap-1.5 uppercase font-mono tracking-widest font-bold">
                        <span>Projects Studio Editor</span>
                        <span>/</span>
                        <span className="text-accent font-bold">{editingProject.slug}</span>
                      </div>
                      <h2 className="text-sm font-bold text-text-primary mt-0.5">{editingProject.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const slug = editingProject.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        const updated = { ...editingProject, slug };
                        setEditingProject(updated);
                        updateProject(editingProject.id, updated);
                        showToast(`Derived slug from name: ${slug}`);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-divider text-xs font-bold text-text-primary transition-all cursor-pointer"
                    >
                      Sync Slug
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        showToast("All project specs synchronized successfully!");
                      }}
                      className="px-5 py-2 rounded-xl bg-accent hover:opacity-90 text-xs font-bold text-white cursor-pointer shadow-md transition-all hover:scale-[1.02]"
                    >
                      Publish & Close
                    </button>
                  </div>
                </div>

                {/* Left/Right Split Panel layout */}
                <div className="flex-1 flex min-h-0 overflow-hidden bg-bg-primary">
                  {/* Left panel: Collapsible form builder (440px width) */}
                  <div className="w-[440px] flex-shrink-0 bg-bg-secondary border-r border-divider flex h-full overflow-hidden min-h-0">
                    {/* Tiny Nav list on the left side of the CMS sidebar */}
                    <div className="w-[85px] bg-bg-tertiary border-r border-divider py-4 flex flex-col gap-1 items-center overflow-y-auto no-scrollbar">
                      {editorTabs.map((tab) => {
                        const isSelected = activeEditorTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveEditorTab(tab.id)}
                            title={tab.label}
                            className={cn(
                              "p-2.5 w-16 h-16 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer",
                              isSelected 
                                ? "text-accent bg-accent/10 scale-105 font-bold" 
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-primary/5"
                            )}
                          >
                            {tab.icon}
                            <span className="text-[8px] font-bold text-center truncate w-full">
                              {tab.label.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Editing settings form values */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-bg-primary studio-editor-form min-h-0">
                      {/* Form header */}
                      <div className="border-b border-divider pb-3">
                        <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                          {editorTabs.find(t => t.id === activeEditorTab)?.label || "Specifications"}
                        </h3>
                        <p className="text-[10px] text-text-secondary mt-1">
                          Configure layout parameters and data fields.
                        </p>
                      </div>

                      {/* RENDER ACTIVE TAB EDITOR */}
                      {activeEditorTab === "general" && renderGeneralSection()}
                      {activeEditorTab === "branding" && renderBrandingSection()}
                      {activeEditorTab === "hero" && renderHeroSection()}
                      {activeEditorTab === "overview" && renderOverviewSection()}
                      {activeEditorTab === "telemetry" && renderTelemetrySection()}
                      {activeEditorTab === "quick" && renderQuickActionsSection()}
                      {activeEditorTab === "features" && renderFeaturesSection()}
                      {activeEditorTab === "tech" && renderTechStackSection()}
                      {activeEditorTab === "readme" && renderReadmeSection()}
                      {activeEditorTab === "gallery" && renderGallerySection()}
                      {activeEditorTab === "timeline" && renderTimelineSection()}
                      {activeEditorTab === "contributors" && renderContributorsSection()}
                      {activeEditorTab === "seo" && renderSEOSection()}
                    </div>
                  </div>

                  {/* Right panel: Full real-time live preview (60% width) */}
                  <div className="flex-1 bg-bg-secondary/50 h-full overflow-y-auto relative overscroll-y-contain min-h-0">
                    <div className="absolute top-4 left-4 bg-accent/20 border border-accent/40 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-accent tracking-widest uppercase select-none z-[100] animate-pulse">
                      Live Preview (Updates Instantly)
                    </div>
                    {/* Embed the actual page component passing the modified project object */}
                    <div 
                      className="scale-[0.98] origin-top-left transform w-[102%] h-auto overscroll-y-contain"
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        const anchor = target.closest("a");
                        if (anchor) {
                          e.preventDefault();
                          e.stopPropagation();
                          showToast("Navigation is disabled in Live Preview");
                        }
                      }}
                    >
                      <ProjectDetailContent projectOverride={editingProject} />
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* STANDALONE PROJECTS TAB — catalog list (only when not editing) */}
          {mainTab === "projects" && !editingProject && (
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
                      const newProj: Project = {
                        id: slug,
                        slug,
                        name: "New Kiwik Project",
                        tagline: "High-performance modular service node.",
                        description: "Detailed system architecture parameters and specifications will be updated here.",
                        status: "in-progress" as const,
                        category: "web" as const,
                        lastUpdated: new Date().toISOString().split("T")[0],
                        createdAt: new Date().toISOString().split("T")[0],
                        owner: "Admin",
                        version: "1.0.0",
                        completionPercent: 0,
                        coverImage: "/images/kiwik-cover.jpg",
                        tags: ["web"],
                        images: [],
                        techStack: [],
                        features: [],
                        changelog: [],
                        contributors: [],
                        timeline: [],
                        readme: "# New Project Documentation",
                        stars: 0,
                        forks: 0,
                        views: 0
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

          {/* PARTNERS / ALLIANCE PRODUCTS TAB */}
          {mainTab === "partners" && (
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent-blue" /> Alliance Showcase — Products
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Add and edit the products shown on the public <code className="text-accent-blue">/partners</code> page. Saved globally to the database; each card links to its own detail page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const ts = Date.now();
                    const newProduct: PartnerProduct = {
                      id: `product-${ts}`,
                      slug: `new-product-${ts}`,
                      name: "New Partner Product",
                      tagline: "A short, distinctive one-liner about this work.",
                      category: "Commerce",
                      coverImage:
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                      tags: ["Growth"],
                      accentGradient: "from-accent-blue to-indigo-600",
                      summary: "One line that sells the outcome, not the activity.",
                      body: "## The brief\n\n## What we moved\n\n## The shape of the result\n",
                      metrics: [],
                      sortOrder: partnerProductsList.length,
                    };
                    addProduct(newProduct);
                    showToast("Created new product — edit its details below");
                  }}
                  className="px-4 py-2 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {partnerProductsList.map((prod) => (
                  <GlassCard key={prod.id} className="p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-28 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                        {prod.coverImage && (
                          <img src={prod.coverImage} alt={prod.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <input
                          value={prod.name}
                          onChange={(e) => updateProduct(prod.id, { name: e.target.value })}
                          placeholder="Product name"
                          className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-sm font-bold border border-white/5 focus:border-accent-blue outline-none"
                        />
                        <div className="flex gap-2">
                          <input
                            value={prod.slug}
                            onChange={(e) =>
                              updateProduct(prod.id, {
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                              })
                            }
                            placeholder="slug"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-bg-secondary text-[11px] font-mono text-accent-blue border border-white/5 focus:border-accent-blue outline-none"
                          />
                          <input
                            value={prod.category || ""}
                            onChange={(e) => updateProduct(prod.id, { category: e.target.value })}
                            placeholder="Category"
                            className="w-28 px-3 py-1.5 rounded-lg bg-bg-secondary text-[11px] font-bold border border-white/5 focus:border-accent-blue outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Tagline</label>
                      <input
                        value={prod.tagline}
                        onChange={(e) => updateProduct(prod.id, { tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-xs border border-white/5 focus:border-accent-blue outline-none"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Card summary</label>
                      <input
                        value={prod.summary || ""}
                        onChange={(e) => updateProduct(prod.id, { summary: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-xs border border-white/5 focus:border-accent-blue outline-none"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Cover image URL</label>
                      <div className="flex gap-2">
                        <input
                          value={prod.coverImage}
                          onChange={(e) => updateProduct(prod.id, { coverImage: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none"
                        />
                        <button
                          onClick={() => openMediaPicker((url) => updateProduct(prod.id, { coverImage: url }), "Select cover image")}
                          className="px-3 py-2 rounded-lg bg-bg-tertiary border border-white/10 text-[11px] font-bold hover:bg-bg-secondary cursor-pointer"
                        >
                          Media
                        </button>
                      </div>

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Tags (comma-separated)</label>
                      <input
                        value={(prod.tags || []).join(", ")}
                        onChange={(e) =>
                          updateProduct(prod.id, {
                            tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Detail body (Markdown)</label>
                      <textarea
                        rows={4}
                        value={prod.body || ""}
                        onChange={(e) => updateProduct(prod.id, { body: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none resize-y"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Live URL (optional)</label>
                      <input
                        value={prod.liveUrl || ""}
                        onChange={(e) => updateProduct(prod.id, { liveUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Repository URL (optional)</label>
                      <input
                        value={prod.repoUrl || ""}
                        onChange={(e) => updateProduct(prod.id, { repoUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Logo URL (optional)</label>
                      <input
                        value={prod.logoUrl || ""}
                        onChange={(e) => updateProduct(prod.id, { logoUrl: e.target.value })}
                        placeholder="https://.../logo.svg"
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">
                        Gallery image URLs (one per line)
                      </label>
                      <LineListTextarea
                        serialized={(prod.gallery || []).join("\n")}
                        placeholder="/partners/serenity-1.jpeg"
                        onText={(text) =>
                          updateProduct(prod.id, {
                            gallery: text.split("\n").map((u) => u.trim()).filter(Boolean),
                          })
                        }
                      />
                      <button
                        onClick={() =>
                          openMediaPicker(
                            (url) => updateProduct(prod.id, { gallery: [...(prod.gallery || []), url] }),
                            "Add gallery image"
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-bg-tertiary border border-white/10 text-[11px] font-bold hover:bg-bg-secondary cursor-pointer w-fit"
                      >
                        + Add image from Media
                      </button>

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">
                        Videos — one per line as: url | poster url | title
                      </label>
                      <LineListTextarea
                        rows={3}
                        serialized={(prod.videos || [])
                          .map((v) => [v.url, v.poster || "", v.title || ""].join(" | "))
                          .join("\n")}
                        placeholder="https://.../walkthrough.mp4 | https://.../poster.jpg | Project walkthrough"
                        onText={(text) =>
                          updateProduct(prod.id, {
                            videos: text
                              .split("\n")
                              .map((line) => {
                                // Only the first two separators are structural;
                                // the rest belong to the title, so a title
                                // containing "|" survives a re-save.
                                const parts = line.split("|");
                                return {
                                  url: (parts[0] || "").trim(),
                                  poster: (parts[1] || "").trim() || undefined,
                                  title: parts.slice(2).join("|").trim() || undefined,
                                };
                              })
                              .filter((v) => v.url),
                          })
                        }
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">
                        Brochure PDF URL (optional)
                      </label>
                      <input
                        value={prod.brochureUrl || ""}
                        onChange={(e) => updateProduct(prod.id, { brochureUrl: e.target.value })}
                        placeholder="https://.../brochure.pdf"
                        className="w-full px-3 py-2 rounded-lg bg-bg-secondary text-[11px] font-mono border border-white/5 focus:border-accent-blue outline-none"
                      />

                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">
                        Metrics — one per line as: label | value
                      </label>
                      <LineListTextarea
                        serialized={(prod.metrics || []).map((m) => `${m.label} | ${m.value}`).join("\n")}
                        placeholder="Lakeside estate | 18 Acres"
                        onText={(text) =>
                          updateProduct(prod.id, {
                            metrics: text
                              .split("\n")
                              .map((line) => {
                                // Split on the first separator only, so a value
                                // containing "|" is preserved intact.
                                const i = line.indexOf("|");
                                if (i === -1) return null;
                                return {
                                  label: line.slice(0, i).trim(),
                                  value: line.slice(i + 1).trim(),
                                };
                              })
                              .filter((m): m is { label: string; value: string } => !!m && !!m.label && !!m.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-divider">
                      <a
                        href={`/partners/${prod.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-accent-blue flex items-center gap-1 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </a>
                      <button
                        onClick={() => {
                          deleteProduct(prod.id);
                          showToast(`Deleted product [${prod.name}]`);
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
                  { name: "Vivek Shaganti", role: "Owner", email: "praneeth@kiwik.one" },
                  { name: "Sarah Lin", role: "Admin", email: "praneeth@kiwik.one" },
                  { name: "Alex Mercer", role: "Developer", email: "praneeth@kiwik.one" }
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

          {/* VERSION HISTORY TAB */}
          {mainTab === "version-history" && (() => {
            const filteredSnapshots = cms.snapshots.filter((s) => {
              const matchesFilter = snapshotFilter === "all" || (s.type || "manual") === snapshotFilter;
              const matchesSearch =
                snapshotSearch === "" ||
                s.versionName.toLowerCase().includes(snapshotSearch.toLowerCase()) ||
                (s.note || "").toLowerCase().includes(snapshotSearch.toLowerCase());
              return matchesFilter && matchesSearch;
            });

            const compareSnap = compareSnapshotId ? cms.snapshots.find((s) => s.id === compareSnapshotId) : null;
            const rollbackSnap = rollbackConfirmId ? cms.snapshots.find((s) => s.id === rollbackConfirmId) : null;
            const deleteSnap = deleteConfirmId ? cms.snapshots.find((s) => s.id === deleteConfirmId) : null;

            // Compute diff sections for compare view
            const getDiffSections = () => {
              if (!compareSnap) return [];
              try {
                const snapData = JSON.parse(compareSnap.data);
                const currentData = cms;
                const allKeys = new Set([...Object.keys(snapData), ...Object.keys(currentData)]);
                return Array.from(allKeys)
                  .filter((k) => !["snapshots", "auditLogs", "analytics"].includes(k))
                  .map((key) => {
                    const snapVal = JSON.stringify((snapData as any)[key]);
                    const curVal = JSON.stringify((currentData as any)[key]);
                    return {
                      key,
                      status: snapVal === curVal ? "unchanged" : snapVal === undefined ? "removed" : curVal === undefined ? "added" : "changed",
                      snapPreview: snapVal ? snapVal.slice(0, 120) + (snapVal.length > 120 ? "..." : "") : "—",
                      curPreview: curVal ? curVal.slice(0, 120) + (curVal.length > 120 ? "..." : "") : "—"
                    };
                  });
              } catch { return []; }
            };

            const formatBytes = (bytes?: number) => {
              if (!bytes) return "—";
              if (bytes < 1024) return `${bytes} B`;
              return `${(bytes / 1024).toFixed(1)} KB`;
            };

            const formatDate = (iso: string) => {
              const d = new Date(iso);
              return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
            };

            return (
              <div className="space-y-6 text-left">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-glass-bg border border-glass-border">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-text-primary flex items-center gap-2">
                      <History className="w-5 h-5 text-accent-blue" /> Version History
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Snapshots capture the entire site CMS + projects state. Restore any version instantly.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted">{cms.snapshots.length} total versions</span>
                    <button
                      onClick={() => {
                        const name = versionName.trim() || `Backup - ${new Date().toLocaleString()}`;
                        const projectsData = JSON.stringify(useProjectsStore.getState().projects);
                        createSnapshot(name, versionNote.trim() || "Manual Admin Backup", projectsData, "manual");
                        setVersionName("");
                        setVersionNote("");
                        showToast(`✓ Version saved: ${name}`);
                      }}
                      className="px-5 py-2.5 rounded-full bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <History className="w-4 h-4" /> Save Version
                    </button>
                  </div>
                </div>

                {/* Create Snapshot Form */}
                <GlassCard className="p-5 space-y-4">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-emerald-400" /> Create Named Snapshot
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Version Name</label>
                      <input
                        type="text"
                        value={versionName}
                        onChange={(e) => setVersionName(e.target.value)}
                        placeholder="e.g. Before Homepage Redesign"
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs font-semibold text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-secondary block mb-1">Note / Description</label>
                      <input
                        type="text"
                        value={versionNote}
                        onChange={(e) => setVersionNote(e.target.value)}
                        placeholder="Optional note about what changed..."
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary border border-glass-border text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-text-muted">
                      Captures: CMS content, all sections, projects, media — everything.
                    </p>
                    <button
                      onClick={() => {
                        const name = versionName.trim() || `Snapshot - ${new Date().toLocaleString()}`;
                        const projectsData = JSON.stringify(useProjectsStore.getState().projects);
                        createSnapshot(name, versionNote.trim(), projectsData, "manual");
                        setVersionName("");
                        setVersionNote("");
                        showToast(`✓ Version saved: ${name}`);
                      }}
                      className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow hover:scale-[1.02] transition-all"
                    >
                      <History className="w-3.5 h-3.5" /> Save This Version
                    </button>
                  </div>
                </GlassCard>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search by version name or note..."
                      value={snapshotSearch}
                      onChange={(e) => setSnapshotSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-glass-bg border border-glass-border text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {(["all", "manual", "auto"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setSnapshotFilter(f)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer border",
                          snapshotFilter === f
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-transparent shadow"
                            : "bg-bg-secondary/60 text-text-secondary border-glass-border hover:text-text-primary"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Snapshot List */}
                {filteredSnapshots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3 text-center">
                    <History className="w-10 h-10 text-text-muted opacity-40" />
                    <p className="text-sm font-bold text-text-secondary">No snapshots yet</p>
                    <p className="text-xs text-text-muted max-w-xs">
                      Save a version above to start tracking history. Every save is fully restorable.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSnapshots.map((snap, idx) => (
                      <motion.div
                        key={snap.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={cn(
                          "p-5 rounded-2xl border transition-all",
                          idx === 0
                            ? "bg-emerald-500/5 border-emerald-500/30"
                            : "bg-glass-bg border-glass-border hover:border-white/20"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          {/* Left: Meta */}
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center",
                                idx === 0 ? "bg-emerald-500/15" : "bg-accent-blue/10"
                              )}>
                                {idx === 0 ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <History className="w-4 h-4 text-accent-blue" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-text-primary truncate">{snap.versionName}</h4>
                                {idx === 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-mono font-bold uppercase">
                                    Latest
                                  </span>
                                )}
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase",
                                  (snap.type || "manual") === "auto"
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "bg-accent-blue/10 text-accent-blue"
                                )}>
                                  {snap.type || "manual"}
                                </span>
                              </div>
                              {snap.note && (
                                <p className="text-[11px] text-text-secondary mt-0.5 truncate">{snap.note}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {formatDate(snap.timestamp)}
                                </span>
                                <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                                  <Shield className="w-3 h-3" /> {snap.author}
                                </span>
                                <span className="text-[10px] font-mono text-text-muted">
                                  {formatBytes(snap.sizeBytes)}
                                </span>
                                {snap.projectsData && (
                                  <span className="text-[10px] font-mono text-emerald-400">
                                    ✓ Includes projects
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Compare with Current */}
                            <button
                              onClick={() => setCompareSnapshotId(snap.id === compareSnapshotId ? null : snap.id)}
                              title="Compare with current state"
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border",
                                compareSnapshotId === snap.id
                                  ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                                  : "bg-bg-secondary border-glass-border text-text-secondary hover:text-text-primary hover:border-white/20"
                              )}
                            >
                              <Eye className="w-3.5 h-3.5 inline mr-1" /> Compare
                            </button>

                            {/* Export */}
                            <button
                              onClick={() => {
                                const json = exportSnapshot(snap.id);
                                if (!json) return;
                                const blob = new Blob([json], { type: "application/json" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `kiwik-snapshot-${snap.versionName.replace(/\s+/g, "-").toLowerCase()}-${snap.id}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                                showToast(`✓ Exported: ${snap.versionName}`);
                              }}
                              title="Export as JSON"
                              className="p-2 rounded-lg bg-bg-secondary border border-glass-border text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {/* Rollback */}
                            <button
                              onClick={() => setRollbackConfirmId(snap.id)}
                              title="Restore this version"
                              className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Restore
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteConfirmId(snap.id)}
                              title="Delete this snapshot"
                              className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Compare Diff Panel */}
                        <AnimatePresence>
                          {compareSnapshotId === snap.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-4 border-t border-glass-border space-y-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold text-purple-300 flex items-center gap-2">
                                    <Eye className="w-3.5 h-3.5" /> Diff: This Snapshot vs. Current State
                                  </h5>
                                  <button
                                    onClick={() => setCompareSnapshotId(null)}
                                    className="p-1 rounded hover:bg-white/10 text-text-muted cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 text-[10px] font-mono font-bold uppercase text-text-muted px-2">
                                  <span>Section</span>
                                  <span>Status</span>
                                  <span>Notes</span>
                                </div>
                                <div className="space-y-1 max-h-64 overflow-y-auto no-scrollbar">
                                  {getDiffSections().map(({ key, status, snapPreview, curPreview }) => (
                                    <div key={key} className={cn(
                                      "grid grid-cols-3 gap-2 items-start p-2 rounded-lg text-xs",
                                      status === "unchanged" ? "bg-transparent" : "bg-white/5"
                                    )}>
                                      <span className="font-mono font-bold text-text-secondary truncate">{key}</span>
                                      <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase w-fit",
                                        status === "unchanged" ? "bg-white/5 text-text-muted" :
                                        status === "changed" ? "bg-amber-500/15 text-amber-400" :
                                        status === "added" ? "bg-emerald-500/15 text-emerald-400" :
                                        "bg-rose-500/15 text-rose-400"
                                      )}>
                                        {status}
                                      </span>
                                      {status !== "unchanged" && (
                                        <div className="flex flex-col gap-0.5">
                                          {status === "changed" && (
                                            <span className="text-[10px] text-amber-400/80 truncate font-mono">
                                              was: {snapPreview.slice(0, 50)}
                                            </span>
                                          )}
                                          {status === "changed" && (
                                            <span className="text-[10px] text-emerald-400/80 truncate font-mono">
                                              now: {curPreview.slice(0, 50)}
                                            </span>
                                          )}
                                          {status !== "changed" && (
                                            <span className="text-[10px] text-text-muted truncate font-mono">
                                              {snapPreview.slice(0, 60)}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      {status === "unchanged" && <span />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ROLLBACK CONFIRMATION MODAL */}
                <AnimatePresence>
                  {rollbackConfirmId && rollbackSnap && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.93, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.93, y: 20 }}
                        className="w-full max-w-lg bg-[#0d0f13] border border-white/15 rounded-3xl p-8 shadow-2xl space-y-6 text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                            <RotateCcw className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-text-primary">Restore This Version?</h3>
                            <p className="text-xs text-text-secondary mt-1">
                              You're about to restore the site to:
                            </p>
                            <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                              <div className="text-sm font-bold text-white">{rollbackSnap.versionName}</div>
                              {rollbackSnap.note && (
                                <div className="text-[11px] text-text-secondary">{rollbackSnap.note}</div>
                              )}
                              <div className="text-[10px] font-mono text-text-muted">{formatDate(rollbackSnap.timestamp)}</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 space-y-2">
                          <p className="text-xs font-bold text-amber-400 flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5" /> Current state will be replaced
                          </p>
                          <p className="text-[11px] text-text-secondary">
                            All unsaved changes will be overwritten. Your version history will be preserved.
                          </p>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={autoSaveBeforeRollback}
                              onChange={(e) => setAutoSaveBeforeRollback(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={cn(
                              "w-9 h-5 rounded-full transition-colors",
                              autoSaveBeforeRollback ? "bg-accent-blue" : "bg-white/10"
                            )}>
                              <div className={cn(
                                "w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform shadow",
                                autoSaveBeforeRollback ? "translate-x-4" : "translate-x-0.5"
                              )} />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text-primary">Auto-save current state first</div>
                            <div className="text-[10px] text-text-muted">Creates a recovery checkpoint before restoring</div>
                          </div>
                        </label>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => setRollbackConfirmId(null)}
                            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-glass-border text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (autoSaveBeforeRollback) {
                                const projectsData = JSON.stringify(useProjectsStore.getState().projects);
                                createSnapshot(`Pre-Rollback Backup — ${new Date().toLocaleString()}`, `Auto-saved before restoring to "${rollbackSnap.versionName}"`, projectsData, "auto");
                              }
                              rollbackSnapshot(rollbackConfirmId!);
                              setRollbackConfirmId(null);
                              showToast(`✓ Restored to: ${rollbackSnap.versionName}`);
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore Version
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* DELETE CONFIRMATION MODAL */}
                <AnimatePresence>
                  {deleteConfirmId && deleteSnap && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.93, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.93, y: 20 }}
                        className="w-full max-w-md bg-[#0d0f13] border border-white/15 rounded-3xl p-8 shadow-2xl space-y-6 text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                            <Trash2 className="w-6 h-6 text-rose-400" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-text-primary">Delete This Snapshot?</h3>
                            <p className="text-xs text-text-secondary mt-1">This action cannot be undone.</p>
                            <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10">
                              <div className="text-sm font-bold text-white">{deleteSnap.versionName}</div>
                              <div className="text-[10px] font-mono text-text-muted mt-0.5">{formatDate(deleteSnap.timestamp)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-glass-border text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              deleteSnapshot(deleteConfirmId!);
                              setDeleteConfirmId(null);
                              showToast(`Deleted snapshot: ${deleteSnap.versionName}`);
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-md"
                          >
                            Delete Permanently
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })()}

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
