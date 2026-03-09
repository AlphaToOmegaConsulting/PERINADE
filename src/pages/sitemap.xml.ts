import { locales } from "../i18n/locales";
import { pageRoutes, type PageId } from "../i18n/routes";

const siteUrl = "https://www.perinade.fr";

const sitemapMeta: Record<PageId, { changefreq: string; priority: Record<"fr" | "en" | "es", string> }> = {
  home: { changefreq: "weekly", priority: { fr: "1.0", en: "0.9", es: "0.9" } },
  visites: { changefreq: "weekly", priority: { fr: "0.9", en: "0.8", es: "0.8" } },
  boutique: { changefreq: "weekly", priority: { fr: "0.8", en: "0.7", es: "0.7" } },
  domaine: { changefreq: "monthly", priority: { fr: "0.8", en: "0.7", es: "0.7" } },
  actualites: { changefreq: "weekly", priority: { fr: "0.7", en: "0.6", es: "0.6" } },
  panier: { changefreq: "weekly", priority: { fr: "0.4", en: "0.4", es: "0.4" } },
  confirmation: { changefreq: "weekly", priority: { fr: "0.2", en: "0.2", es: "0.2" } }
};

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const urls: string[] = [];

  for (const pageId of Object.keys(pageRoutes) as PageId[]) {
    const group = pageRoutes[pageId];
    const meta = sitemapMeta[pageId];

    for (const locale of locales) {
      const path = group[locale];
      const priority = meta.priority[locale];

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
    <changefreq>${meta.changefreq}</changefreq>
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
