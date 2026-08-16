"use client";

/**
 * One poller per endpoint, shared by every component that needs it.
 *
 * Each of `useSiteCMS`, `useProjects` and `useProducts` used to open its own
 * `setTimeout` chain inside its own `useEffect`, so N call sites meant N timers
 * all fetching the identical URL. On the home page that was 8 pollers for
 * /api/cms and 6 for /api/projects — 14 timers at a 3s interval, roughly 280
 * requests a minute per open tab, with all 14 firing simultaneously at mount
 * and competing with the JS bundle and hero images for the connection pool.
 *
 * This keeps a single timer per endpoint with a subscriber refcount, and skips
 * the store write entirely when the payload is byte-identical to the last one
 * — which removes the re-render storm and the repeated localStorage writes that
 * the constant new object identities were causing.
 */

type Listener = (data: any) => void;

type Channel = {
  listeners: Set<Listener>;
  timer: ReturnType<typeof setTimeout> | null;
  lastRaw: string | null;
  lastData: any;
  inFlight: Promise<void> | null;
  cleanup: (() => void) | null;
};

const channels = new Map<string, Channel>();

const POLL_MS = 15000;

function getChannel(url: string): Channel {
  let c = channels.get(url);
  if (!c) {
    c = { listeners: new Set(), timer: null, lastRaw: null, lastData: undefined, inFlight: null, cleanup: null };
    channels.set(url, c);
  }
  return c;
}

async function fetchOnce(url: string, channel: Channel) {
  if (channel.inFlight) return channel.inFlight;

  channel.inFlight = (async () => {
    try {
      // Not `cache: "no-store"`. That flag bypasses the HTTP cache entirely, so
      // every poll pulled the whole payload over the wire even when nothing had
      // changed. The routes now send `max-age=0` plus an ETag, so the browser
      // still checks freshness on every poll but a match comes back as a
      // bodiless 304 and fetch resolves it from cache — same correctness, none
      // of the bytes.
      const res = await fetch(url);
      if (res.status === 304) return;
      const raw = await res.text();
      // Unchanged payload: don't touch the stores at all. This is what stops
      // the whole tree re-rendering several times a second while idle.
      if (raw === channel.lastRaw) return;
      channel.lastRaw = raw;
      channel.lastData = JSON.parse(raw);
      channel.listeners.forEach((fn) => {
        try {
          fn(channel.lastData);
        } catch {
          /* one bad subscriber must not stop the others */
        }
      });
    } catch {
      /* leave the last good data in place */
    } finally {
      channel.inFlight = null;
    }
  })();

  return channel.inFlight;
}

function schedule(url: string, channel: Channel) {
  if (channel.timer) clearTimeout(channel.timer);
  channel.timer = setTimeout(async () => {
    // A hidden tab does no work; the visibilitychange handler catches it up.
    if (typeof document === "undefined" || document.visibilityState === "visible") {
      await fetchOnce(url, channel);
    }
    if (channel.listeners.size > 0) schedule(url, channel);
  }, POLL_MS);
}

/**
 * Subscribe to an endpoint. Returns an unsubscribe function.
 * The first subscriber starts the timer; the last one stops it.
 */
export function subscribeToEndpoint(url: string, listener: Listener): () => void {
  const channel = getChannel(url);
  channel.listeners.add(listener);

  // Replay the most recent payload so a late subscriber doesn't wait a cycle.
  if (channel.lastData !== undefined) {
    try {
      listener(channel.lastData);
    } catch {
      /* ignore */
    }
  }

  if (channel.listeners.size === 1) {
    const onWake = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        fetchOnce(url, channel);
      }
    };

    window.addEventListener("focus", onWake);
    window.addEventListener("kiwik-data-updated", onWake);
    document.addEventListener("visibilitychange", onWake);

    let bc: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel("kiwik-global-sync");
        bc.onmessage = (msg) => {
          if (msg.data === "kiwik-data-updated") onWake();
        };
      } catch {
        /* ignore */
      }
    }

    channel.cleanup = () => {
      window.removeEventListener("focus", onWake);
      window.removeEventListener("kiwik-data-updated", onWake);
      document.removeEventListener("visibilitychange", onWake);
      bc?.close();
    };

    fetchOnce(url, channel);
    schedule(url, channel);
  }

  return () => {
    channel.listeners.delete(listener);
    if (channel.listeners.size === 0) {
      if (channel.timer) clearTimeout(channel.timer);
      channel.timer = null;
      channel.cleanup?.();
      channel.cleanup = null;
    }
  };
}
