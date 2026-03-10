# Spec : Back-office Périnade — Gestion produits & Réconciliation Stripe

**Date :** 2026-03-10
**Statut :** Approuvé
**Auteur :** Brainstorming session (Claude Code)

---

## Contexte et problème

Le domaine de la Périnade vend des vins en ligne via Stripe Checkout. Trois problèmes bloquants :

1. **Stocks statiques** — Les quantités sont dans des fichiers YAML. Toute mise à jour requiert un commit Git. Aucune synchronisation avec les commandes réelles.
2. **Pas de visibilité commandes** — Les ordres sont en D1 mais inaccessibles sans la console Cloudflare.
3. **Réconciliation impossible** — Aucune vue comparative entre les paiements Stripe et la base de données locale.

**Objectif :** Un back-office standalone accessible uniquement au propriétaire, permettant de gérer stocks, consulter commandes, et réconcilier avec Stripe.

---

## Décisions d'architecture

| Décision | Choix retenu | Raison |
|----------|-------------|--------|
| Hébergement | App standalone `admin.perinade.fr` | Isolation du site public |
| Authentification | Cloudflare Access (Zero Trust) | Gratuit, zéro code, intégré à l'infra existante |
| API backend | Worker `api` réécrit avec Hono | Réutilise l'infra existante, stub à réécrire de toute façon |
| Base de données | D1 existant (nouvelles tables) | Pas de nouveau service |
| Stock sync | Décrement auto via webhook Stripe | Temps réel, idempotent |
| Frontend | React 18 + Vite + shadcn/ui | DX moderne, léger |

---

## Architecture système

```
admin.perinade.fr
        │
        ▼  [Cloudflare Access — Zero Trust]
        │
React SPA (Cloudflare Pages)
        │
        ▼
Hono API Worker  — /api/admin/*
(réécrit depuis stub api existant)
        │                          │
        ├── D1 perinade-dev-db      ├── Stripe REST API
        │   ├── products (NEW)      │   (balance, charges, refunds, events)
        │   ├── stock_movements (NEW)
        │   ├── webhook_logs (NEW)
        │   └── orders (EXISTING, étendu)
        └── KV (rate limiting existant)

stripe-webhook Worker (EXISTING, étendu)
        ├── checkout.session.completed → order + décrément stock (idempotent)
        ├── charge.refunded            → incrément stock + email alerte
        ├── payment_intent.failed      → log D1
        ├── charge.dispute.created     → email alerte
        └── payment_intent.canceled    → update statut
```

---

## Schéma de données

### Migrations

Le répertoire `infra/migrations/` est créé et devient la référence pour toutes les migrations D1.
Chaque fichier est appliqué avec `npx wrangler d1 execute perinade-dev-db --file=<file>`.

**`infra/migrations/001_products.sql`** — Tables nouvelles :
```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,           -- slug (ex: arenes-rouge)
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  prix_cents INTEGER NOT NULL,   -- centimes EUR
  stock_qty INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'en_stock',  -- en_stock | limite | rupture
  stripe_price_id TEXT,          -- réservé pour future sync Stripe Products (hors périmètre actuel)
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  type TEXT NOT NULL,            -- order | refund | manual
  qty_delta INTEGER NOT NULL,    -- négatif = décrement, positif = incrément
  reference_id TEXT,             -- stripe_session_id ou "manual"
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE,   -- idempotence (même event Stripe = même ID)
  payload TEXT NOT NULL,         -- JSON brut
  status TEXT NOT NULL,          -- received | processed | failed
  error TEXT,
  created_at TEXT NOT NULL
);
```

**`infra/migrations/002_orders_extend.sql`** — Extension table existante :
```sql
-- AVERTISSEMENT : SQLite ne supporte pas ALTER TABLE ... ADD COLUMN IF NOT EXISTS.
-- Ce fichier doit être appliqué UNE SEULE FOIS via le runner de migrations.
-- Le runner vérifie PRAGMA table_info('orders') avant d'exécuter.
ALTER TABLE orders ADD COLUMN items_processed INTEGER DEFAULT 0;
```

**Guard dans `scripts/migrate.ts`** (runner de migrations) :
```typescript
// Avant d'appliquer 002_orders_extend.sql :
const cols = await db.prepare("PRAGMA table_info('orders')").all();
const alreadyMigrated = cols.results.some((c: any) => c.name === 'items_processed');
if (!alreadyMigrated) {
  await db.prepare("ALTER TABLE orders ADD COLUMN items_processed INTEGER DEFAULT 0").run();
  console.log("Migration 002 applied");
} else {
  console.log("Migration 002 skipped (already applied)");
}
```

