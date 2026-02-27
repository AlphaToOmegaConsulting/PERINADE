export type LinkTarget = string;

export interface NavItem {
  label: string;
  href: LinkTarget;
}

export interface HeroData {
  eyebrow: string;
  title: string[];
  body: string;
  ctaLabel: string;
  ctaHref: LinkTarget;
  meta: string[];
  backgroundImage: string;
  featuredCards: HeroFeatureCard[];
}

export interface HeroFeatureCard {
  kicker: string;
  title: string;
  image: string;
  alt: string;
  href: LinkTarget;
}

export interface ReasonItem {
  title: string;
  body: string;
  icon: string;
}

export interface VisitDetail {
  label: string;
  value: string;
  icon: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  meta: string;
  rating: number;
}

export interface HistoryBlock {
  eyebrow: string;
  title: string;
  body: string[];
  imagePrimary: string;
  imageSecondary?: string;
}

export interface WineCard {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: LinkTarget;
}

export interface ContactInfoItem {
  label: string;
  value: string;
  icon: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

export interface SiteData {
  nav: NavItem[];
  hero: HeroData;
  reasons: ReasonItem[];
  experience: {
    eyebrow: string;
    title: string;
    body: string;
    details: VisitDetail[];
    ctaLabel: string;
    ctaHref: LinkTarget;
    backgroundImage: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    items: GalleryItem[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    pressLabel: string;
    pressLogos: string[];
    items: TestimonialItem[];
  };
  history: HistoryBlock & {
    titleHighlight: string;
    ctaLabel: string;
    ctaHref: LinkTarget;
  };
  wines: {
    eyebrow: string;
    title: string;
    allWinesLabel: string;
    allWinesHref: LinkTarget;
    items: WineCard[];
  };
  contact: {
    eyebrow: string;
    titleHtml: string;
    body: string;
    info: ContactInfoItem[];
    formAction: LinkTarget;
  };
  footer: {
    brandTitle: string;
    about: string;
    groups: FooterLinkGroup[];
    newsletterTitle: string;
    newsletterBody: string;
    newsletterPlaceholder: string;
    newsletterAction: LinkTarget;
    social: NavItem[];
    copyright: string;
    legalLine: string;
  };
}
