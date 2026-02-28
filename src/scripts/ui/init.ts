import { initBookingCalendars } from "./booking-calendar";
import { initFaqAccordions } from "./faq-accordion";
import { initHeaderMenus } from "./header-menu";
import { initScrollReveals } from "./scroll-reveal";
import { initTimelineTabsWidgets } from "./timeline-tabs";

let submitHandlerReady = false;

const initFormGuards = () => {
  if (submitHandlerReady) return;

  document.addEventListener("submit", (event) => {
    const target = event.target;
    if (target instanceof HTMLFormElement && target.matches("[data-ui-form]")) {
      event.preventDefault();
    }
  });

  submitHandlerReady = true;
};

export const initUi = (): void => {
  initFormGuards();
  initHeaderMenus();
  initTimelineTabsWidgets();
  initFaqAccordions();
  initBookingCalendars();
  initScrollReveals();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initUi(), { once: true });
} else {
  initUi();
}
