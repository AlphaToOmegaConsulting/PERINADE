# PERINADE — Analyse complète du projet

**Date :** 2026-03-01
**Périmètre :** Audit complet du code source — architecture, qualité, sécurité, performance, accessibilité, SEO, i18n, déploiement
**Branche analysée :** `claude/complete-analysis-DpGxp`

> Ce document remplace l'analyse précédente du 2026-02-28. Il intègre toutes les évolutions réalisées depuis (i18n, SEO, sécurité, boutique).

---

## 1. Vue d'ensemble du projet

**PERINADE** est le site web du **Domaine de la Périnade**, domaine viticole familial près de Carcassonne (Languedoc, France). Le site sert à la fois de vitrine marketing, de plateforme de réservation de visites et de boutique en ligne.

| Attribut | Valeur |
|---|---|
| **Framework** | Astro 5.18 (SSG — rendu statique) |
| **Langage** | TypeScript strict |
| **Style** | CSS natif scoped + custom properties (sans framework) |
| **Polices** | Playfair Display (titres) + Inter (corps) via @fontsource |
| **Déploiement** | Cloudflare Pages |
| **Langues** | FR (défaut) · EN · ES |
| **Pages FR** | 4 — Accueil, Domaine, Visites, Boutique |
| **Pages EN/ES** | 4 × 2 = 8 pages supplémentaires |
| **Composants** | ~95 fichiers Astro répartis en 6 répertoires |
| **JS client** | 9 modules TypeScript vanilla |
| **Dépendances runtime** | 2 (`@fontsource/inter`, `@fontsource/playfair-display`) |
| **Dépendances dev** | 9 (Astro, TypeScript, ESLint, Prettier, plugins) |

---

## 2. Architecture

### 2.1 Structure des répertoires

```
src/
├── assets/perinade/          # Images optimisées (pipeline Astro)
├── components/
│   ├── domaine/              # 7 composants page Domaine
│   ├── patterns/             # 4 composants de pattern réutilisables
│   ├── sections/             # 11 composants sections accueil
│   ├── shop/                 # 6 composants page Boutique
│   ├── ui/                   # Primitives UI (actions, controls, navigation, surfaces)
│   └── visits/               # 10 composants page Visites
├── data/                     # Données statiques localisées
│   ├── index.ts              # Loader central — résolution locale à la build
│   ├── site-{fr,en,es}.ts   # Données page Accueil (×3 locales)
│   ├── domaine-{fr,en,es}.ts # Données page Domaine (×3 locales)
│   ├── visits-{fr,en,es}.ts  # Données page Visites (×3 locales)
│   └── shop-{fr,en,es}.ts   # Données page Boutique (×3 locales)
├── i18n/
│   ├── locales.ts            # Définition locales, helpers localePath / getAlternates
│   ├── routes.ts             # Mapping pageId → chemin par locale
│   ├── ui.ts                 # Chaînes UI partagées (FR/EN/ES)
│   └── contact.ts            # Chaînes formulaire de contact
├── layouts/
│   └── BaseLayout.astro      # Layout HTML complet (SEO, OG, hreflang, JSON-LD)
├── pages/
│   ├── index.astro           # /  (FR)
│   ├── domaine.astro         # /domaine (FR)
│   ├── visites.astro         # /visites (FR)
│   ├── boutique.astro        # /boutique (FR)
│   ├── 404.astro             # Page d'erreur
│   ├── sitemap.xml.ts        # Sitemap dynamique (12 URLs)
│   ├── en/                   # /en, /en/domaine, /en/visits, /en/shop
│   └── es/                   # /es, /es/domaine, /es/visitas, /es/tienda
├── scripts/ui/               # 9 modules JS client
├── styles/                   # global.css (tokens) + CSS par catégorie
├── types/                    # Interfaces TypeScript (6 fichiers)
└── utils/                    # analytics.ts, link.ts, visits-theme.ts
```

### 2.2 Composition des pages

