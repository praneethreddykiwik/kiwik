import type { Metadata } from "next";
import { Hanken_Grotesk, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import "./globals.css";

// Self-hosted through next/font instead of an @import in globals.css. The
// @import was only discovered after the stylesheet had downloaded, so it
// blocked first paint on a third-party round trip; these are served from our
// own origin with the font files preloaded and the fallback metric-matched, so
// there is no layout shift when the real face swaps in.
//
// Body copy is Hanken Grotesk: whoop.com sets its text in Proxima Nova, and
// Hanken Grotesk is the closest open equivalent — same geometric-humanist
// skeleton and tall x-height, which is what keeps small copy readable.
const fontSans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

// Headings and display type are unchanged.
const fontSerif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LayoutMain } from "@/components/layout/layout-main";
import { CommandPalette } from "@/components/search/command-palette";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { IntroSplash } from "@/components/layout/intro-splash";

export const metadata: Metadata = {
  // metadataBase makes every relative canonical/OG URL resolve against the
  // canonical origin instead of the deployment host, which is what kept
  // Vercel preview URLs out of shared links and search results.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Kiwik",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Criska" }],
  creator: "Criska",
  publisher: "Criska",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Kiwik" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
import { TelemetryProvider } from "@/components/providers/telemetry-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <head>
        {/* WebSite + Organization structured data. Only facts that are true and
            visible on the site — no invented social profiles or ratings. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                alternateName: ["Kiwik.1", "Kiwik OS", "Kiwik.one"],
                url: SITE_URL + "/",
                description: SITE_DESCRIPTION,
                publisher: { "@id": SITE_URL + "/#organization" },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": SITE_URL + "/#organization",
                name: "Criska",
                alternateName: "Kiwik",
                url: SITE_URL + "/",
                logo: SITE_URL + "/logo.png",
                description: SITE_DESCRIPTION,
              },
            ]),
          }}
        />
        {/* Blocking theme-init script — runs before first paint to prevent FOUC.
            Reads from the correct Zustand key 'kiwik-theme'.
            Hides body until theme is applied, then reveals instantly. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var stored = localStorage.getItem('kiwik-theme');
    var mode = 'dark';
    var accent = 'blue';
    if (stored) {
      var parsed = JSON.parse(stored);
      if (parsed && parsed.state) {
        mode = parsed.state.mode || 'dark';
        accent = parsed.state.accent || 'blue';
      }
    }
    var root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-accent', accent);
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch(e) {}
})()`,
          }}
        />
      </head>
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
            <TelemetryProvider />
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
