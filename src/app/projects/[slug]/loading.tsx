/**
 * Instant response for a project navigation.
 *
 * Without a loading boundary the router holds the old page on screen until the
 * new one is ready, so a click looks like nothing happened. This renders the
 * moment the navigation starts, which is what makes the click feel immediate
 * even when the payload takes a few hundred milliseconds to arrive.
 *
 * Its shape mirrors the real page — back link, badges, title, hero image, body
 * — so the transition settles instead of jumping.
 */
export default function ProjectLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading project">
      <span className="sr-only">Loading project…</span>

      <div className="h-9 w-40 animate-pulse rounded-full bg-bg-secondary" />

      <div className="mt-10 flex gap-3">
        <div className="h-7 w-20 animate-pulse rounded-full bg-bg-secondary" />
        <div className="h-7 w-16 animate-pulse rounded-full bg-bg-secondary" />
        <div className="h-7 w-28 animate-pulse rounded-full bg-bg-secondary" />
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="h-14 w-4/5 animate-pulse rounded-2xl bg-bg-secondary" />
          <div className="h-6 w-3/5 animate-pulse rounded-xl bg-bg-secondary" />
          <div className="space-y-2.5 pt-2">
            <div className="h-4 w-full animate-pulse rounded bg-bg-secondary" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-bg-secondary" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-bg-secondary" />
          </div>
          <div className="h-11 w-52 animate-pulse rounded-full bg-bg-secondary" />
          <div className="mt-4 aspect-video w-full animate-pulse rounded-2xl bg-bg-secondary" />
        </div>

        <aside className="hidden lg:block">
          <div className="h-72 w-full animate-pulse rounded-2xl bg-bg-secondary" />
        </aside>
      </div>
    </div>
  );
}