| Page | Sections | Source de données | SEO custom | hreflang | JSON-LD |
|---|---|---|---|---|---|
| **Accueil** (`index.astro`) | 9 sections | `site-fr.ts` | Defaults BaseLayout | ✅ 3 locales | ✅ Winery |
| **Domaine** (`domaine.astro`) | 8 sections | `domaine-fr.ts` | Depuis data file | ✅ | À compléter |
| **Visites** (`visites.astro`) | 11 sections | `visits-fr.ts` | Depuis data file | ✅ | À compléter |
| **Boutique** (`boutique.astro`) | 7 sections | `shop-fr.ts` | Depuis data file | ✅ | À compléter |

### 2.3 Patterns de composants

- **Props-driven :** Toutes les interfaces `Props` sont typées et destructurées
- **Zero framework client :** Aucun React/Vue/Svelte — composants Astro purs
- **CSS scopé :** Chaque composant possède son bloc `<style>` propre
- **Nommage BEM-like :** `.composant__enfant--modificateur` systématique
- **Couche UI réutilisable :** actions (Button, Link, Submit), controls (Accordion, Calendar, Tabs), surfaces (Card, CtaPanel, ProductCard)

---

## 3. Système i18n

### 3.1 Architecture multilingue

L'internationalisation a été intégralement implémentée depuis l'analyse précédente.

| Élément | Implémentation |
|---|---|
| **Config Astro** | `i18n.defaultLocale: "fr"`, `locales: ["fr","en","es"]`, `prefixDefaultLocale: false` |
| **Routing** | FR sans préfixe (`/`, `/visites`) · EN prefixé (`/en`, `/en/visits`) · ES prefixé (`/es`, `/es/visitas`) |
| **Données** | 4 pages × 3 locales = 12 fichiers de données |
| **Loader** | `data/index.ts` — fonctions `getSiteData`, `getDomaineData`, `getVisitsData`, `getShopData` |
| **UI strings** | `i18n/ui.ts` — 17 chaînes partagées (navigation, formulaires, mentions légales) |
| **Contact strings** | `i18n/contact.ts` — labels formulaire localisés |
| **Routes** | `i18n/routes.ts` — mapping `pageId → path` par locale |
| **Helpers** | `localePrefix()`, `localePath()`, `getAlternates()` dans `i18n/locales.ts` |

### 3.2 Scripts i18n

| Script npm | Description |
|---|---|
| `i18n:audit` | Audit de cohérence des traductions |
| `i18n:extract` | Extraction des catalogues traduisibles |
| `i18n:crawl-text` | Crawl du texte visible du site |
| `i18n:spell-fixes` | Corrections orthographiques automatiques (Python) |
| `i18n:verify` | `check + build + audit` — validation complète |

### 3.3 Problèmes i18n restants

| # | Problème | Sévérité |
|---|---|---|
| I18N-1 | Route `/domaine` identique dans les 3 locales — devrait être `/en/estate` en EN | Faible |
| I18N-2 | Pas de sélecteur de langue visible hors du Header | Faible |
| I18N-3 | Complétude des données `shop-en.ts` et `shop-es.ts` à auditer | Moyen |

---

## 4. SEO

### 4.1 État actuel — améliorations depuis la dernière analyse

Toutes les lacunes haute priorité de l'analyse précédente ont été corrigées dans `BaseLayout.astro`.

| Fonctionnalité SEO | Avant (2026-02-28) | Maintenant |
|---|---|---|
| Open Graph (og:title, og:image, og:url…) | ❌ | ✅ Complet |
| Twitter Card | ❌ | ✅ summary_large_image |
| URL canonique (`<link rel="canonical">`) | ❌ | ✅ Via prop `canonicalPath` |
| hreflang alternates | ❌ | ✅ Toutes locales + x-default |
| JSON-LD structured data | ❌ | ✅ Via prop `jsonLd` |
| Preload image LCP | ❌ | ✅ Via prop `heroImageUrl` |
| Skip-to-content link | ❌ | ✅ Localisé (3 langues) |
| Sitemap | ❌ | ✅ `sitemap.xml.ts` (12 URLs) |
| robots.txt | ❌ | ✅ `public/robots.txt` |

### 4.2 JSON-LD sur la page d'accueil

