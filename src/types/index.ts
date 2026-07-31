// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Master Type Definitions
// ─────────────────────────────────────────────────────────────

export type ProjectStatus = "completed" | "in-progress" | "archived" | "private";
export type ProjectCategory = "ai" | "web" | "mobile" | "automation" | "blockchain" | "ml" | "devops" | "research" | "saas" | "open-source";
export type TechCategory = "frontend" | "backend" | "database" | "cloud" | "ai" | "devops" | "auth" | "payments" | "analytics" | "animations";

export interface TechItem {
  name: string;
  icon?: string;
  category: TechCategory;
  color?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: "major" | "minor" | "patch";
}

export interface Contributor {
  name: string;
  role: string;
  avatar?: string;
  github?: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  tagline: string;
  description: string;
  longDescription?: string;
  status: ProjectStatus;
  category: ProjectCategory;
  tags: string[];
  version: string;
  completionPercent: number;
  liveUrl?: string;
  githubUrl?: string;
  coverImage: string;
  images: ProjectImage[];
  videos?: string[];
  techStack: TechItem[];
  features: Feature[];
  changelog: ChangelogEntry[];
  contributors: Contributor[];
  timeline: TimelineEntry[];
  readme?: string;
  architecture?: string;
  lastUpdated: string;
  createdAt: string;
  owner: string;
  stars?: number;
  forks?: number;
  views?: number;
  deploymentStatus?: "live" | "staging" | "offline";
  license?: string;
  featured?: boolean;
}

export type ThemeMode = "dark" | "light";
export type AccentColor = "blue" | "violet" | "emerald" | "orange" | "crimson" | "cyan" | "white";
export type LayoutMode = "grid" | "rows" | "timeline";
export type SortMode = "newest" | "oldest" | "most-viewed" | "recently-updated" | "alphabetical" | "popularity";
