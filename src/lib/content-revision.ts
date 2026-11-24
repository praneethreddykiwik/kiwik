import { defaultDeviceShowcase, isSampleShowcase } from "@/data/device-showcase";
import type { CapabilityItem, SiteCMSData } from "@/types/site-cms-types";

/**
 * Content changes that have to reach the copy of the CMS already saved in
 * Postgres and in visitors' localStorage, both of which override the defaults.
 *
 * This deliberately does not bump NAV_SCHEMA_VERSION: that swaps the whole
 * saved navbar for the defaults and would drop links added in the studio (the
 * live "Contact" item exists only in the database).
 */
export const CONTENT_REVISION = 2;

export const APP_DEVELOPMENT_CAPABILITY: CapabilityItem = {
  id: "cap-app-development",
  title: "App Development",
  desc: "iOS, Android and web applications, from design and build through launch and support.",
  iconName: "Smartphone",
};

/** /docs no longer exists (next.config.ts redirects it), so nothing may link to it. */
export function isRetiredHref(href: string | undefined): boolean {
  return /^(?:\/|#|\/#)docs(?:$|[/?#])/i.test((href || "").trim());
}

const OLD_SEARCH_PLACEHOLDER = "Search projects, docs, commands...";

/**
 * @param savedRevision revision stored with the incoming content, if any. One-off
 * additions run only below CONTENT_REVISION, so once the studio saves, an editor
 * can change or delete them for good.
 */
export function applyContentRevision(cms: SiteCMSData, savedRevision: number | undefined): SiteCMSData {
  const next: SiteCMSData = { ...cms, contentRevision: CONTENT_REVISION };

  if (cms.navigation) {
    next.navigation = {
      ...cms.navigation,
      items: (cms.navigation.items || []).filter((i) => !isRetiredHref(i.href)),
    };
  }

  if (cms.footer) {
    next.footer = {
      ...cms.footer,
      columns: (cms.footer.columns || [])
        .map((col) => ({ col, links: (col.links || []).filter((l) => !isRetiredHref(l.href)) }))
        // Drop a column only if removing dead links is what emptied it.
        .filter(({ col, links }) => links.length > 0 || (col.links || []).length === 0)
        .map(({ col, links }) => ({ ...col, links })),
      bottomLinks: (cms.footer.bottomLinks || []).filter((l) => !isRetiredHref(l.href)),
    };
  }

  if (cms.dashboardShowcase?.searchPlaceholder === OLD_SEARCH_PLACEHOLDER) {
    next.dashboardShowcase = { ...cms.dashboardShowcase, searchPlaceholder: "Search projects, commands..." };
  }

  if ((savedRevision ?? 0) < 1 && cms.capabilities) {
    const items = cms.capabilities.items || [];
    if (!items.some((i) => /app development/i.test(i.title || ""))) {
      next.capabilities = { ...cms.capabilities, items: [...items, APP_DEVELOPMENT_CAPABILITY] };
    }
  }

  // Sample phone cards (invented people and testimonials) become real products.
  if ((savedRevision ?? 0) < 2 && isSampleShowcase(cms.deviceShowcase)) {
    next.deviceShowcase = defaultDeviceShowcase;
  }

  return next;
}
