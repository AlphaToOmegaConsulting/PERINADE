# Technical Stack — Domaine de la Périnade

## Overview

Static website for a French wine domain (Domaine de la Périnade) near Carcassonne. Fully client-side, pre-rendered static site with no backend server component.

---

## Core Framework & Language

| Technology | Version | Role |
|-----------|---------|------|
| **Astro** | ^5.1.8 | Static site framework (SSG) |
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

### Development

| Package | Version | Purpose |
|--------|---------|---------|
| `astro` | ^5.1.8 | Build system & dev server |
| `typescript` | ^5.9.3 | Type checking & compilation |
| `@astrojs/check` | ^0.9.6 | Astro/TypeScript validation |
| `@astrojs/language-server` | ^2.16.3 | IDE language support |
| `@types/node` | ^24.3.1 | Node.js type definitions |

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
src/
├── components/
│   ├── sections/   # Page sections (Header, Hero, Gallery, Contact…)
│   ├── domaine/    # Wine domain components
│   ├── shop/       # Shop/e-commerce components
│   ├── visits/     # Visit booking components
│   └── ui/         # Reusable UI primitives
├── data/           # Hardcoded French content (site, domaine, visits)
├── types/          # TypeScript type definitions
├── scripts/        # Client-side TS modules
├── styles/         # Global CSS
└── pages/          # File-based routing (/, /domaine, /boutique, /visites)
```

**Pages:**
- `/` — Homepage
- `/domaine` — The wine domain
- `/boutique` — Shop
- `/visites` — Visit bookings

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
| **Environment variables** | None required |
| **Runtime** | None (static files only) |

---

## Localization

- Language: **French (fr)**
- All content is in French; no i18n library used

---

## Code Quality

| Tool | Purpose |
|-----|---------|
| TypeScript strict mode | Type safety |
| `astro check` | Component validation |
| Zero runtime vulnerabilities | Static site, no server-side attack surface |
