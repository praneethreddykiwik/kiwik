import type { PartnerProduct } from "@/types/partner";

// Large partner media (video, brochure) lives in Supabase Storage rather than
// the repository: ~145MB of video in git would bloat every clone and deploy
// permanently, and Vercel serves these far better from the storage CDN.
const MEDIA = "https://ynueobhylfxnilqldisy.supabase.co/storage/v1/object/public/partner-media/glentree-serenity";

// Seed set for the Alliance showcase — the brands Kiwik partners with.
// All of this is editable in the admin Partners tab and persisted to Postgres.
export const partnerProducts: PartnerProduct[] = [
  {
    id: "alliance-glentree-serenity",
    slug: "glentree-serenity",
    name: "Glentree Serenity",
    tagline: "A villa for your family. A location for your future.",
    category: "Real Estate",
    coverImage: "/partners/serenity-1.jpeg",
    gallery: [
      "/partners/serenity-1.jpeg",
      "/partners/serenity-2.jpeg",
      "/partners/serenity-3.jpeg",
      "/partners/serenity-4.jpeg",
      "/partners/serenity-5.jpeg",
      "/partners/serenity-6.jpeg",
    ],
    logoUrl: "/partners/serenity-1.jpeg",
    videos: [
      {
        url: `${MEDIA}/walkthrough.mp4`,
        poster: `${MEDIA}/walkthrough-poster.jpg`,
        title: "Project walkthrough — Glentree Serenity",
      },
      {
        url: `${MEDIA}/promo.mp4`,
        poster: `${MEDIA}/promo-poster.jpg`,
        title: "Serenity in motion",
      },
    ],
    brochureUrl: `${MEDIA}/brochure.pdf`,
    tags: ["Luxury Villas", "Lakeside Estate", "Nadergul"],
    accentGradient: "from-amber-400 to-emerald-600",
    summary:
      "An 18-acre lakeside villa estate in Nadergul — 184 families, 85+ amenities, premium triplex villas from ₹2.26 Cr.",
    body: `## Exclusive living, without being isolated

Glentree Serenity is an 18-acre lakeside estate in **Nadergul, South Hyderabad** — a peaceful sanctuary for your family that never disconnects you from the city. Premium triplex villas sit next to established neighbourhoods, so daily life stays convenient while the address keeps growing.

## The villas

- **3 & 4 BHK** premium triplex villas
- Plot sizes from **200 to 300 sq yds**
- Starting at **₹2.26 Cr**\\*
- Only **184 limited families** across the estate

## The community

Serenity offers spaces for every generation — not just a home, but everything around it.

- **85+ amenities**
- **2 clubhouses**
- **5 themed parks**
- **18-acre** lakeside estate with immediate access to everything

## Why the location works

Many villa projects offer greenery. Few offer convenience. Serenity sits within South Hyderabad's growing corridor, next to established neighbourhoods — convenient today, and appreciating for tomorrow.

## Approvals

- **RERA:** P02400010707
- **HMDA Permit:** 012013/LO/HMDA/3194/SMD/2024
- Verify at [rera.telangana.gov.in](https://rera.telangana.gov.in)

## Enquire

Book a private site visit — [sales@glentreehomes.in](mailto:sales@glentreehomes.in)

\\*T&C apply.`,
    metrics: [
      { label: "Lakeside estate", value: "18 Acres" },
      { label: "Limited families", value: "184" },
      { label: "Amenities", value: "85+" },
      { label: "Starting at", value: "₹2.26 Cr" },
    ],
    liveUrl: "https://glentreehomes.in",
    featured: true,
    sortOrder: 0,
  },
];
