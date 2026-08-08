// Kiwik.1 Enterprise Website CMS Data Types & Schemas

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  copyrightText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  version: string;
  defaultLanguage: string;
  availableLanguages: string[];
}

export interface HeroMetric {
  id: string;
  val: number;
  suffix: string;
  label: string;
  decimals: number;
}

export interface HeroButton {
  id: string;
  text: string;
  link: string;
  variant: "primary" | "secondary" | "glass" | "outline";
  iconName: string;
  visible: boolean;
}

export interface FloatingGalleryImage {
  id: string;
  url: string;
  title: string;
  linkUrl?: string;
}

export interface HeroCMS {
  versionBadge: string;
  badgeVisible?: boolean;
  badgeLink?: string;
  headlinePrefix: string;
  headlineHighlightWord: string;
  rotatingWords: string[];
  description: string;
  primaryButton: HeroButton;
  secondaryButton: HeroButton;
  metrics: HeroMetric[];
  orbLogoUrl: string;
  orbTitle: string;
  backgroundIntensity: "low" | "medium" | "high";
  animationSpeedSeconds: number;
  galleryImages: FloatingGalleryImage[];
  gallerySpeed?: number;
  gallerySpacing?: number;
  galleryPerspective?: number;
  galleryOpacity?: number;
  galleryBlur?: number;
  galleryScale?: number;
}

export interface PromptBarCMS {
  placeholder: string;
  buttonLabel: string;
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;
  rotatingWords: string[];
  suggestionChips: string[];
  iconName: string;
  buttonIcon: string;
  buttonLink: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  iconName?: string;
  badge?: string;
  target?: "_self" | "_blank";
  order: number;
  visible: boolean;
}

export interface NavigationCMS {
  /**
   * Bumped in code whenever the shipped navbar changes. Any persisted or
   * database-stored navigation carrying an older value is discarded on load,
   * so a stale cached navbar can never override the current one.
   */
  schemaVersion?: number;
  logoText: string;
  logoUrl: string;
  items: NavigationItem[];
  ctaButtonText: string;
  ctaButtonHref: string;
  ctaButtonVisible: boolean;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  badge?: string;
  target?: "_self" | "_blank";
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
}

export interface FooterCMS {
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  copyrightText: string;
  newsletterHeadline: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  policyBadges: string[];
  logoText?: string;
  logoUrl?: string;
  statusBadgeText?: string;
  statusBadgeVisible?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  bottomLinks?: Array<{ label: string; href: string }>;
  newsletterPlaceholder?: string;
  newsletterApiEndpoint?: string;
  newsletterSuccessMessage?: string;
  newsletterFailureMessage?: string;
}

export interface FeaturedSectionCMS {
  title: string;
  subtitle: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  color?: string;
  category?: string;
  visible?: boolean;
  order?: number;
}

export interface CapabilitiesCMS {
  sectionTitle: string;
  items: CapabilityItem[];
}

export interface TrustItem {
  id: string;
  title: string;
  desc: string;
  iconName?: string;
  order?: number;
  visible?: boolean;
}

export interface TrustCMS {
  sectionTitle: string;
  items: TrustItem[];
}

export interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  desc: string;
  iconName?: string;
  color?: string;
  order?: number;
  visible?: boolean;
}

export interface HowWeWorkCMS {
  badge: string;
  sectionTitle: string;
  steps: WorkflowStep[];
}

export interface SectionBlock {
  id: string;
  type: "hero" | "features" | "stats" | "text" | "gallery" | "cta" | "custom";
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  buttonText?: string;
  buttonHref?: string;
  visible: boolean;
  order: number;
}

export interface PageCMS {
  id: string;
  slug: string;
  title: string;
  description: string;
  sections: SectionBlock[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  published: boolean;
  lastUpdated: string;
}

export interface DeviceBlock {
  id: string;
  type: "resume" | "experience" | "faq" | "testimonial" | "socials" | "form" | "stats" | "timeline" | "gallery" | "skills" | "projects";
  title?: string;
  subtitle?: string;
  description?: string;
  date?: string;
  items?: Array<{ title: string; subtitle?: string; desc?: string; date?: string; link?: string; iconName?: string }>;
  iconName?: string;
  collapsed?: boolean;
  visible?: boolean;
}

export interface DeviceShowcaseCard {
  id: string;
  name: string;
  role: string;
  quote: string;
  tag: string;
  avatarUrl: string;
  frameOverlayUrl: string;
  accentColor: string;
  inputFields?: string[];
  ctaText?: string;
  description?: string;
  buttonLink?: string;
  backgroundColor?: string;
  visible?: boolean;
  order?: number;
  template?: "investor" | "designer" | "pm" | "botanist" | "marketer" | "custom";
  subitems?: Array<{ title: string; subtitle: string; desc?: string; date?: string }>;
  
  // GENERAL settings:
  jobTitle?: string;
  company?: string;
  themeColor?: string;
  phoneFrame?: string;
  phoneSize?: "small" | "medium" | "large";
  
  // HEADER settings:
  onlineBadge?: boolean;
  headerBackground?: string;
  statusBadge?: string;

