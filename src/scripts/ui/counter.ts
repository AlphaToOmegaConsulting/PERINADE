const initCounter = (root: HTMLElement): void => {
  if (root.dataset.uiReady === "true") return;

  const valueEl = root.querySelector<HTMLOutputElement>("[data-count-value]");
  const dec = root.querySelector<HTMLButtonElement>("[data-count-dec]");
  const inc = root.querySelector<HTMLButtonElement>("[data-count-inc]");
  if (!valueEl || !dec || !inc) return;

  const min = Number(root.dataset.counterMin ?? 1);
  const max = Number(root.dataset.counterMax ?? 10);

  const sync = (value: number) => {
    valueEl.textContent = String(value);
    dec.disabled = value <= min;
    inc.disabled = value >= max;
  };

  dec.addEventListener("click", () => {
    const current = Number(valueEl.textContent ?? min);
    sync(Math.max(min, current - 1));
  });

  inc.addEventListener("click", () => {
    const current = Number(valueEl.textContent ?? min);
    sync(Math.min(max, current + 1));
  });

  sync(Number(valueEl.textContent ?? min));
  root.dataset.uiReady = "true";
};

export const initCounters = (): void => {
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach(initCounter);
};
