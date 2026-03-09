import type { HeaderMenuOptions } from "../../types/ui";
import { trackUiEvent } from "../../utils/analytics";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

let quickActionsReady = false;

const normalizePath = (value: string): string => {
  if (!value || value === "/") return "/";
  return value.replace(/\/+$/, "");
};

const isPathActive = (currentPath: string, href: string): boolean => {
  if (!href || href.startsWith("tel:")) return false;

  const targetPath = normalizePath(href.split("#")[0] || href);
  const activePath = normalizePath(currentPath);

  if (targetPath === "/") {
    return activePath === "/";
  }

  return activePath === targetPath || activePath.startsWith(`${targetPath}/`);
};

const syncHeaderNavState = (): void => {
  const currentPath = window.location.pathname;

  document.querySelectorAll<HTMLElement>("[data-header] .ui-nav-link").forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;

    const active = isPathActive(currentPath, link.getAttribute("href") ?? "");
    link.classList.toggle("is-active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const syncQuickActionState = (): void => {
  const currentPath = window.location.pathname;

  document.querySelectorAll<HTMLAnchorElement>("[data-mobile-quick-actions] a").forEach((link) => {
    const active = isPathActive(currentPath, link.getAttribute("href") ?? "");
    link.classList.toggle("is-active", active);
  });
};

const initHeaderMenu = (header: HTMLElement): void => {
  if (header.dataset.uiReady === "true") return;

  const toggle = header.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const mobileNav = header.querySelector<HTMLElement>("[data-mobile-nav]");
  const backdrop = header.querySelector<HTMLElement>("[data-menu-backdrop]");
  const menuLabel = header.querySelector<HTMLElement>("[data-menu-label]");
  if (!toggle || !mobileNav || !backdrop) return;

  const options: HeaderMenuOptions = { header, toggle, mobileNav };
  const mobileBreakpoint = window.matchMedia("(max-width: 63.9375em)");

  const syncHeaderOnScroll = () => {
    options.header.classList.toggle("is-scrolled", window.scrollY > 48);
  };

  const getMobileFocusables = (): HTMLElement[] => {
    return Array.from(options.mobileNav.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  };

  const setOpen = (open: boolean, focusTarget: "first" | "toggle" | "none" = "none") => {
    const nextLabel = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;

    options.toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (nextLabel) {
      options.toggle.setAttribute("aria-label", nextLabel);
      if (menuLabel) menuLabel.textContent = nextLabel;
    }

    options.mobileNav.hidden = !open;
    backdrop.hidden = !open;
    options.header.classList.toggle("is-open", open);
    options.mobileNav.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    document.body.dataset.menuOpen = open ? "true" : "false";

    if (focusTarget === "first" && open) {
      getMobileFocusables()[0]?.focus();
    }

    if (focusTarget === "toggle" && !open) {
      options.toggle.focus();
    }
  };

  const onKeydown = (event: KeyboardEvent) => {
    const isOpen = options.toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    if (event.key === "Escape") {
      setOpen(false, "toggle");
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = [options.toggle, ...getMobileFocusables()];
    const activeIndex = focusables.indexOf(document.activeElement as HTMLElement);

    if (event.shiftKey && activeIndex <= 0) {
      event.preventDefault();
      focusables.at(-1)?.focus();
      return;
    }

    if (!event.shiftKey && activeIndex === focusables.length - 1) {
      event.preventDefault();
      focusables[0]?.focus();
    }
  };

  const onDocumentClick = (event: MouseEvent) => {
    const isOpen = options.toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    if (options.toggle.contains(target) || options.mobileNav.contains(target)) {
      return;
    }

    if (!options.header.contains(target)) {
      setOpen(false);
    }
  };

  options.toggle.addEventListener("click", () => {
    const isOpen = options.toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen, !isOpen ? "first" : "toggle");
  });

  backdrop.addEventListener("click", () => {
    setOpen(false, "toggle");
  });

  options.mobileNav.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", () => {
      setOpen(false);
    });
  });

  mobileBreakpoint.addEventListener("change", (event) => {
    if (!event.matches) {
      setOpen(false);
    }
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
  syncHeaderNavState();
  syncQuickActionState();

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

  quickActionsReady = true;
};