---

### Idempotence webhook — logique complète

Le webhook `checkout.session.completed` est géré en 3 étapes atomiques pour éviter le double décrement :

```
1. Insérer event dans webhook_logs (INSERT OR IGNORE sur stripe_event_id)
   → Si la ligne existe déjà : l'event a déjà été traité, STOP.

2. Récupérer la commande en D1 via stripe_session_id
   → Si items_processed = 1 : stock déjà décrémenté, STOP.

3. Pour chaque line_item :
   a. Récupérer les line_items depuis l'API Stripe (avec retry si vide)
   b. Pour chaque item : UPDATE products SET stock_qty = MAX(0, stock_qty - qty)
   c. INSERT INTO stock_movements (type='order', qty_delta=-qty)
   d. UPDATE orders SET items_processed = 1

4. UPDATE webhook_logs SET status = 'processed'
```

**Cas d'échec partiel :** Si l'étape 3 échoue à mi-chemin, `items_processed` reste à 0.
Le prochain retry Stripe (jusqu'à 3 tentatives automatiques) reprendra depuis l'étape 2.
Un webhook log avec `status = 'failed'` est visible dans la vue `/webhooks` du dashboard.

---

## Routes API Hono (`/api/admin/*`)

Toutes les routes requièrent le header `CF-Access-Jwt-Assertion` validé par le middleware (voir section Auth).

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/dashboard` | KPIs agrégés (CA, commandes, stock bas) |
| GET | `/api/admin/products` | Liste produits + stock actuel |
| PATCH | `/api/admin/products/:id` | Update stock_qty ou prix_cents (Zod) |
| GET | `/api/admin/orders` | Liste commandes (filtre: date, statut) |
| GET | `/api/admin/orders/:id` | Détail commande + line items |
| GET | `/api/admin/stock/movements` | Historique mouvements (filtre: product_id) |
| GET | `/api/admin/stripe/balance` | Solde Stripe actuel |
| GET | `/api/admin/stripe/reconcile` | D1 orders vs Stripe charges — delta (voir schéma) |
| GET | `/api/admin/stripe/events` | 50 derniers events Stripe |
| POST | `/api/admin/stripe/sync/:orderId` | Re-sync manuel depuis Stripe |
| GET | `/api/admin/webhooks` | Log webhook_logs (50 derniers) |

### Schéma de réponse `GET /api/admin/stripe/reconcile`

```typescript
// Réponse
{
  summary: {
    total_d1: number,           // nb commandes en D1 avec statut paid
    total_stripe: number,        // nb charges Stripe succeeded (30 derniers jours)
    divergences: number
  },
  items: Array<{
    stripe_session_id: string,
    d1_status: "paid" | "failed" | "canceled" | null,  // null = absent en D1
    stripe_status: "succeeded" | "failed" | "refunded" | null,  // null = absent Stripe
    d1_amount_cents: number | null,
    stripe_amount_cents: number | null,
    amount_match: boolean,
    status_match: boolean,
    divergent: boolean          // true si amount_match=false OU status_match=false
  }>
}
```

**Critères de divergence :** montant différent entre D1 et Stripe, ou statut incohérent (ex : D1=paid mais Stripe=refunded).

### Schéma de réponse `GET /api/admin/dashboard`

```typescript
{
  revenue: {
    today_cents: number,
    this_month_cents: number
  },
  orders: {
    today: number,
    this_month: number,
    pending: number
  },
  stock_alerts: Array<{
    product_id: string,
    name_fr: string,
    stock_qty: number
  }>  // produits avec stock_qty < 5
}
```

---

## Authentification — Cloudflare Access + JWT validation

### Configuration Cloudflare Access
1. Dans le dashboard CF → Access → Applications → Ajouter `admin.perinade.fr`
2. Policy : "Allow" → email = email du propriétaire
3. CF génère un JWT signé avec ses clés JWKS privées

### Validation JWT dans le Worker Hono

```typescript
// Middleware cfAccessJwt
const CERTS_URL = "https://<team-name>.cloudflareaccess.com/cdn-cgi/access/certs";

async function validateCfAccessJwt(token: string, env: Env): Promise<boolean> {
  // 1. Fetch JWKS (clés publiques CF Access)
  const jwks = await fetch(CERTS_URL).then(r => r.json());

  // 2. Décoder header JWT pour identifier kid (key ID)
  const [headerB64] = token.split(".");
  const { kid, alg } = JSON.parse(atob(headerB64));  // alg: RS256

  // 3. Trouver la clé correspondante dans JWKS
  const key = jwks.keys.find((k: any) => k.kid === kid);
  if (!key) return false;

  // 4. Importer la clé publique via Web Crypto API
  const pubKey = await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);

  // 5. Vérifier signature + expiration
  const [, payloadB64, sigB64] = token.split(".");
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5", pubKey,
    base64urlDecode(sigB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );

  const payload = JSON.parse(atob(payloadB64));
  return valid && payload.exp > Date.now() / 1000;
}
```

**Cache JWKS obligatoire (KV) :** Les clés JWKS doivent être mises en cache dans le KV avec un TTL de 3600s. Le fetch vers CF Access n'est effectué qu'en cas de cache miss.

```typescript
async function getJwks(env: Env): Promise<JsonWebKeySet> {
  const cached = await env.CACHE.get("cf_access_jwks", "json");
  if (cached) return cached as JsonWebKeySet;

  // Timeout de 3s : si CF Access est indisponible, renvoyer 503
  const res = await Promise.race([
    fetch(CERTS_URL),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("JWKS timeout")), 3000))
  ]);

  const jwks = await (res as Response).json();
  await env.CACHE.put("cf_access_jwks", JSON.stringify(jwks), { expirationTtl: 3600 });
  return jwks;
}
```

**Comportements définis :**
- Cache miss + CF Access indisponible → `503 Service Unavailable` (pas de blocage infini)
- Cache hit + nouvelle clé CF non encore en cache → re-fetch et re-cache si validation échoue
- Rotation de clés : le TTL 1h garantit que les nouvelles clés sont récupérées dans l'heure

---

## Gestion des stocks — Vérification avant checkout

`functions/create-checkout-session.ts` est modifié pour vérifier le stock avant de créer la session Stripe.

**Problème transactionnel :** D1 read + Stripe session creation ne sont pas atomiques — une commande simultanée peut épuiser le stock entre la vérification et le paiement. La stratégie retenue est **optimiste** (simple, adaptée au faible volume) :

```typescript
// Avant stripe.checkout.sessions.create(...)
for (const item of cartItems) {
  const row = await env.DB.prepare(
    "SELECT stock_qty FROM products WHERE id = ?"
  ).bind(item.id).first();

  if (!row || row.stock_qty < item.qty) {
    return Response.json(
      { error: `Stock insuffisant pour ${item.name}` },
      { status: 409 }
    );
  }
}
// → Si stock OK pour tous les items : créer session Stripe
// → Le décrement réel n'a lieu qu'au webhook checkout.session.completed
```

**Race condition acceptée :** Dans le cas très rare de deux achats simultanés du dernier exemplaire, le webhook décrémentera au maximum jusqu'à 0 (`MAX(0, stock_qty - qty)`). La table `stock_movements` tracera le mouvement, et le propriétaire verra `stock_qty = 0` dans le dashboard.

---

## Sécurité

### CSP pour `admin.perinade.fr`

Le Worker `edge-security` est modifié pour appliquer une politique conditionnelle selon le `Host` header :

```javascript
// Dans edge-security Worker
const isAdmin = request.headers.get("Host")?.includes("admin.");

