# Audit IA & SEO structurel — Domaine de la Périnade

> Réalisé le 2026-02-28 · Framework : Astro 5 (SSG) · Branche : `claude/audit-winery-structure-YsDig`

---

## 1. Inventaire réel des routes/pages

### 1.1 Pages existantes (fichiers `src/pages/`)

| # | Route | Fichier | Template | Source de données | Liens entrants |
|---|-------|---------|----------|-------------------|----------------|
| 1 | `/` | `src/pages/index.astro` | Page d'accueil « magazine » (Hero, Reasons, Experience, Gallery, Testimonials, History, Wines, Contact) | `src/data/site.ts` | Logo header, nav « Accueil » (mobile), footer nav, ancres internes `#contact`, `#experience`, `#histoire` |
| 2 | `/domaine` | `src/pages/domaine.astro` | Page éditoriale long-form (DomaineHero, Terroir, FamilyStory, Timeline, Stats, WinesShowcase, Contact) | `src/data/domaine.ts` | Header nav « DOMAINE », footer nav « Le Domaine » |
| 3 | `/visites` | `src/pages/visites.astro` | Page conversion (VisitHero, TrustBar, Timeline, Wines, Pricing, Access, Booking, FinalCta) | `src/data/visits.ts` | Header nav « VISIT », footer nav « Visites », CTA header global, quick-action mobile « Réserver », ancres `#booking` |
| 4 | `/boutique` | `src/pages/boutique.astro` | Page e-commerce (ShopHero, ProductGrid, DomainSelection, CaseComposer, CtaBand, FAQ) | *(hardcodé dans composants)* | Header nav « SHOP », footer nav « Boutique », quick-action mobile « Boutique », CTA vins accueil/domaine |

### 1.2 Routes dynamiques existantes

**Aucune.** Il n'existe aucun fichier `[slug].astro` ou `[...slug].astro` dans le projet.

### 1.3 Pages référencées mais absentes

