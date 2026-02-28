import type { TabsOptions } from "../../types/ui";

const initTimelineTabs = (root: HTMLElement): void => {
  if (root.dataset.uiReady === "true") return;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-tab-id]"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel-id]"));
  if (tabs.length === 0 || panels.length === 0) return;

  const options: TabsOptions = { root, tabs, panels };

  const indexById = (id: string): number => options.tabs.findIndex((tab) => tab.dataset.tabId === id);

  const activate = (targetIndex: number, moveFocus = false) => {
    const safeIndex = targetIndex >= 0 ? targetIndex % options.tabs.length : 0;
    const activeId = options.tabs[safeIndex]?.dataset.tabId;
    if (!activeId) return;

    options.tabs.forEach((tab, index) => {
      const active = index === safeIndex;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      if (moveFocus && active) tab.focus();
    });

    options.panels.forEach((panel) => {
      const active = panel.dataset.panelId === activeId;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };

  const activeIndex = options.tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  activate(activeIndex >= 0 ? activeIndex : 0);

  options.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tabId;
      if (!id) return;
      activate(indexById(id));
    });

    tab.addEventListener("keydown", (event) => {
      const currentId = tab.dataset.tabId;
      if (!currentId) return;

      const currentIndex = indexById(currentId);
      if (currentIndex < 0) return;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          activate((currentIndex + 1) % options.tabs.length, true);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          activate((currentIndex - 1 + options.tabs.length) % options.tabs.length, true);
          break;
        case "Home":
          event.preventDefault();
          activate(0, true);
          break;
        case "End":
          event.preventDefault();
          activate(options.tabs.length - 1, true);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          activate(currentIndex);
          break;
        default:
          break;
      }
    });
  });

  root.dataset.uiReady = "true";
};

export const initTimelineTabsWidgets = (): void => {
  document.querySelectorAll<HTMLElement>("[data-timeline-tabs]").forEach(initTimelineTabs);
};
