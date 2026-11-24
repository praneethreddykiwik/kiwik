import type { DeviceShowcaseCard, DeviceShowcaseCMS } from "@/types/site-cms-types";

type ProductCardInput = Pick<DeviceShowcaseCard, "id" | "name" | "role" | "quote" | "accentColor" | "backgroundColor" | "order"> & {
  description: string;
  points: string[];
  projectSlug?: string;
  ctaText: string;
  buttonLink: string;
};

const productCard = ({ points, ...card }: ProductCardInput): DeviceShowcaseCard => ({
  ...card,
  tag: card.role,
  template: "product",
  avatarUrl: "",
  frameOverlayUrl: "/phone-frame.png",
  visible: true,
  blocks: [{ id: `${card.id}-points`, type: "skills", visible: true, items: points.map((title) => ({ title })) }],
});

/**
 * The phone row: Kiwik's services in the middle, real products around it.
 *
 * Product copy is taken from each project's own record. Screenshot, logo and
 * status are not stored here: `projectSlug` resolves them live, so they follow
 * whatever is published in the Projects studio.
 */
export const defaultDeviceShowcase: DeviceShowcaseCMS = {
  topBadgeText: "Made by Kiwik",
  cards: [
    productCard({
      id: "show-sowcha", order: 1, projectSlug: "sowcha", name: "Sowcha", role: "E-commerce",
      quote: "Women's fashion, sold online.",
      description: "Curated collections, a full catalog and secure checkout on one platform.",
      points: ["Collections", "Wishlist", "Checkout", "Order tracking"],
      accentColor: "#9d2f4f", backgroundColor: "#FBF1F3", ctaText: "View Sowcha", buttonLink: "/projects/sowcha",
    }),
    productCard({
      id: "show-helm", order: 2, projectSlug: "helm-events", name: "HELM Events", role: "SaaS platform",
      quote: "Event operations, one command centre.",
      description: "Replaces scattered spreadsheets, emails and disconnected tools.",
      points: ["Task management", "Vendors", "CRM", "Ticketing"],
      accentColor: "#0b6b4f", backgroundColor: "#EFF7F3", ctaText: "View HELM Events", buttonLink: "/projects/helm-events",
    }),
    productCard({
      id: "show-kiwik", order: 3, name: "Kiwik", role: "Our services",
      quote: "From idea to live product.",
      description: "Designed, built and supported by Kiwik.",
      points: ["Websites", "Mobile apps", "AI systems", "Online stores", "SaaS platforms"],
      accentColor: "#8FACD9", backgroundColor: "#0B1030", ctaText: "Start a project", buttonLink: "/contact",
    }),
    productCard({
      id: "show-fooducia", order: 4, projectSlug: "fooducia", name: "Fooducia", role: "Mobile app",
      quote: "Farm-fresh, straight to your door.",
      description: "Farm-fresh produce and tailored diet plans, delivered home.",
      points: ["Fresh produce", "Diet plans", "Home delivery"],
      accentColor: "#b7e04a", backgroundColor: "#0B2417", ctaText: "View Fooducia", buttonLink: "/projects/fooducia",
    }),
    productCard({
      id: "show-cleanai", order: 5, projectSlug: "clean-ai", name: "Clean AI", role: "AI marketplace",
      quote: "Home services, matched by AI.",
      description: "AI agents read a photo of the job and match it to nearby verified vendors.",
      points: ["Photo analysis", "Vendor matching", "Clear pricing"],
      accentColor: "#c9b6ff", backgroundColor: "#0F1024", ctaText: "View Clean AI", buttonLink: "/projects/clean-ai",
    }),
  ],
};

/** Names on the sample cards that shipped earlier; none of them were ever real. */
const SAMPLE_CARD_NAMES = new Set([
  "John Richardson", "Jet Hawken", "Leslie Putnam", "Taylor Brown", "Jason Markus",
  "AI & Knowledge", "Design Systems", "Engineering", "Security", "Partnerships",
]);

/** True only if every card is an unedited sample, so studio-made cards are never replaced. */
export function isSampleShowcase(showcase: DeviceShowcaseCMS | undefined): boolean {
  const cards = showcase?.cards || [];
  return cards.length > 0 && cards.every((c) => SAMPLE_CARD_NAMES.has(c.name));
}
