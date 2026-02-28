# Audit SSOT du Contenu — Domaine de la Périnade

> Réalisé le 28 février 2026 · Branche `claude/audit-content-ssot-GEwP6`

---

## 1. Diagramme des sources actuelles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SOURCES DE CONTENU (état actuel)                 │
└─────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────┐   ┌──────────────────────┐   ┌────────────────────┐
  │   src/data/site.ts   │   │  src/data/domaine.ts  │   │ src/data/visits.ts │
  │  (241 lignes TS)     │   │  (240 lignes TS)      │   │  (378 lignes TS)   │
  │                      │   │                       │   │                    │
  │  • Nav + footer      │   │  • Héros /domaine     │   │  • Héros /visites  │
  │  • Héros homepage    │   │  • Terroir            │   │  • Timeline visite │
  │  • 4 vins (résumé)   │   │  • Famille Arnal      │   │  • 5 vins tasting  │
  │  • Témoignages       │   │  • Timeline ~1830-2023│   │  • Tarifs 15/25€   │
  │  • Histoire domaine  │   │  • 3 vins (avec prix) │   │  • Config calendrier│
  │  • Contact           │   │  • Contact /domaine   │   │  • Accès/GPS       │
  │  • SEO homepage      │   │  • SEO /domaine       │   │  • SEO /visites    │
  └──────────┬───────────┘   └──────────┬────────────┘   └────────┬───────────┘
             │                          │                          │
             ▼                          ▼                          ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │                      src/pages/*.astro                               │
  │   index.astro   /   domaine.astro   /   visites.astro               │
  └──────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────┐
  │              CONTENU HARDCODÉ DANS LES COMPOSANTS                    │
  │                                                                       │
  │  src/components/shop/ShopProductGrid.astro   → 6 vins (array TS)    │
  │  src/components/shop/ShopCaseComposer.astro  → 2 coffrets            │
  │  src/components/shop/ShopFaq.astro           → 6 FAQs               │
  │  src/components/shop/ShopDomainSelection.astro → 5 features + SVGs  │
  └──────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────┐
  │              PAGES / SECTIONS MANQUANTES                              │
  │  • Actualités   → href: "/#contact"  (placeholder — non implémenté)  │
  │  • Mentions légales, CGV, Confidentialité → idem, tous en /#contact  │
  └──────────────────────────────────────────────────────────────────────┘

  Pas de CMS • Pas de Markdown/MDX • Pas d'API externe de contenu
  Pas de Google Sheets • Pas de variables d'environnement de contenu
```

---

## 2. Duplications identifiées

### 2.1 Données produit (vins) — le problème le plus critique

Le même vin apparaît jusqu'à **4 fois** dans le code, avec des variantes et incohérences :

| Champ            | `site.ts` (homepage)       | `domaine.ts`               | `ShopProductGrid`          | `visits.ts` (tasting)  |
|------------------|----------------------------|----------------------------|----------------------------|------------------------|
| **Cuvée du Domaine** description | "Un rouge soyeux… élevé pour accompagner les belles tables." | "Fruits noirs, garrigue et épices douces. Bouche soyeuse et finale élégante." | "Fruits noirs, garrigue, épices douces. Bouche soyeuse, belle longueur." | — |
| **Cuvée du Domaine** prix | *(absent)* | `12,50 € TTC` | `12,50 € TTC` | — |
| **Blanc de Périnade** description | "Une cuvée fraîche et florale, portée par les agrumes, la tension minérale et une finale nette." | "Agrumes et fleurs blanches. Une cuvée fraîche, précise et minérale." | "Agrumes, fleurs blanches. Fraîcheur remarquable, finale minérale." | "Agrumes, fleurs blanches · Fraîcheur minérale" |
| **Grande Réserve** description | "Une cuvée de caractère élevée en fût, ample et persistante, avec des tanins fondus et une matière profonde." | "Élevé en fûts, puissant et complexe, avec des tanins fondus." | "Élevé en fûts de chêne. Puissant, complexe, tanins fondus." | "Fruits noirs, garrigue · Tanins fondus, finale longue" |
| **Rosé d'Été** millésime | *(absent)* | — | `2024` | *(absent dans tasting)* |

**Résultat :** 4 versions légèrement différentes de chaque description, aucune n'est canonique.

### 2.2 Incohérences de capacité de groupe

| Source | Valeur |
|--------|--------|
| `site.ts` experience section | "2 à 10 personnes" |
| `visits.ts` booking config | `minParticipants: 1`, `maxParticipants: 12` |
| `domaine.ts` visitCta | "Groupes privés sur demande" *(flou)* |

→ **3 chiffres différents** pour la même info.

### 2.3 Numéros de téléphone incohérents

| Source | Valeur |
|--------|--------|
| `site.ts` contact info | `+33 4 68 XX XX XX` (placeholder) |
| `domaine.ts` contact cards | `+33 4 68 XX XX XX` (placeholder) |
| `visits.ts` hero secondaryCta | `tel:+33468000000` (différent!) |
| `visits.ts` hero helper text | `+33 4 68 XX XX XX` |

→ Deux valeurs différentes coexistent. La vraie valeur est absente partout.

### 2.4 Navigation dupliquée

La liste de liens de navigation est répétée dans :
- `site.ts` → `nav[]` (header)
- `site.ts` → `footer.groups[0].links[]` (footer)
- Les deux doivent rester cohérents manuellement.

### 2.5 Dates de fondation ambiguës

| Source | Valeur | Signification |
|--------|--------|---------------|
| `site.ts` hero meta | "Depuis 1987" | Relance ? |
| `site.ts` footer about | "depuis 1987" | Idem |
| `domaine.ts` hero titleLines | "Depuis 1830" | Fondation originale |
| `domaine.ts` family milestones | 1830 → 2019 → 2020 | Timeline complète |

→ La page d'accueil dit 1987, la page domaine dit 1830. **Incohérence publique.**

---

## 3. Analyse du modèle de données

### 3.1 Produits (vins)

**Champs présents** (éparpillés dans 4 fichiers) :

| Champ | Présent | Structuré | Canonique |
|-------|---------|-----------|-----------|
| Nom | ✅ | ✅ | ❌ (4 sources) |
| Millésime | ✅ | ❌ (dans string meta) | ❌ |
| Appellation (AOP/IGP) | ✅ | ❌ (dans string meta) | ❌ |
| Couleur | ✅ | ✅ (field `tone`) | ❌ |
| Prix TTC | ✅ | ❌ (string "12,50 € TTC") | ❌ |
| Stock | ✅ | ❌ (string "En stock") | ❌ |
| Description | ✅ | ✅ | ❌ (4 variantes) |
| Image | ✅ | ✅ | ❌ (images différentes par section) |
| Badges | ✅ | ✅ | ✅ |

**Champs absents mais requis** :

| Champ manquant | Impact |
|----------------|--------|
| `slug` | Pas de pages produit individuelles (`/boutique/cuvee-du-domaine`) |
| SEO fields (title, description, OG image) | Impossible d'optimiser les fiches produit |
| Shipping info structurée | Dans `ShopDomainSelection` en prose libre |
| Allergènes | Absent (obligation légale pour vente en ligne) |
| Volume (cl) | Dans string meta, non structuré |
| Cépages | Absent dans les fiches produit |
| Politique de retour | Mentionnée dans FAQ, non structurée |
| SKU / référence | Absent |

### 3.2 Visites

**Champs présents** :

| Champ | Présent | Canonique |
|-------|---------|-----------|
| Durée | ✅ (1h30) | ❌ (3 endroits) |
| Prix | ✅ (15€ / 25€) | ✅ (dans `visits.ts` pricing) |
| Calendrier / créneaux | ✅ (booking config) | ✅ |
| Langues | ✅ (FR/EN) | ❌ (2 endroits) |
| Lieu / accès | ✅ | ✅ |
| Addon fromages | ✅ | ✅ |

**Champs absents** :

| Champ manquant | Impact |
|----------------|--------|
| Politique d'annulation | **Absent** — obligation légale |
| Conditions de réservation | Absent |
| Capacité canonique | 3 valeurs contradictoires (2-10 / 1-12) |
| Dates de fermeture / congés | Non modélisées (jours désactivés codés en dur) |
| Photos par formule | Non différenciées |

### 3.3 Actualités

> **Complètement absent.** Le lien "Actualités" dans la nav pointe vers `/#contact`.
> Aucune infrastructure de blog ou d'articles n'existe dans le projet.

Champs requis à créer : `date`, `auteur`, `tags[]`, `excerpt`, `image OG`, `slug`, `body (Markdown)`.

### 3.4 Pages statiques

> **Absentes.** Mentions légales, CGV, Politique de confidentialité pointent toutes vers `/#contact`.

---

## 4. SSOT Cible recommandée : Astro Content Collections

### Pourquoi Content Collections et pas un CMS ?

| Critère | Content Collections | Headless CMS (Contentful, Sanity…) |
|---------|--------------------|------------------------------------|
| Coût | Gratuit | 0–300 €/mois selon usage |
| Complexité | Faible | Moyenne (API, webhooks, tokens) |
| Versionning Git | ✅ natif | ❌ externe |
| Build statique | ✅ natif Astro | ✅ avec adapter |
| Édition non-dev | ❌ (fichiers MD) | ✅ UI dédiée |
| Validation schéma | ✅ Zod intégré | ✅ |
| Offline / résilience | ✅ | ❌ dépend de l'API |

**Recommandation : Content Collections** pour l'état actuel du projet (site vitrine statique, équipe technique, petit volume de contenu). Un CMS headless ne devient pertinent que si un non-développeur doit éditer le contenu régulièrement.

---

### 4.1 Structure de fichiers cible

```
src/
├── content/
│   ├── config.ts                        ← Schémas Zod (SSOT des types)
│   │
│   ├── vins/                            ← Collection produits
│   │   ├── cuvee-du-domaine.md
│   │   ├── blanc-de-perinade.md
│   │   ├── grande-reserve.md
│   │   ├── rose-ete.md
│   │   ├── blanc-reserve.md
│   │   └── rose-prestige.md
│   │
│   ├── visites/                         ← Collection offres de visites
│   │   ├── visite-standard.md
│   │   └── visite-gourmet.md
│   │
│   ├── actualites/                      ← Collection blog / news
│   │   └── (articles à créer)
│   │
│   └── pages/                           ← Pages légales statiques
│       ├── mentions-legales.md
│       ├── cgv.md
│       └── politique-confidentialite.md
│
├── data/
│   ├── site.ts          ← nav, footer, contact (config UI, pas contenu)
│   ├── domaine.ts       ← histoire, terroir, timeline (semi-statique)
│   └── booking.ts       ← config calendrier, créneaux (config technique)
│
└── pages/
    ├── index.astro
    ├── boutique.astro
    ├── visites.astro
    ├── domaine.astro
    ├── actualites/
    │   ├── index.astro          ← liste des articles
    │   └── [slug].astro         ← page article dynamique
    ├── vins/
    │   └── [slug].astro         ← page produit (optionnel)
    └── [slug].astro             ← pages légales dynamiques
```

---

### 4.2 Schémas Zod proposés (`src/content/config.ts`)

```typescript
import { defineCollection, z } from 'astro:content';

// ── VINS ──────────────────────────────────────────────────────────────────────
const vinsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // Identité
    nom: z.string(),
    slug: z.string(),                          // ex: "cuvee-du-domaine"
    couleur: z.enum(['Rouge', 'Blanc', 'Rosé']),
    appellation: z.string(),                   // "AOP Minervois" | "IGP Pays d'Oc"
    millesime: z.number().int().min(2000),     // 2022
    volume: z.number().default(75),            // cl

    // Commerce
    prix: z.number(),                          // 12.50 (EUR, HT ou TTC à préciser)
    prixTTC: z.boolean().default(true),
    stock: z.enum(['En stock', 'Stock limité', 'Rupture de stock']),
    sku: z.string().optional(),

    // Contenu
    description: z.string(),                   // texte canonique unique
    notes: z.array(z.string()).optional(),     // ["Fruits noirs", "Garrigue"]
    cepages: z.array(z.string()).optional(),   // ["Grenache", "Syrah"]
    badges: z.array(z.string()).optional(),    // ["Best Seller", "Favori Visite"]

    // Média
    image: image(),
    imageAlt: z.string(),

    // Expédition (requis pour e-commerce)
    poidsKg: z.number().optional(),
    allergenes: z.string().optional(),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: image().optional(),

    // Mise en avant
    featured: z.boolean().default(false),
    ordre: z.number().default(99),
  }),
});

// ── VISITES ───────────────────────────────────────────────────────────────────
const visitesCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // Identité
    titre: z.string(),
    slug: z.string(),                          // "visite-standard" | "visite-gourmet"
    sousTitre: z.string(),

    // Tarification
    prix: z.number(),                          // 15
    prixAddon: z.number().optional(),          // +10 planche fromages
    perLabel: z.string().default('/ personne'),

    // Caractéristiques
    dureeMinutes: z.number(),                  // 90
    capaciteMin: z.number().default(1),
    capaciteMax: z.number().default(12),
    langues: z.array(z.string()),              // ["FR", "EN"]
    inclus: z.array(z.string()),               // liste des inclusions

    // Disponibilité
    horaires: z.string(),                      // "11h – 16h"
    joursOuverts: z.string(),                  // "Tous les jours"
    surReservation: z.boolean().default(true),

    // Conditions
    politiqueAnnulation: z.string(),           // texte libre (OBLIGATOIRE légalement)
    conditionsReservation: z.string().optional(),

    // Média
    image: image().optional(),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),

    // Mise en avant
    highlighted: z.boolean().default(false),
    badge: z.string().optional(),              // "Popular"
    ordre: z.number().default(99),
  }),
});

// ── ACTUALITÉS ────────────────────────────────────────────────────────────────
const actualitesCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    titre: z.string(),
    date: z.date(),
    auteur: z.string().default('Domaine de la Périnade'),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().max(160),             // texte court (meta description)
    imageCouverture: image(),
    imageAlt: z.string(),
    draft: z.boolean().default(false),
    // SEO
    seoTitle: z.string().optional(),
    ogDescription: z.string().optional(),
  }),
});

// ── PAGES LÉGALES ─────────────────────────────────────────────────────────────
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    slug: z.string(),
    dateMAJ: z.date(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = {
  vins: vinsCollection,
  visites: visitesCollection,
  actualites: actualitesCollection,
  pages: pagesCollection,
};
```

---

### 4.3 Exemple de fichier vin (`src/content/vins/cuvee-du-domaine.md`)

```markdown
---
nom: "Cuvée du Domaine"
slug: "cuvee-du-domaine"
couleur: "Rouge"
appellation: "AOP Minervois"
millesime: 2022
volume: 75
prix: 12.50
prixTTC: true
stock: "En stock"
sku: "PER-CDD-2022"
description: "Fruits noirs, garrigue et épices douces. Bouche soyeuse et finale élégante."
notes: ["Fruits noirs", "Garrigue", "Épices douces"]
cepages: ["Grenache noir", "Syrah", "Mourvèdre"]
badges: ["Best Seller", "Rouge"]
image: "../../assets/perinade/shop/img-2.png"
imageAlt: "Bouteille Cuvée du Domaine, AOP Minervois 2022"
poidsKg: 1.3
allergenes: "Contient des sulfites"
featured: true
ordre: 1
seoTitle: "Cuvée du Domaine – AOP Minervois 2022 | Périnade"
seoDescription: "Découvrez notre Cuvée du Domaine AOP Minervois 2022 : rouge soyeux aux notes de fruits noirs et de garrigue. 12,50 € TTC."
---

Notes de dégustation complètes, accords mets-vins, etc. (corps Markdown libre)
```

---

### 4.4 Convention de slugs

| Collection | Pattern | Exemples |
|-----------|---------|----------|
| `vins` | `{couleur}-{nom-kebab}` | `rouge-cuvee-du-domaine`, `blanc-de-perinade` |
| `visites` | `visite-{nom-kebab}` | `visite-standard`, `visite-gourmet` |
| `actualites` | `YYYY-MM-DD-{titre-kebab}` | `2026-03-15-millésime-2025` |
| `pages` | `{nom-legal-kebab}` | `mentions-legales`, `cgv` |

**URLs résultantes** (sans casser l'existant) :
- `/vins/rouge-cuvee-du-domaine` *(nouvelle route, n'écrase rien)*
- `/actualites/` + `/actualites/[slug]` *(nouvelle route)*
- `/mentions-legales`, `/cgv`, `/politique-confidentialite` *(nouvelles routes)*

---

## 5. Plan de migration minimal (sans casser les URLs)

> Les 4 URLs actuelles (`/`, `/domaine`, `/visites`, `/boutique`) ne changent pas.
> Tout est additionnel sauf la centralisation des données produits.

### Phase 0 — Préparation (1 jour)

- [ ] Installer `@astrojs/check` si pas déjà fait pour valider les types
- [ ] Vérifier que `astro.config.mjs` a `experimental.contentLayer` si Astro < 5.2 (non nécessaire en Astro 5+)
- [ ] Créer le dossier `src/content/`

### Phase 1 — Schémas et collections vins (2–3 jours)

1. Créer `src/content/config.ts` avec le schéma `vinsCollection`
2. Créer les 6 fichiers `src/content/vins/*.md` avec toutes les données canoniques
3. Mettre à jour `ShopProductGrid.astro` pour lire depuis `getCollection('vins')`
4. Adapter `domaine.ts` `wines` section pour référencer les slugs plutôt que dupliquer
5. Adapter `site.ts` `wines` section idem
6. **Test** : la boutique affiche les mêmes 6 produits, les données sont identiques partout

### Phase 2 — Collection visites (1–2 jours)

1. Créer `src/content/config.ts` avec `visitesCollection` (append au fichier)
2. Créer `src/content/visites/visite-standard.md` et `visite-gourmet.md`
3. **Ajouter la politique d'annulation** (champ obligatoire légalement)
4. Harmoniser `capaciteMin`/`capaciteMax` : choisir 1–12 ou 2–10 et appliquer partout
5. Mettre à jour `visits.ts` pricing pour lire depuis `getCollection('visites')`
6. **Test** : la page `/visites` affiche les bonnes formules

### Phase 3 — Centralisation du contact info (0.5 jour)

1. Dans `site.ts`, créer une constante exportée `CONTACT_INFO` :
   ```ts
   export const CONTACT_INFO = {
     phone: "+33 4 68 XX XX XX",
     phoneHref: "tel:+33468XXXXXX",
     email: "contact@perinade.fr",
     address: "Domaine de la Périnade, Minervois, Languedoc",
     mapsHref: "https://maps.google.com/...",
   } as const;
   ```
2. Remplacer toutes les occurrences dans `site.ts`, `domaine.ts`, `visits.ts`
3. **Corriger** le `tel:+33468000000` erroné dans `visits.ts` hero

### Phase 4 — Actualités (2–3 jours)

1. Créer `src/content/config.ts` avec `actualitesCollection`
2. Créer `src/pages/actualites/index.astro` (liste des articles)
3. Créer `src/pages/actualites/[slug].astro` (article individuel)
4. Mettre à jour le lien nav "Actualités" : `href: "/actualites"` au lieu de `/#contact`
5. Rédiger 1–2 premiers articles pour tester

### Phase 5 — Pages légales (1 jour)

1. Créer `src/content/config.ts` avec `pagesCollection`
2. Créer les 3 fichiers Markdown légaux
3. Créer `src/pages/[slug].astro` pour les rendre
4. Mettre à jour les liens footer : `href: "/mentions-legales"` etc.

### Phase 6 — Nettoyage (1 jour)

1. Supprimer les données dupliquées dans `site.ts` / `domaine.ts` (sections `wines`)
2. Unifier les descriptions produit (une seule description canonique par vin)
3. Corriger l'incohérence 1830/1987 sur la page d'accueil
4. Ajouter les `allergens` dans tous les fichiers vin (obligation légale vente en ligne)
5. Lint et type-check final : `npm run check`

---

## Synthèse des risques et priorités

| Priorité | Problème | Impact | Effort |
|----------|----------|--------|--------|
| 🔴 P0 | Politique d'annulation absente | Légal (obligations consommateur) | Faible |
| 🔴 P0 | Allergènes absents | Légal (vente alimentaire en ligne) | Faible |
| 🔴 P0 | Pages légales manquantes (CGV, mentions) | Légal | Moyen |
| 🟠 P1 | 4 versions différentes des descriptions vin | SEO, crédibilité | Moyen |
| 🟠 P1 | Capacité groupe incohérente (2-10 vs 1-12) | UX / frustration client | Faible |
| 🟠 P1 | Numéros de téléphone incohérents | Confiance client | Faible |
| 🟡 P2 | Actualités non implémentées | SEO, engagement | Élevé |
| 🟡 P2 | Pas de pages produit individuelles | SEO, partage | Élevé |
| 🟢 P3 | Slugs et conventions non définies | Maintenabilité future | Faible |

---

## Recommandation finale

**Commencer par la Phase 3** (centralisation contact info, 0.5 jour) pour corriger immédiatement les incohérences visibles par les visiteurs, puis **Phase 1** (vins → Content Collections) qui apporte le plus de valeur structurelle. Les obligations légales (P0) doivent être traitées en parallèle, même en pages minimalistes.

Le passage aux Content Collections n'est pas une refonte majeure — il s'agit de déplacer des données TypeScript vers des fichiers Markdown avec frontmatter Zod-validé. Le code des composants change peu (un `getCollection()` remplace un `import`).
