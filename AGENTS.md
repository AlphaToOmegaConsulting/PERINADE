# AGENTS.md

## Session Context (Project)

- Project: `PERINADE`
- Stack: Astro 5, TypeScript, ESLint, Prettier
- Package manager: `npm`
- Public locales: `fr`, `en`, `es`
- Default locale: `fr`
- Routing rule: default locale is not prefixed; English uses `/en/*`; Spanish uses `/es/*`
- **Source de vérité éditoriale** : `content/{section}/{locale}.yaml` (Astro Content Collections + Zod)
- Loaders centralisés dans `src/data/index.ts` (utilisent `getEntry()` / `getCollection()`)
- CMS : **Pages CMS** (Git-based) — édition YAML via interface web sans toucher au code

## Operating Preferences

- Keep responses concise and implementation-focused.
- Prefer updating YAML content files instead of adding text directly inside shared components.
- Treat French as the editorial source language, but always keep visible UI text correct for all three locales.
- When a user asks to change website content, assume they want the change reflected consistently in `fr`, `en`, and `es` unless they explicitly scope it to a single locale.
- Do not claim that translations are automatic. They are manual updates with automated verification.
- Before finishing any content-edit task, verify whether the same content exists in the other locale files and update them when appropriate.

## Repository Commands

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Astro/type check: `npm run check`
- Lint: `npm run lint`
- Format check: `npm run format:check`
- Format write: `npm run format`
- General verification: `npm run verify`
- I18n audit only: `npm run i18n:audit`
- Extract translation catalogs: `npm run i18n:extract`
- Full i18n verification: `npm run i18n:verify`

## Coding and Editing Rules

- Never add business or page-copy text directly to shared components under `src/components/sections`, `src/components/shop`, `src/components/domaine`, or `src/components/visits`.
- Put visible content in the YAML files under `content/`. Source of truth per section:
  - Home : `content/site/{fr/en/es}.yaml`
  - Domaine : `content/domaine/{fr/en/es}.yaml`
  - Visites : `content/visits/{fr/en/es}.yaml`
  - Actualités : `content/news/{fr/en/es}.yaml`
  - UI strings (nav, boutons, labels) : `content/ui/{fr/en/es}.yaml`
  - Boutique : `src/data/shop-{fr/en/es}.ts` — **reste dans le code** (couplé Stripe, migration future Cloudflare D1/KV)
- Images éditoriales : URL strings pointant vers `public/assets/perinade/{section}/`. Ne jamais utiliser `import img from '...'` dans les fichiers de contenu.
- Si un nouveau champ visible est nécessaire :
  1. mettre à jour le type dans `src/types/`
  2. ajouter le champ dans les YAML des 3 locales
  3. mettre à jour le Zod schema dans `src/content.config.ts`
  4. passer la valeur via props dans le composant
- Preserve intentional French brand/product names when appropriate, but translate interface text such as labels, buttons, navigation, helper text, success/error states, and CTA copy.
- Keep locale-specific links aligned with the current routing:
  - FR: `/`, `/visites`, `/domaine`, `/boutique`, `/actualites`, `/panier`
  - EN: `/en`, `/en/visits`, `/en/domaine`, `/en/shop`, `/en/news`, `/en/cart`
  - ES: `/es`, `/es/visitas`, `/es/domaine`, `/es/tienda`, `/es/noticias`, `/es/carrito`

## Validation and Review

- For any content change that affects a public page, run `npm run i18n:verify` before considering the work complete.
- Read the generated reports:
  - [output/i18n/audit.md](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/audit.md)
  - [output/i18n/audit.json](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/audit.json)
- If only translation catalog generation is needed, run `npm run i18n:extract`.
- When reviewing content changes, explicitly check:
  - all affected locales were updated
  - no shared component gained hardcoded copy
  - localized routes, canonical paths, and alternate links still match locale expectations
- If the change touches content structure, also verify the corresponding type definitions in `src/types/` and the Zod schema in `src/content.config.ts`.

## Safety and Escalation

- Do not assume content should change in only one locale unless the user explicitly requests locale-scoped work.
- If a user asks for "modify content" and the request is ambiguous, default to updating all relevant locale YAML files for the same content block.
- Do not remove or overwrite existing locale content without checking whether parallel locale equivalents must be updated too.
- If unexpected unrelated changes appear in the worktree, stop and ask the user how to proceed before touching those files.
- Prefer the repository guide [docs/i18n-maintenance.md](/Users/codex/Desktop/WEBDEV/PERINADE/docs/i18n-maintenance.md) when deciding where content belongs and how to validate it.
