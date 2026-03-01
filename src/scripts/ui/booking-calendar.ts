import type { BookingApiResponse, BookingSubmissionPayload } from "../../types/visits";
import type { BookingConfig, BookingState, CalendarMonthView } from "../../types/ui";
import { trackUiEvent } from "../../utils/analytics";

const parseDate = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const toDateKey = (date: Date): string => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, delta: number): Date => new Date(date.getFullYear(), date.getMonth() + delta, 1);

const sameDay = (a: Date | null, b: Date): boolean => {
  if (!a) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

const parseConfig = (root: HTMLElement): BookingConfig | null => {
  const raw = root.dataset.config;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as BookingConfig;
  } catch {
    return null;
  }
};

const getMonthView = (date: Date, locale: string, timezone: string): CalendarMonthView => {
  const monthStart = startOfMonth(date);
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: timezone
  });

  return {
    monthStart,
    monthLabel: formatter.format(monthStart),
    leadingPadding: (monthStart.getDay() + 6) % 7,
    totalDays: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate()
  };
};

const setStatus = (statusEl: HTMLElement | null, tone: "success" | "error", message: string) => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove("is-success", "is-error");
  statusEl.classList.add(tone === "success" ? "is-success" : "is-error");
};

const payloadToMeta = (payload: BookingSubmissionPayload): Record<string, string | number | boolean> => {
  return {
    source: payload.source,
    day: payload.day,
    slotId: payload.slotId,
    participants: payload.participants,
    addon: payload.addon,
    totalPerPerson: payload.totalPerPerson,
    pagePath: payload.pagePath,
    submittedAt: payload.submittedAt
  };
};

