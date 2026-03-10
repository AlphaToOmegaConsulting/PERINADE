import type { ImageMetadata } from "astro";

export interface HeroBadge {
  icon: "clock" | "ticket" | "globe" | "calendar" | "car";
  label: string;
}

export interface VisitStep {
  id: string;
  number: string;
  title: string;
  body: string;
  image: ImageMetadata;
  imageAlt: string;
  layout?: VisitTimelineStepLayout;
}

export interface VisitWineCard {
  id: string;
  tag: string;
  tagTone: "rose" | "white" | "red";
  title: string;
  notes: string[];
  image: ImageMetadata;
  imageAlt: string;
}

export interface PricingFeatureGroup {
  title: string;
  subtitle: string;
  price: string;
  perLabel: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  isHighlighted?: boolean;
  badge?: string;
}

export interface AccessInfoCard {
  icon?: "pin" | "car" | "plane" | "train";
  tag?: string;
  title: string;
  subtitle: string;
  content: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface EscapeFeature {
  icon: "tree" | "pool" | "event";
  label: string;
}

export interface BookingSlot {
  id: string;
  label: string;
}

export interface BookingConfig {
  monthLabel: string;
  initialMonth: string;
  locale: string;
  timezone: string;
  startDate: string;
  endDate: string;
  dayLabels: string[];
  selectableDays: number[];
  disabledWeekdays?: number[];
  disabledDates?: string[];
  defaultDay: number;
  slots: BookingSlot[];
  defaultSlotId: string;
  minParticipants: number;
  maxParticipants: number;
  defaultParticipants: number;
  addonLabel: string;
  basePricePerPerson: number;
  addonPricePerPerson: number;
  ctaLabel: string;
  ctaHref: string;
  callLabel: string;
  submitEndpoint?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface BookingUiLabels {
  prevMonthAriaLabel: string;
  nextMonthAriaLabel: string;
  slotHeading: string;
  participantsHeading: string;
  priceFromLabel: string;
  pricePerPersonLabel: string;
  missingDateMessage: string;
  defaultSuccessMessage: string;
  defaultErrorMessage: string;
  mailSubjectFallback: string;
  decrementLabel: string;
  incrementLabel: string;
}

export interface BookingSubmissionPayload {
  source: "mobile" | "desktop";
  day: number;
  slotId: string;
  participants: number;
  addon: boolean;
  totalPerPerson: number;
  pagePath: string;
  submittedAt: string;
}

export interface BookingApiResponse {
  ok: boolean;
  message: string;
}

export interface VisitThemeTokens {
  accent: {
    primary: string;
    soft: string;
    onDark: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    sectionDesktop: string;
    sectionTablet: string;
    sectionMobile: string;
  };
  typography: {
    eyebrow: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
      fontWeight: number;
    };
    titleDisplay: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
      fontWeight: number;
    };
    titleSection: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
      fontWeight: number;
    };
    body: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
      fontWeight: number;
    };
    caption: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
      fontWeight: number;
    };
  };
  stroke: {
    subtle: string;
    strong: string;
  };
}

export interface VisitTimelineStepLayout {
  mediaRatio: string;
  mediaMaxWidth?: string;
  contentMaxWidth?: string;
  align?: "start" | "center";
}

export interface PricingLayout {
  containerMaxWidth: string;
  cardMinHeight: string;
  cardPadding: string;
  titleSize: string;
  priceSize: string;
}

export interface EscapeLayout {
  backgroundImage: ImageMetadata;
  overlayOpacity: number;
  imagePanelRadius: string;
}

export interface BookingLayout {
  calendarWidthRatio: string;
  controlsWidthRatio: string;
  panelMaxWidth: string;
  calendarCellHeight: string;
  controlRowHeight: string;
}

export interface FinalCtaLayout {
  contentMaxWidth: string;
  eyebrowToTitleGap: string;
  titleToBodyGap: string;
  sectionMinHeight: string;
}

export interface VisitPageData {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    titleLines: [string, string];
    body: string;
    badges: HeroBadge[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    helper: string;
    image: ImageMetadata;
    imageAlt: string;
  };
  trustBar: string[];
  timeline: {
    eyebrow: string;
    title: string;
    body: string;
    steps: VisitStep[];
  };
  wines: {
    eyebrow: string;
    title: string;
    body: string;
    cards: VisitWineCard[];
  };
  pairing: {
    image: ImageMetadata;
    imageAlt: string;
    eyebrow: string;
    title: [string, string];
    body: string;
    bullets: string[];
    note: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    body: string;
    layout: PricingLayout;
    meta: string[];
  };
  access: {
    eyebrow: string;
    title: string;
    body: string;
    leftCard: AccessInfoCard;
    rightCards: AccessInfoCard[];
  };
  escape: {
    image: ImageMetadata;
    imageAlt: string;
    layout: EscapeLayout;
    eyebrow: string;
    title: [string, string];
    body: string;
    features: EscapeFeature[];
    cta: { label: string; href: string };
  };
  booking: {
    eyebrow: string;
    title: string;
    body: string;
    layout: BookingLayout;
    ui: BookingUiLabels;
    config: BookingConfig;
  };
  finalCta: {
    image: ImageMetadata;
    imageAlt: string;
    layout: FinalCtaLayout;
    eyebrow: string;
    title: string;
    body: string;
  };
}
