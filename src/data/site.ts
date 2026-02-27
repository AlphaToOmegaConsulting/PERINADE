import type { SiteData } from "../types/site";

export const site: SiteData = {
  nav: [
    { label: "Accueil", href: "#hero" },
    { label: "Visite", href: "#experience" },
    { label: "Boutique", href: "TODO_LINK_SHOP" },
    { label: "Le Domaine", href: "#histoire" },
    { label: "Contact", href: "#contact" }
  ],
  hero: {
    eyebrow: "Près de Carcassonne",
    title: ["Domaine", "de la", "Périnade"],
    body:
      "Un domaine familial d'exception, niché au cœur du Languedoc. Venez découvrir nos vins, notre terroir et notre histoire lors d'une visite personnalisée.",
    ctaLabel: "Visiter Boutique",
    ctaHref: "TODO_LINK_SHOP",
    meta: ["Sur rendez-vous", "Domaine familial", "Depuis 1987"],
    backgroundImage: "/assets/perinade/hero-vineyard.png",
    featuredCards: [
      {
        kicker: "Dégustation",
        title: "Visite du Caveau",
        image: "/assets/perinade/hero-deck/visite-caveau.png",
        alt: "Bouteilles et caveau du domaine",
        href: "#experience"
      },
      {
        kicker: "Terroir",
        title: "Balade dans les Vignes",
        image: "/assets/perinade/hero-deck/balade-vignes.png",
        alt: "Vue des vignes du domaine",
        href: "#histoire"
      },
      {
        kicker: "Boutique",
        title: "Nos Cuvées d'Exception",
        image: "/assets/perinade/hero-deck/cuvees-exception.png",
        alt: "Sélection de bouteilles du domaine",
        href: "TODO_LINK_SHOP"
      }
    ]
  },
  reasons: [
    {
      title: "Un domaine familial",
      body: "Depuis trois générations, notre famille cultive avec passion un vignoble à taille humaine.",
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
  ],
  experience: {
    eyebrow: "Visite",
    title: "Vivez l'expérience Périnade",
    body:
      "Une visite guidée du domaine suivie d'une dégustation commentée de nos cuvées, dans un cadre authentique et chaleureux.",
    details: [
      { label: "Durée", value: "1h30 environ", icon: "clock" },
      { label: "Groupe", value: "2 à 10 personnes", icon: "users" },
      { label: "Langues", value: "Français, English", icon: "globe" },
      { label: "Lieu", value: "Près de Carcassonne", icon: "pin" },
      { label: "Tarif", value: "15 € / personne", icon: "ticket" }
    ],
    ctaLabel: "Réserver une visite",
    ctaHref: "TODO_LINK_BOOKING",
    backgroundImage: "/assets/perinade/experience-bg.png"
  },
  gallery: {
    eyebrow: "Notre univers",
    title: "Galerie du Domaine",
    items: [
      { src: "/assets/perinade/hero-vineyard.png", alt: "Vue du vignoble au coucher du soleil" },
      { src: "/assets/perinade/gallery-cellar.png", alt: "Caveau et dégustation" },
      { src: "/assets/perinade/gallery-vines-close.png", alt: "Détail d'une vigne du domaine" }
    ]
  },
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ce qu'ils en disent",
    pressLabel: "Vu dans",
    pressLogos: ["Le Figaro Vin", "Revue du Vin", "Decanter", "Wine Spectator"],
    items: [
      {
        quote:
          "Un accueil exceptionnel dans un cadre magnifique. La dégustation était passionnante et les vins délicieux. Nous reviendrons !",
        author: "Marie & Jean-Pierre",
        meta: "Toulouse",
        rating: 5
      },
      {
        quote:
          "A hidden gem near Carcassonne. The family was incredibly welcoming and the wines were outstanding. A must-visit experience.",
        author: "Sarah T.",
        meta: "London, UK",
        rating: 5
      },
      {
        quote:
          "On ressent immédiatement la passion et le savoir-faire familial. Les vins sont sincères et le domaine est superbe. Coup de cœur.",
        author: "Philippe D.",
        meta: "Paris",
        rating: 5
      }
    ]
  },
  history: {
    eyebrow: "Notre histoire",
    title: "Trois générations de",
    titleHighlight: "passion",
    body: [
      "Fondé en 1987, le Domaine de la Périnade est une aventure familiale née de l'amour du terroir languedocien. Sur ces terres baignées de soleil, entre garrigue et collines, nous cultivons nos vignes avec le respect des traditions et une attention particulière portée à l'environnement.",
      "Aujourd'hui, c'est la troisième génération qui perpétue ce savoir-faire, alliant méthodes ancestrales et vinification moderne pour produire des vins qui expriment la singularité de notre terroir."
    ],
    imagePrimary: "/assets/perinade/history-family.png",
    ctaLabel: "Découvrir l'histoire complète",
    ctaHref: "#contact"
  },
  wines: {
    eyebrow: "Nos vins",
    title: "Cuvées sélectionnées",
    allWinesLabel: "Voir toute la boutique",
    allWinesHref: "TODO_LINK_SHOP",
    items: [
      {
        image: "/assets/perinade/wine-cuvee-domaine.png",
        title: "Cuvée du Domaine",
        subtitle: "Rouge · AOP Minervois",
        description:
          "Un rouge soyeux aux notes de fruits noirs, de garrigue et d'épices douces, élevé pour accompagner les belles tables.",
        ctaLabel: "Voir le vin",
        ctaHref: "TODO_LINK_SHOP"
      },
      {
        image: "/assets/perinade/wine-blanc.png",
        title: "Blanc de Périnade",
        subtitle: "Blanc · IGP Pays d'Oc",
        description:
          "Une cuvée fraîche et florale, portée par les agrumes, la tension minérale et une finale nette.",
        ctaLabel: "Voir le vin",
        ctaHref: "TODO_LINK_SHOP"
      },
      {
        image: "/assets/perinade/wine-rose.png",
        title: "Rosé d'Été",
        subtitle: "Rosé · IGP Pays d'Oc",
        description:
          "Un rosé lumineux aux accents de pêche blanche et de fraise, pensé pour les repas d'été et l'apéritif.",
        ctaLabel: "Voir le vin",
        ctaHref: "TODO_LINK_SHOP"
      },
      {
        image: "/assets/perinade/wine-grande-reserve.png",
        title: "Grande Réserve",
        subtitle: "Rouge · AOP Minervois",
        description:
          "Une cuvée de caractère élevée en fût, ample et persistante, avec des tanins fondus et une matière profonde.",
        ctaLabel: "Voir le vin",
        ctaHref: "TODO_LINK_SHOP"
      }
    ]
  },
  contact: {
    eyebrow: "Contactez-nous",
    titleHtml: "Parlons de <span>votre</span><br />prochaine visite",
    body:
      "Vous souhaitez réserver une visite, passer commande ou simplement en savoir plus sur nos vins ? N'hésitez pas à nous contacter.",
    info: [
      { label: "Téléphone", value: "+33 4 68 XX XX XX", icon: "phone" },
      { label: "Email", value: "contact@perinade.fr", icon: "mail" },
      { label: "Site", value: "www.perinade.fr", icon: "globe" },
      { label: "Adresse", value: "Près de Carcassonne, Aude (11)", icon: "pin" }
    ],
    formAction: "TODO_FORM_ENDPOINT"
  },
  footer: {
    brandTitle: "Périnade",
    about:
      "Domaine familial près de Carcassonne. Vins authentiques du Languedoc depuis 1987.",
    groups: [
      {
        title: "Navigation",
        links: [
          { label: "Accueil", href: "#hero" },
          { label: "Visite", href: "#experience" },
          { label: "Boutique", href: "TODO_LINK_SHOP" },
          { label: "Le Domaine", href: "#histoire" },
          { label: "Contact", href: "#contact" }
        ]
      },
      {
        title: "Informations",
        links: [
          { label: "Mentions légales", href: "TODO_LINK_LEGAL" },
          { label: "Politique de confidentialité", href: "TODO_LINK_PRIVACY" },
          { label: "Conditions de vente", href: "TODO_LINK_TERMS" },
          { label: "Presse", href: "TODO_LINK_PRESS" }
        ]
      }
    ],
    newsletterTitle: "Newsletter",
    newsletterBody: "Recevez nos actualités et offres exclusives.",
    newsletterPlaceholder: "votre@email.fr",
    newsletterAction: "TODO_NEWSLETTER_ENDPOINT",
    social: [
      { label: "Instagram", href: "TODO_LINK_INSTAGRAM" },
      { label: "Facebook", href: "TODO_LINK_FACEBOOK" }
    ],
    copyright: "© 2026 Domaine de la Périnade. Tous droits réservés.",
    legalLine: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération."
  }
};
