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
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "Kiwik",
    "Kiwik OS",
    "operating system for digital products",
    "engineering workflow platform",
    "project documentation platform",
    "digital product workspace",
  ],
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
    // A dedicated 1200x630 card. /logo.png was declared here as 512x512 when it
    // is really a transparent 1024x1024 square — wrong dimensions, wrong shape
    // for a link preview, and transparency renders as black on most platforms.
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Kiwik — the operating system for digital products" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  // max-snippet governs how much of a page any engine may reproduce in a
  // result or an AI answer. It was set only inside the googleBot block, so
  // every other crawler — Bing, and the answer engines that read the generic
  // tag — fell back to a truncated default. Declared at both levels now.
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Every declared size here is the file's real size. The previous block listed
  // /logo.png first with no size and claimed /icon.png was 32x32 when both were
  // the same transparent 1024x1024 image — so the icon a client actually picked
  // was the wide, transparent logo, which is not usable as a favicon.
  // The ?v= is a cache-buster. Browsers cache a favicon by its exact URL and
  // will keep serving a stale copy after the file changes at the same path —
  // which is why a rebuilt favicon looked "unchanged". Bumping this version
  // forces every browser to fetch the current icons. Raise it on each icon
  // change.
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png?v=3", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png?v=3", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
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
        {/* WebSite + Organization + SoftwareApplication structured data. Only
            facts that are true and visible on the site — no invented social
            profiles or ratings.

            The Organization used to be named "Criska" with Kiwik as a mere
            alternateName. Google reads this block to decide which entity the
            domain IS, so it was actively teaching Google the wrong brand for
            kiwik.one. Kiwik is the entity; the logo is a real square PNG,
            which is what Google's logo guidelines require. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": SITE_URL + "/#website",
                name: SITE_NAME,
                alternateName: ["Kiwik OS", "Kiwik.one", "Kiwik One"],
                url: SITE_URL + "/",
                description: SITE_DESCRIPTION,
                inLanguage: "en",
                publisher: { "@id": SITE_URL + "/#organization" },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": SITE_URL + "/#organization",
                name: SITE_NAME,
                alternateName: ["Kiwik OS", "Kiwik One"],
                url: SITE_URL + "/",
                logo: {
                  "@type": "ImageObject",
                  url: SITE_URL + "/icon-512.png",
                  width: 512,
                  height: 512,
                },
                image: SITE_URL + "/og-image.png",
                description: SITE_DESCRIPTION,
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "@id": SITE_URL + "/#software",
                name: SITE_NAME,
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web",
                url: SITE_URL + "/",
                description: SITE_DESCRIPTION,
                publisher: { "@id": SITE_URL + "/#organization" },
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