La page d'accueil implémente un JSON-LD de type `Winery` complet. Quelques données à finaliser :

| Champ | Valeur actuelle | Statut |
|---|---|---|
| `telephone` | `"+33 4 68 XX XX XX"` | ⚠️ Placeholder masqué |
| `geo.latitude/longitude` | `43.2 / 2.35` | ⚠️ Approximatif |
| `foundingDate` | `"1830"` | ⚠️ Incohérent avec "depuis 1987" dans la meta description |
| `sameAs` | URLs de base Instagram/Facebook | ⚠️ Liens sans handle réel |
| `email` | `"contact@perinade.fr"` | ✅ À valider |

### 4.3 Problèmes SEO restants

| # | Problème | Sévérité |
|---|---|---|
| SEO-1 | `history.ctaHref: "#contact"` — ancre cassée hors page d'accueil | Haute |
| SEO-2 | Title de l'accueil trop court (`"Domaine de la Périnade"`) — pas de mot-clé AOP/Carcassonne | Moyenne |
| SEO-3 | JSON-LD absent sur `/domaine`, `/visites`, `/boutique` | Moyenne |
| SEO-4 | Sitemap statique (hardcodé) — risque de désynchronisation si pages ajoutées | Faible |
| SEO-5 | `foundingDate` incohérent (`1830` vs `1987`) | Faible |
| SEO-6 | URLs réseaux sociaux dans JSON-LD incomplètes (`sameAs`) | Faible |
| SEO-7 | Pas de breadcrumbs (utile sur futures pages `/vins/[slug]`) | Faible |

---

## 5. Architecture de l'information (IA)

### 5.1 Pages existantes vs. pages manquantes

| Page | Statut | Route | Priorité |
|---|---|---|---|
| Accueil | ✅ Existe | `/` | — |
| Le Domaine | ✅ Existe | `/domaine` | — |
| Visites & Dégustations | ✅ Existe | `/visites` | — |
| Boutique (listing) | ✅ Existe | `/boutique` | — |
| 404 | ✅ Existe | `/404` | — |
| **Fiche vin (×8)** | 🔴 Absente | `/vins/[slug]` | P1 — SEO critique |
| **Mentions légales** | 🔴 Absente | `/mentions-legales` | P0 — légal RGPD |
| **Politique de confidentialité** | 🔴 Absente | `/politique-de-confidentialite` | P0 — légal RGPD |
| **Conditions générales de vente** | 🔴 Absente | `/conditions-generales-de-vente` | P0 — légal RGPD |
| **Actualités** | 🔴 Absente | `/actualites` | P2 — contenu |
| **Contact dédié** | ⚠️ Section uniquement | `/#contact` | P2 — UX |
| **Bandeau cookie** | 🔴 Absent | Composant global | P1 si analytics actif |

**Bilan : 5/13 pages indispensables présentes.** Les 3 pages légales sont obligatoires avant toute mise en production commerciale.

### 5.2 Liens brisés / incohérences de navigation

| Lien | Valeur actuelle | Problème | Cible recommandée |
|---|---|---|---|
| Nav « Actualités » | `/#contact` | Aucune page actualités n'existe | `/actualites` (à créer) |
| `history.ctaHref` | `"#contact"` | Ancre relative cassée hors accueil | `/domaine` |
| Footer « Mentions légales » | `/#contact` | Placeholder `data-todo` | `/mentions-legales` |
| Footer « Politique conf. » | `/#contact` | Placeholder `data-todo` | `/politique-de-confidentialite` |
| Footer « Conditions de vente » | `/#contact` | Placeholder `data-todo` | `/conditions-generales-de-vente` |
| CTA vins « Voir le vin » | `/boutique` | Devrait pointer vers fiche produit | `/vins/[slug]` |

### 5.3 Navigation

| Problème | Sévérité |
|---|---|
| Pas d'état actif (`aria-current="page"`) sur les liens nav | Moyenne |
| Labels desktop en anglais (VISIT, SHOP) sur un site francophone | Faible |
| Ordre nav non optimisé | Faible |

---

## 6. Sécurité

