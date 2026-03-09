---
name: edit-content
description: Modifier du contenu éditorial (texte, images, CTA, descriptions) sur une ou plusieurs sections du site. À invoquer avant tout changement de contenu visible.
---

# Skill : edit-content

Ce skill guide la modification de contenu éditorial sur le site Domaine de la Périnade.

## Règle fondamentale

Tout contenu visible appartient aux fichiers YAML dans `src/content/`. Ne jamais modifier directement les composants Astro pour y ajouter du texte.

## Workflow obligatoire

### 1. Identifier les fichiers cibles

Demander ou identifier clairement :
- Quelle section est concernée (home, domaine, visites, boutique, actualités, ui, contact)
- Quel champ précis doit changer

Table de correspondance section → fichiers YAML :
| Section | Fichiers |
|---------|---------|
| Page d'accueil | `src/content/site/{fr,en,es}.yaml` |
| Domaine | `src/content/domaine/{fr,en,es}.yaml` |
| Visites | `src/content/visits/{fr,en,es}.yaml` |
| Actualités | `src/content/news/{fr,en,es}.yaml` |
| Boutique (page) | `src/content/shop/{fr,en,es}.yaml` |
| UI (nav, boutons) | `src/content/ui/{fr,en,es}.yaml` |
| Fiche vin | `src/content/vins/{slug}.{fr,en,es}.yaml` |
| Fiche coffret | `src/content/coffrets/{slug}.{fr,en,es}.yaml` |
| Contact | `src/content/contact/contact.yaml` |

### 2. Lire le fichier FR en premier

Toujours partir de la version française — c'est la source de vérité éditoriale.

### 3. Appliquer les modifications

- Modifier `fr.yaml` en premier
- Adapter (pas traduire mécaniquement) `en.yaml` et `es.yaml` — conserver les noms de marques français (ex: "Domaine de la Périnade", noms de cuvées)
- Pour les images : utiliser uniquement des URL strings vers `public/assets/perinade/{section}/`, jamais d'`import`

### 4. Vérifier la structure

Si un **nouveau champ** est introduit :
1. Vérifier et mettre à jour `src/types/` (TypeScript)
2. Vérifier et mettre à jour le Zod schema dans `src/content.config.ts`
3. Vérifier que le composant qui consomme ce champ reçoit bien la nouvelle prop

### 5. Valider

Toujours terminer par :
```bash
npm run i18n:verify
```

Lire le rapport généré dans `output/i18n/audit.md` pour confirmer qu'aucune clé n'est manquante entre les locales.

## Checklist de fin de tâche

- [ ] Fichier `fr.yaml` modifié
- [ ] Fichier `en.yaml` mis à jour de façon cohérente
- [ ] Fichier `es.yaml` mis à jour de façon cohérente
- [ ] Aucun texte visible ajouté directement dans un composant `.astro`
- [ ] `npm run i18n:verify` passé sans erreur
- [ ] Rapport `output/i18n/audit.md` consulté et propre

## Cas particuliers

**Contenu uniquement pour une locale** : le faire uniquement si l'utilisateur le demande explicitement et clairement.

**Noms de produits / marque** : "Domaine de la Périnade", les noms de cuvées (ex: "Les Arènes", "Chardonnay") restent en français dans toutes les locales.

**UI strings** (boutons, labels, messages d'erreur) : ces éléments DOIVENT être traduits dans les 3 locales via `src/content/ui/{locale}.yaml`.
