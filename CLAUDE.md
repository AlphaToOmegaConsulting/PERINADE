# CLAUDE.md — Domaine de la Périnade

## Session Context (Project)

- Project: `PERINADE`
- Stack: Astro 5, TypeScript strict, ESLint, Prettier
- Package manager: `npm`
- Public locales: `fr`, `en`, `es`
- Default locale: `fr` (no URL prefix)
- Routing rule: default locale is not prefixed; English uses `/en/*`; Spanish uses `/es/*`
- **Source de vérité éditoriale** : `src/content/{section}/{locale}.yaml` (Astro Content Collections + Zod)
- Loaders centralisés dans `src/data/index.ts` (utilisent `getEntry()` / `getCollection()`)
- CMS : **Pages CMS** (Git-based) — édition YAML via interface web sans toucher au code

---

## Operating Preferences

- Keep responses concise and implementation-focused.
- Prefer updating YAML content files instead of adding text directly inside shared components.
- Treat French as the editorial source language, but always keep visible UI text correct for all three locales.
- When a user asks to change website content, assume they want the change reflected consistently in `fr`, `en`, and `es` unless they explicitly scope it to a single locale.
- Do not claim that translations are automatic. They are manual updates with automated verification.
- Before finishing any content-edit task, verify whether the same content exists in the other locale files and update them when appropriate.

---

## Repository Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server
npm run build        # Production build → dist/
npm run preview      # Preview built site
npm run check        # Astro + TypeScript type checking
npm run lint         # ESLint
npm run format       # Prettier write
npm run format:check # Prettier check (CI)
npm run verify       # check + build (pre-deploy)
npm run i18n:audit   # i18n audit (reads output/i18n/audit.md)
npm run i18n:extract # Extract translation catalogs
npm run i18n:verify  # check + build + i18n audit (full content validation)
```

---

## Content Source of Truth

| Section | YAML files |
|---------|-----------|
| Accueil | `src/content/accueil/{fr,en,es}.yaml` |
| Domaine | `src/content/domaine/{fr,en,es}.yaml` |
| Visites (page) | `src/content/visites/{fr,en,es}.yaml` |
| Actualités | `src/content/actualites/{fr,en,es}.yaml` |
| Boutique | `src/content/boutique/{fr,en,es}.yaml` |
| UI strings | `src/content/ui/{fr,en,es}.yaml` |
| Vins (product cards) | `src/content/vins/{slug}.{fr,en,es}.yaml` |
| Coffrets (product cards) | `src/content/coffrets/{slug}.{fr,en,es}.yaml` |
| Formules de visite (produits) | `src/content/formules-visite/{slug}.{fr,en,es}.yaml` |
| Contact | `src/content/contact/contact.yaml` |

---

## Coding and Editing Rules

- **Never** add business or page-copy text directly to shared components under `src/components/sections`, `src/components/shop`, `src/components/domaine`, or `src/components/visits`.
- All visible content belongs in YAML files under `src/content/`.
- Images: URL strings pointing to `public/assets/perinade/{section}/`. Never use `import img from '...'` in content files.
- If a new visible field is needed:
  1. Update the type in `src/types/`
  2. Add the field in all 3 locale YAMLs
  3. Update the Zod schema in `src/content.config.ts`
  4. Pass the value via props in the component
- Preserve intentional French brand/product names, but translate interface text (labels, buttons, nav, CTAs, error states).
- Keep locale-specific routes aligned:
  - FR: `/`, `/visites`, `/domaine`, `/boutique`, `/actualites`, `/panier`
  - EN: `/en`, `/en/visits`, `/en/domaine`, `/en/shop`, `/en/news`, `/en/cart`
  - ES: `/es`, `/es/visitas`, `/es/domaine`, `/es/tienda`, `/es/noticias`, `/es/carrito`

---

## Validation and Review

- For any content change affecting a public page, run `npm run i18n:verify` before completing.
- Read the reports:
  - [output/i18n/audit.md](output/i18n/audit.md)
  - [output/i18n/audit.json](output/i18n/audit.json)
- When reviewing content changes, explicitly check:
  - All affected locales were updated
  - No shared component gained hardcoded copy
  - Localized routes, canonical paths, and alternate links still match locale expectations
- If the change touches content structure, also verify `src/types/` and `src/content.config.ts`.

---

## Safety and Escalation

- Do not assume content should change in only one locale unless explicitly requested.
- If "modify content" is ambiguous, default to updating all relevant locale YAML files for the same content block.
- Do not remove or overwrite locale content without checking parallel locale equivalents.
- If unexpected unrelated changes appear in the worktree, stop and ask before touching those files.
- Prefer [docs/i18n-maintenance.md](docs/i18n-maintenance.md) when deciding where content belongs.

---

## Available Skills

Use the `Skill` tool to invoke these workflows:

| Skill | When to use |
|-------|------------|
| `edit-content` | Modifier du contenu éditorial sur une ou plusieurs pages (texte, images, CTA, descriptions) |
| `add-product` | Ajouter un nouveau vin ou coffret cadeau au catalogue |

**Usage example** — always invoke before starting content or product work:
```
Skill("edit-content")   // content changes
Skill("add-product")    // new wine or gift box
```

---

## Architecture Summary

```
src/
├── content/        # YAML éditorial — source de vérité
├── components/     # sections/ domaine/ news/ shop/ visits/ ui/
├── content.config.ts  # Zod schemas (Astro Content Collections)
├── data/           # Loaders centralisés
├── i18n/           # Routing helpers, locale types
├── lib/cart/       # Panier Stripe
├── types/          # TypeScript types
├── scripts/        # Vanilla TS modules (client-side)
├── styles/         # Global CSS + design tokens
├── utils/          # Helpers (json-ld, link, price, analytics)
└── pages/          # File-based routing × 3 locales
```

Deployment: **Cloudflare Pages** — auto-deploy on push to `main`
