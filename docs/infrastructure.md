# Infrastructure Cloudflare — Périnade

*Dernière mise à jour : 2026-03-10*

---

## Vue d'ensemble

Le site Périnade est déployé sur **Cloudflare Pages** avec un backend serverless composé de **Workers**, une base de données **D1** (SQLite), un cache **KV**, et un bucket **R2** pour les médias.

```
                          ┌─────────────────────────────────┐
  Visiteur ───HTTPS──────►│  Cloudflare Pages               │
                          │  (site Astro statique)          │
                          └────────────┬────────────────────┘
                                       │ /api/*
                          ┌────────────▼────────────────────┐
                          │  Cloudflare Workers             │
                          │  ├── contact-form  /api/contact │
                          │  ├── stripe-webhook /api/stripe/│
                          │  │                    webhook   │
                          │  ├── api            /api/*      │
                          │  └── edge-security  /*          │
                          └──┬──────────┬──────────────┬────┘
                             │          │              │
                    ┌────────▼──┐ ┌─────▼────┐ ┌──────▼──┐
                    │  D1       │ │    KV    │ │   R2    │
                    │ (SQLite)  │ │  (cache) │ │ (media) │
                    └───────────┘ └──────────┘ └─────────┘
```

---

## Ressources Cloudflare

| Ressource | Nom | ID |
|-----------|-----|----|
| Account | — | `aea813e220eb8b709d70698a80ded18e` |
| Zone | perinade.alpha2omegaconsulting.com | `3de818ba26d525ef6b866487c8cf2b21` |
| Pages Project | perinade | — |
| D1 Database | perinade-dev-db | `69f84eaf-2291-44c5-bf6f-eaa4b8c1d46f` |
| KV Namespace | perinade-dev-kv | `eb0dfc6944b74a048e140b36e74b13be` |
| R2 Bucket | perinade-dev-media | — |

---

## Workers

### `perinade-dev-edge-security` — Sécurité globale

- **Route** : `perinade.alpha2omegaconsulting.com/*`
- **Fichier** : `infra/workers/edge-security/index.js`
- **Rôle** : Injecte les headers de sécurité sur toutes les requêtes
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Bindings** : aucun
- **Secrets** : aucun

### `perinade-dev-contact-form` — Formulaire de contact

- **Route** : `perinade.alpha2omegaconsulting.com/api/contact`
- **Fichier** : `infra/workers/contact-form/index.js`
- **Rôle** : Reçoit les soumissions POST, sauvegarde en D1, envoie l'email via Resend
- **Bindings** :
  - `DB` → D1 `perinade-dev-db`
  - `CACHE` → KV `perinade-dev-kv`
- **Variables** :
  - `ALLOWED_ORIGINS` = `https://perinade.alpha2omegaconsulting.com,https://perinade.fr`
- **Secrets requis** :
  ```bash
  wrangler secret put RESEND_API_KEY --name perinade-dev-contact-form
  wrangler secret put CONTACT_EMAIL_TO --name perinade-dev-contact-form
  ```
- **Fonctionnalités** :
  - Rate limiting : 5 requêtes / 15 min par IP (via KV)
  - Validation CORS, format email, longueur des champs
  - Sauvegarde dans `contact_submissions` (D1)
  - Envoi email via `api.resend.com`

### `perinade-dev-stripe-webhook` — Webhook Stripe

- **Route** : `perinade.alpha2omegaconsulting.com/api/stripe/webhook`
- **Fichier** : `infra/workers/stripe-webhook/index.js`
- **Rôle** : Reçoit les événements Stripe, vérifie la signature HMAC, insère les commandes en D1
- **Bindings** :
  - `DB` → D1 `perinade-dev-db`
- **Secrets requis** :
  ```bash
  wrangler secret put STRIPE_WEBHOOK_SECRET --name perinade-dev-stripe-webhook
  wrangler secret put STRIPE_SECRET_KEY --name perinade-dev-stripe-webhook
  ```
- **Événements traités** : `checkout.session.completed`
- **Vérification** : HMAC SHA-256 (Web Crypto API, sans SDK Stripe)

### `perinade-dev-api` — API générale

- **Route** : `perinade.alpha2omegaconsulting.com/api/*`
- **Fichier** : `infra/workers/api/index.js`
- **Bindings** :
  - `DB` → D1 `perinade-dev-db`
  - `CACHE` → KV `perinade-dev-kv`

