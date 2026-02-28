# PERINADE — Full Project Analysis

**Date:** 2026-02-28
**Scope:** Complete codebase audit — architecture, code quality, security, performance, accessibility, deployment

---

## 1. Project Overview

**PERINADE** is the website for **Domaine de la Périnade**, a family-owned wine estate near Carcassonne (Languedoc region, France). The site serves as both a marketing presence and a booking/e-commerce platform.

| Attribute | Value |
|---|---|
| **Framework** | Astro 5.18 (static site generator) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Scoped CSS + CSS custom properties (no framework) |
| **Fonts** | Playfair Display (headings) + Inter (body) via @fontsource |
| **Deployment** | Cloudflare Pages |
| **Pages** | 4 — Home, Domaine, Visites, Boutique |
| **Components** | 38 Astro components across 5 directories |
| **Client JS** | 7 interactive modules (menu, scroll-reveal, cursor-orb, FAQ, booking calendar, timeline tabs) |
| **Dependencies** | Minimal — only 4 dev deps + 2 runtime deps |

---

## 2. Architecture

### 2.1 Directory Structure

```
src/
├── assets/perinade/        # Optimized images (Astro image pipeline)
├── components/
│   ├── domaine/            # 8 domain-page components
│   ├── sections/           # 11 home-page section components
│   ├── shop/               # 6 shop-page components
│   ├── ui/                 # 3 reusable UI primitives
│   └── visits/             # 10 visits-page components
├── data/                   # Static content data files (site, domaine, visits)
├── layouts/                # BaseLayout.astro
├── pages/                  # 4 Astro pages (index, domaine, visites, boutique)
├── scripts/ui/             # 7 client-side interaction modules
├── styles/                 # global.css (design tokens + base styles)
├── types/                  # TypeScript interfaces (5 files)
└── utils/                  # analytics.ts, link.ts
```

### 2.2 Page Composition

| Page | Sections | Data Source | Custom SEO | Theme Vars |
|---|---|---|---|---|
| **Home** (`index.astro`) | 9 sections | `site.ts` | Defaults from BaseLayout | None |
| **Domaine** (`domaine.astro`) | 8 sections | `site.ts` + `domaine.ts` | From data file | 3 spacing vars |
| **Visites** (`visites.astro`) | 11 sections | `site.ts` + `visits.ts` | From data file | 52+ design tokens |
| **Boutique** (`boutique.astro`) | 7 sections | `site.ts` only | Hardcoded strings | 2 layout vars |

### 2.3 Component Patterns

- **Props-driven:** All 38 components define explicit `Props` interfaces with destructured access
- **Zero client frameworks:** No React/Vue/Svelte — pure Astro server-rendered components
- **Scoped CSS:** Each component has its own `<style>` block; no utility-class framework
- **BEM-like naming:** `.component__child--modifier` pattern used throughout
- **Reusable UI layer:** `ButtonLink` (4 variants), `Icon` (20+ SVGs), `SectionHeading` (eyebrow/title/body)

---

## 3. Design System & CSS

### 3.1 Design Tokens (global.css — 308 lines)

```
Colors:     --color-bg, --color-white, --color-text, --color-accent (#c49c6e),
            --color-cta (#d67400), --color-deep-green (#192b17)
Spacing:    7 fluid scales via clamp() (--space-xs → --space-2xl)
Typography: Hero / section-xl / section-lg / body display sizes
Breakpoints: tablet (63.9375em / 1023px), mobile (47.9375em / 767px)
Shadows:    --shadow-soft, --shadow-card
Motion:     --motion-duration-enter (620ms), --motion-duration-hover (240ms)
```

### 3.2 Responsive Strategy

- **Fluid-first:** `clamp()` for spacing and typography avoids most media queries
- **Three tiers:** Desktop → Tablet (≤1023px) → Mobile (≤767px)
- **Component-level queries:** Each component adjusts its own layout at breakpoints

### 3.3 Issues Found

| # | Issue | Severity |
|---|---|---|
| CSS-1 | Breakpoint values inconsistent across components (`63.9375em` vs `1023px` vs `900px`) | Medium |
| CSS-2 | No dark mode support | Low |
| CSS-3 | No print styles | Low |
| CSS-4 | Overlay gradients hardcoded instead of tokenized | Low |

