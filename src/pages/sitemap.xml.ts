const siteUrl = "https://www.perinade.fr";

/**
 * URL groups: each group lists all locale variants for the same page.
 * Used to generate <xhtml:link rel="alternate"> tags for multilingual SEO.
 */
const urlGroups = [
  {
    fr: "/",
    en: "/en",
    es: "/es",
    changefreq: "weekly",
    priority: { fr: "1.0", en: "0.9", es: "0.9" }
  },
  {
    fr: "/visites",
    en: "/en/visits",
    es: "/es/visitas",
    changefreq: "weekly",
    priority: { fr: "0.9", en: "0.8", es: "0.8" }
  },
  {
    fr: "/boutique",
    en: "/en/shop",
    es: "/es/tienda",
    changefreq: "weekly",
    priority: { fr: "0.8", en: "0.7", es: "0.7" }
  },
  {
    fr: "/domaine",
    en: "/en/domaine",
    es: "/es/domaine",
    changefreq: "monthly",
    priority: { fr: "0.8", en: "0.7", es: "0.7" }
  },
  {
    fr: "/actualites",
    en: "/en/news",
    es: "/es/noticias",
    changefreq: "weekly",
    priority: { fr: "0.7", en: "0.6", es: "0.6" }
  }
];

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const urls: string[] = [];

  for (const group of urlGroups) {
    const locales: Array<"fr" | "en" | "es"> = ["fr", "en", "es"];

    for (const locale of locales) {
      const path = group[locale];
      const priority = group.priority[locale];

      // Build xhtml:link alternates for all locales in this group
      const alternates = [
        `    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}${group.fr}"/>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${group.en}"/>`,
        `    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}${group.es}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${group.fr}"/>`
      ].join("\n");

      urls.push(`  <url>
    <loc>${siteUrl}${path}</loc>
${alternates}
    <lastmod>${today}</lastmod>
    <changefreq>${group.changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
