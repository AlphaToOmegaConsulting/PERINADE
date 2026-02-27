import type { DomainePageData } from "../types/domaine";
import experienceBg from "../assets/perinade/experience-bg.png";
import galleryTiger from "../assets/perinade/gallery-tiger.png";
import galleryVinesClose from "../assets/perinade/gallery-vines-close.png";
import heroGrapes from "../assets/perinade/visits/hero-grapes.jpg";
import step3 from "../assets/perinade/visits/step-3.jpg";
import step4 from "../assets/perinade/visits/step-4.jpg";
import wineBlanc from "../assets/perinade/wine-blanc.png";
import wineCuveeDomaine from "../assets/perinade/wine-cuvee-domaine.png";
import wineGrandeReserve from "../assets/perinade/wine-grande-reserve.png";

export const domainePage: DomainePageData = {
  theme: {
    sectionDesktop: "6.2rem",
    sectionTablet: "5rem",
    sectionMobile: "3.8rem"
  },
  seo: {
    title: "Le Domaine | Domaine de la Périnade",
    description:
      "Découvrez l'histoire du Domaine de la Périnade, son terroir, ses vins et les possibilités de visite au cœur du Minervois."
  },
  hero: {
    eyebrow: "Le Domaine",
    titleLines: ["Depuis 1830,", "le soin du terroir"],
    body:
      "Entre le Canal du Midi et le Fresquel, le Domaine de la Périnade perpétue six générations de viticulture sur 100 ha, dont 40 ha de vignes. Une histoire familiale ancrée dans le Minervois, relancée en 2019 avec exigence.",
    primaryCta: {
      label: "Réserver une visite du domaine",
      href: "TODO_LINK_BOOKING"
    },
    secondaryCta: {
      label: "Découvrir nos cuvées",
      href: "/boutique"
    },
    badges: ["Viticulture", "Terroir", "Transmission"],
    highlights: ["100 ha de domaine", "40 ha de vignes", "6 générations", "Minervois · Languedoc"],
    image: heroGrapes,
    imageAlt: "Portrait au domaine"
  },
  terroir: {
    eyebrow: "Terroir & Savoir-faire",
    title: "Un emplacement d'exception",
    body:
      "Le domaine s'étend entre le Canal du Midi et la rivière Fresquel, dans le périmètre de l'AOP Minervois. Cette situation géographique rare — entre eau et garrigue — façonne la minéralité et la fraîcheur de nos cuvées.",
    grapes: ["Grenache noir", "Cabernet Franc", "Cabernet Sauvignon", "Merlot"],
    commitments: [
      {
        title: "Démarche HVE",
        body: "Haute Valeur Environnementale — certification en cours."
      },
      {
        title: "Zéro glyphosate",
        body: "Arrêt total des herbicides ; désherbage mécanique entre les rangs."
      },
      {
        title: "Enherbement maîtrisé",
        body: "Gestion de l'enherbement pour préserver la vie des sols."
      }
    ],
    image: galleryVinesClose,
    imageAlt: "Vignes du domaine au lever du jour"
  },
  family: {
    eyebrow: "La famille",
    title: "La famille Arnal aujourd'hui",
    body: [
      "En 2019, les 6e et 7e générations de la famille Arnal reprennent le domaine avec la volonté de redonner tout son rayonnement à ce terroir historique.",
      "La création du chai en 2020, la restauration des caves et la sélection parcellaire ont marqué un nouveau départ. L'objectif reste inchangé: produire des vins justes, élégants et fidèles au lieu.",
      "Au domaine, l'héritage se vit au quotidien: précision dans la vigne, écoute du millésime, et hospitalité lors de chaque visite."
    ],
    milestones: [
      { year: "1830", label: "Fondation" },
      { year: "2019", label: "Relance" },
      { year: "2020", label: "1er chai" }
    ],
    image: galleryTiger,
    imageAlt: "Esprit de transmission du domaine"
  },
  statsBar: [
    { value: "100 ha", label: "Domaine total" },
    { value: "~40 ha", label: "De vignes" },
    { value: "6e & 7e", label: "Générations" },
    { value: "HVE", label: "Démarche en cours" },
    { value: "AOP", label: "Minervois" },
    { value: "365j", label: "Accueil visiteurs" }
  ],
  timeline: {
    eyebrow: "Héritage",
    title: "Deux siècles d'une même famille",
    rows: [
      {
        year: "1830",
        title: "Fondation",
        detail: "Premières parcelles cultivées par la famille, ancrage historique dans le Minervois."
      },
      {
        year: "1987",
        title: "Transmission",
        detail: "Nouvelle génération et structuration du domaine autour d'un projet viticole durable."
      },
      {
        year: "2019",
        title: "Relance du domaine",
        detail: "Réinvestissement global: vignes, chai et accueil œnotouristique."
      },
      {
        year: "2020",
        title: "Premier chai moderne",
        detail: "Mise en service d'un chai rénové pour accompagner la montée en qualité."
      }
    ],
    images: [
      {
        src: step3,
        alt: "Travail de précision au chai"
      },
      {
        src: step4,
        alt: "Moment de dégustation au domaine"
      }
    ]
  },
  visitCta: {
    eyebrow: "Visites du domaine",
    title: "Venez à la rencontre",
    titleHighlight: "du domaine",
    body:
      "Prenez rendez-vous pour visiter les vignes, découvrir le chai et déguster nos cuvées dans un cadre authentique.",
    details: ["Durée: 1h30", "Sur réservation", "Accueil FR / EN", "Groupes privés sur demande"],
    primaryCta: {
      label: "Réserver une visite du domaine",
      href: "TODO_LINK_BOOKING"
    },
    secondaryCta: {
      label: "Nous contacter",
      href: "#domaine-contact"
    },
    image: experienceBg,
    imageAlt: "Bouteilles du domaine en cave"
  },
  wines: {
    eyebrow: "Nos vins",
    title: "Les vins du domaine",
    allLabel: "Voir toute la boutique",
    allHref: "/boutique",
    items: [
      {
        image: wineCuveeDomaine,
        alt: "Cuvée du Domaine",
        meta: "AOP Minervois · 2022 · 75 cl",
        title: "Cuvée du Domaine",
        body: "Fruits noirs, garrigue et épices douces. Bouche soyeuse et finale élégante.",
        price: "12,50 € TTC",
        ctaLabel: "Voir",
        ctaHref: "/boutique"
      },
      {
        image: wineBlanc,
        alt: "Blanc de Périnade",
        meta: "IGP Pays d'Oc · 2023 · 75 cl",
        title: "Blanc de Périnade",
        body: "Agrumes et fleurs blanches. Une cuvée fraîche, précise et minérale.",
        price: "10,00 € TTC",
        ctaLabel: "Voir",
        ctaHref: "/boutique"
      },
      {
        image: wineGrandeReserve,
        alt: "Grande Réserve",
        meta: "AOP Minervois · 2020 · 75 cl",
        title: "Grande Réserve",
        body: "Élevé en fûts, puissant et complexe, avec des tanins fondus.",
        price: "22,00 € TTC",
        ctaLabel: "Voir",
        ctaHref: "/boutique"
      }
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Une question sur le domaine ?",
    body:
      "L'équipe répond sous 24h. Vous pouvez aussi nous appeler directement pendant les heures d'ouverture du domaine.",
    cards: [
      { label: "Téléphone", value: "+33 4 68 XX XX XX", href: "tel:+33468XXXXXX" },
      {
        label: "Adresse",
        value: "Domaine de la Périnade · Minervois, Languedoc",
        href: "https://maps.google.com/?q=Domaine+de+la+P%C3%A9rinade+Minervois+Languedoc"
      },
      { label: "Formulaire", value: "Via notre page contact", href: "#domaine-contact" }
    ],
    cta: {
      label: "Nous contacter",
      href: "#domaine-contact"
    }
  }
};