---

## 4. Type System

### 4.1 Organization

| File | Purpose | Interfaces |
|---|---|---|
| `types/site.ts` | Home page types | ~15 (NavItem, HeroData, WineCard, etc.) |
| `types/domaine.ts` | Domain page types | ~9 (DomaineTheme, DomaineHeroData, etc.) |
| `types/visits.ts` | Visits/booking types | ~15 (BookingConfig, VisitThemeTokens, etc.) |
| `types/analytics.ts` | Event tracking | 2 (UiEventName, UiEventPayload) |
| `types/ui.ts` | UI component options | ~6 (HeaderMenuOptions, TabsOptions, etc.) |

### 4.2 Issues Found

| # | Issue | Severity |
|---|---|---|
| TS-1 | **Duplicate `BookingConfig` type** — defined in both `types/visits.ts` and `types/ui.ts` | Medium |
| TS-2 | `LinkTarget` is just `string` — no validation that targets exist | Low |
| TS-3 | `UiEventPayload.meta` typed as `Record<string, any>` — overly permissive | Low |
| TS-4 | No runtime validation schemas (zod/superstruct) — relies on compile-time only | Low |

---

## 5. Client-Side JavaScript

### 5.1 Module Inventory

| Module | Lines | Purpose |
|---|---|---|
| `init.ts` | ~25 | Orchestrator — calls all other init functions, form guard |
| `header-menu.ts` | 105 | Mobile nav toggle, scroll-based styling, keyboard support |
| `scroll-reveal.ts` | 77 | IntersectionObserver animations (up/left/right/zoom) |
| `cursor-orb.ts` | 101 | Custom cursor with hover/press states (pointer-capable devices only) |
| `faq-accordion.ts` | 66 | Keyboard-navigable accordion with ARIA |
| `booking-calendar.ts` | 361 | Full calendar widget, date/slot/participant selection, form submission |
| `timeline-tabs.ts` | 87 | Keyboard-navigable tabs with panel switching |

### 5.2 Interaction Patterns

- **Data attributes** for component discovery (`data-header`, `data-booking`, `data-faq`, etc.)
- **ARIA support**: `aria-expanded`, `aria-selected`, `aria-controls`, `aria-live`
- **Accessibility**: Focus trap in menu, `prefers-reduced-motion` respected in scroll-reveal and cursor-orb
- **Analytics**: Google Tag Manager pattern (`window.dataLayer.push`) + custom `ui:track` events

### 5.3 Issues Found

| # | Issue | Severity |
|---|---|---|
| JS-1 | `initFormGuards()` prevents ALL `[data-ui-form]` submission — blocks legitimate form actions | Medium |
| JS-2 | Contact form has `mailto:` action but JS `preventDefault` blocks it — form never actually submits | Medium |
| JS-3 | No input validation (email format, participant count bounds, date ranges) | Medium |
| JS-4 | Booking calendar state not persisted to sessionStorage — lost on page reload | Low |
| JS-5 | Cursor orb runs `requestAnimationFrame` on every mousemove — no throttle | Low |
| JS-6 | Only 4 analytics event types tracked — no page views, scroll depth, or error tracking | Low |

---

## 6. Data Layer

### 6.1 Content Architecture

All content is **static and declarative** — stored in TypeScript data files, imported at build time:

- **`data/site.ts`** (241 lines) — Navigation, hero, reasons, experience, gallery, testimonials, history, wines, contact, footer
- **`data/domaine.ts`** (240 lines) — SEO, hero, terroir, family story, timeline (1830–2023), stats, wines, contact
- **`data/visits.ts`** (378 lines) — SEO, full theme tokens, timeline, wines, pricing plans, booking calendar config

### 6.2 Issues Found

| # | Issue | Severity |
|---|---|---|
| DATA-1 | **No `data/shop.ts`** — boutique page has no dedicated data file (hardcoded content in components) | Medium |
| DATA-2 | Contact info (phone, email, address) repeated across multiple data files | Medium |
| DATA-3 | Mixed French/English content with no i18n system | Low |
| DATA-4 | Placeholder values: `TODO_FORM_ENDPOINT`, `TODO_PRIVACY_URL`, masked phone numbers | Low |

---

## 7. SEO

### 7.1 Current Setup

