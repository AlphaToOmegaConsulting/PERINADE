import { initAccordions } from "./accordion";
import { initBookingCalendars } from "./booking-calendar";
import { initContactForms } from "./contact-form";
import { initCounters } from "./counter";
import { initCursorOrb } from "./cursor-orb";
import { initHeaderMenus } from "./header-menu";
import { initScrollReveals } from "./scroll-reveal";
import { initTabsWidgets } from "./tabs";

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
  initAccordions();
  initTabsWidgets();
  initBookingCalendars();
  initCounters();
  initContactForms();
  initCursorOrb();
  initScrollReveals();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initUi(), { once: true });
} else {
  initUi();
}
