import type { ImageMetadata } from "astro";

export interface NewsArticleCard {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  readLabel: string;
  href: string;
  image: ImageMetadata;
  imageAlt: string;
}

export interface NewsEventItem {
  day: string;
  month: string;
  type: string;
  title: string;
  time: string;
  location: string;
  href: string;
}

export interface NewsBlogPost {
  headline: string;
  description: string;
  datePublished: Date;
  url: string;
  category: string;
}

export interface NewsPageData {
  seo: {
    title: string;
    description: string;
  };
  theme: {
    sectionDesktop: string;
    sectionTablet: string;
    sectionMobile: string;
  };
  hero: {
    eyebrow: string;
    titleLines: string[];
    lead: string;
    primaryCta: {
      label: string;
      href: string;
    };
    metaItems: string[];
    image: ImageMetadata;
    imageAlt: string;
  };
  featured: {
    eyebrow: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    ctaLabel: string;
    ctaHref: string;
    image: ImageMetadata;
    imageAlt: string;
  };
  articles: {
    eyebrow: string;
    title: string;
    chips: string[];
    activeChip: string;
    leadCtaLabel: string;
    leadCard: NewsArticleCard;
    cards: NewsArticleCard[];
    viewMoreLabel: string;
    viewMoreHref: string;
  };
  agenda: {
    eyebrow: string;
    title: string;
    viewAllLabel: string;
    viewAllHref: string;
    events: NewsEventItem[];
  };
  visitCta: {
    eyebrow: string;
    titleLines: string[];
    body: string;
    ctaLabel: string;
    ctaHref: string;
    backgroundImage: ImageMetadata;
    backgroundAlt: string;
  };
  blogPosts: NewsBlogPost[];
}
