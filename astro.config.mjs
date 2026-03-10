import { defineConfig } from "astro/config";
import keystatic from "@keystatic/astro";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  site: process.env.SITE_URL || "https://www.perinade.fr",
  server: {
    host: process.env.ASTRO_HOST === "true"
  },
  integrations: [
    ...(isDev ? [keystatic()] : []),
  ],
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
