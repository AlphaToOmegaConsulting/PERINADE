# I18n Maintenance Guide

## Objectif

Ce document explique :

- comment le site est structuré aujourd'hui
- où modifier les contenus selon la page
- comment ajouter un nouveau texte proprement
- quels contrôles lancer avant de valider une modification

Le site fonctionne avec trois locales publiques :

- `fr`
- `en`
- `es`

Les traductions ne sont pas automatiques à l'enregistrement d'une modification. Le système actuel impose une structure propre et fournit des contrôles automatiques, mais la mise à jour des contenus reste manuelle.

---

## Architecture actuelle

### 1. Pages publiques

Les routes publiques sont :

- `/` : accueil FR
- `/en` : accueil EN
- `/es` : accueil ES
- `/visites` : page visites FR
- `/en/visits` : page visites EN
- `/es/visitas` : page visites ES
- `/domaine` : page domaine FR
- `/en/domaine` : page domaine EN
- `/es/domaine` : page domaine ES
- `/boutique` : page boutique FR
- `/en/shop` : page boutique EN
- `/es/tienda` : page boutique ES

Les pages Astro chargent les données localisées via le loader central :

- [src/data/index.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/index.ts)

### 2. Source de vérité des contenus

Les contenus métier ne doivent pas vivre dans les composants partagés. Ils vivent dans les fichiers `src/data/`.

#### Accueil

- [src/data/site-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site-fr.ts)
- [src/data/site-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site-en.ts)
- [src/data/site-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site-es.ts)

#### Domaine

- [src/data/domaine-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/domaine-fr.ts)
- [src/data/domaine-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/domaine-en.ts)
- [src/data/domaine-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/domaine-es.ts)

#### Visites

- [src/data/visits-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/visits-fr.ts)
- [src/data/visits-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/visits-en.ts)
- [src/data/visits-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/visits-es.ts)

#### Boutique

- [src/data/shop-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/shop-fr.ts)
- [src/data/shop-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/shop-en.ts)
- [src/data/shop-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/shop-es.ts)

### 3. Contrats de données

Les types définissent les champs attendus par les composants.

- [src/types/site.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/types/site.ts)
- [src/types/domaine.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/types/domaine.ts)
- [src/types/visits.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/types/visits.ts)
- [src/types/shop.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/types/shop.ts)

Si un nouveau texte visible est nécessaire, il faut en général commencer par mettre à jour le type correspondant.

---

## Règles de modification

### Règle 1

Ne pas ajouter de texte métier directement dans un composant partagé.

Exemples de composants partagés concernés :

- `src/components/sections/*`
- `src/components/shop/*`
- `src/components/domaine/*`
- `src/components/visits/*`

Le composant doit recevoir le contenu via `props`.

### Règle 2

Si un texte change sur une page, il faut mettre à jour chaque locale concernée.

Exemple :

- si tu modifies un titre sur la boutique, il faut vérifier :
  - `shop-fr.ts`
  - `shop-en.ts`
  - `shop-es.ts`

### Règle 3

Les noms propres ou noms de cuvées peuvent rester en français si c'est intentionnel :

- `Domaine de la Périnade`
- `Cuvée du Domaine`
- `Grande Réserve`

En revanche, les textes d'interface doivent être dans la bonne langue :

- boutons
- labels de formulaire
- messages de succès/erreur
- titres de section
- CTA
- textes de navigation

### Règle 4

Quand tu ajoutes un nouveau champ visible, fais-le dans cet ordre :

1. ajouter le champ dans le type
2. ajouter sa valeur dans `fr`, `en`, `es`
3. passer la valeur au composant
4. utiliser la prop dans le composant
5. lancer les contrôles

---

## Comment modifier proprement une page

### Accueil

Modifier les fichiers :

- [src/data/site-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site-fr.ts)
- [src/data/site-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site-en.ts)
- [src/data/site-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site-es.ts)

Sections concernées :

- `nav`
- `hero`
- `reasons`
- `experience`
- `gallery`
- `testimonials`
- `history`
- `wines`
- `contact`
- `footer`

### Domaine

Modifier :

- [src/data/domaine-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/domaine-fr.ts)
- [src/data/domaine-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/domaine-en.ts)
- [src/data/domaine-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/domaine-es.ts)

### Visites

Modifier :

- [src/data/visits-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/visits-fr.ts)
- [src/data/visits-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/visits-en.ts)
- [src/data/visits-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/visits-es.ts)

Attention particulière :

- `booking.ui`
- `booking.config`
- `pricing`
- `access`

### Boutique

Modifier :

