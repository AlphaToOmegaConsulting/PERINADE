let revealInitialized = false;

const registerRevealGroup = (
  selector: string,
  effect: "up" | "left" | "right" | "zoom" = "up",
  staggerMs = 70
): void => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    if (node.dataset.revealBound === "true") return;
    node.dataset.reveal = effect;
    node.dataset.revealBound = "true";
    node.style.setProperty("--reveal-delay", `${index * staggerMs}ms`);
  });
};

const revealImmediately = (): void => {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
    node.classList.add("is-visible");
  });
};

export const initScrollReveals = (): void => {
  if (revealInitialized) return;

  registerRevealGroup(".hero__eyebrow-wrap, .hero__title, .hero__body, .hero .hero-cta", "up", 110);
  registerRevealGroup(".hero__meta li", "up", 75);
  registerRevealGroup(".hero-deck__card", "zoom", 110);

  registerRevealGroup(".section-heading", "up", 30);
  registerRevealGroup(".reasons__card", "up", 90);
  registerRevealGroup(".experience__card", "zoom", 70);
  registerRevealGroup(".experience__cta", "up", 80);
  registerRevealGroup(".gallery__item", "zoom", 85);
  registerRevealGroup(".testimonials__card", "up", 85);
  registerRevealGroup(".testimonials__press", "up", 40);
  registerRevealGroup(".history__media", "left", 50);
  registerRevealGroup(".history__content", "right", 90);
  registerRevealGroup(".wines__header", "up", 30);
  registerRevealGroup(".wines__card", "up", 70);
  registerRevealGroup(".contact__content", "left", 50);
  registerRevealGroup(".contact__form", "right", 90);
  registerRevealGroup(".contact__list li", "up", 65);
  registerRevealGroup(".contact__field", "up", 35);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealImmediately();
    revealInitialized = true;
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        target.classList.add("is-visible");
        currentObserver.unobserve(target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14
    }
  );

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
    observer.observe(node);
  });

  revealInitialized = true;
};
