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
  {
    id: "alliance-sowcha",
    slug: "sowcha",
    name: "SowCha",
    tagline: "Luxury in Simplicity.",
    category: "Fashion",
    coverImage: `${MEDIA_ROOT}/sowcha/sowcha-home.jpg`,
    gallery: [
      `${MEDIA_ROOT}/sowcha/sowcha-home.jpg`,
      `${MEDIA_ROOT}/sowcha/sowcha-mid.jpg`,
      `${MEDIA_ROOT}/sowcha/sowcha-low.jpg`,
    ],
    tags: ["Slow Fashion", "Lookbook", "Next.js"],
    accentGradient: "from-[#657266] to-[#D7C7B8]",
    summary:
      "A slow-fashion label's brand, lookbook and journal — built as a fully static showcase with content edited as code.",
    body: `## The brief

SowCha is a slow-fashion clothing label. The site is a **brand, lookbook and journal** — deliberately not a storefront. There is no cart, checkout, login, pricing, inventory, backend, database or admin panel anywhere in the codebase.

Its stated mission: *"To make everyday dressing feel considered — through natural materials, honest craft and designs that outlive a season."*

## What we built

- **Content as code, not a CMS.** Everything user-facing lives in \`src/config\` as plain TypeScript — brand, products, gallery, journal, themes. Adding an object to \`journal.ts\` publishes a page at \`/journal/<slug>\`.
- **Three swappable palettes** — Sage (default), Blossom and Lavender — switched from the navbar and remembered in \`localStorage\`. An inline script applies the stored theme *before first paint*, so returning visitors never see a flash of the wrong colours.
- **Themed illustrations.** Palettes are CSS-variable RGB triplets, so changing theme re-dyes the hand-drawn botanical artwork along with the interface.
- **Graceful image loading.** Until a Cloudinary image resolves, the frame renders its matching hand-drawn illustration rather than a broken tile.
- **Static end to end.** Every route prerenders to static HTML — no runtime data fetching.

## Craft details

An animated SVG dress with parallax and scroll-triggered drawing anchors the homepage. Accessibility is built in: skip links, labelled controls, keyboard-dismissable dialogs, visible focus rings and reduced-motion support.

## Palettes

| Theme | Character | Key colour |
| --- | --- | --- |
| Sage (default) | Quiet green, warm linen, morning light | \`#657266\` |
| Blossom | Rose petal softness with a gilded edge | \`#D8A6B5\` |
| Lavender | Dusk violet, calm and quietly regal | \`#9E88C6\` |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Cloudinary.`,
    metrics: [
      { label: "Colour themes", value: "3" },
      { label: "Rendering", value: "Static" },
      { label: "Framework", value: "Next.js 15" },
      { label: "Codebase", value: "TypeScript" },
    ],
    liveUrl: "https://sowcha.com/",
    repoUrl: "https://github.com/praneethreddykiwik/sowcha",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "alliance-helm",
    slug: "helm-events",
    name: "HELM Events",
    tagline: "Amateurs panic. Professionals go for HELM.",
    category: "Events",
    coverImage: `${MEDIA_ROOT}/helm/helm-home.jpg`,
    // Their own logo asset, as supplied. Note it is a traced raster (~1.4MB)
    // on an opaque near-white background, so it is used as a link mark rather
    // than composited over dark surfaces.
    logoUrl: "https://helm.events/assets/Helm_logo-B3YNq1lB.svg",
    gallery: [
      `${MEDIA_ROOT}/helm/helm-home.jpg`,
      `${MEDIA_ROOT}/helm/helm-mid.jpg`,
      `${MEDIA_ROOT}/helm/helm-low.jpg`,
    ],
    tags: ["Event Management", "SaaS", "CRM"],
    accentGradient: "from-[#26C867] to-emerald-700",
    summary:
      "A cloud-based event management platform that replaces scattered spreadsheets and disconnected tools with one command centre.",
    body: `## The brief

Professional event teams run on scattered spreadsheets, email threads and disconnected tools. HELM is *"a comprehensive, cloud-based event management platform"* that consolidates the whole operation — **"From Planning to Execution to Analytics, HELM Handles It All."**

## What it does

- **One command centre.** Replaces scattered spreadsheets, emails and disconnected tools with unified event operations management, across multiple concurrent events.
- **Cascading task management.** Work flows from executives to managers to vendors and floor teams, with dependency mapping, automated reminders and milestone tracking.
- **Vendor coordination.** Vendors receive assignments, update progress, upload deliverables and communicate directly inside HELM.
- **Integrated CRM.** Manages relationships with clients, vendors and attendees through intelligent onboarding workflows.
- **Ticketing and registration.** Registration forms, ticketing, confirmations and attendee tracking.
- **Marketing and acquisition.** Audience segmentation and multi-channel campaigns to grow event attendance.
- **Analytics.** Dashboards covering revenue, expenses, profitability and ROI, plus a custom report builder and vendor performance scoring.

## The full lifecycle

HELM covers every stage — **pre-event** planning, **event day** execution, and **post-event** analysis and optimisation — for virtual, hybrid and in-person formats.

## Who it's for

Event managers, coordinators, corporate event teams, venue managers and event professionals of all sizes — from conference organisers and festival teams to trade shows, non-profits and regional agencies.

## Platform

| | |
| --- | --- |
| Uptime SLA | 99.9% with automated failover and disaster recovery |
| Free trial | 14 days, no contract or credit card |
| Implementation | Typically 1–2 weeks including setup, training and data migration |
| Pricing | Based on event volume, team size and feature requirements |

## Stack

React · Redux Toolkit · styled-components · MUI · Vite, served from AWS S3 behind CloudFront, against a dedicated API tier.

## Contact

Spacion Towers, Vittal Rao Nagar, HITEC City, Hyderabad, Telangana 500081
[Sales@Helm.events](mailto:Sales@Helm.events) · [Support@Helm.events](mailto:Support@Helm.events) · +91 8121458444`,
    metrics: [
      { label: "Uptime SLA", value: "99.9%" },
      { label: "Free trial", value: "14 days" },
      { label: "Implementation", value: "1–2 weeks" },
      { label: "Encryption", value: "256-bit" },
    ],
    liveUrl: "https://helm.events/",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "alliance-cleanai",
    slug: "clean-ai",
    name: "Clean AI",
    tagline: "Enterprise-grade AI home services marketplace.",
    category: "AI Marketplace",
    // No public deployment to screenshot yet, so the card and hero fall back to
    // the accent gradient rather than a broken tile. Drop a URL in from the
    // admin studio when imagery is ready.
    coverImage: "",
    gallery: [],
    tags: ["AI Agents", "Marketplace", "TypeScript"],
    accentGradient: "from-cyan-500 to-blue-600",
    summary:
      "A four-role home-services marketplace where an AI agent pipeline reads a photo of the job, scores its complexity and matches verified vendors.",
    body: `## The brief

Connect customers with verified home service vendors through intelligent matching — across twelve service categories, from home and event cleaning to repairs, pest control and moving.

## The marketplace loop

Customer books a service → the platform finds vendors → the vendor assigns an agent → the agent completes the work → the customer pays and reviews.

## The agent pipeline

Five specialised agents run in sequence on every request:

| Agent | Job |
| --- | --- |
| Supervisor | Orchestrates the request |
| Vision | Reads uploaded job photos for dirt level and complexity |
| Pricing | Builds the itemised quote |
| Vendor | Matches and ranks nearby vendors |
| Booking | Closes the loop |

**Work Complexity Index.** The vision agent scores each job 0–100, weighting dirt (25%), area (20%), surfaces (15%), density, chemical need and equipment (10% each), then accessibility and safety risk (5% each).

**Vendor matching** expands its search radius progressively — 15km, then 30, 50 and 100 — scoring candidates and returning the best five.

**Transparent pricing.** Every quote itemises base price, AI complexity surcharge, labour, travel, weekend and night surcharges, GST, coupon discount, platform fee and the vendor's share.

## Four portals

Customer, vendor, agent and admin each get their own route tree, with OTP login, password reset and role-based access control.

## Stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Node/Express · Prisma + PostgreSQL · Redis · BullMQ · Socket.io · Cloudinary. Vision and reasoning run on Groq (Llama 3.2 vision) and Gemini 2.5 Flash. Payments via Razorpay and Stripe.`,
    metrics: [
      { label: "Service categories", value: "12" },
      { label: "AI agents", value: "5" },
      { label: "Complexity index", value: "0–100" },
      { label: "Match radius", value: "15–100 km" },
    ],
    repoUrl: "https://github.com/praneethreddykiwik/cleanAI",
    sortOrder: 3,
  },
];
