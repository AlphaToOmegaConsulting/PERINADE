import type { ShopPageData } from "../types/shop";
import heroImage from "../assets/perinade/shop/img-1.png";
import arenesImage from "../assets/perinade/shop/catalog/arenes.webp";
import renaissance75Image from "../assets/perinade/shop/catalog/renaissance_75.webp";
import renaissanceMagnumImage from "../assets/perinade/shop/catalog/renaissance_magnum.webp";
import chardonnayImage from "../assets/perinade/shop/catalog/chardonnay.webp";
import sauvignonImage from "../assets/perinade/shop/catalog/sauvignon.webp";
import viognierImage from "../assets/perinade/shop/catalog/viognier.webp";
import crazyHorseImage from "../assets/perinade/shop/catalog/crazy_horse.webp";
import chardoFrenchiesImage from "../assets/perinade/shop/catalog/chardo_frenchies.webp";
import redFrenchiesImage from "../assets/perinade/shop/catalog/red_frenchies.webp";
import roseFrenchiesImage from "../assets/perinade/shop/catalog/rose_frenchies.webp";
import frenchies3MixImage from "../assets/perinade/shop/catalog/frenchies_3mix.webp";
import frenchies6MixImage from "../assets/perinade/shop/catalog/frenchies_6mix.webp";