| Page | Title | Description | Source |
|---|---|---|---|
| Home | "Domaine de la Périnade" | "Domaine familial près de Carcassonne..." | BaseLayout defaults |
| Domaine | From `domainePage.seo.title` | From `domainePage.seo.description` | Data file |
| Visites | From `visitsPage.seo.title` | From `visitsPage.seo.description` | Data file |
| Boutique | Hardcoded string | Hardcoded string | Inline props |

### 7.2 Issues Found

| # | Issue | Severity |
|---|---|---|
| SEO-1 | **No Open Graph meta tags** (og:title, og:image, og:url, og:type) — poor social sharing | High |
| SEO-2 | **No canonical URLs** — risk of duplicate content indexing | High |
| SEO-3 | Inconsistent SEO implementation — some pages use data files, others hardcode, home uses defaults | Medium |
| SEO-4 | No structured data / JSON-LD (LocalBusiness, Product, Event schemas) | Medium |
| SEO-5 | No sitemap.xml or robots.txt | Medium |
| SEO-6 | Favicon only in PNG — missing .ico, SVG, manifest.json | Low |

---

## 8. Accessibility

### 8.1 Strengths

- Semantic HTML: `<section>`, `<nav>`, `<article>`, `<figure>` used correctly
- ARIA: `aria-label`, `aria-expanded`, `aria-selected`, `aria-controls`, `aria-live="polite"`, `aria-invalid`
- Keyboard navigation: Menu focus trap, tab/arrow key support in timeline and FAQ
- `prefers-reduced-motion`: Respected in scroll-reveal and cursor-orb
- `sr-only` class for screen-reader-only content
- Focus-visible states styled with gold outline

### 8.2 Issues Found

| # | Issue | Severity |
|---|---|---|
| A11Y-1 | **No skip-to-content link** in Header | Medium |
| A11Y-2 | FAQ accordion lacks focus trap for keyboard users | Low |
| A11Y-3 | Some decorative images missing `aria-hidden="true"` | Low |
| A11Y-4 | SVG arrow icons duplicated inline (4 instances) instead of using Icon component | Low |

---

## 9. Security

### 9.1 Current Posture

- **0 known npm vulnerabilities** (`npm audit` clean)
- **No runtime server code** — static site only (reduces attack surface significantly)
- Previously remediated lodash advisory via `yaml-language-server` override

### 9.2 Issues Found

| # | Issue | Severity |
|---|---|---|
| SEC-1 | **No security headers** — no CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy | High |
| SEC-2 | **HTML injection sinks** — `set:html` in Contact, ShopDomainSelection; `innerHTML` in BookingSection. Safe today (local constants) but dangerous if content source changes to CMS/API | Medium |
| SEC-3 | Multiple inline `<script>` blocks make future CSP enforcement difficult (`unsafe-inline` required) | Medium |
| SEC-4 | Dev server network-exposed (`server.host: true` in astro.config.mjs) — reachable on LAN | Low |
| SEC-5 | Single maintainer (bus factor = 1) — no secondary reviewer for package.json, config | Medium |
| SEC-6 | No CI/CD pipeline — no automated `npm audit`, type checks, or build gates | Medium |

---

## 10. Performance

### 10.1 Strengths

- **Minimal dependencies** — only 6 packages total (2 runtime, 4 dev)
- **Static output** — Astro pre-renders everything at build time; zero JS shipped by default
- **Image optimization** — Astro `<Image>` component with lazy loading
- **Self-hosted fonts** — @fontsource avoids external requests
- **Fluid spacing** — `clamp()` reduces CSS complexity

### 10.2 Issues Found

| # | Issue | Severity |
|---|---|---|
| PERF-1 | No font-display strategy — risk of FOIT (Flash of Invisible Text) | Medium |
| PERF-2 | No font preload hints in `<head>` | Low |
| PERF-3 | Visits page sets 52+ CSS custom properties inline | Low |
| PERF-4 | Images in `public/` duplicated from `src/assets/` — doubles image count | Low |

---

## 11. Deployment & Testing

### 11.1 Deployment

- **Platform:** Cloudflare Pages
- **Build:** `npm run build` → `dist/`
- **Validation gate:** `npm run verify` = `astro check` + `astro build`
- **Post-deploy:** Manual smoke test on 4 routes

