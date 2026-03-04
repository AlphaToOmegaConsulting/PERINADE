import type { Locale } from "./locales";

/**
 * Page slug mapping per locale.
 * Keys are internal page identifiers; values are the URL path segment per locale.
 */
export const pageRoutes: Record<string, Record<Locale, string>> = {
  home:     { fr: "/",           en: "/",           es: "/"           },
  domaine:  { fr: "/domaine",    en: "/domaine",    es: "/domaine"    },
  visites:  { fr: "/visites",    en: "/visits",     es: "/visitas"    },
  boutique: { fr: "/boutique",   en: "/shop",       es: "/tienda"     },
  actualites: { fr: "/actualites", en: "/news",     es: "/noticias"   }
};

/** Get the full path for a page in a given locale. */
export function getPagePath(pageId: string, locale: Locale): string {
  const routes = pageRoutes[pageId];
  if (!routes) return "/";
  const path = routes[locale];
  if (locale === "fr") return path;
  return `/${locale}${path}`;
}