| Référence dans le code | Valeur actuelle | Page manquante |
|------------------------|-----------------|----------------|
| Nav header « ACTUALITES » | `/#contact` (ancre d'accueil) | `/actualites` |
| Nav header « Contact » | `/#contact` | `/contact` ou page dédiée |
| Footer « Mentions légales » | `/#contact` (`data-todo`) | `/mentions-legales` |
| Footer « Politique de confidentialité » | `/#contact` (`data-todo`) | `/politique-de-confidentialite` |
| Footer « Conditions de vente » | `/#contact` (`data-todo`) | `/conditions-generales-de-vente` |
| Footer « Presse » | `/#contact` (`data-todo`) | `/presse` (optionnel) |
| CTA vins accueil/domaine « Voir le vin » | `/boutique` (listing) | `/vins/[slug]` (fiche produit) |
| `history.ctaHref` | `"#contact"` (ancre relative) | Fonctionne uniquement sur l'accueil — cible `/#contact` cassée ailleurs |

---

## 2. Audit IA (Information Architecture)

### 2.1 Navigation header

```
VISIT | SHOP | [LOGO] | DOMAINE | ACTUALITES | [CTA: Réserver]
```

**Problèmes identifiés :**

| Problème | Criticité | Détail |
|----------|-----------|--------|
| « ACTUALITES » → `/#contact` | 🔴 Critique | Pointe vers une ancre de la page d'accueil ; aucune page actualités n'existe |
| « Contact » absent du header desktop | 🟡 Moyen | Présent en mobile mais absent du slot desktop ; le CTA « Réserver » ne remplace pas un lien Contact |
| Libellés bilingues incohérents | 🟡 Moyen | Desktop en anglais (VISIT, SHOP, DOMAINE) et mobile en français (Visites, Boutique) — mélange de langues dans un site FR |
| Ordre de navigation non optimisé | 🟠 Faible | L'ordre logique serait : Domaine → Vins/Boutique → Visites → Actualités → Contact |
| Aucun état « actif » sur les liens nav | 🟡 Moyen | Aucun `aria-current="page"` ni classe active ; le visiteur ne sait pas où il est |

### 2.2 Navigation footer

**Structure footer actuelle :**

```
[Marque + about]   [Navigation]           [Informations]        [Newsletter]
                   Accueil                Mentions légales      …
                   Visites                Politique conf.
                   Boutique               Conditions de vente
                   Le Domaine             Presse
                   Actualites
                   Contact
```

**Problèmes :**

| Problème | Criticité |
|----------|-----------|
| Toutes les pages légales pointent vers `/#contact` (placeholder `data-todo`) | 🔴 Critique — obligation légale RGPD |
| « Actualites » et « Contact » répètent les mêmes ancres cassées que dans le header | 🔴 Critique |
| Accentuation manquante : « Actualites » au lieu de « Actualités », « Politique de confidentialite » | 🟡 Moyen |
| Pas de lien « Plan du site » ni « FAQ » dans le footer | 🟠 Faible |

### 2.3 Profondeur de navigation

```
Niveau 0 (racine) : / , /domaine , /visites , /boutique
Niveau 1 (manquant) : /vins/[slug] , /actualites/[slug]
Niveau 0 (manquant) : /actualites , /contact , /mentions-legales , /politique-de-confidentialite , /cgv
```

Architecture actuelle : **complètement plate (1 niveau)**, sans pages filles. Pour 8 produits et des actualités, il manque au minimum deux niveaux de hiérarchie.

### 2.4 CTAs et conversion funnel

| Point d'entrée | CTA présent | Cible | Statut |
|----------------|-------------|-------|--------|
| Header global | « Réserver une visite » | `/visites#booking` | ✅ Cohérent |
| Mobile quick actions | Réserver / Boutique / Appeler | `/visites#booking`, `/boutique`, `tel:…` | ✅ Cohérent |
| Hero accueil | « Réserver une visite » | `/visites#booking` | ✅ Cohérent |
| Section Experience | « Réserver une visite » | `/visites#booking` | ✅ Cohérent |
| Section Wines (accueil) | « Voir le vin » × 4 | `/boutique` | ⚠️ Devrait pointer vers `/vins/[slug]` |
| Section History (accueil) | « Découvrir l'histoire complète » | `#contact` | 🔴 Cassé hors homepage — devrait pointer vers `/domaine` |
| Domaine — WinesShowcase | « Voir le vin » × 3 | *(à vérifier dans composant)* | ⚠️ Probablement `/boutique` |
| Boutique — FinalCtaBand | *(CTA interne boutique)* | *(hardcodé)* | À auditer |
| Footer legal | Mentions légales, CGV, Politique | `/#contact` | 🔴 Cassé |

### 2.5 Cohérence des templates

| Template | Pages concernées | État |
|----------|-----------------|-------|
| Page d'accueil composite | `/` | ✅ Complet, bien structuré |
| Page éditoriale long-form | `/domaine` | ✅ Riche, cohérent |
| Page de conversion avec booking | `/visites` | ✅ Bien conçu |
| Page e-commerce listing | `/boutique` | ✅ Structure correcte, produits hardcodés |
| **Fiche produit** | *manquant* | 🔴 Aucune page `/vins/[slug]` |
| **Listing actualités** | *manquant* | 🔴 Aucune page `/actualites` |
| **Article de blog** | *manquant* | 🔴 Aucun template `/actualites/[slug]` |
| **Page contact dédiée** | *manquant* | 🟡 Contact en section sur accueil uniquement |
| **Pages légales** | *manquant* | 🔴 3 pages RGPD obligatoires absentes |

### 2.6 Pages indispensables — bilan

| Page | Statut | Route actuelle | Route cible |
|------|--------|----------------|-------------|
| Accueil | ✅ Existe | `/` | `/` |
| Le Domaine | ✅ Existe | `/domaine` | `/domaine` |
| Vins / Boutique (listing) | ✅ Existe | `/boutique` | `/vins` ou `/boutique` |
| Fiche vin (× 8) | 🔴 Absente | — | `/vins/[slug]` |
| Visites & Dégustations | ✅ Existe | `/visites` | `/visites` |
| Réservation (booking) | ⚠️ Section | `/visites#booking` | `/visites#booking` (acceptable) ou `/reservation` |
| Actualités (listing) | 🔴 Absente | `/#contact` | `/actualites` |
| Article actualité | 🔴 Absent | — | `/actualites/[slug]` |
| Contact | ⚠️ Section | `/#contact` | `/contact` |
| FAQ | ⚠️ Section boutique | `/boutique#faq` | `/faq` ou `/boutique#faq` |
| Mentions légales | 🔴 Absente | `/#contact` | `/mentions-legales` |
| CGV | 🔴 Absente | `/#contact` | `/conditions-generales-de-vente` |
| Politique de confidentialité | 🔴 Absente | `/#contact` | `/politique-de-confidentialite` |
| Cookies (bandeau) | 🔴 Absent | — | Composant global + `/politique-cookies` |

**Score : 5/14 pages indispensables présentes.** 9 pages manquantes dont 3 obligatoires légalement.

---

## 3. Audit SEO structurel

### 3.1 URLs et slugs

| Critère | État | Détail |
|---------|------|--------|
| URLs propres (pas de `.html`) | ✅ | Astro génère des chemins propres |
| Slugs en français avec accents | 🟡 Inconsistant | `visites` ✅, `boutique` ✅, `domaine` ✅ — mais les pages manquantes n'ont pas encore de slug défini |
| Accentuation dans les slugs | 🟠 À éviter | Préférer `/mentions-legales` à `/mentions-légales` pour les URLs |
| Pagination actualités | 🔴 Absent | Aucune infrastructure de pagination |
| URL canonique | 🔴 Absent | Pas de `<link rel="canonical">` dans `BaseLayout.astro` |

### 3.2 Balises `<title>` et `<meta description>`

**Pattern actuel dans `BaseLayout.astro` :**
```html
<title>{title}</title>
<meta name="description" content={description} />
```

| Page | `<title>` actuel | `<meta description>` actuelle | Conformité |
|------|-----------------|-------------------------------|-----------|
| `/` | `"Domaine de la Périnade"` (défaut) | `"Domaine familial près de Carcassonne. Vins authentiques du Languedoc depuis 1987."` | ⚠️ Titre trop court, pas de mot-clé |
| `/domaine` | `"Le Domaine \| Domaine de la Périnade"` | Description dédiée | ✅ Bon pattern |
| `/visites` | `"Visites & Dégustations \| Domaine de la Périnade"` | Description dédiée | ✅ Bon pattern |
| `/boutique` | `"Boutique \| Domaine de la Périnade"` | `"Commandez les cuvées du Domaine de la Périnade en ligne."` | ✅ |

**Templates recommandés par type :**

```
Accueil      : "Domaine de la Périnade — Vins AOP Minervois, Visites & Dégustations près de Carcassonne"
Fiche vin    : "[Nom cuvée] — [Appellation] | Boutique Domaine de la Périnade"
Article      : "[Titre article] | Actualités | Domaine de la Périnade"
Listing      : "Actualités du Domaine | Domaine de la Périnade"
Pages légales: "[Titre légal] | Domaine de la Périnade"
```

### 3.3 Balises manquantes dans `BaseLayout.astro`

| Balise/élément | Présent | Impact SEO |
|----------------|---------|-----------|
| `<link rel="canonical">` | 🔴 Non | Évite le contenu dupliqué |
| Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) | 🔴 Non | Partages sociaux non optimisés |
| Twitter Card | 🔴 Non | |
| `<meta name="robots">` | 🔴 Non | Impossible de bloquer certaines pages |
| Schema.org JSON-LD (LocalBusiness, Winery, Product, Event) | 🔴 Non | Rich snippets manqués |
| `<link rel="preload">` pour fonts/images hero | 🔴 Non | LCP potentiellement impacté |
| `<html lang="fr">` | ✅ Oui | |
| `<meta charset="UTF-8">` | ✅ Oui | |
| `<meta name="viewport">` | ✅ Oui | |
| Favicon / apple-touch-icon | ✅ Oui | |

