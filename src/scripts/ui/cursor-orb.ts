let cursorOrbReady = false;

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, [role="button"], [data-todo]';

export const initCursorOrb = (): void => {
  if (cursorOrbReady) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (reducedMotion || !canHover || !hasFinePointer) {
    cursorOrbReady = true;
    return;
  }

  const orb = document.createElement("span");
  orb.className = "cursor-orb";
  orb.setAttribute("aria-hidden", "true");
  document.body.append(orb);
  document.body.classList.add("has-cursor-orb");

  let rafId = 0;
  let targetX = window.innerWidth * 0.5;
  let targetY = window.innerHeight * 0.5;
  let currentX = targetX;
  let currentY = targetY;

  let isVisible = false;
  let isHovering = false;
  let isPressed = false;

  const updateState = () => {
    orb.classList.toggle("is-visible", isVisible);
    orb.classList.toggle("is-hovering", isHovering);
    orb.classList.toggle("is-pressed", isPressed);
  };

  const animate = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    orb.style.left = `${currentX}px`;
    orb.style.top = `${currentY}px`;

    rafId = window.requestAnimationFrame(animate);
  };

  const onPointerMove = (event: PointerEvent) => {
    targetX = event.clientX;
    targetY = event.clientY;

    if (!isVisible) {
      isVisible = true;
      updateState();
    }
  };

  const onPointerOver = (event: PointerEvent) => {
    if (!(event.target instanceof Element)) return;
    isHovering = Boolean(event.target.closest(INTERACTIVE_SELECTOR));
    updateState();
  };

  const onPointerDown = () => {
    isPressed = true;
    updateState();
  };

  const onPointerUp = () => {
    isPressed = false;
    updateState();
  };

  const onWindowLeave = () => {
    isVisible = false;
    isHovering = false;
    isPressed = false;
    updateState();
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("pointerup", onPointerUp, { passive: true });
  document.addEventListener("pointercancel", onPointerUp, { passive: true });
  document.addEventListener("mouseleave", onWindowLeave);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") {
      onWindowLeave();
    }
  });

  if (!rafId) {
    rafId = window.requestAnimationFrame(animate);
  }

  cursorOrbReady = true;
};
