import type { CapabilityItem, FooterColumn, TrustItem, WorkflowStep } from "@/types/site-cms-types";

export const HERO_COPY = {
  versionBadge: "Software · Apps · AI",
  headlinePrefix: "Software and AI built for",
  headlineHighlightWord: "your business",
  description: "Kiwik designs, builds and looks after websites, mobile apps, AI systems and online stores. Tell us what you need and we take it from idea to launch.",
};

export const FEATURED_COPY = {
  badgeText: "OUR WORK",
  title: "Products we have built",
  description: "Online stores, mobile apps, AI and business platforms, designed and developed by Kiwik.",
};

export const TRUST_ITEMS: TrustItem[] = [
  { id: "tr-1", title: "Products you can open", desc: "See what we have built before you decide to work with us." },
  { id: "tr-2", title: "Security from the start", desc: "Access, passwords and customer data are protected as we build." },
  { id: "tr-3", title: "Ready for more customers", desc: "Planned for more users, more data and more features later on." },
  { id: "tr-4", title: "Support after launch", desc: "We keep watching it, fixing it and improving it with you." },
];

/** In the order of the icons saved with them: chip, shield, layers, cloud, sparkles. */
export const PRINCIPLES = ["AI where it helps", "Security from day one", "Built around your business", "Fast on every device", "Easy to grow later"];

export const PROCESS_BADGE = "Our process";

export const DASHBOARD_COPY = {
  sectionTitle: "What Kiwik does",
  sectionSubtitle: "We design, build and support software for businesses: websites, mobile apps, AI systems, online stores and custom platforms.",
  kernelStatusText: "",
  labels: ["Kiwik Workspace", "Our products", "", ""],
};

/** The hero's gallery, named after the work each picture stands for. */
const GALLERY: Record<string, string> = {
  "Neon AI Synapses": "AI Development", "Cryptographic Web3 Node": "Secure Payments", "Cyber Shield Matrix": "Security & Identity",
  "Quantum Prism Wave": "Product Design", "AI Neural Core": "AI Assistants", "Holographic Data Laser": "Custom Software",
  "Rainbow Fiber Telemetry": "Cloud & DevOps", "Cybernetic Microchip": "Custom Software", "Decentralized Cluster": "Cloud & DevOps",
  "Global Satellite Mesh": "Cloud Hosting", "Cryptographic Vault": "Data Protection", "Cryptographic Security Vault": "Data Protection",
  "Autonomous Robotics Engine": "Automation", "Matrix Code Waterfall": "Software Development", "Server Rack Network": "Cloud & DevOps",
  "Laser Prism Spectrum": "Product Design", "Fluid Energy Waves": "Brand & Interface", "Digital Neural Interface": "AI Agents",
  "Cyberpunk Digital City": "Security & Identity", "Neon 3D Geometric Prism": "Product Design", "Quantum Particle Collider": "Data & Analytics",
  "Cybernetic AI Core": "AI Development", "Vibrant Liquid Waves": "Brand & Interface", "Web3 Crypto Asset Token": "Online Payments",
  "Developer Coding IDE": "Website Development",
};
export function galleryTitle(title: string | undefined): string {
  return GALLERY[(title || "").trim()] || title || "Software by Kiwik";
}

/** `projectSlug` links a service to a published project that demonstrates it. */
export const SERVICES: CapabilityItem[] = [
  { id: "svc-web", title: "Website Development", desc: "Fast, responsive websites and web portals for your business.", iconName: "Globe" },
  { id: "cap-app-development", title: "App Development", desc: "iOS and Android apps, from design and build through launch and support.", iconName: "Smartphone", projectSlug: "fooducia" },
  { id: "svc-ai", title: "AI Development", desc: "AI agents, assistants and smart features built into your product.", iconName: "Sparkles", projectSlug: "clean-ai" },
  { id: "svc-commerce", title: "E-commerce", desc: "Online stores with catalogs, carts and secure checkout.", iconName: "ShoppingBag", projectSlug: "sowcha" },
  { id: "svc-saas", title: "Software & Product Development", desc: "Custom software, SaaS platforms and new products, from first idea to launch.", iconName: "Layers", projectSlug: "helm-events" },
  { id: "svc-cloud", title: "Cloud & DevOps", desc: "Hosting, deployment and infrastructure, set up and looked after.", iconName: "Cloud" },
  { id: "svc-automation", title: "Automation & Workflows", desc: "Connected tools and automatic processes in place of manual work.", iconName: "Workflow" },
  { id: "svc-security", title: "Security & Identity", desc: "Sign-in, access control and data protection done properly.", iconName: "Shield" },
];
export const SERVICES_TITLE = "What we can build for you";