### 6.1 Posture actuelle — améliorations depuis la dernière analyse

| Mesure | Avant | Maintenant |
|---|---|---|
| En-têtes HTTP sécurisés | ❌ | ✅ `public/_headers` (Cloudflare Pages) |
| CSP | ❌ | ✅ `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'` |
| X-Frame-Options | ❌ | ✅ `DENY` |
| X-Content-Type-Options | ❌ | ✅ `nosniff` |
| Referrer-Policy | ❌ | ✅ `strict-origin-when-cross-origin` |
| Permissions-Policy | ❌ | ✅ `camera=(), microphone=(), geolocation=()` |
| 0 vulnérabilités npm | ✅ | ✅ Maintenu |

### 6.2 Problèmes de sécurité restants

| # | Problème | Sévérité |
|---|---|---|
| SEC-1 | **Sinks HTML** — `set:html` dans `Contact.astro` et `ShopDomainSelection.astro` ; `innerHTML` dans `BookingSection.astro`. Sûrs aujourd'hui (constantes locales) mais risque XSS élevé si CMS/API introduit | Moyen |
| SEC-2 | **CSP `style-src unsafe-inline`** — permet l'injection CSS ; difficile à durcir sans audit des `<style>` inline | Moyen |
| SEC-3 | **Placeholder `TODO_FORM_ENDPOINT`** — bloque l'envoi réel du formulaire | Moyen |
| SEC-4 | **Dev server exposé sur LAN** — `host: import.meta.env.DEV ? true : false` | Faible |
| SEC-5 | **Bus factor = 1** — un seul contributeur | Moyen |
| SEC-6 | **Pas de pipeline CI/CD** — pas de `.github/`, pas d'`npm audit` automatisé | Moyen |

---

## 7. Performance

### 7.1 Points forts

- **Sortie statique Astro** — zéro JS par défaut, pré-rendu complet à la build
- **Dépendances minimales** — 2 runtime uniquement
- **Optimisation images** — `<Image>` Astro avec lazy loading natif
- **Polices auto-hébergées** — @fontsource, sans requêtes Google Fonts
- **Espacements fluides** — `clamp()` réduit la complexité CSS
- **Preload LCP** — `<link rel="preload" as="image">` sur l'image hero (implémenté)

### 7.2 Problèmes de performance restants

| # | Problème | Sévérité |
|---|---|---|
| PERF-1 | Pas de stratégie `font-display` — risque FOIT (Flash of Invisible Text) | Moyenne |
| PERF-2 | **Images dupliquées** — présentes dans `public/assets/` ET `src/assets/` | Faible |
| PERF-3 | Page Visites : 52+ CSS custom properties inline | Faible |

---

## 8. Accessibilité

### 8.1 Points forts

- HTML sémantique : `<section>`, `<nav>`, `<article>`, `<figure>`, `<main>` utilisés correctement
- ARIA : `aria-label`, `aria-expanded`, `aria-selected`, `aria-controls`, `aria-live="polite"`, `aria-invalid`
- Navigation clavier : focus trap dans le menu, Tab/Flèches dans timeline et FAQ
- `prefers-reduced-motion` respecté dans scroll-reveal et cursor-orb
- Classe `.sr-only` pour contenu réservé aux lecteurs d'écran
- Focus-visible stylisé (contour doré)
- **Lien skip-to-content** présent et localisé (FR/EN/ES)

### 8.2 Problèmes restants

| # | Problème | Sévérité |
|---|---|---|
| A11Y-1 | Pas d'état actif (`aria-current="page"`) sur les liens de navigation | Moyenne |
| A11Y-2 | Certaines images décoratives manquent `aria-hidden="true"` | Faible |
| A11Y-3 | Icônes SVG flèches dupliquées inline au lieu du composant `Icon` | Faible |

---

## 9. Qualité du code TypeScript

### 9.1 Organisation des types

