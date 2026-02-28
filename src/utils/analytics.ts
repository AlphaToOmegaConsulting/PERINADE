import type { UiEventPayload } from "../types/analytics";

declare global {
  interface Window {
    dataLayer?: UiEventPayload[];
  }
}

export function trackUiEvent(payload: UiEventPayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("ui:track", { detail: payload }));
}
