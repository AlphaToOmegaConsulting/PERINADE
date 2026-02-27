import type { DomainePageData } from "../types/domaine";
import familyImg from "../assets/perinade/domaine/family.jpg";
import heroImg from "../assets/perinade/domaine/hero.jpg";
import terroirImg from "../assets/perinade/domaine/terroir.jpg";
import timelineLeftImg from "../assets/perinade/domaine/timeline-left.jpg";
import timelineRightImg from "../assets/perinade/domaine/timeline-right.jpg";
import visitCtaImg from "../assets/perinade/domaine/visit-cta.jpg";
import wine1Img from "../assets/perinade/domaine/wine-1.jpg";
import wine2Img from "../assets/perinade/domaine/wine-2.jpg";
import wine3Img from "../assets/perinade/domaine/wine-3.jpg";

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
      href: "/visites#booking"
    },
    secondaryCta: {
      label: "Découvrir nos cuvées",
      href: "/boutique"
    },
    badges: ["Viticulture", "Terroir", "Transmission"],
    highlights: ["100 ha de domaine", "40 ha de vignes", "6 générations", "Minervois · Languedoc"],
    image: heroImg,
    imageAlt: "Personne consultant son téléphone au crépuscule dans le domaine"
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
    image: terroirImg,
    imageAlt: "Paysage de montagnes au lever du soleil"
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
    image: familyImg,
    imageAlt: "Inscription Dream Big sur fond sombre"
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
    eyebrow: "Histoire",
    title: "Deux siècles d'une même famille",
    defaultTabId: "2021",
    tabs: [
      {
        id: "1830",
        year: "1830",
        tabLabel: "~1830",
        title: "Fondation",
        detail: "Premières parcelles cultivées au cœur du Minervois, naissance du domaine familial.",
        images: [
          { src: timelineLeftImg, alt: "Travail artisanal de précision" },
          { src: timelineRightImg, alt: "Moment de dégustation conviviale" }
        ]
      },
      {
        id: "2019",
        year: "2019",
        tabLabel: "2019",
        title: "Transmission",
        detail:
          "La 6e et 7e génération reprend le domaine avec une vision orientée qualité, terroir et expérience visiteur.",
        images: [
          { src: timelineRightImg, alt: "Verres de vin en dégustation" },
          { src: timelineLeftImg, alt: "Travail de cave et vinification" }
        ]
      },
      {
        id: "2020",
        year: "2020",
        tabLabel: "2020",
        title: "Relance du domaine",
        detail: "Réinvestissement global: vignes, chai modernisé et structuration de l'accueil œnotouristique.",
        images: [
          { src: visitCtaImg, alt: "Alignement de bouteilles dans la cave" },
          { src: terroirImg, alt: "Panorama du terroir du domaine" }
        ]
      },
      {
        id: "2021",
        year: "2021",
        tabLabel: "2021",
        title: "Résilience",
        detail:
          "Année difficile marquée par le Covid et le gel. Le domaine consolide ses débouchés en restauration gastronomique et affine sa proposition premium.",
        images: [
          { src: timelineLeftImg, alt: "Outil de cave en action" },
          { src: timelineRightImg, alt: "Partage autour du vin" }
        ]
      },
      {
        id: "2022",
        year: "2022",
        tabLabel: "2022",
        title: "Montée en gamme",
        detail:
          "Sélection parcellaire renforcée, affinage des cuvées et montée en exigence sur les circuits cavistes et restauration.",
        images: [
          { src: wine2Img, alt: "Bouteille du domaine en présentation" },
          { src: wine3Img, alt: "Collection de bouteilles en cave" }
        ]
      },
      {
        id: "2023",
        year: "2023",
        tabLabel: "2023",
        title: "Rayonnement œnotouristique",
        detail:
          "Déploiement des visites privées et dégustations signatures pour relier histoire familiale et expérience client.",
        images: [
          { src: wine1Img, alt: "Cuvée du domaine en gros plan" },
          { src: visitCtaImg, alt: "Rangée de bouteilles au caveau" }
        ]
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
      href: "/visites#booking"
    },
    secondaryCta: {
      label: "Nous contacter",
      href: "#domaine-contact"
    },
    image: visitCtaImg,
    imageAlt: "Bouteilles alignées en cave"
  },
  wines: {
    eyebrow: "Nos vins",
    title: "Les vins du domaine",
    allLabel: "Voir toute la boutique",
    allHref: "/boutique",
    items: [
      {
        image: wine1Img,
        alt: "Cuvée du Domaine",
        meta: "AOP Minervois · 2022 · 75 cl",
        title: "Cuvée du Domaine",
        body: "Fruits noirs, garrigue et épices douces. Bouche soyeuse et finale élégante.",
        price: "12,50 € TTC",
        ctaLabel: "Voir",
        ctaHref: "/boutique"
      },
      {
        image: wine2Img,
        alt: "Blanc de Périnade",
        meta: "IGP Pays d'Oc · 2023 · 75 cl",
        title: "Blanc de Périnade",
        body: "Agrumes et fleurs blanches. Une cuvée fraîche, précise et minérale.",
        price: "10,00 € TTC",
        ctaLabel: "Voir",
        ctaHref: "/boutique"
      },
      {
        image: wine3Img,
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