export const shopPageEs: ShopPageData = {
  seo: {
    title: "Comprar Vino Online | Tienda Domaine de la Périnade",
    description:
      "Pida nuestros vinos de la finca online: tintos, blancos, rosados y ediciones limitadas. Entrega en 48-72 h en Francia."
  },
  hero: {
    image: heroImage,
    imageAlt: "Bodega con estanterías de botellas del dominio Minervois",
    eyebrow: "Tienda en línea",
    titleHtml: "Nuestros vinos,<br /><span>en su casa</span>",
    body:
      "Descubra nuestras cuvées de la finca y colaboraciones de edición limitada. Envío gratuito a partir de 80 €.",
    primaryCta: { label: "Ver vinos", href: "/es/tienda#produits" },
    secondaryCta: { label: "Ver lotes", href: "/es/tienda#coffrets" },
    metaAriaLabel: "Información de entrega de la tienda",
    metaItems: ["Entrega en 48-72 h", "Pago seguro", "Devoluciones 14 días"]
  },
  productGrid: {
    eyebrow: "Catálogo completo",
    title: "Nuestras 12 cuvées disponibles",
    previousLabel: "Productos anteriores",
    nextLabel: "Productos siguientes",
    products: [
      {
        name: "Les Arènes",
        meta: "2023 · 75 cl",
        description:
          "Notas de fruta roja y regaliz con una boca suave y persistente.",
        price: "15,00 € IVA incl.",
        image: arenesImage,
        imageAlt: "Botella Les Arènes tinto",
        badges: ["Tinto"],
        tone: "Tinto",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Cuvée Renaissance Rosé",
        meta: "2022 · 75 cl",
        description:
          "100% Grenache Noir. Aromas de melocotón blanco y cítricos con final fresco y delicado.",
        price: "14,40 € IVA incl.",
        image: renaissance75Image,
        imageAlt: "Botella Cuvée Renaissance Rosé 2022",
        badges: ["Rosado"],
        tone: "Rosado",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Cuvée Renaissance Rosé",
        meta: "2024 · 150 cl",
        description:
          "Rosado afrutado y redondo con entrada fresca y elegante.",
        price: "33,00 € IVA incl.",
        image: renaissanceMagnumImage,
        imageAlt: "Magnum Cuvée Renaissance Rosé 2024",
        badges: ["Rosado", "Magnum"],
        tone: "Rosado",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Chardonnay",
        meta: "2023 · 75 cl",
        description:
          "Fruta tropical, buena acidez y final limpio.",
        price: "14,00 € IVA incl.",
        image: chardonnayImage,
        imageAlt: "Botella Chardonnay 2023",
        badges: ["Blanco"],
        tone: "Blanco",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Sauvignon Blanc cuvée 1830",
        meta: "Sin añada · 75 cl",
        description:
          "Cuvée homenaje al año de fundación de la finca. 100% Sauvignon Blanc, notas de grosella negra y pomelo con un perfil vivo y expresivo.",
        price: "15,00 € IVA incl.",
        image: sauvignonImage,
        imageAlt: "Botella Sauvignon Blanc cuvée 1830",
        badges: ["Blanco", "Cuvée 1830"],
        tone: "Blanco",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Viognier",
        meta: "2024 · 75 cl",
        description:
          "Cítricos y albaricoque con un perfil equilibrado y fresco.",
        price: "14,00 € IVA incl.",
        image: viognierImage,
        imageAlt: "Botella Viognier 2024",
        badges: ["Blanco"],
        tone: "Blanco",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "CRAZY HORSE PARIS",
        meta: "Sin añada · 75 cl",
        description:
          "Edición exclusiva creada para el Crazy Horse París. 100% Grenache Noir, notas de melocotón blanco y cítricos, estilo delicado y luminoso.",
        price: "25,00 € IVA incl.",
        image: crazyHorseImage,
        imageAlt: "Botella edición limitada Crazy Horse Paris",
        badges: ["Edición limitada", "Rosado"],
        tone: "Rosado",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Chardonnay Les Frenchies",
        meta: "Sin añada · 75 cl",
        description:
          "Chardonnay amplio, con un toque de madera y buena estructura.",
        price: "26,00 € IVA incl.",
        image: chardoFrenchiesImage,
        imageAlt: "Botella Chardonnay Les Frenchies",
        badges: ["Les Frenchies", "Blanco"],
        tone: "Blanco",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Red Blend Les Frenchies",
        meta: "2023 · 75 cl",
        description:
          "Mezcla tinta afrutada, sin madera, con final fresco.",
        price: "29,00 € IVA incl.",
        image: redFrenchiesImage,
        imageAlt: "Botella Red Blend Les Frenchies",
        badges: ["Les Frenchies", "Tinto"],
        tone: "Tinto",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Rosé Les Frenchies — Foulard Rouge",
        meta: "Sin añada · 75 cl",
        description:
          "Rosado delicado y luminoso, de perfil fresco y goloso.",
        price: "24,00 € IVA incl.",
        image: roseFrenchiesImage,
        imageAlt: "Botella Rosé Les Frenchies Foulard Rouge",
        badges: ["Les Frenchies", "Rosado"],
        tone: "Rosado",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Cuvées Les Frenchies — Mix Box of 3",
        meta: "Sin añada · 3 × 75 cl",
        description:
          "Lote descubrimiento con un tinto, un rosado y un blanco.",
        price: "79,00 € IVA incl.",
        image: frenchies3MixImage,
        imageAlt: "Lote Les Frenchies Mix Box of 3",
        badges: ["Lote", "Les Frenchies"],
        tone: "Lote",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#coffrets"
      },
      {
        name: "Cuvées Les Frenchies — Mix Box of 6",
        meta: "Sin añada · 6 × 75 cl",
        description:
          "Lote completo de seis botellas para explorar la gama.",
        price: "158,00 € IVA incl.",
        image: frenchies6MixImage,
        imageAlt: "Lote Les Frenchies Mix Box of 6",
        badges: ["Lote", "Les Frenchies"],
        tone: "Lote",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#coffrets"
      }
    ]
  },
  domainSelection: {
    eyebrow: "Colecciones",
    title: "Selecciones de la finca",
    items: [
      { icon: "shipping", title: "Envío cuidado", body: "48-72 h en Francia, embalaje isotérmico incluido" },
      { icon: "map", title: "Zonas de entrega", body: "Francia metropolitana, Europa bajo solicitud" },
      { icon: "return", title: "Devoluciones", body: "14 días tras recepción, reembolso completo" },
      { icon: "lock", title: "Pago seguro", body: "CB, Visa, Mastercard, conexión SSL" },
      { icon: "support", title: "Soporte directo", body: "Respuesta en 24 h al +33 6 61 99 93 77" }
    ]
  },
  caseComposer: {
    backdropImage: frenchies6MixImage,
    crateImage: frenchies3MixImage,
    crateImageAlt: "Lote Les Frenchies",
    eyebrow: "Cajas y lotes",
    title: "Lotes Les Frenchies",
    intro:
      "Encuentre nuestros lotes mix en una sección dedicada, ideales para regalar o descubrir toda la gama Les Frenchies.",
    offers: [
      {
        title: "Mix Box of 3",
        lines: ["1 tinto", "1 rosado", "1 blanco"],
        price: "79,00 € IVA incl.",
        details: "3 botellas",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#coffrets"
      },
      {
        title: "Mix Box of 6",
        lines: ["2 tintos", "2 rosados", "2 blancos"],
        price: "158,00 € IVA incl.",
        details: "6 botellas",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#coffrets"
      }
    ]
  },
  finalCta: {
    sectionAriaLabel: "Llamada a la acción de la tienda",
    title: "¿Listo para degustar?",
    body: "Añada sus vinos favoritos y disfrute de envío gratuito a partir de 80 €.",
    ctaLabel: "Ver vinos",
    ctaHref: "/es/tienda#produits"
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Todo lo que debe saber antes de comprar",
    items: [
      {
        question: "¿Cuáles son los plazos de entrega?",
        answer:
          "Los pedidos se envían en 24h y se entregan en 48-72 h en Francia metropolitana. Embalaje isotérmico incluido en períodos de calor."
      },
      {
        question: "¿La entrega es gratuita?",
        answer: "La entrega es gratuita a partir de 80 €. En caso contrario, los gastos dependen de su zona de entrega."
      },
      {
        question: "¿Puedo devolver mi pedido?",
        answer: "Sí, dispone de 14 días tras la recepción. Las botellas deben permanecer intactas y sin abrir."
      },
      {
        question: "¿Cómo conservar los vinos tras la entrega?",
        answer: "Conserve las botellas tumbadas en un lugar fresco, seco y protegido de la luz directa."
      },
      {
        question: "¿Entregan en el extranjero?",
        answer: "Sí, bajo solicitud para algunos destinos europeos. Contáctenos antes de validar el pedido."
      },
      {
        question: "¿Cómo contactar con la finca?",
        answer: "Por teléfono al +33 6 61 99 93 77 o por correo electrónico mediante el formulario de contacto del sitio."
      }
    ]
  }
};
