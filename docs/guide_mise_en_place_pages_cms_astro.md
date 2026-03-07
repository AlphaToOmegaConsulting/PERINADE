# Guide de mise en place — Pages CMS + Astro + Cloudflare Pages

## Objectif
Mettre en place une interface simple pour que tes clients puissent modifier des **textes** et des **images** sur un site **Astro**, sans toucher à la structure technique du site.

Le principe est le suivant :
- le site Astro lit des fichiers de contenu dans le dépôt GitHub ;
- Pages CMS fournit une interface d’édition ;
- chaque modification crée un commit GitHub ;
- Cloudflare Pages rebuild le site automatiquement.

---

## Vue d’ensemble de l’architecture

### Ce que tu vas avoir
- **Astro** pour le site
- **GitHub** comme source de vérité
- **Pages CMS** pour éditer les contenus
- **Cloudflare Pages** pour déployer le site
- **Markdown + frontmatter** pour les pages éditables
- **public/uploads** pour les images

### Ce que le client pourra faire
- changer un titre
- modifier un texte
- remplacer une image
- ajouter un service, une actualité ou une page selon la configuration

### Ce qu’il ne devra pas modifier
- la structure des composants Astro
- le design global
- les routes techniques
- la logique du site

---

# Phase 1 — Préparer le projet Astro

## Étape 1 — Créer ou ouvrir le projet Astro
Si le site n’existe pas encore, crée un projet Astro propre.

Commande typique :

```bash
npm create astro@latest
```

Puis installe les dépendances :

```bash
npm install
```

---

## Étape 2 — Définir une structure claire pour le contenu
Crée une structure simple et stable.

Exemple recommandé :

```text
src/
  content/
    pages/
      home.md
      about.md
    services/
      creation-site.md
      refonte-site.md
  content.config.ts
public/
  uploads/
.pages.yml
```

### Pourquoi cette structure
- `src/content/pages` : pages fixes éditables
- `src/content/services` : contenus répétables
- `public/uploads` : images servies directement
- `.pages.yml` : configuration de Pages CMS

---

# Phase 2 — Configurer Astro pour lire le contenu

## Étape 3 — Créer `src/content.config.ts`
Ce fichier définit les schémas de contenu que Astro va valider.

```ts
import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

const services = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  pages,
  services,
};
```

### Point important
Les champs définis ici doivent correspondre aux champs que Pages CMS va écrire dans les fichiers.

---

## Étape 4 — Créer les premiers fichiers de contenu
Exemple pour la page d’accueil :

`src/content/pages/home.md`

```md
---
title: Accueil
seoTitle: Mon site - Accueil
description: Présentation du site
heroImage: /uploads/home/hero.jpg
---

Bienvenue sur notre site.
```

Exemple pour un service :

`src/content/services/creation-site.md`

```md
---
title: Création de site
excerpt: Création de sites rapides et modernes
cover: /uploads/services/creation-site.jpg
published: true
---

Nous créons des sites modernes avec Astro.
```

---

# Phase 3 — Préparer le rendu Astro

## Étape 5 — Lire les contenus dans tes pages Astro
Exemple simple pour récupérer une collection :

```ts
import { getCollection } from 'astro:content';

const services = await getCollection('services');
```

Tu pourras ensuite afficher :
- `entry.data.title`
- `entry.data.cover`
- `entry.body`

---

## Étape 6 — Afficher les images avec des chemins stables
Si les images sont dans `public/uploads`, utilise directement les chemins retournés par le contenu.

Exemple :

```astro
<img src={entry.data.cover} alt={entry.data.title} />
```

### Recommandation
Pour un CMS simple côté client, `public/uploads` est plus facile à gérer que des imports d’assets complexes.

---

# Phase 4 — Configurer Pages CMS

## Étape 7 — Créer le fichier `.pages.yml`
À la racine du projet, ajoute ce fichier.

Exemple de base :

