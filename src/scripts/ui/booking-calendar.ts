import type { BookingApiResponse, BookingSubmissionPayload } from "../../types/visits";
import type { BookingConfig } from "../../types/ui";

const parseConfig = (root: HTMLElement): BookingConfig | null => {
  const raw = root.dataset.config;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as BookingConfig;
  } catch {
    return null;
  }
};

const trackUiEvent = (event: string, context: string, meta: Record<string, unknown>) => {
  const payload = { event, context, meta };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("ui:track", { detail: payload }));
};

const setStatus = (statusEl: HTMLElement | null, tone: "success" | "error", message: string) => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove("is-success", "is-error");
  statusEl.classList.add(tone === "success" ? "is-success" : "is-error");
};

const initBookingCalendar = (root: HTMLElement): void => {
  if (root.dataset.uiReady === "true") return;

  const config = parseConfig(root);
  if (!config) return;

  let selectedDay = config.defaultDay;
  let selectedSlot = config.defaultSlotId;
  let participants = config.defaultParticipants;
  let addon = false;

  const countValue = root.querySelector<HTMLOutputElement>("[data-count-value]");
  const priceValue = root.querySelector<HTMLElement>("[data-price-value]");
  const addonInput = root.querySelector<HTMLInputElement>("[data-addon]");
  const monthLabel = root.querySelector<HTMLElement>("[data-calendar-month]");

  const dayField = root.querySelector<HTMLInputElement>("[data-booking-field-day]");
  const slotField = root.querySelector<HTMLInputElement>("[data-booking-field-slot]");
  const participantsField = root.querySelector<HTMLInputElement>("[data-booking-field-participants]");
  const addonField = root.querySelector<HTMLInputElement>("[data-booking-field-addon]");
  const totalField = root.querySelector<HTMLInputElement>("[data-booking-field-total]");
  const form = root.querySelector<HTMLFormElement>("[data-booking-form]");
  const statusEl = root.querySelector<HTMLElement>("[data-booking-status]");

  const monthDate = (() => {
    const parsed = Date.parse(config.monthLabel);
    return Number.isNaN(parsed) ? new Date() : new Date(parsed);
  })();

  const refresh = () => {
    const totalPerPerson = config.basePricePerPerson + (addon ? config.addonPricePerPerson : 0);

    if (countValue) countValue.textContent = String(participants);
    if (priceValue) priceValue.textContent = String(totalPerPerson);

    if (dayField) dayField.value = String(selectedDay);
    if (slotField) slotField.value = selectedSlot;
    if (participantsField) participantsField.value = String(participants);
    if (addonField) addonField.value = addon ? "true" : "false";
    if (totalField) totalField.value = String(totalPerPerson);

    root.querySelectorAll<HTMLButtonElement>("[data-day]").forEach((button) => {
      const active = Number(button.getAttribute("data-day")) === selectedDay;
      button.classList.toggle("is-active", active);
      if (active) {
        button.setAttribute("aria-current", "date");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    root.querySelectorAll<HTMLButtonElement>("[data-slot]").forEach((button) => {
      const active = button.getAttribute("data-slot") === selectedSlot;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  root.querySelectorAll<HTMLButtonElement>("[data-day]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDay = Number(button.getAttribute("data-day"));
      refresh();
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSlot = button.getAttribute("data-slot") ?? selectedSlot;
      refresh();
    });
  });

  root.querySelector("[data-count-dec]")?.addEventListener("click", () => {
    participants = Math.max(config.minParticipants, participants - 1);
    refresh();
  });

  root.querySelector("[data-count-inc]")?.addEventListener("click", () => {
    participants = Math.min(config.maxParticipants, participants + 1);
    refresh();
  });

  addonInput?.addEventListener("change", () => {
    addon = addonInput.checked;
    refresh();
  });

  const shiftMonth = (delta: number) => {
    monthDate.setMonth(monthDate.getMonth() + delta);
    if (monthLabel) {
      monthLabel.textContent = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(monthDate);
    }
  };

  root.querySelector("[data-calendar-prev]")?.addEventListener("click", () => shiftMonth(-1));
  root.querySelector("[data-calendar-next]")?.addEventListener("click", () => shiftMonth(1));

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload: BookingSubmissionPayload = {
      source: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
      day: selectedDay,
      slotId: selectedSlot,
      participants,
      addon,
      totalPerPerson: config.basePricePerPerson + (addon ? config.addonPricePerPerson : 0),
      pagePath: window.location.pathname,
      submittedAt: new Date().toISOString()
    };

    const endpoint = form.dataset.submitEndpoint?.trim() ?? "";
    const successMessage = form.dataset.submitSuccess?.trim() || "Demande envoyee.";
    const errorMessage = form.dataset.submitError?.trim() || "Erreur lors de l'envoi.";

    try {
      if (!endpoint) {
        const subject = encodeURIComponent("Demande de visite - Domaine de la Perinade");
        const body = encodeURIComponent(JSON.stringify(payload, null, 2));
        window.location.href = `mailto:contact@perinade.fr?subject=${subject}&body=${body}`;
        setStatus(statusEl, "success", successMessage);
        trackUiEvent("booking_submit", "visites_booking", payload);
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => null)) as BookingApiResponse | null;
      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || "Request failed");
      }

      setStatus(statusEl, "success", data.message || successMessage);
      trackUiEvent("booking_submit", "visites_booking", payload);
    } catch {
      setStatus(statusEl, "error", errorMessage);
      trackUiEvent("booking_error", "visites_booking", payload);
    }
  });

  refresh();
  root.dataset.uiReady = "true";
};

export const initBookingCalendars = (): void => {
  document.querySelectorAll<HTMLElement>("[data-booking]").forEach(initBookingCalendar);
};
