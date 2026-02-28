import { initBookingCalendars } from "./booking-calendar";
import { initCursorOrb } from "./cursor-orb";
import { initFaqAccordions } from "./faq-accordion";
import { initHeaderMenus } from "./header-menu";
import { initScrollReveals } from "./scroll-reveal";
import { initTimelineTabsWidgets } from "./timeline-tabs";

let submitHandlerReady = false;

const initFormGuards = () => {
  if (submitHandlerReady) return;

  document.addEventListener("submit", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) return;
    /* Only block forms that opt-in to guard AND don't have their own handler */
    if (target.matches("[data-ui-form]") && !target.matches("[data-contact-form]")) {
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
  initCursorOrb();
  initScrollReveals();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initUi(), { once: true });
} else {
  initUi();
}
