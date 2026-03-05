import type { DomainePageData } from "../types/domaine";
import { contactInfo } from "../i18n/contact";
import familyImg from "../assets/perinade/domaine/family.jpg";
import heroImg from "../assets/perinade/domaine/hero.jpg";
import terroirImg from "../assets/perinade/domaine/terroir.jpg";
import timelineLeftImg from "../assets/perinade/domaine/timeline-left.jpg";
import timelineRightImg from "../assets/perinade/domaine/timeline-right.jpg";
import visitCtaImg from "../assets/perinade/domaine/visit-cta.jpg";
import wine1Img from "../assets/perinade/domaine/wine-1.jpg";
import wine2Img from "../assets/perinade/domaine/wine-2.jpg";
import wine3Img from "../assets/perinade/domaine/wine-3.jpg";

export const domainePageEs: DomainePageData = {
  theme: {
    sectionDesktop: "6.2rem",
    sectionTablet: "5rem",
    sectionMobile: "3.8rem"
  },
  seo: {
    title: "La Finca | Domaine de la Périnade",
    description:
      "Descubra la historia del Domaine de la Périnade, su terroir, sus vinos y las posibilidades de visita en el corazón del Minervois."
  },
  hero: {
    eyebrow: "La Finca",
    titleLines: ["Desde 1830,", "el cuidado del terroir"],
    body:
      "Entre el Canal du Midi y el río Fresquel, el Domaine de la Périnade perpetúa seis generaciones de viticultura en 53 ha, de las cuales 17 ha son de viñedo. Una historia familiar fundada por Hippolyte Arnal en 1830, arraigada en IGP Pays d'Oc cerca de Pezens, relanzada en 2019 con la máxima exigencia.",
    primaryCta: {
      label: "Reservar una visita a la finca",
      href: "/es/visitas#booking"
    },
    secondaryCta: {
      label: "Descubrir nuestros vinos",
      href: "/es/tienda"
    },
    badges: ["Viticultura", "Terroir", "Transmisión"],
    highlights: ["53 ha de finca", "17 ha de viñedo", "6 generaciones", "IGP Pays d'Oc · Languedoc"],
    image: heroImg,
    imageAlt: "Persona consultando su teléfono al atardecer en la finca"
  },
  terroir: {
    eyebrow: "Terroir y saber hacer",
    title: "Una ubicación excepcional",
    body:
      "La finca se extiende entre el Canal du Midi y el río Fresquel, en la IGP Pays d'Oc, a 10 km de Carcasona (Aude, Occitanie). Suelos arenosos al pie de las colinas, con vistas abiertas a los Pirineos y la Montaña Negra — una situación geográfica singular que moldea la mineralidad y la frescura de nuestros vinos.",
    grapesTitle: "Variedades de uva",
    commitmentsTitle: "Compromisos medioambientales",
    grapes: ["Grenache Noir", "Cabernet Franc", "Cabernet Sauvignon", "Merlot", "Chardonnay", "Sauvignon Blanc", "Viognier"],
    commitments: [
      {
        title: "Certificación HVE",
        body: "Alto Valor Medioambiental — certificado desde 2019. Cero hormonas sintéticas, trabajo mecánico prioritario."
      },
      {
        title: "Cero glifosato",
        body: "Eliminación total de herbicidas; deshierbe mecánico entre las hileras."
      },
      {
        title: "Cubierta vegetal controlada",
        body: "Gestión de la cubierta vegetal para preservar la vida del suelo."
      }
    ],
    image: terroirImg,
    imageAlt: "Paisaje de montañas al amanecer"
  },
  family: {
    eyebrow: "La familia",
    title: "La familia Arnal hoy",
    body: [
      "En 2019, la 6.ª y 7.ª generación de la familia Arnal retomaron la finca con la voluntad de devolver todo su esplendor a este terroir histórico. Stéphane Arnal, tras una carrera de doce años en BNP Paribas (2007-2019), se incorporó para liderar el desarrollo comercial de la finca.",
      "La construcción de la bodega en 2020, la restauración de las cavas y la selección parcelaria marcaron un nuevo comienzo. El enólogo Claude Serra acompaña la finca desde su relanzamiento, aportando su experiencia en vinos del Languedoc. El objetivo sigue siendo el mismo: producir vinos auténticos, elegantes y fieles a su origen.",
      "En la finca, la herencia se vive a diario: precisión en el viñedo, escucha de cada añada y hospitalidad en cada visita. Cada botella recibe una inyección de nitrógeno líquido en el embotellado, garantizando una conservación óptima sin exceso de sulfitos."
    ],
    milestones: [
      { year: "1830", label: "Fundada por Hippolyte Arnal" },
      { year: "2019", label: "Relanzamiento y marca registrada" },
      { year: "2020", label: "1.ª bodega" }
    ],
    image: familyImg,
    imageAlt: "Inscripción Dream Big sobre fondo oscuro"
  },
  statsBar: [
    { value: "53 ha", label: "Finca total" },
    { value: "17 ha", label: "De viñedo" },
    { value: "6.ª y 7.ª", label: "Generaciones" },
    { value: "HVE", label: "Certificado desde 2019" },
    { value: "IGP", label: "Pays d'Oc" },
    { value: "365 d", label: "Acogida de visitantes" }
  ],
  timeline: {
    eyebrow: "Historia",
    title: "Dos siglos de una misma familia",
    defaultTabId: "2021",
    tabs: [
      {
        id: "1830",
        year: "1830",
        tabLabel: "~1830",
        title: "Fundación",
        detail: "Hippolyte Arnal planta las primeras parcelas en este paraje entre el Canal du Midi y el Fresquel, dando nacimiento a la finca familiar.",
        images: [
          { src: timelineLeftImg, alt: "Trabajo artesanal de precisión" },
          { src: timelineRightImg, alt: "Momento de degustación convivial" }
        ]
      },
      {
        id: "2019",
        year: "2019",
        tabLabel: "2019",
        title: "Transmisión",
        detail:
          "La 6.ª y 7.ª generación retoman la finca con una visión orientada a la calidad, el terroir y la experiencia del visitante.",
        images: [
          { src: timelineRightImg, alt: "Copas de vino en degustación" },
          { src: timelineLeftImg, alt: "Trabajo de bodega y vinificación" }
        ]
      },
      {
        id: "2020",
        year: "2020",
        tabLabel: "2020",
        title: "Relanzamiento de la finca",
        detail: "Reinversión global: viñedos, bodega modernizada y estructuración de la acogida enoturística.",
        images: [
          { src: visitCtaImg, alt: "Hilera de botellas en la cava" },
          { src: terroirImg, alt: "Panorámica del terroir de la finca" }
        ]
      },
      {
        id: "2021",
        year: "2021",
        tabLabel: "2021",
        title: "Resiliencia",
        detail:
          "Año difícil marcado por el Covid y las heladas. La finca consolida sus salidas en restauración gastronómica y perfecciona su propuesta premium.",
        images: [
          { src: timelineLeftImg, alt: "Herramienta de bodega en acción" },
          { src: timelineRightImg, alt: "Compartir en torno al vino" }
        ]
      },
      {
        id: "2022",
        year: "2022",
        tabLabel: "2022",
        title: "Ascenso de gama",
        detail:
          "Selección parcelaria reforzada, afinamiento de los vinos y mayor exigencia en los circuitos de vinotecas y restauración. Adhesión al Collège Culinaire de France, sello de «productor y artesano de calidad».",
        images: [
          { src: wine2Img, alt: "Botella de la finca en presentación" },
          { src: wine3Img, alt: "Colección de botellas en la cava" }
        ]
      },
      {
        id: "2023",
        year: "2023",
        tabLabel: "2023",
        title: "Proyección enoturística",
        detail:
          "Despliegue de visitas privadas y degustaciones exclusivas para conectar la historia familiar con la experiencia del cliente. Medalla de plata en el Concours des Vignerons Indépendants por la primera vinificación en rosado.",
        images: [
          { src: wine1Img, alt: "Primer plano de un vino de la finca" },
          { src: visitCtaImg, alt: "Hilera de botellas en la sala de catas" }
        ]
      }
    ]
  },
  visitCta: {
    eyebrow: "Visitas a la finca",
    title: "Venga a conocer",
    titleHighlight: "la finca",
    body:
      "Reserve una cita para recorrer los viñedos, descubrir la bodega y degustar nuestros vinos en un entorno auténtico.",
    details: ["Duración: 1h30", "Con reserva previa", "Acogida en FR / EN", "Grupos privados bajo petición"],
    primaryCta: {
      label: "Reservar una visita a la finca",
      href: "/es/visitas#booking"
    },
    secondaryCta: {
      label: "Contactarnos",
      href: "#domaine-contact"
    },
    image: visitCtaImg,
    imageAlt: "Botellas alineadas en la cava"
  },
  wines: {
    eyebrow: "Nuestros vinos",
    title: "Los vinos de la finca",
    allLabel: "Ver toda la tienda",
    allHref: "/es/tienda",
    items: [
      {
        image: wine1Img,
        alt: "Cuvée du Domaine",
        meta: "AOP Minervois · 2022 · 75 cl",
        title: "Cuvée du Domaine",
        body: "Frutos negros, garriga y especias dulces. Boca sedosa y final elegante.",
        price: "12,50 € IVA incl.",
        ctaLabel: "Ver",
        ctaHref: "/es/tienda"
      },
      {
        image: wine2Img,
        alt: "Blanc de Périnade",
        meta: "IGP Pays d'Oc · 2023 · 75 cl",
        title: "Blanc de Périnade",
        body: "Cítricos y flores blancas. Un vino fresco, preciso y mineral.",
        price: "10,00 € IVA incl.",
        ctaLabel: "Ver",
        ctaHref: "/es/tienda"
      },
      {
        image: wine3Img,
        alt: "Grande Réserve",
        meta: "AOP Minervois · 2020 · 75 cl",
        title: "Grande Réserve",
        body: "Criado en barrica, potente y complejo, con taninos fundidos.",
        price: "22,00 € IVA incl.",
        ctaLabel: "Ver",
        ctaHref: "/es/tienda"
      }
    ]
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Tiene alguna pregunta sobre la finca?",
    body:
      "Nuestro equipo responde en menos de 24 horas. También puede llamarnos directamente en horario de apertura de la finca.",
    cards: [
      { label: "Teléfono", value: contactInfo.phone, href: contactInfo.phoneTel },
      {
        label: "Dirección",
        value: contactInfo.address,
        href: contactInfo.mapUrl
      },
      { label: "Formulario", value: "A través de nuestra página de contacto", href: "#domaine-contact" }
    ],
    cta: {
      label: "Contactarnos",
      href: "#domaine-contact"
    }
  }
};
