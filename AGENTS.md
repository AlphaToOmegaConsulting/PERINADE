# AGENTS.md

## Session Context (Project)

- Project: `PERINADE`
- Stack: Astro 5, TypeScript, ESLint, Prettier
- Package manager: `npm`
- Public locales: `fr`, `en`, `es`
- Default locale: `fr`
- Routing rule: default locale is not prefixed; English uses `/en/*`; Spanish uses `/es/*`
- Localized content is loaded from [src/data/index.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/index.ts)
- **Migration en cours (planifiée)** : le contenu éditorial de `src/data/` migre progressivement vers `content/` (fichiers YAML) via Astro Content Collections + Pages CMS. Voir [docs/plans/2026-03-07-cms-migration-design.md](/Users/codex/Desktop/WEBDEV/PERINADE/docs/plans/2026-03-07-cms-migration-design.md).

## Operating Preferences

- Keep responses concise and implementation-focused.
- Prefer updating existing localized data files instead of adding text directly inside shared components.
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
- Put visible content in locale data files. Current source of truth is `src/data/`; after each migration phase, the source shifts to `content/{section}/{locale}.yaml`.
- Use these page-to-data mappings (current state — `src/data/`; will shift to `content/` per phase):
  - Home: `src/data/site-{fr/en/es}.ts` → cible `content/site/{fr/en/es}.yaml`
  - Domaine: `src/data/domaine-{fr/en/es}.ts` → cible `content/domaine/{fr/en/es}.yaml`
  - Visites: `src/data/visits-{fr/en/es}.ts` → cible `content/visits/{fr/en/es}.yaml`
  - Actualités: `src/data/news-{fr/en/es}.ts` → cible `content/news/{fr/en/es}.yaml`
  - Boutique: `src/data/shop-{fr/en/es}.ts` → **reste dans le code** (migration future Cloudflare D1/KV, pas dans le CMS)
- If a new visible field is needed:
  1. update the matching type in `src/types/`
  2. add the field to all locale data files
  3. pass the value through props
  4. render it from props in the component
- Preserve intentional French brand/product names when appropriate, but translate interface text such as labels, buttons, navigation, helper text, success/error states, and CTA copy.
- Keep locale-specific links aligned with the current routing:
  - FR: `/`, `/visites`, `/domaine`, `/boutique`
  - EN: `/en`, `/en/visits`, `/en/domaine`, `/en/shop`
  - ES: `/es`, `/es/visitas`, `/es/domaine`, `/es/tienda`

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
- If the change touches content structure, also verify the corresponding type definitions in `src/types/`.

## Migration Pages CMS — Règles pendant la transition

- Ne jamais mettre les données `shop-*.ts` dans le CMS (couplées Stripe → migration future D1/KV).
- Ne jamais mettre le `theme` object de `visits-*.ts` dans le CMS (design config, pas éditorial).
- Pendant une phase de migration, ne pas modifier les pages concernées par la phase en cours (risque de conflit Git).
- Ne pas supprimer un fichier `src/data/*-{locale}.ts` avant d'avoir validé que son équivalent YAML fonctionne en build et en navigation sur les 3 locales.
- Les images actuellement importées en TypeScript (`import heroImg from '../assets/...'`) doivent être déplacées vers `public/assets/` et référencées par string URL avant de migrer le contenu correspondant vers YAML.
- Se référer au plan complet : [docs/plans/2026-03-07-cms-migration-design.md](/Users/codex/Desktop/WEBDEV/PERINADE/docs/plans/2026-03-07-cms-migration-design.md)

## Safety and Escalation

- Do not assume content should change in only one locale unless the user explicitly requests locale-scoped work.
- If a user asks for “modify content” and the request is ambiguous, default to updating all relevant locale files for the same content block.
- Do not remove or overwrite existing locale content without checking whether parallel locale equivalents must be updated too.
- If unexpected unrelated changes appear in the worktree, stop and ask the user how to proceed before touching those files.
- Prefer the repository guide [docs/i18n-maintenance.md](/Users/codex/Desktop/WEBDEV/PERINADE/docs/i18n-maintenance.md) when deciding where content belongs and how to validate it.
