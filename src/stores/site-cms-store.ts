import { useState, useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useProjectsStore } from "@/stores/projects-store";
import type {
  SiteCMSData,
  WebsiteSettings,
  HeroCMS,
  NavigationCMS,
  NavigationItem,
  FooterCMS,
  FooterColumn,
  FeaturedSectionCMS,
  CapabilitiesCMS,
  CapabilityItem,
  TrustCMS,
  TrustItem,
  HowWeWorkCMS,
  WorkflowStep,
  PageCMS,
  MediaItem,
  ThemeCMS,
  SEOMetadata,
  AuditLogEntry,
  VersionSnapshot,
  HeroMetric,
  ArchitectureNodeCMS
} from "@/types/site-cms-types";

const defaultCMSData: SiteCMSData = {
  settings: {
    siteName: "Kiwik",
    tagline: "The Operating System for Digital Products",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
    copyrightText: "© 2026 Kiwik Inc. All rights reserved.",
    contactEmail: "shagantivivekgoud@gmail.com",
    contactPhone: "+1 (800) 555-KIWIK",
    address: "San Francisco, CA & Remote Global",
    version: "1.0.0-beta",
    defaultLanguage: "en",
    availableLanguages: ["en", "es", "fr", "de", "ja"]
  },
  hero: {
    versionBadge: "Kiwik.1 v1.0.0-beta",
    badgeVisible: true,
    badgeLink: "/projects",
    headlinePrefix: "The Operating System",
    headlineHighlightWord: "for",
    rotatingWords: [
      "Digital Products.",
      "AI Platforms.",
      "Enterprise Apps.",
      "Automation.",
      "Research.",
      "Innovation.",
      "Developer Tools.",
      "Cloud Infrastructure."
    ],
    description:
      "Build. Ship. Document. Scale. Everything. Unified workspace for projects, documentation, deployments, analytics, and AI assistant layers.",
    primaryButton: {
      id: "btn-primary",
      text: "Explore Projects",
      link: "/projects",
      variant: "primary",
      iconName: "ArrowRight",
      visible: true
    },
    secondaryButton: {
      id: "btn-secondary",
      text: "Watch Overview",
      link: "#overview",
      variant: "secondary",
      iconName: "Play",
      visible: true
    },
    metrics: [
      { id: "m1", val: 24, suffix: "+", label: "Projects", decimals: 0 },
      { id: "m2", val: 1.2, suffix: "M+", label: "Visitors", decimals: 1 },
      { id: "m3", val: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
      { id: "m4", val: 42, suffix: "ms", label: "Latency", decimals: 0 }
    ],
    orbLogoUrl: "/logo.png",
    orbTitle: "KIWIK.1",
    backgroundIntensity: "medium",
    animationSpeedSeconds: 2.5,
    galleryImages: [
      { id: "g1", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop", title: "Hyper Crimson Sneaker", linkUrl: "/projects" },
      { id: "g2", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", title: "Porcelain Roses", linkUrl: "/projects" },
      { id: "g3", url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop", title: "Liquid Chroma", linkUrl: "/projects" },
      { id: "g4", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop", title: "Patent Gloss Portrait", linkUrl: "/projects" },
      { id: "g5", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop", title: "Holographic Waves", linkUrl: "/projects" },
      { id: "g6", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop", title: "Crimson Velvet", linkUrl: "/projects" },
      { id: "g7", url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop", title: "Botanical Specimen", linkUrl: "/projects" },
      { id: "g8", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&auto=format&fit=crop", title: "Luminous Jellyfish", linkUrl: "/projects" },
      { id: "g9", url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600&auto=format&fit=crop", title: "Emerald Canopy", linkUrl: "/projects" },
      { id: "g10", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", title: "Fluid 3D Prism", linkUrl: "/projects" }
    ],
    gallerySpeed: 0.075,
    gallerySpacing: 7,
    galleryPerspective: 0.28,
    galleryOpacity: 0.85,
    galleryBlur: 0,
    galleryScale: 1.35
  },
  promptBar: {
    placeholder: "Brief our AI agent...",
    buttonLabel: "Submit Prompt",
    gradientStart: "#fb923c",
    gradientMiddle: "#ec4899",
    gradientEnd: "#818cf8",
    rotatingWords: [
      "Design a product launch campaign for a new sneaker drop...",
      "Build an autonomous AI agent workflow for customer onboarding...",
      "Generate a 3D glassmorphic dashboard design system...",
      "Architect a zero-latency serverless cloud infrastructure..."
    ],
    suggestionChips: [
      "Launch campaign",
      "AI onboarding",
      "Glassmorphic design",
      "Cloud architecture"
    ],
    iconName: "Sparkles",
    buttonIcon: "ArrowRight",
    buttonLink: "/projects"
  },
  navigation: {
    logoText: "Kiwik.1",
    logoUrl: "/logo.png",
    items: [
      { id: "nav-1", label: "Projects", href: "/projects", iconName: "Folder", order: 1, visible: true },
      { id: "nav-alliance", label: "Alliance", href: "/partners", iconName: "Sparkles", order: 2, visible: true },
      { id: "nav-2", label: "Capabilities", href: "#capabilities", iconName: "Cpu", order: 3, visible: true },
      { id: "nav-3", label: "How We Work", href: "#how-we-work", iconName: "Workflow", order: 3, visible: true },
      { id: "nav-4", label: "Docs", href: "/docs", iconName: "FileText", order: 4, visible: true },
      { id: "nav-5", label: "Admin CMS", href: "/admin", iconName: "Shield", badge: "CMS", order: 5, visible: true }
    ],
    ctaButtonText: "Ask Kiwik AI",
    ctaButtonHref: "#ai",
    ctaButtonVisible: true
  },
  featuredSection: {
    title: "Explore Kiwik Products",
    subtitle: "Understand what each product does, who it helps, its current status, and request real-time access. Fully synchronised with the Admin CMS panel."
  },
  capabilities: {
    sectionTitle: "Our Capabilities",
    items: [
      { id: "cap-1", title: "AI & Knowledge Systems", desc: "Semantic context vector indexing and voice transcription mappings.", iconName: "Sparkles" },
      { id: "cap-2", title: "Identity & Security Services", desc: "Secure OAuth authorization hooks and granular serverless database access rules.", iconName: "Shield" },
      { id: "cap-3", title: "Automation & Workflows", desc: "Event-driven edge action pipelines and cron automation routines.", iconName: "Workflow" },
      { id: "cap-4", title: "Cloud & DevOps Infrastructure", desc: "High-performance CDN setups, edge caching rules, and serverless builds.", iconName: "Cloud" }
    ]
  },
  trust: {
    sectionTitle: "Trust & Delivery",
    items: [
      { id: "tr-1", title: "Real products, real deployments", desc: "No vaporware. Complete and functional static components linked live." },
      { id: "tr-2", title: "Security first architecture", desc: "Built-in sanitization, credentials protection, and secure data routing." },
      { id: "tr-3", title: "Scalable systems designed for growth", desc: "Edge functions and database structures designed to handle production spikes." },
      { id: "tr-4", title: "Ongoing support and optimization", desc: "Continuous profiling of latency, edge cache ratios, and framework migrations." }
    ]
  },
  howWeWork: {
    badge: "Execution Workflow",
    sectionTitle: "How We Work",
    steps: [
      { id: "sw-1", step: "01", title: "Discover", desc: "We understand your goals, target architecture, and edge constraints." },
      { id: "sw-2", step: "02", title: "Design", desc: "We design high-fidelity components, micro-interactions, and interface flows." },
      { id: "sw-3", step: "03", title: "Build", desc: "We build with extreme quality, component reusability, and Next.js static engine speeds." },
      { id: "sw-4", step: "04", title: "Secure", desc: "We secure telemetry endpoints, Firestore rule configurations, and credentials." },
      { id: "sw-5", step: "05", title: "Operate", desc: "We monitor production latency, optimize edge hits, and provide continuous support." }
    ]
  },
  footer: {
    columns: [
      {
        id: "col-1",
        title: "Product",
        links: [
          { id: "fl-1", label: "Projects Ecosystem", href: "/projects" },
          { id: "fl-2", label: "Desktop Dashboard", href: "/#macos-dashboard-widget" },
          { id: "fl-3", label: "AI Assistant Panel", href: "/#ai" },
          { id: "fl-4", label: "Telemetry Engine", href: "/admin" }
        ]
      },
      {
        id: "col-2",
        title: "Documentation",
        links: [
          { id: "fl-5", label: "Getting Started", href: "/#docs" },
          { id: "fl-6", label: "Architecture Spec", href: "/#docs" },
          { id: "fl-7", label: "Kiwik CLI v2.0", href: "/#docs" },
          { id: "fl-8", label: "API Reference", href: "/#docs" }
        ]
      },
      {
        id: "col-3",
        title: "Company & Legal",
        links: [
          { id: "fl-9", label: "About Kiwik", href: "/#about" },
          { id: "fl-10", label: "Privacy Policy", href: "/privacy" },
          { id: "fl-11", label: "Terms of Service", href: "/terms" },
          { id: "fl-12", label: "Security & SOC 2", href: "/security" }
        ]
      }
    ],
    socialLinks: [
      { id: "soc-1", platform: "GitHub", url: "https://github.com/shagantivivekgoud", iconName: "Github" },
      { id: "soc-2", platform: "Twitter / X", url: "https://twitter.com", iconName: "Twitter" },
      { id: "soc-3", platform: "LinkedIn", url: "https://linkedin.com", iconName: "Linkedin" }
    ],
    copyrightText: "© 2026 Kiwik Inc. All rights reserved.",
    newsletterHeadline: "Stay Updated with Kiwik Releases",
    newsletterDescription: "Subscribe for new project updates, AI telemetry enhancements, and OS features.",
    newsletterButtonText: "Subscribe",
    policyBadges: ["SOC 2 TYPE II CERTIFIED", "256-BIT ENCRYPTION", "EDGE ACCELERATED"],
    logoText: "Kiwik",
    logoUrl: "/logo.png",
    statusBadgeText: "All Systems Operational",
    statusBadgeVisible: true,
    contactEmail: "hello@kiwik.dev",
    contactPhone: "+1 (800) 555-KIWIK",
    address: "Internet, Everywhere",
    bottomLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" }
    ],
    newsletterPlaceholder: "Enter your email",
    newsletterApiEndpoint: "/api/subscribe",
    newsletterSuccessMessage: "Subscribed successfully!",
    newsletterFailureMessage: "Subscription failed, try again."
  },
  pages: [
    {
      id: "page-home",
      slug: "/",
      title: "Kiwik.1 - The Operating System for Digital Products",
      description: "Unified workspace for projects, documentation, deployments, analytics, and AI assistant layers.",
      sections: [
        {
          id: "sec-hero",
          type: "hero",
          title: "The Operating System for Digital Products",
          content: "Build. Ship. Document. Scale. Everything.",
          visible: true,
          order: 1
        }
      ],
      metaTitle: "Kiwik.1 | Operating System for Digital Products",
      metaDescription: "Unified workspace for projects, documentation, deployments, analytics, and AI assistant layers.",
      ogImage: "/images/og-kiwik.jpg",
      published: true,
      lastUpdated: new Date().toISOString()
    }
  ],
  media: [
    {
      id: "med-1",
      name: "Kiwik Logo",
      url: "/logo.png",
      type: "image",
      sizeBytes: 12400,
      mimeType: "image/png",
      folder: "Branding",
      tags: ["logo", "brand", "icon"],
      createdAt: new Date().toISOString()
    }
  ],
  theme: {
    mode: "system",
    colors: {
      primary: "#06070a",
      secondary: "#f2f5f9",
      accentBlue: "#3b82f6",
      accentCyan: "#06b6d4",
      accentIndigo: "#6366f1",
      glassBgLight: "rgba(255, 255, 255, 0.75)",
      glassBorderLight: "rgba(0, 0, 0, 0.08)",
      glassBgDark: "rgba(18, 20, 29, 0.75)",
      glassBorderDark: "rgba(255, 255, 255, 0.12)"
    },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      monoFont: "JetBrains Mono",
      baseFontSizePx: 16
    },
    glassBlurPx: 20,
    borderRadiusPx: 16,
    glowIntensity: "vibrant"
  },
  seo: {
    defaultTitle: "Kiwik.1 | Operating System for Digital Products",
    titleTemplate: "%s | Kiwik.1",
    defaultDescription: "Unified workspace for projects, documentation, deployments, analytics, and AI assistant layers.",
    defaultKeywords: ["Kiwik", "Operating System", "Developer Tools", "AI", "Projects"],
    openGraphImage: "/images/og-kiwik.jpg",
    twitterHandle: "@shagantivivekgoud",
    canonicalDomain: "https://kiwik-xi.vercel.app",
    robotsTxt: "User-agent: *\nAllow: /",
    jsonLdSchema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Kiwik.1 OS",
      operatingSystem: "Web",
      applicationCategory: "DeveloperApplication"
    })
  },
  deviceShowcase: {
    topBadgeText: "No Credit Card Required",
    cards: [
      {
        id: "dev-1",
        name: "John Richardson",
        role: "Co-Founder",
        quote: "Angel investor in San Antonio, TX",
        tag: "Founder",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        frameOverlayUrl: "https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048",
        accentColor: "#3b82f6",
        description: "Investing in web3 companies focused on DeFi systems and infrastructure.",
        backgroundColor: "#ffffff",
        visible: true,
        order: 1,
        template: "investor",
        subitems: [
          { title: "Cooperative", subtitle: "Project description here." },
          { title: "Ikigai Labs", subtitle: "Project description here." }
        ],
        blocks: [
          {
            id: "blk-1",
            type: "projects",
            title: "Projects Funded",
            visible: true,
            items: [
              { title: "Cooperative", subtitle: "Project description here." },
              { title: "Ikigai Labs", subtitle: "Project description here." }
            ]
          }
        ]
      },
      {
        id: "dev-2",
        name: "Jet Hawken",
        role: "Product Designer",
        quote: "Product Designer & UI UX Expert",
        tag: "Design",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        frameOverlayUrl: "https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048",
        accentColor: "#2563eb",
        description: "A seasoned designer with 15 years experience specializing in product design and UI/UX. Known for creating impactful experiences.",
        backgroundColor: "#EBF2FE",
        visible: true,
        order: 2,
        template: "designer",
        subitems: [
          { title: "John Richardson", subtitle: "\"Jet helped us build an incredible platform from start to finish\"" },
          { title: "Leslie Putnam", subtitle: "\"Is so talented and designs so fast, we beat every deadline...\"" }
        ],
        blocks: [
          {
            id: "blk-2",
            type: "testimonial",
            title: "Testimonials",
            visible: true,
            items: [
              { title: "John Richardson", subtitle: "\"Jet helped us build an incredible platform from start to finish\"" },
              { title: "Leslie Putnam", subtitle: "\"Is so talented and designs so fast, we beat every deadline...\"" }
            ]
          }
        ]
      },
      {
        id: "dev-3",
        name: "Leslie Putnam",
        role: "Lead Systems Architect",
        quote: "Product Manager with 15 years of experience.",
        tag: "Engineering",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        frameOverlayUrl: "https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048",
        accentColor: "#3b82f6",
        description: "Leslie Putnam is a Senior PM helping teams of designers, developers and stakeholders hit deadlines and build incredible things.",
        backgroundColor: "#0C0D12",
        visible: true,
        order: 3,
        template: "pm",
        subitems: [
          { title: "Senior Product Manager", subtitle: "Apple", date: "Jan, 2023 - Present" },
          { title: "Product Manager", subtitle: "Meta Platforms", date: "Aug, 2021 - Jan, 2023" }
        ],
        blocks: [
          {
            id: "blk-3",
            type: "experience",
            title: "Experience",
            visible: true,
            items: [
              { title: "Senior Product Manager", subtitle: "Apple", date: "Jan, 2023 - Present" },
              { title: "Product Manager", subtitle: "Meta Platforms", date: "Aug, 2021 - Jan, 2023" }
            ]
          }
        ]
      },
      {
        id: "dev-4",
        name: "Taylor Brown",
        role: "Head of AI Research",
        quote: "Professional botanist sharing plant tips.",
        tag: "AI & ML",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        frameOverlayUrl: "https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048",
        accentColor: "#047857",
        description: "Passionate about plants and sustainability. Through social media, I share expert plant tips and advice.",
        backgroundColor: "#0E1F18",
        visible: true,
        order: 4,
        template: "botanist",
        subitems: [
          { title: "How long have you been a botanist?", subtitle: "I've been passionate about plants for over 8 years." }
        ],
        blocks: [
          {
            id: "blk-4-socials",
            type: "socials",
            visible: true,
            items: [
              { title: "Globe", iconName: "Globe", link: "#" },
              { title: "MessageSquare", iconName: "MessageSquare", link: "#" },
              { title: "Share2", iconName: "Share2", link: "#" },
              { title: "Send", iconName: "Send", link: "#" },
              { title: "Lock", iconName: "Lock", link: "#" }
            ]
          },
          {
            id: "blk-4-faq",
            type: "faq",
            title: "FAQ",
            visible: true,
            items: [
              { title: "How long have you been a botanist?", subtitle: "I've been passionate about plants for over 8 years." }
            ]
          }
        ]
      },
      {
        id: "dev-5",
        name: "Jason Markus",
        role: "Viral Marketer",
        quote: "Viral marketer, helping founders grow their apps.",
        tag: "Growth",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        frameOverlayUrl: "https://framerusercontent.com/images/H2xOBKfRU2M06U4j9LF5WN8z6pA.png?scale-down-to=2048",
        accentColor: "#65a30d",
        description: "I am Jason Markus, a viral marketer specializing in helping founders grow their apps through innovative strategies and modern marketing techniques.",
        backgroundColor: "#0D150B",
        visible: true,
        order: 5,
        template: "marketer",
        subitems: [],
        blocks: [
          {
            id: "blk-5",
            type: "form",
            title: "Contact Jason Markus",
            visible: true
          }
        ]
      }
    ]
  },
  earthShowcase: {
    headline: "Access the largest enterprise telemetry network.",
    description: "Kiwik connects the edge telemetry, managed node clusters, and database replication pipelines on every cloud stack you operate.",
    earthImageUrl: "https://cdn.prod.website-files.com/68513e75563291f5d48ada9b/696df7aeb646a7a2198327de_36fa0c4d18a844367e1911df246f6613_earth.webp",
    stats: [
      { id: "st-1", value: "99.9%", label: "System Uptime", description: "Automated multi-region deployments." },
      { id: "st-2", value: "14ms", label: "Edge Latency", description: "Average edge request roundtrip latency." },
      { id: "st-3", value: "24/7", label: "Monitoring", description: "Operational intelligence and telemetry monitoring." },
      { id: "st-4", value: "3M+", label: "Daily Events", description: "Daily edge events processed and synced." }
    ],
    cta1Text: "Book a demo",
    cta1Href: "/docs",
    cta2Text: "Telemetry integration",
    cta2Href: "/projects",
    overlayOpacity: 0.7,
    blurPx: 0
  },
  architectureNodes: [
    { id: "criska-ai", title: "CriskaAI", subtitle: "Enterprise Intelligence", iconName: "Cpu", color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/30 hover:border-purple-500/60", glow: "shadow-purple-500/10", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30", badgeText: "Active Node", order: 1, visible: true },
    { id: "kiwik", title: "Kiwik", subtitle: "Product & Knowledge Hub", iconName: "Layers", color: "from-cyan-500/20 to-blue-600/5", border: "border-cyan-500/30 hover:border-cyan-500/60", glow: "shadow-cyan-500/10", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30", badgeText: "Active Node", order: 2, visible: true },
    { id: "criska-cloud", title: "CriskaCloud", subtitle: "Cloud & Infrastructure Platform", iconName: "Cloud", color: "from-blue-500/20 to-indigo-600/5", border: "border-blue-500/30 hover:border-blue-500/60", glow: "shadow-blue-500/10", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30", badgeText: "Active Node", order: 3, visible: true },
    { id: "security-identity", title: "Security & Identity", subtitle: "Secure Access & Governance", iconName: "Shield", color: "from-emerald-500/20 to-teal-600/5", border: "border-emerald-500/30 hover:border-emerald-500/60", glow: "shadow-emerald-500/10", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", badgeText: "Active Node", order: 4, visible: true }
  ],
  whyCriskaPills: [
    { id: "w-1", text: "AI-Powered Intelligence", iconName: "Cpu", order: 1, visible: true, color: "text-purple-400" },
    { id: "w-2", text: "Security First", iconName: "Shield", order: 2, visible: true, color: "text-emerald-400" },
    { id: "w-3", text: "Enterprise Ready", iconName: "Layers", order: 3, visible: true, color: "text-amber-400" },
    { id: "w-4", text: "Cloud Native", iconName: "Cloud", order: 4, visible: true, color: "text-accent-blue" },
    { id: "w-5", text: "Scalable by Design", iconName: "Sparkles", order: 5, visible: true, color: "text-pink-400" }
  ],
  dashboardShowcase: {
    sectionTitle: "KIWIK OS Kernel",
    searchPlaceholder: "Search projects, docs, commands...",
    kernelStatusText: "OS Kernel Active",
    systemCoreTechs: ["Next.js", "React", "TS TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Vercel"],
    sectionSubtitle: "Unified Control & Edge Telemetry Console",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    rightPanelImageUrl: "/logo.png",
    dashboardImageUrl: "/logo.png",
    backgroundImageUrl: "",
    labels: ["Kiwik OS", "Telemetry Status", "OS Kernel Active", "System Core:"],
    badges: ["Ready", "Thinking...", "Choose Another Action"],
    cards: []
  },
  aiKnowledge: {
    articles: [
      { id: "k-1", title: "Kiwik Architecture Overview", category: "Core Platform", content: "Kiwik is an enterprise digital product operating system built on Next.js 16, React 19, and Tailwind CSS. It features Zustand telemetry stores, real-time CMS synchronization, and multi-agent AI assistants.", tags: ["architecture", "nextjs", "zustand"], lastUpdated: "2026-07-24" },
      { id: "k-2", title: "CriskaAI Intelligent Copilot", category: "AI Products", content: "CriskaAI provides multimodal reasoning, autonomous workflow triggers, and natural language database mutations across web and cloud backends.", tags: ["criskaai", "copilot", "llm"], lastUpdated: "2026-07-24" },
      { id: "k-3", title: "CriskaPay Infrastructure", category: "Fintech", content: "CriskaPay handles PCI-compliant payments, multi-currency wallets, and subscription metering with sub-second settlement.", tags: ["payments", "fintech", "stripe"], lastUpdated: "2026-07-24" }
    ]
  },
  analytics: {
    totalVisitors: 1248900,
    projectClicks: { "criskaai": 4120, "criskacloud": 2890, "criskapay": 3410, "flowengine": 1980 },
    searches: [
      { query: "criskaai", count: 480, timestamp: "2026-07-24" },
      { query: "payments", count: 320, timestamp: "2026-07-24" },
      { query: "documentation", count: 290, timestamp: "2026-07-24" }
    ],
    aiQueries: [
      { prompt: "How do I deploy CriskaCloud?", count: 180, timestamp: "2026-07-24" },
      { prompt: "What is Kiwik.1 OS?", count: 240, timestamp: "2026-07-24" }
    ],
    countryBreakdown: [
      { country: "United States", flag: "🇺🇸", count: 420000 },
      { country: "Germany", flag: "🇩🇪", count: 180000 },
      { country: "United Kingdom", flag: "🇬🇧", count: 140000 },
      { country: "Japan", flag: "🇯🇵", count: 95000 },
      { country: "India", flag: "🇮🇳", count: 85000 }
    ]
  },
  auditLogs: [
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      userRole: "Super Admin",
      action: "INITIALIZE_CMS",
      section: "System",
      details: "Initialized Kiwik.1 Enterprise Website Content Management System"
    }
  ],
  snapshots: [],
  projectsPage: {
    badgeText: "FEATURED PRODUCTS",
    title: "Next-Generation Enterprise Stack",
    description: "Explore world-class autonomous systems, managed cloud platforms, payment engines, and developer infrastructure powered by Kiwik.",
    sliderCards: [
      {
        id: "heygen",
        name: "HeyGen",
        tag: "Avatar & Video Synthesis",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
        domain: "heygen.ai",
        gradient: "from-amber-600/30 to-rose-600/30",
      },
      {
        id: "vidu",
        name: "Vidu",
        tag: "High-Fidelity Motion",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
        domain: "vidu.ai",
        gradient: "from-emerald-600/30 to-teal-600/30",
      },
      {
        id: "meta",
        name: "Meta",
        tag: "Movie Gen 3D",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        domain: "meta.ai",
        gradient: "from-blue-600/30 to-indigo-600/30",
      },
      {
        id: "x1",
        name: "x1",
        tag: "Grok Vision Engine",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        domain: "x1.ai",
        gradient: "from-orange-600/30 to-amber-600/30",
      },
      {
        id: "lightricks",
        name: "Lightricks",
        tag: "LTX Video Generator",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop",
        domain: "lightricks.ai",
        gradient: "from-sky-600/30 to-blue-600/30",
      },
      {
        id: "runway",
        name: "Runway Gen-3",
        tag: "Cinematic World Models",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
        domain: "runway.ai",
        gradient: "from-purple-600/30 to-indigo-600/30",
      },
      {
        id: "midjourney",
        name: "Midjourney v6",
        tag: "Photorealistic AI Art",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
        domain: "midjourney.ai",
        gradient: "from-pink-600/30 to-purple-600/30",
      }
    ]
  }
};

interface SiteCMSStoreState {
  cms: SiteCMSData;

  // Mutator functions
  setCMS: (cms: SiteCMSData) => void;
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  updateHero: (hero: Partial<HeroCMS>) => void;
  updatePromptBar: (promptBar: Partial<import("@/types/site-cms-types").PromptBarCMS>) => void;
  updateHeroRotatingWords: (words: string[]) => void;
  updateHeroMetric: (id: string, metric: Partial<HeroMetric>) => void;
  
  // Navigation Mutators
  updateNavigation: (nav: Partial<NavigationCMS>) => void;
  addNavItem: (item: NavigationItem) => void;
  updateNavItem: (id: string, item: Partial<NavigationItem>) => void;
  deleteNavItem: (id: string) => void;

  // Sections Mutators
  updateFeaturedSection: (sec: Partial<FeaturedSectionCMS>) => void;
  updateCapabilities: (cap: Partial<CapabilitiesCMS>) => void;
  addCapabilityItem: (item: CapabilityItem) => void;
  updateCapabilityItem: (id: string, item: Partial<CapabilityItem>) => void;
  deleteCapabilityItem: (id: string) => void;

  updateTrust: (tr: Partial<TrustCMS>) => void;
  addTrustItem: (item: TrustItem) => void;
  updateTrustItem: (id: string, item: Partial<TrustItem>) => void;
  deleteTrustItem: (id: string) => void;

  updateHowWeWork: (hww: Partial<HowWeWorkCMS>) => void;
  updateWorkflowStep: (id: string, step: Partial<WorkflowStep>) => void;

  // Device Showcase & Earth Showcase Mutators
  updateDeviceShowcase: (sec: Partial<import("@/types/site-cms-types").DeviceShowcaseCMS>) => void;
  updateDeviceCard: (id: string, card: Partial<import("@/types/site-cms-types").DeviceShowcaseCard>) => void;
  addDeviceCard: (card: import("@/types/site-cms-types").DeviceShowcaseCard) => void;
  deleteDeviceCard: (id: string) => void;

  updateEarthShowcase: (sec: Partial<import("@/types/site-cms-types").EarthShowcaseCMS>) => void;
  updateEarthStat: (id: string, stat: Partial<import("@/types/site-cms-types").StatItem>) => void;

  updateProjectsPage: (sec: Partial<import("@/types/site-cms-types").ProjectsPageCMS>) => void;
  addSliderCard: (card: import("@/types/site-cms-types").MovableSliderCard) => void;
  updateSliderCard: (id: string, updated: Partial<import("@/types/site-cms-types").MovableSliderCard>) => void;
  deleteSliderCard: (id: string) => void;

  // Architecture Nodes Mutators
  updateArchitectureNode: (id: string, node: Partial<ArchitectureNodeCMS>) => void;
  addArchitectureNode: (node: ArchitectureNodeCMS) => void;
  deleteArchitectureNode: (id: string) => void;

  // AI Knowledge Mutators
  addAiKnowledgeArticle: (article: import("@/types/site-cms-types").AIKnowledgeArticle) => void;
  updateAiKnowledgeArticle: (id: string, updated: Partial<import("@/types/site-cms-types").AIKnowledgeArticle>) => void;
  deleteAiKnowledgeArticle: (id: string) => void;

  // Analytics Recording
  recordVisitor: () => void;
  recordProjectClick: (slug: string) => void;
  recordSearch: (query: string) => void;
  recordAiQuery: (prompt: string) => void;

  // Footer & Theme Mutators
  updateFooter: (footer: Partial<FooterCMS>) => void;
  updateTheme: (theme: Partial<ThemeCMS>) => void;
  updateSEO: (seo: Partial<SEOMetadata>) => void;
  
  // Media Mutators
  addMediaItem: (item: MediaItem) => void;
  deleteMediaItem: (id: string) => void;
  
  // Snapshots & Rollback
  createSnapshot: (name: string, note?: string, projectsData?: string, type?: "manual" | "auto") => void;
  rollbackSnapshot: (snapshotId: string) => void;
  deleteSnapshot: (snapshotId: string) => void;
  exportSnapshot: (snapshotId: string) => string | null;
  
  // Audit Trail
  addAuditLog: (action: string, section: string, details: string) => void;

  // Import / Export JSON Backup
  exportJSONBackup: () => string;
  importJSONBackup: (jsonString: string) => boolean;
  resetCMSToDefaults: () => void;
}

export const useSiteCMSStore = create<SiteCMSStoreState>()(
  persist(
    (set, get) => ({
      cms: defaultCMSData,

      setCMS: (newCMS) => {
        set((state) => ({
          cms: { ...state.cms, ...newCMS }
        }));
      },

      updateSettings: (partialSettings) => {
        set((state) => ({
          cms: { ...state.cms, settings: { ...state.cms.settings, ...partialSettings } }
        }));
        get().addAuditLog("UPDATE_SETTINGS", "Website Settings", "Updated website branding & general settings");
      },

      updateHero: (partialHero) => {
        set((state) => ({
          cms: { ...state.cms, hero: { ...state.cms.hero, ...partialHero } }
        }));
        get().addAuditLog("UPDATE_HERO", "Hero Section", "Updated Hero headlines, buttons, or parameters");
      },

      updatePromptBar: (partialPromptBar) => {
        set((state) => ({
          cms: { ...state.cms, promptBar: { ...state.cms.promptBar, ...partialPromptBar } }
        }));
        get().addAuditLog("UPDATE_PROMPT_BAR", "Prompt Bar", "Updated prompt bar settings");
      },

      updateHeroRotatingWords: (words) => {
        set((state) => ({
          cms: { ...state.cms, hero: { ...state.cms.hero, rotatingWords: words } }
        }));
        get().addAuditLog("UPDATE_HERO_WORDS", "Hero Section", `Updated rotating phrases list (${words.length} phrases)`);
      },

      updateHeroMetric: (id, partialMetric) => {
        set((state) => ({
          cms: {
            ...state.cms,
            hero: {
              ...state.cms.hero,
              metrics: state.cms.hero.metrics.map((m) => (m.id === id ? { ...m, ...partialMetric } : m))
            }
          }
        }));
        get().addAuditLog("UPDATE_METRIC", "Hero Section", `Updated metric [${id}]`);
      },

      updateNavigation: (partialNav) => {
        set((state) => ({
          cms: { ...state.cms, navigation: { ...state.cms.navigation, ...partialNav } }
        }));
        get().addAuditLog("UPDATE_NAVIGATION", "Navigation", "Updated navbar settings");
      },

      addNavItem: (item) => {
        set((state) => ({
          cms: {
            ...state.cms,
            navigation: { ...state.cms.navigation, items: [...state.cms.navigation.items, item] }
          }
        }));
        get().addAuditLog("ADD_NAV_ITEM", "Navigation", `Added nav item [${item.label}]`);
      },

      updateNavItem: (id, partialItem) => {
        set((state) => ({
          cms: {
            ...state.cms,
            navigation: {
              ...state.cms.navigation,
              items: state.cms.navigation.items.map((item) => (item.id === id ? { ...item, ...partialItem } : item))
            }
          }
        }));
        get().addAuditLog("UPDATE_NAV_ITEM", "Navigation", `Updated nav item [${id}]`);
      },

      deleteNavItem: (id) => {
        set((state) => ({
          cms: {
            ...state.cms,
            navigation: {
              ...state.cms.navigation,
              items: state.cms.navigation.items.filter((item) => item.id !== id)
            }
          }
        }));
        get().addAuditLog("DELETE_NAV_ITEM", "Navigation", `Deleted nav item [${id}]`);
      },

      updateFeaturedSection: (sec) => {
        set((state) => ({
          cms: { ...state.cms, featuredSection: { ...state.cms.featuredSection, ...sec } }
        }));
        get().addAuditLog("UPDATE_FEATURED_SECTION", "Featured Products", "Updated section headline/subtitle");
      },

      updateCapabilities: (cap) => {
        set((state) => ({
          cms: { ...state.cms, capabilities: { ...state.cms.capabilities, ...cap } }
        }));
        get().addAuditLog("UPDATE_CAPABILITIES", "Capabilities", "Updated capabilities header");
      },

      addCapabilityItem: (item) => {
        set((state) => ({
          cms: {
            ...state.cms,
            capabilities: {
              ...state.cms.capabilities,
              items: [...state.cms.capabilities.items, item]
            }
          }
        }));
        get().addAuditLog("ADD_CAPABILITY", "Capabilities", `Added capability [${item.title}]`);
      },

      updateCapabilityItem: (id, item) => {
        set((state) => ({
          cms: {
            ...state.cms,
            capabilities: {
              ...state.cms.capabilities,
              items: state.cms.capabilities.items.map((c) => (c.id === id ? { ...c, ...item } : c))
            }
          }
        }));
        get().addAuditLog("UPDATE_CAPABILITY", "Capabilities", `Updated capability [${id}]`);
      },

      deleteCapabilityItem: (id) => {
        set((state) => ({
          cms: {
            ...state.cms,
            capabilities: {
              ...state.cms.capabilities,
              items: state.cms.capabilities.items.filter((c) => c.id !== id)
            }
          }
        }));
        get().addAuditLog("DELETE_CAPABILITY", "Capabilities", `Deleted capability [${id}]`);
      },

      updateTrust: (tr) => {
        set((state) => ({
          cms: { ...state.cms, trust: { ...state.cms.trust, ...tr } }
        }));
        get().addAuditLog("UPDATE_TRUST", "Trust & Delivery", "Updated trust header");
      },

      addTrustItem: (item) => {
        set((state) => ({
          cms: {
            ...state.cms,
            trust: {
              ...state.cms.trust,
              items: [...state.cms.trust.items, item]
            }
          }
        }));
        get().addAuditLog("ADD_TRUST", "Trust & Delivery", `Added trust item [${item.title}]`);
      },

      updateTrustItem: (id, item) => {
        set((state) => ({
          cms: {
            ...state.cms,
            trust: {
              ...state.cms.trust,
              items: state.cms.trust.items.map((t) => (t.id === id ? { ...t, ...item } : t))
            }
          }
        }));
        get().addAuditLog("UPDATE_TRUST_ITEM", "Trust & Delivery", `Updated trust item [${id}]`);
      },

      deleteTrustItem: (id) => {
        set((state) => ({
          cms: {
            ...state.cms,
            trust: {
              ...state.cms.trust,
              items: state.cms.trust.items.filter((t) => t.id !== id)
            }
          }
        }));
        get().addAuditLog("DELETE_TRUST_ITEM", "Trust & Delivery", `Deleted trust item [${id}]`);
      },

      updateHowWeWork: (hww) => {
        set((state) => ({
          cms: { ...state.cms, howWeWork: { ...state.cms.howWeWork, ...hww } }
        }));
        get().addAuditLog("UPDATE_HOW_WE_WORK", "How We Work", "Updated workflow header");
      },

      updateWorkflowStep: (id, step) => {
        set((state) => ({
          cms: {
            ...state.cms,
            howWeWork: {
              ...state.cms.howWeWork,
              steps: state.cms.howWeWork.steps.map((s) => (s.id === id ? { ...s, ...step } : s))
            }
          }
        }));
        get().addAuditLog("UPDATE_WORKFLOW_STEP", "How We Work", `Updated step [${id}]`);
      },

      updateFooter: (partialFooter) => {
        set((state) => ({
          cms: { ...state.cms, footer: { ...state.cms.footer, ...partialFooter } }
        }));
        get().addAuditLog("UPDATE_FOOTER", "Footer", "Updated footer columns, links, or copyright");
      },

      updateTheme: (partialTheme) => {
        set((state) => ({
          cms: { ...state.cms, theme: { ...state.cms.theme, ...partialTheme } }
        }));
        get().addAuditLog("UPDATE_THEME", "Theme Engine", "Updated colors, glass blur, or typography");
      },

      updateSEO: (partialSEO) => {
        set((state) => ({
          cms: { ...state.cms, seo: { ...state.cms.seo, ...partialSEO } }
        }));
        get().addAuditLog("UPDATE_SEO", "SEO Manager", "Updated SEO meta tags & schemas");
      },

      addMediaItem: (item) => {
        set((state) => ({
          cms: { ...state.cms, media: [item, ...state.cms.media] }
        }));
        get().addAuditLog("ADD_MEDIA", "Media Library", `Added asset [${item.name}]`);
      },

      deleteMediaItem: (id) => {
        set((state) => ({
          cms: { ...state.cms, media: state.cms.media.filter((m) => m.id !== id) }
        }));
        get().addAuditLog("DELETE_MEDIA", "Media Library", `Deleted media asset [${id}]`);
      },

      updateDeviceShowcase: (sec) => {
        set((state) => ({
          cms: { ...state.cms, deviceShowcase: { ...(state.cms.deviceShowcase || defaultCMSData.deviceShowcase), ...sec } }
        }));
        get().addAuditLog("UPDATE_DEVICE_SHOWCASE", "Device Showcase", "Updated Device Showcase header/badge");
      },

      updateDeviceCard: (id, card) => {
        set((state) => {
          const current = state.cms.deviceShowcase || defaultCMSData.deviceShowcase;
          return {
            cms: {
              ...state.cms,
              deviceShowcase: {
                ...current,
                cards: current.cards.map((c) => (c.id === id ? { ...c, ...card } : c))
              }
            }
          };
        });
        get().addAuditLog("UPDATE_DEVICE_CARD", "Device Showcase", `Updated phone card [${id}]`);
      },

      addDeviceCard: (card) => {
        set((state) => {
          const current = state.cms.deviceShowcase || defaultCMSData.deviceShowcase;
          return {
            cms: {
              ...state.cms,
              deviceShowcase: {
                ...current,
                cards: [...current.cards, card]
              }
            }
          };
        });
        get().addAuditLog("ADD_DEVICE_CARD", "Device Showcase", `Added phone card [${card.name}]`);
      },

      deleteDeviceCard: (id) => {
        set((state) => {
          const current = state.cms.deviceShowcase || defaultCMSData.deviceShowcase;
          return {
            cms: {
              ...state.cms,
              deviceShowcase: {
                ...current,
                cards: current.cards.filter((c) => c.id !== id)
              }
            }
          };
        });
        get().addAuditLog("DELETE_DEVICE_CARD", "Device Showcase", `Deleted phone card [${id}]`);
      },

      updateEarthShowcase: (sec) => {
        set((state) => ({
          cms: { ...state.cms, earthShowcase: { ...(state.cms.earthShowcase || defaultCMSData.earthShowcase), ...sec } }
        }));
        get().addAuditLog("UPDATE_EARTH_SHOWCASE", "Earth Showcase", "Updated Earth section headline/description");
      },

      updateEarthStat: (id, stat) => {
        set((state) => {
          const current = state.cms.earthShowcase || defaultCMSData.earthShowcase;
          return {
            cms: {
              ...state.cms,
              earthShowcase: {
                ...current,
                stats: current.stats.map((s) => (s.id === id ? { ...s, ...stat } : s))
              }
            }
          };
        });
        get().addAuditLog("UPDATE_EARTH_STAT", "Earth Showcase", `Updated Earth stat [${id}]`);
      },

      updateProjectsPage: (sec) => {
        set((state) => ({
          cms: { ...state.cms, projectsPage: { ...(state.cms.projectsPage || defaultCMSData.projectsPage!), ...sec } }
        }));
        get().addAuditLog("UPDATE_PROJECTS_PAGE", "Projects Directory", "Updated Projects page header copy");
      },

      addSliderCard: (card) => {
        set((state) => {
          const current = state.cms.projectsPage || defaultCMSData.projectsPage!;
          const cards = current.sliderCards || [];
          return {
            cms: {
              ...state.cms,
              projectsPage: {
                ...current,
                sliderCards: [...cards, card]
              }
            }
          };
        });
        get().addAuditLog("ADD_SLIDER_CARD", "Projects Directory", `Added slider card [${card.name}]`);
      },

      updateSliderCard: (id, updated) => {
        set((state) => {
          const current = state.cms.projectsPage || defaultCMSData.projectsPage!;
          const cards = current.sliderCards || [];
          return {
            cms: {
              ...state.cms,
              projectsPage: {
                ...current,
                sliderCards: cards.map((c) => (c.id === id ? { ...c, ...updated } : c))
              }
            }
          };
        });
        get().addAuditLog("UPDATE_SLIDER_CARD", "Projects Directory", `Updated slider card [${id}]`);
      },

      deleteSliderCard: (id) => {
        set((state) => {
          const current = state.cms.projectsPage || defaultCMSData.projectsPage!;
          const cards = current.sliderCards || [];
          return {
            cms: {
              ...state.cms,
              projectsPage: {
                ...current,
                sliderCards: cards.filter((c) => c.id !== id)
              }
            }
          };
        });
        get().addAuditLog("DELETE_SLIDER_CARD", "Projects Directory", `Deleted slider card [${id}]`);
      },

      updateArchitectureNode: (id, node) => {
        set((state) => {
          const current = state.cms.architectureNodes || defaultCMSData.architectureNodes;
          return {
            cms: {
              ...state.cms,
              architectureNodes: current.map((n) => (n.id === id ? { ...n, ...node } : n))
            }
          };
        });
        get().addAuditLog("UPDATE_ARCH_NODE", "Ecosystem Pipeline", `Updated node [${id}]`);
      },

      addArchitectureNode: (node) => {
        set((state) => {
          const current = state.cms.architectureNodes || defaultCMSData.architectureNodes;
          return {
            cms: {
              ...state.cms,
              architectureNodes: [...current, node]
            }
          };
        });
        get().addAuditLog("ADD_ARCH_NODE", "Ecosystem Pipeline", `Added node [${node.title}]`);
      },

      deleteArchitectureNode: (id) => {
        set((state) => {
          const current = state.cms.architectureNodes || defaultCMSData.architectureNodes;
          return {
            cms: {
              ...state.cms,
              architectureNodes: current.filter((n) => n.id !== id)
            }
          };
        });
        get().addAuditLog("DELETE_ARCH_NODE", "Ecosystem Pipeline", `Deleted node [${id}]`);
      },

      addAiKnowledgeArticle: (article) => {
        set((state) => {
          const current = state.cms.aiKnowledge || defaultCMSData.aiKnowledge;
          return {
            cms: {
              ...state.cms,
              aiKnowledge: {
                ...current,
                articles: [article, ...current.articles]
              }
            }
          };
        });
        get().addAuditLog("ADD_AI_KNOWLEDGE", "AI Manager", `Added knowledge article [${article.title}]`);
      },

      updateAiKnowledgeArticle: (id, updated) => {
        set((state) => {
          const current = state.cms.aiKnowledge || defaultCMSData.aiKnowledge;
          return {
            cms: {
              ...state.cms,
              aiKnowledge: {
                ...current,
                articles: current.articles.map((a) => (a.id === id ? { ...a, ...updated } : a))
              }
            }
          };
        });
        get().addAuditLog("UPDATE_AI_KNOWLEDGE", "AI Manager", `Updated knowledge article [${id}]`);
      },

      deleteAiKnowledgeArticle: (id) => {
        set((state) => {
          const current = state.cms.aiKnowledge || defaultCMSData.aiKnowledge;
          return {
            cms: {
              ...state.cms,
              aiKnowledge: {
                ...current,
                articles: current.articles.filter((a) => a.id !== id)
              }
            }
          };
        });
        get().addAuditLog("DELETE_AI_KNOWLEDGE", "AI Manager", `Deleted knowledge article [${id}]`);
      },

      recordVisitor: () => {
        set((state) => {
          const analytics = state.cms.analytics || defaultCMSData.analytics;
          return {
            cms: {
              ...state.cms,
              analytics: {
                ...analytics,
                totalVisitors: analytics.totalVisitors + 1
              }
            }
          };
        });
      },

      recordProjectClick: (slug) => {
        set((state) => {
          const analytics = state.cms.analytics || defaultCMSData.analytics;
          const currentClicks = analytics.projectClicks || {};
          return {
            cms: {
              ...state.cms,
              analytics: {
                ...analytics,
                projectClicks: {
                  ...currentClicks,
                  [slug]: (currentClicks[slug] || 0) + 1
                }
              }
            }
          };
        });
      },

      recordSearch: (query) => {
        if (!query.trim()) return;
        set((state) => {
          const analytics = state.cms.analytics || defaultCMSData.analytics;
          const existingIndex = analytics.searches.findIndex((s) => s.query.toLowerCase() === query.toLowerCase());
          let updatedSearches = [...analytics.searches];
          if (existingIndex >= 0) {
            updatedSearches[existingIndex] = {
              ...updatedSearches[existingIndex],
              count: updatedSearches[existingIndex].count + 1,
              timestamp: new Date().toISOString().split("T")[0]
            };
          } else {
            updatedSearches.unshift({ query, count: 1, timestamp: new Date().toISOString().split("T")[0] });
          }
          return {
            cms: {
              ...state.cms,
              analytics: {
                ...analytics,
                searches: updatedSearches.slice(0, 20)
              }
            }
          };
        });
      },

      recordAiQuery: (prompt) => {
        if (!prompt.trim()) return;
        set((state) => {
          const analytics = state.cms.analytics || defaultCMSData.analytics;
          const updated = [{ prompt, count: 1, timestamp: new Date().toISOString().split("T")[0] }, ...analytics.aiQueries];
          return {
            cms: {
              ...state.cms,
              analytics: {
                ...analytics,
                aiQueries: updated.slice(0, 20)
              }
            }
          };
        });
      },

      createSnapshot: (name, note = "", projectsData, type = "manual") => {
        const cmsData = JSON.stringify(get().cms);
        const snapshot: VersionSnapshot = {
          id: `snap-${Date.now()}`,
          timestamp: new Date().toISOString(),
          versionName: name,
          author: "Super Admin",
          note,
          data: cmsData,
          projectsData,
          type,
          sizeBytes: new Blob([cmsData + (projectsData || "")]).size
        };
        set((state) => ({
          cms: { ...state.cms, snapshots: [snapshot, ...state.cms.snapshots] }
        }));
        get().addAuditLog("CREATE_SNAPSHOT", "Version Control", `Created ${type} snapshot [${name}]`);
      },

      exportSnapshot: (snapshotId) => {
        const snapshot = get().cms.snapshots.find((s) => s.id === snapshotId);
        if (!snapshot) return null;
        return JSON.stringify(snapshot, null, 2);
      },

      rollbackSnapshot: (snapshotId) => {
        const snapshot = get().cms.snapshots.find((s) => s.id === snapshotId);
        if (!snapshot) return;
        try {
          const restoredCMS: SiteCMSData = JSON.parse(snapshot.data);
          if (snapshot.projectsData) {
            try {
              const restoredProjects = JSON.parse(snapshot.projectsData);
              if (Array.isArray(restoredProjects)) {
                useProjectsStore.getState().setProjects(restoredProjects);
              }
            } catch (pErr) {
              console.error("Failed to restore projects state from snapshot:", pErr);
            }
          }
          set((state) => ({
            cms: {
              ...restoredCMS,
              snapshots: state.cms.snapshots,
              auditLogs: [
                {
                  id: `log-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  userRole: "Super Admin",
                  action: "ROLLBACK_SNAPSHOT",
                  section: "Version Control",
                  details: `Rolled back site to snapshot [${snapshot.versionName}]`
                },
                ...state.cms.auditLogs
              ]
            }
          }));
        } catch (err) {
          console.error("Failed to restore snapshot:", err);
        }
      },

      deleteSnapshot: (snapshotId) => {
        const snap = get().cms.snapshots.find((s) => s.id === snapshotId);
        set((state) => ({
          cms: { ...state.cms, snapshots: state.cms.snapshots.filter((s) => s.id !== snapshotId) }
        }));
        if (snap) {
          get().addAuditLog("DELETE_SNAPSHOT", "Version Control", `Deleted snapshot [${snap.versionName}]`);
        }
      },

      addAuditLog: (action, section, details) => {
        const log: AuditLogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toISOString(),
          userRole: "Super Admin",
          action,
          section,
          details
        };
        set((state) => ({
          cms: { ...state.cms, auditLogs: [log, ...state.cms.auditLogs.slice(0, 100)] }
        }));
      },

      exportJSONBackup: () => JSON.stringify(get().cms, null, 2),

      importJSONBackup: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed && parsed.settings && parsed.hero) {
            set({ cms: parsed });
            get().addAuditLog("IMPORT_BACKUP", "System Backup", "Restored site CMS from JSON backup");
            return true;
          }
        } catch (err) {
          console.error("Invalid backup JSON format", err);
        }
        return false;
      },

      resetCMSToDefaults: () => set({ cms: defaultCMSData })
    }),
    {
      name: "kiwik-site-cms-v1",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        cms: {
          ...defaultCMSData,
          ...(persistedState?.cms || {}),
          settings: { ...defaultCMSData.settings, ...(persistedState?.cms?.settings || {}) },
          hero: { ...defaultCMSData.hero, ...(persistedState?.cms?.hero || {}) },
          promptBar: { ...defaultCMSData.promptBar, ...(persistedState?.cms?.promptBar || {}) },
          navigation: { ...defaultCMSData.navigation, ...(persistedState?.cms?.navigation || {}) },
          footer: { ...defaultCMSData.footer, ...(persistedState?.cms?.footer || {}) },
          featuredSection: { ...defaultCMSData.featuredSection, ...(persistedState?.cms?.featuredSection || {}) },
          capabilities: { ...defaultCMSData.capabilities, ...(persistedState?.cms?.capabilities || {}) },
          trust: { ...defaultCMSData.trust, ...(persistedState?.cms?.trust || {}) },
          howWeWork: { ...defaultCMSData.howWeWork, ...(persistedState?.cms?.howWeWork || {}) },
          deviceShowcase: { ...defaultCMSData.deviceShowcase, ...(persistedState?.cms?.deviceShowcase || {}) },
          earthShowcase: { ...defaultCMSData.earthShowcase, ...(persistedState?.cms?.earthShowcase || {}) },
          dashboardShowcase: { ...defaultCMSData.dashboardShowcase, ...(persistedState?.cms?.dashboardShowcase || {}) },
          aiKnowledge: { ...defaultCMSData.aiKnowledge, ...(persistedState?.cms?.aiKnowledge || {}) },
          analytics: { ...defaultCMSData.analytics, ...(persistedState?.cms?.analytics || {}) },
          theme: { ...defaultCMSData.theme, ...(persistedState?.cms?.theme || {}) },
          seo: { ...defaultCMSData.seo, ...(persistedState?.cms?.seo || {}) },
          projectsPage: { ...defaultCMSData.projectsPage, ...(persistedState?.cms?.projectsPage || {}) },
          architectureNodes: persistedState?.cms?.architectureNodes || defaultCMSData.architectureNodes,
          whyCriskaPills: persistedState?.cms?.whyCriskaPills || defaultCMSData.whyCriskaPills,
          media: persistedState?.cms?.media || defaultCMSData.media,
          auditLogs: persistedState?.cms?.auditLogs || defaultCMSData.auditLogs,
          snapshots: persistedState?.cms?.snapshots || defaultCMSData.snapshots
        }
      })
    }
  )
);

export function useSiteCMS() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const cms = useSiteCMSStore((state) => state.cms);
  const setCMS = useSiteCMSStore((state) => state.setCMS);

  useEffect(() => {
    setHasHydrated(true);

    // Base cadence for cross-device sync. Kept deliberately conservative and
    // visibility-gated to protect the Neon data-transfer quota (a 5s poll on
    // every open tab is what exhausts a free-tier plan). Backs off hard when
    // the API reports a DB fallback (offline / over quota).
    const POLL_MS = 30000;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = (delay: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(tick, delay);
    };

    async function tick() {
      if (stopped) return;
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        schedule(POLL_MS);
        return;
      }
      try {
        const res = await fetch("/api/cms");
        const data = await res.json();
        if (data.status === "ok" && data.cms) setCMS(data.cms);
        schedule(data.fallback ? POLL_MS * 10 : POLL_MS);
      } catch {
        schedule(POLL_MS * 4);
      }
    }

    tick(); // initial fetch on mount

    const handleFocus = () => tick();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [setCMS]);

  return hasHydrated ? cms : defaultCMSData;
}
