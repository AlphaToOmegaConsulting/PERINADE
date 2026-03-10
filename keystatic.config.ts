import { config, fields, singleton } from "@keystatic/core";

// ─── Champs réutilisables ──────────────────────────────────────────────────

const ctaFields = {
  label: fields.text({ label: "Libellé du CTA" }),
  href: fields.text({ label: "Lien" }),
};

const seoFields = {
  title: fields.text({ label: "Titre SEO" }),
  description: fields.text({ label: "Description SEO", multiline: true }),
};

// ─── Schéma Accueil ────────────────────────────────────────────────────────

const accueilSchema = {
  nav: fields.array(
    fields.object({
      label: fields.text({ label: "Libellé" }),
      href: fields.text({ label: "Lien" }),
      mobile: fields.checkbox({ label: "Visible sur mobile", defaultValue: true }),
      desktopSlot: fields.select({
        label: "Slot desktop",
        options: [
          { label: "Gauche", value: "left" },
          { label: "Droite", value: "right" },
        ],
        defaultValue: "left",
      }),
      desktopLabel: fields.text({ label: "Libellé desktop", validation: { isRequired: false } }),
    }),
    { label: "Navigation", itemLabel: (props) => props.fields.label.value ?? "Lien" }
  ),

  mobileQuickActions: fields.array(
    fields.object({
      id: fields.select({
        label: "ID",
        options: [
          { label: "Réservation", value: "book" },
          { label: "Boutique", value: "shop" },
          { label: "Appel", value: "call" },
        ],
        defaultValue: "book",
      }),
      label: fields.text({ label: "Libellé" }),
      href: fields.text({ label: "Lien" }),
      icon: fields.select({
        label: "Icône",
        options: [
          { label: "Calendrier", value: "calendar" },
          { label: "Sac", value: "bag" },
          { label: "Téléphone", value: "phone" },
        ],
        defaultValue: "calendar",
      }),
      priority: fields.select({
        label: "Priorité",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
        defaultValue: "secondary",
      }),
    }),
    { label: "Actions rapides mobile", itemLabel: (props) => props.fields.label.value ?? "Action" }
  ),

  hero: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.array(fields.text({ label: "Ligne" }), {
      label: "Titre (une ligne par entrée)",
      itemLabel: (props) => props.value ?? "Ligne",
    }),
    body: fields.text({ label: "Corps du texte", multiline: true }),
    ctaLabel: fields.text({ label: "CTA — libellé" }),
    ctaHref: fields.text({ label: "CTA — lien" }),
    meta: fields.array(fields.text({ label: "Élément" }), {
      label: "Méta-infos",
      itemLabel: (props) => props.value ?? "Info",
    }),
    backgroundImage: fields.text({ label: "Image de fond (chemin)" }),
    featuredCards: fields.array(
      fields.object({
        kicker: fields.text({ label: "Kicker" }),
        title: fields.text({ label: "Titre" }),
        image: fields.text({ label: "Image (chemin)" }),
        alt: fields.text({ label: "Alt" }),
        href: fields.text({ label: "Lien" }),
      }),
      { label: "Cartes mises en avant", itemLabel: (props) => props.fields.title.value ?? "Carte" }
    ),
  }, { label: "Hero" }),

  reasons: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    items: fields.array(
      fields.object({
        title: fields.text({ label: "Titre" }),
        body: fields.text({ label: "Corps", multiline: true }),
        icon: fields.text({ label: "Icône" }),
      }),
      { label: "Raisons", itemLabel: (props) => props.fields.title.value ?? "Raison" }
    ),
  }, { label: "Raisons de visiter" }),

  experience: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    body: fields.text({ label: "Corps", multiline: true }),
    infoLine: fields.text({ label: "Ligne d'info" }),
    ctaLabel: fields.text({ label: "CTA — libellé" }),
    ctaHref: fields.text({ label: "CTA — lien" }),
    backgroundImage: fields.text({ label: "Image de fond (chemin)" }),
    details: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        value: fields.text({ label: "Valeur" }),
        icon: fields.text({ label: "Icône" }),
      }),
      { label: "Détails", itemLabel: (props) => props.fields.label.value ?? "Détail" }
    ),
  }, { label: "Expérience" }),

  gallery: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    items: fields.array(
      fields.object({
        src: fields.text({ label: "Image (chemin)" }),
        alt: fields.text({ label: "Alt" }),
      }),
      { label: "Photos", itemLabel: (props) => props.fields.alt.value ?? "Photo" }
    ),
  }, { label: "Galerie" }),

  testimonials: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    pressLabel: fields.text({ label: "Label presse" }),
    pressLogos: fields.array(fields.text({ label: "Nom du média" }), {
      label: "Logos presse",
      itemLabel: (props) => props.value ?? "Média",
    }),
    items: fields.array(
      fields.object({
        quote: fields.text({ label: "Citation", multiline: true }),
        author: fields.text({ label: "Auteur" }),
        meta: fields.text({ label: "Localisation" }),
        rating: fields.integer({ label: "Note (/5)", defaultValue: 5 }),
      }),
      { label: "Témoignages", itemLabel: (props) => props.fields.author.value ?? "Témoignage" }
    ),
  }, { label: "Témoignages" }),

  history: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    titleHighlight: fields.text({ label: "Mot mis en valeur" }),
    body: fields.array(fields.text({ label: "Paragraphe", multiline: true }), {
      label: "Corps (un paragraphe par entrée)",
      itemLabel: (props) => (props.value ?? "").substring(0, 40) + "…",
    }),
    imagePrimary: fields.text({ label: "Image (chemin)" }),
    ctaLabel: fields.text({ label: "CTA — libellé" }),
    ctaHref: fields.text({ label: "CTA — lien" }),
  }, { label: "Histoire" }),

  wines: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    allWinesLabel: fields.text({ label: "Libellé — voir tous" }),
    allWinesHref: fields.text({ label: "Lien — voir tous" }),
    items: fields.array(
      fields.object({
        image: fields.text({ label: "Image (chemin)" }),
        title: fields.text({ label: "Titre" }),
        subtitle: fields.text({ label: "Sous-titre" }),
        description: fields.text({ label: "Description", multiline: true }),
        ctaLabel: fields.text({ label: "CTA — libellé" }),
        ctaHref: fields.text({ label: "CTA — lien" }),
      }),
      { label: "Vins", itemLabel: (props) => props.fields.title.value ?? "Vin" }
    ),
  }, { label: "Vins" }),

  contact: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    titleHtml: fields.text({ label: "Titre" }),
    body: fields.text({ label: "Corps", multiline: true }),
    info: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        value: fields.text({ label: "Valeur" }),
        icon: fields.text({ label: "Icône" }),
      }),
      { label: "Infos de contact", itemLabel: (props) => props.fields.label.value ?? "Info" }
    ),
    labels: fields.object({
      firstName: fields.text({ label: "Prénom" }),
      lastName: fields.text({ label: "Nom" }),
      email: fields.text({ label: "E-mail" }),
      phone: fields.text({ label: "Téléphone" }),
      subject: fields.text({ label: "Sujet" }),
      message: fields.text({ label: "Message" }),
      submit: fields.text({ label: "Bouton envoi" }),
    }, { label: "Labels du formulaire" }),
    validation: fields.object({
      required: fields.text({ label: "Champ requis" }),
      invalidEmail: fields.text({ label: "Email invalide" }),
      fixErrors: fields.text({ label: "Corriger les erreurs" }),
    }, { label: "Messages de validation" }),
    mail: fields.object({
      defaultSubject: fields.text({ label: "Sujet par défaut" }),
      fieldFirstName: fields.text({ label: "Champ prénom" }),
      fieldLastName: fields.text({ label: "Champ nom" }),
      fieldEmail: fields.text({ label: "Champ email" }),
      fieldPhone: fields.text({ label: "Champ téléphone" }),
      fieldMessage: fields.text({ label: "Champ message" }),
    }, { label: "Labels email" }),
    formSuccessMessage: fields.text({ label: "Message succès", multiline: true }),
    formErrorMessage: fields.text({ label: "Message erreur", multiline: true }),
  }, { label: "Contact" }),

  footer: fields.object({
    brandTitle: fields.text({ label: "Nom de la marque" }),
    about: fields.text({ label: "À propos", multiline: true }),
    groups: fields.array(
      fields.object({
        title: fields.text({ label: "Titre du groupe" }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Libellé" }),
            href: fields.text({ label: "Lien" }),
          }),
          { label: "Liens", itemLabel: (props) => props.fields.label.value ?? "Lien" }
        ),
      }),
      { label: "Groupes de liens", itemLabel: (props) => props.fields.title.value ?? "Groupe" }
    ),
    newsletterTitle: fields.text({ label: "Titre newsletter" }),
    newsletterBody: fields.text({ label: "Corps newsletter" }),
    newsletterAdultNotice: fields.text({ label: "Mention majeurs" }),
    newsletterPlaceholder: fields.text({ label: "Placeholder email" }),
    newsletterAction: fields.text({ label: "Action newsletter" }),
    social: fields.array(
      fields.object({
        label: fields.text({ label: "Réseau" }),
        href: fields.text({ label: "Lien" }),
      }),
      { label: "Réseaux sociaux", itemLabel: (props) => props.fields.label.value ?? "Réseau" }
    ),
    copyright: fields.text({ label: "Copyright" }),
    legalLine: fields.text({ label: "Mention légale alcool" }),
  }, { label: "Footer" }),
};

