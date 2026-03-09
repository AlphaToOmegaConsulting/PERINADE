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
  /* Critique — initialiser immédiatement pour l'interactivité visible */
  initFormGuards();
  initHeaderMenus();
  initAccordions();
  initTabsWidgets();
  initCounters();
  initContactForms();

  /* Non-critique — différer au premier moment d'inactivité du navigateur */
  const deferred = () => {
    initBookingCalendars();
    initCursorOrb();
    initScrollReveals();
  };

  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(deferred, { timeout: 2000 });
  } else {
    setTimeout(deferred, 200);
  }
};

/* Initialisation au chargement de la page (compatible ViewTransitions) */
document.addEventListener("astro:page-load", () => initUi());

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initUi(), { once: true });
} else {
  initUi();
}
