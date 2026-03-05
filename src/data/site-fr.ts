import type { SiteData } from "../types/site";
import { contactInfo } from "../i18n/contact";
import experienceBg from "../assets/perinade/experience-bg.png";
import galleryCellar from "../assets/perinade/gallery-cellar.png";
import galleryVinesClose from "../assets/perinade/gallery-vines-close.png";
import heroDeckBaladeVignes from "../assets/perinade/hero-deck/balade-vignes.png";
import heroDeckCuveesException from "../assets/perinade/hero-deck/cuvees-exception.png";
import heroDeckVisiteCaveau from "../assets/perinade/hero-deck/visite-caveau.png";
import heroVineyard from "../assets/perinade/hero-vineyard.png";
import historyFamily from "../assets/perinade/history-family.png";
import wineBlanc from "../assets/perinade/wine-blanc.png";
import wineCuveeDomaine from "../assets/perinade/wine-cuvee-domaine.png";
import wineGrandeReserve from "../assets/perinade/wine-grande-reserve.png";
import wineRose from "../assets/perinade/wine-rose.png";

export const siteFr: SiteData = {
  nav: [
    { label: "Accueil", href: "/", mobile: false },
    { label: "Visites", href: "/visites", desktopSlot: "left", desktopLabel: "VISITES" },
    { label: "Boutique", href: "/boutique", desktopSlot: "left", desktopLabel: "BOUTIQUE" },
    { label: "Le Domaine", href: "/domaine", desktopSlot: "left", desktopLabel: "DOMAINE" },
    { label: "Actualités", href: "/actualites", desktopSlot: "right", desktopLabel: "ACTUALITÉS" },
    { label: "Contact", href: "/#contact" }
  ],
  mobileQuickActions: [
    { id: "book", label: "Réserver", href: "/visites#booking", icon: "calendar", priority: "primary" },
    { id: "shop", label: "Boutique", href: "/boutique", icon: "bag", priority: "secondary" },
    { id: "call", label: "Appeler", href: contactInfo.phoneTel, icon: "phone", priority: "secondary" }
  ],
  hero: {
    eyebrow: "Près de Carcassonne",
    title: ["Domaine", "de la", "Périnade"],
    body: "Au cœur du Languedoc, notre domaine familial vous ouvre ses portes pour une parenthèse authentique entre vignes, caveau et dégustation. Découvrez des cuvées de caractère, façonnées avec passion et respect du terroir.",
    ctaLabel: "Réserver une visite",
    ctaHref: "/visites#booking",
    meta: ["Sur rendez-vous", "Domaine familial", "Depuis 1830"],
    backgroundImage: heroVineyard,
    featuredCards: [
      {
        kicker: "Dégustation",
        title: "Visite du Caveau",
        image: heroDeckVisiteCaveau,
        alt: "Bouteilles et caveau du domaine",
        href: "#experience"
      },
      {
        kicker: "Terroir",
        title: "Balade dans les Vignes",
        image: heroDeckBaladeVignes,
        alt: "Vue des vignes du domaine",
        href: "#histoire"
      },
      {
        kicker: "Boutique",
        title: "Nos Cuvées d'Exception",
        image: heroDeckCuveesException,
        alt: "Sélection de bouteilles du domaine",
        href: "/boutique"
      }
    ]
  },
  reasons: {
    eyebrow: "Pourquoi nous visiter",
    title: "Trois raisons de venir",
    items: [
      {
        title: "Un domaine familial",
        body: "Depuis six générations, notre famille cultive avec passion un vignoble à taille humaine.",
        icon: "leaf"
      },
      {
        title: "Un terroir d'exception",
        body: "Niché entre garrigue et collines, notre vignoble bénéficie d'un microclimat unique.",
        icon: "terrain"
      },
      {
        title: "Une dégustation intime",
        body: "Pas de visite de masse ici. Nous vous accueillons personnellement dans un cadre chaleureux.",
        icon: "glass"
      }
    ]
  },
  experience: {
    eyebrow: "Visite",
    title: "Vivez l'expérience Périnade",
    body: "Une visite guidée du domaine suivie d'une dégustation commentée de nos cuvées, dans un cadre authentique et chaleureux.",
    details: [
      { label: "Durée", value: "1h30 environ", icon: "clock" },
      { label: "Groupe", value: "2 à 12 personnes", icon: "users" },
      { label: "Langues", value: "Français, anglais, espagnol", icon: "globe" },
      { label: "Lieu", value: "Près de Carcassonne", icon: "pin" },
      { label: "Tarif", value: "15 € / personne", icon: "ticket" }
    ],
    infoLine: "Sur rendez-vous uniquement · Parking gratuit · Accès facile depuis Carcassonne",
    ctaLabel: "Réserver une visite",
    ctaHref: "/visites#booking",
    backgroundImage: experienceBg
  },
  gallery: {
    eyebrow: "Notre univers",
    title: "Galerie du Domaine",
    items: [
      { src: heroVineyard, alt: "Vue du vignoble au coucher du soleil" },
      { src: galleryCellar, alt: "Caveau et dégustation" },
      { src: galleryVinesClose, alt: "Détail d'une vigne du domaine" }
    ]
  },
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ce qu'ils en disent",
    pressLabel: "Vu dans",
    pressLogos: ["Collège Culinaire de France", "Concours des Vignerons Indépendants", "TripAdvisor Travelers' Choice", "Club Lavender"],
    items: [
      {
        quote: "Un accueil exceptionnel dans un cadre magnifique. La dégustation était passionnante et les vins délicieux. Nous reviendrons !",
        author: "Marie & Jean-Pierre",
        meta: "Toulouse",
        rating: 5
      },
      {
        quote: "Un joyau caché près de Carcassonne. La famille a été incroyablement accueillante et les vins remarquables. Une visite incontournable.",
        author: "Sarah T.",
        meta: "London, UK",
        rating: 5
      },
      {
        quote: "On ressent immédiatement la passion et le savoir-faire familial. Les vins sont sincères et le domaine est superbe. Coup de cœur.",
        author: "Philippe D.",
        meta: "Paris",
        rating: 5
      }
    ]
  },
  history: {
    eyebrow: "Notre histoire",
    title: "Six générations de",
    titleHighlight: "passion",
    body: [
      "Fondé vers 1830 par Hippolyte Arnal, le Domaine de la Périnade est une aventure familiale née de l'amour du terroir languedocien. Sur ces terres baignées de soleil, entre garrigue et collines, nous cultivons nos vignes dans le respect des traditions et avec une attention particulière portée à l'environnement.",
      "Aujourd'hui, les 6e et 7e générations perpétuent ce savoir-faire, alliant méthodes ancestrales et innovations comme l'injection d'azote liquide à la mise en bouteille pour préserver chaque cuvée."
    ],
    imagePrimary: historyFamily,
    ctaLabel: "Découvrir l'histoire complète",
    ctaHref: "/domaine"
  },
  wines: {
    eyebrow: "Nos vins",
    title: "Cuvées sélectionnées",
    allWinesLabel: "Voir toute la boutique",
    allWinesHref: "/boutique",
    items: [
      {
        image: wineCuveeDomaine,
        title: "Cuvée du Domaine",
        subtitle: "Rouge · AOP Minervois",
        description: "Un rouge soyeux aux notes de fruits noirs, de garrigue et d'épices douces, élevé pour accompagner les belles tables.",
        ctaLabel: "Voir le vin",
        ctaHref: "/boutique"
      },
      {
        image: wineBlanc,
        title: "Blanc de Périnade",
        subtitle: "Blanc · IGP Pays d'Oc",
        description: "Une cuvée fraîche et florale, portée par les agrumes, la tension minérale et une finale nette.",
        ctaLabel: "Voir le vin",
        ctaHref: "/boutique"
      },
      {
        image: wineRose,
        title: "Rosé d'Été",
        subtitle: "Rosé · IGP Pays d'Oc",
        description: "Un rosé lumineux aux accents de pêche blanche et de fraise, pensé pour les repas d'été et l'apéritif.",
        ctaLabel: "Voir le vin",
        ctaHref: "/boutique"
      },
      {
        image: wineGrandeReserve,
        title: "Grande Réserve",
        subtitle: "Rouge · AOP Minervois",
        description: "Une cuvée de caractère élevée en fût, ample et persistante, avec des tanins fondus et une matière profonde.",
        ctaLabel: "Voir le vin",
        ctaHref: "/boutique"
      }
    ]
  },
  contact: {
    eyebrow: "Contactez-nous",
    titleHtml: "Parlons de votre prochaine visite",
    body: "Vous souhaitez réserver une visite, passer commande ou simplement en savoir plus sur nos vins ? N'hésitez pas à nous contacter.",
    info: [
      { label: "Téléphone", value: contactInfo.phone, icon: "phone" },
      { label: "E-mail", value: contactInfo.email, icon: "mail" },
      { label: "Site", value: contactInfo.website, icon: "globe" },
      { label: "Adresse", value: "Près de Carcassonne, Aude (11)", icon: "pin" }
    ],
    labels: {
      firstName: "Prénom *",
      lastName: "Nom *",
      email: "E-mail *",
      phone: "Téléphone *",
      subject: "Sujet *",
      message: "Message *",
      submit: "Envoyer le message"
    },
    validation: {
      required: "Ce champ est requis.",
      invalidEmail: "Merci de saisir une adresse e-mail valide.",
      fixErrors: "Veuillez corriger les champs en erreur."
    },
    mail: {
      defaultSubject: "Demande de contact",
      fieldFirstName: "Prénom",
      fieldLastName: "Nom",
      fieldEmail: "E-mail",
      fieldPhone: "Téléphone",
      fieldMessage: "Message"
    },
    formAction: `mailto:${contactInfo.email}`,
    formSuccessMessage: "Message prêt. Merci de vérifier votre brouillon d’e-mail avant envoi.",
    formErrorMessage: `Impossible de préparer le message. Merci de nous appeler au ${contactInfo.phone}.`
  },
  footer: {
    brandTitle: "Périnade",
    about: "Domaine familial près de Carcassonne. Vins authentiques du Languedoc depuis 1830.",
    groups: [
      {
        title: "Navigation",
        links: [
          { label: "Accueil", href: "/" },
          { label: "Visites", href: "/visites" },
          { label: "Boutique", href: "/boutique" },
          { label: "Le Domaine", href: "/domaine" },
          { label: "Actualités", href: "/#contact" },
          { label: "Contact", href: "/#contact" }
        ]
      },
      {
        title: "Informations",
        links: [
          { label: "Mentions légales", href: "/#contact" },
          { label: "Politique de confidentialité", href: "/#contact" },
          { label: "Conditions de vente", href: "/#contact" },
          { label: "Presse", href: "/#contact" }
        ]
      }
    ],
    newsletterTitle: "Newsletter",
    newsletterBody: "Recevez nos actualités et offres exclusives.",
    newsletterPlaceholder: "votre@email.fr",
    newsletterAction: `mailto:${contactInfo.email}`,
    social: [
      { label: "Instagram", href: contactInfo.instagram },
      { label: "Facebook", href: contactInfo.facebook }
    ],
    copyright: "© 2026 Domaine de la Périnade. Tous droits réservés.",
    legalLine: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération."
  }
};
