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

export const shopPageEn: ShopPageData = {
  seo: {
    title: "Buy Wine Online | Domaine de la Périnade Shop",
    description:
      "Order our estate wines online: reds, whites, rosés and limited editions. 48-72 h delivery in France."
  },
  hero: {
    image: heroImage,
    imageAlt: "Wine cellar with bottle shelves — Minervois estate",
    eyebrow: "Online shop",
    titleHtml: "Our wines,<br /><span>to your door</span>",
    body:
      "Discover our estate wines and limited-edition collaborations. Free delivery from €80.",
    primaryCta: { label: "Browse wines", href: "/en/shop#produits" },
    secondaryCta: { label: "View bundles", href: "/en/shop#coffrets" },
    metaAriaLabel: "Shop delivery information",
    metaItems: ["48-72 h delivery", "Secure payment", "14-day returns"]
  },
  productGrid: {
    eyebrow: "Full catalogue",
    title: "Our 12 available cuvees",
    previousLabel: "Previous products",
    nextLabel: "Next products",
    products: [
      {
        name: "Les Arenes",
        meta: "2023 · 75 cl",
        description:
          "Red fruit and licorice notes with a supple, persistent palate.",
        price: "€15.00 incl. VAT",
        image: arenesImage,
        imageAlt: "Les Arenes red bottle",
        badges: ["Red"],
        tone: "Red",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Renaissance Rose Cuvee",
        meta: "2022 · 75 cl",
        description:
          "White peach and citrus aromas with a fresh, delicate finish.",
        price: "€14.40 incl. VAT",
        image: renaissance75Image,
        imageAlt: "Renaissance Rose Cuvee 2022 bottle",
        badges: ["Rose"],
        tone: "Rose",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Renaissance Rose Cuvee",
        meta: "2024 · 150 cl",
        description:
          "Fruity and rounded rose with a fresh, elegant attack.",
        price: "€33.00 incl. VAT",
        image: renaissanceMagnumImage,
        imageAlt: "Renaissance Rose Cuvee 2024 magnum",
        badges: ["Rose", "Magnum"],
        tone: "Rose",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Chardonnay",
        meta: "2023 · 75 cl",
        description:
          "Tropical fruit, lively acidity and a clean finish.",
        price: "€14.00 incl. VAT",
        image: chardonnayImage,
        imageAlt: "Chardonnay 2023 bottle",
        badges: ["White"],
        tone: "White",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Sauvignon Blanc Cuvee 1830",
        meta: "No vintage · 75 cl",
        description:
          "Cassis and grapefruit notes with a bright, expressive profile.",
        price: "€15.00 incl. VAT",
        image: sauvignonImage,
        imageAlt: "Sauvignon Blanc Cuvee 1830 bottle",
        badges: ["White", "Cuvee 1830"],
        tone: "White",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Viognier",
        meta: "2024 · 75 cl",
        description:
          "Citrus and apricot aromas, balanced and refreshing.",
        price: "€14.00 incl. VAT",
        image: viognierImage,
        imageAlt: "Viognier 2024 bottle",
        badges: ["White"],
        tone: "White",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "CRAZY HORSE PARIS",
        meta: "No vintage · 75 cl",
        description:
          "Special edition with white peach and citrus notes.",
        price: "€25.00 incl. VAT",
        image: crazyHorseImage,
        imageAlt: "Crazy Horse Paris limited edition bottle",
        badges: ["Limited edition", "Rose"],
        tone: "Rose",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Les Frenchies Chardonnay",
        meta: "No vintage · 75 cl",
        description:
          "Full Chardonnay with a light oak touch and fine structure.",
        price: "€26.00 incl. VAT",
        image: chardoFrenchiesImage,
        imageAlt: "Les Frenchies Chardonnay bottle",
        badges: ["Les Frenchies", "White"],
        tone: "White",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Les Frenchies Red Blend",
        meta: "2023 · 75 cl",
        description:
          "Fruit-forward red blend, unoaked, with a fresh finish.",
        price: "€29.00 incl. VAT",
        image: redFrenchiesImage,
        imageAlt: "Les Frenchies Red Blend bottle",
        badges: ["Les Frenchies", "Red"],
        tone: "Red",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Les Frenchies Rose — Red Scarf",
        meta: "No vintage · 75 cl",
        description:
          "Delicate rose style with a bright and lively profile.",
        price: "€24.00 incl. VAT",
        image: roseFrenchiesImage,
        imageAlt: "Les Frenchies Rose Red Scarf bottle",
        badges: ["Les Frenchies", "Rose"],
        tone: "Rose",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#produits"
      },
      {
        name: "Les Frenchies Cuvees — Mix Box of 3",
        meta: "No vintage · 3 × 75 cl",
        description:
          "Discovery bundle with one red, one rose and one white.",
        price: "€79.00 incl. VAT",
        image: frenchies3MixImage,
        imageAlt: "Les Frenchies Mix Box of 3 bundle",
        badges: ["Bundle", "Les Frenchies"],
        tone: "Bundle",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#coffrets"
      },
      {
        name: "Les Frenchies Cuvees — Mix Box of 6",
        meta: "No vintage · 6 × 75 cl",
        description:
          "Full bundle with six bottles to explore the range.",
        price: "€158.00 incl. VAT",
        image: frenchies6MixImage,
        imageAlt: "Les Frenchies Mix Box of 6 bundle",
        badges: ["Bundle", "Les Frenchies"],
        tone: "Bundle",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#coffrets"
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
    backdropImage: frenchies6MixImage,
    crateImage: frenchies3MixImage,
    crateImageAlt: "Les Frenchies bundle",
    eyebrow: "Cases & bundles",
    title: "Les Frenchies Bundles",
    intro:
      "Find our mix boxes in a dedicated section, ideal for gifting or discovering the full Les Frenchies range.",
    offers: [
      {
        title: "Mix Box of 3",
        lines: ["1 red", "1 rose", "1 white"],
        price: "€79.00 incl. VAT",
        details: "3 bottles",
        ctaLabel: "Add to cart",
        ctaHref: "/en/shop#coffrets"
      },
      {
        title: "Mix Box of 6",
        lines: ["2 reds", "2 roses", "2 whites"],
        price: "€158.00 incl. VAT",
        details: "6 bottles",
        ctaLabel: "Add to cart",
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
