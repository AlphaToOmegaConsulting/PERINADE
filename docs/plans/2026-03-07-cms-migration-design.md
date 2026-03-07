# Plan de migration — Pages CMS + Astro Content Collections
**Date :** 2026-03-07
**Auteur :** Audit stratégique IA
**Approche :** Astro Content Collections + YAML (Approche A)
**Objectif :** Permettre au propriétaire non-dev d'éditer le contenu via Pages CMS, sans casser le développement en cours.

---

## 1. Résumé exécutif

Le site Périnade est un site Astro 5 statique avec 15 fichiers TypeScript de données pures (5 types de pages × 3 locales : fr/en/es). Ces fichiers ne contiennent aucune logique — uniquement des objets exportés. Ils sont parfaitement migrables vers des fichiers YAML gérés par Pages CMS.

**Plan :** Migrer le contenu éditorial de `src/data/*.ts` vers `content/{section}/{locale}.yaml`, configurés via Astro Content Collections (Zod schemas). Pages CMS s'interface avec ces YAML via Git. La boutique/Stripe reste hors CMS (migration future vers Cloudflare D1/KV).

**Durée estimée :** 5 phases progressives, chacune validable indépendamment.

---

## 2. Diagnostic de l'architecture actuelle

### Structure actuelle
```
src/data/
├── index.ts          <- loader central : 5 fonctions async avec switch/case locale
├── site-fr.ts        <- 260 lignes de données pures (nav, hero, testimonials...)
├── site-en.ts
├── site-es.ts
├── domaine-{fr/en/es}.ts
├── visits-{fr/en/es}.ts
├── news-{fr/en/es}.ts
├── shop-{fr/en/es}.ts
└── [3 stubs dépréciés] site.ts, visits.ts, domaine.ts

src/i18n/
├── ui.ts             <- chaînes UI partagées (boutons, labels)
├── contact.ts        <- infos de contact (shared, non localisé)
├── locales.ts        <- types et helpers de locale
└── routes.ts         <- mapping slug <> locale
```

### Forces de l'architecture actuelle
- **Loader centralisé** (`index.ts`) : point unique de vérité, facile à swapper
- **Données pures** : 0 logique dans les 15 fichiers de contenu — migration directe possible
- **Stubs dépréciés** déjà en place — transition vers le nouveau loader déjà amorcée
- **TypeScript strict** : les types détectent les erreurs de structure au build
- **Routing simple** : folder-based, pas de middleware

### Limites de l'architecture actuelle
- **Non éditable** par un non-dev : il faut VS Code + Git pour modifier une virgule
- **Images en imports TypeScript** : `import heroImg from '../assets/...'` — incompatible avec YAML
- **Pas de séparation** entre config design (theme visits) et contenu éditorial dans certains fichiers
- **Pas de CMS** : aucun workflow d'édition visuelle

---

## 3. Architecture cible

### Principe
- **Pages CMS** gère `content/` via Git (commit YAML)
- **Astro Content Collections** (Zod) valide les YAML au build
- **`src/data/index.ts`** swappé de dynamic imports TS vers appels `getEntry()` / `getCollection()`
- **`src/types/`** reste inchangé

### Flux de données cible
```
Pages CMS UI -> commit Git -> content/{section}/{locale}.yaml
-> Astro build -> getEntry() + Zod validation
-> src/data/index.ts (loaders) -> pages Astro -> composants
```

---

## 4. Ce qui migre / ce qui reste

### MIGRE vers le CMS (content/*.yaml)
| Fichier actuel | Destination | Contenu |
|---|---|---|
| `site-{fr/en/es}.ts` | `content/site/{fr/en/es}.yaml` | nav, hero, testimonials, gallery, history, wines showcase, contact form copy, footer |
| `domaine-{fr/en/es}.ts` | `content/domaine/{fr/en/es}.yaml` | terroir, histoire famille, timeline, stats, CTA visite |
| `visits-{fr/en/es}.ts` (éditorial) | `content/visits/{fr/en/es}.yaml` | hero, timeline textes, descriptions dégustations, tarifs labels, infos accès |
| `news-{fr/en/es}.ts` | `content/news/{fr/en/es}.yaml` | hero, articles, événements, blog posts |
| `src/i18n/ui.ts` | `content/ui/{fr/en/es}.yaml` | chaînes UI (boutons, labels, skip link...) |
| `src/i18n/contact.ts` | `content/contact.yaml` | téléphone, email, adresse, réseaux sociaux |

