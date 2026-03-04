# Plan SEO Périnade — Audit complet & feuille de route
> Date d'audit : 02/03/2026 · Site : Astro 5 · 3 langues (FR/EN/ES)

---

## Résumé exécutif

Le site dispose d'une base technique SEO solide (canonicals, hreflang, JSON-LD sur toutes les pages, sitemap multilingue). Les gains les plus rapides viendront de :
1. Corriger les erreurs de parsing JSON-LD (dates BlogPosting non-ISO)
2. Ajouter les `image` manquants dans les schemas Product et Event
3. Injecter les mots-clés locaux dans le contenu visible (H2, paragraphes)
4. Créer des pages d'articles individuelles pour le blog (longue traîne)
5. Corriger l'URL hreflang ES de la page Domaine

---

## AXE 1 — Mots-clés locaux dans le contenu visible

### Constat

Les mots-clés à fort potentiel local sont présents dans les `<title>`, `<meta description>` et JSON-LD **mais absents ou rares dans le contenu HTML visible** (H1, H2, paragraphes). Google pondère fortement le contenu on-page.

| Mot-clé cible | Présence meta | Présence contenu visible | Gap |
|---|---|---|---|
| "dégustation vin Carcassonne" | ✅ title/desc visites | ⚠️ absent H1/H2 | Fort |
| "visite cave Minervois" | ✅ JSON-LD | ❌ le site dit "visite du chai" | Fort |
| "oenotourisme Languedoc" | ✅ desc domaine | ⚠️ 2 occurrences seulement | Moyen |
| "vignoble AOP Minervois" | ✅ partout | ✅ présent | OK |
| "tourisme viticole Aude" | ❌ absent | ❌ absent | Fort |
| "sortie vin Carcassonne" | ❌ absent | ❌ absent | Moyen |
| "activité œnotouristique Languedoc" | ⚠️ partiel | ⚠️ partiel | Moyen |

### Actions concrètes

#### Page Visites (`src/data/visits-fr.ts`)

**Priorité : HAUTE**

Ajouter dans `hero.body` la phrase :
> "…à 15 minutes de Carcassonne. Idéal pour une **dégustation vin près de Carcassonne** ou une **activité œnotouristique dans l'Aude**."

Ajouter dans `timeline.body` :
> "1 h 30 d'immersion totale dans le **vignoble Minervois**, guidée par notre vigneron."
*(déjà présent — maintenir)*

Modifier `access.body` pour intégrer :
> "…à 15 km de **Carcassonne (Aude)**, au cœur du **Minervois**, avec parking gratuit."

Ajouter un bloc de contenu rédactionnel dans `visitsPage.pairing.body` ou créer une section `intro` SEO :

```
Bienvenue au Domaine de la Périnade pour une visite cave et dégustation unique en
Languedoc. Notre formule de tourisme viticole en Aude vous emmène dans les vignes
AOP Minervois, le chai et le caveau pour une dégustation commentée de 5 cuvées,
à 15 minutes de Carcassonne.
```

**Fichier à modifier :** `src/data/visits-fr.ts` (et variantes EN/ES)
**Composant concerné :** `src/components/visits/VisitHero.astro`, `AccessSection.astro`

---

#### Page Boutique (`src/data/shop-fr.ts`)

**Priorité : HAUTE**

Les descriptions produit sont très courtes (10–15 mots) — insuffisant pour le SEO de page produit. Ajouter un bloc éditorial `intro` dans `productGrid` :

```ts
intro: "Commandez directement nos vins AOP Minervois et IGP Pays d'Oc : rouges,
blancs et rosés du Languedoc, produits sur notre domaine familial à 15 km de
Carcassonne. Livraison soignée en 48-72 h en France."
```

Allonger les descriptions produit pour inclure les appellations et le terroir :
- Cuvée du Domaine : ajouter "Grenache et Cabernet Franc du Minervois…"
- Grande Réserve : ajouter "élevé en fûts de chêne sur notre domaine de l'Aude…"

