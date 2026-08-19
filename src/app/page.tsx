import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import { HomePageClient } from "@/components/home/home-page-client";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kiwik — The Operating System for Digital Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