| Fichier | Rôle | Interfaces |
|---|---|---|
| `types/site.ts` | Page Accueil | ~15 (NavItem, HeroData, WineCard…) |
| `types/domaine.ts` | Page Domaine | ~9 (DomaineTheme, DomaineHeroData…) |
| `types/visits.ts` | Visites/réservation | ~15 (BookingConfig, VisitThemeTokens…) |
| `types/shop.ts` | Boutique | À auditer |
| `types/analytics.ts` | Tracking événements | 2 (UiEventName, UiEventPayload) |
| `types/ui.ts` | Options composants UI | ~6 (HeaderMenuOptions, TabsOptions…) |

### 9.2 Problèmes TypeScript restants

| # | Problème | Sévérité |
|---|---|---|
| TS-1 | **`BookingConfig` défini en double** — dans `types/visits.ts` et `types/ui.ts` | Moyenne |
| TS-2 | `UiEventPayload.meta` typé `Record<string, any>` — trop permissif | Faible |
| TS-3 | Pas de validation runtime (zod/superstruct) — uniquement compile-time | Faible |

---

## 10. JavaScript client

### 10.1 Inventaire des modules

| Module | Lignes | Rôle |
|---|---|---|
| `init.ts` | ~25 | Orchestrateur |
| `header-menu.ts` | 105 | Menu mobile, scroll, clavier |
| `scroll-reveal.ts` | 77 | Animations IntersectionObserver |
| `cursor-orb.ts` | 101 | Curseur personnalisé |
| `faq-accordion.ts` | 66 | Accordéon ARIA |
| `booking-calendar.ts` | 361 | Widget calendrier complet |
| `timeline-tabs.ts` | 87 | Tabs navigables au clavier |
| `contact-form.ts` | 139 | Validation formulaire + mailto + abandon tracking |
| `accordion.ts` | ~50 | Accordion générique |

### 10.2 Améliorations du formulaire de contact

L'ancien problème (formulaire bloqué par un guard générique) est résolu :
- Module dédié `contact-form.ts` avec validation complète des champs
- Support du flux `mailto:` (redirection `window.location.href`)
- Validation email, champs requis, feedback ARIA
- Tracking des abandons de formulaire (`beforeunload`)
- Messages localisés via `data-*` attributes

### 10.3 Problèmes restants

| # | Problème | Sévérité |
|---|---|---|
| JS-1 | `TODO_FORM_ENDPOINT` — si l'action n'est pas `mailto:`, le formulaire affiche une erreur sans envoyer | Moyenne |
| JS-2 | État du calendrier de réservation non persisté (sessionStorage) | Faible |
| JS-3 | Cursor orb : `requestAnimationFrame` sur chaque `mousemove` sans throttle | Faible |
| JS-4 | Analytics incomplets — pas de page views, scroll depth, ni suivi d'erreurs | Faible |

---

## 11. Couche de données

### 11.1 Architecture des données

Tout le contenu est **statique et déclaratif** — stocké dans des fichiers TypeScript, importé au build via le loader central `data/index.ts`.

| Données | Fichiers | Volume |
|---|---|---|
| Accueil | `site-{fr,en,es}.ts` | ~250 lignes × 3 |
| Domaine | `domaine-{fr,en,es}.ts` | ~240 lignes × 3 |
| Visites | `visits-{fr,en,es}.ts` | ~380 lignes × 3 |
| Boutique | `shop-{fr,en,es}.ts` | Variable |

### 11.2 Problèmes restants

| # | Problème | Sévérité |
|---|---|---|
| DATA-1 | Infos de contact (téléphone, email, adresse) répétées dans plusieurs fichiers | Moyenne |
| DATA-2 | Placeholders `TODO_FORM_ENDPOINT`, `TODO_PRIVACY_URL` dans les données | Moyenne |
| DATA-3 | Date de fondation incohérente : `"1830"` (JSON-LD) vs `"depuis 1987"` (meta) | Faible |

---

## 12. CSS & Système de design

### 12.1 Tokens de design (`global.css`)

```
Couleurs :   --color-bg, --color-white, --color-text,
             --color-accent (#c49c6e), --color-cta (#d67400), --color-deep-green (#192b17)
Espacement : 7 échelles fluides via clamp() (--space-xs → --space-2xl)
Typo :       4 tailles (hero, section-xl, section-lg, body)
Breakpoints : tablet (63.9375em / 1023px), mobile (47.9375em / 767px)
Ombres :     --shadow-soft, --shadow-card
Motion :     --motion-duration-enter (620ms), --motion-duration-hover (240ms)
```

