import { trackUiEvent } from "../../utils/analytics";

const setupContactForm = (contactForm: HTMLFormElement): void => {
  if (contactForm.dataset.uiReady === "true") return;

  const statusEl = contactForm.querySelector("[data-contact-status]");
  const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
  const requiredMessage = contactForm.dataset.requiredMessage || "Required field.";
  const invalidEmailMessage = contactForm.dataset.invalidEmailMessage || "Please enter a valid email.";
  const fixErrorsMessage = contactForm.dataset.fixErrorsMessage || "Please fix the highlighted fields.";

  const setFormStatus = (el: HTMLElement, state: "success" | "error", msg: string) => {
    el.classList.remove("is-success", "is-error");
    el.classList.add(state === "success" ? "is-success" : "is-error", "is-visible");
    el.textContent = msg;
  };

  const setFieldError = (field: HTMLInputElement | HTMLTextAreaElement, message: string) => {
    const errorEl = contactForm.querySelector(`[data-error-for="${field.id}"]`);
    const fieldState = field.closest<HTMLElement>("[data-field-state]");
    if (!(errorEl instanceof HTMLElement)) return;
    errorEl.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) {
      field.setAttribute("aria-describedby", `${field.id}-error`);
    } else {
      field.removeAttribute("aria-describedby");
    }
    field.dataset.valid = message ? "false" : field.value.trim() ? "true" : "false";
    fieldState?.classList.toggle("is-invalid", Boolean(message));
    fieldState?.classList.toggle("is-valid", !message && Boolean(field.value.trim()));
    errorEl.classList.toggle("is-visible", Boolean(message));
  };

  const validateField = (field: Element) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return true;
    if (field.validity.valid) {
      setFieldError(field, "");
      return true;
    }

    let message = requiredMessage;
    if (field.validity.typeMismatch && field.type === "email") {
      message = invalidEmailMessage;
    }

    setFieldError(field, message);
    return false;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valid = fields.every((field) => validateField(field));
    if (!valid) {
      if (statusEl instanceof HTMLElement) setFormStatus(statusEl, "error", fixErrorsMessage);
      return;
    }

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(
      Array.from(formData.entries(), ([key, value]) => [key, typeof value === "string" ? value : value.name])
    ) as Record<string, string>;
    const successMessage = contactForm.dataset.successMessage || "Message envoyé.";
    const errorMessage = contactForm.dataset.errorMessage || "Erreur d'envoi. Veuillez réessayer.";

    const submitButton = contactForm.querySelector<HTMLButtonElement>("[type=submit]");
    if (submitButton) submitButton.disabled = true;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          subject: payload.subject,
          message: payload.message,
        }),
      });

      if (res.ok) {
        if (statusEl instanceof HTMLElement) setFormStatus(statusEl, "success", successMessage);
        contactForm.reset();
        trackUiEvent({ event: "cta_click", context: "contact_form_submit" });
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      if (statusEl instanceof HTMLElement) setFormStatus(statusEl, "error", errorMessage);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  let dirty = false;
  fields.forEach((field) => {
    field.addEventListener("change", () => {
      dirty = true;
    });
  });

  window.addEventListener("beforeunload", () => {
    if (dirty) {
      trackUiEvent({
        event: "form_abandon",
        context: "contact_form"
      });
    }
  });

  contactForm.dataset.uiReady = "true";
};

export const initContactForms = (): void => {
  document.querySelectorAll<HTMLFormElement>("[data-contact-form]").forEach(setupContactForm);
};
