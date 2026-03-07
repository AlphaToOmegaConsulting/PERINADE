# Technical Stack — Domaine de la Périnade

## Overview

Static website for a French wine domain (Domaine de la Périnade) near Carcassonne. Fully client-side, pre-rendered static site with no backend server component.

---

## Core Framework & Language

| Technology | Version | Role |
|-----------|---------|------|
| **Astro** | ^5.18.0 | Static site framework (SSG) |
| **TypeScript** | ^5.9.3 | Primary language (strict mode) |

---

## Package Manager

**npm** with lockfile version 3 (`package-lock.json`)

---

## Dependencies

### Production

| Package | Version | Purpose |
|--------|---------|---------|
| `@fontsource/inter` | ^5.2.8 | Inter web font |
| `@fontsource/playfair-display` | ^5.2.8 | Playfair Display web font |
| `stripe` | ^20.4.0 | Stripe SDK (checkout e-commerce) |

### Development

| Package | Version | Purpose |
|--------|---------|---------|
| `astro` | ^5.18.0 | Build system & dev server |
| `typescript` | ^5.9.3 | Type checking & compilation |
| `@astrojs/check` | ^0.9.6 | Astro/TypeScript validation |
| `@types/node` | ^24.3.1 | Node.js type definitions |
| `eslint` | ^9.0.0 | Linting |
| `eslint-plugin-astro` | ^1.0.0 | Astro-specific lint rules |
| `prettier` | ^3.0.0 | Code formatting |
| `prettier-plugin-astro` | ^0.14.0 | Astro formatter support |

---

## Styling

- **Global CSS** — custom properties, CSS Grid, Flexbox, fluid typography tokens
- **Mobile-first** responsive approach
- No CSS framework or preprocessor (plain CSS)

---

## Client-Side Interactivity

Vanilla TypeScript modules, no UI framework (no React/Vue/Svelte):

| Module | Purpose |
|-------|---------|
| `booking-calendar.ts` | Visit booking calendar widget |
| `cursor-orb.ts` | Interactive cursor effect |
| `faq-accordion.ts` | FAQ accordion/collapsible |
| `header-menu.ts` | Mobile navigation menu |
| `scroll-reveal.ts` | Scroll-triggered animations |
| `timeline-tabs.ts` | Timeline tabbed interface |
| `analytics.ts` | Custom event tracking (dataLayer) |
| `init.ts` | Main initialization orchestrator |

---

## Architecture

```
content/                  # (migration en cours) YAML éditoriaux pour Pages CMS
src/
├── components/
│   ├── sections/   # Page sections (Header, Hero, Gallery, Contact…)
│   ├── domaine/    # Wine domain components
│   ├── news/       # News/actualités components
│   ├── shop/       # Shop/e-commerce components
│   ├── visits/     # Visit booking components
│   └── ui/         # Reusable UI primitives
├── data/           # Loaders localisés (src de vérité → migre vers content/ YAML)
├── i18n/           # Routing helpers, locale types, UI strings, contact info
├── lib/cart/       # Panier logic (Stripe)
├── types/          # TypeScript type definitions
├── scripts/        # Client-side TS modules (vanilla TS)
├── styles/         # Global CSS
└── pages/          # File-based routing, 3 locales
    ├── *.astro           # FR (sans préfixe)
    ├── en/*.astro        # EN (/en/*)
    └── es/*.astro        # ES (/es/*)
```

**Pages publiques (23 fichiers) :**
- FR : `/`, `/domaine`, `/visites`, `/boutique`, `/actualites`, `/panier`, `/confirmation`
- EN : `/en`, `/en/domaine`, `/en/visits`, `/en/shop`, `/en/news`, `/en/cart`, `/en/confirmation`
- ES : `/es`, `/es/domaine`, `/es/visitas`, `/es/tienda`, `/es/noticias`, `/es/carrito`, `/es/confirmacion`

---

## Development Scripts

```bash
npm run dev      # Local development server (host: true for LAN access)
npm run build    # Production build → dist/
npm run preview  # Preview built site locally
npm run check    # Astro + TypeScript type checking
npm run verify   # check + build (pre-deploy validation)
```

---

## Deployment & Infrastructure

| Aspect | Detail |
|-------|--------|
| **Host** | Cloudflare Pages |
| **Deployment** | Git-based, automated on push to `main` |
| **Build output** | `dist/` |
| **Environment variables** | Stripe keys (checkout), URLs de redirection |
| **Runtime** | Cloudflare Functions (Stripe webhook) |

---

## Localization

- Locales publiques : **French (fr)** (défaut, sans préfixe), **English (en)** (`/en/*`), **Spanish (es)** (`/es/*`)
- Routing : Astro i18n natif (`prefixDefaultLocale: false`), folder-based, pas de middleware
- Source de vérité éditoriale : FR — les contenus EN et ES sont mis à jour manuellement
- Helpers de routing : `src/i18n/locales.ts`, `src/i18n/routes.ts`

## CMS (migration planifiée)

- **Pages CMS** (Git-based) sera intégré pour permettre l'édition non-dev du contenu
- Contenu cible : `content/{section}/{fr/en/es}.yaml` — Astro Content Collections + Zod
- Boutique/Stripe : restera dans le code, migration future vers **Cloudflare D1 + KV**
- Plan détaillé : [docs/plans/2026-03-07-cms-migration-design.md](/Users/codex/Desktop/WEBDEV/PERINADE/docs/plans/2026-03-07-cms-migration-design.md)

---

## Code Quality

| Tool | Purpose |
|-----|---------|
| TypeScript strict mode | Type safety |
| `astro check` | Component validation |
| Zero runtime vulnerabilities | Static site, no server-side attack surface |
