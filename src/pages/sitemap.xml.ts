const siteUrl = "https://www.perinade.fr";

const pages = [
  /* French (default) */
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/visites", changefreq: "weekly", priority: "0.9" },
  { path: "/boutique", changefreq: "weekly", priority: "0.8" },
  { path: "/domaine", changefreq: "monthly", priority: "0.8" },

  /* English */
  { path: "/en", changefreq: "weekly", priority: "0.9" },
  { path: "/en/visits", changefreq: "weekly", priority: "0.8" },
  { path: "/en/shop", changefreq: "weekly", priority: "0.7" },
  { path: "/en/domaine", changefreq: "monthly", priority: "0.7" },

  /* Spanish */
  { path: "/es", changefreq: "weekly", priority: "0.9" },
  { path: "/es/visitas", changefreq: "weekly", priority: "0.8" },
  { path: "/es/tienda", changefreq: "weekly", priority: "0.7" },
  { path: "/es/domaine", changefreq: "monthly", priority: "0.7" }
];

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
