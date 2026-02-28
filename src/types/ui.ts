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
