import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LayoutMain } from "@/components/layout/layout-main";
import { CommandPalette } from "@/components/search/command-palette";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { IntroSplash } from "@/components/layout/intro-splash";

export const metadata: Metadata = {
  title: "Kiwik.1 — The Operating System for Modern Projects",
  description:
    "Premium project showcase platform for Kiwik. Explore our portfolio of AI, web, mobile, and automation projects with immersive documentation and cinematic design.",
  keywords: ["Kiwik", "portfolio", "projects", "showcase", "glassmorphism"],
  authors: [{ name: "Kiwik Team" }],
  openGraph: {
    title: "Kiwik.1 — The Operating System for Modern Projects",
    description:
      "Premium project showcase platform. Explore our portfolio with cinematic design.",
    type: "website",
    url: "https://kiwik.one",
    siteName: "Kiwik.1",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiwik.1 — The Operating System for Modern Projects",
    description:
      "Premium project showcase platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
};

import { LenisProvider } from "@/components/providers/lenis-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col overflow-x-hidden w-full max-w-full"
        style={{
          fontFamily: "var(--font-sans)",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <ThemeProvider>
          <LenisProvider>
            <IntroSplash />
            <CursorGlow />
            <Navbar />
            <CommandPalette />
            <LayoutMain>{children}</LayoutMain>
            <Footer />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
