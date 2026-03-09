---
name: add-product
description: Ajouter un nouveau vin ou coffret cadeau au catalogue du site. À invoquer avant tout ajout de produit dans src/content/vins/ ou src/content/coffrets/.
---

# Skill : add-product

Ce skill guide l'ajout d'un nouveau produit (vin ou coffret) au catalogue Domaine de la Périnade.

## Avant de commencer

Demander à l'utilisateur si ce n'est pas précisé :
- Type de produit : **vin** (`src/content/vins/`) ou **coffret** (`src/content/coffrets/`)
- Slug du produit (kebab-case, ex: `cuvee-minerve`)
- Informations du produit (nom, appellation, millésime, prix, description, image, etc.)

## Structure d'un fichier vin (référence)

```yaml
# src/content/vins/{slug}.fr.yaml
nom: "Nom de la cuvée"
couleur: "Rouge"           # Rouge | Blanc | Rosé
couleurTone: "Rouge"
appellation: "AOP Minervois"
millesime: 2023            # année ou null si sans millésime
volume: 75                 # en centilitres
prix: 15                   # en euros
stock: "En stock"          # "En stock" | "Rupture de stock"
description: "Description courte et poétique."
badges:
  - "Bio"                  # optionnel
image: "../../assets/perinade/shop/catalog/{slug}.webp"
imageAlt: "Description de l'image"
featured: false
ordre: 10                  # ordre d'affichage dans le catalogue
locale: "fr"
```

## Workflow obligatoire

### 1. Créer les 3 fichiers YAML

Créer dans l'ordre :
1. `src/content/vins/{slug}.fr.yaml` (ou `coffrets/`) — version française complète
2. `src/content/vins/{slug}.en.yaml` — adapter en anglais (conserver le nom de cuvée en FR)
3. `src/content/vins/{slug}.es.yaml` — adapter en espagnol (conserver le nom de cuvée en FR)

Le champ `locale` doit correspondre à chaque fichier : `"fr"`, `"en"`, `"es"`.

### 2. Vérifier le Zod schema

Ouvrir `src/content.config.ts` et vérifier que tous les champs utilisés sont définis dans le schema de la collection concernée (`vins` ou `coffrets`). Si un nouveau champ est ajouté, le déclarer dans le schema et dans `src/types/`.

### 3. Vérifier l'image

- L'image doit exister dans `public/assets/perinade/shop/catalog/{slug}.webp`
- Si elle n'existe pas encore, utiliser un placeholder ou demander à l'utilisateur de la fournir
- Ne jamais utiliser `import img from '...'` dans les fichiers YAML

### 4. Valider

```bash
npm run i18n:verify
```

Lire `output/i18n/audit.md` pour confirmer qu'aucune clé n'est manquante entre les 3 locales.

## Checklist de fin de tâche

- [ ] `{slug}.fr.yaml` créé et complet
- [ ] `{slug}.en.yaml` créé et adapté
- [ ] `{slug}.es.yaml` créé et adapté
- [ ] Champ `locale` correct dans chaque fichier
- [ ] Zod schema dans `src/content.config.ts` compatible
- [ ] Image référencée existe dans `public/assets/`
- [ ] `npm run i18n:verify` passé sans erreur
- [ ] Rapport `output/i18n/audit.md` consulté et propre

## Notes

- Les noms de cuvées restent en français dans toutes les locales.
- Le champ `stock` doit aussi être traduit pour les locales EN et ES (`"In stock"` / `"En stock"` / `"En existencia"`).
- Le prix est commun à toutes les locales — utiliser la même valeur numérique.
