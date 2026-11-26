import { defaultDeviceShowcase, isSampleShowcase } from "@/data/device-showcase";
import {
  DASHBOARD_COPY, EARTH_COPY, FEATURED_COPY, FOOTER_COLUMNS, FOOTER_COPY, HERO_COPY, NAV_CTA, NAV_LABELS, OLD, PRINCIPLES, PROCESS_BADGE, PROCESS_STEPS,
  SERVICES, SERVICES_TITLE, TRUST_ITEMS, TRUST_TITLE, galleryTitle,
} from "@/data/home-content";
import { SITE_TAGLINE } from "@/lib/site";
import type { SiteCMSData } from "@/types/site-cms-types";

/**
 * Content changes that have to reach the copy of the CMS already saved in
 * Postgres and in visitors' localStorage, both of which override the defaults.
 *
 * This deliberately does not bump NAV_SCHEMA_VERSION: that swaps the whole
 * saved navbar for the defaults and would drop links added in the studio (the
 * live "Contact" item exists only in the database).
 */
export const CONTENT_REVISION = 8;

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
    next.dashboardShowcase = { ...cms.dashboardShowcase, searchPlaceholder: "Search projects..." };
  }

  // Sample phone cards (invented people and testimonials) become real products.
  if ((savedRevision ?? 0) < 2 && isSampleShowcase(cms.deviceShowcase)) {
    next.deviceShowcase = defaultDeviceShowcase;
  }

  if ((savedRevision ?? 0) < 7) applyServiceCopy(next);
  if ((savedRevision ?? 0) < 7) applyEarthAndFooterCopy(next);
  if ((savedRevision ?? 0) < 7) applySiteCopy(next);

  // A studio-edited service list is kept, but still gains App Development once.
  const services = next.capabilities?.items;
  if ((savedRevision ?? 0) < 1 && services && !services.some((s) => /app development/i.test(s.title || ""))) {
    const appDevelopment = SERVICES.find((s) => s.id === "cap-app-development")!;
    next.capabilities = { ...next.capabilities, items: [...services, appDevelopment] };
  }

  return next;
}

/**
 * Replaces the sample service list and process wording with copy written for
 * clients. Every check is against the exact text that shipped, so anything edited in the studio is kept.
 */
function applyServiceCopy(next: SiteCMSData) {
  const { capabilities, howWeWork } = next;

  const services = capabilities?.items || [];
  if (services.length > 0 && services.every((s) => OLD.capabilityTitles.includes(s.title))) {
    next.capabilities = {
      ...capabilities,
      items: SERVICES,
      sectionTitle: capabilities.sectionTitle === OLD.capabilitiesTitle ? SERVICES_TITLE : capabilities.sectionTitle,
    };
  }

  if (next.capabilities?.items) {
    next.capabilities = {
      ...next.capabilities,
      items: next.capabilities.items.map((item) => {
        const fresh = SERVICES.find((svc) => svc.id === item.id);
        return fresh && item.desc === OLD.serviceDescs[item.id] ? { ...item, desc: fresh.desc } : item;
      }),
    };
  }

  if (howWeWork?.steps) {
    next.howWeWork = {
      ...howWeWork,
      steps: howWeWork.steps.map((step) => {
        const fresh = PROCESS_STEPS[OLD.stepDescs.indexOf(step.desc) % PROCESS_STEPS.length];
        return fresh ? { ...step, desc: fresh.desc } : step;
      }),
    };
  }
}

/** Sample text only, matched exactly. The sample figures and phone number were not real. */
function applyEarthAndFooterCopy(next: SiteCMSData) {
  const { earthShowcase, footer } = next;

  if (earthShowcase?.headline === OLD.earthHeadline) {
    const stats = earthShowcase.stats || [];
    next.earthShowcase = {
      ...earthShowcase,
      ...EARTH_COPY,
      stats: stats.every((st) => OLD.earthStats.includes(st.value)) ? EARTH_COPY.stats : stats,
    };
  }

  if (footer) {
    const fresh = { ...footer };
    for (const key of Object.keys(OLD.footer) as (keyof typeof OLD.footer)[]) {
      if (footer[key] === OLD.footer[key]) fresh[key] = FOOTER_COPY[key];
    }
    const links = (footer.columns || []).flatMap((c) => c.links || []);
    if (links.length > 0 && links.every((l) => OLD.footerLinks.includes(l.label))) fresh.columns = FOOTER_COLUMNS;
    next.footer = fresh;
  }
}

