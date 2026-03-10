# Spec — Espace utilisateur Périnade

**Date :** 2026-03-10
**Statut :** Approuvé
**Projet :** PERINADE — `/Users/codex/Desktop/WEBDEV/PERINADE`

---

## Context

Les acheteurs du site n'ont actuellement aucun espace personnel. Les données de paiement vivent dans Stripe, les commandes dans Cloudflare D1, et aucun lien ne permet à un client de retrouver son historique ou d'accumuler de la fidélité. Cette spec définit un espace utilisateur avec historique de commandes et programme de points, en maximisant l'isolation des données personnelles pour des raisons de sécurité et de conformité RGPD.

---

## Architecture — 3 silos de données

```
STRIPE                  SUPABASE (eu-west-1)         CLOUDFLARE
──────────              ────────────────────         ──────────
Paiements               Auth (JWT + sessions)        D1: orders
Adresses livr.          user_profiles                D1: products
Facturation             loyalty_transactions         D1: stock
                        → données perso isolées      → données transact.
```

**Principe d'isolation :** compromission Cloudflare ≠ exposition données perso ; compromission Supabase ≠ exposition commandes/stock.

**Auth :** magic link via email (Supabase → Resend). JWT Supabase vérifié par le Worker API via JWKS (stateless, pas de roundtrip Supabase par requête).

---

## Modèle de données

### Supabase — nouvelles tables

```sql
-- Profil (1:1 avec auth.users)
CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  loyalty_points  INTEGER NOT NULL DEFAULT 0,
  total_orders    INTEGER NOT NULL DEFAULT 0,
  total_spent_cts INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Mouvements de points
CREATE TABLE loyalty_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  points_delta INTEGER NOT NULL,   -- positif = gagné, négatif = dépensé
  reason       TEXT NOT NULL,      -- 'order' | 'refund' | 'redemption' | 'manual'
  reference_id TEXT,               -- stripe_session_id
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile" ON user_profiles FOR ALL USING (auth.uid() = id);

ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_loyalty" ON loyalty_transactions FOR SELECT USING (auth.uid() = user_id);
```

### Cloudflare D1 — migration minimale

```sql
-- Migration 003
ALTER TABLE orders ADD COLUMN supabase_user_id TEXT;
CREATE INDEX idx_orders_supabase_user_id ON orders(supabase_user_id);
```

**Règle de fidélité :** 1 point par € dépensé (`floor(amount_total / 100)`). Points affichés ; redemption = phase 2.

---

## Flux de création de compte (post-achat)

Déclenché par `checkout.session.completed` dans le Worker `stripe-webhook` :

```
1. supabase.auth.admin.createUser({ email, email_confirm: true })
   └─ Idempotent : si user existe déjà, récupérer son id
2. upsert user_profiles
   ├─ total_orders + 1
   ├─ total_spent_cts + amount_total
   └─ loyalty_points + floor(amount_total / 100)
3. insert loyalty_transactions (reason='order', reference_id=session_id)
4. D1: UPDATE orders SET supabase_user_id = ? WHERE stripe_session_id = ?
5. supabase.auth.admin.generateLink({ type: 'magiclink', email })
   └─ Envoyer via Resend avec template "Bienvenue + accédez à votre espace"
```

---

## Pages Astro (3 locales)

| Route FR | Route EN | Route ES | Rôle |
|---|---|---|---|
| `/compte` | `/en/account` | `/es/cuenta` | Dashboard / login |
| `/compte/commandes` | `/en/account/orders` | `/es/cuenta/pedidos` | Historique commandes |
| `/compte/fidelite` | `/en/account/loyalty` | `/es/cuenta/fidelidad` | Points + transactions |
| `/compte/callback` | `/en/account/callback` | `/es/cuenta/callback` | Échange token → session |

**Comportement :** si non connecté → formulaire email magic link. Si connecté → contenu de l'espace.

---

## APIs Workers (à ajouter dans `perinade-dev-api`)

```
GET  /api/user/me              → profil + points (JWT requis)
GET  /api/user/orders          → commandes par email ou supabase_user_id
POST /api/auth/logout          → clear cookie httpOnly
GET  /api/auth/session         → état connexion (pour le header Astro)
POST /api/admin/users/:id/gdpr-delete  → suppression RGPD orchestrée
```

Middleware d'auth utilisateur dans Worker API :
- Lire header `Authorization: Bearer <supabase_jwt>`
- Vérifier signature via JWKS Supabase (`{SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
- Extraire `sub` (user_id) et `email`

---

## Variables d'environnement

| Variable | Où | Usage |
|---|---|---|
| `SUPABASE_URL` | Astro (public) | Client SDK |
| `SUPABASE_ANON_KEY` | Astro (public) | Client SDK |
| `SUPABASE_SERVICE_ROLE_KEY` | Worker stripe-webhook (secret) | Admin API |
| `SUPABASE_JWT_SECRET` | Worker api (secret) | Vérif JWT |

---

## RGPD — Droit à l'effacement

Endpoint `/api/admin/users/:id/gdpr-delete` :
1. `supabase.auth.admin.deleteUser(id)` → cascade sur `user_profiles` + `loyalty_transactions`
2. D1 : `UPDATE orders SET customer_email = '[supprimé]' WHERE supabase_user_id = ?`
3. Stripe : documenter dans le Dashboard Stripe (manuel ou via API Stripe `redact`)

---

## Fichiers critiques à modifier / créer

**Modifier :**
- `infra/workers/stripe-webhook/index.js` — ajout logique Supabase post-paiement
- `infra/workers/api/src/index.ts` — nouvelles routes `/api/user/*` et middleware auth user
- `infra/migrations/` — ajouter `003_user_accounts.sql`

**Créer :**
- `src/pages/compte.astro` + `en/account.astro` + `es/cuenta.astro`
- `src/pages/compte/commandes.astro` + variantes locales
- `src/pages/compte/fidelite.astro` + variantes locales
- `src/pages/compte/callback.astro` + variantes locales
- `src/scripts/auth.ts` — état connexion client-side
- `src/content/ui/` — nouvelles chaînes UI compte (3 locales)
- `infra/workers/api/src/routes/user.ts` — routes utilisateur
- `infra/workers/api/src/middleware/auth-user.ts` — vérification JWT Supabase

---

## Ordre de déploiement

1. Créer projet Supabase (région eu-west-1) + schéma SQL + RLS + SMTP Resend
2. Migration D1 `003_user_accounts.sql`
3. Injecter secrets Workers (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`)
4. Modifier Worker `stripe-webhook` (création compte + points)
5. Ajouter routes API user dans `perinade-dev-api`
6. Créer pages Astro (3 locales)
7. Tests E2E : achat test → magic link → espace → historique + points

---

## Vérification

- Achat Stripe test → user créé dans Supabase Dashboard → points crédités
- Magic link reçu → clic → session active → `/compte` affiche historique
- Données personnelles absentes de D1 (vérifier via Cloudflare D1 Console)
- RLS Supabase : user A ne peut pas voir profil de user B
- GDPR delete : user supprimé de Supabase, email anonymisé en D1
