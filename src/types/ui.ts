import type { BookingConfig, BookingSlot } from "./visits";

export type { BookingConfig, BookingSlot };

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
