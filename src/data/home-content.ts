import type { CapabilityItem, FooterColumn, TrustItem, WorkflowStep } from "@/types/site-cms-types";

export const HERO_COPY = {
  versionBadge: "Software · Apps · AI",
  headlinePrefix: "Software and AI built for",
  headlineHighlightWord: "your business",
  description: "Kiwik designs, builds and looks after websites, mobile apps, AI systems and online stores. Tell us what you need and we take it from idea to launch.",
  primary: { text: "Start a project", href: "/contact" },
  secondary: { text: "See what we have built", href: "/projects" },
};

export const FEATURED_COPY = {
  badgeText: "Our work",
  title: "Real problems, real products",
  description: "Each of these started with a problem. Here is what we built for it.",
};

export const TRUST_ITEMS: TrustItem[] = [
  { id: "tr-1", title: "Products you can open", desc: "See what we have built before you decide to work with us." },
  { id: "tr-2", title: "Security from the start", desc: "Access, passwords and customer data are protected as we build." },
  { id: "tr-3", title: "Ready for more customers", desc: "Planned for more users, more data and more features later on." },
  { id: "tr-4", title: "Support after launch", desc: "We keep watching it, fixing it and improving it with you." },
];

/** What a client says, what Kiwik does about it, and what is different afterwards. */
export interface ClientProblem {
  id: string;
  problem: string;
  fix: string;
  after: string;
  /** Must match an option on the contact form, which it preselects. */
  service: string;
  projectSlug?: string;
}
export const PROBLEMS_TITLE = "What is slowing you down?";
export const PROBLEMS_LEAD = "Pick the one that sounds like you and see what we would do about it.";
export const PROBLEMS: ClientProblem[] = [
  { id: "website", problem: "Our website brings in no enquiries", service: "Website Development", projectSlug: "helm-events",
    fix: "We rebuild it around one question: what does a visitor need to know before they contact you? Clear pages, fast on a phone, easy to find.",
    after: "Visitors understand what you do and have an obvious next step." },
  { id: "sell", problem: "Customers cannot buy from us online", service: "E-commerce",
    fix: "We build an online store with your catalog, cart, secure checkout and order tracking.",
    after: "You can take orders at any hour, without anyone typing them in." },
  { id: "manual", problem: "We run everything on spreadsheets and messages", service: "Automation & Workflows", projectSlug: "helm-events",
    fix: "We put the work in one place and connect the tools you want to keep, so nothing is copied by hand.",
    after: "Everyone sees the same, current information." },
  { id: "app", problem: "Our customers expect an app", service: "App Development", projectSlug: "fooducia",
    fix: "We design and build the iPhone and Android app, and take it through launch.",
    after: "Customers can reach you from the phone in their hand." },
  { id: "ai", problem: "We want to use AI but do not know where", service: "AI Development", projectSlug: "clean-ai",
    fix: "We find the slow, repeated work in your business and build AI for that part first: answering, reading, sorting or quoting.",
    after: "Your team spends its time on the work that needs people." },
  { id: "idea", problem: "We have an idea but no technical team", service: "Software & Product Development", projectSlug: "clean-ai",
    fix: "We turn the idea into a plan, the plan into screens you can react to, and the screens into a working product.",
    after: "You have something real to show customers and improve." },
  { id: "security", problem: "We worry about our customers' data", service: "Security & Identity",
    fix: "We set up safe sign in, decide who may see what, and protect the data as we build rather than at the end.",
    after: "The right people get in, and the rest do not." },
  { id: "hosting", problem: "Nobody looks after our systems", service: "Cloud & DevOps",
    fix: "We move your software to dependable hosting, handle updates and keep watch over it.",
    after: "You know who to call, and your team can get on with its own job." },
];

/** Answers a client wants before getting in touch. Nothing here promises a price or a date. */
export const FAQ_TITLE = "Before you get in touch";
export const FAQ: { q: string; a: string }[] = [
  { q: "We are not technical. Is that a problem?", a: "No. Tell us what is going wrong in your own words. We ask the questions, suggest what to build and explain it in plain language." },
  { q: "How do we start?", a: "Send us a message. We read everything that comes in and usually reply within two working days. Then we talk it through and come back with a plan." },
  { q: "What will it cost, and how long will it take?", a: "That depends on what you need, so we do not publish a price list. Once we understand the problem, the plan sets out what we would build, the time and the cost." },
  { q: "We already have a website or a system. Can you work with it?", a: "Yes. We can improve what you have, connect it to your other tools, or rebuild it when that makes more sense." },
  { q: "What happens after launch?", a: "We keep watching it, fixing it and improving it with you." },
  { q: "Can we see something you have built?", a: "Yes. Every project on this site has its own page, and the live ones link to the real product." },
  { q: "Where are you based?", a: "Dubai and Hyderabad." },
];

/** In the order of the icons saved with them: chip, shield, layers, cloud, sparkles. */
export const PRINCIPLES = ["AI where it helps", "Security from day one", "Built around your business", "Fast on every device", "Easy to grow later"];

