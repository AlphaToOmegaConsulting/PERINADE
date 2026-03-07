import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site
    ? new URL("sitemap.xml", site).href
    : "https://www.perinade.fr/sitemap.xml";
  return new Response(`User-agent: *\nDisallow:\n\nSitemap: ${sitemapUrl}\n`, {
    headers: { "Content-Type": "text/plain" }
  });
};