**Fichier à modifier :** `src/data/shop-fr.ts`, `src/components/shop/ShopProductGrid.astro`

---

#### Page Domaine (`src/data/domaine-fr.ts`)

**Priorité : MOYENNE**

Déjà relativement riche. Ajouter dans `terroir.body` :
> "…façonne la minéralité et la fraîcheur singulières de nos cuvées. Ce **tourisme viticole dans le Languedoc** s'inscrit dans une région classée parmi les plus beaux vignobles de France."

Ajouter "visite cave" comme terme alternatif à "visite du chai" dans `visitCta.details`.

---

#### Page Accueil (`src/data/site-fr.ts`)

**Priorité : MOYENNE**

Le champ `experience.infoLine` (actuellement : "Sur rendez-vous uniquement · Parking gratuit · Accès facile depuis Carcassonne") doit intégrer "dégustation" :
> "Dégustation guidée · Sur rendez-vous · Près de Carcassonne · Parking gratuit"

Dans `history.body[0]`, ajouter "oenotourisme Languedoc" naturellement :
> "…nous cultivons nos vignes dans le respect des traditions, et partageons notre passion à travers un **oenotourisme** ancré dans le **Languedoc**."

---

## AXE 2 — Audit et corrections Structured Data JSON-LD

### 2.1 Home (`src/pages/index.astro`)

**Erreurs critiques :**

| Champ | Problème | Correction |
|---|---|---|
| `servesCuisine` | Propriété de `Restaurant`, non de `Winery` | Supprimer ou remplacer par `makesOffer` |
| Manque `image` | Google exige une image pour les rich results LocalBusiness | Ajouter `"image": "https://www.perinade.fr/assets/perinade/hero-vineyard.png"` |
| Manque `@id` | Recommandé pour l'Entity linking | Ajouter `"@id": "https://www.perinade.fr/#winery"` |

**Fichier à modifier :** `src/pages/index.astro`

Bloc JSON-LD corrigé (extrait) :
```json
{
  "@context": "https://schema.org",
  "@type": "Winery",
  "@id": "https://www.perinade.fr/#winery",
  "name": "Domaine de la Périnade",
  "image": "https://www.perinade.fr/assets/perinade/hero-vineyard.png",
  ...
  // Supprimer "servesCuisine"
}
```

---

### 2.2 Page Visites (`src/pages/visites.astro`)

**Erreurs et manques :**

| Champ | Problème | Correction |
|---|---|---|
| `startDate` hardcodé "2026-03-01" | Deviendra invalide en 2027 | Calculer dynamiquement avec `new Date().toISOString().split("T")[0]` |
| Manque `duration` | Fortement recommandé pour Event | Ajouter `"duration": "PT1H30M"` |
| Manque `image` dans chaque Event | Améliore l'affichage dans SERP | Ajouter URL absolue de l'image hero des visites |
| Visite gourmande sans `aggregateRating` | Incohérence avec visite standard | Copier le bloc aggregateRating |
| Type `ItemList > Event` | Acceptable mais `TouristTrip` est plus précis | Remplacer ou ajouter `"@type": ["Event", "TouristTrip"]` |

**Fichier à modifier :** `src/pages/visites.astro`

Exemple de correction pour `startDate` :
```js
const today = new Date().toISOString().split("T")[0];
const endOfYear = `${new Date().getFullYear()}-12-31`;
// Utiliser today et endOfYear dans le JSON-LD
```

---

### 2.3 Page Boutique (`src/pages/boutique.astro`)

**Erreurs et manques :**

