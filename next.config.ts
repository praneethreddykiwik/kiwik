import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // hostname "**" turned /_next/image into an open proxy for any https URL:
    // bandwidth abuse, content laundering through this domain, and an SSRF probe
    // against internal https hosts. Restricted to the hosts actually referenced.
    remotePatterns: [
      { protocol: "https", hostname: "ynueobhylfxnilqldisy.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "helm.events" },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /**
   * www.kiwik.one and kiwik.one both answer 200 with identical HTML, so Google
   * has indexed them as two sites — the www entry still shows an older title.
   * The canonical tag already points at the apex, but a canonical is a hint;
   * a 301 is a directive and consolidates the two immediately.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kiwik.one" }],
        destination: "https://kiwik.one/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