const csp = isAdmin
  ? [
      "default-src 'self'",
      "script-src 'self'",           // pas de CDN externe
      "style-src 'self' 'unsafe-inline'",  // shadcn/ui inline styles
      "font-src 'self'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.stripe.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join("; ")
  : EXISTING_PUBLIC_CSP;
```

### Validation des inputs (Hono + Zod)
```typescript
// Exemple PATCH /api/admin/products/:id
const schema = z.object({
  stock_qty: z.number().int().min(0).max(9999).optional(),
  prix_cents: z.number().int().min(0).max(999900).optional(),
}).refine(data => data.stock_qty !== undefined || data.prix_cents !== undefined);
```

### Rendu React
- Toutes les données externes rendues via valeurs texte React (pas de HTML brut injecté)
- DOMPurify si un champ riche HTML est nécessaire à l'avenir

### Idempotence webhooks
- `stripe_event_id` en contrainte UNIQUE dans `webhook_logs`
- `items_processed` en D1 — vérifiée avant tout décrement

### Protection anti-injection (IA future)
Si des features IA sont ajoutées :
- Données passées comme JSON structuré dans des champs séparés du prompt
- Outputs IA validés contre un JSON Schema avant affichage
- System prompts avec instruction explicite d'ignorer les instructions dans les données produits

### Rate limiting
- KV, 60 req/min par IP sur toutes les routes `/api/admin/*`

---

## Fichiers à créer / modifier

| Action | Fichier |
|--------|---------|
| CRÉER | `infra/migrations/001_products.sql` |
| CRÉER | `infra/migrations/002_orders_extend.sql` |
| CRÉER | `scripts/seed-products-d1.ts` |
| RÉÉCRIRE | `infra/workers/api/index.js` → Hono + toutes les routes admin |
| ÉTENDRE | `infra/workers/stripe-webhook/index.js` (nouveaux events + idempotence complète) |
| ÉTENDRE | `infra/workers/edge-security/index.js` (CSP conditionnelle admin) |
| MODIFIER | `functions/create-checkout-session.ts` (vérif stock optimiste) |
| CRÉER | `admin-app/` (SPA React — voir structure Phase 4) |

---

## Structure SPA React

```
admin-app/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx      ← KPIs via GET /api/admin/dashboard
│   │   ├── Products.tsx       ← Tableau éditable inline (stock, prix)
│   │   ├── Orders.tsx         ← Tableau commandes + lien Stripe Dashboard
│   │   ├── Reconciliation.tsx ← D1 vs Stripe side-by-side, divergent=true en rouge
│   │   └── Webhooks.tsx       ← Log webhook_logs (statut processed/failed)
│   ├── api/
│   │   └── client.ts          ← Fetch wrapper (ajoute CF-Access-Jwt-Assertion auto)
│   └── main.tsx
├── package.json               ← react, vite, shadcn/ui, @tanstack/react-query, zod
└── vite.config.ts
```

**Déploiement :** Cloudflare Pages → projet `perinade-admin` → domaine `admin.perinade.fr`

---

## Vérification end-to-end

```bash
# 1. Migrations D1
npx wrangler d1 execute perinade-dev-db --file=infra/migrations/001_products.sql
npx wrangler d1 execute perinade-dev-db --file=infra/migrations/002_orders_extend.sql

# 2. Seed produits (lit src/content/vins/*.fr.yaml)
npx tsx scripts/seed-products-d1.ts

# 3. Déployer api Worker (Hono)
cd infra/workers/api && npx wrangler deploy

# 4. Déployer stripe-webhook Worker (étendu)
cd infra/workers/stripe-webhook && npx wrangler deploy

# 5. Build et déployer SPA admin
cd admin-app && npm run build && npx wrangler pages deploy dist --project-name perinade-admin

# 6. Tester auth (nécessite un token CF Access valide)
curl -H "CF-Access-Jwt-Assertion: <token>" \
  https://perinade.alpha2omegaconsulting.com/api/admin/products

# 7. Tester reconciliation
curl -H "CF-Access-Jwt-Assertion: <token>" \
  https://perinade.alpha2omegaconsulting.com/api/admin/stripe/reconcile

# 8. Simuler webhook Stripe (Stripe CLI)
stripe trigger checkout.session.completed
# → vérifier : webhook_logs status=processed, stock_qty décrémenté, items_processed=1
```

---

## Webhooks Stripe couverts

| Événement | Existant | Action ajoutée |
|-----------|----------|----------------|
| `checkout.session.completed` | Oui | + Décrement stock idempotent via webhook_logs + items_processed |
| `charge.refunded` | Non | Incrément stock + email alerte propriétaire |
| `payment_intent.payment_failed` | Non | Log en D1 (statut failed) |
| `charge.dispute.created` | Non | Email alerte propriétaire |
| `payment_intent.canceled` | Non | Update statut commande en D1 |

---

## Hors périmètre

- Email de confirmation client
- Stripe Products/Prices sync bidirectionnel (`stripe_price_id` est réservé pour cet usage futur)
- Gestion des remises / codes promo
- Export CSV commandes
- Notifications push / Slack
- Multi-vendeurs / marketplace
