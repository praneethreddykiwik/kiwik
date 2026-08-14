// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Comprehensive Documentation Dataset
// ─────────────────────────────────────────────────────────────

import type { DocCategory, DocArticle } from "@/types/docs-types";

export const docCategories: DocCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    iconName: "Rocket",
    badge: "Core",
    articles: [
      { id: "intro", slug: "introduction", title: "Introduction & Vision", iconName: "Sparkles" },
      { id: "quickstart", slug: "quickstart", title: "Quickstart & Setup", iconName: "Terminal" },
      { id: "folder-structure", slug: "folder-structure", title: "Folder Structure", iconName: "FolderTree" },
      { id: "workflow", slug: "development-workflow", title: "Development Workflow", iconName: "Workflow" }
    ]
  },
  {
    id: "architecture",
    name: "Architecture",
    iconName: "Cpu",
    badge: "System",
    articles: [
      { id: "arch-overview", slug: "architecture-overview", title: "System Architecture", iconName: "Layers" },
      { id: "arch-frontend", slug: "frontend-architecture", title: "Next.js & React 19 Engine", iconName: "Code2" },
      { id: "arch-state", slug: "state-management", title: "Zustand & Telemetry Store", iconName: "Database" },
      { id: "arch-auth", slug: "authentication", title: "Auth & Security Rules", iconName: "Shield" },
      { id: "arch-edge", slug: "edge-deployment", title: "Edge & Serverless Nodes", iconName: "Globe" }
    ]
  },
  {
    id: "projects",
    name: "Projects Ecosystem",
    iconName: "Folder",
    articles: [
      { id: "proj-kiwik", slug: "project-kiwik1", title: "Kiwik.1 OS Deck", iconName: "Monitor" },
      { id: "proj-sowcha", slug: "project-sowcha", title: "SowCha", iconName: "Bot" },
      { id: "proj-helm-events", slug: "project-helm-events", title: "HELM Events", iconName: "Cloud" },
      { id: "proj-clean-ai", slug: "project-clean-ai", title: "Clean AI", iconName: "CreditCard" },
      { id: "proj-flowengine", slug: "project-flowengine", title: "FlowEngine Automation", iconName: "Zap" }
    ]
  },
  {
    id: "components",
    name: "Component Library",
    iconName: "Box",
    badge: "48 Components",
    articles: [
      { id: "comp-overview", slug: "component-overview", title: "UI Primitives & Guidelines", iconName: "Layout" },
      { id: "comp-buttons", slug: "button-component", title: "Button & Action Triggers", iconName: "MousePointerClick" },
      { id: "comp-glass", slug: "glass-card-component", title: "Frosted Glass Cards", iconName: "Square" },
      { id: "comp-badge", slug: "badge-component", title: "Status Badges & Indicators", iconName: "Tag" },
      { id: "comp-modal", slug: "modal-component", title: "Glass Modals & Drawers", iconName: "Maximize2" }
    ]
  },
  {
    id: "design-system",
    name: "Design System",
    iconName: "Palette",
    articles: [
      { id: "ds-tokens", slug: "design-tokens", title: "Design Tokens & Variables", iconName: "Sliders" },
      { id: "ds-typography", slug: "typography", title: "Typography Scale", iconName: "Type" },
      { id: "ds-color", slug: "color-palettes", title: "Color Palette & Accents", iconName: "Droplet" },
      { id: "ds-motion", slug: "motion-physics", title: "Framer Motion Physics", iconName: "Activity" }
    ]
  },
  {
    id: "cms",
    name: "Website CMS",
    iconName: "Sliders",
    badge: "Admin",
    articles: [
      { id: "cms-overview", slug: "cms-overview", title: "CMS Architecture", iconName: "ShieldCheck" },
      { id: "cms-editor", slug: "cms-website-editor", title: "Live Website Editor", iconName: "Edit3" },
      { id: "cms-projects", slug: "cms-projects-manager", title: "Projects Priority & CRUD", iconName: "ListOrdered" },
      { id: "cms-media", slug: "cms-media-library", title: "Media Library Engine", iconName: "Image" }
    ]
  },
  {
    id: "api",
    name: "API Reference",
    iconName: "Globe",
    badge: "REST",
    articles: [
      { id: "api-overview", slug: "api-overview", title: "API Authentication & Rate Limits", iconName: "Key" },
      { id: "api-visitors", slug: "api-visitors", title: "/api/visitors Telemetry", iconName: "Users" },
      { id: "api-cms", slug: "api-cms", title: "/api/cms Data Endpoint", iconName: "FileJson" },
      { id: "api-chat", slug: "api-chat", title: "/api/chat AI Stream", iconName: "MessageSquare" }
    ]
  },
  {
    id: "database",
    name: "Database Schema",
    iconName: "Database",
    articles: [
      { id: "db-schema", slug: "database-schema", title: "Collection & Entity Tables", iconName: "Table" },
      { id: "db-indexes", slug: "database-indexes", title: "Indexing & Query Rules", iconName: "Zap" }
    ]
  },
  {
    id: "releases",
    name: "Release & Roadmap",
    iconName: "Compass",
    articles: [
      { id: "rel-changelog", slug: "changelog", title: "Changelog & Release Notes", iconName: "History" },
      { id: "rel-roadmap", slug: "roadmap", title: "Product Roadmap", iconName: "Milestone" },
      { id: "rel-faq", slug: "faq", title: "FAQ & Troubleshooting", iconName: "HelpCircle" }
    ]
  }
];