### 12.2 Problèmes restants

| # | Problème | Sévérité |
|---|---|---|
| CSS-1 | Valeurs de breakpoints incohérentes entre composants (`63.9375em` vs `1023px` vs `900px`) | Moyenne |
| CSS-2 | Pas de mode sombre | Faible |
| CSS-3 | Pas de styles d'impression | Faible |

---

## 13. Tests & déploiement

### 13.1 Déploiement

- **Plateforme :** Cloudflare Pages — git-based, déployé sur push vers `main`
- **Build :** `npm run build` → `dist/`
- **Gate de validation :** `npm run verify` = `astro check` + `astro build`
- **En-têtes HTTP :** `public/_headers` (déployé automatiquement par Cloudflare Pages)

### 13.2 État des tests

| Type | État |
|---|---|
| Tests unitaires | ❌ Aucun runner configuré |
| Tests d'intégration | ❌ Aucun |
| Tests E2E | ❌ Aucun framework |
| Régression visuelle | ⚠️ Script Pyppeteer pour `/domaine` uniquement |
| CI/CD | ❌ Pas de `.github/workflows/` |

### 13.3 Problèmes restants

| # | Problème | Sévérité |
|---|---|---|
| TEST-1 | Seulement 1 page sur 12 avec couverture de régression visuelle | Moyenne |
| TEST-2 | Pas de tests unitaires ni d'intégration | Moyenne |
| TEST-3 | Pas de pipeline CI/CD | Moyenne |
| TEST-4 | Script Pyppeteer hardcode le chemin Chrome macOS | Faible |

---

## 14. Propriété du code

- **Contributeurs :** 1 (`codex@minidefrancois.home`)
- **Fichiers :** ~170
- **Part de propriété :** 100% mainteneur unique
- **Bus factor :** 1 (risque opérationnel critique)

---

## 15. Synthèse des problèmes prioritisés

### 🔴 Haute priorité (bloquant avant mise en production)

| ID | Catégorie | Problème |
|---|---|---|
| IA-1 | Architecture | 3 pages légales RGPD obligatoires absentes (`/mentions-legales`, `/cgv`, `/politique-de-confidentialite`) |
| IA-2 | Architecture | Liens footer légaux pointent vers `/#contact` (placeholders cassés) |
| SEO-1 | SEO | `history.ctaHref: "#contact"` — lien brisé hors accueil |
| DATA-2 | Données | Placeholders `TODO_FORM_ENDPOINT` et `TODO_PRIVACY_URL` en production |

### 🟡 Priorité moyenne

| ID | Catégorie | Problème |
|---|---|---|
| SEC-1 | Sécurité | Sinks HTML (`set:html`, `innerHTML`) — risque XSS si source de données change |
| SEC-2 | Sécurité | CSP `style-src unsafe-inline` — à durcir |
| SEC-5 | Sécurité | Bus factor = 1 — absence de second mainteneur |
| SEC-6 | Sécurité | Pas de pipeline CI/CD |
| JS-1 | JavaScript | Formulaire contact non fonctionnel sans endpoint réel |
| SEO-2 | SEO | Title accueil sans mots-clés (AOP, Carcassonne) |
| SEO-3 | SEO | JSON-LD absent sur `/domaine`, `/visites`, `/boutique` |
| TS-1 | Types | `BookingConfig` défini en double |
| DATA-1 | Données | Infos de contact répétées dans plusieurs fichiers |
| CSS-1 | CSS | Breakpoints incohérents entre composants |
| I18N-3 | i18n | Complétude des données boutique EN/ES à auditer |
| A11Y-1 | Accessibilité | Pas de `aria-current="page"` sur les liens nav |
| IA-3 | Architecture | Nav « Actualités » pointe vers `/#contact` |
| PERF-1 | Performance | Pas de stratégie `font-display` |
| TEST-1 | Tests | 1 seule page avec couverture de régression visuelle |
| TEST-3 | Tests | Pas de CI/CD |

