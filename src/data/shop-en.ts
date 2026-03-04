import type { ShopPageData } from "../types/shop";
import shopImage1 from "../assets/perinade/shop/img-1.png";
import shopImage2 from "../assets/perinade/shop/img-2.png";
import shopImage3 from "../assets/perinade/shop/img-3.png";
import shopImage4 from "../assets/perinade/shop/img-4.png";
import shopImage5 from "../assets/perinade/shop/img-5.png";
import shopImage7 from "../assets/perinade/shop/img-7.png";

export const shopPageEn: ShopPageData = {
  seo: {
    title: "Buy AOP Minervois Wine Online | Domaine de la Périnade Shop",
    description:
      "Order our Languedoc wines online: AOP Minervois, IGP Pays d'Oc, reds, whites and rosés. 48-72 h delivery across France. Family estate near Carcassonne, Aude."
  },
  hero: {
    image: shopImage1,
    imageAlt: "Wine cellar with bottle shelves — Minervois estate",
    eyebrow: "Online shop",
    titleHtml: "Our wines,<br /><span>to your door</span>",
    body:
      "From the estate to your table: order our AOP Minervois and IGP Pays d'Oc wines online and receive them directly at home. Free delivery from €80.",
    primaryCta: { label: "Browse wines", href: "/en/shop#produits" },
    secondaryCta: { label: "Build my case", href: "/en/shop#coffrets" },
    metaAriaLabel: "Shop delivery information",
    metaItems: ["48-72 h delivery", "Secure payment", "14-day returns"]
  },
  productGrid: {
    eyebrow: "Our vintages",
    title: "AOP Minervois & IGP Pays d'Oc Wines",
    products: [
      {
        name: "Cuvée du Domaine",
        meta: "AOP Minervois · 2022 · 75 cl",
        description: "Dark fruit, garrigue, gentle spice. Silky palate, long finish.",
        price: "€12.50 incl. VAT",
        stock: "In stock",
        image: shopImage2,
        imageAlt: "Red wine bottle close-up",
        badges: ["Best Seller", "Red"],
        tone: "Red",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Blanc de Périnade",
        meta: "IGP Pays d'Oc · 2023 · 75 cl",
        description: "Citrus and white flowers. Remarkably fresh with a mineral finish.",
        price: "€10.00 incl. VAT",
        stock: "In stock",
        image: shopImage3,
        imageAlt: "White bottle on light background",
        badges: ["Best Seller", "White"],
        tone: "White",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Grande Réserve",
        meta: "AOP Minervois · 2020 · 75 cl",
        description: "Oak-aged. Powerful, complex, with smooth tannins.",
        price: "€22.00 incl. VAT",
        stock: "In stock",
        image: shopImage4,
        imageAlt: "Wine shelf",
        badges: ["Best Seller", "Red"],
        tone: "Red",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Rosé d'Été",
        meta: "IGP Pays d'Oc · 2024 · 75 cl",
        description: "Peach and strawberry. Fresh and generous, ideal for aperitif.",
        price: "€9.50 incl. VAT",
        stock: "In stock",
        image: shopImage5,
        imageAlt: "Rosé scene with basket",
        badges: ["Visit favorite", "Rosé"],
        tone: "Rosé",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Blanc Réserve",
        meta: "AOP Minervois · 2022 · 75 cl",
        description: "Exotic fruit, subtle vanilla. Full and elegant palate.",
        price: "€16.00 incl. VAT",
        stock: "In stock",
        image: shopImage3,
        imageAlt: "Reserve white bottle",
        badges: ["White"],
        tone: "White",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Rosé Prestige",
        meta: "IGP Pays d'Oc · 2024 · 75 cl",
        description: "Rose and spring fruit. Fresh, structured and lively finish.",
        price: "€13.00 incl. VAT",
        stock: "In stock",
        image: shopImage5,
        imageAlt: "Rosé prestige bottle",
        badges: ["Rosé"],
        tone: "Rosé",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      }
    ]
  },
  domainSelection: {
    eyebrow: "Collections",
    title: "Estate selections",
    items: [
      { icon: "shipping", title: "Careful shipping", body: "48-72 h in France, insulated packaging included" },
      { icon: "map", title: "Delivery zones", body: "Metropolitan France, Europe on request" },
      { icon: "return", title: "Returns", body: "14 days after delivery, full refund" },
      { icon: "lock", title: "Secure payment", body: "CB, Visa, Mastercard, SSL connection" },
      { icon: "support", title: "Direct support", body: "Reply within 24 h at +33 4 68 XX XX XX" }
    ]
  },
  caseComposer: {
    backdropImage: shopImage4,
    crateImage: shopImage7,
    crateImageAlt: "Tasting basket",
    eyebrow: "Cases & bundles",
    title: "Build your case",
    intro:
      "Our cases include selected wines, available in limited quantities to gift or discover the full range with an instant discount.",
    offers: [
      {
        title: "Discovery Case",
        saving: "Save €8.00",
        lines: ["Blanc de Périnade 2023 ×2", "Grande Réserve 2020 ×1", "Rosé d'Été 2024 ×2"],
        price: "€62.00",
        strikePrice: "€70.00",
        details: "5 bottles · 75 cl each",
        ctaLabel: "Build my case",
        ctaHref: "/en/shop#coffrets"
      }
    ]
  },
  finalCta: {
    sectionAriaLabel: "Shop call to action",
    title: "Ready to taste?",
    body: "Add your favorite wines and enjoy free delivery from €80.",
    ctaLabel: "Browse wines",
    ctaHref: "/en/shop#produits"
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "Everything before you buy",
    items: [
      {
        question: "What are the delivery times?",
        answer:
          "Orders are shipped within 24h and delivered within 48-72 h in metropolitan France. Insulated packaging included in hot weather."
      },
      {
        question: "Is delivery free?",
        answer: "Delivery is free from €80. Below that, fees depend on your delivery area."
      },
      {
        question: "Can I return my order?",
        answer: "Yes, you have 14 days after delivery. Bottles must be intact and unopened."
      },
      {
        question: "How should I store wines after delivery?",
        answer: "Store bottles horizontally in a cool, dry place away from direct light."
      },
      {
        question: "Do you deliver abroad?",
        answer: "Yes, on request for selected European destinations. Contact us before placing your order."
      },
      {
        question: "How can I contact the estate?",
        answer: "By phone at +33 4 68 XX XX XX or by email via the website contact form."
      }
    ]
  }
};
