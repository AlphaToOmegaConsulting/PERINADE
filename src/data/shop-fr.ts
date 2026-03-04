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

export const shopPageFr: ShopPageData = {
  seo: {
    title: "Acheter Vin en Ligne | Boutique Domaine de la Périnade",
    description:
      "Commandez nos vins du domaine en ligne : rouges, blancs, rosés et éditions spéciales. Livraison 48-72 h en France."
  },
  hero: {
    image: heroImage,
    imageAlt: "Cave avec étagères de bouteilles du domaine viticole Minervois",
    eyebrow: "Boutique en ligne",
    titleHtml: "Nos vins,<br /><span>chez vous</span>",
    body:
      "Découvrez nos cuvées du domaine et nos collaborations en édition limitée. Livraison gratuite dès 80 €.",
    primaryCta: { label: "Découvrir", href: "/boutique#produits" },
    secondaryCta: { label: "Voir les coffrets", href: "/boutique#coffrets" },
    metaAriaLabel: "Informations livraison boutique",
    metaItems: ["Livraison 48-72 h", "Paiement sécurisé", "Retours 14 jours"]
  },
  productGrid: {
    eyebrow: "Catalogue complet",
    title: "Nos 12 cuvées disponibles",
    previousLabel: "Produits précédents",
    nextLabel: "Produits suivants",
    products: [
      {
        name: "Les Arènes, Rouge",
        meta: "2023 · 75 cl",
        description:
          "Fruits rouges et réglisse, avec une bouche souple et persistante.",
        price: "15,00 € TTC",
        image: arenesImage,
        imageAlt: "Bouteille Les Arènes rouge",
        badges: ["Rouge"],
        tone: "Rouge",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Cuvée Renaissance Rosé",
        meta: "2022 · 75 cl",
        description:
          "Pêche blanche et agrumes, avec une finale fraîche et délicate.",
        price: "14,40 € TTC",
        image: renaissance75Image,
        imageAlt: "Bouteille Cuvée Renaissance Rosé 2022",
        badges: ["Rosé"],
        tone: "Rosé",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Cuvée Renaissance Rosé",
        meta: "2024 · 150 cl",
        description:
          "Rosé fruité et rond, à l'attaque fraîche et élégante.",
        price: "33,00 € TTC",
        image: renaissanceMagnumImage,
        imageAlt: "Magnum Cuvée Renaissance Rosé 2024",
        badges: ["Rosé", "Magnum"],
        tone: "Rosé",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Chardonnay",
        meta: "2023 · 75 cl",
        description:
          "Fruits tropicaux, belle acidité et finale nette.",
        price: "14,00 € TTC",
        image: chardonnayImage,
        imageAlt: "Bouteille Chardonnay 2023",
        badges: ["Blanc"],
        tone: "Blanc",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Sauvignon Blanc cuvée 1830",
        meta: "Sans millésime · 75 cl",
        description:
          "Notes de cassis et pamplemousse, profil vif et expressif.",
        price: "15,00 € TTC",
        image: sauvignonImage,
        imageAlt: "Bouteille Sauvignon Blanc cuvée 1830",
        badges: ["Blanc", "Cuvée 1830"],
        tone: "Blanc",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Viognier",
        meta: "2024 · 75 cl",
        description:
          "Agrumes et abricot, avec un équilibre entre rondeur et fraîcheur.",
        price: "14,00 € TTC",
        image: viognierImage,
        imageAlt: "Bouteille Viognier 2024",
        badges: ["Blanc"],
        tone: "Blanc",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Édition limitée CRAZY HORSE PARIS",
        meta: "Sans millésime · 75 cl",
        description:
          "Édition spéciale aux notes de pêche blanche et d'agrumes.",
        price: "25,00 € TTC",
        image: crazyHorseImage,
        imageAlt: "Bouteille Édition limitée Crazy Horse Paris",
        badges: ["Édition limitée", "Rosé"],
        tone: "Rosé",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Chardonnay Les Frenchies",
        meta: "Sans millésime · 75 cl",
        description:
          "Chardonnay ample, avec une touche boisée et une belle structure.",
        price: "26,00 € TTC",
        image: chardoFrenchiesImage,
        imageAlt: "Bouteille Chardonnay Les Frenchies",
        badges: ["Les Frenchies", "Blanc"],
        tone: "Blanc",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Red Blend Les Frenchies",
        meta: "2023 · 75 cl",
        description:
          "Assemblage rouge fruité, non boisé, à la finale fraîche.",
        price: "29,00 € TTC",
        image: redFrenchiesImage,
        imageAlt: "Bouteille Red Blend Les Frenchies",
        badges: ["Les Frenchies", "Rouge"],
        tone: "Rouge",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Rosé Les Frenchies — Foulard Rouge",
        meta: "Sans millésime · 75 cl",
        description:
          "Rosé délicat et lumineux, au style frais et gourmand.",
        price: "24,00 € TTC",
        image: roseFrenchiesImage,
        imageAlt: "Bouteille Rosé Les Frenchies Foulard Rouge",
        badges: ["Les Frenchies", "Rosé"],
        tone: "Rosé",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Cuvées Les Frenchies — Mix Box of 3",
        meta: "Sans millésime · 3 × 75 cl",
        description:
          "Coffret découverte avec un rouge, un rosé et un blanc.",
        price: "79,00 € TTC",
        image: frenchies3MixImage,
        imageAlt: "Coffret Les Frenchies Mix Box of 3",
        badges: ["Coffret", "Les Frenchies"],
        tone: "Coffret",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#coffrets"
      },
      {
        name: "Cuvées Les Frenchies — Mix Box of 6",
        meta: "Sans millésime · 6 × 75 cl",
        description:
          "Coffret complet avec six bouteilles pour découvrir la gamme.",
        price: "158,00 € TTC",
        image: frenchies6MixImage,
        imageAlt: "Coffret Les Frenchies Mix Box of 6",
        badges: ["Coffret", "Les Frenchies"],
        tone: "Coffret",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#coffrets"
      }
    ]
  },
  domainSelection: {
    eyebrow: "Collections",
    title: "Sélections du domaine",
    items: [
      {
        icon: "shipping",
        title: "Livraison soignée",
        body: "48-72 h en France, emballage isotherme inclus"
      },
      {
        icon: "map",
        title: "Zones de livraison",
        body: "France métropolitaine, Europe sur demande"
      },
      {
        icon: "return",
        title: "Retours",
        body: "14 jours après réception, remboursement intégral"
      },
      {
        icon: "lock",
        title: "Paiement sécurisé",
        body: "CB, Visa, Mastercard, connexion SSL"
      },
      {
        icon: "support",
        title: "Support direct",
        body: "Réponse sous 24 h au +33 4 68 XX XX XX"
      }
    ]
  },
  caseComposer: {
    backdropImage: frenchies6MixImage,
    crateImage: frenchies3MixImage,
    crateImageAlt: "Coffret Les Frenchies",
    eyebrow: "Coffrets & lots",
    title: "Coffrets Les Frenchies",
    intro:
      "Retrouvez aussi nos coffrets mix dans une section dédiée, parfaits pour offrir ou découvrir toute la gamme Les Frenchies.",
    offers: [
      {
        title: "Mix Box of 3",
        lines: ["1 rouge", "1 rosé", "1 blanc"],
        price: "79,00 € TTC",
        details: "3 bouteilles",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#coffrets"
      },
      {
        title: "Mix Box of 6",
        lines: ["2 rouges", "2 rosés", "2 blancs"],
        price: "158,00 € TTC",
        details: "6 bouteilles",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#coffrets"
      }
    ]
  },
  finalCta: {
    sectionAriaLabel: "Appel à l'action boutique",
    title: "Prêt à déguster ?",
    body: "Ajoutez vos cuvées préférées et profitez de la livraison gratuite dès 80 €.",
    ctaLabel: "Découvrir les vins",
    ctaHref: "/boutique#produits"
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Tout savoir avant d'acheter",
    items: [
      {
        question: "Quels sont les délais de livraison ?",
        answer:
          "Les commandes sont expédiées sous 24 h et livrées sous 48-72 h en France métropolitaine. Emballage isotherme inclus en période de chaleur."
      },
      {
        question: "La livraison est-elle gratuite ?",
        answer: "La livraison est offerte dès 80 € d'achat, sinon les frais sont calculés selon votre zone de livraison."
      },
      {
        question: "Puis-je retourner ma commande ?",
        answer: "Oui, vous disposez de 14 jours après réception. Les bouteilles doivent rester intactes et non ouvertes."
      },
      {
        question: "Comment conserver les vins après réception ?",
        answer: "Conservez les bouteilles couchées dans un endroit frais, sec et à l'abri de la lumière directe."
      },
      {
        question: "Livrez-vous à l'étranger ?",
        answer: "Oui, sur demande pour certaines destinations européennes. Contactez-nous avant validation de commande."
      },
      {
        question: "Comment contacter le domaine ?",
        answer: "Par téléphone au +33 4 68 XX XX XX ou par e-mail via le formulaire de contact du site."
      }
    ]
  }
};
