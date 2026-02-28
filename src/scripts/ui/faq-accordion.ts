import type { AccordionOptions } from "../../types/ui";

const initFaqAccordion = (root: HTMLElement): void => {
  if (root.dataset.uiReady === "true") return;

  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-faq-trigger]"));
  if (triggers.length === 0) return;

  const options: AccordionOptions = { root, triggers };

  const setOpen = (targetIndex: number | null) => {
    options.triggers.forEach((trigger, index) => {
      const expanded = targetIndex === index;
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");

      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const item = trigger.closest(".shop-faq__item");

      if (panel) panel.hidden = !expanded;
      item?.classList.toggle("is-open", expanded);
    });
  };

  const initiallyOpen = options.triggers.findIndex((trigger) => trigger.getAttribute("aria-expanded") === "true");
  setOpen(initiallyOpen >= 0 ? initiallyOpen : 0);

  options.triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      setOpen(expanded ? null : index);
    });

    trigger.addEventListener("keydown", (event) => {
      let nextIndex = -1;
      switch (event.key) {
        case "ArrowDown":
          nextIndex = (index + 1) % options.triggers.length;
          break;
        case "ArrowUp":
          nextIndex = (index - 1 + options.triggers.length) % options.triggers.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = options.triggers.length - 1;
          break;
        default:
          break;
      }

      if (nextIndex >= 0) {
        event.preventDefault();
        options.triggers[nextIndex]?.focus();
      }
    });
  });

  root.dataset.uiReady = "true";
};

export const initFaqAccordions = (): void => {
  document.querySelectorAll<HTMLElement>("[data-faq]").forEach(initFaqAccordion);
};
