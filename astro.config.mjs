import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  adapter: cloudflare({ mode: "directory" }),
  integrations: [react(), keystatic()],
  site: process.env.SITE_URL || "https://www.perinade.fr",
  server: {
    host: process.env.ASTRO_HOST === "true"
  },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
