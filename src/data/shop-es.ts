import type { ShopPageData } from "../types/shop";
import shopImage1 from "../assets/perinade/shop/img-1.png";
import shopImage2 from "../assets/perinade/shop/img-2.png";
import shopImage3 from "../assets/perinade/shop/img-3.png";
import shopImage4 from "../assets/perinade/shop/img-4.png";
import shopImage5 from "../assets/perinade/shop/img-5.png";
import shopImage7 from "../assets/perinade/shop/img-7.png";

export const shopPageEs: ShopPageData = {
  hero: {
    image: shopImage1,
    imageAlt: "Bodega con estanterías de botellas",
    eyebrow: "Tienda en línea",
    titleHtml: "Nuestros vinos,<br /><span>en su casa</span>",
    body:
      "De la finca a su mesa: pida nuestros vinos en línea y recíbalos directamente en casa. Envío gratuito a partir de 80 €.",
    primaryCta: { label: "Ver vinos", href: "/es/tienda#produits" },
    secondaryCta: { label: "Componer mi caja", href: "/es/tienda#coffrets" },
    metaAriaLabel: "Información de entrega de la tienda",
    metaItems: ["Entrega en 48-72 h", "Pago seguro", "Devoluciones 14 días"]
  },
  productGrid: {
    eyebrow: "Su recorrido",
    title: "La experiencia paso a paso",
    products: [
      {
        name: "Cuvée du Domaine",
        meta: "AOP Minervois · 2022 · 75 cl",
        description: "Frutos negros, garriga y especias suaves. Boca sedosa, gran longitud.",
        price: "12,50 € IVA incl.",
        stock: "En stock",
        image: shopImage2,
        imageAlt: "Primer plano de botella tinta",
        badges: ["Más vendido", "Tinto"],
        tone: "Tinto",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Blanc de Périnade",
        meta: "IGP Pays d'Oc · 2023 · 75 cl",
        description: "Cítricos y flores blancas. Frescura notable y final mineral.",
        price: "10,00 € IVA incl.",
        stock: "En stock",
        image: shopImage3,
        imageAlt: "Botella blanca sobre fondo claro",
        badges: ["Más vendido", "Blanco"],
        tone: "Blanco",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Grande Réserve",
        meta: "AOP Minervois · 2020 · 75 cl",
        description: "Criado en barrica. Potente, complejo y de taninos fundidos.",
        price: "22,00 € IVA incl.",
        stock: "En stock",
        image: shopImage4,
        imageAlt: "Estanterías de vinos",
        badges: ["Más vendido", "Tinto"],
        tone: "Tinto",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Rosé d'Été",
        meta: "IGP Pays d'Oc · 2024 · 75 cl",
        description: "Melocotón y fresa. Boca viva y golosa, ideal para aperitivo.",
        price: "9,50 € IVA incl.",
        stock: "En stock",
        image: shopImage5,
        imageAlt: "Escena de rosado con cesta",
        badges: ["Favorito de visita", "Rosado"],
        tone: "Rosado",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Blanc Réserve",
        meta: "AOP Minervois · 2022 · 75 cl",
        description: "Fruta exótica y vainilla sutil. Boca amplia y elegante.",
        price: "16,00 € IVA incl.",
        stock: "En stock",
        image: shopImage3,
        imageAlt: "Botella blanco reserva",
        badges: ["Blanco"],
        tone: "Blanco",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
      },
      {
        name: "Rosé Prestige",
        meta: "IGP Pays d'Oc · 2024 · 75 cl",
        description: "Rosa y frutos de primavera. Final fresco, estructurado y vivo.",
        price: "13,00 € IVA incl.",
        stock: "En stock",
        image: shopImage5,
        imageAlt: "Botella rosado prestige",
        badges: ["Rosado"],
        tone: "Rosado",
        ctaLabel: "Añadir al carrito",
        ctaHref: "/es/tienda#produits"
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
      { icon: "support", title: "Soporte directo", body: "Respuesta en 24 h al +33 4 68 XX XX XX" }
    ]
  },
  caseComposer: {
    backdropImage: shopImage4,
    crateImage: shopImage7,
    crateImageAlt: "Cesta de degustación",
    eyebrow: "Cajas y lotes",
    title: "Componga su caja",
    intro:
      "Nuestras cajas incluyen vinos seleccionados, en cantidades limitadas para regalar o descubrir toda la gama con descuento inmediato.",
    offers: [
      {
        title: "Caja Descubrimiento",
        saving: "Ahorro: 8,00 €",
        lines: ["Blanc de Périnade 2023 ×2", "Grande Réserve 2020 ×1", "Rosé d'Été 2024 ×2"],
        price: "62,00 €",
        strikePrice: "70,00 €",
        details: "5 botellas · 75 cl cada una",
        ctaLabel: "Componer mi caja",
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
          "Los pedidos se envían en 24h y se entregan en 48-72 h en Francia metropolitana. Embalaje isotérmico incluido en periodos de calor."
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
        answer: "Por teléfono al +33 4 68 XX XX XX o por correo electrónico mediante el formulario de contacto del sitio."
      }
    ]
  }
};
