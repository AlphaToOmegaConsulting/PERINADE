# Audit UX — Domaine de la Périnade
**Date :** 2026-03-10
**Périmètre :** Site complet — 5 pages + panier + confirmation, 3 locales (FR/EN/ES)
**Stack :** Astro 5, TypeScript, Cloudflare Pages

---

## Résumé exécutif

Le site est bien structuré et mobile-first avec un bon système de tokens de design. Les principaux problèmes se concentrent sur trois axes : **(1) l'architecture i18n des pages panier** — dont les chaînes JavaScript sont hardcodées par fichier au lieu d'utiliser le système YAML, créant un risque de dérive entre locales ; **(2) plusieurs lacunes d'accessibilité** — notamment le contraste de la couleur accent (`#c49c6e`), l'absence de navigation clavier dans le calendrier de réservation, et des erreurs de formulaire non annoncées aux lecteurs d'écran ; **(3) quelques points de friction UX mineurs** — panier vide sans CTA de retour, pas de lien panier visible dans le header desktop, et deux aria-labels français hardcodés dans le composant de réservation.

---

## Liste d'actions priorisée

### Quick wins — Low effort, High impact
| # | Action | Fichier | Effort |
|---|--------|---------|--------|
| 1 | Ajouter un CTA "Retour à la boutique" sur le panier vide | `panier.astro`, `cart.astro`, `carrito.astro` | Low |
| 2 | Corriger les aria-labels "Diminuer/Augmenter" hardcodés FR | `BookingSection.astro` | Low |
| 3 | Agrandir les zones cliquables du sélecteur de langue | `Header.astro` | Low |
| 4 | Corriger "Telefono" → "Teléfono" dans confirmation ES | `confirmacion.astro` | Low |
| 5 | Corriger aria-label FR "Actions confirmation" → "Actions de confirmation" | `confirmation.astro` | Low |

### Court terme — Medium effort
| # | Action | Fichier | Effort |
|---|--------|---------|--------|
| 6 | Ajouter `aria-describedby` dynamique sur les champs de formulaire | `contact-form.ts`, `Contact.astro` | Medium |
| 7 | Implémenter la navigation clavier (touches fléchées) dans le calendrier | `booking-calendar.ts` | Medium |
| 8 | Remplacer la couleur accent pour le texte normal (ratio 2.52:1 échoue AA) | `global.css` + composants | Medium |
| 9 | Ajouter un lien panier dans le header desktop | `Header.astro` | Medium |
| 10 | Corriger la redirection Stripe vers la bonne locale confirmation | Worker `stripe-webhook` ou `panier.astro` | Medium |

### Refactos — High effort
| # | Action | Fichier | Effort |
|---|--------|---------|--------|
| 11 | Migrer les chaînes JS du panier vers le système YAML (data-attributes server-side) | `panier.astro` + `cart.astro` + `carrito.astro` | High |

---

## Findings détaillés

### 1. Navigation

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| N1 | Pas de lien panier dans le header desktop — seul accès via footer ou mobile quick-actions | major | medium | `Header.astro` |
| N2 | Hit targets du sélecteur de langue trop petits sur desktop : font `0.68rem`, padding `0.2rem 0.35rem` (~20×12px CSS, minimum WCAG 2.5.5 = 44×44px) | major | low | `Header.astro:281-284` |
| N3 | `isCurrentLink` utilise `startsWith` : `/domaine` serait actif si une route `/domaine/[slug]` existe | minor | low | `Header.astro:32-37` |
| N4 | Skip link présent et fonctionnel — `ui.skipToContent` traduit dans les 3 locales | ✅ pass | — | `BaseLayout.astro:104` |
| N5 | Mobile quick actions (Réserver/Boutique/Appeler) — labels tous issus des props YAML, aucun hardcodé | ✅ pass | — | `Header.astro:112-148` |

---

### 2. Tunnels de conversion