| Champ | Problème | Correction |
|---|---|---|
| Manque `image` dans chaque Product | **Requis** pour apparaître dans Google Shopping / rich results | Ajouter l'URL absolue de chaque image produit |
| Manque `aggregateRating` sur les produits | Améliore le CTR (étoiles dans SERP) | Ajouter avec les données des avis existants |
| Manque `sku` | Recommandé pour les marchands | Ajouter un identifiant unique par produit |
| URL produits identiques | Tous pointent vers "/boutique" | Ajouter des ancres (#cuvee-domaine, #grande-reserve…) et les utiliser dans les `url` des Offers |
| `priceValidUntil` hardcodé 2026-12-31 | À dynamiser | Calculer la fin d'année dynamiquement |

**Fichier à modifier :** `src/pages/boutique.astro`, `src/data/shop-fr.ts`

Exemple de Product corrigé :
```json
{
  "@type": "Product",
  "name": "Cuvée du Domaine — AOP Minervois Rouge 2022",
  "image": "https://www.perinade.fr/assets/perinade/shop/img-2.png",
  "sku": "PERINADE-CUVEE-DOM-2022",
  "description": "Rouge AOP Minervois 2022. Fruits noirs, garrigue, épices douces...",
  "brand": { "@type": "Brand", "name": "Domaine de la Périnade" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5"
  },
  "offers": {
    "@type": "Offer",
    "price": "12.50",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31",
    "url": "https://www.perinade.fr/boutique#cuvee-domaine"
  }
}
```

---

### 2.4 Page Domaine (`src/pages/domaine.astro`)

**Manques mineurs :**

| Champ | Problème | Correction |
|---|---|---|
| Manque `image` | Recommandé pour LocalBusiness | Ajouter URL image hero |
| `@id` absent | Recommandé | Ajouter `"@id": "https://www.perinade.fr/domaine#winery"` |

---

### 2.5 Page Actualités (`src/pages/actualites.astro`)

**Erreurs critiques :**

| Champ | Problème | Correction |
|---|---|---|
| `datePublished: "Janvier 2026"` | **Format non-ISO 8601** — Google ne peut pas parser | Remplacer par `"2026-01"` ou mieux `"2026-01-15"` |
| `url` de chaque BlogPosting pointe vers "/actualites" | Pas d'URL canonique unique | Créer des pages individuelles (voir Axe 4) ou utiliser des ancres (`/actualites#millesime-2025`) |
| Manque `image` dans BlogPosting | Recommandé pour les rich results d'articles | Ajouter une image représentative |
| Manque `dateModified` | Recommandé | Ajouter |

**Fichier à modifier :** `src/pages/actualites.astro`

Correction immédiate (avant création des pages individuelles) :
```js
const articles = [
  {
    date: "2026-01-15",  // Format ISO
    dateDisplay: "Janvier 2026",  // Pour l'affichage
    tag: "Millésime",
    slug: "millesime-2025-vendange-minervois",
    // ...
  },
  // ...
];
```

---

### 2.6 BreadcrumbList — à ajouter sur toutes les pages secondaires

**Priorité : MOYENNE**

Ajouter sur `/visites`, `/boutique`, `/domaine`, `/actualites` un schema BreadcrumbList :

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://www.perinade.fr"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Visites & Dégustations",
      "item": "https://www.perinade.fr/visites"
    }
  ]
}
```

Le BaseLayout accepte déjà un tableau JSON-LD via `JSON.stringify([...])` (voir boutique.astro pour l'exemple). Passer un tableau `[breadcrumb, mainSchema]`.

**Fichier à modifier :** `src/pages/visites.astro`, `src/pages/boutique.astro`, `src/pages/domaine.astro`, `src/pages/actualites.astro`

---

## AXE 3 — Pages pauvres en texte indexable

### Diagnostic ratio contenu/visuel

| Page | Texte indexable estimé | Problème principal |
|---|---|---|
| Accueil | ~400 mots | Sections courtes, beaucoup de visuels animés |
| Visites | ~600 mots | Bon, mais le booking calendar est JS-only |
| Boutique | ~250 mots | **Critique** — descriptions produit minimalistes |
| Domaine | ~700 mots | Bon, mais la timeline est en onglets (JS) |
| Actualités | ~600 mots | Bon mais pas de pages individuelles |

### Blocs de contenu rédactionnel à ajouter

#### Boutique — section intro à créer

**Priorité : HAUTE** — Fichier : `src/data/shop-fr.ts` + nouveau composant ou modif `ShopHero`

Bloc à insérer après le hero, avant la grille produits :

```
Nos vins AOP Minervois et IGP Pays d'Oc sont produits sur le Domaine de la Périnade,
vignoble familial de 40 hectares situé dans l'Aude, entre Canal du Midi et Fresquel,
à 15 km de Carcassonne. Grenache, Cabernet Franc, Merlot et Cabernet Sauvignon
composent notre palette aromatique, selon les cépages et les millésimes.
Commandez directement au domaine : nos bouteilles vous parviennent en 48-72 h,
emballées avec soin.
```

#### Boutique — section "À propos des appellations"

À ajouter dans `ShopDomainSelection` ou en section dédiée :

```
L'AOP Minervois est l'une des appellations phares du Languedoc occidental, reconnue
pour ses rouges généreux et ses blancs aromatiques. Le Domaine de la Périnade
produit également sous IGP Pays d'Oc, appellation plus souple permettant d'exprimer
une plus grande diversité de cépages.
```

#### Visites — paragraphe intro SEO

À intégrer dans `AccessSection` ou `TrustBar` :

```
Le Domaine de la Périnade propose des visites guidées et dégustations toute l'année,
à 15 minutes de Carcassonne dans l'Aude. Une expérience d'oenotourisme unique au
cœur du Minervois : promenade dans les vignes, visite du caveau et chai, dégustation
commentée de 5 cuvées par le vigneron lui-même.
```

#### Domaine — "Nos engagements environnementaux"

Un bloc de contenu sur HVE/zéro glyphosate est déjà dans les données mais devrait être plus développé pour le SEO (mots-clés : "viticulture durable Languedoc", "vin bio Aude", "HVE Minervois").

---

## AXE 4 — Création de la section Actualités/Blog (longue traîne)

### Constat

La page `/actualites` existe et a du contenu, mais **tous les articles sont sur la même URL**. Il n'y a pas de pages individuelles, ce qui empêche :
- Le SEO longue traîne par article ("millésime 2025 Minervois", "portes ouvertes domaine viticole Languedoc")
- Les rich results d'articles (Google Actualités, AMP, Discovery)
- Le maillage interne (chaque article pointe vers la même page)

### Architecture recommandée

Passer à un système **Content Collections Astro** avec des fichiers Markdown :

```
src/
  content/
    config.ts          ← définition de la collection
    actualites/
      millesime-2025-vendange-minervois.md
      oenotourisme-experience-remarquable-languedoc.md
      blanc-reserve-aop-minervois-2022.md
      portes-ouvertes-2025.md
  pages/
    actualites/
      index.astro      ← liste des articles (remplace actualites.astro)
      [slug].astro     ← page individuelle d'article
    en/
      news/
        index.astro
        [slug].astro
    es/
      noticias/
        index.astro
        [slug].astro