  // MAIN TITLE & copy:
  supportHeading?: string;
  bodyText?: string;
  highlightText?: string;
  richText?: string;

  // PRIMARY BUTTON:
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  primaryButtonStyle?: "solid" | "glass" | "outline";
  primaryButtonColor?: string;
  primaryButtonIcon?: string;
  primaryButtonNewTab?: boolean;

  // SECONDARY BUTTON:
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
  secondaryButtonIcon?: string;
  secondaryButtonVisible?: boolean;

  // BACKGROUND:
  backgroundImageUrl?: string;
  backgroundGradient?: string;
  backgroundOverlayOpacity?: number;
  backgroundBlur?: number;
  backgroundNoise?: boolean;

  // PROFILE PHOTO:
  profileAltText?: string;

  // DYNAMIC BLOCKS:
  blocks?: DeviceBlock[];
}

export interface DeviceShowcaseCMS {
  topBadgeText: string;
  cards: DeviceShowcaseCard[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface EarthShowcaseCMS {
  headline: string;
  description: string;
  earthImageUrl: string;
  stats: StatItem[];
  cta1Text?: string;
  cta1Href?: string;
  cta2Text?: string;
  cta2Href?: string;
  overlayOpacity?: number;
  blurPx?: number;
}

export interface AIKnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  lastUpdated: string;
}

export interface AIKnowledgeCMS {
  articles: AIKnowledgeArticle[];
}

export interface AnalyticsData {
  totalVisitors: number;
  projectClicks: Record<string, number>;
  searches: Array<{ query: string; count: number; timestamp: string }>;
  aiQueries: Array<{ prompt: string; count: number; timestamp: string }>;
  countryBreakdown: Array<{ country: string; flag: string; count: number }>;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "svg" | "pdf" | "audio" | "document";
  sizeBytes: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  folder: string;
  tags: string[];
  usedIn?: string[];
  createdAt: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accentBlue: string;
  accentCyan: string;
  accentIndigo: string;
  glassBgLight: string;
  glassBorderLight: string;
  glassBgDark: string;
  glassBorderDark: string;
}

export interface TypographyCMS {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  baseFontSizePx: number;
}

export interface ThemeCMS {
  mode: "system" | "light" | "dark";
  colors: ThemeColors;
  typography: TypographyCMS;
  glassBlurPx: number;
  borderRadiusPx: number;
  glowIntensity: "soft" | "medium" | "vibrant";
}

export interface SEOMetadata {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  openGraphImage: string;
  twitterHandle: string;
  canonicalDomain: string;
  robotsTxt: string;
  jsonLdSchema: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: string;
  action: string;
  section: string;
  details: string;
  previousSnapshotId?: string;
}

export interface VersionSnapshot {
  id: string;
  timestamp: string;
  versionName: string;
  author: string;
  note: string;
  data: string;
  /** Serialized JSON of the projects store state at snapshot time */
  projectsData?: string;
  /** Whether this was created manually by admin or auto-saved by the system */
  type?: "manual" | "auto";
  /** Approximate byte size of the snapshot data for display */
  sizeBytes?: number;
}

export interface ArchitectureNodeCMS {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  border: string;
  glow: string;
  badgeColor: string;
  badgeText: string;
  order: number;
  link?: string;
  visible?: boolean;
}

export interface WhyCriskaPillCMS {
  id: string;
  text: string;
  iconName: string;
  order: number;
  visible: boolean;
  color?: string;
}

export interface DashboardShowcaseCMS {
  sectionTitle: string;
  searchPlaceholder: string;
  kernelStatusText: string;
  systemCoreTechs: string[];
  sectionSubtitle?: string;
  dashboardImageUrl?: string;
  rightPanelImageUrl?: string;
  backgroundImageUrl?: string;
  avatarUrl?: string;
  labels?: string[];
  badges?: string[];
  cards?: any[];
}

export interface MovableSliderCard {
  id: string;
  name: string;
  tag: string;
  image: string;
  domain?: string;
  gradient?: string;
}

export interface ProjectsPageCMS {
  badgeText: string;
  title: string;
  description: string;
  sliderCards?: MovableSliderCard[];
}

export interface SiteCMSData {
  settings: WebsiteSettings;
  hero: HeroCMS;
  promptBar: PromptBarCMS;
  navigation: NavigationCMS;
  footer: FooterCMS;
  featuredSection: FeaturedSectionCMS;
  capabilities: CapabilitiesCMS;
  trust: TrustCMS;
  howWeWork: HowWeWorkCMS;
  deviceShowcase: DeviceShowcaseCMS;
  earthShowcase: EarthShowcaseCMS;
  architectureNodes: ArchitectureNodeCMS[];
  whyCriskaPills: WhyCriskaPillCMS[];
  dashboardShowcase: DashboardShowcaseCMS;
  aiKnowledge: AIKnowledgeCMS;
  analytics: AnalyticsData;
  pages: PageCMS[];
  media: MediaItem[];
  theme: ThemeCMS;
  seo: SEOMetadata;
  auditLogs: AuditLogEntry[];
  snapshots: VersionSnapshot[];
  projectsPage?: ProjectsPageCMS;
}
