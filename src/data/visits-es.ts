import type { VisitPageData } from "../types/visits";
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

export const visitsPageEs: VisitPageData = {
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
    title: "Visitas y Degustaciones | Domaine de la Périnade",
    description:
      "Reserve su visita a la finca: paseo por los viñedos, descubrimiento de la bodega, degustación guiada y opciones gastronómicas."
  },
  hero: {
    eyebrow: "Visitas y Degustaciones",
    titleLines: ["Descubra el Languedoc", "copa en mano"],
    body:
      "Una inmersión guiada por el enólogo: paseo entre las viñas, visita a la bodega y degustación de 5 vinos en un entorno familiar excepcional.",
    badges: [
      { icon: "clock", label: "1h30" },
      { icon: "ticket", label: "Desde 15 €" },
      { icon: "globe", label: "FR / EN / ES" },
      { icon: "calendar", label: "11:00 – 16:00, todos los días" },
      { icon: "car", label: "Aparcamiento gratuito" }
    ],
    primaryCta: { label: "Reservar", href: "/es/visitas#booking" },
    secondaryCta: { label: "Llamar", href: "tel:+33468000000" },
    helper: "+33 4 68 XX XX XX · Respuesta en 24h",
    image: visitsHeroGrapes,
    imageAlt: "Uvas recién cosechadas en una cuba"
  },
  trustBar: [
    "4,9/5 basado en 127 opiniones",
    "Excelencia en Enoturismo del Languedoc",
    "Guiado por el enólogo"
  ],
  timeline: {
    eyebrow: "Su recorrido",
    title: "La experiencia paso a paso",
    body: "1h30 de inmersión total en el mundo del vino, guiado por nuestro enólogo.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Bienvenida por el enólogo",
        body: "Una cálida bienvenida en el corazón de la finca. El enólogo le presenta la historia familiar y la filosofía de la casa.",
        image: visitsStep1,
        imageAlt: "Uvas en una cuba, primera etapa de la visita",
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
        title: "Paseo por los viñedos",
        body: "Descubra el terruño del Languedoc, las variedades de uva y los métodos de cultivo. Una inmersión entre garriga y colinas bañadas por el sol.",
        image: visitsStep2,
        imageAlt: "Camino entre viñedos y vegetación de la finca",
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
        title: "Visita a la bodega y vinificación",
        body: "Explicación de las técnicas de vinificación, desde la vendimia hasta las barricas de roble. Comprenda el proceso que da vida a nuestros vinos.",
        image: visitsStep3,
        imageAlt: "Interior de la bodega con barricas",
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
        title: "Degustación comentada",
        body: "Saboree 5 vinos seleccionados — 1 rosado, 3 blancos y 1 tinto — con los comentarios apasionados del enólogo.",
        image: visitsStep4,
        imageAlt: "Copas de degustación al final de la visita",
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
    eyebrow: "La degustación",
    title: "5 vinos por descubrir",
    body: "1 rosado, 3 blancos y 1 tinto — una selección comentada por el enólogo.",
    cards: [
      {
        id: "wine-rose",
        tag: "1 ROSADO",
        tagTone: "rose",
        title: "Rosado de Verano",
        notes: ["Melocotón, fresa", "Paladar vivo y afrutado"],
        image: visitsWineRoseCard,
        imageAlt: "Botellas y tonos rosados"
      },
      {
        id: "wine-white",
        tag: "3 BLANCO",
        tagTone: "white",
        title: "Blancos de Périnade",
        notes: ["Cítricos, flores blancas", "Frescura mineral"],
        image: visitsWineWhiteCard,
        imageAlt: "Botella de vino blanco de la finca"
      },
      {
        id: "wine-red",
        tag: "1 TINTO",
        tagTone: "red",
        title: "Gran Reserva",
        notes: ["Frutos negros, garriga", "Taninos sedosos, final largo"],
        image: visitsWineRedCard,
        imageAlt: "Selección de vinos tintos en bodega"
      }
    ]
  },
  pairing: {
    image: visitsPairingBoard,
    imageAlt: "Tabla de quesos y acompañamientos",
    eyebrow: "Opción disponible",
    title: ["Tabla de quesos", "y embutidos"],
    body:
      "Prolongue la experiencia con una selección de quesos curados y embutidos artesanales de la región, perfectamente maridados con nuestros vinos. Ideal para convertir su degustación en un momento de convivencia.",
    bullets: [
      "Quesos curados locales",
      "Embutidos artesanales del Languedoc",
      "Pan de campo y condimentos caseros"
    ],
    note: "Añada esta opción al realizar su reserva en línea."
  },
  pricing: {
    eyebrow: "Opciones de visita",
    title: "Elija su formato",
    body: "Formatos flexibles, incluyendo grupos privados y grandes a petición.",
    layout: {
      containerMaxWidth: "50rem",
      cardMinHeight: "22rem",
      cardPadding: "1.45rem",
      titleSize: "1.7rem",
      priceSize: "2.2rem"
    },
    plans: [
      {
        title: "Visita Estándar",
        subtitle: "La experiencia esencial",
        price: "15 €",
        perLabel: "/ persona",
        features: [
          "Visita guiada de 1h30",
          "Paseo por los viñedos",
          "Recorrido por la bodega",
          "Degustación de 5 vinos de la finca",
          "Comentarios del enólogo",
          "Disponible en francés e inglés"
        ],
        ctaLabel: "Reservar",
        ctaHref: "/es/visitas#booking"
      },
      {
        title: "Visita Gourmet",
        subtitle: "Visita + maridaje",
        price: "25 €",
        perLabel: "/ persona",
        features: [
          "Todo lo incluido en Estándar",
          "Tabla de quesos y embutidos",
          "Selección artesanal local",
          "Tiempo de degustación ampliado",
          "Perfecto para parejas y grupos",
          "Disponible todos los días"
        ],
        ctaLabel: "Reservar",
        ctaHref: "/es/visitas#booking",
        isHighlighted: true,
        badge: "Popular"
      }
    ],
    meta: [
      "Disponible todos los días, 11:00 – 16:00",
      "Grupos privados a petición",
      "Experiencia premium, precio justo"
    ]
  },
  access: {
    eyebrow: "Fácil acceso",
    title: "Fácil de llegar",
    body: "Accesible desde Carcassonne, con una acogida sencilla para visitas en pareja, en familia o en grupo.",
    leftCard: {
      icon: "pin",
      tag: "Dirección",
      title: "Carcassonne",
      subtitle: "Aude, Occitania",
      content: ["Domaine de la Périnade", "Coordenadas GPS compartidas tras la reserva", "Aparcamiento gratuito para visitantes"],
      ctaLabel: "Ver en el mapa",
      ctaHref: "https://maps.google.com/?q=Domaine+de+la+Perinade+Minervois+Languedoc"
    },
    rightCards: [
      {
        icon: "car",
        tag: "Lo más práctico",
        title: "En coche",
        subtitle: "Lo más cómodo",
        content: ["15 min desde Carcassonne", "Acceso directo y aparcamiento en el lugar"]
      },
      {
        icon: "plane",
        tag: "Aeropuerto",
        title: "Desde el aeropuerto",
        subtitle: "Aeropuerto de Carcassonne",
        content: ["20 min en coche", "Taxis y VTC disponibles"]
      },
      {
        icon: "train",
        tag: "Tren + traslado",
        title: "Tren + traslado",
        subtitle: "Estación de Carcassonne",
        content: ["25 min con traslado", "Ideal para una estancia de enoturismo"]
      }
    ]
  },
  escape: {
    image: visitsExtendedPool,
    imageAlt: "Piscina y cipreses en la finca",
    layout: {
      backgroundImage: visitsExtendedPool,
      overlayOpacity: 0.72,
      imagePanelRadius: "1rem"
    },
    eyebrow: "Experiencia ampliada",
    title: ["Prolongue su", "escapada"],
    body:
      "La finca dispone de un parque arbolado, una piscina con vistas panorámicas a los viñedos, y puede acoger sus eventos privados y recepciones. Una extensión natural de su visita.",
    features: [
      { icon: "tree", label: "Parque arbolado privatizable" },
      { icon: "pool", label: "Piscina con vistas a los viñedos" },
      { icon: "event", label: "Eventos y recepciones a medida" }
    ],
    cta: { label: "Contáctenos para privatizar", href: "/es#contact" }
  },
  booking: {
    eyebrow: "Reserva",
    title: "Reserve su visita",
    body: "Elija su fecha, horario y número de participantes para confirmar su visita.",
    layout: {
      calendarWidthRatio: "1.95fr",
      controlsWidthRatio: "1fr",
      panelMaxWidth: "63rem",
      calendarCellHeight: "2.9rem",
      controlRowHeight: "2.5rem"
    },
    ui: {
      prevMonthAriaLabel: "Mes anterior",
      nextMonthAriaLabel: "Mes siguiente",
      slotHeading: "Horario",
      participantsHeading: "Participantes",
      priceFromLabel: "Desde",
      pricePerPersonLabel: "/ persona",
      missingDateMessage: "Seleccione una fecha válida.",
      defaultSuccessMessage: "Solicitud enviada.",
      defaultErrorMessage: "Error al enviar la solicitud.",
      mailSubjectFallback: "Solicitud de visita - Domaine de la Perinade"
    },
    config: {
      monthLabel: "Febrero 2026",
      initialMonth: "2026-02",
      locale: "es-ES",
      timezone: "Europe/Paris",
      startDate: "2026-02-01",
      endDate: "2026-12-31",
      dayLabels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
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
      addonLabel: "Añadir tabla de quesos y embutidos",
      basePricePerPerson: 15,
      addonPricePerPerson: 10,
      ctaLabel: "Reservar",
      ctaHref: "/es/visitas#booking",
      callLabel: "O llame",
      submitEndpoint: "",
      successMessage: "Solicitud enviada. Le responderemos en un plazo de 24 horas.",
      errorMessage: "No se pudo enviar la solicitud. Por favor, llame directamente a la finca."
    }
  },
  finalCta: {
    image: visitsFinalCtaBg,
    imageAlt: "Preparación de la bodega para la visita",
    layout: {
      contentMaxWidth: "34rem",
      eyebrowToTitleGap: "0.55rem",
      titleToBodyGap: "0.6rem",
      sectionMinHeight: "24rem"
    },
    eyebrow: "¿Listo para visitar?",
    title: "Su visita le espera",
    body: "Reserve en línea en unos pocos clics y venga a vivir una experiencia inolvidable en el corazón del Languedoc."
  }
};