export const PROCESS_STEPS: WorkflowStep[] = [
  { id: "sw-1", step: "01", title: "Discover", desc: "We learn your goals, your users and your constraints." },
  { id: "sw-2", step: "02", title: "Design", desc: "We design the screens, the flows and the details." },
  { id: "sw-3", step: "03", title: "Build", desc: "We build it with clean, reusable, high-quality code." },
  { id: "sw-4", step: "04", title: "Secure", desc: "We protect its data, access and credentials." },
  { id: "sw-5", step: "05", title: "Operate", desc: "We monitor it, improve it and support it after launch." },
];

/** Every figure here can be checked on the site itself. */
export const EARTH_COPY = {
  headline: "We turn your idea into working software.",
  description: "Websites, mobile apps, AI systems and business platforms. One team plans it with you, builds it, launches it and supports it afterwards.",
  stats: [
    { id: "st-services", value: "8", label: "Services", description: "From websites and apps to AI and cloud." },
    { id: "st-steps", value: "5", label: "Clear steps", description: "Discover, design, build, secure, operate." },
    { id: "st-products", value: "4", label: "Products", description: "Sowcha, Fooducia, HELM Events and Clean AI." },
    { id: "st-places", value: "2", label: "Locations", description: "Dubai, UAE and Hyderabad, India." },
  ],
  cta1Text: "Start a project",
  cta1Href: "/contact",
  cta2Text: "See our work",
  cta2Href: "/projects",
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "col-company",
    title: "Company",
    links: [
      { id: "fl-about", label: "About Kiwik", href: "/about" },
      { id: "fl-how", label: "How we work", href: "/#how-we-work" },
      { id: "fl-partner", label: "Digital Market Partner", href: "/partners" },
      { id: "fl-contact", label: "Contact", href: "/contact" },
    ],
  },
];

export const FOOTER_COPY = {
  copyrightText: "© 2026 Kiwik. All rights reserved.",
  newsletterHeadline: "News from Kiwik",
  newsletterDescription: "New products and launches, by email.",
  statusBadgeText: "Open for new projects",
  /** Locations are separated by "|"; a known city also shows its local time. */
  address: "Dubai, UAE | Hyderabad, India",
  contactPhone: "",
};

/** Wording shipped before, used to tell untouched sample text from a studio edit. */
export const OLD = {
  capabilityTitles: ["AI & Knowledge Systems", "Identity & Security Services", "Automation & Workflows", "Cloud & DevOps Infrastructure", "App Development"],
  capabilitiesTitle: "Our Capabilities",
  stepDescs: [
    "We understand your goals, target architecture, and edge constraints.",
    "We design high-fidelity components, micro-interactions, and interface flows.",
    "We build with extreme quality, component reusability, and Next.js static engine speeds.",
    "We secure telemetry endpoints, Firestore rule configurations, and credentials.",
    "We monitor production latency, optimize edge hits, and provide continuous support.",
  ],
  hero: {
    versionBadge: "Kiwik.1 v1.0.0-beta",
    headlines: ["The Operating System for|future", "The Operating System|for", "The Operating System for|future 2.O"],
    descriptionStart: ["Be the creative director. Let agents be your team.", "Build. Ship. Document. Scale. Everything."],
  },
  tagline: "The Operating System for Digital Products",
  featuredTitles: ["Next-Generation Enterprise Stack", "Explore Kiwik Products"],
  sliderNames: ["HeyGen", "Vidu", "Meta", "x1", "Lightricks", "Runway Gen-3", "Midjourney v6"],
  trustTitles: ["Real products, real deployments", "Security first architecture", "Scalable systems designed for growth", "Ongoing support and optimization"],
  pillTexts: ["AI-Powered Intelligence", "Security First", "Enterprise Ready", "Cloud Native", "Scalable by Design"],
  processBadge: "Execution Workflow",
  dashboardTitles: ["KIWIK OS Kernel", "Kiwik OS Control Console"],
  earthStats: ["99.9%", "14ms", "24/7", "3M+"],
  earthHeadline: "Access the largest enterprise telemetry network.",
  footerLinks: ["Projects Ecosystem", "Desktop Dashboard", "AI Assistant Panel", "Partner Showcase", "About Kiwik", "Digital Market Partner", "Capabilities"],
  footer: {
    copyrightText: "© 2026 Kiwik Inc. All rights reserved.",
    newsletterHeadline: "Stay Updated with Kiwik Releases",
    newsletterDescription: "Subscribe for new project updates, AI telemetry enhancements, and OS features.",
    statusBadgeText: "All Systems Operational",
    address: "Internet, Everywhere",
    contactPhone: "+1 (800) 555-KIWIK",
  },
};
