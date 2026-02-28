import type { Locale } from "./locales";

/**
 * Shared UI strings used across all pages (header, footer, common labels).
 * Non-content strings that appear in the chrome / shell of the site.
 */
const ui = {
  fr: {
    skipToContent: "Aller au contenu",
    navLabel: "Navigation principale",
    mobileNavLabel: "Actions rapides mobiles",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    homeLabel: "Accueil",
    languageLabel: "Langue",
    bookCta: "Réserver",
    callCta: "Appeler",
    shopCta: "Boutique",
    backToTop: "Retour en haut",
    formSubmitting: "Envoi en cours…",
    formSuccess: "Message envoyé avec succès.",
    formError: "Erreur lors de l'envoi. Veuillez réessayer.",
    required: "Requis",
    invalidEmail: "Adresse email invalide",
    legalLine: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération.",
    copyright: "© 2026 Domaine de la Périnade. Tous droits réservés."
  },
  en: {
    skipToContent: "Skip to content",
    navLabel: "Main navigation",
    mobileNavLabel: "Quick actions",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    homeLabel: "Home",
    languageLabel: "Language",
    bookCta: "Book",
    callCta: "Call",
    shopCta: "Shop",
    backToTop: "Back to top",
    formSubmitting: "Sending…",
    formSuccess: "Message sent successfully.",
    formError: "Error sending message. Please try again.",
    required: "Required",
    invalidEmail: "Invalid email address",
    legalLine: "Alcohol abuse is dangerous for your health. Drink responsibly.",
    copyright: "© 2026 Domaine de la Périnade. All rights reserved."
  },
  es: {
    skipToContent: "Ir al contenido",
    navLabel: "Navegación principal",
    mobileNavLabel: "Acciones rápidas",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    homeLabel: "Inicio",
    languageLabel: "Idioma",
    bookCta: "Reservar",
    callCta: "Llamar",
    shopCta: "Tienda",
    backToTop: "Volver arriba",
    formSubmitting: "Enviando…",
    formSuccess: "Mensaje enviado correctamente.",
    formError: "Error al enviar. Por favor, inténtelo de nuevo.",
    required: "Obligatorio",
    invalidEmail: "Dirección de correo inválida",
    legalLine: "El abuso de alcohol es peligroso para la salud. Consuma con moderación.",
    copyright: "© 2026 Domaine de la Périnade. Todos los derechos reservados."
  }
} as const;

export type UiStrings = (typeof ui)[Locale];

export function getUiStrings(locale: Locale): UiStrings {
  return ui[locale];
}