/** The rest of the sample wording, which described an operating system rather than the services. */
function applySiteCopy(next: SiteCMSData) {
  const { settings, hero, projectsPage, trust, whyKiwikPills, howWeWork, dashboardShowcase, navigation } = next;

  if (settings?.tagline === OLD.tagline) next.settings = { ...settings, tagline: SITE_TAGLINE };

  if (hero) {
    const fresh = { ...hero };
    if (OLD.hero.versionBadges.includes(hero.versionBadge || "")) fresh.versionBadge = HERO_COPY.versionBadge;
    if (OLD.hero.headlines.includes(`${hero.headlinePrefix}|${hero.headlineHighlightWord}`)) {
      fresh.headlinePrefix = HERO_COPY.headlinePrefix;
      fresh.headlineHighlightWord = HERO_COPY.headlineHighlightWord;
    }
    if (OLD.hero.descriptionStart.some((d) => hero.description?.startsWith(d))) fresh.description = HERO_COPY.description;
    if (hero.galleryImages) fresh.galleryImages = hero.galleryImages.map((g) => ({ ...g, title: galleryTitle(g.title) }));
    next.hero = fresh;
  }

  if (projectsPage) {
    const fresh = { ...projectsPage };
    if (OLD.featuredTitles.includes(projectsPage.title)) Object.assign(fresh, FEATURED_COPY);
    // Other companies' products. Without cards of its own, the slider shows Kiwik's projects.
    fresh.sliderCards = (projectsPage.sliderCards || []).filter((c) => !OLD.sliderNames.includes(c.name));
    next.projectsPage = fresh;
  }

  if (trust?.items?.length && trust.items.every((t) => OLD.trustTitles.includes(t.title))) {
    next.trust = { ...trust, items: TRUST_ITEMS };
  }
  if (next.trust?.sectionTitle === OLD.trustTitle) next.trust = { ...next.trust, sectionTitle: TRUST_TITLE };

  if (whyKiwikPills?.length && whyKiwikPills.every((p) => OLD.pillTexts.includes(p.text))) {
    next.whyKiwikPills = whyKiwikPills.map((p) => ({ ...p, text: PRINCIPLES[OLD.pillTexts.indexOf(p.text)] }));
  }

  if (next.howWeWork && OLD.processBadges.includes(howWeWork?.badge || "")) next.howWeWork = { ...next.howWeWork, badge: PROCESS_BADGE };

  if (next.howWeWork?.sectionTitle === "How We Work") next.howWeWork = { ...next.howWeWork, sectionTitle: "How we work" };

  if (dashboardShowcase && OLD.dashboardTitles.includes(dashboardShowcase.sectionTitle)) {
    next.dashboardShowcase = { ...dashboardShowcase, ...DASHBOARD_COPY };
  }

  if (next.navigation?.items && navigation) {
    const items = next.navigation.items.map((i) => {
      const known = NAV_LABELS[i.id || ""];
      return known?.from.includes(i.label) ? { ...i, label: known.label } : i;
    });
    // Links in the client's reading order, unless the studio has added its own.
    const order = Object.keys(NAV_LABELS);
    const standard = items.every((i) => order.includes(i.id || ""));
    next.navigation = {
      ...next.navigation,
      items: standard ? items.sort((a, b) => order.indexOf(a.id || "") - order.indexOf(b.id || "")).map((i, n) => ({ ...i, order: n + 1 })) : items,
      // The old button pointed at a section that does not exist.
      ...(navigation.ctaButtonText === NAV_CTA.from && navigation.ctaButtonHref === NAV_CTA.fromHref
        ? { ctaButtonText: NAV_CTA.text, ctaButtonHref: NAV_CTA.href }
        : {}),
    };
  }
}
