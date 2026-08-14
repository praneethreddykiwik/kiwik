import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Digital Market Partner — Work Delivered on Kiwik";
const DESCRIPTION =
  "Partner work delivered and published through Kiwik: product engineering, digital infrastructure and go-to-market support, documented in the same workspace that runs it.";

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