```yml
media:
  input: public/uploads
  output: /uploads

content:
  - name: pages
    label: Pages
    type: collection
    path: src/content/pages
    filename: "{primary}.md"
    view:
      fields: [title]
    fields:
      - name: title
        label: Titre
        type: string
        required: true

      - name: seoTitle
        label: Titre SEO
        type: string

      - name: description
        label: Description
        type: text

      - name: heroImage
        label: Image principale
        type: image

      - name: body
        label: Contenu
        type: rich-text

  - name: services
    label: Services
    type: collection
    path: src/content/services
    filename: "{primary}.md"
    view:
      fields: [title, published]
    fields:
      - name: title
        label: Titre
        type: string
        required: true

      - name: excerpt
        label: Résumé
        type: text

      - name: cover
        label: Image
        type: image

      - name: published
        label: Publié
        type: boolean
        default: true

      - name: body
        label: Contenu
        type: rich-text

settings:
  content:
    merge: true
```

---

## Étape 8 — Comprendre les parties importantes de `.pages.yml`

### `media`
```yml
media:
  input: public/uploads
  output: /uploads
```
- `input` = dossier réel dans le repo
- `output` = chemin public utilisé par le site

### `content`
Chaque bloc correspond à un groupe de contenus éditables.

### `type: collection`
À utiliser quand tu veux plusieurs fichiers du même type.

### `fields`
Ce sont les champs que ton client verra dans l’interface.

### `body`
Correspond au contenu principal du fichier Markdown.

### `merge: true`
Évite d’écraser certains champs si tout n’est pas exposé dans le formulaire.

---

## Étape 9 — Choisir les bons types de champs
Utilise une configuration simple.

### Recommandation
- `string` : titre court
- `text` : résumé ou description
- `rich-text` : contenu principal
- `image` : photo, bannière, visuel
- `boolean` : publier / masquer

### À éviter au début
- trop de champs imbriqués
- logique conditionnelle complexe
- structure de contenu trop technique

---

# Phase 5 — Mettre le projet sur GitHub

## Étape 10 — Initialiser Git si ce n’est pas déjà fait

```bash
git init
git add .
git commit -m "Initial Astro + Pages CMS setup"
```

---

## Étape 11 — Créer le dépôt GitHub
Crée un repo GitHub, puis connecte ton projet.

```bash
git remote add origin https://github.com/ton-compte/ton-repo.git
git branch -M main
git push -u origin main
```

### Important
Le fichier `.pages.yml` doit être présent à la racine du dépôt avant d’ouvrir Pages CMS.

---

# Phase 6 — Connecter Cloudflare Pages

## Étape 12 — Créer le projet sur Cloudflare Pages
Dans Cloudflare Pages :
1. crée un nouveau projet ;
2. connecte le repo GitHub ;
3. choisis la branche `main` ;
4. configure le build.

### Paramètres typiques
- Build command : `npm run build`
- Output directory : `dist`

---

## Étape 13 — Vérifier le premier déploiement
Quand le build est terminé :
- ouvre l’URL de preview ou de prod ;
- vérifie que les contenus Markdown s’affichent ;
- vérifie que les images de `public/uploads` sont bien servies.

---

# Phase 7 — Connecter Pages CMS

## Étape 14 — Ouvrir Pages CMS
Va sur l’interface web de Pages CMS et connecte ton compte GitHub.

Ensuite :
1. autorise l’accès au dépôt ;
2. ouvre le repo du site ;
3. laisse Pages CMS lire `.pages.yml` ;
4. vérifie que les collections apparaissent.

---

## Étape 15 — Tester une première modification
Fais un test simple :
- change le titre de la page d’accueil ;
- remplace une image ;
- sauvegarde.

Ce qui doit se passer :
1. Pages CMS crée un commit ;
2. GitHub reçoit la modification ;
3. Cloudflare Pages relance le build ;
4. le site est mis à jour.

---

