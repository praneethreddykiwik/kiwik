// ─────────────────────────────────────────────────────────────
// Kiwik.1 — Partner Products (the "Alliance" showcase).
// A separate, independently-managed collection distinct from Projects.
// ─────────────────────────────────────────────────────────────

export interface PartnerMetric {
  label: string;
  value: string;
}

export interface PartnerProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  /** Short label shown as a pill on the card, e.g. "Commerce", "Creator". */
  category?: string;
  /** Card / hero cover image URL. */
  coverImage: string;
  /** Additional image URLs shown as a gallery on the detail page. */
  gallery?: string[];
  logoUrl?: string;
  tags: string[];
  /** Tailwind gradient classes for the card accent, e.g. "from-indigo-500 to-purple-600". */
  accentGradient?: string;
  /** One-line blurb rendered on the card. */
  summary?: string;
  /** Longer markdown body rendered on the detail page. */
  body?: string;
  metrics?: PartnerMetric[];
  liveUrl?: string;
  featured?: boolean;
  sortOrder?: number;
  createdAt?: string;
  lastUpdated?: string;
}
