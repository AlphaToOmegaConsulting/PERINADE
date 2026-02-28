export type UiEventName = "cta_click" | "booking_submit" | "booking_error" | "form_abandon";

export interface UiEventPayload {
  event: UiEventName;
  context: string;
  label?: string;
  href?: string;
  meta?: Record<string, string | number | boolean>;
}
