"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight,
  Folder,
  Layers,
  Workflow,
  Search,
  ChevronRight,
  Heart,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects } from "@/stores/projects-store";
import { ProjectImage } from "@/components/ui/project-image";
import { DASHBOARD_COPY, PROCESS_STEPS, SERVICES } from "@/data/home-content";
import { useSiteCMS } from "@/stores/site-cms-store";

type SidebarTab = "overview" | "projects" | "services" | "process";

interface DashboardProject {
  name: string;
  tagline: string;
  status: "live" | "beta" | "in-progress";
  percent: number;
  category: string;
  image: string;
  github?: string;
  liveUrl?: string;
  tech: string[];
}

export function MacosDashboard() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const cms = useSiteCMS();
  const dashboardShowcase = cms.dashboardShowcase || {
    ...DASHBOARD_COPY,
    searchPlaceholder: "Search projects...",
  };
  const services = (cms.capabilities?.items || SERVICES).filter((item) => item.visible !== false);
  const steps = cms.howWeWork?.steps?.length ? cms.howWeWork.steps : PROCESS_STEPS;

  React.useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<SidebarTab>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener("switch-dashboard-tab", handleSwitchTab);
    return () => window.removeEventListener("switch-dashboard-tab", handleSwitchTab);
  }, []);

  const storeProjects = useProjects();

  const getProjectImage = (slug: string) => {
    if (slug === 'kiwik') return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80";
    if (slug === 'helm-events') return "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80";
    if (slug === 'clean-ai') return "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80";
    return "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=400&q=80";
  };

  const projects = storeProjects.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline || p.description,
    status: (p.status === "completed" ? "live" : "in-progress") as "live" | "beta" | "in-progress",
    percent: p.completionPercent || 100,
    category: p.category,
    image: p.coverImage || getProjectImage(p.slug),
    tech: p.techStack ? p.techStack.map(t => t.name).slice(0, 3) : ["React", "TypeScript", "Next.js"],
    github: p.githubUrl,
    liveUrl: p.liveUrl
  }));

  const filteredProjects = projects.filter(p => 
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (name: string) => {
    setFavorites(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "projects", label: "Projects", icon: <Folder className="w-3.5 h-3.5" /> },
    { id: "services", label: "Services", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "process", label: "How we work", icon: <Workflow className="w-3.5 h-3.5" /> }
  ] as const;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-12 mb-16 relative z-30 select-none">
      {/* Outer macOS chrome wrapper */}
      <div className="vision-glass border border-white/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[580px] transform-gpu">
        
        {/* Sidebar Left panel */}
        <aside className="w-full md:w-[220px] bg-bg-secondary/40 border-r border-divider/60 p-4 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* macOS Chrome Close minimize restore buttons */}
            <div className="flex items-center gap-1.5 px-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 cursor-pointer hover:opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 cursor-pointer hover:opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 cursor-pointer hover:opacity-80" />
              <span className="ml-3 text-[10px] font-mono text-text-secondary select-none font-bold uppercase tracking-wider">
                {dashboardShowcase.labels?.[0] || DASHBOARD_COPY.labels[0]}
              </span>
            </div>

            <div className="space-y-0.5">
              {sidebarItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all text-left relative",
                      isActive 
                        ? "text-text-primary bg-neutral-200/50 dark:bg-white/10 shadow-sm" 
                        : "text-text-secondary hover:text-text-primary hover:bg-neutral-200/20 dark:hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dashboardActiveTabPill"
                        className="absolute inset-0 bg-neutral-200/40 dark:bg-white/5 border border-white/5 rounded-xl z-[-1]"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                    <span className={cn(isActive ? "text-accent-blue" : "text-text-secondary")}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-primary/40 border border-glass-border select-none">
            <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest font-bold block mb-1">
              {dashboardShowcase.labels?.[1] || DASHBOARD_COPY.labels[1]}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-text-primary font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{dashboardShowcase.kernelStatusText || `${projects.filter((p) => p.status === "live").length} live, ${projects.filter((p) => p.status !== "live").length} in progress`}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-between min-h-[500px]">
          
          {/* Header search controls */}
          <div className="px-6 py-4 bg-bg-secondary/20 border-b border-divider/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary" />
              <input
                type="text"
                placeholder={dashboardShowcase.searchPlaceholder || "Search projects..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-neutral-200/40 dark:bg-white/5 border border-glass-border focus:outline-none focus:border-accent-blue text-xs font-semibold transition-all"
              />
            </div>

            <Link href="/contact" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-text-primary text-bg-primary text-xs font-bold hover:opacity-85 transition-opacity">
              Start a project <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Main content body view tabs switch */}
          <div className="p-6 flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "projects" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-mono uppercase tracking-widest text-text-secondary font-bold">Featured Projects</h2>
                    <Link href="/projects" className="text-xs text-accent-blue hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                      View All <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {filteredProjects.map((p) => {
                      const fav = favorites.includes(p.name);
                      return (
                        <Link 
                          key={p.id} 
                          href={`/projects/${p.slug}`}
                          className="vision-glass border border-white/50 bg-white/45 dark:bg-bg-secondary/40 rounded-2xl overflow-hidden hover:border-accent-blue/35 transition-all group flex flex-col cursor-pointer"
                        >
                          {/* Image area */}
                          <div className="relative h-28 overflow-hidden border-b border-divider">
                            <ProjectImage 
                              src={p.image} 
                              alt={p.name} 
                              category={p.category}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-glass-bg border border-glass-border backdrop-blur-md">
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                p.status === "live" ? "bg-emerald-500" : "bg-amber-500"
                              )} />
                              <span className="text-[8px] font-mono font-bold capitalize text-text-primary">{p.status.replace("-", " ")}</span>
                            </div>

                            {/* Favorite Button */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                toggleFavorite(p.name);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-glass-bg border border-glass-border hover:bg-glass-bg-hover text-text-secondary transition-colors"
                            >
                              <Heart className={cn("w-3 h-3", fav ? "fill-rose-500 text-rose-500" : "text-text-secondary")} />
                            </button>
                          </div>

                          {/* Body area */}
                          <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                            <div>
                              <h3 className="text-xs font-bold text-text-primary tracking-tight">{p.name}</h3>
                              <p className="text-[10px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">{p.tagline}</p>
                            </div>

                            <div className="pt-2 border-t border-divider flex items-center justify-between text-[9px] font-mono font-bold text-text-secondary select-none">
                              <span>TYPE</span>
                              <span className="text-accent-blue uppercase">{p.category}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 text-left p-4 rounded-2xl bg-bg-secondary/20 border border-glass-border max-w-xl animate-fade-in"
                >
                  <h3 className="text-sm font-bold text-text-primary">
                    {dashboardShowcase.sectionTitle || DASHBOARD_COPY.sectionTitle}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {dashboardShowcase.sectionSubtitle || DASHBOARD_COPY.sectionSubtitle}
                  </p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { value: projects.length, label: "Projects", color: "text-accent-blue" },
                      { value: projects.filter((p) => p.status === "live").length, label: "Live", color: "text-emerald-500" },
                      { value: services.length, label: "Services", color: "text-purple-500" },
                    ].map((fact) => (
                      <div key={fact.label} className="p-3 rounded-xl bg-glass-bg border border-glass-border text-center">
                        <div className={cn("text-lg font-bold", fact.color)}>{fact.value}</div>
                        <div className="text-[11px] text-text-secondary">{fact.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {(activeTab === "services" || activeTab === "process") && (
                <motion.ul
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {(activeTab === "services" ? services : steps).map((item) => (
                    <li key={item.id} className="p-4 rounded-2xl bg-bg-secondary/20 border border-glass-border text-left">
                      <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                      <p className="mt-1 text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
