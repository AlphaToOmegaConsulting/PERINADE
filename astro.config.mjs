import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.perinade.fr",
  server: {
    host: import.meta.env.DEV ? true : false
  },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
