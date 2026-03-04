import type { NewsPageData } from "../types/news";
import featuredHero from "../assets/perinade/news/featured-hero.jpg";
import highlightHeritage from "../assets/perinade/news/highlight-heritage.jpg";
import articleTastingAdvice from "../assets/perinade/news/article-tasting-advice.jpg";
import articleHachette from "../assets/perinade/news/article-hachette.jpg";
import articleWinterPruning from "../assets/perinade/news/article-winter-pruning.jpg";
import articleChristmasEvening from "../assets/perinade/news/article-christmas-evening.jpg";
import visitCtaVineyardBand from "../assets/perinade/news/visit-cta-vineyard-band.jpg";

export const newsPageEs: NewsPageData = {
  seo: {
    title: "Noticias | Domaine de la Périnade — Vinos AOP Minervois, Languedoc",
    description:
      "Vendimias, nuevas cuvées y eventos en el Domaine de la Périnade en Minervois, cerca de Carcassonne."
  },
  theme: {
    sectionDesktop: "8rem",
    sectionTablet: "5.75rem",
    sectionMobile: "4rem"
  },
  hero: {
    eyebrow: "Diario de la finca",
    titleLines: ["Noticias", "de la finca"],
    lead:
      "Vendimias, nuevas cuvées y eventos en la finca: siga la vida de la Périnade a lo largo de las estaciones, entre viñedo y bodega.",
    watermarkYear: "2026",
    stats: [
      { value: "9", label: "Artículos" },
      { value: "3", label: "Eventos próximos" }
    ],
    updatedLabel: "Actualizado · Marzo 2026"
  },
  featured: {
    eyebrow: "Destacado",
    category: "Vendimia",
    title: "Vendimia 2025: una cosecha excepcional bajo el sol del Languedoc",
    excerpt:
      "Repaso de una vendimia marcada por una madurez ideal y un sol generoso. Los primeros mostos ya revelan una complejidad excepcional que promete una añada memorable para la finca.",
    date: "15 febrero 2026",
    readTime: "6 min de lectura",
    ctaLabel: "Leer artículo completo",
    ctaHref: "/es/noticias",
    image: featuredHero,
    imageAlt: "Vendimia manual en el Domaine de la Périnade"
  },
  articles: {
    eyebrow: "Todas las noticias",
    title: "Crónicas de la finca",
    chips: ["Todo", "Vendimia", "Nuevas cuvées", "Eventos", "Vida de la finca"],
    activeChip: "Todo",
    leadCtaLabel: "Leer artículo",
    leadCard: {
      category: "Nuevas cuvées",
      date: "8 feb 2026",
      title: "La cuvée « Héritage » 2024 entra en crianza",
      excerpt:
        "Nuestra cuvée emblemática pasa a barricas de roble francés para una crianza de 14 meses. Primeras impresiones desde la bodega.",
      readLabel: "4 min de lectura",
      href: "/es/noticias",
      image: highlightHeritage,
      imageAlt: "Barricas en la bodega de la Périnade"
    },
    cards: [
      {
        category: "Vida de la finca",
        date: "1 feb 2026",
        title: "Cómo degustar nuestros vinos: consejos de la finca",
        excerpt:
          "Temperatura, aireación y maridaje: nuestras recomendaciones para disfrutar cada cuvée.",
        readLabel: "Leer más",
        href: "/es/noticias",
        image: articleTastingAdvice,
        imageAlt: "Copa de degustación y servicio de vino"
      },
      {
        category: "Vida de la finca",
        date: "22 ene 2026",
        title: "La Périnade distinguida en la Guía Hachette 2026",
        excerpt:
          "Nuestro Minervois tinto 2023 obtiene dos estrellas. Un orgullo compartido por todo el equipo.",
        readLabel: "Leer más",
        href: "/es/noticias",
        image: articleHachette,
        imageAlt: "Botellas premiadas de la finca"
      },
      {
        category: "Vida de la finca",
        date: "10 ene 2026",
        title: "La poda de invierno: gesto ancestral para preparar la añada",
        excerpt:
          "Los viticultores podan cepa por cepa: un ritual que prepara cada cosecha futura.",
        readLabel: "Leer más",
        href: "/es/noticias",
        image: articleWinterPruning,
        imageAlt: "Vista del viñedo en invierno"
      },
      {
        category: "Eventos",
        date: "18 dic 2025",
        title: "Noche de Navidad en la finca: resumen en imágenes",
        excerpt:
          "Degustación junto al fuego, maridajes y música en vivo para una velada cálida y memorable.",
        readLabel: "Leer más",
        href: "/es/noticias",
        image: articleChristmasEvening,
        imageAlt: "Copa de vino en luz cálida"
      }
    ],
    viewMoreLabel: "Ver 4 artículos más",
    viewMoreHref: "TODO_LINK_NEWS_ARCHIVE_ES"
  },
  agenda: {
    eyebrow: "Agenda",
    title: "Próximos encuentros",
    viewAllLabel: "Ver todo",
    viewAllHref: "TODO_LINK_NEWS_EVENTS_ES",
    events: [
      {
        day: "15",
        month: "Mar 2026",
        type: "Taller",
        title: "Jornada de poda: iniciación al trabajo del viñedo",
        time: "10h – 13h",
        location: "En la finca",
        href: "TODO_LINK_NEWS_EVENT_1_ES"
      },
      {
        day: "05",
        month: "Abr 2026",
        type: "Degustación",
        title: "Noche de degustación: vertical de Minervois tinto",
        time: "18h30 – 21h",
        location: "Bodega de degustación",
        href: "TODO_LINK_NEWS_EVENT_2_ES"
      },
      {
        day: "24",
        month: "May 2026",
        type: "Evento",
        title: "Puertas abiertas de primavera — entrada libre",
        time: "10h – 18h",
        location: "Domaine de la Périnade",
        href: "TODO_LINK_NEWS_EVENT_3_ES"
      }
    ]
  },
  visitCta: {
    eyebrow: "Viva la finca",
    titleLines: ["Cada visita es", "una promesa cumplida"],
    body: "Camine entre viñedos, sienta la bodega y pruebe el vino en su origen.",
    ctaLabel: "Reservar una visita",
    ctaHref: "/es/visitas#booking",
    newsletterPlaceholder: "Recibir nuestras noticias por correo",
    newsletterAction: "mailto:contact@perinade.fr",
    newsletterSubmitLabel: "Enviar newsletter",
    backgroundImage: visitCtaVineyardBand,
    backgroundAlt: "Atardecer sobre los viñedos de la finca"
  },
  blogPosts: [
    {
      headline: "Vendimia 2025: una cosecha excepcional bajo el sol del Languedoc",
      description: "Repaso de una vendimia con madurez ideal y excelente insolación.",
      datePublished: "2026-02-15",
      url: "https://www.perinade.fr/es/noticias",
      category: "Vendimia"
    },
    {
      headline: "La cuvée « Héritage » 2024 entra en crianza",
      description: "Nuestra cuvée emblemática pasa a barricas de roble francés.",
      datePublished: "2026-02-08",
      url: "https://www.perinade.fr/es/noticias",
      category: "Nuevas cuvées"
    },
    {
      headline: "Cómo degustar nuestros vinos: consejos de la finca",
      description: "Temperatura, aireación y maridaje para disfrutar cada cuvée.",
      datePublished: "2026-02-01",
      url: "https://www.perinade.fr/es/noticias",
      category: "Vida de la finca"
    },
    {
      headline: "La Périnade distinguida en la Guía Hachette 2026",
      description: "Nuestro Minervois tinto 2023 obtiene dos estrellas.",
      datePublished: "2026-01-22",
      url: "https://www.perinade.fr/es/noticias",
      category: "Vida de la finca"
    },
    {
      headline: "La poda de invierno: gesto ancestral para preparar la añada",
      description: "Poda cepa por cepa para preparar la próxima cosecha.",
      datePublished: "2026-01-10",
      url: "https://www.perinade.fr/es/noticias",
      category: "Vida de la finca"
    },
    {
      headline: "Noche de Navidad en la finca: resumen en imágenes",
      description: "Maridajes y música en vivo para una velada memorable.",
      datePublished: "2025-12-18",
      url: "https://www.perinade.fr/es/noticias",
      category: "Eventos"
    }
  ]
};
