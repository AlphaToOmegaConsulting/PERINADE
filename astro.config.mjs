import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL || "https://www.perinade.fr",
  server: {
    host: import.meta.env.DEV
  },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