// ─── Schéma Domaine ────────────────────────────────────────────────────────

const domaineSchema = {
  theme: fields.object({
    sectionDesktop: fields.text({ label: "Espacement desktop" }),
    sectionTablet: fields.text({ label: "Espacement tablette" }),
    sectionMobile: fields.text({ label: "Espacement mobile" }),
  }, { label: "Thème — espacements" }),

  seo: fields.object(seoFields, { label: "SEO" }),

  hero: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    titleLines: fields.array(fields.text({ label: "Ligne" }), {
      label: "Titre (une ligne par entrée)",
      itemLabel: (props) => props.value ?? "Ligne",
    }),
    body: fields.text({ label: "Corps", multiline: true }),
    image: fields.text({ label: "Image (chemin)" }),
    imageAlt: fields.text({ label: "Alt image" }),
    primaryCta: fields.object(ctaFields, { label: "CTA principal" }),
    secondaryCta: fields.object(ctaFields, { label: "CTA secondaire" }),
    badges: fields.array(fields.text({ label: "Badge" }), {
      label: "Badges",
      itemLabel: (props) => props.value ?? "Badge",
    }),
    highlights: fields.array(fields.text({ label: "Point clé" }), {
      label: "Points clés",
      itemLabel: (props) => props.value ?? "Point",
    }),
  }, { label: "Hero" }),

  terroir: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    body: fields.text({ label: "Corps", multiline: true }),
    grapesTitle: fields.text({ label: "Titre cépages" }),
    commitmentsTitle: fields.text({ label: "Titre engagements" }),
    image: fields.text({ label: "Image (chemin)" }),
    imageAlt: fields.text({ label: "Alt image" }),
    grapes: fields.array(fields.text({ label: "Cépage" }), {
      label: "Cépages",
      itemLabel: (props) => props.value ?? "Cépage",
    }),
    commitments: fields.array(
      fields.object({
        title: fields.text({ label: "Titre" }),
        body: fields.text({ label: "Corps", multiline: true }),
      }),
      { label: "Engagements", itemLabel: (props) => props.fields.title.value ?? "Engagement" }
    ),
  }, { label: "Terroir & Savoir-faire" }),

  family: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    body: fields.array(fields.text({ label: "Paragraphe", multiline: true }), {
      label: "Corps (un paragraphe par entrée)",
      itemLabel: (props) => (props.value ?? "").substring(0, 40) + "…",
    }),
    image: fields.text({ label: "Image (chemin)" }),
    imageAlt: fields.text({ label: "Alt image" }),
    milestones: fields.array(
      fields.object({
        year: fields.text({ label: "Année" }),
        label: fields.text({ label: "Étape" }),
      }),
      { label: "Jalons", itemLabel: (props) => props.fields.year.value ?? "Jalon" }
    ),
  }, { label: "La Famille" }),

  statsBar: fields.array(
    fields.object({
      value: fields.text({ label: "Valeur" }),
      label: fields.text({ label: "Label" }),
    }),
    { label: "Barre de stats", itemLabel: (props) => props.fields.value.value ?? "Stat" }
  ),

  visitCta: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    titleHighlight: fields.text({ label: "Mot mis en valeur" }),
    body: fields.text({ label: "Corps", multiline: true }),
    image: fields.text({ label: "Image (chemin)" }),
    imageAlt: fields.text({ label: "Alt image" }),
    details: fields.array(fields.text({ label: "Détail" }), {
      label: "Détails pratiques",
      itemLabel: (props) => props.value ?? "Détail",
    }),
    primaryCta: fields.object(ctaFields, { label: "CTA principal" }),
    secondaryCta: fields.object(ctaFields, { label: "CTA secondaire" }),
  }, { label: "CTA Visites" }),

  wines: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    allLabel: fields.text({ label: "Libellé — voir tous" }),
    allHref: fields.text({ label: "Lien — voir tous" }),
    items: fields.array(
      fields.object({
        image: fields.text({ label: "Image (chemin)" }),
        alt: fields.text({ label: "Alt" }),
        meta: fields.text({ label: "Méta (appellation, millésime…)" }),
        title: fields.text({ label: "Titre" }),
        body: fields.text({ label: "Description", multiline: true }),
        price: fields.text({ label: "Prix" }),
        ctaLabel: fields.text({ label: "CTA — libellé" }),
        ctaHref: fields.text({ label: "CTA — lien" }),
      }),
      { label: "Vins", itemLabel: (props) => props.fields.title.value ?? "Vin" }
    ),
  }, { label: "Vins du domaine" }),

  contact: fields.object({
    eyebrow: fields.text({ label: "Eyebrow" }),
    title: fields.text({ label: "Titre" }),
    body: fields.text({ label: "Corps", multiline: true }),
    cards: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        value: fields.text({ label: "Valeur" }),
        href: fields.text({ label: "Lien" }),
      }),
      { label: "Cartes de contact", itemLabel: (props) => props.fields.label.value ?? "Contact" }
    ),
    cta: fields.object(ctaFields, { label: "CTA" }),
  }, { label: "Contact" }),
};

// ─── Helpers locales ───────────────────────────────────────────────────────

const LOCALES = [
  { suffix: "Fr", label: "FR", path: "fr" },
  { suffix: "En", label: "EN", path: "en" },
  { suffix: "Es", label: "ES", path: "es" },
] as const;

function makeLocaleSingletons(
  section: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any>
) {
  return Object.fromEntries(
    LOCALES.map(({ suffix, label, path }) => [
      `${section}${suffix}`,
      singleton({
        label: `${section.charAt(0).toUpperCase()}${section.slice(1)} (${label})`,
        path: `src/content/${section}/${path}`,
        format: { data: "yaml" as const },
        schema,
      }),
    ])
  );
}

// ─── Configuration Keystatic ───────────────────────────────────────────────

export default config({
  storage: { kind: "local" },

  ui: {
    brand: { name: "Périnade CMS" },
    navigation: {
      "Accueil": ["accueilFr", "accueilEn", "accueilEs"],
      "Domaine": ["domaineFr", "domaineEn", "domaineEs"],
    },
  },

  singletons: {
    ...makeLocaleSingletons("accueil", accueilSchema),
    ...makeLocaleSingletons("domaine", domaineSchema),
  },
});