export const docArticles: Record<string, DocArticle> = {
  "introduction": {
    id: "intro",
    slug: "introduction",
    categoryId: "getting-started",
    title: "Introduction & Vision",
    subtitle: "Everything you need to build, manage, and inspect the Kiwik.1 Operating System deck.",
    readingTimeMinutes: 4,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["Overview", "Architecture", "Design System"],
    toc: [
      { id: "what-is-kiwik", title: "What is Kiwik.1?", level: 2 },
      { id: "core-philosophy", title: "Core Philosophy", level: 2 },
      { id: "key-capabilities", title: "Key Capabilities", level: 2 },
      { id: "tech-stack-summary", title: "Technology Stack", level: 2 }
    ],
    sections: [
      {
        id: "what-is-kiwik",
        heading: "What is Kiwik.1?",
        bodyMarkdown: "Kiwik.1 is a high-performance **Operating System interface for modern digital products**, web applications, and developer projects. Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**, Kiwik combines Apple-level frosted glass aesthetics with real-time database-driven CMS controls.",
        callout: {
          type: "note",
          title: "Database-Driven Architecture",
          message: "Every single section, project, button label, theme token, and hero headline on Kiwik.1 is read dynamically from the Zustand persistent CMS store and backend API endpoints. No hardcoded content."
        }
      },
      {
        id: "core-philosophy",
        heading: "Core Philosophy",
        bodyMarkdown: "We believe documentation should not be a static Markdown dumping ground. It should feel like navigating a **live control deck** — complete with interactive component playgrounds, REST API testers, visual architecture diagrams, and integrated AI assistant query channels."
      },
      {
        id: "key-capabilities",
        heading: "Key Capabilities",
        bodyMarkdown: "• **Full Website CMS**: Edit hero copy, rotating words, capabilities cards, trust assurance items, navigation items, and theme tokens in real-time.\n• **Dynamic Telemetry Engine**: Live active visitor tracking in 2-minute rolling windows with zero dummy numbers.\n• **Projects priority ordering & 1-click duplication**: Priority re-ordering and status pill filtering.\n• **Glassmorphism Design System**: Tailored dark & light mode frosted glass panels with mouse-reactive specular glows.\n• **Embedded AI Assistant**: Groq Llama-3 AI stream querying indexing all project tech specs."
      },
      {
        id: "tech-stack-summary",
        heading: "Technology Stack",
        bodyMarkdown: "Check out the primary engineering libraries powering Kiwik.1:",
        codeBlock: {
          language: "json",
          filename: "tech-stack.json",
          code: `{\n  "framework": "Next.js 16 (App Router)",\n  "ui": "React 19, Tailwind CSS v4, Lucide Icons",\n  "motion": "Framer Motion 12 (Spring Physics)",\n  "state": "Zustand (localStorage + API Sync)",\n  "search": "Fuse.js Fuzzy Matching Engine",\n  "ai": "Groq LLM API (Llama-3-8B)"\n}`
        }
      }
    ]
  },

  "quickstart": {
    id: "quickstart",
    slug: "quickstart",
    categoryId: "getting-started",
    title: "Quickstart & Setup",
    subtitle: "Get Kiwik.1 up and running locally in less than two minutes.",
    readingTimeMinutes: 3,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["CLI", "Installation", "Local Dev"],
    toc: [
      { id: "prerequisites", title: "Prerequisites", level: 2 },
      { id: "cloning-repo", title: "Cloning & Installing", level: 2 },
      { id: "environment-vars", title: "Environment Variables", level: 2 },
      { id: "running-dev", title: "Starting Dev Server", level: 2 }
    ],
    sections: [
      {
        id: "prerequisites",
        heading: "Prerequisites",
        bodyMarkdown: "Ensure you have **Node.js 18.x or later** and **npm / pnpm / yarn** installed on your workstation."
      },
      {
        id: "cloning-repo",
        heading: "Cloning & Installing",
        bodyMarkdown: "Run the following terminal commands to clone the repository and install all required dependencies:",
        codeBlock: {
          language: "bash",
          filename: "terminal",
          code: `git clone git@github.com:praneethreddykiwik/kiwik.git\ncd Kiwik\nnpm install`
        }
      },
      {
        id: "environment-vars",
        heading: "Environment Variables",
        bodyMarkdown: "Create a `.env.local` file in the root directory. Add your optional Groq AI API key if you wish to run live LLM streaming:",
        codeBlock: {
          language: "env",
          filename: ".env.local",
          code: `# Optional Groq API Key for AI Chatbot Stream\nGROQ_API_KEY=gsk_your_groq_api_key_here\n\n# Base Site URL\nNEXT_PUBLIC_SITE_URL=http://localhost:3000`
        },
        callout: {
          type: "tip",
          title: "Graceful Fallback Mode",
          message: "If no GROQ_API_KEY is supplied, Kiwik automatically switches to the built-in intelligent fuzzy search AI engine without throwing runtime errors."
        }
      },
      {
        id: "running-dev",
        heading: "Starting Dev Server",
        bodyMarkdown: "Boot the Next.js local server with:",
        codeBlock: {
          language: "bash",
          filename: "terminal",
          code: `npm run dev\n# App ready at http://localhost:3000\n# Admin panel at http://localhost:3000/admin`
        }
      }
    ]
  },

  "folder-structure": {
    id: "folder-structure",
    slug: "folder-structure",
    categoryId: "getting-started",
    title: "Folder Structure",
    subtitle: "Complete repository architectural breakdown and file placement rules.",
    readingTimeMinutes: 5,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["Codebase", "Directory", "Standards"],
    toc: [
      { id: "directory-map", title: "Directory Map", level: 2 },
      { id: "component-organization", title: "Component Organization", level: 2 }
    ],
    sections: [
      {
        id: "directory-map",
        heading: "Directory Map",
        bodyMarkdown: "The codebase follows clean Next.js 16 App Router architecture:",
        codeBlock: {
          language: "text",
          filename: "repository-tree",
          code: `Kiwik/
├── src/
│   ├── app/                    # Next.js App Router Pages & API Routes
│   │   ├── page.tsx            # Main Landing Cockpit
│   │   ├── admin/page.tsx      # Admin Content Management System
│   │   ├── docs/page.tsx       # Documentation Center Platform
│   │   ├── projects/           # Projects Catalog & Detail routes
│   │   └── api/                # Telemetry, CMS, and Chat API Endpoints
│   ├── components/             # Reusable UI & Section Components
│   │   ├── layout/             # Navbar, Footer, Intro Splash
│   │   ├── home/               # Hero Cockpit, AI Panel, macOS Dashboard
│   │   ├── projects/           # Project Cards & Multi-tab Modals
│   │   ├── docs/               # Documentation Center Components
│   │   ├── providers/          # ThemeProvider & Dark Mode Context
│   │   └── ui/                 # Atomic Glass Buttons, Inputs, Switches
│   ├── stores/                 # Zustand Persistent Stores (Site & Projects)
│   ├── data/                   # Default CMS Data & Documentation Specs
│   ├── types/                  # Master TypeScript Declarations
│   └── lib/                    # Utilities, Classname Mergers, & Helpers
├── public/                     # Static Assets, Logos, and Avatars
└── package.json`
        }
      },
      {
        id: "component-organization",
        heading: "Component Organization",
        bodyMarkdown: "Components are kept strictly modular. Atomic primitives reside in `src/components/ui/`, section blocks in `src/components/home/`, and page-specific views in their corresponding folders."
      }
    ]
  },

  "development-workflow": {
    id: "workflow",
    slug: "development-workflow",
    categoryId: "getting-started",
    title: "Development Workflow",
    subtitle: "Standards for code edits, testing, type validation, and deployment.",
    readingTimeMinutes: 4,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["Workflow", "Testing", "Deployment"],
    toc: [
      { id: "typecheck", title: "TypeScript Validation", level: 2 },
      { id: "building", title: "Production Build", level: 2 },
      { id: "git-commit", title: "Git & Deployment Strategy", level: 2 }
    ],
    sections: [
      {
        id: "typecheck",
        heading: "TypeScript Validation",
        bodyMarkdown: "Before submitting commits or deploying, run type checking without emitting files:",
        codeBlock: {
          language: "bash",
          filename: "terminal",
          code: `npx tsc --noEmit`
        }
      },
      {
        id: "building",
        heading: "Production Build",
        bodyMarkdown: "Verify production bundle compilation with Webpack engine:",
        codeBlock: {
          language: "bash",
          filename: "terminal",
          code: `npm run build`
        }
      },
      {
        id: "git-commit",
        heading: "Git & Deployment Strategy",
        bodyMarkdown: "Kiwik is continuously deployed on **Vercel Serverless Edge**. Committing to `main` triggers automatic deployment builds.",
        callout: {
          type: "important",
          title: "Zero Downtime Deployments",
          message: "All state mutations in the Admin CMS persist across deployments via local storage & dynamic API endpoints."
        }
      }
    ]
  },

  "architecture-overview": {
    id: "arch-overview",
    slug: "architecture-overview",
    categoryId: "architecture",
    title: "System Architecture",
    subtitle: "High-level overview of Kiwik.1's layer stack and data flows.",
    readingTimeMinutes: 6,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["System Architecture", "Edge", "State"],
    toc: [
      { id: "layers", title: "Layered System Blueprint", level: 2 },
      { id: "data-flow", title: "Data Flow Architecture", level: 2 }
    ],
    sections: [
      {
        id: "layers",
        heading: "Layered System Blueprint",
        bodyMarkdown: "Kiwik.1 operates across 5 decoupled layers:\n1. **Presentation Deck**: Next.js App Router with Framer Motion spring physics.\n2. **State & CMS Store**: Zustand store with `localStorage` key `kiwik-site-cms-v1`.\n3. **Telemetry Engine**: In-memory active session tracking via `/api/visitors` route.\n4. **AI Assistant Layer**: Dual-channel Groq streaming and Fuse.js fuzzy index.\n5. **Edge CDN**: Vercel Serverless Edge deployment nodes with global caching."
      },
      {
        id: "data-flow",
        heading: "Data Flow Architecture",
        bodyMarkdown: "When a visitor enters Kiwik.1, a background ping `POST /api/visitors` registers an active session timestamp. The Admin Panel polls `GET /api/visitors` every 3 seconds to display real-time active visitor counts and total site visits."
      }
    ],
    architectureDiagrams: [
      { id: "node-fe", label: "Client Browser", layer: "frontend", description: "Next.js 16, React 19, Framer Motion UI", tech: ["Next.js", "React", "Tailwind"] },
      { id: "node-st", label: "Zustand CMS Store", layer: "frontend", description: "Manages live editable website state", tech: ["Zustand", "LocalStorage"] },
      { id: "node-api", label: "Edge API Routes", layer: "backend", description: "/api/visitors, /api/cms, /api/chat", tech: ["Next.js API", "Serverless"] },
      { id: "node-ai", label: "Groq LLM Engine", layer: "ai", description: "Contextually queries project index", tech: ["Groq", "Llama-3"] },
      { id: "node-cdn", label: "Vercel Edge CDN", layer: "edge", description: "Global 14ms latency CDN distribution", tech: ["Vercel Edge"] }
    ]
  },

  "component-overview": {
    id: "comp-overview",
    slug: "component-overview",
    categoryId: "components",
    title: "UI Primitives & Guidelines",
    subtitle: "Design specs, interactive component previews, and props specifications.",
    readingTimeMinutes: 5,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["UI", "Components", "Design System"],
    toc: [
      { id: "primitives", title: "Glass Primitives", level: 2 },
      { id: "interactive-preview", title: "Interactive Component Specs", level: 2 }
    ],
    sections: [
      {
        id: "primitives",
        heading: "Glass Primitives",
        bodyMarkdown: "All Kiwik UI primitives utilize multi-layered backdrop blur, subtle borders, and smooth hover micro-animations."
      },
      {
        id: "interactive-preview",
        heading: "Interactive Component Specs",
        bodyMarkdown: "Select variants below to inspect component props, code snippets, and accessibility notes."
      }
    ],
    componentSpec: {
      componentName: "Button",
      description: "Interactive glassmorphic action button with variant, size, icon, loading, and magnetic hover effects.",
      props: [
        { name: "variant", type: "'primary' | 'secondary' | 'glass' | 'danger'", default: "'primary'", description: "Visual color theme style" },
        { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Padding and font size" },
        { name: "disabled", type: "boolean", default: "false", description: "Disables click events and reduces opacity" },
        { name: "loading", type: "boolean", default: "false", description: "Displays animated spinner" }
      ],
      variants: [
        { name: "Primary Gradient", code: `<Button variant="primary">Explore Projects</Button>`, previewType: "button" },
        { name: "Frosted Glass", code: `<Button variant="glass">Watch Overview</Button>`, previewType: "button" },
        { name: "Status Indicator Badge", code: `<Badge variant="success">All Systems Live</Badge>`, previewType: "badge" },
        { name: "Interactive Switch", code: `<Switch checked={true} />`, previewType: "switch" }
      ]
    }
  },

  "api-overview": {
    id: "api-overview",
    slug: "api-overview",
    categoryId: "api",
    title: "API Reference & Interactive Explorer",
    subtitle: "Complete documentation and request tester for Kiwik.1 serverless endpoints.",
    readingTimeMinutes: 6,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["API", "REST", "Endpoints"],
    toc: [
      { id: "endpoints-list", title: "Endpoint Directory", level: 2 }
    ],
    sections: [
      {
        id: "endpoints-list",
        heading: "Endpoint Directory",
        bodyMarkdown: "Explore the live API endpoints available on the platform:"
      }
    ],
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/visitors",
        summary: "Get Real-time Visitor Stats",
        description: "Returns active visitor session counts within 2-minute rolling window and total lifetime site visits.",
        responseBody: `{\n  "activeVisitors": 14,\n  "totalVisits": 12850,\n  "timestamp": 1784752283977\n}`,
        curlExample: `curl -X GET https://kiwik-xi.vercel.app/api/visitors`
      },
      {
        method: "POST",
        path: "/api/visitors",
        summary: "Log Visitor Session Ping",
        description: "Registers client IP / session heartbeat to update live active telemetry metrics.",
        headers: [{ key: "Content-Type", value: "application/json" }],
        requestBody: `{\n  "sessionId": "sess_89f3a12",\n  "pathname": "/docs"\n}`,
        responseBody: `{\n  "status": "ok",\n  "activeVisitors": 14\n}`,
        curlExample: `curl -X POST https://kiwik-xi.vercel.app/api/visitors \\\n  -H "Content-Type: application/json" \\\n  -d '{"sessionId":"sess_89f3a12","pathname":"/docs"}'`
      },
      {
        method: "POST",
        path: "/api/chat",
        summary: "Query AI Assistant Model Stream",
        description: "Proxies chat queries to Groq LLM API or returns intelligent fuzzy match payload.",
        headers: [{ key: "Content-Type", value: "application/json" }],
        requestBody: `{\n  "messages": [\n    {"sender": "user", "text": "What projects are built with Next.js?"}\n  ]\n}`,
        responseBody: `{\n  "reply": "The following projects use Next.js: SowCha, HELM Events...",\n  "fallback": false\n}`,
        curlExample: `curl -X POST https://kiwik-xi.vercel.app/api/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages":[{"sender":"user","text":"What projects use Next.js?"}]}'`
      }
    ]
  },

  "database-schema": {
    id: "db-schema",
    slug: "database-schema",
    categoryId: "database",
    title: "Database Schema Browser",
    subtitle: "Interactive collection schemas, columns, indexes, and entity relations.",
    readingTimeMinutes: 4,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["Database", "Firestore", "Schema"],
    toc: [
      { id: "tables-spec", title: "Entity Schemas", level: 2 }
    ],
    sections: [
      {
        id: "tables-spec",
        heading: "Entity Schemas",
        bodyMarkdown: "Inspect entity schema definitions for projects, site settings, and telemetry logs."
      }
    ],
    databaseTables: [
      {
        name: "projects",
        description: "Stores portfolio project data, priority rank, status, tech stack, and markdown README.",
        columns: [
          { name: "id", type: "string", pk: true, description: "Unique project identifier" },
          { name: "slug", type: "string", description: "URL friendly slug (e.g. kiwik)" },
          { name: "name", type: "string", description: "Display title" },
          { name: "priority", type: "number", description: "Ordering priority rank integer" },
          { name: "status", type: "enum", description: "completed | in-progress | planned" },
          { name: "completionPercent", type: "number", description: "Progress 0-100%" },
          { name: "techStack", type: "jsonb", description: "Array of TechItem objects" }
        ],
        indexes: ["idx_slug_unique", "idx_priority_asc"]
      },
      {
        name: "site_cms_settings",
        description: "Stores website hero copy, navigation items, capabilities, and theme tokens.",
        columns: [
          { name: "id", type: "string", pk: true, description: "Single-row key 'global_cms'" },
          { name: "hero", type: "jsonb", description: "Hero badge, headline, rotating words" },
          { name: "navigation", type: "jsonb", description: "Navbar links and CTA buttons" },
          { name: "theme", type: "jsonb", description: "Color presets and glass blur specs" },
          { name: "updatedAt", type: "timestamp", description: "Last CMS edit timestamp" }
        ]
      },
      {
        name: "visitor_telemetry",
        description: "In-memory rolling session tracker for real-time active user counts.",
        columns: [
          { name: "sessionId", type: "string", pk: true, description: "Hashed client session key" },
          { name: "ipHash", type: "string", description: "Anonymized IP hash" },
          { name: "lastPing", type: "timestamp", description: "Rolling heartbeat timestamp" }
        ]
      }
    ]
  },

  "changelog": {
    id: "rel-changelog",
    slug: "changelog",
    categoryId: "releases",
    title: "Changelog & Release Notes",
    subtitle: "Complete version history, feature enhancements, and system upgrades.",
    readingTimeMinutes: 3,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["Releases", "Versions", "Changelog"],
    toc: [
      { id: "v1-0-0-beta", title: "v1.0.0-beta Release", level: 2 },
      { id: "v0-9-0", title: "v0.9.0 Admin Panel", level: 2 }
    ],
    sections: [
      {
        id: "v1-0-0-beta",
        heading: "v1.0.0-beta — Modern Documentation Center & Telemetry Engine",
        bodyMarkdown: "• **New**: Complete Developer Documentation Platform with Stripe/Vercel-level 3-column deck layout.\n• **New**: Live Active Visitors & Total Site Visits telemetry card in Admin Dashboard.\n• **Fixed**: Restored Projects priority ordering (`ArrowUp`/`ArrowDown`), 1-click duplication, and status filters.\n• **Enhanced**: Magnetic hover pill animation and smooth cross-page hash link scrolling."
      },
      {
        id: "v0-9-0",
        heading: "v0.9.0 — Full Website Content Management System",
        bodyMarkdown: "• **New**: Database-driven CMS store managing hero headline, rotating words, capabilities cards, trust assurance, and footer links.\n• **New**: Multi-tab modal editor for project info, metadata stats, tech stack, and README markdown."
      }
    ]
  },

  "roadmap": {
    id: "rel-roadmap",
    slug: "roadmap",
    categoryId: "releases",
    title: "Product Roadmap",
    subtitle: "Upcoming features, architecture expansions, and scheduled releases.",
    readingTimeMinutes: 3,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["Roadmap", "Future", "Features"],
    toc: [
      { id: "now-q3", title: "Now (Q3 2026)", level: 2 },
      { id: "next-q4", title: "Next (Q4 2026)", level: 2 },
      { id: "future-2027", title: "Future (2027)", level: 2 }
    ],
    sections: [
      {
        id: "now-q3",
        heading: "Now (Q3 2026)",
        bodyMarkdown: "✅ **Documentation Platform**: 3-column Stripe/Vercel benchmark portal with API tester and component playground.\n✅ **Live Telemetry**: Real-time session monitoring with zero hardcoded numbers.\n✅ **CMS Restorations**: Full priority re-ordering and project cloning."
      },
      {
        id: "next-q4",
        heading: "Next (Q4 2026)",
        bodyMarkdown: "⏳ **Multi-Tenant Firestore Cloud Sync**: Cloud database sync with automatic offline fallback.\n⏳ **PDF Export for Documentation**: 1-click automated PDF document generation.\n⏳ **CLI Utility (`npx kiwik-cli`)**: Command-line tool to manage projects directly from terminal."
      },
      {
        id: "future-2027",
        heading: "Future (2027)",
        bodyMarkdown: "🚀 **AI Code Generator**: Automatically convert design mockups into Kiwik React primitives.\n🚀 **Plugin Marketplace**: Third-party extensions for Kiwik CMS."
      }
    ]
  },

  "faq": {
    id: "rel-faq",
    slug: "faq",
    categoryId: "releases",
    title: "FAQ & Troubleshooting",
    subtitle: "Frequently asked questions regarding configuration, deployment, and customization.",
    readingTimeMinutes: 4,
    lastUpdated: "2026-07-23",
    author: "Kiwik Core Team",
    tags: ["FAQ", "Troubleshooting", "Help"],
    toc: [
      { id: "faq-1", title: "How does the Admin CMS save data?", level: 2 },
      { id: "faq-2", title: "Can I deploy Kiwik on custom cloud hosts?", level: 2 }
    ],
    sections: [
      {
        id: "faq-1",
        heading: "How does the Admin CMS save data?",
        bodyMarkdown: "The Admin CMS saves data to the Zustand persistent store (`localStorage` key `kiwik-site-cms-v1` and `kiwik-projects-v1`) as well as synchronizing with `/api/cms` API routes. Edits made in Admin take effect immediately across all pages without requiring source code rebuilds."
      },
      {
        id: "faq-2",
        heading: "Can I deploy Kiwik on custom cloud hosts?",
        bodyMarkdown: "Yes! Kiwik is built with standard Next.js App Router and can be deployed on Vercel, Netlify, AWS Amplify, Railway, or Docker containers (`docker build -t kiwik .`)."
      }
    ]
  }
};