### 3.4 Fichiers SEO techniques

| Fichier | Présent | Priorité |
|---------|---------|----------|
| `public/robots.txt` | 🔴 Non | Haute |
| `public/sitemap.xml` (ou intégration `@astrojs/sitemap`) | 🔴 Non | Haute |
| `public/manifest.json` (PWA) | 🔴 Non | Faible |
| `public/.htaccess` / redirections | 🔴 Non | Moyenne |

### 3.5 Breadcrumbs

Non implémentés. Utiles sur :
- `/vins/[slug]` → Accueil > Vins > [Nom cuvée]
- `/actualites/[slug]` → Accueil > Actualités > [Titre article]

### 3.6 Données structurées recommandées

```jsonc
// Sur l'accueil et /domaine : LocalBusiness + Winery
{
  "@type": ["LocalBusiness", "Winery"],
  "name": "Domaine de la Périnade",
  "address": { "@type": "PostalAddress", "addressLocality": "Carcassonne", "addressCountry": "FR" },
  "priceRange": "€€",
  "servesCuisine": "French wine"
}

// Sur /vins/[slug] : Product
{
  "@type": "Product",
  "name": "Cuvée du Domaine",
  "offers": { "@type": "Offer", "price": "12.50", "priceCurrency": "EUR" }
}

// Sur /visites : Event ou Service
{
  "@type": "TouristAttraction",
  "name": "Visite & Dégustation — Domaine de la Périnade"
}
```

