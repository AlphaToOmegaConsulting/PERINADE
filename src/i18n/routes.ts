import type { Locale } from "./locales";
import { locales } from "./locales";

/**
 * Public route mapping per locale.
 * Keys are internal page identifiers; values are the final public path for each locale.
 */
export const pageRoutes = {
  home: { fr: "/", en: "/en", es: "/es" },
  domaine: { fr: "/domaine", en: "/en/domaine", es: "/es/domaine" },
  visites: { fr: "/visites", en: "/en/visits", es: "/es/visitas" },
  boutique: { fr: "/boutique", en: "/en/shop", es: "/es/tienda" },
  actualites: { fr: "/actualites", en: "/en/news", es: "/es/noticias" },
  panier: { fr: "/panier", en: "/en/cart", es: "/es/carrito" },
  confirmation: { fr: "/confirmation", en: "/en/confirmation", es: "/es/confirmacion" }
} satisfies Record<string, Record<Locale, string>>;

export type PageId = keyof typeof pageRoutes;

export function getPagePath(pageId: PageId, locale: Locale): string {
  return pageRoutes[pageId][locale];
}

export function getAlternateUrls(pageId: PageId): Record<Locale, string> {
  return { ...pageRoutes[pageId] };
}

export function getAlternates(pageId: PageId): Array<{ locale: Locale; href: string }> {
  return locales.map((locale) => ({
    locale,
    href: getPagePath(pageId, locale)
  }));
}