# Phase 8 — Sécuriser et simplifier pour les clients

## Étape 16 — Limiter ce qui est éditable
Ne rends éditables que les contenus utiles.

### Bon périmètre
- titres
- textes
- images
- CTA simples
- infos de contact

### Mauvais périmètre
- composants Astro
- mise en page avancée
- classes CSS
- logique métier

---

## Étape 17 — Créer un fichier de réglages globaux
Ajoute un fichier type `src/content/site-settings.json` ou `src/content/site-settings.yml` pour :
- téléphone
- email
- adresse
- logo
- liens sociaux

Ainsi, ton client peut modifier les infos globales sans toucher à plusieurs pages.

---

## Étape 18 — Prévoir une convention pour les images
Exemple :
- `/uploads/home/...`
- `/uploads/services/...`
- `/uploads/team/...`

### Pourquoi
Cela évite de mélanger tous les fichiers médias dans un seul dossier sans logique.

---

## Étape 19 — Prévoir une branche de test si besoin
Si tu veux plus de sécurité :
- branche `main` pour la prod
- branche `staging` pour les tests

Tu pourras alors tester les modifications avant publication finale.

---

# Phase 9 — Checklist de validation finale

## Étape 20 — Vérifications techniques
Avant de livrer au client, vérifie :
- que le site build sans erreur ;
- que tous les champs de `.pages.yml` existent bien dans les fichiers ;
- que les schémas Astro correspondent ;
- que les images s’affichent ;
- que le client ne peut pas casser la structure ;
- que les contenus vides sont bien gérés côté front.

---

# Erreurs courantes à éviter

## 1. Schéma Astro différent du CMS
Si Pages CMS écrit un champ qui n’existe pas dans `content.config.ts`, Astro peut casser au build.

## 2. Images stockées dans un mauvais dossier
Si tu mets les images dans un endroit mal servi par Astro, les URLs peuvent être incorrectes.

## 3. Trop de liberté donnée au client
Plus tu exposes de champs techniques, plus tu augmentes le risque de casse.

## 4. Noms de fichiers non maîtrisés
Sans convention, les slugs et les noms deviennent vite incohérents.

## 5. Pas de test de rebuild
Il faut toujours tester une vraie modification CMS jusqu’au déploiement Cloudflare.

---

# Configuration minimale recommandée pour un premier projet client

## Ce que je te recommande
Pour un premier site client Astro avec Pages CMS, limite-toi à :
- 1 collection `pages`
- 1 collection `services` ou `posts`
- 1 fichier `site-settings`
- 1 dossier `public/uploads`

C’est le meilleur compromis entre simplicité, maintenabilité et autonomie client.

---

# Procédure de livraison au client

## Ce que tu fais avant livraison
1. tu finalises la structure du site ;
2. tu remplis les premiers contenus ;
3. tu testes l’édition dans Pages CMS ;
4. tu testes le rebuild Cloudflare ;
5. tu documentes les champs modifiables.

## Ce que tu remets au client
- un accès Pages CMS ;
- un mini guide d’utilisation ;
- une liste de ce qu’il peut modifier ;
- une règle simple : ne modifier que les contenus prévus.

---

# Résumé opérationnel

## Stack finale
- Astro pour le site
- GitHub pour stocker le contenu
- Pages CMS pour l’édition
- Cloudflare Pages pour le déploiement

## Flux complet
1. le client modifie un contenu dans Pages CMS ;
2. Pages CMS écrit dans le repo GitHub ;
3. Cloudflare Pages rebuild ;
4. le site est mis à jour.

---

# Étape suivante conseillée
La suite la plus utile est de préparer un **starter concret** avec :
- l’arborescence exacte ;
- un `.pages.yml` prêt à coller ;
- un `content.config.ts` propre ;
- une page d’accueil éditable ;
- un fichier `site-settings` global.

Cela te donnera une base réutilisable pour tous tes futurs sites clients.