const initBookingCalendar = (root: HTMLElement): void => {
  if (root.dataset.uiReady === "true") return;

  const config = parseConfig(root);
  if (!config) return;

  const startDate = parseDate(config.startDate);
  const endDate = parseDate(config.endDate);
  const disabledDates = new Set(config.disabledDates ?? []);
  const disabledWeekdays = new Set(config.disabledWeekdays ?? []);

  const monthLabel = root.querySelector<HTMLElement>("[data-calendar-month]");
  const daysGrid = root.querySelector<HTMLElement>("[data-calendar-days]");
  const prevButton = root.querySelector<HTMLButtonElement>("[data-calendar-prev]");
  const nextButton = root.querySelector<HTMLButtonElement>("[data-calendar-next]");
  const countValue = root.querySelector<HTMLOutputElement>("[data-count-value]");
  const priceValue = root.querySelector<HTMLElement>("[data-price-value]");
  const addonInput = root.querySelector<HTMLInputElement>("[data-addon]");

  const dayField = root.querySelector<HTMLInputElement>("[data-booking-field-day]");
  const slotField = root.querySelector<HTMLInputElement>("[data-booking-field-slot]");
  const participantsField = root.querySelector<HTMLInputElement>("[data-booking-field-participants]");
  const addonField = root.querySelector<HTMLInputElement>("[data-booking-field-addon]");
  const totalField = root.querySelector<HTMLInputElement>("[data-booking-field-total]");
  const form = root.querySelector<HTMLFormElement>("[data-booking-form]");
  const statusEl = root.querySelector<HTMLElement>("[data-booking-status]");

  if (!monthLabel || !daysGrid || !prevButton || !nextButton) return;

  const initialMonth = /^\d{4}-\d{2}$/.test(config.initialMonth)
    ? parseDate(`${config.initialMonth}-01`)
    : startDate;

  const state: BookingState = {
    monthCursor: startOfMonth(initialMonth),
    selectedDate: new Date(initialMonth.getFullYear(), initialMonth.getMonth(), config.defaultDay),
    selectedSlot: config.defaultSlotId,
    participants: config.defaultParticipants,
    addon: false
  };

  const isSelectableDate = (date: Date): boolean => {
    const key = toDateKey(date);
    const inRange = date >= startDate && date <= endDate;
    const dayAllowed = config.selectableDays.includes(date.getDate());
    const weekdayAllowed = !disabledWeekdays.has(date.getDay());
    const dateAllowed = !disabledDates.has(key);
    return inRange && dayAllowed && weekdayAllowed && dateAllowed;
  };

  const findFirstSelectableDateInMonth = (monthDate: Date): Date | null => {
    const monthStart = startOfMonth(monthDate);
    const totalDays = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
      if (isSelectableDate(date)) return date;
    }

    return null;
  };

  const hasSelectableInMonth = (monthDate: Date): boolean => Boolean(findFirstSelectableDateInMonth(monthDate));

  const findFirstSelectableMonth = (seed: Date): Date | null => {
    const cursor = startOfMonth(seed);
    const limit = startOfMonth(endDate);

    while (cursor <= limit) {
      if (hasSelectableInMonth(cursor)) return new Date(cursor);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return null;
  };

  const totalPerPerson = () => config.basePricePerPerson + (state.addon ? config.addonPricePerPerson : 0);

  const syncFields = () => {
    if (countValue) countValue.textContent = String(state.participants);
    if (priceValue) priceValue.textContent = String(totalPerPerson());

    if (dayField) dayField.value = state.selectedDate ? toDateKey(state.selectedDate) : "";
    if (slotField) slotField.value = state.selectedSlot;
    if (participantsField) participantsField.value = String(state.participants);
    if (addonField) addonField.value = state.addon ? "true" : "false";
    if (totalField) totalField.value = String(totalPerPerson());

    root.querySelectorAll<HTMLButtonElement>("[data-slot]").forEach((button) => {
      const active = button.dataset.slot === state.selectedSlot;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  const alignSelectedDateToMonth = () => {
    const preferredDay = state.selectedDate?.getDate() ?? config.defaultDay;
    const candidate = new Date(state.monthCursor.getFullYear(), state.monthCursor.getMonth(), preferredDay);

    if (isSelectableDate(candidate)) {
      state.selectedDate = candidate;
      return;
    }

    state.selectedDate = findFirstSelectableDateInMonth(state.monthCursor);
  };

  const renderCalendar = () => {
    const view = getMonthView(state.monthCursor, config.locale, config.timezone);

    monthLabel.textContent = view.monthLabel.charAt(0).toUpperCase() + view.monthLabel.slice(1);
    daysGrid.replaceChildren();

    for (let i = 0; i < view.leadingPadding; i += 1) {
      const spacer = document.createElement("span");
      spacer.className = "booking__day-pad";
      spacer.setAttribute("aria-hidden", "true");
      daysGrid.append(spacer);
    }

    for (let day = 1; day <= view.totalDays; day += 1) {
      const date = new Date(view.monthStart.getFullYear(), view.monthStart.getMonth(), day);
      const selectable = isSelectableDate(date);

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.day = String(day);
      button.textContent = String(day);

      if (!selectable) {
        button.disabled = true;
        button.classList.add("is-disabled");
        button.setAttribute("aria-disabled", "true");
      }

      if (sameDay(state.selectedDate, date)) {
        button.classList.add("is-active");
        button.setAttribute("aria-current", "date");
      }

      button.addEventListener("click", () => {
        if (!selectable) return;
        state.selectedDate = date;
        syncFields();
        renderCalendar();
      });

      daysGrid.append(button);
    }

    const previousMonth = addMonths(state.monthCursor, -1);
    const nextMonth = addMonths(state.monthCursor, 1);
    prevButton.disabled = !hasSelectableInMonth(previousMonth);
    nextButton.disabled = !hasSelectableInMonth(nextMonth);
  };

  root.querySelector("[data-count-dec]")?.addEventListener("click", () => {
    state.participants = Math.max(config.minParticipants, state.participants - 1);
    syncFields();
  });

  root.querySelector("[data-count-inc]")?.addEventListener("click", () => {
    state.participants = Math.min(config.maxParticipants, state.participants + 1);
    syncFields();
  });

  root.querySelectorAll<HTMLButtonElement>("[data-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const slotId = button.dataset.slot;
      if (!slotId) return;
      state.selectedSlot = slotId;
      syncFields();
    });
  });

  addonInput?.addEventListener("change", () => {
    state.addon = addonInput.checked;
    syncFields();
  });

  prevButton.addEventListener("click", () => {
    const previousMonth = addMonths(state.monthCursor, -1);
    if (!hasSelectableInMonth(previousMonth)) return;
    state.monthCursor = previousMonth;
    alignSelectedDateToMonth();
    syncFields();
    renderCalendar();
  });

  nextButton.addEventListener("click", () => {
    const nextMonth = addMonths(state.monthCursor, 1);
    if (!hasSelectableInMonth(nextMonth)) return;
    state.monthCursor = nextMonth;
    alignSelectedDateToMonth();
    syncFields();
    renderCalendar();
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const missingDateMessage = form?.dataset.errorMissingDate?.trim() || "Please select a valid date.";
    const mailSubjectFallback = form?.dataset.mailSubject?.trim() || "Visit request - Domaine de la Perinade";

    if (!state.selectedDate) {
      setStatus(statusEl, "error", missingDateMessage);
      trackUiEvent({
        event: "booking_error",
        context: "visites_booking",
        meta: {
          reason: "missing_date"
        }
      });
      return;
    }

    const payload: BookingSubmissionPayload = {
      source: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
      day: state.selectedDate.getDate(),
      slotId: state.selectedSlot,
      participants: state.participants,
      addon: state.addon,
      totalPerPerson: totalPerPerson(),
      pagePath: window.location.pathname,
      submittedAt: new Date().toISOString()
    };

    const endpoint = form.dataset.submitEndpoint?.trim() ?? "";
    const successMessage = form.dataset.submitSuccess?.trim() || form.dataset.defaultSuccess?.trim() || "Request sent.";
    const errorMessage = form.dataset.submitError?.trim() || form.dataset.defaultError?.trim() || "Error while sending request.";

    try {
      if (!endpoint) {
        const subject = encodeURIComponent(mailSubjectFallback);
        const body = encodeURIComponent(JSON.stringify(payload, null, 2));
        window.location.href = `mailto:contact@perinade.fr?subject=${subject}&body=${body}`;
        setStatus(statusEl, "success", successMessage);
        trackUiEvent({
          event: "booking_submit",
          context: "visites_booking",
          meta: payloadToMeta(payload)
        });
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
      trackUiEvent({
        event: "booking_submit",
        context: "visites_booking",
        meta: payloadToMeta(payload)
      });
    } catch {
      setStatus(statusEl, "error", errorMessage);
      trackUiEvent({
        event: "booking_error",
        context: "visites_booking",
        meta: payloadToMeta(payload)
      });
    }
  });

  if (!hasSelectableInMonth(state.monthCursor)) {
    const firstMonth = findFirstSelectableMonth(startDate);
    if (firstMonth) {
      state.monthCursor = firstMonth;
    }
  }

  if (!state.selectedDate || !isSelectableDate(state.selectedDate)) {
    state.selectedDate = findFirstSelectableDateInMonth(state.monthCursor);
  }

  syncFields();
  renderCalendar();
  root.dataset.uiReady = "true";
};

export const initBookingCalendars = (): void => {
  document.querySelectorAll<HTMLElement>("[data-booking]").forEach(initBookingCalendar);
};
