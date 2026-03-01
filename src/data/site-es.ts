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

export const siteEs: SiteData = {
  nav: [
    { label: "Inicio", href: "/es", mobile: false },
    { label: "Visitas", href: "/es/visitas", desktopSlot: "left", desktopLabel: "VISITAS" },
    { label: "Tienda", href: "/es/tienda", desktopSlot: "left", desktopLabel: "TIENDA" },
    { label: "La Finca", href: "/es/domaine", desktopSlot: "left", desktopLabel: "FINCA" },
    { label: "Noticias", href: "/es#contact", desktopSlot: "right", desktopLabel: "NOTICIAS" },
    { label: "Contacto", href: "/es#contact" }
  ],
  mobileQuickActions: [
    { id: "book", label: "Reservar", href: "/es/visitas#booking", icon: "calendar", priority: "primary" },
    { id: "shop", label: "Tienda", href: "/es/tienda", icon: "bag", priority: "secondary" },
    { id: "call", label: "Llamar", href: contactInfo.phoneTel, icon: "phone", priority: "secondary" }
  ],
  hero: {
    eyebrow: "Cerca de Carcassonne",
    title: ["Domaine", "de la", "Périnade"],
    body: "En el corazón del Languedoc, nuestra finca familiar le abre sus puertas para una experiencia auténtica entre viñedos, bodega y degustación. Descubra vinos de carácter, elaborados con pasión y respeto por el terruño.",
    ctaLabel: "Reservar una visita",
    ctaHref: "/es/visitas#booking",
    meta: ["Con cita previa", "Finca familiar", "Desde 1987"],
    backgroundImage: heroVineyard,
    featuredCards: [
      {
        kicker: "Degustación",
        title: "Visita a la Bodega",
        image: heroDeckVisiteCaveau,
        alt: "Botellas y bodega de la finca",
        href: "#experience"
      },
      {
        kicker: "Terruño",
        title: "Paseo por los Viñedos",
        image: heroDeckBaladeVignes,
        alt: "Vista de los viñedos de la finca",
        href: "#histoire"
      },
      {
        kicker: "Tienda",
        title: "Nuestros Vinos de Excepción",
        image: heroDeckCuveesException,
        alt: "Selección de botellas de la finca",
        href: "/es/tienda"
      }
    ]
  },
  reasons: [
    {
      title: "Una finca familiar",
      body: "Desde tres generaciones, nuestra familia cultiva con pasión un viñedo a escala humana.",
      icon: "leaf"
    },
    {
      title: "Un terruño de excepción",
      body: "Enclavado entre garriga y colinas, nuestro viñedo se beneficia de un microclima único.",
      icon: "terrain"
    },
    {
      title: "Una degustación íntima",
      body: "Nada de visitas masivas. Le recibimos personalmente en un ambiente cálido y acogedor.",
      icon: "glass"
    }
  ],
  experience: {
    eyebrow: "Visita",
    title: "Viva la experiencia Périnade",
    body: "Una visita guiada por la finca seguida de una degustación comentada de nuestros vinos, en un entorno auténtico y acogedor.",
    details: [
      { label: "Duración", value: "Aprox. 1h30", icon: "clock" },
      { label: "Grupo", value: "2 a 10 personas", icon: "users" },
      { label: "Idiomas", value: "Francés, Inglés, Español", icon: "globe" },
      { label: "Ubicación", value: "Cerca de Carcassonne", icon: "pin" },
      { label: "Precio", value: "15 € / persona", icon: "ticket" }
    ],
    infoLine: "Solo con cita previa · Aparcamiento gratuito · Acceso fácil desde Carcassonne",
    ctaLabel: "Reservar una visita",
    ctaHref: "/es/visitas#booking",
    backgroundImage: experienceBg
  },
  gallery: {
    eyebrow: "Nuestro universo",
    title: "Galería de la Finca",
    items: [
      { src: heroVineyard, alt: "Vista del viñedo al atardecer" },
      { src: galleryCellar, alt: "Bodega y degustación" },
      { src: galleryVinesClose, alt: "Detalle de una viña de la finca" }
    ]
  },
  testimonials: {
    eyebrow: "Testimonios",
    title: "Lo que dicen",
    pressLabel: "Destacado en",
    pressLogos: ["Le Figaro Vin", "Revue du Vin", "Decanter", "Wine Spectator"],
    items: [
      {
        quote: "Una acogida excepcional en un marco magnífico. La degustación fue apasionante y los vinos deliciosos. ¡Volveremos!",
        author: "Marie & Jean-Pierre",
        meta: "Toulouse",
        rating: 5
      },
      {
        quote: "Una joya escondida cerca de Carcassonne. La familia fue increíblemente acogedora y los vinos excepcionales. Una visita imprescindible.",
        author: "Sarah T.",
        meta: "London, UK",
        rating: 5
      },
      {
        quote: "Se siente inmediatamente la pasión y el saber hacer familiar. Los vinos son sinceros y la finca es magnífica. Amor a primera vista.",
        author: "Philippe D.",
        meta: "Paris",
        rating: 5
      }
    ]
  },
  history: {
    eyebrow: "Nuestra historia",
    title: "Tres generaciones de",
    titleHighlight: "pasión",
    body: [
      "Fundada en 1987, el Domaine de la Périnade es una aventura familiar nacida del amor por el terruño del Languedoc. En estas tierras bañadas por el sol, entre garriga y colinas, cultivamos nuestros viñedos con respeto por las tradiciones y especial atención al medio ambiente.",
      "Hoy es la tercera generación la que perpetúa este saber hacer, combinando métodos ancestrales y vinificación moderna para producir vinos que expresan la singularidad de nuestro terruño."
    ],
    imagePrimary: historyFamily,
    ctaLabel: "Descubrir la historia completa",
    ctaHref: "/es/domaine"
  },
  wines: {
    eyebrow: "Nuestros vinos",
    title: "Añadas seleccionadas",
    allWinesLabel: "Ver toda la tienda",
    allWinesHref: "/es/tienda",
    items: [
      {
        image: wineCuveeDomaine,
        title: "Cuvée du Domaine",
        subtitle: "Tinto · AOP Minervois",
        description: "Un tinto sedoso con notas de frutos negros, garriga y especias suaves, elaborado para acompañar las mejores mesas.",
        ctaLabel: "Ver vino",
        ctaHref: "/es/tienda"
      },
      {
        image: wineBlanc,
        title: "Blanc de Périnade",
        subtitle: "Blanco · IGP Pays d'Oc",
        description: "Una añada fresca y floral, con cítricos, tensión mineral y un final limpio.",
        ctaLabel: "Ver vino",
        ctaHref: "/es/tienda"
      },
      {
        image: wineRose,
        title: "Rosé d'Été",
        subtitle: "Rosado · IGP Pays d'Oc",
        description: "Un rosado luminoso con acentos de melocotón blanco y fresa, pensado para comidas de verano y aperitivos.",
        ctaLabel: "Ver vino",
        ctaHref: "/es/tienda"
      },
      {
        image: wineGrandeReserve,
        title: "Grande Réserve",
        subtitle: "Tinto · AOP Minervois",
        description: "Un vino de carácter criado en barrica, amplio y persistente, con taninos fundidos y profundidad.",
        ctaLabel: "Ver vino",
        ctaHref: "/es/tienda"
      }
    ]
  },
  contact: {
    eyebrow: "Contáctenos",
    titleHtml: "Hablemos de su próxima visita",
    body: "¿Desea reservar una visita, hacer un pedido o simplemente saber más sobre nuestros vinos? No dude en contactarnos.",
    info: [
      { label: "Teléfono", value: contactInfo.phone, icon: "phone" },
      { label: "Email", value: contactInfo.email, icon: "mail" },
      { label: "Web", value: contactInfo.website, icon: "globe" },
      { label: "Dirección", value: "Cerca de Carcassonne, Aude (11)", icon: "pin" }
    ],
    labels: {
      firstName: "Nombre *",
      lastName: "Apellido *",
      email: "Email *",
      phone: "Teléfono *",
      subject: "Asunto *",
      message: "Mensaje *",
      submit: "Enviar mensaje"
    },
    validation: {
      required: "Este campo es obligatorio.",
      invalidEmail: "Introduzca un correo electrónico válido.",
      fixErrors: "Corrija los campos marcados."
    },
    mail: {
      defaultSubject: "Solicitud de contacto",
      fieldFirstName: "Nombre",
      fieldLastName: "Apellido",
      fieldEmail: "Email",
      fieldPhone: "Teléfono",
      fieldMessage: "Mensaje"
    },
    formAction: `mailto:${contactInfo.email}`,
    formSuccessMessage: "Mensaje listo. Por favor, revise su borrador de correo antes de enviar.",
    formErrorMessage: `No se pudo preparar el mensaje. Por favor, llámenos al ${contactInfo.phone}.`
  },
  footer: {
    brandTitle: "Périnade",
    about: "Finca familiar cerca de Carcassonne. Vinos auténticos del Languedoc desde 1987.",
    groups: [
      {
        title: "Navegación",
        links: [
          { label: "Inicio", href: "/es" },
          { label: "Visitas", href: "/es/visitas" },
          { label: "Tienda", href: "/es/tienda" },
          { label: "La Finca", href: "/es/domaine" },
          { label: "Noticias", href: "/es#contact" },
          { label: "Contacto", href: "/es#contact" }
        ]
      },
      {
        title: "Información",
        links: [
          { label: "Aviso legal", href: "/es#contact" },
          { label: "Política de privacidad", href: "/es#contact" },
          { label: "Condiciones de venta", href: "/es#contact" },
          { label: "Prensa", href: "/es#contact" }
        ]
      }
    ],
    newsletterTitle: "Newsletter",
    newsletterBody: "Reciba nuestras novedades y ofertas exclusivas.",
    newsletterPlaceholder: "su@email.es",
    newsletterAction: `mailto:${contactInfo.email}`,
    social: [
      { label: "Instagram", href: contactInfo.instagram },
      { label: "Facebook", href: contactInfo.facebook }
    ],
    copyright: "© 2026 Domaine de la Périnade. Todos los derechos reservados.",
    legalLine: "El abuso de alcohol es peligroso para la salud. Consuma con moderación."
  }
};
