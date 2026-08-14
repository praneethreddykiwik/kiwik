import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Documentation — How Kiwik Works";
const DESCRIPTION =
  "Kiwik documentation: the content model, the admin studio, the publishing pipeline, the AI assistant, and how a project record becomes a live page.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/docs") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/docs"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
