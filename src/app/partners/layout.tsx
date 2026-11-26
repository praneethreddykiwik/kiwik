import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Digital Marketing — Bring Customers to Your Brand";
const DESCRIPTION =
  "Kiwik plans the campaign, builds the website or app it needs and keeps improving it. What we do for a brand, and who we work with.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/partners") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/partners"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