### RESTE dans le code
| Fichier | Raison |
|---|---|
| `shop-{fr/en/es}.ts` | Couplé Stripe — migration future vers Cloudflare D1/KV |
| `visits-*.ts` theme config | Config design (couleurs, typo, spacing) — pas éditorial |
| `src/i18n/locales.ts` | Logique de routing — code |
| `src/i18n/routes.ts` | Logique de routing — code |
| `src/types/*.ts` | Interfaces TypeScript — définitions structurelles |
| `src/data/index.ts` | Loader logique — devient lecteur de collections |
| `src/lib/cart/` | Logique panier — code |
| `src/utils/` | Utilitaires — code |

### Points d'attention critiques
- **Images** : `import heroImg from '../assets/...'` → incompatible YAML. Déplacer vers `public/assets/` avant de migrer la section correspondante.
- **Theme visits** : le `theme` object dans `visits-*.ts` contient des design tokens — l'isoler dans `src/config/visits-theme-config.ts` avant Phase 3.

---

## 5. Recommandation : migration progressive

Migration page par page, phase par phase. Raisons :
1. Site en développement actif — migration bloc trop risquée
2. Le loader centralisé (`index.ts`) permet de swapper une source à la fois
3. Chaque phase est validable et déployable indépendamment
4. Les images nécessitent un traitement préalable non trivial

---

## 6. Plan de migration par phases

### Phase 0 — Infrastructure CMS (~2-3h)
**Objectif :** Poser les fondations sans toucher au code existant.

1. Créer `content/` à la racine
2. Créer `pages.config.yaml` à la racine (config Pages CMS)
3. Installer Pages CMS sur le repo GitHub (OAuth)
4. Créer `src/content/config.ts` — Zod schemas + collection definitions
5. Valider : `npm run build` OK, aucune page cassée

### Phase 1 — Migration `domaine` (~3-4h)
**Objectif :** Première migration complète, preuve de concept.

1. Créer `content/domaine/fr.yaml`, `en.yaml`, `es.yaml` depuis `domaine-{locale}.ts`
2. Mettre à jour `getDomaineData(locale)` dans `src/data/index.ts` — utiliser `getEntry('domaine', locale)`
3. Garder `domaine-{locale}.ts` en backup pendant la validation
4. Tester les 3 pages `/domaine`, `/en/domaine`, `/es/domaine`
5. Tester l'édition dans Pages CMS UI
6. Supprimer les anciens `domaine-{locale}.ts`

### Phase 2 — Migration `site` (homepage, ~4-5h)
**Objectif :** Migrer la page d'accueil.

> AVANT : déplacer les images héro et galerie vers `public/assets/` et mettre à jour les composants pour accepter `string` (URL) au lieu d'`ImageMetadata`.

