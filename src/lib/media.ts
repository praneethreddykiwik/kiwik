/**
 * Same-origin paths for Supabase Storage media.
 *
 * Several Indian ISPs DNS-block *.supabase.co (the resolver hands back a block
 * page IP and the TLS handshake is reset), so every image and video linked
 * straight at the bucket failed for visitors there with ERR_CONNECTION_RESET /
 * ERR_CONNECTION_CLOSED. next.config.ts rewrites /media/* to the bucket, which
 * makes Vercel fetch it server-side — the visitor only ever talks to kiwik.one.
 *
 * Stored content still holds the absolute Supabase URLs, so they are rewritten
 * wherever content leaves the server (API responses) or re-enters the page
 * (localStorage caches written before this change).
 */
export const SUPABASE_PUBLIC_STORAGE =
  "https://ynueobhylfxnilqldisy.supabase.co/storage/v1/object/public/";

export const MEDIA_PROXY_PREFIX = "/media/";

/**
 * HELM's current icon. helm.events refuses to let other sites embed its files,
 * so it goes through our image service (the host is allowed in next.config.ts).
 */
export const HELM_LOGO_URL = "/_next/image?url=https%3A%2F%2Fhelm.events%2Fapple-touch-icon.png&w=128&q=75";

/** Bucket prefix → proxy, then links whose file is gone at its source → a working one. */
const REPLACED_URLS: [from: string, to: string][] = [
  [SUPABASE_PUBLIC_STORAGE, MEDIA_PROXY_PREFIX],
  ["https://helm.events/assets/Helm_logo-B3YNq1lB.svg", HELM_LOGO_URL],
  ["https://images.unsplash.com/photo-1677442136019-21780efad99a", "https://images.unsplash.com/photo-1674027444485-cec3da58eef4"],
];

/** Rewrite stored media URLs inside a string (plain text or serialized JSON). */
export function proxyMediaUrls(text: string): string {
  return REPLACED_URLS.reduce((out, [from, to]) => (out.includes(from) ? out.split(from).join(to) : out), text);
}

/**
 * localStorage adapter for zustand's persist that rewrites media URLs on read,
 * so a browser holding a cache from before the proxy does not request the
 * blocked host on first paint.
 */
export const mediaRewritingLocalStorage = {
  getItem: (name: string): string | null => {
    try {
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(name) : null;
      return raw == null ? raw : proxyMediaUrls(raw);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(name, value);
    } catch {
      /* storage full or unavailable */
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof localStorage !== "undefined") localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

/**
 * A resized copy of one of our own images, via Next's image service: uploaded
 * screenshots run to about 1MB, the copy is a few KB. Anything else is unchanged.
 */
export function optimizedImage(url: string, width: 640 | 828 | 1200): string {
  const own = url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/_next/");
  if (!own || /\.(svg|gif)(?:$|\?)/i.test(url)) return url;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;
}