### 🟢 Faible priorité

| ID | Catégorie | Problème |
|---|---|---|
| SEO-4 | SEO | Sitemap statique hardcodé |
| SEO-5 | SEO | `foundingDate` incohérent (1830 vs 1987) |
| SEO-6 | SEO | URLs réseaux sociaux incomplètes dans JSON-LD |
| JS-2 | JavaScript | État calendrier non persisté |
| JS-3 | JavaScript | Cursor orb sans throttle |
| JS-4 | JavaScript | Analytics incomplets |
| CSS-2 | CSS | Pas de mode sombre |
| CSS-3 | CSS | Pas de styles impression |
| TS-2 | Types | `meta: Record<string, any>` trop permissif |
| SEC-4 | Sécurité | Dev server exposé sur LAN |
| PERF-2 | Performance | Images dupliquées dans `public/` et `src/assets/` |
| I18N-1 | i18n | Route `/domaine` identique dans les 3 locales |
| TEST-4 | Tests | Pyppeteer hardcode le chemin Chrome macOS |
| A11Y-2 | Accessibilité | Images décoratives sans `aria-hidden` |

---

## 16. Points forts du projet

- **Architecture claire** — séparation données/types/composants/pages rigoureuse
- **i18n complet et bien structuré** — 3 locales, loader central, helpers robustes
- **Sécurité HTTP configurée** — en-têtes Cloudflare Pages déployés (`_headers`)
- **SEO de base solide** — OG, Twitter Card, canonique, hreflang, robots.txt, sitemap
- **Accessibilité de qualité** — ARIA, clavier, reduced-motion, skip link localisé
- **Performance par défaut** — Astro SSG, zéro JS si non nécessaire
- **Polices auto-hébergées** — pas de dépendance Google Fonts
- **Typage strict** — interfaces Props explicites sur tous les composants
- **Design system fluide** — `clamp()` et tokens CSS évitent la fragilité des breakpoints
- **Widget réservation complet** — calendrier, créneaux, tarifs, formulaire, validation
- **Formulaire de contact robuste** — validation ARIA, mailto, tracking abandon
- **Dépendances très légères** — 2 packages runtime uniquement

---

## 17. Feuille de route recommandée

### Phase 1 — Avant mise en ligne (bloquant légal et fonctionnel)
1. Créer les 3 pages légales RGPD obligatoires
2. Corriger les liens footer légaux
3. Corriger `history.ctaHref` → `/domaine`
4. Corriger la nav « Actualités » → lien valide ou suppression temporaire
5. Remplacer `TODO_FORM_ENDPOINT` par un endpoint réel (Formspree, Cloudflare Workers…)

### Phase 2 — Dans les 2 premières semaines
6. Ajouter `aria-current="page"` sur les liens de navigation actifs
7. Optimiser le title de l'accueil avec mots-clés SEO (AOP Minervois, Carcassonne)
8. Ajouter JSON-LD sur `/domaine` (LocalBusiness) et `/visites` (TouristAttraction)
9. Corriger l'incohérence `foundingDate` (1830 vs 1987)
10. Mettre en place un pipeline CI/CD minimal (GitHub Actions : check + build + audit)

### Phase 3 — Dans le premier mois
11. Créer les fiches vins `/vins/[slug]` avec JSON-LD Product
12. Ajouter un second mainteneur pour les fichiers de configuration
13. Résoudre les sinks HTML (`set:html` → markup structuré)
14. Éliminer les images dupliquées dans `public/` vs `src/assets/`
15. Implémenter `font-display: swap` sur les polices

### Phase 4 — Améliorations continues
16. Créer `/actualites` avec Astro Content Collections
17. Ajouter un bandeau cookie si analytics activé
18. Implémenter des tests E2E (Playwright) pour toutes les pages
19. Durcir CSP (éliminer `unsafe-inline` pour les styles)
20. Ajouter une page `/contact` dédiée

---

*Fin de l'analyse — 2026-03-01*
