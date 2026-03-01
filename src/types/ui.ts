import type { BookingConfig, BookingSlot } from "./visits";

export type { BookingConfig, BookingSlot };

export type ActionVariant = "primary" | "secondary" | "ghost" | "text";
export type ActionSize = "sm" | "md" | "lg";
export type ActionTone = "default" | "inverse" | "quiet" | "accent";
export type ActionInteraction = "default" | "quiet" | "emphasis";
export type NavLinkKind = "primary" | "quick" | "footer" | "language";
export type AccordionMode = "single" | "multi";
export type CardSurfaceTone = "default" | "soft" | "inverse";
export type CardElevation = "flat" | "soft" | "raised";
export type CardPadding = "sm" | "md" | "lg";
export type UiInteractiveState = "default" | "hover" | "focus-visible" | "active" | "disabled" | "loading";

export interface ActionCommonProps {
  variant?: ActionVariant;
  size?: ActionSize;
  tone?: ActionTone;
  interaction?: ActionInteraction;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  class?: string;
}

export interface NavLinkProps extends ActionCommonProps {
  href: string;
  label: string;
  isActive?: boolean;
  navKind?: NavLinkKind;
}

export interface AccordionItem {
  id: string;
  heading: string;
  content: string;
  expanded?: boolean;
}

export interface TabsItem {
  id: string;
  label: string;
  title?: string;
  body?: string;
}

export interface CardAction {
  label: string;
  href: string;
  variant?: ActionVariant;
}

export interface ProductCardData {
  name: string;
  meta?: string;
  description?: string;
  price?: string;
  stock?: string;
  badges?: string[];
  imageAlt: string;
  cta: CardAction;
}

export interface PricingCardData {
  title: string;
  subtitle?: string;
  price: string;
  perLabel: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: CardAction;
}

export interface InfoCardData {
  title: string;
  subtitle?: string;
  body?: string;
  tag?: string;
  lines?: string[];
  cta?: CardAction;
}

export interface HeaderMenuOptions {
  header: HTMLElement;
  toggle: HTMLButtonElement;
  mobileNav: HTMLElement;
}

export interface TabsOptions {
  root: HTMLElement;
  tabs: HTMLButtonElement[];
  panels: HTMLElement[];
}

export interface AccordionOptions {
  root: HTMLElement;
  triggers: HTMLButtonElement[];
}

export interface BookingState {
  monthCursor: Date;
  selectedDate: Date | null;
  selectedSlot: string;
  participants: number;
  addon: boolean;
}

export interface CalendarMonthView {
  monthStart: Date;
  monthLabel: string;
  leadingPadding: number;
  totalDays: number;
}
