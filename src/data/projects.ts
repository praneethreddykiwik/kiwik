// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Mock Project Data
// ─────────────────────────────────────────────────────────────

import type { Project } from "@/types";

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
    slug: "criska-ai",
    name: "CriskaAI",
    tagline: "Intelligent Assistant for Everything",
    description:
      "An advanced AI-powered assistant platform that combines natural language understanding, task automation, and intelligent code generation into a seamless conversational experience.",
    longDescription:
      "CriskaAI leverages cutting-edge large language models combined with a custom retrieval-augmented generation pipeline to provide contextually aware responses. The platform features multi-modal input support, real-time streaming, plugin architecture for extensibility, and enterprise-grade security. Built for developers, teams, and organizations that need AI superpowers at their fingertips.",
    status: "completed",
    category: "ai",
    tags: ["ai", "assistant", "nlp", "automation", "chatbot", "llm"],
    version: "2.3.1",
    completionPercent: 100,
    liveUrl: "https://ai.criska.dev",
    githubUrl: "https://github.com/criska/criska-ai",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", alt: "Chat Interface", caption: "Sleek conversational UI" },
      { src: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80", alt: "Code Generation", caption: "Intelligent code generation" },
    ],
    techStack: [
      { name: "Next.js 15", category: "frontend", color: "#000000" },
      { name: "React 19", category: "frontend", color: "#61DAFB" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Python", category: "backend", color: "#3776AB" },
      { name: "FastAPI", category: "backend", color: "#009688" },
      { name: "OpenAI", category: "ai", color: "#412991" },
      { name: "LangChain", category: "ai", color: "#1C3C3C" },
      { name: "Pinecone", category: "database", color: "#000000" },
      { name: "Redis", category: "database", color: "#DC382D" },
      { name: "Docker", category: "devops", color: "#2496ED" },
      { name: "AWS", category: "cloud", color: "#FF9900" },
    ],
    features: [
      { title: "Multi-Model Support", description: "Switch between GPT-4, Claude, Gemini, and open-source models seamlessly." },
      { title: "RAG Pipeline", description: "Custom retrieval-augmented generation for contextual responses." },
      { title: "Code Generation", description: "Intelligent code generation with syntax highlighting and execution." },
      { title: "Plugin System", description: "Extensible architecture supporting custom plugins and integrations." },
      { title: "Real-time Streaming", description: "Token-by-token streaming for instant response delivery." },
      { title: "Team Workspaces", description: "Shared conversations, prompt libraries, and collaborative features." },
    ],
    changelog: [
      { version: "2.3.1", date: "2025-07-18", title: "Performance Hotfix", changes: ["Fixed streaming latency issue", "Improved token caching"], type: "patch" },
      { version: "2.3.0", date: "2025-07-10", title: "Plugin Marketplace", changes: ["Plugin marketplace UI", "12 new plugins", "Plugin SDK v2"], type: "minor" },
      { version: "2.0.0", date: "2025-06-01", title: "Major Overhaul", changes: ["Complete UI redesign", "Multi-model support", "RAG pipeline", "Team workspaces"], type: "major" },
    ],
    contributors: [
      { name: "Vivek Shaganti", role: "Lead Developer", avatar: "/avatars/vivek.jpg", github: "vivekshaganti" },
      { name: "Arjun Kapoor", role: "AI Engineer", avatar: "/avatars/arjun.jpg" },
      { name: "Priya Sharma", role: "Frontend Developer", avatar: "/avatars/priya.jpg" },
    ],
    timeline: [
      { date: "2024-12-01", title: "v1.0 Launch", description: "Initial release with basic chat", status: "completed" },
      { date: "2025-03-01", title: "v2.0 Overhaul", description: "Complete platform redesign", status: "completed" },
      { date: "2025-06-01", title: "Plugin System", description: "Extensible plugin architecture", status: "completed" },
      { date: "2025-09-01", title: "Enterprise Edition", description: "SSO, audit logs, compliance", status: "planned" },
    ],
    readme: `# CriskaAI\n\nIntelligent Assistant for Everything.\n\n## Quick Start\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Architecture\n\nCriskaAI uses a microservices architecture with a Next.js frontend and FastAPI backend.\n`,
    lastUpdated: "2025-07-18",
    createdAt: "2024-12-01",
    owner: "Vivek Shaganti",
    stars: 342,
    forks: 67,
    views: 8900,
    deploymentStatus: "live",
    license: "Apache-2.0",
  },
  {
    id: "3",
    slug: "criska-cloud",
    name: "CriskaCloud",
    tagline: "Infrastructure as a Service, Simplified",
    description:
      "A modern cloud infrastructure platform offering serverless computing, managed databases, edge deployments, and real-time monitoring — all through an intuitive dashboard.",
    status: "in-progress",
    category: "devops",
    tags: ["cloud", "infrastructure", "serverless", "monitoring", "kubernetes"],
    version: "0.8.0",
    completionPercent: 65,
    githubUrl: "https://github.com/criska/criska-cloud",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", alt: "Dashboard", caption: "Cloud management dashboard" },
    ],
    techStack: [
      { name: "Next.js 15", category: "frontend", color: "#000000" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Go", category: "backend", color: "#00ADD8" },
      { name: "gRPC", category: "backend", color: "#5B9BD5" },
      { name: "Kubernetes", category: "devops", color: "#326CE5" },
      { name: "Terraform", category: "devops", color: "#7B42BC" },
      { name: "PostgreSQL", category: "database", color: "#4169E1" },
      { name: "Redis", category: "database", color: "#DC382D" },
      { name: "Prometheus", category: "analytics", color: "#E6522C" },
      { name: "Grafana", category: "analytics", color: "#F46800" },
    ],
    features: [
      { title: "Serverless Functions", description: "Deploy functions at the edge in milliseconds with auto-scaling." },
      { title: "Managed Databases", description: "PostgreSQL, Redis, and MongoDB with automated backups." },
      { title: "Real-time Monitoring", description: "Live metrics, logs, and alerting with Prometheus and Grafana." },
      { title: "CI/CD Pipelines", description: "Built-in deployment pipelines with GitHub integration." },
      { title: "Edge Network", description: "Global CDN with 200+ edge locations for low-latency delivery." },
    ],
    changelog: [
      { version: "0.8.0", date: "2025-07-12", title: "Edge Deployments", changes: ["Edge function support", "Global CDN integration", "Custom domains"], type: "minor" },
      { version: "0.5.0", date: "2025-05-01", title: "Database Management", changes: ["Managed PostgreSQL", "Redis clusters", "Automated backups"], type: "minor" },
    ],
    contributors: [
      { name: "Vivek Shaganti", role: "Architect", avatar: "/avatars/vivek.jpg", github: "vivekshaganti" },
      { name: "Ravi Patel", role: "DevOps Engineer", avatar: "/avatars/ravi.jpg" },
    ],
    timeline: [
      { date: "2025-02-01", title: "Architecture Design", description: "Microservices architecture with K8s", status: "completed" },
      { date: "2025-04-01", title: "Core Platform", description: "Compute, storage, networking", status: "completed" },
      { date: "2025-07-01", title: "Edge Network", description: "Global CDN and edge functions", status: "in-progress" },
      { date: "2025-10-01", title: "Public Beta", description: "Open beta for early adopters", status: "planned" },
    ],
    lastUpdated: "2025-07-12",
    createdAt: "2025-02-01",
    owner: "Vivek Shaganti",
    stars: 89,
    forks: 12,
    views: 2100,
    deploymentStatus: "staging",
    license: "BSL-1.1",
  },
  {
    id: "4",
    slug: "criska-pay",
    name: "CriskaPay",
    tagline: "Payment Infrastructure for Modern Apps",
    description:
      "A developer-first payment gateway supporting credit cards, UPI, crypto, and subscriptions with beautiful checkout experiences and comprehensive fraud detection.",
    status: "completed",
    category: "saas",
    tags: ["payments", "fintech", "api", "subscriptions", "checkout"],
    version: "3.1.0",
    completionPercent: 100,
    liveUrl: "https://pay.criska.dev",
    githubUrl: "https://github.com/criska/criska-pay",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80", alt: "Checkout", caption: "Cryptographic Checkout Pipeline" },
      { src: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80", alt: "Web3 Ledger", caption: "Decentralized Settlement Network" },
    ],
    techStack: [
      { name: "React 19", category: "frontend", color: "#61DAFB" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Node.js", category: "backend", color: "#339933" },
      { name: "Express.js", category: "backend", color: "#000000" },
      { name: "PostgreSQL", category: "database", color: "#4169E1" },
      { name: "Stripe", category: "payments", color: "#635BFF" },
      { name: "Razorpay", category: "payments", color: "#0A2540" },
      { name: "Redis", category: "database", color: "#DC382D" },
      { name: "AWS", category: "cloud", color: "#FF9900" },
    ],
    features: [
      { title: "Multi-Gateway Support", description: "Stripe, Razorpay, PayPal, and crypto payments in one SDK." },
      { title: "Smart Checkout", description: "One-click checkout with saved cards and UPI autopay." },
      { title: "Subscription Engine", description: "Flexible billing with trials, proration, and dunning." },
      { title: "Fraud Detection", description: "ML-powered fraud scoring with real-time transaction monitoring." },
      { title: "Developer SDK", description: "Type-safe SDK for React, Node.js, and Python with webhooks." },
    ],
    changelog: [
      { version: "3.1.0", date: "2025-07-05", title: "Crypto Payments", changes: ["Bitcoin & Ethereum support", "Wallet integration", "Exchange rate APIs"], type: "minor" },
      { version: "3.0.0", date: "2025-05-15", title: "v3 Platform", changes: ["Complete architecture rewrite", "New checkout UI", "Subscription engine v2"], type: "major" },
    ],
    contributors: [
      { name: "Vivek Shaganti", role: "Lead Developer", avatar: "/avatars/vivek.jpg", github: "vivekshaganti" },
      { name: "Neha Gupta", role: "Backend Engineer", avatar: "/avatars/neha.jpg" },
    ],
    timeline: [
      { date: "2024-06-01", title: "v1.0 Launch", description: "Basic payment processing", status: "completed" },
      { date: "2024-11-01", title: "v2.0 Subscriptions", description: "Recurring billing support", status: "completed" },
      { date: "2025-05-15", title: "v3.0 Platform", description: "Complete rewrite", status: "completed" },
      { date: "2025-09-01", title: "v4.0 Enterprise", description: "Multi-tenant, SSO, compliance", status: "planned" },
    ],
    lastUpdated: "2025-07-05",
    createdAt: "2024-06-01",
    owner: "Vivek Shaganti",
    stars: 456,
    forks: 89,
    views: 12400,
    deploymentStatus: "live",
    license: "MIT",
  },
  {
    id: "5",
    slug: "criska-os",
    name: "CriskaOS",
    tagline: "A Web-Based Desktop Operating System",
    description:
      "A concept web-based desktop OS featuring a window management system, file browser, terminal, app store, and beautiful animations — all running in the browser.",
    status: "archived",
    category: "research",
    tags: ["os", "desktop", "concept", "window-manager", "experimental"],
    version: "0.3.0",
    completionPercent: 35,
    githubUrl: "https://github.com/criska/criska-os",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80", alt: "Desktop", caption: "CriskaOS desktop environment" },
    ],
    techStack: [
      { name: "React 19", category: "frontend", color: "#61DAFB" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Framer Motion", category: "animations", color: "#FF0055" },
      { name: "Zustand", category: "frontend", color: "#764ABC" },
      { name: "WebGL", category: "frontend", color: "#990000" },
      { name: "IndexedDB", category: "database", color: "#3C873A" },
    ],
    features: [
      { title: "Window Management", description: "Drag, resize, minimize, maximize — real OS-like window controls." },
      { title: "File System", description: "Virtual file system with IndexedDB persistence." },
      { title: "Terminal", description: "Built-in terminal emulator with custom commands." },
      { title: "App Store", description: "Install and manage web applications from a marketplace." },
    ],
    changelog: [
      { version: "0.3.0", date: "2025-03-01", title: "Terminal & File System", changes: ["Terminal emulator", "Virtual file system", "File browser UI"], type: "minor" },
      { version: "0.1.0", date: "2025-01-15", title: "Initial Prototype", changes: ["Window manager", "Desktop wallpaper", "Taskbar"], type: "major" },
    ],
    contributors: [
      { name: "Vivek Shaganti", role: "Creator", avatar: "/avatars/vivek.jpg", github: "vivekshaganti" },
    ],
    timeline: [
      { date: "2025-01-01", title: "Concept", description: "Web OS concept exploration", status: "completed" },
      { date: "2025-01-15", title: "Prototype", description: "Basic window manager", status: "completed" },
      { date: "2025-03-01", title: "Terminal & FS", description: "Terminal and file system", status: "completed" },
      { date: "2025-06-01", title: "Project Archived", description: "Paused for other priorities", status: "completed" },
    ],
    lastUpdated: "2025-03-01",
    createdAt: "2025-01-01",
    owner: "Vivek Shaganti",
    stars: 67,
    forks: 8,
    views: 1800,
    deploymentStatus: "offline",
    license: "MIT",
  },
  {
    id: "6",
    slug: "criska-bot",
    name: "CriskaBot",
    tagline: "The Ultimate Discord Companion",
    description:
      "A feature-rich Discord bot with AI chat, music playback, moderation tools, custom commands, leveling system, and server analytics — serving 500+ servers.",
    status: "completed",
    category: "automation",
    tags: ["discord", "bot", "moderation", "music", "ai", "community"],
    version: "4.2.0",
    completionPercent: 100,
    liveUrl: "https://bot.criska.dev",
    githubUrl: "https://github.com/criska/criska-bot",
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80", alt: "Commands", caption: "Slash commands interface" },
    ],
    techStack: [
      { name: "Node.js", category: "backend", color: "#339933" },
      { name: "TypeScript", category: "frontend", color: "#3178C6" },
      { name: "Discord.js", category: "backend", color: "#5865F2" },
      { name: "MongoDB", category: "database", color: "#47A248" },
      { name: "Redis", category: "database", color: "#DC382D" },
      { name: "OpenAI", category: "ai", color: "#412991" },
      { name: "Docker", category: "devops", color: "#2496ED" },
    ],
    features: [
      { title: "AI Chat", description: "Natural conversations powered by GPT-4 with server context awareness." },
      { title: "Music Player", description: "YouTube, Spotify, and SoundCloud playback with queue management." },
      { title: "Moderation", description: "Auto-mod, warn, ban, mute, and comprehensive audit logging." },
      { title: "Leveling System", description: "XP tracking, leaderboards, and custom role rewards." },
      { title: "Custom Commands", description: "Create custom commands with variables, embeds, and triggers." },
      { title: "Server Analytics", description: "Member growth, activity metrics, and engagement reports." },
    ],
    changelog: [
      { version: "4.2.0", date: "2025-07-01", title: "AI Enhancements", changes: ["GPT-4o integration", "Image generation", "Voice transcription"], type: "minor" },
      { version: "4.0.0", date: "2025-04-01", title: "v4 Major Release", changes: ["Complete rewrite in TypeScript", "Slash commands migration", "New dashboard"], type: "major" },
    ],
    contributors: [
      { name: "Vivek Shaganti", role: "Lead Developer", avatar: "/avatars/vivek.jpg", github: "vivekshaganti" },
      { name: "Karan Singh", role: "Bot Developer", avatar: "/avatars/karan.jpg" },
    ],
    timeline: [
      { date: "2023-06-01", title: "v1.0 Launch", description: "Basic moderation bot", status: "completed" },
      { date: "2024-01-01", title: "v2.0 Music", description: "Music playback features", status: "completed" },
      { date: "2024-08-01", title: "v3.0 AI Chat", description: "AI integration", status: "completed" },
      { date: "2025-04-01", title: "v4.0 TypeScript", description: "Complete rewrite", status: "completed" },
    ],
    lastUpdated: "2025-07-01",
    createdAt: "2023-06-01",
    owner: "Vivek Shaganti",
    stars: 234,
    forks: 45,
    views: 6700,
    deploymentStatus: "live",
    license: "MIT",
  },
];

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags))
).sort();

export const allCategories = Array.from(
  new Set(projects.map((p) => p.category))
).sort();

export const stats = {
  projects: projects.length,
  deployments: 47,
  visitors: "35.2K",
  clients: 12,
  openSourceStars: projects.reduce((acc, p) => acc + (p.stars || 0), 0),
  contributors: 8,
};
