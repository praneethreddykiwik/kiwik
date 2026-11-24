import type { CapabilityItem, WorkflowStep } from "@/types/site-cms-types";

/** `projectSlug` links a service to a published project that demonstrates it. */
export const SERVICES: CapabilityItem[] = [
  { id: "svc-web", title: "Website Development", desc: "Fast, responsive websites and web portals for your business.", iconName: "Globe" },
  { id: "cap-app-development", title: "App Development", desc: "iOS and Android apps, from design and build through launch and support.", iconName: "Smartphone", projectSlug: "fooducia" },
  { id: "svc-ai", title: "AI Development", desc: "AI agents, assistants and smart features built into your product.", iconName: "Sparkles", projectSlug: "clean-ai" },
  { id: "svc-commerce", title: "E-commerce", desc: "Online stores with catalogs, carts and secure checkout.", iconName: "ShoppingBag", projectSlug: "sowcha" },
  { id: "svc-saas", title: "SaaS & Custom Software", desc: "Platforms and dashboards shaped around how your team works.", iconName: "Layers", projectSlug: "helm-events" },
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
};
