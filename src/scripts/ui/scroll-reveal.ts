let revealInitialized = false;
let activeObserver: IntersectionObserver | null = null;

document.addEventListener("astro:before-swap", () => {
  revealInitialized = false;
  activeObserver?.disconnect();
  activeObserver = null;
});

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

  const url = new URL(window.location.href);
  const qaMode = url.searchParams.get("qa");
  const forceStaticReveal = qaMode === "static" || qaMode === "1";

  if (forceStaticReveal) {
    revealImmediately();
    revealInitialized = true;
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealImmediately();
    revealInitialized = true;
    return;
  }

  activeObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        target.classList.add("is-visible");
        obs.unobserve(target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14
    }
  );

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
    activeObserver!.observe(node);
  });

  revealInitialized = true;
};
