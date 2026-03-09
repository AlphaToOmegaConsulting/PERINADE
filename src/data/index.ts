/**
 * Central data loader — resolves locale-specific content at build time.
 */
import { getCollection, getEntry } from "astro:content";
import type { Locale } from "../i18n/locales";
import type { SiteData } from "../types/site";
import type { DomainePageData } from "../types/domaine";
import type { VisitPageData } from "../types/visits";
import type { ShopPageData } from "../types/shop";
import type { NewsPageData } from "../types/news";

/* ── Page data loaders ───────────────────────────────────── */

export async function getSiteData(locale: Locale): Promise<SiteData> {
  const entry = await getEntry("site", locale);
  if (!entry) throw new Error(`site entry not found for locale: ${locale}`);
  return entry.data;
}

export async function getDomaineData(locale: Locale): Promise<DomainePageData> {
  const entry = await getEntry("domaine", locale);
  if (!entry) throw new Error(`domaine entry not found for locale: ${locale}`);
  return entry.data;
}

export async function getVisitsData(locale: Locale): Promise<VisitPageData> {
  const entry = await getEntry("visits", locale);
  if (!entry) throw new Error(`visits entry not found for locale: ${locale}`);
  return entry.data;
}

export async function getShopData(locale: Locale): Promise<ShopPageData> {
  const entry = await getEntry("shop", locale);
  if (!entry) throw new Error(`shop entry not found for locale: ${locale}`);
  return entry.data;
}

export async function getNewsData(locale: Locale): Promise<NewsPageData> {
  const entry = await getEntry("news", locale);
  if (!entry) throw new Error(`news entry not found for locale: ${locale}`);
  return entry.data;
}

/* ── Content Collections ─────────────────────────────────── */

/** Retourne les coffrets triés par ordre pour la locale donnée. */
export async function getCoffrets(locale: Locale) {
  const entries = await getCollection("coffrets", (e) =>
    e.id.endsWith(`.${locale}`)
  );
  return entries.sort((a, b) => a.data.ordre - b.data.ordre);
}

/** Retourne les vins triés par ordre pour la locale donnée. */
export async function getVins(locale: Locale) {
  const entries = await getCollection("vins", (e) =>
    e.id.endsWith(`.${locale}`)
  );
  return entries.sort((a, b) => a.data.ordre - b.data.ordre);
}

/** Retourne les visites triées par ordre pour la locale donnée. */
export async function getVisites(locale: Locale) {
  const entries = await getCollection("visites", (e) =>
    e.id.endsWith(`.${locale}`)
  );
  return entries.sort((a, b) => a.data.ordre - b.data.ordre);
}