```

### Fichiers à créer / modifier

| Fichier | Action | Priorité |
|---|---|---|
| `src/content/config.ts` | Créer la collection "actualites" avec champs title, description, pubDate, image, tags, locale | HAUTE |
| `src/content/actualites/*.md` | Créer les 4 articles existants + nouveaux | HAUTE |
| `src/pages/actualites/index.astro` | Remplacer `src/pages/actualites.astro` | HAUTE |
| `src/pages/actualites/[slug].astro` | Créer la page article individuelle avec JSON-LD BlogPosting | HAUTE |
| `src/pages/en/news/[slug].astro` | Version anglaise | MOYENNE |
| `src/pages/es/noticias/[slug].astro` | Version espagnole | MOYENNE |
| `src/pages/sitemap.xml.ts` | Ajouter les URLs des articles individuels | HAUTE |

### Structure d'un article Markdown

```md
---
title: "Millésime 2025 : une vendange de caractère dans le Minervois"
description: "Les vendanges 2025 au Domaine de la Périnade : Grenache, Cabernet Franc et Merlot d'exception sur 40 ha AOP Minervois. Nos observations et perspectives."
pubDate: 2026-01-15
image: "/assets/perinade/actualites/millesime-2025.jpg"
tags: ["Millésime", "Vignoble", "AOP Minervois"]
locale: "fr"
---

## Contenu de l'article...
```

### Idées de sujets pour la longue traîne (mots-clés à volume)

- "comment se déroule une dégustation de vin en Languedoc" (guide)
- "meilleure période pour visiter un domaine viticole Languedoc"
- "différence AOP Minervois vs IGP Pays d'Oc"
- "accords mets vins avec les cuvées Minervois"
- "oenotourisme Carcassonne : que faire et où aller"
- "vendanges 2025 Minervois : bilan et millésime"
- "recettes accord vin rouge Minervois et fromages du Languedoc"

---

## AXE 5 — Audit hreflang et canonicals

### État actuel

| Page | Canonical | hreflang FR | hreflang EN | hreflang ES | x-default | Problème |
|---|---|---|---|---|---|---|
| Accueil `/` | ✅ | ✅ `/` | ✅ `/en` | ✅ `/es` | ✅ `→/` | — |
| Visites `/visites` | ✅ | ✅ `/visites` | ✅ `/en/visits` | ✅ `/es/visitas` | ✅ `→/visites` | — |
| Boutique `/boutique` | ✅ | ✅ `/boutique` | ✅ `/en/shop` | ✅ `/es/tienda` | ✅ `→/boutique` | — |
| Domaine `/domaine` | ✅ | ✅ `/domaine` | ✅ `/en/domaine` | ⚠️ `/es/domaine` | ✅ `→/domaine` | **URL ES = chemin FR** |
| Actualités `/actualites` | ✅ | ✅ `/actualites` | ✅ `/en/news` | ✅ `/es/noticias` | ✅ `→/actualites` | — |

### Problème #1 — URL espagnole de Domaine

La page `/es/domaine` utilise le même segment d'URL que la version française. Il faudrait idéalement `/es/dominio` pour une cohérence sémantique (mais ce n'est pas un bug bloquant pour Google).

**Option A (simple)** : Garder `/es/domaine` et s'assurer que le hreflang est correct (c'est le cas).

**Option B (propre)** : Renommer en `/es/dominio` et mettre à jour :
- `src/pages/es/domaine.astro` → renommer le fichier en `dominio.astro`
- `src/pages/domaine.astro` → alternates
- `src/pages/en/domaine.astro` → alternates
- `src/pages/sitemap.xml.ts` → mettre à jour l'URL ES

**Recommandation :** Option A pour l'instant (priorité basse).

---

### Problème #2 — Codes hreflang sans région

Actuellement les hreflang utilisent `fr`, `en`, `es`. Google recommande `fr-FR`, `en-GB`, `es-ES` pour une meilleure pertinence géographique.

**Fichier à modifier :** `src/i18n/locales.ts`

```ts
// Actuel
export const localeHtmlLang: Record<Locale, string> = {
  fr: "fr",
  en: "en",
  es: "es"
};

// Recommandé pour hreflang
export const localeHreflang: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",  // ou "en-US" selon la cible
  es: "es-ES"
};
```

Puis dans `BaseLayout.astro`, utiliser `localeHreflang[a.locale]` pour les balises `rel="alternate"`.

**Priorité : BASSE** — Les codes courts fonctionnent. À faire lors d'une refonte de l'i18n.

---

### Problème #3 — Sitemap sans articles individuels

Une fois l'Axe 4 implémenté, le sitemap doit inclure les URLs des articles.

**Fichier à modifier :** `src/pages/sitemap.xml.ts`

```ts
// Ajouter après les urlGroups statiques :
import { getCollection } from "astro:content";
const articles = await getCollection("actualites");

for (const article of articles) {
  const frPath = `/actualites/${article.slug}`;
  // Construire les alternates EN/ES selon les slugs traduits
  urls.push(`  <url>
    <loc>${siteUrl}${frPath}</loc>
    <lastmod>${article.data.pubDate.toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
}
```

---

### Problème #4 — `og:locale` utilise le code court

Dans `BaseLayout.astro` ligne 74 : `<meta property="og:locale" content={lang} />` utilise `fr`, `en`, `es`.

Facebook/OG recommande le format `fr_FR`, `en_US`, `es_ES`.

**Fichier à modifier :** `src/layouts/BaseLayout.astro`

```astro
const ogLocaleMap: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES"
};
const ogLocale = ogLocaleMap[locale];
```

**Priorité : BASSE.**

---

## Récapitulatif — Ordre de priorité et fichiers

### 🔴 Priorité HAUTE (impact SEO immédiat)

| # | Action | Fichier(s) | Effort |
|---|---|---|---|
| 1 | Corriger `datePublished` BlogPosting en format ISO | `src/pages/actualites.astro` | 30 min |
| 2 | Ajouter `image` dans tous les schemas Product (boutique) | `src/pages/boutique.astro` | 1h |
| 3 | Ajouter `image` dans les schemas Event (visites) | `src/pages/visites.astro` | 30 min |
| 4 | Dynamiser `startDate` des Events (calculer `new Date()`) | `src/pages/visites.astro` | 30 min |
| 5 | Ajouter bloc texte intro SEO dans la boutique | `src/data/shop-fr.ts` + `ShopProductGrid.astro` | 1h |
| 6 | Injecter mots-clés locaux dans visites H2/paragraphes | `src/data/visits-fr.ts` | 1h |
| 7 | Supprimer `servesCuisine` et ajouter `image` + `@id` sur Winery home | `src/pages/index.astro` | 30 min |

### 🟡 Priorité MOYENNE (gains structurels)

| # | Action | Fichier(s) | Effort |
|---|---|---|---|
| 8 | Ajouter BreadcrumbList JSON-LD sur visites, boutique, domaine | Pages .astro concernées | 2h |
| 9 | Ajouter `aggregateRating` sur les Products (boutique) | `src/pages/boutique.astro` | 1h |
| 10 | Ajouter `sku` et ancres d'URL uniques par produit | `src/pages/boutique.astro`, `src/data/shop-fr.ts` | 1h |
| 11 | Ajouter `aggregateRating` sur la Visite Gourmande | `src/pages/visites.astro` | 30 min |
| 12 | Enrichir descriptions produit boutique (cépages, terroir) | `src/data/shop-fr.ts` | 1h |
| 13 | Répliquer toutes les corrections EN et ES | `src/data/shop-en.ts`, `visits-en.ts`, etc. | 3h |

### 🟢 Priorité BASSE (investissement longue traîne)

| # | Action | Fichier(s) | Effort |
|---|---|---|---|
| 14 | Créer Content Collections pour le blog | `src/content/config.ts` + articles Markdown | 4h |
| 15 | Créer pages individuelles d'articles (`[slug].astro`) | `src/pages/actualites/[slug].astro` | 3h |
| 16 | Mettre à jour sitemap avec URLs des articles | `src/pages/sitemap.xml.ts` | 1h |
| 17 | Corriger codes `og:locale` en `fr_FR`, `en_US` | `src/layouts/BaseLayout.astro` | 30 min |
| 18 | Évaluer renommage `/es/domaine` → `/es/dominio` | `src/pages/es/domaine.astro` + sitemap | 1h |
| 19 | Passer hreflang en `fr-FR`, `en-GB`, `es-ES` | `src/i18n/locales.ts` + `BaseLayout.astro` | 1h |
| 20 | Rédiger 4-6 articles SEO longue traîne | Fichiers `.md` dans `src/content/actualites/` | 8h+ |

---

## Points forts à conserver (ne pas modifier)

- Structure canonicals via `BaseLayout.astro` — robuste, ne pas changer
- Sitemap multilingue avec `xhtml:link` — correct, juste à compléter
- `x-default` pointant vers la version FR — correct
- JSON-LD Winery sur l'accueil avec reviews et aggregateRating — base solide
- FAQPage sur la boutique — actif pour les rich results
- Blog JSON-LD sur la page actualités — à conserver et enrichir
- Preload LCP hero image via `heroImageUrl` — bonne pratique performance
