// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Mock Project Data
// ─────────────────────────────────────────────────────────────

import type { Project } from "@/types";

// Project imagery is served from Supabase Storage rather than the repository,
// so screenshots can be refreshed without a redeploy.
const MEDIA_ROOT =
  "https://ynueobhylfxnilqldisy.supabase.co/storage/v1/object/public/partner-media";

export const projects: Project[] = [
  {
    id: "1",
    slug: "kiwik",
    name: "Kiwik.1",
    tagline: "The Operating System for Modern Projects",
    description:
      "The central command center for every project. A premium portfolio and project management platform featuring cinematic glassmorphism, enterprise-grade architecture, and immersive documentation — designed to feel like a $100M startup product.",
    longDescription:
      "Kiwik.1 is more than a portfolio — it is the operating system that powers the entire Kiwik project ecosystem. Every project, every deployment, every piece of documentation lives here. Built with Next.js 15, React 19, and a custom glassmorphism design system, Kiwik.1 combines the polish of Linear, the aesthetics of Apple, and the power of Vercel into a single platform. The admin CMS lets you manage projects without touching code, while the public-facing showcase delivers a cinematic experience to every visitor.",
    status: "in-progress",
    category: "web",
    tags: ["portfolio", "cms", "dashboard", "glassmorphism", "admin-panel"],
    version: "1.0.0-beta",
    completionPercent: 72,
    liveUrl: "https://kiwik.one",
    githubUrl: "https://github.com/shagantivivekgoud/kiwik",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80", alt: "AI Neural Core", caption: "AI Neural Core & Telemetry" },
      { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80", alt: "Cyber Security Grid", caption: "Zero-Trust Encryption Grid" },
      { src: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80", alt: "Blockchain Node", caption: "Cryptographic Blockchain Ledger" },
    ],
    techStack: [
      { name: "Next.js 15", category: "frontend", color: "#000000" },
      { name: "React 19", category: "frontend", color: "#61DAFB" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Tailwind CSS", category: "frontend", color: "#06B6D4" },
      { name: "Framer Motion", category: "animations", color: "#FF0055" },
      { name: "Zustand", category: "frontend", color: "#764ABC" },
      { name: "PostgreSQL", category: "database", color: "#4169E1" },
      { name: "Prisma", category: "backend", color: "#2D3748" },
      { name: "Node.js", category: "backend", color: "#339933" },
      { name: "JWT", category: "auth", color: "#000000" },
      { name: "Vercel", category: "cloud", color: "#000000" },
      { name: "Docker", category: "devops", color: "#2496ED" },
    ],
    features: [
      { title: "Glassmorphism Engine", description: "Multi-layered glass effects with blur, noise, specular highlights, and mouse-reactive lighting." },
      { title: "Dynamic Theme System", description: "Dark/Light modes with 7 accent color presets. Entire website updates instantly." },
      { title: "Command Palette", description: "⌘K powered global search across projects, docs, tags, and tech stack." },
      { title: "Admin CMS", description: "Full project management with CRUD, media uploads, README editor, and site settings." },
      { title: "Project Showcase", description: "Grid, rows, timeline layouts with 3D tilt cards, filters, and sorting." },
      { title: "README Viewer", description: "Built-in markdown renderer with syntax highlighting, ToC, and Mermaid diagrams." },
      { title: "Analytics Dashboard", description: "Track visitors, views, clicks, and traffic sources with interactive charts." },
      { title: "Enterprise Security", description: "JWT auth, bcrypt hashing, CSRF protection, rate limiting, and audit logs." },
    ],
    changelog: [
      { version: "1.0.0-beta", date: "2025-07-20", title: "Initial Beta Release", changes: ["Core platform architecture", "Glassmorphism design system", "Project showcase with 3 layouts", "Command palette search", "Dynamic theme engine"], type: "major" },
      { version: "0.9.0", date: "2025-07-15", title: "Admin Panel", changes: ["JWT authentication", "Project CRUD operations", "Media manager", "Settings page"], type: "minor" },
      { version: "0.8.0", date: "2025-07-10", title: "Project Details", changes: ["Immersive project detail page", "README viewer", "Image gallery", "Tech stack display"], type: "minor" },
    ],
    contributors: [
      { name: "Vivek Shaganti", role: "Founder & Lead Developer", avatar: "/avatars/vivek.jpg", github: "vivekshaganti" },
      { name: "Kiwik Team", role: "Design & Architecture", avatar: "/avatars/kiwik.jpg" },
    ],
    timeline: [
      { date: "2025-06-01", title: "Project Inception", description: "Initial concept and architecture planning", status: "completed" },
      { date: "2025-06-15", title: "Design System", description: "Glassmorphism engine and theme system", status: "completed" },
      { date: "2025-07-01", title: "Core Frontend", description: "Home, projects, and detail pages", status: "completed" },
      { date: "2025-07-15", title: "Admin Panel", description: "CMS with full CRUD and media management", status: "in-progress" },
      { date: "2025-08-01", title: "Backend & Auth", description: "PostgreSQL, Prisma, JWT authentication", status: "planned" },
      { date: "2025-08-15", title: "Analytics & AI", description: "Dashboard, AI summaries, performance monitoring", status: "planned" },
    ],
    readme: `# Kiwik.1

The Operating System for Modern Projects.

## Overview

Kiwik.1 is the central command center for every project. Built with Next.js 15, React 19, and a custom glassmorphism design system.

## Features

- 🔮 Premium glassmorphism UI
- 🎨 Dynamic theme engine (Dark/Light + 7 accents)
- ⌘ Command palette with fuzzy search
- 📊 Analytics dashboard
- 🔐 Enterprise-grade security
- 📱 Fully responsive

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand |
| Database | PostgreSQL + Prisma |
| Auth | JWT + bcrypt |
| Deploy | Vercel, Docker |
`,
    lastUpdated: "2025-07-20",
    createdAt: "2025-06-01",
    owner: "Vivek Shaganti",
    stars: 128,
    forks: 24,
    views: 3420,
    deploymentStatus: "live",
    license: "MIT",
  },
  {
    id: "2",
    slug: "sowcha",
    name: "SowCha",
    tagline: "Luxury in Simplicity",
    description:
      "A slow-fashion label's brand, lookbook and journal — built as a fully static showcase where all content is edited as code rather than through a CMS.",
    longDescription:
      "SowCha is a clothing label built on the idea that everyday dressing should feel considered. The site is deliberately not a storefront: there is no cart, checkout, login, pricing, inventory or admin panel anywhere in the codebase. Everything user-facing lives in src/config as plain TypeScript, so adding an object publishes a page. Three swappable palettes — Sage, Blossom and Lavender — are applied before first paint from localStorage, so returning visitors never see a flash of the wrong colours, and because the palettes are CSS-variable RGB triplets, switching theme re-dyes the hand-drawn botanical illustrations along with the interface.",
    status: "completed",
    category: "web",
    tags: ["slow-fashion", "lookbook", "static-site", "theming", "cloudinary"],
    version: "1.0.0",
    completionPercent: 100,
    liveUrl: "https://sowcha.com/",
    githubUrl: "https://github.com/praneethreddykiwik/sowcha",
    coverImage: `${MEDIA_ROOT}/sowcha/sowcha-home.jpg`,
    images: [
      { src: `${MEDIA_ROOT}/sowcha/sowcha-home.jpg`, alt: "SowCha home", caption: "Landing — Luxury in Simplicity" },
      { src: `${MEDIA_ROOT}/sowcha/sowcha-mid.jpg`, alt: "SowCha collection", caption: "Collection and lookbook" },
      { src: `${MEDIA_ROOT}/sowcha/sowcha-low.jpg`, alt: "SowCha journal", caption: "Journal and atelier" },
    ],
    techStack: [
      { name: "Next.js 15", category: "frontend", color: "#000000" },
      { name: "React 19", category: "frontend", color: "#61DAFB" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Tailwind CSS", category: "frontend", color: "#06B6D4" },
      { name: "Framer Motion", category: "animations", color: "#FF0055" },
      { name: "Cloudinary", category: "cloud", color: "#3448C5" },
    ],
    features: [
      { title: "Content as code", description: "Brand, products, gallery and journal all live in src/config as typed objects — no CMS, no API." },
      { title: "Three swappable palettes", description: "Sage, Blossom and Lavender, remembered in localStorage and applied before first paint." },
      { title: "Themed illustrations", description: "Palettes are CSS-variable RGB triplets, so a theme change re-dyes the hand-drawn artwork too." },
      { title: "Graceful image loading", description: "Until a Cloudinary image resolves, the frame renders its matching botanical illustration instead of a broken tile." },
      { title: "Static end to end", description: "Every route prerenders to static HTML with no runtime data fetching." },
    ],
    changelog: [],
    contributors: [],
    timeline: [],
    lastUpdated: "2026-08-08",
    createdAt: "2026-08-08",
    owner: "Criska",
    deploymentStatus: "live",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "3",
    slug: "helm-events",
    name: "HELM Events",
    tagline: "Amateurs panic. Professionals go for HELM.",
    description:
      "A cloud-based event management platform that replaces scattered spreadsheets, emails and disconnected tools with a single command centre for event operations.",
    longDescription:
      "HELM covers the whole event lifecycle — pre-event planning, event-day execution and post-event analysis — for virtual, hybrid and in-person formats. Work cascades from executives to managers to vendors and floor teams with dependency mapping, automated reminders and milestone tracking. Vendors receive assignments, update progress and upload deliverables inside the platform. An integrated CRM handles clients, vendors and attendees, while registration, ticketing and attendee tracking run alongside marketing tools and analytics dashboards covering revenue, expenses, profitability and ROI.",
    status: "completed",
    category: "saas",
    tags: ["event-management", "crm", "ticketing", "analytics", "vendor-management"],
    version: "1.0.0",
    completionPercent: 100,
    liveUrl: "https://helm.events/",
    logo: "https://helm.events/assets/Helm_logo-B3YNq1lB.svg",
    coverImage: `${MEDIA_ROOT}/helm/helm-home.jpg`,
    images: [
      { src: `${MEDIA_ROOT}/helm/helm-home.jpg`, alt: "HELM landing", caption: "The complete event management platform" },
      { src: `${MEDIA_ROOT}/helm/helm-mid.jpg`, alt: "HELM capabilities", caption: "Operations, tasks and vendor coordination" },
      { src: `${MEDIA_ROOT}/helm/helm-low.jpg`, alt: "HELM analytics", caption: "Analytics and lifecycle coverage" },
    ],
    techStack: [
      { name: "React", category: "frontend", color: "#61DAFB" },
      { name: "Redux Toolkit", category: "frontend", color: "#764ABC" },
      { name: "styled-components", category: "frontend", color: "#DB7093" },
      { name: "MUI", category: "frontend", color: "#007FFF" },
      { name: "Vite", category: "devops", color: "#646CFF" },
      { name: "AWS CloudFront", category: "cloud", color: "#FF9900" },
    ],
    features: [
      { title: "One command centre", description: "Replaces scattered spreadsheets, emails and disconnected tools with unified event operations across concurrent events." },
      { title: "Cascading task management", description: "Work flows from executives to managers to vendors and floor teams, with dependency mapping and milestone tracking." },
      { title: "Vendor coordination", description: "Vendors receive assignments, update progress, upload deliverables and communicate inside HELM." },
      { title: "Integrated CRM", description: "Manages clients, vendors and attendees through intelligent onboarding workflows." },
      { title: "Ticketing and registration", description: "Registration forms, ticketing, confirmations and attendee tracking." },
      { title: "Analytics", description: "Dashboards for revenue, expenses, profitability and ROI, plus a custom report builder and vendor scoring." },
    ],
    changelog: [],
    contributors: [],
    timeline: [],
    lastUpdated: "2026-07-29",
    createdAt: "2026-07-29",
    owner: "Criska",
    deploymentStatus: "live",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "4",
    slug: "clean-ai",
    name: "Clean AI",
    tagline: "AI-Powered Home Services Marketplace",
    description:
      "A four-role home-services marketplace where an AI agent pipeline reads a photo of the job, scores its complexity and matches nearby verified vendors.",
    longDescription:
      "Clean AI connects customers with verified home service vendors across twelve categories. Five specialised agents run on every request: a Supervisor orchestrates, a Vision agent reads uploaded job photos for dirt level and complexity, a Pricing agent builds the itemised quote, a Vendor agent matches and ranks nearby providers, and a Booking agent closes the loop. The Work Complexity Index scores each job from 0 to 100, weighting dirt, area, surfaces, density, chemical need, equipment, accessibility and safety risk. Vendor matching expands its radius progressively from 15km out to 100km, returning the best five candidates. Customer, vendor, agent and admin each get their own portal with OTP login and role-based access control.",
    status: "in-progress",
    category: "ai",
    tags: ["ai-agents", "marketplace", "computer-vision", "pricing-engine", "geo-matching"],
    version: "1.0.0-rc1",
    completionPercent: 65,
    githubUrl: "https://github.com/praneethreddykiwik/cleanAI",
    coverImage: `${MEDIA_ROOT}/cleanai/cleanai-3.jpg`,
    images: [
      { src: `${MEDIA_ROOT}/cleanai/cleanai-1.jpg`, alt: "Clean AI landing", caption: "World-class professionals, dispatched by AI" },
      { src: `${MEDIA_ROOT}/cleanai/cleanai-2.jpg`, alt: "Clean AI dashboard", caption: "Customer dashboard" },
      { src: `${MEDIA_ROOT}/cleanai/cleanai-3.jpg`, alt: "Clean AI services catalog", caption: "Services catalog with AI estimates" },
      { src: `${MEDIA_ROOT}/cleanai/cleanai-4.jpg`, alt: "Clean AI supervisor agent", caption: "Supervisor agent — vision, pricing and matching" },
    ],
    techStack: [
      { name: "Next.js 16", category: "frontend", color: "#000000" },
      { name: "React 19", category: "frontend", color: "#61DAFB" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Tailwind CSS v4", category: "frontend", color: "#06B6D4" },
      { name: "Node.js", category: "backend", color: "#339933" },
      { name: "Prisma", category: "backend", color: "#2D3748" },
      { name: "PostgreSQL", category: "database", color: "#4169E1" },
      { name: "Redis", category: "database", color: "#DC382D" },
      { name: "Socket.io", category: "backend", color: "#010101" },
      { name: "Groq", category: "ai", color: "#F55036" },
      { name: "Gemini", category: "ai", color: "#4285F4" },
      { name: "Razorpay", category: "payments", color: "#0C2451" },
    ],
    features: [
      { title: "Five-agent pipeline", description: "Supervisor, Vision, Pricing, Vendor and Booking agents run in sequence on every request." },
      { title: "Vision job analysis", description: "Customers upload photos and the Vision agent assesses dirt level, area and complexity." },
      { title: "Work Complexity Index", description: "Scores each job 0–100, weighting dirt 25%, area 20%, surfaces 15%, then density, chemicals, equipment, accessibility and safety." },
      { title: "Progressive vendor matching", description: "Expands the search radius 15 → 30 → 50 → 100km, scoring candidates and returning the best five." },
      { title: "Transparent pricing", description: "Itemises base price, complexity surcharge, labour, travel, weekend and night rates, GST, discounts, platform fee and vendor share." },
      { title: "Four portals", description: "Customer, vendor, agent and admin, each with OTP login, password reset and role-based access control." },
    ],
    changelog: [],
    contributors: [],
    timeline: [],
    lastUpdated: "2026-08-08",
    createdAt: "2026-07-14",
    owner: "Criska",
    deploymentStatus: "offline",
    featured: true,
    sortOrder: 3,
  },
];