---

## 4. Arborescence idéale

```
/                                   ← Accueil (page composite)
├── /domaine                        ← Le Domaine (histoire, terroir)
├── /vins                           ← Listing vins / Boutique
│   └── /vins/[slug]                ← Fiche vin (× 8 produits)
│       ex: /vins/cuvee-du-domaine
│           /vins/blanc-de-perinade
│           /vins/rose-d-ete
│           /vins/grande-reserve
│           … (4 autres à venir)
├── /visites                        ← Visites & Dégustations
│   └── /visites#booking            ← Ancre réservation (ou /reservation)
├── /actualites                     ← Listing actualités (paginé)
│   └── /actualites/[slug]          ← Article individuel
├── /contact                        ← Page contact dédiée
├── /faq                            ← FAQ (ou fusionner avec /visites et /vins)
└── [Pages légales]
    ├── /mentions-legales
    ├── /politique-de-confidentialite
    ├── /conditions-generales-de-vente
    └── /politique-cookies           ← Si bandeau cookie implémenté
```

---

## 5. Mapping « existant → cible »

### 5.1 Pages existantes — recommandations

| Route actuelle | Route cible | Action | Priorité |
|----------------|-------------|--------|----------|
| `/` | `/` | Corriger `history.ctaHref` de `"#contact"` → `"/domaine"` | 🔴 Haute |
| `/` | `/` | Corriger `wines[].ctaHref` de `"/boutique"` → `"/vins/[slug]"` | 🟡 Moyenne |
| `/domaine` | `/domaine` | Conserver. Ajouter balises OG + JSON-LD | 🟡 Moyenne |
| `/visites` | `/visites` | Conserver. Ajouter balises OG + JSON-LD TouristAttraction | 🟡 Moyenne |
| `/boutique` | `/vins` | Renommer ou garder `/boutique` + créer `/vins/[slug]` | 🟡 Moyenne |

### 5.2 Pages à créer — ordre de priorité

| Priorité | Route | Template | Source de données |
|----------|-------|----------|-------------------|
| 🔴 P0 — Légal | `/mentions-legales` | Page légale simple | Fichier texte ou `src/data/legal.ts` |
| 🔴 P0 — Légal | `/politique-de-confidentialite` | Page légale simple | idem |
| 🔴 P0 — Légal | `/conditions-generales-de-vente` | Page légale simple | idem |
| 🔴 P1 — SEO | `/vins/[slug]` | Fiche produit (image, description, appellation, accord mets, prix, CTA achat) | `src/data/wines.ts` (à créer) avec 8 entrées |
| 🟡 P2 — Contenu | `/actualites` | Listing articles (carte, date, extrait, pagination) | Collection Astro ou `src/data/posts/` |
| 🟡 P2 — Contenu | `/actualites/[slug]` | Article (hero, corps Markdown, auteur, date, CTA) | idem |
| 🟡 P2 — UX | `/contact` | Formulaire complet + carte + horaires | `src/data/site.ts` (contact déjà défini) |
| 🟠 P3 — Optionnel | `/faq` | Accordéon FAQ | Extraire de `ShopFaq.astro` |
| 🟠 P3 — Optionnel | `/politique-cookies` | Page légale simple | Fichier texte |

---

## 6. Tableau récapitulatif complet

