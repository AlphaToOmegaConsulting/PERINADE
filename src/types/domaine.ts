import type { ImageMetadata } from "astro";

export interface DomaineTheme {
  sectionDesktop: string;
  sectionTablet: string;
  sectionMobile: string;
}

export interface DomaineHeroData {
  eyebrow: string;
  titleLines: [string, string];
  body: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  badges: string[];
  highlights: string[];
  image: ImageMetadata;
  imageAlt: string;
}

export interface DomaineTerroirData {
  eyebrow: string;
  title: string;
  body: string;
  grapesTitle: string;
  commitmentsTitle: string;
  grapes: string[];
  commitments: Array<{
    title: string;
    body: string;
  }>;
  image: ImageMetadata;
  imageAlt: string;
}

export interface DomaineFamilyData {
  eyebrow: string;
  title: string;
  body: string[];
  milestones: Array<{
    year: string;
    label: string;
  }>;
  image: ImageMetadata;
  imageAlt: string;
}

export interface DomaineStatItem {
  label: string;
  value: string;
}

export interface DomaineTimelineData {
  eyebrow: string;
  title: string;
  defaultTabId: string;
  tabs: Array<{
    id: string;
    year: string;
    tabLabel: string;
    title: string;
    detail: string;
    images: Array<{
      src: ImageMetadata;
      alt: string;
    }>;
  }>;
}

export interface DomaineVisitCtaData {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  body: string;
  details: string[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  image: ImageMetadata;
  imageAlt: string;
}

export interface DomaineWinesData {
  eyebrow: string;
  title: string;
  allLabel: string;
  allHref: string;
  items: Array<{
    image: ImageMetadata;
    alt: string;
    meta: string;
    title: string;
    body: string;
    price: string;
    ctaLabel: string;
    ctaHref: string;
  }>;
}

export interface DomaineContactData {
  eyebrow: string;
  title: string;
  body: string;
  cards: Array<{
    label: string;
    value: string;
    href?: string;
  }>;
  cta: {
    label: string;
    href: string;
  };
}

export interface DomainePageData {
  theme: DomaineTheme;
  seo: {
    title: string;
    description: string;
  };
  hero: DomaineHeroData;
  terroir: DomaineTerroirData;
  family: DomaineFamilyData;
  statsBar: DomaineStatItem[];
  timeline?: DomaineTimelineData;
  visitCta: DomaineVisitCtaData;
  wines: DomaineWinesData;
  contact: DomaineContactData;
}
