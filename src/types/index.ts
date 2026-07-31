// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Master Type Definitions
// ─────────────────────────────────────────────────────────────

export type ProjectStatus = "completed" | "in-progress" | "archived" | "private";
export type ProjectCategory = "ai" | "web" | "mobile" | "automation" | "blockchain" | "ml" | "devops" | "research" | "saas" | "open-source";
export type TechCategory = "frontend" | "backend" | "database" | "cloud" | "ai" | "devops" | "auth" | "payments" | "analytics" | "animations";

export interface TechItem {
  name: string;
  logo?: string;
  version?: string;
  category: string;
  docUrl?: string;
  website?: string;
  accentColor?: string;
  tooltip?: string;
  order?: number;
  icon?: string;
  color?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
  id?: string;
  subtitle?: string;
  image?: string;
  accent?: string;
  background?: string;
  order?: number;
  animation?: string;
  visible?: boolean;
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
  bio?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
  contributionPercent?: number;
  featured?: boolean;
  order?: number;
}

export interface TimelineLink {
  label: string;
  url: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  badge?: string;
  image?: string;
  links?: TimelineLink[];
  order?: number;
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
  order?: number;
  clickAction?: string;
  fullscreen?: boolean;
  isVideo?: boolean;
  videoUrl?: string;
  mediaType?: "image" | "video" | "youtube" | "gif";
}

export interface QuickAction {
  label: string;
  icon: string;
  route?: string;
  externalUrl?: string;
  newTab: boolean;
  visible: boolean;
  order: number;
}

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  twitterCard?: string;
  robots?: string;
  schema?: string;
  sitemapPriority?: number;
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

  // General CMS extensions
  priority?: number;
  visible?: boolean;
  sortOrder?: number;
  publishDate?: string;

  // Branding CMS extensions
  logoDark?: string;
  logoLight?: string;
  icon?: string;
  favicon?: string;
  heroBg?: string;
  brandingGradient?: string;
  accentColor?: string;
  themeColor?: string;
  bgPattern?: string;
  thumbnail?: string;
  cardImage?: string;
  ogImage?: string;
  twitterImage?: string;

  // Hero section CMS extensions
  heroBackButtonLabel?: string;
  heroStatusBadge?: string;
  heroVersionBadge?: string;
  heroCategoryBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroBackgroundOverride?: string;
  heroGradient?: string;
  heroCta1Text?: string;
  heroCta1Link?: string;
  heroCta1Icon?: string;
  heroCta1NewTab?: boolean;
  heroCta2Text?: string;
  heroCta2Link?: string;
  heroCta2Icon?: string;
  heroCta2NewTab?: boolean;
  demoUrl?: string;
  repositoryUrl?: string;
  heroBgImage?: string;
  heroBgOverlay?: string;
  heroBgOpacity?: number;
  heroAnimation?: string;

  // Overview CMS extensions
  overviewHeading?: string;
  overviewParagraph?: string;
  overviewRichText?: string;
  overviewMarkdown?: string;
  overviewImage?: string;
  overviewQuote?: string;
  overviewHighlights?: string[];
  overviewCallout?: string;

  // System Telemetry CMS extensions
  telemetryReadingTime?: string;
  telemetryDownloads?: number;
  telemetryHealthStatus?: string;
  telemetryStatusColor?: string;
  telemetryProgress?: number;
  telemetryBadges?: string[];

  // Lists extensions
  quickActions?: QuickAction[];
  seo?: SEOConfig;
}

export type ThemeMode = "dark" | "light";
export type AccentColor = "blue" | "violet" | "emerald" | "orange" | "crimson" | "cyan" | "white";
export type LayoutMode = "grid" | "rows" | "timeline";
export type SortMode = "newest" | "oldest" | "most-viewed" | "recently-updated" | "alphabetical" | "popularity";