### 11.2 Testing

- **Visual regression:** Pyppeteer script (`scripts/pyppeteer_domaine_verify.py`) covers `/domaine` page
  - 3 viewports (desktop 1440px, tablet 1024px, mobile 390px)
  - Full-page + component screenshots
  - Interactive tab testing, image audit, CTA link verification
- **No unit tests** — no test runner configured
- **No E2E framework** — single Pyppeteer script for one page only

### 11.3 Issues Found

| # | Issue | Severity |
|---|---|---|
| TEST-1 | Only 1 of 4 pages has visual regression coverage | Medium |
| TEST-2 | No unit/integration tests | Medium |
| TEST-3 | No CI/CD pipeline for automated testing | Medium |
| TEST-4 | Pyppeteer script hardcodes macOS Chrome path | Low |

---

## 12. Code Ownership

- **Contributors:** 1 (`codex@minidefrancois.home`)
- **Total files:** 166
- **Touch share:** 100% single maintainer
- **Bus factor:** 1 (critical risk)

---

## 13. Summary of All Issues (Prioritized)

### High Priority

| ID | Category | Issue |
|---|---|---|
| SEO-1 | SEO | No Open Graph meta tags |
| SEO-2 | SEO | No canonical URLs |
| SEC-1 | Security | No security headers (CSP, X-Frame-Options, etc.) |

### Medium Priority

| ID | Category | Issue |
|---|---|---|
| JS-1 | JavaScript | Form guard blocks all form submission |
| JS-2 | JavaScript | Contact form never submits (mailto blocked by JS) |
| JS-3 | JavaScript | No input validation on forms |
| SEC-2 | Security | HTML injection sinks (`set:html`, `innerHTML`) |
| SEC-3 | Security | Inline scripts prevent CSP adoption |
| SEC-5 | Security | Single maintainer / bus factor = 1 |
| SEC-6 | Security | No CI/CD pipeline |
| SEO-3 | SEO | Inconsistent SEO implementation across pages |
| SEO-4 | SEO | No structured data (JSON-LD) |
| SEO-5 | SEO | No sitemap.xml or robots.txt |
| TS-1 | Types | Duplicate BookingConfig definition |
| DATA-1 | Data | No dedicated shop data file |
| DATA-2 | Data | Contact info duplicated across files |
| CSS-1 | CSS | Inconsistent breakpoint values |
| PERF-1 | Performance | No font-display strategy |
| TEST-1 | Testing | Only 1/4 pages has visual regression tests |
| TEST-2 | Testing | No unit/integration tests |
| TEST-3 | Testing | No CI/CD pipeline |
| A11Y-1 | Accessibility | No skip-to-content link |

### Low Priority

| ID | Category | Issue |
|---|---|---|
| DATA-3 | Data | Mixed French/English with no i18n |
| DATA-4 | Data | Placeholder TODO values in production config |
| JS-4 | JavaScript | Booking state not persisted |
| JS-5 | JavaScript | Cursor orb not throttled |
| JS-6 | JavaScript | Incomplete analytics coverage |
| CSS-2 | CSS | No dark mode |
| CSS-3 | CSS | No print styles |
| TS-2 | Types | LinkTarget is unvalidated string |
| SEC-4 | Security | Dev server exposed on LAN |
| PERF-2 | Performance | No font preload hints |
| PERF-4 | Performance | Duplicate images in public/ and src/assets/ |
| SEO-6 | SEO | Single favicon format |
| A11Y-2 | Accessibility | FAQ accordion lacks focus trap |
| TEST-4 | Testing | Pyppeteer script hardcodes macOS path |

---

## 14. Strengths

- **Clean architecture** — well-separated data/types/components/pages
- **Minimal dependencies** — lean dependency tree reduces supply chain risk
- **Strong type safety** — explicit Props interfaces on all 38 components
- **Good accessibility foundation** — ARIA, keyboard nav, reduced-motion, focus management
- **Fluid responsive design** — clamp()-based system avoids breakpoint brittleness
- **Performance by default** — Astro's static output ships zero JS unless opted in
- **Self-hosted fonts** — eliminates Google Fonts privacy/performance concerns
- **Comprehensive booking widget** — full calendar, slot selection, pricing calculator

---

*End of analysis.*