- [src/data/shop-fr.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/shop-fr.ts)
- [src/data/shop-en.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/shop-en.ts)
- [src/data/shop-es.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/shop-es.ts)

Sections concernées :

- `hero`
- `productGrid`
- `domainSelection`
- `caseComposer`
- `finalCta`
- `faq`

---

## Ajouter un nouveau texte visible

### Cas simple : texte déjà prévu dans le type

Exemple : changer un bouton existant.

1. retrouver le champ dans le fichier `src/data/*`
2. modifier la valeur FR
3. modifier la valeur EN
4. modifier la valeur ES
5. lancer `npm run i18n:verify`

### Cas structurel : le champ n'existe pas encore

Exemple : tu veux ajouter un nouveau sous-titre de section.

1. identifier le type concerné dans `src/types/`
2. ajouter le nouveau champ
3. renseigner ce champ dans les fichiers `*-fr.ts`, `*-en.ts`, `*-es.ts`
4. modifier le composant pour lire ce champ via `props`
5. vérifier que la page Astro transmet bien la donnée si nécessaire
6. lancer les contrôles

---

## Contrôles disponibles

### Vérification complète

```bash
npm run i18n:verify
```

Cette commande lance :

1. `astro check`
2. `astro build`
3. `npm run i18n:audit`

À utiliser avant de considérer une modification comme propre.

### Audit de langue seul

```bash
npm run i18n:audit
```

But :

- détecter des incohérences de langue
- détecter des problèmes de structure par locale
- générer un rapport non bloquant

Sorties :

- [output/i18n/audit.md](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/audit.md)
- [output/i18n/audit.json](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/audit.json)

### Extraction des contenus traduisibles

```bash
npm run i18n:extract
```

But :

- générer des catalogues de travail pour traduction future

Sorties :

- [output/i18n/catalog.fr.json](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/catalog.fr.json)
- [output/i18n/catalog.en.json](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/catalog.en.json)
- [output/i18n/catalog.es.json](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/catalog.es.json)

---

## Interprétation des contrôles

### Si `i18n:verify` passe

Cela veut dire :

- le typage Astro est cohérent
- le build fonctionne
- l'audit i18n ne détecte pas d'écart structurel

### Si `i18n:audit` remonte des findings

Regarder :

- le fichier concerné
- le type de finding
- l'extrait remonté

En pratique, les problèmes attendus sont souvent :

- texte hardcodé dans un composant partagé
- chaîne de mauvaise langue dans un fichier `*-fr.ts`, `*-en.ts`, `*-es.ts`
- incohérence de route/canonical/locale

---

## Workflow recommandé

Pour une modification simple :

1. modifier le contenu FR
2. reporter la modification en EN
3. reporter la modification en ES
4. lancer :

```bash
npm run i18n:verify
```

5. vérifier le rapport :
   - [output/i18n/audit.md](/Users/codex/Desktop/WEBDEV/PERINADE/output/i18n/audit.md)

Pour une modification structurelle :

1. modifier le type
2. ajouter les champs dans les trois fichiers de data
3. modifier le composant
4. vérifier les pages Astro si de nouvelles props sont nécessaires
5. lancer `npm run i18n:verify`

---

## Check-list avant commit

- le texte visible est présent dans la bonne locale
- les 3 langues ont été mises à jour quand nécessaire
- aucun texte métier n'a été ajouté en dur dans un composant partagé
- les CTA et labels de formulaire sont traduits
- `npm run i18n:verify` passe
- `output/i18n/audit.md` ne contient pas d'écart

---

## Limites actuelles

- la traduction ne se fait pas automatiquement quand un contenu change
- l'audit détecte des incohérences, mais ne traduit pas
- l'extracteur prépare les catalogues, mais ne remplit pas EN/ES automatiquement

Donc, aujourd'hui :

- traduction automatique : non
- contrôle automatique : oui
- structure i18n propre : oui

---

## Fichiers utiles

- Loader central : [src/data/index.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/index.ts)
- Locales : [src/i18n/locales.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/i18n/locales.ts)
- Routes : [src/i18n/routes.ts](/Users/codex/Desktop/WEBDEV/PERINADE/src/i18n/routes.ts)
- Audit : [scripts/i18n/audit-language.ts](/Users/codex/Desktop/WEBDEV/PERINADE/scripts/i18n/audit-language.ts)
- Extracteur : [scripts/i18n/extract-translatables.ts](/Users/codex/Desktop/WEBDEV/PERINADE/scripts/i18n/extract-translatables.ts)
- Config scripts npm : [package.json](/Users/codex/Desktop/WEBDEV/PERINADE/package.json)