#### 2a. Tunnel Boutique → Panier → Paiement

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| C1 | Panier vide : seul un `<p>` de texte, aucun CTA de retour à la boutique — dead end utilisateur | major | low | `panier.astro:40`, `cart.astro:40`, `carrito.astro:40` |
| C2 | ~10 chaînes JS par page de panier hardcodées directement dans `<script>` (labels de quantité, messages d'erreur Stripe, messages de statut) — contournent complètement le système YAML/i18n | critical | high | `panier.astro:147-251`, `cart.astro:147-251`, `carrito.astro:147-251` |
| C3 | Les 3 locales ont chacune leurs propres traductions hardcodées — cohérent mais non maintenable via le CMS | major | high | (idem C2) |
| C4 | Endpoint Stripe `fetch("/create-checkout-session")` commun aux 3 locales — non bloquant si le Worker gère la locale depuis les headers | minor | low | `panier.astro:236` |

#### 2b. Tunnel Confirmation

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| C5 | Redirection post-paiement Stripe vers `/confirmation` (FR) depuis toutes les locales — les pages `/en/confirmation` et `/es/confirmacion` existent mais ne sont jamais atteintes via Stripe | major | medium | Côté Worker `stripe-webhook` |
| C6 | Labels "Email", "Téléphone" hardcodés dans chaque fichier confirmation (non YAML) | minor | low | `confirmation.astro:68`, `en/confirmation.astro:68`, `confirmacion.astro:72` |
| C7 | `aria-label="Actions confirmation"` sur le `<nav>` de confirmation FR — mal libellé (devrait être "Actions de confirmation") | minor | low | `confirmation.astro:77` |
| C8 | ES : `"Acciones de confirmacion"` manque l'accent sur "confirmación" | minor | low | `confirmacion.astro:77` |
| C9 | ES : `"Telefono"` manque l'accent — devrait être "Teléfono" | minor | low | `confirmacion.astro:72` |

#### 2c. Tunnel Réservation

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| C10 | `aria-label="Diminuer"` et `aria-label="Augmenter"` hardcodés en français dans le composant partagé `BookingSection.astro` — affiché tel quel sur les pages EN et ES | major | low | `BookingSection.astro:77,79` |
| C11 | Submit endpoint configurable via `booking.config.submitEndpoint` dans les YAML — correctement i18né | ✅ pass | — | `BookingSection.astro:50` |
| C12 | Messages de succès/erreur booking issus de `booking.ui.defaultSuccessMessage/defaultErrorMessage` — correctement i18né | ✅ pass | — | `BookingSection.astro:51-55` |

---

### 3. Contenu & hiérarchie visuelle

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| H1 | Un seul `<h1>` par page sur les 5 pages + panier | ✅ pass | — | Chaque hero |
| H2 | Saut de niveau h3 → h4 dans `BookingCalendar.astro` (mois h3, slots h4, participants h4) | minor | low | `BookingCalendar.astro:30,61,66` |
| H3 | Tous les composants section utilisent `SectionHeading.astro` (h2 uniforme) | ✅ pass | — | — |
| H4 | CTAs distincts et contextuels dans la boutique (Ajouter au panier / Composer un coffret / Découvrir) | ✅ pass | — | — |
| H5 | Plan de visite mis en avant par badge + `isHighlighted` — vérifier que la distinction n'est pas uniquement colorimétrique | minor | medium | `PricingPlans.astro` |

---

### 4. Mobile

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| M1 | Grille boutique 4 colonnes → responsive 4→3→2→1 correctement implémentée | ✅ pass | — | `ShopProductGrid.astro:58-88` |
| M2 | Calendrier de réservation : stacking vertical à 900px correctement implémenté | ✅ pass | — | `BookingCalendar.astro:326-335` |
| M3 | Panier : table se transforme en layout card sur mobile (`<63.9em`) | ✅ pass | — | `panier.astro:679-744` |
| M4 | Quick actions bar : `padding-bottom: calc(0.5rem + env(safe-area-inset-bottom))` — safe areas respectées | ✅ pass | — | `Header.astro:574` |
| M5 | Taille minimale des boutons du calendrier non vérifiée à 375px — à tester manuellement | minor | low | `BookingCalendar.astro` |

---

### 5. Accessibilité

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| A1 | `--color-accent: #c49c6e` sur fond blanc : **ratio de contraste 2.52:1** — échoue WCAG AA pour texte normal (4.5:1) ET texte large (3:1). Utilisée sur les eyebrow labels et certains titres | major | medium | `global.css` + composants utilisant `var(--color-accent)` |
| A2 | Formulaire contact : `aria-invalid` correctement défini dynamiquement, mais **`aria-describedby` absent** — les erreurs ne sont pas annoncées aux lecteurs d'écran | major | medium | `contact-form.ts:19-27`, `Contact.astro` |
| A3 | Calendrier de réservation : **navigation clavier absente** (touches fléchées entre les jours) — WCAG 2.1 Level AA non respecté pour la saisie de date | major | medium | `booking-calendar.ts` |
| A4 | `prefers-reduced-motion` couvert dans `motion.css` — transitions réduites à 1ms, transforms désactivés | ✅ pass | — | `motion.css:108-132` |
| A5 | Skip link fonctionnel, localisé dans les 3 langues via `ui.skipToContent` | ✅ pass | — | `BaseLayout.astro:104` |
| A6 | `aria-current="date"`, `aria-pressed`, `aria-disabled` présents sur les boutons du calendrier | ✅ pass | — | `booking-calendar.ts:170,211,216` |
| A7 | `aria-live="polite"` sur le statut de réservation | ✅ pass | — | `BookingSection.astro:101` |

---

### 6. i18n

| ID | Finding | Severity | Effort | Fichier |
|----|---------|----------|--------|---------|
| I1 | Chaînes JS du panier hardcodées dans chaque fichier de page (même problème que C2) — non maintenables via YAML/CMS | critical | high | `panier.astro`, `cart.astro`, `carrito.astro` |
| I2 | `aria-label="Diminuer/Augmenter"` français dans composant partagé — visible en anglais et espagnol (même problème que C10) | major | low | `BookingSection.astro:77,79` |
| I3 | `hreflang x-default` pointe vers FR — correct (FR = locale principale) | ✅ pass | — | `BaseLayout.astro` |
| I4 | Routes de confirmation correctement configurées (`/confirmation`, `/en/confirmation`, `/es/confirmacion`) mais jamais atteintes depuis Stripe en EN/ES | major | medium | Worker Stripe / `panier.astro` |
| I5 | Toutes les clés `ui.*` (menus, nav, formulaires) traduites dans les 3 locales YAML | ✅ pass | — | `src/content/ui/` |

---

## Appendice — Définitions

### Sévérité
| Niveau | Définition |
|--------|-----------|
| **critical** | Bloque une tâche utilisateur core ou contourne le système d'architecture |
| **major** | Dégrade significativement l'expérience pour une partie des utilisateurs |
| **minor** | Polish, cas limite peu fréquent, ou incohérence cosmétique |

### Effort
| Niveau | Définition |
|--------|-----------|
| **low** | 1 fichier, moins d'1 heure |
| **medium** | 2–5 fichiers, moins d'1 journée |
| **high** | Changement architectural, plusieurs sessions |

---

*Audit généré le 2026-03-10 — 23 findings (3 pass-confirmés pour information, 8 ✅ pass, 12 actifs)*
