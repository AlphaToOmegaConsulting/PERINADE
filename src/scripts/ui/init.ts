import { initCursorOrb } from "./cursor-orb";
import { initHeaderMenus } from "./header-menu";
import { initScrollReveals } from "./scroll-reveal";

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
  initCursorOrb();
  initScrollReveals();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initUi(), { once: true });
} else {
  initUi();
}
