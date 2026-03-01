import { trackUiEvent } from "../../utils/analytics";

const setupContactForm = (contactForm: HTMLFormElement): void => {
  if (contactForm.dataset.uiReady === "true") return;

  const statusEl = contactForm.querySelector("[data-contact-status]");
  const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
  const requiredMessage = contactForm.dataset.requiredMessage || "Required field.";
  const invalidEmailMessage = contactForm.dataset.invalidEmailMessage || "Please enter a valid email.";
  const fixErrorsMessage = contactForm.dataset.fixErrorsMessage || "Please fix the highlighted fields.";
  const defaultSubject = contactForm.dataset.defaultSubject || "Contact request";
  const mailFirstName = contactForm.dataset.mailFirstName || "First name";
  const mailLastName = contactForm.dataset.mailLastName || "Last name";
  const mailEmail = contactForm.dataset.mailEmail || "Email";
  const mailPhone = contactForm.dataset.mailPhone || "Phone";
  const mailMessage = contactForm.dataset.mailMessage || "Message";

  const setFieldError = (field: HTMLInputElement | HTMLTextAreaElement, message: string) => {
    const errorEl = contactForm.querySelector(`[data-error-for="${field.id}"]`);
    const fieldState = field.closest<HTMLElement>("[data-field-state]");
    if (!(errorEl instanceof HTMLElement)) return;
    errorEl.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
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

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = fields.every((field) => validateField(field));
    if (!valid) {
      if (statusEl instanceof HTMLElement) {
        statusEl.textContent = fixErrorsMessage;
        statusEl.classList.remove("is-success");
        statusEl.classList.add("is-error");
        statusEl.classList.add("is-visible");
      }
      return;
    }

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(
      Array.from(formData.entries(), ([key, value]) => [key, typeof value === "string" ? value : value.name])
    ) as Record<string, string>;
    const action = contactForm.getAttribute("action") || "";
    const successMessage = contactForm.dataset.successMessage || "Message envoye.";
    const errorMessage = contactForm.dataset.errorMessage || "Erreur d'envoi.";

    try {
      if (action.startsWith("mailto:")) {
        const subject = encodeURIComponent(String(payload.subject || defaultSubject));
        const body = encodeURIComponent(
          `${mailFirstName}: ${payload.firstName}\n${mailLastName}: ${payload.lastName}\n${mailEmail}: ${payload.email}\n${mailPhone}: ${payload.phone}\n\n${mailMessage}:\n${payload.message}`
        );
        window.location.href = `${action}?subject=${subject}&body=${body}`;
        if (statusEl instanceof HTMLElement) {
          statusEl.textContent = successMessage;
          statusEl.classList.remove("is-error");
          statusEl.classList.add("is-success");
          statusEl.classList.add("is-visible");
        }
        contactForm.reset();
        trackUiEvent({
          event: "cta_click",
          context: "contact_form_submit",
          meta: payload
        });
        return;
      }

      if (statusEl instanceof HTMLElement) {
        statusEl.textContent = errorMessage;
        statusEl.classList.remove("is-success");
        statusEl.classList.add("is-error");
        statusEl.classList.add("is-visible");
      }
    } catch {
      if (statusEl instanceof HTMLElement) {
        statusEl.textContent = errorMessage;
        statusEl.classList.remove("is-success");
        statusEl.classList.add("is-error");
        statusEl.classList.add("is-visible");
      }
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
