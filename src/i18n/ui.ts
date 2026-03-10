import { getEntry } from "astro:content";
import type { Locale } from "./locales";

export type UiStrings = {
  skipToContent: string;
  navLabel: string;
  mobileNavLabel: string;
  menuOpen: string;
  menuClose: string;
  homeLabel: string;
  languageLabel: string;
  bookCta: string;
  callCta: string;
  shopCta: string;
  backToTop: string;
  formSubmitting: string;
  formSuccess: string;
  formError: string;
  required: string;
  invalidEmail: string;
  legalLine: string;
  copyright: string;
  addToCartLabel: string;
  cartLabel: string;
};

export async function getUiStrings(locale: Locale): Promise<UiStrings> {
  const entry = await getEntry("ui", locale);
  if (!entry) throw new Error(`UI strings not found for locale: ${locale}`);
  return entry.data as UiStrings;
}
