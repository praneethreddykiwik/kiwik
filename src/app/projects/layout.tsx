import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * page.tsx is a client component and cannot export metadata, so this layout
 * carries it. Without it the route inherited the root title and description
 * verbatim — three indexable pages describing themselves identically, which
 * gives Google nothing to rank any of them on individually.
 */
const TITLE = "Projects — Digital Products Built on Kiwik";
const DESCRIPTION =
  "Every project running on Kiwik, with its status, stack, screenshots and links — each page generated from a single record in the Kiwik CMS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/projects") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/projects"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
