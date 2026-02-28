/**
 * Central data loader — resolves locale-specific content at build time.
 */
import type { Locale } from "../i18n/locales";
import type { SiteData } from "../types/site";
import type { DomainePageData } from "../types/domaine";
import type { VisitPageData } from "../types/visits";

/* ── Site data ───────────────────────────────────────────── */

export async function getSiteData(locale: Locale): Promise<SiteData> {
  switch (locale) {
    case "en": return (await import("./site-en")).siteEn;
    case "es": return (await import("./site-es")).siteEs;
    default:   return (await import("./site-fr")).siteFr;
  }
}

/* ── Domaine data ────────────────────────────────────────── */

export async function getDomaineData(locale: Locale): Promise<DomainePageData> {
  switch (locale) {
    case "en": return (await import("./domaine-en")).domainePageEn;
    case "es": return (await import("./domaine-es")).domainePageEs;
    default:   return (await import("./domaine-fr")).domainePageFr;
  }
}

/* ── Visits data ─────────────────────────────────────────── */

export async function getVisitsData(locale: Locale): Promise<VisitPageData> {
  switch (locale) {
    case "en": return (await import("./visits-en")).visitsPageEn;
    case "es": return (await import("./visits-es")).visitsPageEs;
    default:   return (await import("./visits-fr")).visitsPageFr;
  }
}
