/**
 * JSON-LD structured data builders.
 * Prices and names derived from content collections — no hardcoding.
 */

const VISIT_DATE_RANGE = { startDate: "2026-03-01", endDate: "2026-12-31" };

const DOMAIN_LOCATION = {
  "@type": "Place",
  name: "Domaine de la Périnade",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Domaine de la Périnade",
    addressLocality: "Carcassonne",
    addressRegion: "Occitanie",
    postalCode: "11000",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "43.2130",
    longitude: "2.3536",
  },
} as const;

const ORGANIZER = {
  "@type": "Organization",
  name: "Domaine de la Périnade",
  url: "https://www.perinade.fr",
} as const;

type VisiteEntry = {
  data: {
    titre: string;
    sousTitre: string;
    prix: number;
  };
};

/**
 * Build visits page JSON-LD from the visites collection.
 * Prices and names are derived from content — no hardcoding.
 */
export function buildVisitsJsonLd(
  siteUrl: string,
  pagePath: string,
  visites: VisiteEntry[]
): string {
  const pageUrl = `${siteUrl}${pagePath}`;
  const bookingUrl = `${pageUrl}#booking`;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Visites & Dégustations — Domaine de la Périnade",
    url: pageUrl,
    numberOfItems: visites.length,
    itemListElement: visites.map((v, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: v.data.titre,
        description: v.data.sousTitre,
        url: pageUrl,
        ...VISIT_DATE_RANGE,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: DOMAIN_LOCATION,
        offers: {
          "@type": "Offer",
          price: String(v.data.prix),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: bookingUrl,
        },
        organizer: ORGANIZER,
        inLanguage: ["fr", "en", "es"],
      },
    })),
  });
}
