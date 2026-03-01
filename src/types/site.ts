import type { ImageMetadata } from "astro";

export type LinkTarget = string;

export interface NavItem {
  label: string;
  href: LinkTarget;
  desktopSlot?: "left" | "right";
  desktopLabel?: string;
  mobile?: boolean;
}

export interface MobileQuickAction {
  id: "book" | "shop" | "call";
  label: string;
  href: LinkTarget;
  icon: "calendar" | "bag" | "phone";
  priority: "primary" | "secondary";
}

export interface HeroData {
  eyebrow: string;
  title: string[];
  body: string;
  ctaLabel: string;
  ctaHref: LinkTarget;
  meta: string[];
  backgroundImage: ImageMetadata;
  featuredCards: HeroFeatureCard[];
}

export interface HeroFeatureCard {
  kicker: string;
  title: string;
  image: ImageMetadata;
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
  src: ImageMetadata;
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
  imagePrimary: ImageMetadata;
  imageSecondary?: ImageMetadata;
}

export interface WineCard {
  image: ImageMetadata;
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
  mobileQuickActions: MobileQuickAction[];
  hero: HeroData;
  reasons: ReasonItem[];
  experience: {
    eyebrow: string;
    title: string;
    body: string;
    infoLine: string;
    details: VisitDetail[];
    ctaLabel: string;
    ctaHref: LinkTarget;
    backgroundImage: ImageMetadata;
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
    labels: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      submit: string;
    };
    validation: {
      required: string;
      invalidEmail: string;
      fixErrors: string;
    };
    mail: {
      defaultSubject: string;
      fieldFirstName: string;
      fieldLastName: string;
      fieldEmail: string;
      fieldPhone: string;
      fieldMessage: string;
    };
    formAction: LinkTarget;
    formSuccessMessage?: string;
    formErrorMessage?: string;
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
