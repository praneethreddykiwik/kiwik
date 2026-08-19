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
      {
        source: "/capabilities",
        destination: "/#capabilities",
        permanent: true,
      },
      {
        source: "/how-we-work",
        destination: "/#how-we-work",
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
          {
            // The site asks for none of these. Denying them outright means a
            // script that somehow does run still cannot reach a camera, a
            // microphone, or location.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          {
            // Defence in depth behind React's escaping, which is what actually
            // stops the contact form's untrusted input from executing.
            //
            // 'unsafe-inline' and 'unsafe-eval' are present under script-src
            // because Next injects inline bootstrap and flight-data scripts,
            // and this app also renders the theme-init script inline before
            // paint. A nonce-based strict-dynamic policy is the stronger
            // approach and is the right follow-up, but it requires routing a
            // per-request nonce through those inline scripts — a change that
            // has to be made carefully rather than bundled into a security
            // pass. Stated plainly so the weakness is not mistaken for a
            // hardened policy.
            //
            // The parts that are tight and do real work: object-src 'none'
            // kills legacy plugin vectors, base-uri 'self' stops base-tag
            // hijacking, frame-ancestors 'self' backs up X-Frame-Options, and
            // connect-src is limited to the origins this app actually calls.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "media-src 'self' https://ynueobhylfxnilqldisy.supabase.co",
              "font-src 'self' data:",
              "connect-src 'self' https://ynueobhylfxnilqldisy.supabase.co",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
