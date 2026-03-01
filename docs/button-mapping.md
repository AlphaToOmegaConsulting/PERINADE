# Button Migration Mapping

## Canonical taxonomy

- `primary`: main action
- `secondary`: alternate high-emphasis action
- `ghost`: subtle secondary action (often on dark backgrounds)
- `text`: inline or low-emphasis textual action

## Legacy to canonical mapping

| Legacy / local CTA | New variant | Notes |
|---|---|---|
| `hero` (ButtonLink) | `primary` + `size=lg` | Home hero CTA |
| `form` (ButtonLink) | `primary` + `size=lg` | Contact/domain form CTA |
| `pill` (default ButtonLink) | `primary` | General CTA |
| `visit-hero__cta--secondary` | `ghost` | Dark hero context |
| `shop-offer__cta` | `secondary` | Inverted dark section |
| `access__cta` | `text` | Inline map link |
| Placeholder `data-todo` elements | Disabled canonical button | No navigation/action |

## Component coverage

- Header CTA desktop/mobile: canonical ButtonLink
- Hero/Home CTA: canonical ButtonLink
- Domaine CTA (hero + visit + contact + wines): canonical ButtonLink
- Boutique CTA (grid + cases + final band): canonical ButtonLink
- Visites CTA (hero + pricing + escape + booking submit): canonical ButtonLink
- Contact submit: canonical ButtonLink (`type=submit`)
- Footer newsletter submit: canonical ButtonLink (`type=submit`, still decorative flow)
- 404 locale actions: canonical ButtonLink

## Deferred

- Newsletter iFrame integration is intentionally deferred.
