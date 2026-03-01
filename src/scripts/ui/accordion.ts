import type { AccordionMode, AccordionOptions } from "../../types/ui";

const initAccordion = (root: HTMLElement): void => {
  if (root.dataset.uiReady === "true") return;

  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]"));
  if (triggers.length === 0) return;

  const mode = (root.dataset.accordionMode as AccordionMode | undefined) ?? "single";
  const options: AccordionOptions = { root, triggers };

  const setOpen = (targetIndexes: number[]) => {
    options.triggers.forEach((trigger, index) => {
      const expanded = targetIndexes.includes(index);
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");

      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const item = trigger.closest(".ui-accordion__item") ?? trigger.closest("[data-accordion-item]");

      if (panel) panel.hidden = !expanded;
      item?.classList.toggle("is-open", expanded);
    });
  };

  const initiallyOpen = options.triggers
    .map((trigger, index) => (trigger.getAttribute("aria-expanded") === "true" ? index : -1))
    .filter((index) => index >= 0);
  setOpen(initiallyOpen.length > 0 ? initiallyOpen : [0]);

  options.triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      if (mode === "multi") {
        const openIndexes = options.triggers
          .map((item, itemIndex) => (item.getAttribute("aria-expanded") === "true" ? itemIndex : -1))
          .filter((itemIndex) => itemIndex >= 0);

        const nextIndexes = expanded ? openIndexes.filter((itemIndex) => itemIndex !== index) : [...openIndexes, index];
        setOpen(nextIndexes);
        return;
      }

      setOpen(expanded ? [] : [index]);
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

export const initAccordions = (): void => {
  document.querySelectorAll<HTMLElement>("[data-accordion]").forEach(initAccordion);
};