---

## Schéma D1 (`perinade-dev-db`)

```sql
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_email TEXT,
  amount_total INTEGER,
  currency TEXT DEFAULT 'eur',
  items TEXT NOT NULL,           -- JSON sérialisé
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  submitted_at TEXT DEFAULT (datetime('now'))
);
```

---

## Infrastructure-as-Code (Terraform)

Le répertoire `infra/` contient la configuration Terraform pour les ressources gérées :

```
infra/
├── main.tf                    # Provider + workspace locals
├── variables.tf               # Variables (domaine, token, zone…)
├── outputs.tf                 # IDs D1 + KV
├── d1.tf                      # Base de données D1
├── kv.tf                      # Namespace KV
├── r2.tf                      # Bucket R2
├── workers.tf                 # (commenté — déploiement via wrangler)
├── pages.tf                   # (commenté — déjà déployé via Git)
├── terraform.tfvars.example   # Template de configuration
└── workers/                   # Code des Workers
    ├── edge-security/
    │   ├── index.js
    │   └── wrangler.toml
    ├── contact-form/
    │   ├── index.js
    │   └── wrangler.toml
    ├── stripe-webhook/
    │   ├── index.js
    │   └── wrangler.toml
    └── api/
        ├── index.js
        └── wrangler.toml
```

**Séparation des responsabilités :**
- **Terraform** : gère D1, KV, R2 (état partagé, versionnement)
- **Wrangler** : déploie le code des Workers (format ES module non supporté par Terraform)

### Initialiser Terraform

```bash
cd infra/
cp terraform.tfvars.example dev.tfvars
# Remplir dev.tfvars avec cloudflare_api_token et cloudflare_zone_id
terraform init
terraform workspace new dev   # ou select dev
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars
```

---

## Déployer les Workers

```bash
cd infra/workers/edge-security/
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
CLOUDFLARE_API_TOKEN=<TOKEN> \
npx wrangler deploy

# Répéter pour chaque Worker
cd ../contact-form/  && npx wrangler deploy
cd ../stripe-webhook/ && npx wrangler deploy
cd ../api/           && npx wrangler deploy
```

---

## Configurer les secrets

```bash
# Formulaire de contact
wrangler secret put RESEND_API_KEY     --name perinade-dev-contact-form
wrangler secret put CONTACT_EMAIL_TO   --name perinade-dev-contact-form

# Stripe webhook
wrangler secret put STRIPE_WEBHOOK_SECRET --name perinade-dev-stripe-webhook
wrangler secret put STRIPE_SECRET_KEY     --name perinade-dev-stripe-webhook
```

---

## Stripe Webhook

- **Webhook ID** : `we_1T9DevAdKQnC191cj8ueTL6R` (mode test)
- **URL** : `https://perinade.alpha2omegaconsulting.com/api/stripe/webhook`
- **Événements** : `checkout.session.completed`
- **Secret** : récupérer via `STRIPE_WEBHOOK_SECRET` dans les secrets Worker

Pour basculer en production :
1. Remplacer `sk_test_` par `sk_live_` dans les secrets
2. Créer un nouveau webhook en mode live dans Stripe Dashboard
3. Mettre à jour `STRIPE_WEBHOOK_SECRET`

---

## Email Transactionnel (Resend)

- **Service** : [resend.com](https://resend.com) — plan gratuit 3 000 emails/mois
- **From** (temporaire) : `Périnade Contact <onboarding@resend.dev>`
- **From** (production) : `contact@perinade.fr` — à configurer après vérification DNS du domaine `perinade.fr` sur Resend
- **Destination** : `CONTACT_EMAIL_TO` (secret Worker)

---

## Migration de domaine (alpha2omegaconsulting.com → perinade.fr)

Quand `perinade.fr` sera géré sur Cloudflare :

1. Mettre à jour `site_domain = "perinade.fr"` dans `prod.tfvars`
2. Mettre à jour le `zone_id` dans `prod.tfvars`
3. Relancer `terraform apply -var-file=prod.tfvars`
4. Redéployer les Workers (wrangler lira les nouvelles routes)
5. Vérifier le domaine sur Resend pour activer `from: contact@perinade.fr`
