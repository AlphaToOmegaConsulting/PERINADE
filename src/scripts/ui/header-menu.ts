import type { HeaderMenuOptions } from "../../types/ui";
import { trackUiEvent } from "../../utils/analytics";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

let quickActionsReady = false;

const initHeaderMenu = (header: HTMLElement): void => {
  if (header.dataset.uiReady === "true") return;

  const toggle = header.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const mobileNav = header.querySelector<HTMLElement>("[data-mobile-nav]");
  if (!toggle || !mobileNav) return;

  const options: HeaderMenuOptions = { header, toggle, mobileNav };

  const syncHeaderOnScroll = () => {
    options.header.classList.toggle("is-scrolled", window.scrollY > 48);
  };

  const getMobileFocusables = (): HTMLElement[] => {
    return Array.from(options.mobileNav.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  };

  const setOpen = (open: boolean, focusTarget: "first" | "toggle" | "none" = "none") => {
    options.toggle.setAttribute("aria-expanded", open ? "true" : "false");
    options.mobileNav.hidden = !open;
    options.header.classList.toggle("is-open", open);

    if (focusTarget === "first" && open) {
      getMobileFocusables()[0]?.focus();
    }

    if (focusTarget === "toggle" && !open) {
      options.toggle.focus();
    }
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && options.toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false, "toggle");
    }
  };

  const onDocumentClick = (event: MouseEvent) => {
    const isOpen = options.toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!options.header.contains(target)) {
      setOpen(false);
    }
  };

  options.toggle.addEventListener("click", () => {
    const isOpen = options.toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen, !isOpen ? "first" : "toggle");
  });

  options.mobileNav.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", () => {
      setOpen(false);
    });
  });

  window.addEventListener("scroll", syncHeaderOnScroll, { passive: true });
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onDocumentClick);

  syncHeaderOnScroll();
  setOpen(false);
  header.dataset.uiReady = "true";
};

export const initHeaderMenus = (): void => {
  document.querySelectorAll<HTMLElement>("[data-header]").forEach(initHeaderMenu);

  if (quickActionsReady) return;

  document.querySelectorAll<HTMLAnchorElement>("[data-quick-action]").forEach((link) => {
    link.addEventListener("click", () => {
      trackUiEvent({
        event: "cta_click",
        context: "mobile_quick_actions",
        label: link.textContent?.trim() ?? "",
        href: link.getAttribute("href") ?? ""
      });
    });
  });

  const currentPath = window.location.pathname;
  document.querySelectorAll<HTMLAnchorElement>("[data-mobile-quick-actions] a").forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    if (href.startsWith("tel:")) return;
    if (href.startsWith(currentPath) || currentPath.startsWith(href.split("#")[0] ?? "")) {
      link.classList.add("is-active");
    }
  });

  quickActionsReady = true;
};
