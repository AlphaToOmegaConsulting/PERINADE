import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import astroParser from "astro-eslint-parser";

export default [
  ...tseslint.configs.recommended,
  {
    files: ["**/*.astro"],
    plugins: { astro: eslintPluginAstro },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"]
      }
    },
    rules: {
      ...eslintPluginAstro.configs.recommended.rules
    }
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**"]
  }
];
