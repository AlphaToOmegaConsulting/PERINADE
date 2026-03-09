export const defaultLocale = "fr" as const;
export const locales = ["fr", "en", "es"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español"
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Return the locale prefix for URLs ("" for default, "/en", "/es"). */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

/** Build a localised path: localePath("fr", "/visites") → "/visites", localePath("en", "/visits") → "/en/visits" */
export function localePath(locale: Locale, path: string): string {
  const prefix = localePrefix(locale);
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${clean}`;
}

/** Get alternate locale paths for hreflang tags. */
export function getAlternates(pagePaths: Record<Locale, string>, baseUrl: string): Array<{ locale: Locale; href: string }> {
  return locales.map((loc) => ({
    locale: loc,
    href: `${baseUrl}${localePath(loc, pagePaths[loc])}`
  }));
}
