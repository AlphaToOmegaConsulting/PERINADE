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

export const siteEn: SiteData = {
  nav: [
    { label: "Home", href: "/en", mobile: false },
    { label: "Visits", href: "/en/visits", desktopSlot: "left", desktopLabel: "VISITS" },
    { label: "Shop", href: "/en/shop", desktopSlot: "left", desktopLabel: "SHOP" },
    { label: "The Estate", href: "/en/domaine", desktopSlot: "left", desktopLabel: "ESTATE" },
    { label: "News", href: "/en#contact", desktopSlot: "right", desktopLabel: "NEWS" },
    { label: "Contact", href: "/en#contact" }
  ],
  mobileQuickActions: [
    { id: "book", label: "Book", href: "/en/visits#booking", icon: "calendar", priority: "primary" },
    { id: "shop", label: "Shop", href: "/en/shop", icon: "bag", priority: "secondary" },
    { id: "call", label: "Call", href: contactInfo.phoneTel, icon: "phone", priority: "secondary" }
  ],
  hero: {
    eyebrow: "Near Carcassonne",
    title: ["Domaine", "de la", "Périnade"],
    body: "In the heart of Languedoc, our family estate welcomes you for an authentic experience among vines, cellar and tastings. Discover wines of character, crafted with passion and respect for the terroir.",
    ctaLabel: "Book a visit",
    ctaHref: "/en/visits#booking",
    meta: ["By appointment", "Family estate", "Since 1830"],
    backgroundImage: heroVineyard,
    featuredCards: [
      {
        kicker: "Tasting",
        title: "Cellar Visit",
        image: heroDeckVisiteCaveau,
        alt: "Bottles and estate cellar",
        href: "#experience"
      },
      {
        kicker: "Terroir",
        title: "Vineyard Walk",
        image: heroDeckBaladeVignes,
        alt: "View of the estate vineyards",
        href: "#histoire"
      },
      {
        kicker: "Shop",
        title: "Our Exceptional Wines",
        image: heroDeckCuveesException,
        alt: "Selection of estate bottles",
        href: "/en/shop"
      }
    ]
  },
  reasons: {
    eyebrow: "Why visit us",
    title: "Three reasons to come",
    items: [
      {
        title: "A family estate",
        body: "For six generations, our family has passionately cultivated a human-scale vineyard.",
        icon: "leaf"
      },
      {
        title: "An exceptional terroir",
        body: "Nestled between garrigue and hills, our vineyard benefits from a unique microclimate.",
        icon: "terrain"
      },
      {
        title: "An intimate tasting",
        body: "No mass tours here. We welcome you personally in a warm and friendly setting.",
        icon: "glass"
      }
    ]
  },
  experience: {
    eyebrow: "Visit",
    title: "Live the Périnade Experience",
    body: "A guided tour of the estate followed by a commented tasting of our wines, in an authentic and welcoming setting.",
    details: [
      { label: "Duration", value: "About 1h30", icon: "clock" },
      { label: "Group", value: "2 to 10 people", icon: "users" },
      { label: "Languages", value: "French, English, Spanish", icon: "globe" },
      { label: "Location", value: "Near Carcassonne", icon: "pin" },
      { label: "Price", value: "€15 / person", icon: "ticket" }
    ],
    infoLine: "By appointment only · Free parking · Easy access from Carcassonne",
    ctaLabel: "Book a visit",
    ctaHref: "/en/visits#booking",
    backgroundImage: experienceBg
  },
  gallery: {
    eyebrow: "Our world",
    title: "Estate Gallery",
    items: [
      { src: heroVineyard, alt: "Vineyard view at sunset" },
      { src: galleryCellar, alt: "Cellar and tasting" },
      { src: galleryVinesClose, alt: "Close-up of estate vines" }
    ]
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What they say",
    pressLabel: "Featured in",
    pressLogos: ["Le Figaro Vin", "Revue du Vin", "Decanter", "Wine Spectator"],
    items: [
      {
        quote: "An exceptional welcome in a magnificent setting. The tasting was fascinating and the wines delicious. We'll be back!",
        author: "Marie & Jean-Pierre",
        meta: "Toulouse",
        rating: 5
      },
      {
        quote: "A hidden gem near Carcassonne. The family was incredibly welcoming and the wines were outstanding. A must-visit experience.",
        author: "Sarah T.",
        meta: "London, UK",
        rating: 5
      },
      {
        quote: "You can immediately feel the passion and family know-how. The wines are sincere and the estate is superb. A true favourite.",
        author: "Philippe D.",
        meta: "Paris",
        rating: 5
      }
    ]
  },
  history: {
    eyebrow: "Our story",
    title: "Six generations of",
    titleHighlight: "passion",
    body: [
      "Founded in 1830, Domaine de la Périnade is a family adventure born from a love of the Languedoc terroir. On these sun-drenched lands between garrigue and hills, we cultivate our vines with respect for tradition and particular attention to the environment.",
      "Today, the sixth generation carries on this expertise, blending ancestral methods with modern winemaking to produce wines that express the uniqueness of our terroir."
    ],
    imagePrimary: historyFamily,
    ctaLabel: "Discover the full story",
    ctaHref: "/en/domaine"
  },
  wines: {
    eyebrow: "Our wines",
    title: "Selected vintages",
    allWinesLabel: "View all wines",
    allWinesHref: "/en/shop",
    items: [
      {
        image: wineCuveeDomaine,
        title: "Cuvée du Domaine",
        subtitle: "Red · AOP Minervois",
        description: "A silky red with notes of dark fruit, garrigue and sweet spices, crafted to accompany fine dining.",
        ctaLabel: "View wine",
        ctaHref: "/en/shop"
      },
      {
        image: wineBlanc,
        title: "Blanc de Périnade",
        subtitle: "White · IGP Pays d'Oc",
        description: "A fresh and floral vintage, carried by citrus, mineral tension and a clean finish.",
        ctaLabel: "View wine",
        ctaHref: "/en/shop"
      },
      {
        image: wineRose,
        title: "Rosé d'Été",
        subtitle: "Rosé · IGP Pays d'Oc",
        description: "A luminous rosé with hints of white peach and strawberry, designed for summer meals and apéritifs.",
        ctaLabel: "View wine",
        ctaHref: "/en/shop"
      },
      {
        image: wineGrandeReserve,
        title: "Grande Réserve",
        subtitle: "Red · AOP Minervois",
        description: "A wine of character aged in oak barrels, full-bodied and persistent, with smooth tannins and deep substance.",
        ctaLabel: "View wine",
        ctaHref: "/en/shop"
      }
    ]
  },
  contact: {
    eyebrow: "Contact us",
    titleHtml: "Let's talk about your next visit",
    body: "Would you like to book a visit, place an order or simply learn more about our wines? Don't hesitate to get in touch.",
    info: [
      { label: "Phone", value: contactInfo.phone, icon: "phone" },
      { label: "Email", value: contactInfo.email, icon: "mail" },
      { label: "Website", value: contactInfo.website, icon: "globe" },
      { label: "Address", value: "Near Carcassonne, Aude (11)", icon: "pin" }
    ],
    labels: {
      firstName: "First name *",
      lastName: "Last name *",
      email: "Email *",
      phone: "Phone *",
      subject: "Subject *",
      message: "Message *",
      submit: "Send message"
    },
    validation: {
      required: "This field is required.",
      invalidEmail: "Please enter a valid email address.",
      fixErrors: "Please fix the highlighted fields."
    },
    mail: {
      defaultSubject: "Contact request",
      fieldFirstName: "First name",
      fieldLastName: "Last name",
      fieldEmail: "Email",
      fieldPhone: "Phone",
      fieldMessage: "Message"
    },
    formAction: `mailto:${contactInfo.email}`,
    formSuccessMessage: "Message ready. Please check your email draft before sending.",
    formErrorMessage: `Unable to prepare message. Please call us at ${contactInfo.phone}.`
  },
  footer: {
    brandTitle: "Périnade",
    about: "Family estate near Carcassonne. Authentic Languedoc wines since 1830.",
    groups: [
      {
        title: "Navigation",
        links: [
          { label: "Home", href: "/en" },
          { label: "Visits", href: "/en/visits" },
          { label: "Shop", href: "/en/shop" },
          { label: "The Estate", href: "/en/domaine" },
          { label: "News", href: "/en#contact" },
          { label: "Contact", href: "/en#contact" }
        ]
      },
      {
        title: "Information",
        links: [
          { label: "Legal notice", href: "/en#contact" },
          { label: "Privacy policy", href: "/en#contact" },
          { label: "Terms of sale", href: "/en#contact" },
          { label: "Press", href: "/en#contact" }
        ]
      }
    ],
    newsletterTitle: "Newsletter",
    newsletterBody: "Receive our latest news and exclusive offers.",
    newsletterPlaceholder: "your@email.com",
    newsletterAction: `mailto:${contactInfo.email}`,
    social: [
      { label: "Instagram", href: contactInfo.instagram },
      { label: "Facebook", href: contactInfo.facebook }
    ],
    copyright: "© 2026 Domaine de la Périnade. All rights reserved.",
    legalLine: "Alcohol abuse is dangerous for your health. Drink responsibly."
  }
};
