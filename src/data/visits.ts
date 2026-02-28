import type { VisitPageData } from "../types/visits";
import { CONTACT_INFO } from "./site";
import visitsExtendedPool from "../assets/perinade/visits/extended-pool.jpg";
import visitsFinalCtaBg from "../assets/perinade/visits/final-cta-bg.jpg";
import visitsHeroGrapes from "../assets/perinade/visits/hero-grapes.jpg";
import visitsPairingBoard from "../assets/perinade/visits/pairing-board.jpg";
import visitsStep1 from "../assets/perinade/visits/step-1.jpg";
import visitsStep2 from "../assets/perinade/visits/step-2.jpg";
import visitsStep3 from "../assets/perinade/visits/step-3.jpg";
import visitsStep4 from "../assets/perinade/visits/step-4.jpg";
import visitsWineRedCard from "../assets/perinade/visits/wine-red-card.jpg";
import visitsWineRoseCard from "../assets/perinade/visits/wine-rose-card.jpg";
import visitsWineWhiteCard from "../assets/perinade/visits/wine-white-card.jpg";

export const visitsPage: VisitPageData = {
  theme: {
    accent: {
      primary: "#cc8a2f",
      soft: "#f3e5d2",
      onDark: "#e4a24c"
    },
    radius: {
      sm: "0.85rem",
      md: "1.05rem",
      lg: "1.35rem",
      xl: "1.75rem"
    },
    spacing: {
      sectionDesktop: "6.35rem",
      sectionTablet: "5.2rem",
      sectionMobile: "3.95rem"
    },
    typography: {
      eyebrow: {
        fontSize: "0.74rem",
        lineHeight: "1.35",
        letterSpacing: "0.24em",
        fontWeight: 500
      },
      titleDisplay: {
        fontSize: "clamp(2.72rem, 4.75vw, 4.45rem)",
        lineHeight: "1.02",
        letterSpacing: "-0.02em",
        fontWeight: 500
      },
      titleSection: {
        fontSize: "clamp(2.15rem, 3.1vw, 3.02rem)",
        lineHeight: "1.08",
        letterSpacing: "-0.02em",
        fontWeight: 500
      },
      body: {
        fontSize: "1.01rem",
        lineHeight: "1.64",
        letterSpacing: "0",
        fontWeight: 400
      },
      caption: {
        fontSize: "0.83rem",
        lineHeight: "1.45",
        letterSpacing: "0.08em",
        fontWeight: 500
      }
    },
    stroke: {
      subtle: "rgba(44, 44, 44, 0.1)",
      strong: "rgba(44, 44, 44, 0.2)"
    }
  },
  seo: {
    title: "Visites & Dégustations | Domaine de la Périnade",
    description:
      "Réservez votre visite du domaine : promenade dans les vignes, découverte du chai, dégustation commentée et options gourmandes."
  },
  hero: {
    eyebrow: "Visites & Dégustations",
    titleLines: ["Découvrez le Languedoc", "verre en main"],
    body:
      "Une immersion guidée par le vigneron : promenade dans les vignes, visite du chai et dégustation de 5 cuvées dans un cadre familial d'exception.",
    badges: [
      { icon: "clock", label: "1h30" },
      { icon: "ticket", label: "À partir de 15 €" },
      { icon: "globe", label: "FR / EN" },
      { icon: "calendar", label: "11h – 16h, tous les jours" },
      { icon: "car", label: "Parking gratuit" }
    ],
    primaryCta: { label: "Reserver", href: "/visites#booking" },
    secondaryCta: { label: "Appeler", href: CONTACT_INFO.phoneTel },
    helper: `${CONTACT_INFO.phone} · Réponse sous 24h`,
    image: visitsHeroGrapes,
    imageAlt: "Raisins fraîchement récoltés dans une cuve"
  },
  trustBar: [
    "4.9/5 based on 127 reviews",
    "Languedoc Wine Tourism Excellence",
    "Guided by the winemaker"
  ],
  timeline: {
    eyebrow: "Votre parcours",
    title: "L'expérience pas à pas",
    body: "1h30 d'immersion totale dans l'univers du vin, guidé par notre vigneron.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Accueil par le vigneron",
        body: "Rencontre chaleureuse au cœur du domaine. Le vigneron vous présente l'histoire de la famille et la philosophie de la maison.",
        image: visitsStep1,
        imageAlt: "Raisins dans une cuve, première étape de la visite",
        layout: {
          mediaRatio: "568/366",
          mediaMaxWidth: "30rem",
          contentMaxWidth: "24rem",
          align: "center"
        }
      },
      {
        id: "step-2",
        number: "02",
        title: "Promenade dans les vignes",
        body: "Découverte du terroir languedocien, des cépages et des méthodes de culture. Une immersion entre garrigue et collines ensoleillées.",
        image: visitsStep2,
        imageAlt: "Chemin de vigne et végétation du domaine",
        layout: {
          mediaRatio: "568/420",
          mediaMaxWidth: "21rem",
          contentMaxWidth: "25rem",
          align: "start"
        }
      },
      {
        id: "step-3",
        number: "03",
        title: "Visite du chai & vinification",
        body: "Explication des techniques de vinification, de la vendange aux fûts de chêne. Comprenez le processus qui donne vie à nos cuvées.",
        image: visitsStep3,
        imageAlt: "Intérieur du chai avec barriques",
        layout: {
          mediaRatio: "568/420",
          mediaMaxWidth: "21rem",
          contentMaxWidth: "24rem",
          align: "start"
        }
      },
      {
        id: "step-4",
        number: "04",
        title: "Dégustation commentée",
        body: "Savourez 5 vins sélectionnés — 1 rosé, 3 blancs et 1 rouge — avec les commentaires passionnés du vigneron.",
        image: visitsStep4,
        imageAlt: "Verres de dégustation en fin de visite",
        layout: {
          mediaRatio: "568/368",
          mediaMaxWidth: "21rem",
          contentMaxWidth: "25rem",
          align: "center"
        }
      }
    ]
  },
  wines: {
    eyebrow: "La dégustation",
    title: "5 cuvées à découvrir",
    body: "1 rosé, 3 blancs et 1 rouge — une sélection commentée par le vigneron.",
    cards: [
      {
        id: "wine-rose",
        tag: "1 ROSÉ",
        tagTone: "rose",
        title: "Rosé d'Été",
        notes: ["Pêche, fraise", "Bouche vive et gourmande"],
        image: visitsWineRoseCard,
        imageAlt: "Bouteilles et notes rosées"
      },
      {
        id: "wine-white",
        tag: "3 BLANC",
        tagTone: "white",
        title: "Blancs de Périnade",
        notes: ["Agrumes, fleurs blanches", "Fraîcheur minérale"],
        image: visitsWineWhiteCard,
        imageAlt: "Bouteille de vin blanc du domaine"
      },
      {
        id: "wine-red",
        tag: "1 ROUGE",
        tagTone: "red",
        title: "Grande Réserve",
        notes: ["Fruits noirs, garrigue", "Tanins fondus, finale longue"],
        image: visitsWineRedCard,
        imageAlt: "Sélection de vins rouges en cave"
      }
    ]
  },
  pairing: {
    image: visitsPairingBoard,
    imageAlt: "Planche fromages et accompagnements",
    eyebrow: "Option disponible",
    title: ["Planche fromages", "& charcuterie"],
    body:
      "Prolongez l'expérience avec une sélection de fromages affinés et de charcuterie artisanale de la région, idéalement assortis à nos cuvées. Parfait pour transformer votre dégustation en un moment convivial.",
    bullets: [
      "Fromages affinés locaux",
      "Charcuterie artisanale du Languedoc",
      "Pain de campagne & condiments maison"
    ],
    note: "Ajoutez cette option lors de votre réservation en ligne."
  },
  pricing: {
    eyebrow: "Visit Options",
    title: "Choose Your Format",
    body: "Flexible formats, including private and large groups on request.",
    layout: {
      containerMaxWidth: "50rem",
      cardMinHeight: "22rem",
      cardPadding: "1.45rem",
      titleSize: "1.7rem",
      priceSize: "2.2rem"
    },
    plans: [
      {
        title: "Standard Visit",
        subtitle: "The essential experience",
        price: "15€",
        perLabel: "/ person",
        features: [
          "1h30 guided visit",
          "Walk through the vines",
          "Cellar tour & winery",
          "Tasting of 5 estate wines",
          "Commentary by the winemaker",
          "French & English available"
        ],
        ctaLabel: "Reserver",
        ctaHref: "/visites#booking"
      },
      {
        title: "Gourmet Visit",
        subtitle: "Visit + food pairing",
        price: "25€",
        perLabel: "/ person",
        features: [
          "Everything in Standard",
          "Cheese & charcuterie board",
          "Local artisan selection",
          "Extended tasting time",
          "Perfect for couples & groups",
          "Available daily"
        ],
        ctaLabel: "Reserver",
        ctaHref: "/visites#booking",
        isHighlighted: true,
        badge: "Popular"
      }
    ],
    meta: [
      "Available daily, 11:00 – 16:00",
      "Private groups on request",
      "Premium experience, fair pricing"
    ]
  },
  access: {
    eyebrow: "Easy to Reach",
    title: "Easy to Reach",
    body: "Accessible depuis Carcassonne, avec un accueil simple pour les visites en duo, en famille ou en groupe.",
    leftCard: {
      icon: "pin",
      tag: "Adresse",
      title: "Carcassonne",
      subtitle: "Aude, Occitanie",
      content: ["Domaine de la Périnade", "Coordonnées GPS partagées après réservation", "Parking visiteur gratuit"],
      ctaLabel: "Voir sur la carte",
      ctaHref: "https://maps.google.com/?q=Domaine+de+la+Perinade+Minervois+Languedoc"
    },
    rightCards: [
      {
        icon: "car",
        tag: "Le plus pratique",
        title: "By car",
        subtitle: "Most convenient",
        content: ["15 min depuis Carcassonne", "Accès direct et parking sur place"]
      },
      {
        icon: "plane",
        tag: "Aéroport",
        title: "From airport",
        subtitle: "Carcassonne Airport",
        content: ["20 min en voiture", "Taxis et VTC disponibles"]
      },
      {
        icon: "train",
        tag: "Train + transfert",
        title: "Train + transfer",
        subtitle: "Gare de Carcassonne",
        content: ["25 min avec transfert", "Idéal pour séjour œnotourisme"]
      }
    ]
  },
  escape: {
    image: visitsExtendedPool,
    imageAlt: "Piscine et cyprès au domaine",
    layout: {
      backgroundImage: visitsExtendedPool,
      overlayOpacity: 0.72,
      imagePanelRadius: "1rem"
    },
    eyebrow: "Expérience étendue",
    title: ["Prolongez votre", "escapade"],
    body:
      "Le domaine dispose d'un parc arboré, d'une piscine avec vue panoramique sur les vignes, et peut accueillir vos événements privés et réceptions. Une extension naturelle de votre visite.",
    features: [
      { icon: "tree", label: "Parc arboré privatisable" },
      { icon: "pool", label: "Piscine avec vue sur les vignes" },
      { icon: "event", label: "Événements & réceptions sur mesure" }
    ],
    cta: { label: "Nous contacter pour privatiser", href: "/#contact" }
  },
  booking: {
    eyebrow: "Réservation",
    title: "Réservez votre visite",
    body: "Choisissez votre date, votre créneau et le nombre de participants pour confirmer votre visite.",
    layout: {
      calendarWidthRatio: "1.95fr",
      controlsWidthRatio: "1fr",
      panelMaxWidth: "63rem",
      calendarCellHeight: "2.9rem",
      controlRowHeight: "2.5rem"
    },
    config: {
      monthLabel: "February 2026",
      initialMonth: "2026-02",
      locale: "en-US",
      timezone: "Europe/Paris",
      startDate: "2026-02-01",
      endDate: "2026-12-31",
      dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      selectableDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      disabledWeekdays: [],
      disabledDates: [],
      defaultDay: 27,
      slots: [
        { id: "11-00", label: "11:00" },
        { id: "11-30", label: "11:30" },
        { id: "12-00", label: "12:00" },
        { id: "14-00", label: "14:00" },
        { id: "14-30", label: "14:30" },
        { id: "15-00", label: "15:00" },
        { id: "15-30", label: "15:30" },
        { id: "16-00", label: "16:00" }
      ],
      defaultSlotId: "14-30",
      minParticipants: 1,
      maxParticipants: 12,
      defaultParticipants: 2,
      addonLabel: "Ajouter planche fromages & charcuterie",
      basePricePerPerson: 15,
      addonPricePerPerson: 10,
      ctaLabel: "Reserver",
      ctaHref: "/visites#booking",
      callLabel: "Ou appeler",
      submitEndpoint: "",
      successMessage: "Demande envoyee. Nous revenons vers vous sous 24h.",
      errorMessage: "Impossible d'envoyer la demande. Merci d'appeler le domaine."
    }
  },
  finalCta: {
    image: visitsFinalCtaBg,
    imageAlt: "Préparation du chai pour la visite",
    layout: {
      contentMaxWidth: "34rem",
      eyebrowToTitleGap: "0.55rem",
      titleToBodyGap: "0.6rem",
      sectionMinHeight: "24rem"
    },
    eyebrow: "Ready to Visit?",
    title: "Votre visite vous attend",
    body: "Réservez en ligne en quelques clics et venez vivre une expérience inoubliable au cœur du Languedoc."
  }
};
