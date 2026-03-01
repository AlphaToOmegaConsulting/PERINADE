import type { ShopPageData } from "../types/shop";
import shopImage1 from "../assets/perinade/shop/img-1.png";
import shopImage2 from "../assets/perinade/shop/img-2.png";
import shopImage3 from "../assets/perinade/shop/img-3.png";
import shopImage4 from "../assets/perinade/shop/img-4.png";
import shopImage5 from "../assets/perinade/shop/img-5.png";
import shopImage7 from "../assets/perinade/shop/img-7.png";

export const shopPageFr: ShopPageData = {
  hero: {
    image: shopImage1,
    imageAlt: "Cave avec étagères de bouteilles",
    eyebrow: "Boutique en ligne",
    titleHtml: "Nos vins,<br /><span>chez vous</span>",
    body:
      "Du domaine à votre table : commandez nos cuvées en ligne et recevez-les directement chez vous. Livraison gratuite dès 80 €.",
    primaryCta: { label: "Découvrir", href: "/boutique#produits" },
    secondaryCta: { label: "Composer ma caisse", href: "/boutique#coffrets" },
    metaAriaLabel: "Informations livraison boutique",
    metaItems: ["Livraison 48-72 h", "Paiement sécurisé", "Retours 14 jours"]
  },
  productGrid: {
    eyebrow: "Votre parcours",
    title: "L'expérience pas à pas",
    products: [
      {
        name: "Cuvée du Domaine",
        meta: "AOP Minervois · 2022 · 75 cl",
        description: "Fruits noirs, garrigue, épices douces. Bouche soyeuse, belle longueur.",
        price: "12,50 € TTC",
        stock: "En stock",
        image: shopImage2,
        imageAlt: "Bouteille rouge en close-up",
        badges: ["Meilleure vente", "Rouge"],
        tone: "Rouge",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Blanc de Périnade",
        meta: "IGP Pays d'Oc · 2023 · 75 cl",
        description: "Agrumes, fleurs blanches. Fraîcheur remarquable, finale minérale.",
        price: "10,00 € TTC",
        stock: "En stock",
        image: shopImage3,
        imageAlt: "Bouteille de blanc sur fond clair",
        badges: ["Meilleure vente", "Blanc"],
        tone: "Blanc",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Grande Réserve",
        meta: "AOP Minervois · 2020 · 75 cl",
        description: "Élevé en fûts de chêne. Puissant, complexe, tanins fondus.",
        price: "22,00 € TTC",
        stock: "En stock",
        image: shopImage4,
        imageAlt: "Étagères de vins",
        badges: ["Meilleure vente", "Rouge"],
        tone: "Rouge",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Rosé d'Été",
        meta: "IGP Pays d'Oc · 2024 · 75 cl",
        description: "Pêche, fraise. Bouche vive et gourmande, idéale pour l'apéritif.",
        price: "9,50 € TTC",
        stock: "En stock",
        image: shopImage5,
        imageAlt: "Scène rosé et panier",
        badges: ["Favori visite", "Rosé"],
        tone: "Rosé",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Blanc Réserve",
        meta: "AOP Minervois · 2022 · 75 cl",
        description: "Fruits exotiques, vanille subtile. Bouche ample et élégante.",
        price: "16,00 € TTC",
        stock: "En stock",
        image: shopImage3,
        imageAlt: "Bouteille blanc réserve",
        badges: ["Blanc"],
        tone: "Blanc",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
      },
      {
        name: "Rosé Prestige",
        meta: "IGP Pays d'Oc · 2024 · 75 cl",
        description: "Pétale de rose, fruits printaniers. Finale fraîche, structurée et vive.",
        price: "13,00 € TTC",
        stock: "En stock",
        image: shopImage5,
        imageAlt: "Rosé prestige",
        badges: ["Rosé"],
        tone: "Rosé",
        ctaLabel: "Ajouter au panier",
        ctaHref: "/boutique#produits"
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
    backdropImage: shopImage4,
    crateImage: shopImage7,
    crateImageAlt: "Panier de dégustation",
    eyebrow: "Coffrets & lots",
    title: "Composez votre caisse",
    intro:
      "Nos coffrets sont composés de cuvées sélectionnées, en quantité limitée pour offrir ou découvrir toute la gamme, avec une remise immédiate.",
    offers: [
      {
        title: "Coffret Découverte",
        saving: "Économie : 8,00 €",
        lines: ["Blanc de Périnade 2023 ×2", "Grande Réserve 2020 ×1", "Rosé d'Été 2024 ×2"],
        price: "62,00 €",
        strikePrice: "70,00 €",
        details: "5 bouteilles · 75 cl chacune",
        ctaLabel: "Composer ma caisse",
        ctaHref: "/boutique#coffrets"
      },
      {
        title: "Coffret Prestige",
        saving: "Économie : 17,00 €",
        lines: ["Grande Réserve 2020 ×2", "Blanc Réserve 2022 ×2", "Rosé Prestige 2024 ×2"],
        price: "85,00 €",
        strikePrice: "102,00 €",
        details: "6 bouteilles · 75 cl chacune",
        ctaLabel: "Composer ma caisse",
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
