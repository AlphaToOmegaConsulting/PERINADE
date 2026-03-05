import type { VisitPageData } from "../types/visits";
import visitsExtendedPool from "../assets/perinade/visits/extended-pool.jpg";
import visitsFinalCtaBg from "../assets/perinade/visits/final-cta-bg.jpg";
import visitsHeroGrapes from "../assets/perinade/visits/hero-grapes.jpg";
import visitsPairingBoard from "../assets/perinade/visits/pairing-board.jpg";
import visitsStep1 from "../assets/perinade/visits/step-1.jpg";
import visitsStep2 from "../assets/perinade/visits/step-2.jpg";
import visitsStep3 from "../assets/perinade/visits/step-3.jpg";
import visitsStep4 from "../assets/perinade/visits/step-4.jpg";
import visitsWineRedCard from "../assets/perinade/visits/wine-red-card.jpg";
import visitsWineRoseCard from "../assets/perinade/visits/wine-rose-card.jpg";
import visitsWineWhiteCard from "../assets/perinade/visits/wine-white-card.jpg";

export const visitsPageEn: VisitPageData = {
  theme: {
    accent: {
      primary: "#cc8a2f",
      soft: "#f3e5d2",
      onDark: "#e4a24c"
    },
    radius: {
      sm: "0.85rem",
      md: "1.05rem",
      lg: "1.35rem",
      xl: "1.75rem"
    },
    spacing: {
      sectionDesktop: "6.35rem",
      sectionTablet: "5.2rem",
      sectionMobile: "3.95rem"
    },
    typography: {
      eyebrow: {
        fontSize: "0.74rem",
        lineHeight: "1.35",
        letterSpacing: "0.24em",
        fontWeight: 500
      },
      titleDisplay: {
        fontSize: "clamp(2.72rem, 4.75vw, 4.45rem)",
        lineHeight: "1.02",
        letterSpacing: "-0.02em",
        fontWeight: 500
      },
      titleSection: {
        fontSize: "clamp(2.15rem, 3.1vw, 3.02rem)",
        lineHeight: "1.08",
        letterSpacing: "-0.02em",
        fontWeight: 500
      },
      body: {
        fontSize: "1.01rem",
        lineHeight: "1.64",
        letterSpacing: "0",
        fontWeight: 400
      },
      caption: {
        fontSize: "0.83rem",
        lineHeight: "1.45",
        letterSpacing: "0.08em",
        fontWeight: 500
      }
    },
    stroke: {
      subtle: "rgba(44, 44, 44, 0.1)",
      strong: "rgba(44, 44, 44, 0.2)"
    }
  },
  seo: {
    title: "Visits & Tastings | Domaine de la Périnade",
    description:
      "Book your estate visit: stroll through the vineyards, discover the cellar, enjoy a guided tasting and gourmet options."
  },
  hero: {
    eyebrow: "Visits & Tastings",
    titleLines: ["Discover the Languedoc", "glass in hand"],
    body:
      "A guided immersion led by the winemaker: walk through the vines, tour the cellar and taste 5 vintages in an exceptional family setting.",
    badges: [
      { icon: "clock", label: "1h30" },
      { icon: "ticket", label: "From 15 \u20AC" },
      { icon: "globe", label: "FR / EN" },
      { icon: "calendar", label: "9am \u2013 6pm, every day" },
      { icon: "car", label: "Free parking" }
    ],
    primaryCta: { label: "Book now", href: "/en/visits#booking" },
    secondaryCta: { label: "Call us", href: "tel:+33661999377" },
    helper: "+33 6 61 99 93 77 \u00B7 Reply within 24h",
    image: visitsHeroGrapes,
    imageAlt: "Freshly harvested grapes in a vat"
  },
  trustBar: [
    "4.9/5 based on 127 reviews",
    "Languedoc Wine Tourism Excellence",
    "Guided by the winemaker"
  ],
  timeline: {
    eyebrow: "Your journey",
    title: "The experience step by step",
    body: "1h30 of total immersion in the world of wine, guided by our winemaker.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Welcome by the winemaker",
        body: "A warm welcome in the heart of the estate. The winemaker introduces you to the family history and the philosophy of the house.",
        image: visitsStep1,
        imageAlt: "Grapes in a vat, first step of the visit",
        layout: {
          mediaRatio: "568/366",
          mediaMaxWidth: "30rem",
          contentMaxWidth: "24rem",
          align: "center"
        }
      },
      {
        id: "step-2",
        number: "02",
        title: "Walk through the vines",
        body: "Discover the Languedoc terroir, grape varieties and cultivation methods. An immersion amid garrigue scrubland and sun-drenched hills.",
        image: visitsStep2,
        imageAlt: "Vineyard path and estate vegetation",
        layout: {
          mediaRatio: "568/420",
          mediaMaxWidth: "21rem",
          contentMaxWidth: "25rem",
          align: "start"
        }
      },
      {
        id: "step-3",
        number: "03",
        title: "Cellar tour & winemaking",
        body: "Explanation of winemaking techniques, from the harvest to the oak barrels. Understand the process that brings our vintages to life.",
        image: visitsStep3,
        imageAlt: "Inside the cellar with oak barrels",
        layout: {
          mediaRatio: "568/420",
          mediaMaxWidth: "21rem",
          contentMaxWidth: "24rem",
          align: "start"
        }
      },
      {
        id: "step-4",
        number: "04",
        title: "Guided tasting",
        body: "Savour 5 selected wines \u2014 1 ros\u00E9, 3 whites and 1 red \u2014 with the winemaker\u2019s passionate commentary.",
        image: visitsStep4,
        imageAlt: "Tasting glasses at the end of the visit",
        layout: {
          mediaRatio: "568/368",
          mediaMaxWidth: "21rem",
          contentMaxWidth: "25rem",
          align: "center"
        }
      }
    ]
  },
  wines: {
    eyebrow: "The tasting",
    title: "5 vintages to discover",
    body: "1 ros\u00E9, 3 whites and 1 red \u2014 a curated selection with commentary by the winemaker.",
    cards: [
      {
        id: "wine-rose",
        tag: "1 ROS\u00C9",
        tagTone: "rose",
        title: "Summer Ros\u00E9",
        notes: ["Peach, strawberry", "Lively and full-flavoured palate"],
        image: visitsWineRoseCard,
        imageAlt: "Bottles and ros\u00E9 notes"
      },
      {
        id: "wine-white",
        tag: "3 WHITE",
        tagTone: "white",
        title: "P\u00E9rinade Whites",
        notes: ["Citrus, white flowers", "Mineral freshness"],
        image: visitsWineWhiteCard,
        imageAlt: "Bottle of white wine from the estate"
      },
      {
        id: "wine-red",
        tag: "1 RED",
        tagTone: "red",
        title: "Grande R\u00E9serve",
        notes: ["Dark fruits, garrigue", "Silky tannins, long finish"],
        image: visitsWineRedCard,
        imageAlt: "Selection of red wines in the cellar"
      }
    ]
  },
  pairing: {
    image: visitsPairingBoard,
    imageAlt: "Cheese board and accompaniments",
    eyebrow: "Available option",
    title: ["Cheese board", "& charcuterie"],
    body:
      "Extend the experience with a selection of aged cheeses and artisan charcuterie from the region, perfectly paired with our vintages. Ideal for turning your tasting into a convivial moment.",
    bullets: [
      "Local aged cheeses",
      "Artisan Languedoc charcuterie",
      "Country bread & house-made condiments"
    ],
    note: "Add this option when booking online."
  },
  pricing: {
    eyebrow: "Visit Options",
    title: "Choose Your Format",
    body: "Flexible formats, including private and large groups on request.",
    layout: {
      containerMaxWidth: "50rem",
      cardMinHeight: "22rem",
      cardPadding: "1.45rem",
      titleSize: "1.7rem",
      priceSize: "2.2rem"
    },
    plans: [
      {
        title: "Standard Visit",
        subtitle: "The essential experience",
        price: "15\u20AC",
        perLabel: "/ person",
        features: [
          "1h30 guided visit",
          "Walk through the vines",
          "Cellar tour & winery",
          "Tasting of 5 estate wines",
          "Commentary by the winemaker",
          "French & English available"
        ],
        ctaLabel: "Book now",
        ctaHref: "/en/visits#booking"
      },
      {
        title: "Gourmet Visit",
        subtitle: "Visit + food pairing",
        price: "25\u20AC",
        perLabel: "/ person",
        features: [
          "Everything in Standard",
          "Cheese & charcuterie board",
          "Local artisan selection",
          "Extended tasting time",
          "Perfect for couples & groups",
          "Available daily"
        ],
        ctaLabel: "Book now",
        ctaHref: "/en/visits#booking",
        isHighlighted: true,
        badge: "Popular"
      }
    ],
    meta: [
      "Available daily, 11:00 \u2013 16:00",
      "Private groups on request",
      "Premium experience, fair pricing"
    ]
  },
  access: {
    eyebrow: "Easy to Reach",
    title: "Easy to Reach",
    body: "Accessible from Carcassonne, with a straightforward welcome for visits as a couple, family or group.",
    leftCard: {
      icon: "pin",
      tag: "Address",
      title: "Carcassonne",
      subtitle: "Aude, Occitanie",
      content: ["Domaine de la P\u00E9rinade", "GPS coordinates shared after booking", "Free visitor parking"],
      ctaLabel: "View on map",
      ctaHref: "https://maps.google.com/?q=Lieu-dit+La+P%C3%A9rinade+11170+Pezens"
    },
    rightCards: [
      {
        icon: "car",
        tag: "Most convenient",
        title: "By car",
        subtitle: "Most convenient",
        content: ["10 min from Carcassonne", "Direct access and on-site parking"]
      },
      {
        icon: "plane",
        tag: "Airport",
        title: "From airport",
        subtitle: "Carcassonne Airport",
        content: ["20 min by car", "Taxis and ride services available"]
      },
      {
        icon: "train",
        tag: "Train + transfer",
        title: "Train + transfer",
        subtitle: "Carcassonne Station",
        content: ["25 min with transfer", "Ideal for a wine tourism stay"]
      }
    ]
  },
  escape: {
    image: visitsExtendedPool,
    imageAlt: "Pool and cypress trees at the estate",
    layout: {
      backgroundImage: visitsExtendedPool,
      overlayOpacity: 0.72,
      imagePanelRadius: "1rem"
    },
    eyebrow: "Extended Experience",
    title: ["Extend your", "getaway"],
    body:
      "The estate features a landscaped park, a swimming pool with panoramic vineyard views, and can host your private events and receptions. A natural extension of your visit.",
    features: [
      { icon: "tree", label: "Private landscaped park" },
      { icon: "pool", label: "Pool with vineyard views" },
      { icon: "event", label: "Bespoke events & receptions" }
    ],
    cta: { label: "Contact us for private hire", href: "/en#contact" }
  },
  booking: {
    eyebrow: "Booking",
    title: "Book your visit",
    body: "Choose your date, time slot and number of participants to confirm your visit.",
    layout: {
      calendarWidthRatio: "1.95fr",
      controlsWidthRatio: "1fr",
      panelMaxWidth: "63rem",
      calendarCellHeight: "2.9rem",
      controlRowHeight: "2.5rem"
    },
    ui: {
      prevMonthAriaLabel: "Previous month",
      nextMonthAriaLabel: "Next month",
      slotHeading: "Time slot",
      participantsHeading: "Participants",
      priceFromLabel: "From",
      pricePerPersonLabel: "/ person",
      missingDateMessage: "Please select a valid date.",
      defaultSuccessMessage: "Request sent.",
      defaultErrorMessage: "Error while sending request.",
      mailSubjectFallback: "Visit request - Domaine de la Perinade"
    },
    config: {
      monthLabel: "February 2026",
      initialMonth: "2026-02",
      locale: "en-US",
      timezone: "Europe/Paris",
      startDate: "2026-02-01",
      endDate: "2026-12-31",
      dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      selectableDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      disabledWeekdays: [],
      disabledDates: [],
      defaultDay: 27,
      slots: [
        { id: "11-00", label: "11:00" },
        { id: "11-30", label: "11:30" },
        { id: "12-00", label: "12:00" },
        { id: "14-00", label: "14:00" },
        { id: "14-30", label: "14:30" },
        { id: "15-00", label: "15:00" },
        { id: "15-30", label: "15:30" },
        { id: "16-00", label: "16:00" }
      ],
      defaultSlotId: "14-30",
      minParticipants: 1,
      maxParticipants: 12,
      defaultParticipants: 2,
      addonLabel: "Add cheese & charcuterie board",
      basePricePerPerson: 15,
      addonPricePerPerson: 10,
      ctaLabel: "Book now",
      ctaHref: "/en/visits#booking",
      callLabel: "Or call",
      submitEndpoint: "",
      successMessage: "Request sent. We will get back to you within 24h.",
      errorMessage: "Unable to send the request. Please call the estate directly."
    }
  },
  finalCta: {
    image: visitsFinalCtaBg,
    imageAlt: "Cellar preparation for the visit",
    layout: {
      contentMaxWidth: "34rem",
      eyebrowToTitleGap: "0.55rem",
      titleToBodyGap: "0.6rem",
      sectionMinHeight: "24rem"
    },
    eyebrow: "Ready to Visit?",
    title: "Your visit awaits",
    body: "Book online in just a few clicks and come enjoy an unforgettable experience in the heart of the Languedoc."
  }
};
