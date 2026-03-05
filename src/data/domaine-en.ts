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

export const domainePageEn: DomainePageData = {
  theme: {
    sectionDesktop: "6.2rem",
    sectionTablet: "5rem",
    sectionMobile: "3.8rem"
  },
  seo: {
    title: "The Estate | Domaine de la Périnade",
    description:
      "Discover the history of Domaine de la Périnade, its terroir, wines and visiting opportunities in the heart of Minervois."
  },
  hero: {
    eyebrow: "The Estate",
    titleLines: ["Since 1830,", "nurturing the terroir"],
    body:
      "Between the Canal du Midi and the Fresquel river, Domaine de la Périnade carries on six generations of viticulture across 53 ha, including 17 ha of vines. A family story founded by Hippolyte Arnal in 1830, rooted in IGP Pays d'Oc near Pezens, revived in 2019 with exacting standards.",
    primaryCta: {
      label: "Book a visit to the estate",
      href: "/en/visits#booking"
    },
    secondaryCta: {
      label: "Discover our wines",
      href: "/en/shop"
    },
    badges: ["Viticulture", "Terroir", "Heritage"],
    highlights: ["53 ha estate", "17 ha of vines", "6 generations", "IGP Pays d'Oc · Languedoc"],
    image: heroImg,
    imageAlt: "Person checking their phone at dusk in the estate"
  },
  terroir: {
    eyebrow: "Terroir & Expertise",
    title: "An exceptional location",
    body:
      "The estate stretches between the Canal du Midi and the Fresquel river, in the IGP Pays d'Oc appellation, 10 km from Carcassonne (Aude, Occitanie). Sandy soils at the foot of gentle slopes, with open views over the Pyrenees and the Montagne Noire — a rare geographical setting that shapes the minerality and freshness of our wines.",
    grapesTitle: "Grape varieties",
    commitmentsTitle: "Environmental commitments",
    grapes: ["Grenache Noir", "Cabernet Franc", "Cabernet Sauvignon", "Merlot", "Chardonnay", "Sauvignon Blanc", "Viognier"],
    commitments: [
      {
        title: "HVE certification",
        body: "High Environmental Value — certified since 2019. Zero synthetic hormones, mechanical work prioritised."
      },
      {
        title: "Zero glyphosate",
        body: "Complete elimination of herbicides; mechanical weeding between rows."
      },
      {
        title: "Managed cover cropping",
        body: "Controlled cover-crop management to preserve soil biodiversity."
      }
    ],
    image: terroirImg,
    imageAlt: "Mountain landscape at sunrise"
  },
  family: {
    eyebrow: "The family",
    title: "The Arnal family today",
    body: [
      "In 2019, the 6th and 7th generations of the Arnal family took over the estate with the ambition of restoring this historic terroir to its full glory. Stéphane Arnal, after a twelve-year career at BNP Paribas (2007–2019), joined the estate to lead its commercial development.",
      "The construction of the winery in 2020, the restoration of the cellars and the plot-by-plot selection marked a fresh start. Oenologist Claude Serra has guided the estate since its revival, bringing his expertise in Languedoc wines. The goal remains the same: to produce wines that are precise, elegant and true to their origin.",
      "At the estate, heritage is a daily reality: precision in the vineyard, attentiveness to each vintage, and hospitality at every visit. Each bottle receives an injection of liquid nitrogen at filling, ensuring optimal preservation without excess sulphites."
    ],
    milestones: [
      { year: "1830", label: "Founded by Hippolyte Arnal" },
      { year: "2019", label: "Revival & trademark" },
      { year: "2020", label: "1st winery" }
    ],
    image: familyImg,
    imageAlt: "Dream Big inscription on a dark background"
  },
  statsBar: [
    { value: "53 ha", label: "Total estate" },
    { value: "17 ha", label: "Of vines" },
    { value: "6th & 7th", label: "Generations" },
    { value: "HVE", label: "Certified since 2019" },
    { value: "IGP", label: "Pays d'Oc" },
    { value: "365 d", label: "Visitor welcome" }
  ],
  timeline: {
    eyebrow: "History",
    title: "Two centuries, one family",
    defaultTabId: "2021",
    tabs: [
      {
        id: "1830",
        year: "1830",
        tabLabel: "~1830",
        title: "Foundation",
        detail: "Hippolyte Arnal plants the first plots on this lieu-dit between the Canal du Midi and the Fresquel, giving birth to the family estate.",
        images: [
          { src: timelineLeftImg, alt: "Artisanal precision work" },
          { src: timelineRightImg, alt: "Convivial tasting moment" }
        ]
      },
      {
        id: "2019",
        year: "2019",
        tabLabel: "2019",
        title: "Succession",
        detail:
          "The 6th and 7th generations take over the estate with a vision focused on quality, terroir and visitor experience.",
        images: [
          { src: timelineRightImg, alt: "Wine glasses during a tasting" },
          { src: timelineLeftImg, alt: "Cellar work and winemaking" }
        ]
      },
      {
        id: "2020",
        year: "2020",
        tabLabel: "2020",
        title: "Estate revival",
        detail: "Major reinvestment: vines, modernised winery and development of wine-tourism facilities.",
        images: [
          { src: visitCtaImg, alt: "Row of bottles in the cellar" },
          { src: terroirImg, alt: "Panoramic view of the estate terroir" }
        ]
      },
      {
        id: "2021",
        year: "2021",
        tabLabel: "2021",
        title: "Resilience",
        detail:
          "A challenging year marked by Covid and frost. The estate strengthens its fine-dining partnerships and refines its premium offering.",
        images: [
          { src: timelineLeftImg, alt: "Cellar tool in action" },
          { src: timelineRightImg, alt: "Sharing wine together" }
        ]
      },
      {
        id: "2022",
        year: "2022",
        tabLabel: "2022",
        title: "Moving upmarket",
        detail:
          "Enhanced plot selection, refined cuvees and higher standards across wine-merchant and restaurant channels. Membership of the Collège Culinaire de France, awarded the 'quality producer & artisan' label.",
        images: [
          { src: wine2Img, alt: "Estate bottle on display" },
          { src: wine3Img, alt: "Collection of bottles in the cellar" }
        ]
      },
      {
        id: "2023",
        year: "2023",
        tabLabel: "2023",
        title: "Wine-tourism expansion",
        detail:
          "Launch of private tours and signature tastings connecting the family story with the guest experience. Silver medal at the Concours des Vignerons Indépendants for the first rosé vinification.",
        images: [
          { src: wine1Img, alt: "Close-up of an estate cuvee" },
          { src: visitCtaImg, alt: "Row of bottles in the tasting room" }
        ]
      }
    ]
  },
  visitCta: {
    eyebrow: "Estate visits",
    title: "Come and experience",
    titleHighlight: "the estate",
    body:
      "Make an appointment to tour the vineyards, discover the winery and taste our wines in an authentic setting.",
    details: ["Duration: 1h30", "By reservation", "Welcome in FR / EN", "Private groups on request"],
    primaryCta: {
      label: "Book a visit to the estate",
      href: "/en/visits#booking"
    },
    secondaryCta: {
      label: "Contact us",
      href: "#domaine-contact"
    },
    image: visitCtaImg,
    imageAlt: "Bottles lined up in the cellar"
  },
  wines: {
    eyebrow: "Our wines",
    title: "The estate wines",
    allLabel: "Browse the full shop",
    allHref: "/en/shop",
    items: [
      {
        image: wine1Img,
        alt: "Cuvee du Domaine",
        meta: "AOP Minervois · 2022 · 75 cl",
        title: "Cuvee du Domaine",
        body: "Dark fruits, garrigue and sweet spices. A silky palate with an elegant finish.",
        price: "€12.50 incl. VAT",
        ctaLabel: "View",
        ctaHref: "/en/shop"
      },
      {
        image: wine2Img,
        alt: "Blanc de Perinade",
        meta: "IGP Pays d'Oc · 2023 · 75 cl",
        title: "Blanc de Perinade",
        body: "Citrus and white blossom. A fresh, precise and mineral wine.",
        price: "€10.00 incl. VAT",
        ctaLabel: "View",
        ctaHref: "/en/shop"
      },
      {
        image: wine3Img,
        alt: "Grande Reserve",
        meta: "AOP Minervois · 2020 · 75 cl",
        title: "Grande Reserve",
        body: "Oak-aged, powerful and complex, with smooth, integrated tannins.",
        price: "€22.00 incl. VAT",
        ctaLabel: "View",
        ctaHref: "/en/shop"
      }
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Any questions about the estate?",
    body:
      "Our team responds within 24 hours. You can also call us directly during the estate's opening hours.",
    cards: [
      { label: "Phone", value: contactInfo.phone, href: contactInfo.phoneTel },
      {
        label: "Address",
        value: contactInfo.address,
        href: contactInfo.mapUrl
      },
      { label: "Form", value: "Via our contact page", href: "#domaine-contact" }
    ],
    cta: {
      label: "Contact us",
      href: "#domaine-contact"
    }
  }
};
