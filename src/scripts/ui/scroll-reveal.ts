let revealInitialized = false;

const registerDeclarativeRevealGroups = (): void => {
  document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const staggerMs = Number(group.dataset.revealStagger || "70");
    const nodes = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
    nodes.forEach((node, index) => {
      if (node.dataset.revealDelay) {
        node.style.setProperty("--reveal-delay", `${Number(node.dataset.revealDelay)}ms`);
        return;
      }

      node.style.setProperty("--reveal-delay", `${index * staggerMs}ms`);
    });
  });
};

const revealImmediately = (): void => {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
    node.classList.add("is-visible");
  });
};

export const initScrollReveals = (): void => {
  if (revealInitialized) return;
  registerDeclarativeRevealGroups();

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