| Route | Existe | Template | Source données | Liens entrants | SEO title | Meta desc | OG | JSON-LD | Breadcrumb |
|-------|--------|----------|----------------|----------------|-----------|-----------|-----|---------|------------|
| `/` | ✅ | Composite | `site.ts` | Logo, nav mobile | ⚠️ Trop court | ✅ | ❌ | ❌ | — |
| `/domaine` | ✅ | Éditorial | `domaine.ts` | Header, footer | ✅ | ✅ | ❌ | ❌ | — |
| `/visites` | ✅ | Conversion | `visits.ts` | Header, footer, CTA | ✅ | ✅ | ❌ | ❌ | — |
| `/boutique` | ✅ | E-commerce | Hardcodé | Header, footer, CTA vins | ✅ | ✅ | ❌ | ❌ | — |
| `/vins/[slug]` | ❌ | Fiche produit | À créer | Boutique, accueil, domaine | ❌ | ❌ | ❌ | ❌ | À créer |
| `/actualites` | ❌ | Listing | À créer | Header, footer | ❌ | ❌ | ❌ | ❌ | — |
| `/actualites/[slug]` | ❌ | Article | À créer | Listing | ❌ | ❌ | ❌ | ❌ | À créer |
| `/contact` | ❌ | Contact | `site.ts` | Header, footer | ❌ | ❌ | ❌ | ❌ | — |
| `/mentions-legales` | ❌ | Légal | À créer | Footer | ❌ | ❌ | ❌ | ❌ | — |
| `/politique-de-confidentialite` | ❌ | Légal | À créer | Footer | ❌ | ❌ | ❌ | ❌ | — |
| `/conditions-generales-de-vente` | ❌ | Légal | À créer | Footer | ❌ | ❌ | ❌ | ❌ | — |
| `/faq` | ❌ | FAQ | `ShopFaq` | Footer (optionnel) | ❌ | ❌ | ❌ | ❌ | — |
| `/politique-cookies` | ❌ | Légal | À créer | Bandeau cookie | ❌ | ❌ | ❌ | ❌ | — |

---

## 7. Recommandations priorisées

### 🔴 Urgentes (P0 — avant mise en ligne)

1. **Créer les 3 pages légales** (`/mentions-legales`, `/politique-de-confidentialite`, `/cgv`) et corriger les liens dans le footer
2. **Corriger `history.ctaHref`** : `"#contact"` → `"/domaine"` (lien cassé hors accueil)
3. **Ajouter `<link rel="canonical">`** dans `BaseLayout.astro`
4. **Créer `public/robots.txt`** même minimal (`Allow: /`)
5. **Mettre en cohérence les liens nav** : « Actualités » ne peut pas pointer vers `/#contact`

### 🟡 Importantes (P1 — dans les 2 premières semaines)

6. **Créer `/vins/[slug]`** avec `getStaticPaths()` — extraire les données produit dans `src/data/wines.ts`, ajouter prix, cépages, accords mets, JSON-LD `Product`
7. **Remplacer les libellés bilingues** dans la nav desktop (VISIT → Visites, SHOP → Boutique ou garder la cohérence choisie)
8. **Ajouter les balises Open Graph** dans `BaseLayout.astro` (og:title, og:description, og:image, og:type, og:url)
9. **Ajouter aria-current="page"** sur les liens de navigation actifs
10. **Optimiser le title de l'accueil** : inclure les mots-clés « AOP Minervois » et « Carcassonne »

### 🟠 Améliorations (P2 — dans le premier mois)

11. **Créer `/actualites`** et `/actualites/[slug]` avec Astro Content Collections (`src/content/posts/`)
12. **Installer `@astrojs/sitemap`** et le configurer dans `astro.config.mjs`
13. **Ajouter JSON-LD LocalBusiness** sur l'accueil et `/domaine`
14. **Créer `/contact`** page dédiée en réutilisant le composant `Contact.astro`
15. **Ajouter les breadcrumbs** sur `/vins/[slug]` et `/actualites/[slug]` (composant + JSON-LD `BreadcrumbList`)
16. **Mettre en place un bandeau cookie** si des outils analytics/traceurs sont ajoutés

### 🟢 Optimisations (P3 — continu)

17. Ajouter `<link rel="preload">` pour l'image hero (LCP)
18. Implémenter la pagination côté `/actualites` (`?page=2`)
19. Ajouter une page `/faq` ou intégrer le composant `ShopFaq` dans `/visites`
20. Vérifier les accentuations dans `site.ts` : « Actualites » → « Actualités », « legales » → « légales »

---

## Annexe — Corrections rapides dans `src/data/site.ts`

Les modifications suivantes n'impliquent aucune création de page et peuvent être faites immédiatement :

```ts
// Nav : corriger les cibles
{ label: "Actualités", href: "/actualites", ... },   // was "/#contact"
{ label: "Contact",    href: "/contact", ... },       // was "/#contact"

// History CTA : corriger le lien relatif cassé
history: {
  ctaHref: "/domaine"   // was "#contact"
}

// Footer : corriger les libellés et liens légaux
{ label: "Mentions légales",              href: "/mentions-legales" },
{ label: "Politique de confidentialité",  href: "/politique-de-confidentialite" },
{ label: "Conditions de vente",           href: "/conditions-generales-de-vente" },
```