export const PROCESS_BADGE = "From first message to launch, and after";

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
  { id: "svc-web", title: "Website Development", desc: "A fast site that explains what you do and turns visitors into enquiries.", iconName: "Globe" },
  { id: "cap-app-development", title: "App Development", desc: "iPhone and Android apps for your customers or your team, from design to launch.", iconName: "Smartphone", projectSlug: "fooducia" },
  { id: "svc-ai", title: "AI Development", desc: "Assistants and AI features that take over slow, repeated work.", iconName: "Sparkles", projectSlug: "clean-ai" },
  { id: "svc-commerce", title: "E-commerce", desc: "Sell online at any hour, with a catalog, cart, secure checkout and order tracking.", iconName: "ShoppingBag", projectSlug: "sowcha" },
  { id: "svc-saas", title: "Software & Product Development", desc: "Your idea as a working product, or one system in place of scattered tools.", iconName: "Layers", projectSlug: "helm-events" },
  { id: "svc-cloud", title: "Cloud & DevOps", desc: "Hosting, deployment and updates handled for you.", iconName: "Cloud" },
  { id: "svc-automation", title: "Automation & Workflows", desc: "Copying, chasing and typing things twice, replaced by tools that talk to each other.", iconName: "Workflow" },
  { id: "svc-security", title: "Security & Identity", desc: "Safe sign in, the right access for the right people, and customer data protected.", iconName: "Shield" },
];
export const TRUST_TITLE = "What you can count on";
export const SERVICES_TITLE = "What we can build for you";

export const PROCESS_STEPS: WorkflowStep[] = [
  { id: "sw-1", step: "01", title: "Discover", desc: "You tell us the problem. We ask questions until we understand it." },
  { id: "sw-2", step: "02", title: "Design", desc: "You see the screens before we build, and change what you want." },
  { id: "sw-3", step: "03", title: "Build", desc: "It takes shape in front of you, and you try it as we go." },
  { id: "sw-4", step: "04", title: "Secure", desc: "We protect sign in, data and access before anyone uses it." },
  { id: "sw-5", step: "05", title: "Operate", desc: "We launch it, watch it and keep improving it with you." },
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
      { id: "fl-partner", label: "Digital marketing", href: "/partners" },
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
  serviceDescs: {
    "svc-web": "Fast, responsive websites and web portals for your business.",
    "cap-app-development": "iOS and Android apps, from design and build through launch and support.",
    "svc-ai": "AI agents, assistants and smart features built into your product.",
    "svc-commerce": "Online stores with catalogs, carts and secure checkout.",
    "svc-saas": "Custom software, SaaS platforms and new products, from first idea to launch.",
    "svc-cloud": "Hosting, deployment and infrastructure, set up and looked after.",
    "svc-automation": "Connected tools and automatic processes in place of manual work.",
    "svc-security": "Sign-in, access control and data protection done properly.",
  } as Record<string, string>,
  stepDescs: [
    "We understand your goals, target architecture, and edge constraints.",
    "We design high-fidelity components, micro-interactions, and interface flows.",
    "We build with extreme quality, component reusability, and Next.js static engine speeds.",
    "We secure telemetry endpoints, Firestore rule configurations, and credentials.",
    "We monitor production latency, optimize edge hits, and provide continuous support.",
    "We learn your goals, your users and your constraints.",
    "We design the screens, the flows and the details.",
    "We build it with clean, reusable, high-quality code.",
    "We protect its data, access and credentials.",
    "We monitor it, improve it and support it after launch.",
  ],
  hero: {
    versionBadges: ["Kiwik.1 v1.0.0-beta", "Websites, apps, AI and custom software"],
    headlines: ["The Operating System for|future", "The Operating System|for", "The Operating System for|future 2.O", "You bring the problem.|We build the software."],
    descriptionStart: ["Be the creative director. Let agents be your team.", "Build. Ship. Document. Scale. Everything.", "A slow website, scattered spreadsheets, an idea with no tech team."],
  },
  tagline: "The Operating System for Digital Products",
  featuredTitles: ["Next-Generation Enterprise Stack", "Explore Kiwik Products", "Products we have built"],
  sliderNames: ["HeyGen", "Vidu", "Meta", "x1", "Lightricks", "Runway Gen-3", "Midjourney v6"],
  trustTitles: ["Real products, real deployments", "Security first architecture", "Scalable systems designed for growth", "Ongoing support and optimization"],
  pillTexts: ["AI-Powered Intelligence", "Security First", "Enterprise Ready", "Cloud Native", "Scalable by Design"],
  processBadges: ["Execution Workflow", "Our process"],
  trustTitle: "Trust & Delivery",
  dashboardTitles: ["KIWIK OS Kernel", "Kiwik OS Control Console"],
  earthStats: ["99.9%", "14ms", "24/7", "3M+"],
  earthHeadline: "Access the largest enterprise telemetry network.",
  footerLinks: ["How we work", "Contact", "Projects Ecosystem", "Desktop Dashboard", "AI Assistant Panel", "Partner Showcase", "About Kiwik", "Digital Market Partner", "Capabilities"],
  footer: {
    copyrightText: "© 2026 Kiwik Inc. All rights reserved.",
    newsletterHeadline: "Stay Updated with Kiwik Releases",
    newsletterDescription: "Subscribe for new project updates, AI telemetry enhancements, and OS features.",
    statusBadgeText: "All Systems Operational",
    address: "Internet, Everywhere",
    contactPhone: "+1 (800) 555-KIWIK",
  },
};

/** The order a client reads the site in, and plainer names for the links. */
export const NAV_LABELS: Record<string, { from: string[]; label: string }> = {
  "nav-2": { from: ["Capabilities", "Services"], label: "Services" },
  "nav-1": { from: ["Projects"], label: "Our work" },
  "nav-3": { from: ["How We Work"], label: "How we work" },
  "nav-partner": { from: ["Digital Market Partner"], label: "Digital marketing" },
  "nav-contact": { from: ["Contact"], label: "Contact" },
};
export const NAV_CTA = { text: "Start a project", href: "/contact", from: "Ask Kiwik AI", fromHref: "#ai" };