1. Déplacer les images vers `public/assets/perinade/`
2. Adapter les composants concernés (props `string` au lieu d'import)
3. Créer `content/site/{fr/en/es}.yaml`
4. Mettre à jour `getSiteData(locale)`
5. Tester les 3 pages index

### Phase 3 — Migration `visits` et `news` (~4-5h)

> AVANT visits : extraire le `theme` object vers `src/config/visits-theme-config.ts`.

1. Extraire le theme config
2. Créer `content/visits/{locale}.yaml` (éditorial uniquement)
3. Mettre à jour `getVisitsData(locale)`
4. Créer `content/news/{locale}.yaml`
5. Mettre à jour `getNewsData(locale)`

### Phase 4 — Migration UI strings + contact (~2h)

1. Créer `content/ui/{locale}.yaml` depuis `src/i18n/ui.ts`
2. Créer `content/contact.yaml` depuis `src/i18n/contact.ts`
3. Mettre à jour `getUiStrings(locale)`
4. Garder `src/i18n/locales.ts` et `routes.ts` inchangés

### Phase 5 — Nettoyage et formation (~1h)

1. Supprimer les anciens fichiers `.ts` de data migrés
2. Supprimer les stubs dépréciés (`site.ts`, `visits.ts`, `domaine.ts`)
3. Former le propriétaire à Pages CMS
4. Créer `docs/cms-guide.md` (guide éditeur)

---

## 7. Impact sur le workflow IA

### Avant
- Modifier un objet TypeScript avec imports, types, syntaxe
- Risque d'erreurs de syntaxe, d'oubli d'export, de confusion entre locales

### Après
- Modifier du YAML pur — aucune syntaxe de langage
- Le Zod schema documente explicitement la structure pour l'IA
- Modifications ciblées dans un seul fichier YAML, sans effet de bord sur le code
- Le non-dev fait les modifications courantes seul — l'IA est réservée aux changements structurels

---

## 8. Risques et erreurs à éviter

| Risque | Impact | Mitigation |
|---|---|---|
| Images en imports TS | BLOQUANT pour Phase 2 | Déplacer vers `public/` avant de migrer `site` |
| Zod schema ne correspond pas au YAML | Build qui plante | Valider chaque collection individuellement |
| Pages CMS OAuth non configuré | Editeur bloqué | Configurer en Phase 0 |
| Shop data dans le CMS | Désynchronisation Stripe | Ne jamais mettre shop-*.ts dans le CMS |
| Theme visits dans le CMS | Design cassé | Isoler avant Phase 3 |

**Ne jamais faire :**
- Migrer toutes les pages d'un coup
- Supprimer les anciens `.ts` avant validation YAML
- Mettre prix Stripe / IDs produits dans le CMS
- Mettre la config theme visits dans le CMS
- Modifier des pages pendant une phase de migration active

---

## 9. Arborescence cible

```
/ (racine)
├── pages.config.yaml              <- Config Pages CMS
├── content/
│   ├── site/
│   │   ├── fr.yaml                <- remplace site-fr.ts
│   │   ├── en.yaml
│   │   └── es.yaml
│   ├── domaine/
│   │   ├── fr.yaml
│   │   ├── en.yaml
│   │   └── es.yaml
│   ├── visits/
│   │   ├── fr.yaml                <- éditorial uniquement
│   │   ├── en.yaml
│   │   └── es.yaml
│   ├── news/
│   │   ├── fr.yaml
│   │   ├── en.yaml
│   │   └── es.yaml
│   ├── ui/
│   │   ├── fr.yaml                <- remplace src/i18n/ui.ts
│   │   ├── en.yaml
│   │   └── es.yaml
│   └── contact.yaml               <- remplace src/i18n/contact.ts
│
├── src/
│   ├── content/
│   │   └── config.ts              <- Zod schemas + collection definitions
│   ├── config/
│   │   └── visits-theme-config.ts <- theme visits isolé
│   ├── data/
│   │   └── index.ts               <- loaders mis à jour (getEntry / getCollection)
│   ├── types/                     <- inchangé
│   ├── i18n/
│   │   ├── locales.ts             <- inchangé
│   │   └── routes.ts              <- inchangé
│   ├── pages/                     <- inchangé
│   ├── components/                <- adaptation string pour images (Phase 2)
│   ├── layouts/                   <- inchangé
│   ├── lib/cart/                  <- inchangé
│   └── utils/                     <- inchangé
│
├── public/
│   └── assets/perinade/           <- images déplacées depuis src/assets/ (Phase 2)
│
└── docs/
    ├── plans/
    │   └── 2026-03-07-cms-migration-design.md  <- ce fichier
    └── cms-guide.md               <- guide éditeur (à créer en Phase 5)
```

---

## Fichiers critiques (ordre d'intervention)

1. `src/content/config.ts` — créer (Zod schemas + collection definitions)
2. `pages.config.yaml` — créer à la racine
3. `content/domaine/{fr/en/es}.yaml` — créer (Phase 1)
4. `src/data/index.ts` — mettre à jour loader par loader
5. `public/assets/perinade/` — déplacer les images (avant Phase 2)
6. `src/config/visits-theme-config.ts` — extraire (avant Phase 3)

## Vérification finale

- `npm run build` passe sans erreur
- `npm run check` passe sans erreur
- Les 3 locales sont accessibles : `/`, `/en/`, `/es/`
- Pages CMS UI accessible, édition d'un champ YAML déclenche un commit et un rebuild Cloudflare
- L'éditeur non-dev peut modifier un texte hero sans ouvrir VS Code
