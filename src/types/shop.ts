import type { ImageMetadata } from "astro";

export interface ShopHeroCta {
  label: string;
  href: string;
}

export interface ShopHeroData {
  image: ImageMetadata;
  imageAlt: string;
  eyebrow: string;
  titleHtml: string;
  body: string;
  primaryCta: ShopHeroCta;
  secondaryCta: ShopHeroCta;
  metaAriaLabel: string;
  metaItems: string[];
}

export interface ShopProduct {
  name: string;
  meta: string;
  description: string;
  price: string;
  stock?: string;
  image: ImageMetadata;
  imageAlt: string;
  badges: string[];
  tone: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ShopProductGridData {
  eyebrow: string;
  title: string;
  previousLabel: string;
  nextLabel: string;
  products: ShopProduct[];
}

export interface ShopSelectionItem {
  icon: "shipping" | "map" | "return" | "lock" | "support";
  title: string;
  body: string;
}

export interface ShopDomainSelectionData {
  eyebrow: string;
  title: string;
  items: ShopSelectionItem[];
}

export interface ShopOffer {
  title: string;
  saving?: string;
  lines: string[];
  price: string;
  strikePrice?: string;
  details: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ShopCaseComposerData {
  backdropImage: ImageMetadata;
  crateImage: ImageMetadata;
  crateImageAlt: string;
  eyebrow: string;
  title: string;
  intro: string;
  offers: ShopOffer[];
}

export interface ShopFinalCtaData {
  sectionAriaLabel: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ShopFaqItem {
  question: string;
  answer: string;
}

export interface ShopFaqData {
  eyebrow: string;
  title: string;
  items: ShopFaqItem[];
}

export interface ShopComplianceData {
  marketingBannerAriaLabel: string;
  marketingBannerTitle: string;
  ageNotice: string;
  healthNotice: string;
  checkoutTitle: string;
  checkoutAdultOnlyNote: string;
  checkoutAcknowledgements: {
    age: string;
    information: string;
  };
  payOrderLabel: string;
  payOrderHelp: string;
  payOrderPendingLabel: string;
}

export interface ShopSeoData {
  title: string;
  description: string;
}

export interface ShopPageData {
  seo: ShopSeoData;
  hero: ShopHeroData;
  compliance: ShopComplianceData;
  productGrid: ShopProductGridData;
  domainSelection: ShopDomainSelectionData;
  caseComposer: ShopCaseComposerData;
  finalCta: ShopFinalCtaData;
  faq: ShopFaqData;
}
