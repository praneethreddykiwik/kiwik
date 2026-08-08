import type { PartnerProduct } from "@/types/partner";

// Seed set for the Alliance showcase. Deliberately written with distinctive,
// non-generic language. All of this is editable in the admin Partners tab and
// persisted to Postgres.
export const partnerProducts: PartnerProduct[] = [
  {
    id: "alliance-lumen",
    slug: "lumen-commerce",
    name: "Lumen Commerce",
    tagline: "A storefront that sells while you sleep — and learns while it does.",
    category: "Commerce",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop",
    tags: ["Storefront", "Attribution", "Lifecycle"],
    accentGradient: "from-amber-400 to-rose-500",
    summary: "We rebuilt the buying path around intent, not clicks — conversions followed.",
    body:
      "## The brief\nLumen had traffic but leaks. Attention arrived and evaporated before checkout.\n\n## What we moved\nWe re-sequenced the entire path from first glance to first purchase, wiring each step to a measurable signal. Creative was engineered to compound — every asset earned attention and fed the next.\n\n## The shape of the result\nA storefront that behaves like a system: it notices, adapts, and keeps a warm memory of everyone who passes through.",
    metrics: [
      { label: "Path friction", value: "-41%" },
      { label: "Repeat rate", value: "2.3x" },
      { label: "Time to value", value: "9 days" },
    ],
    featured: true,
    sortOrder: 0,
  },
  {
    id: "alliance-cadence",
    slug: "cadence-creator",
    name: "Cadence",
    tagline: "Turning a creator's scattered output into a compounding audience engine.",
    category: "Creator",
    coverImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    tags: ["Audience", "Distribution", "Signal"],
    accentGradient: "from-indigo-500 to-purple-600",
    summary: "Distribution designed so momentum carries, not resets, between drops.",
    body:
      "## The brief\nGreat work, quiet growth. Each release started the climb over again.\n\n## What we moved\nWe mapped where the audience already leaned and built the shortest path from curiosity to conviction — then made every release inherit the reach of the last.\n\n## The shape of the result\nA cadence that stacks. Nothing plateaus quietly anymore.",
    metrics: [
      { label: "Owned reach", value: "5.1x" },
      { label: "Drop-over-drop lift", value: "+68%" },
    ],
    featured: true,
    sortOrder: 1,
  },
  {
    id: "alliance-atlas",
    slug: "atlas-partner-network",
    name: "Atlas Network",
    tagline: "Revenue-aligned partnerships where our upside is your growth.",
    category: "Partnerships",
    coverImage:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    tags: ["Affiliate", "Economics", "Scale"],
    accentGradient: "from-emerald-400 to-teal-500",
    summary: "An affiliate structure built on aligned incentives instead of ad spend.",
    body:
      "## The brief\nAtlas wanted reach without renting it — growth that didn't reset the moment budget paused.\n\n## What we moved\nWe designed partner economics where every collaborator wins when Atlas does, then instrumented the whole network so contribution is legible, not guessed.\n\n## The shape of the result\nA compounding partner flywheel that keeps turning after the spend stops.",
    metrics: [
      { label: "Partner-sourced rev", value: "34%" },
      { label: "CAC vs. paid", value: "-52%" },
    ],
    sortOrder: 2,
  },
];
