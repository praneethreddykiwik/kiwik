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

/** Rewrite every Supabase public-storage URL inside a string (plain text or serialized JSON). */
export function proxyMediaUrls(text: string): string {
  return text.includes(SUPABASE_PUBLIC_STORAGE)
    ? text.split(SUPABASE_PUBLIC_STORAGE).join(MEDIA_PROXY_PREFIX)
    : text;
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
