import type { PartnerProduct } from "@/types/partner";

// Large partner media (video, brochure) lives in Supabase Storage rather than
// the repository: ~145MB of video in git would bloat every clone and deploy
// permanently, and Vercel serves these far better from the storage CDN.
const MEDIA_ROOT = "https://ynueobhylfxnilqldisy.supabase.co/storage/v1/object/public/partner-media";
const MEDIA = `${MEDIA_ROOT}/glentree-serenity`;

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
      "An 18-acre lakeside villa estate in Nadergul — 184 families, 85+ amenities, premium triplex villas from ₹2.26 Cr* (T&C apply).",
    body: `## Exclusive living, without being isolated

Glentree Serenity is an 18-acre lakeside estate in **Nadergul, South Hyderabad** — a peaceful lakeside sanctuary for your family, without disconnecting from your world. Premium triplex villas sit next to established neighbourhoods, on a 150 ft wide road.

## The villas

G+2 premium triplex villas, 100% Vastu-compliant, in three plot sizes:

| Plot | Configuration | Built-up area |
| --- | --- | --- |
| 200 sq yds | 3 BHK + multipurpose | 2,836 – 2,876 sq ft |
| 267 sq yds | 4 BHK + multipurpose | 3,685 – 3,715 sq ft |
| 300 sq yds | 4 BHK + maid room + multipurpose | 4,276 – 4,286 sq ft |

Starting at **₹2.26 Cr**\\*. Only **184 villas** across the estate.

## Two clubhouses, 42,000+ sq ft

- **Club Serene** (~29,479 sq ft) — banquet hall, swimming pool, gym, salon & spa, library, crèche, co-working, 3 guest suites
- **Veranda Pavilion** (~12,866 sq ft) — 2 badminton courts, squash court, indoor games

## 85+ amenities and 5 themed parks

**Sahavas** (social), **Veer Garden** (sports), **Aranya** (forest), **Ekaanth** (serene) and **Ananda Vana** (wellness) — across **83,000+ sq ft of green space**, with a vehicle-free podium zone.

Also included: pickleball court, cricket pitch, amphitheatre, home theatre, temple, cloud kitchen, EV charging, IoT smart water meters, integrated solar, senior citizen garden, pet park, cycling track and barrier-free access.

## Connectivity

| Destination | Time |
| --- | --- |
| TSIIC Aerospace SEZ · DPS Nadergul · MVSR Engineering | 5 min |
| TCS Adibatla | 12 min |
| Wonderla | 16 min |
| Foxconn (KK Park) | 20 min |
| RGI Airport · DRDO | 24 min |
| LB Nagar | 28 min |
| Future City | 45 min |

A 150 ft road is proposed to the ORR, Srisailam Road and the airport; 120 ft to Srisailam Road and Hayathnagar.

## Build & sustainability

**IGBC Gold pre-certified (proposed).** 100% DG power backup, STP with treated-water reuse, rainwater harvesting, CCTV, dedicated parking per villa, hydraulic-lift provision, Grohe/Jaquar fittings and UPVC windows.

## Approvals & possession

- **RERA:** P02400010707 — delivery timeline of **October 2029** under RERA registration
- **HMDA Permit:** 012013/LO/HMDA/3194/SMD/2024
- **GHMC Permit:** 1638/GHMC/SWBP/SEC1/2025
- Verify at [rera.telangana.gov.in](https://rera.telangana.gov.in)

## Enquire

Sy. No. 578, Nadergul Village, Balapur Mandal, Ranga Reddy, Telangana 501510
Glentree Villas LLP, Jubilee Hills, Hyderabad 500033

[sales@glentreehomes.in](mailto:sales@glentreehomes.in) · 96466 44644

\\*T&C apply. Images are artistic impressions.`,
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
