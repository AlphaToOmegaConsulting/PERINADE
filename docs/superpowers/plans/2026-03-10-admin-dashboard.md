# Admin Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone admin back-office at `admin.perinade.fr` that lets the domain owner manage product stock in real time, view orders, and reconcile D1 data against Stripe.

**Architecture:** React/Vite SPA on Cloudflare Pages protected by Cloudflare Access; Hono API Worker rewritten from the existing stub; D1 as source of truth for products + stock + orders; Stripe webhook Worker extended with 4 new event handlers and full idempotence.

**Tech Stack:** Hono 4, Zod 3, React 18, Vite 5, TanStack Query 5, shadcn/ui, Tailwind 3, Cloudflare D1/KV/Pages, Stripe Node SDK, Vitest

**Spec:** `docs/superpowers/specs/2026-03-10-admin-dashboard-design.md`

---

## Chunk 1: D1 Migrations & Seed Script

### File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| CREATE | `infra/migrations/001_products.sql` | Tables products, stock_movements, webhook_logs |
| CREATE | `infra/migrations/002_orders_extend.sql` | Add items_processed column to orders |
| CREATE | `scripts/migrate.ts` | Safe migration runner (PRAGMA guard for 002) |
| CREATE | `scripts/seed-products-d1.ts` | Import 10 wines from YAML into D1 products table |

---

### Task 1: D1 migration files

**Files:**
- Create: `infra/migrations/001_products.sql`
- Create: `infra/migrations/002_orders_extend.sql`

- [ ] **Step 1.1 — Create migrations directory and 001**

```bash
mkdir -p infra/migrations
```

Create `infra/migrations/001_products.sql`:

```sql
-- Migration 001: product catalog, stock movements, webhook logs
-- Apply once: npx wrangler d1 execute perinade-dev-db --file=infra/migrations/001_products.sql

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  prix_cents INTEGER NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'en_stock',
  stripe_price_id TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  type TEXT NOT NULL,
  qty_delta INTEGER NOT NULL,
  reference_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  error TEXT,
  created_at TEXT NOT NULL
);
```

- [ ] **Step 1.2 — Create 002**

Create `infra/migrations/002_orders_extend.sql`:

```sql
-- Migration 002: add items_processed column to orders
-- WARNING: SQLite does not support ADD COLUMN IF NOT EXISTS.
-- This file is applied by scripts/migrate.ts which guards via PRAGMA table_info.
-- Do NOT run this file directly with wrangler d1 execute.
ALTER TABLE orders ADD COLUMN items_processed INTEGER DEFAULT 0;
```

- [ ] **Step 1.3 — Commit**

```bash
git add infra/migrations/
git commit -m "feat(db): add migrations 001 (products/stock/webhooks) and 002 (orders extend)"
```

---

### Task 2: Migration runner script

**Files:**
- Create: `scripts/migrate.ts`

The runner applies migrations in order, with a PRAGMA guard for 002 (the non-idempotent ALTER TABLE).

- [ ] **Step 2.1 — Create `scripts/migrate.ts`**

```typescript
#!/usr/bin/env npx tsx
/**
 * Migration runner for Cloudflare D1 (local dev / CI).
 * Uses wrangler d1 execute for 001, PRAGMA guard for 002.
 *
 * Usage:
 *   CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx npx tsx scripts/migrate.ts
 *
 * For local wrangler dev (no API token needed):
 *   npx tsx scripts/migrate.ts --local
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const isLocal = process.argv.includes("--local");
const DB_NAME = "perinade-dev-db";
const baseArgs = isLocal ? ["--local"] : [];

function wranglerExec(file: string) {
  console.log(`Applying ${file}...`);
  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", DB_NAME, `--file=${file}`, ...baseArgs],
    { stdio: "inherit" }
  );
}

// Migration 001 — idempotent (CREATE TABLE IF NOT EXISTS)
wranglerExec("infra/migrations/001_products.sql");

// Migration 002 — NOT idempotent: guard via pragma query
// Note: wrangler d1 execute --json may emit progress lines before the JSON
// on remote (non-local) mode. We extract the last line starting with '['.
console.log("Checking if migration 002 is needed...");
const rawOutput = execFileSync(
  "npx",
  [
    "wrangler", "d1", "execute", DB_NAME,
    "--command", "PRAGMA table_info('orders');",
    "--json",
    ...baseArgs,
  ],
  { encoding: "utf8", stderr: "pipe" }  // capture stderr separately
);

// Find the JSON line in stdout (last line starting with '[')
const jsonLine = rawOutput
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.startsWith("["))
  .at(-1) ?? "[]";

const rows: Array<{ name: string }> = JSON.parse(jsonLine)?.[0]?.results ?? [];

// Each column checked independently — safe to re-run
const columnsToAdd: Array<{ name: string; sql: string }> = [
  { name: "items_processed", sql: "ALTER TABLE orders ADD COLUMN items_processed INTEGER DEFAULT 0" },
  { name: "payment_intent_id", sql: "ALTER TABLE orders ADD COLUMN payment_intent_id TEXT" },
];

for (const { name, sql } of columnsToAdd) {
  if (!rows.some((r) => r.name === name)) {
    console.log(`Migration 002: adding column ${name}...`);
    execFileSync(
      "npx",
      ["wrangler", "d1", "execute", DB_NAME, "--command", `${sql};`, ...baseArgs],
      { stdio: "inherit" }
    );
  } else {
    console.log(`Migration 002: column ${name} already exists, skipping.`);
  }
}

console.log("All migrations applied.");
```

- [ ] **Step 2.2 — Run migrations locally to verify (requires wrangler)**

```bash
npx tsx scripts/migrate.ts --local
```

Expected output (first run):
```
Applying infra/migrations/001_products.sql...
Checking if migration 002 is needed...
Migration 002: adding column items_processed...
Migration 002: adding column payment_intent_id...
All migrations applied.
```

Expected output (second run, both columns already exist):
```
Applying infra/migrations/001_products.sql...
Checking if migration 002 is needed...
Migration 002: column items_processed already exists, skipping.
Migration 002: column payment_intent_id already exists, skipping.
All migrations applied.
```

- [ ] **Step 2.3 — Commit**

```bash
git add scripts/migrate.ts
git commit -m "feat(db): add safe migration runner with PRAGMA guard for ALTER TABLE"
```

---

### Task 3: Seed script

**Files:**
- Create: `scripts/seed-products-d1.ts`

Reads all `src/content/vins/*.fr.yaml` files and upserts them into the `products` D1 table. The slug is derived from the filename (e.g., `arenes-rouge.fr.yaml` → id `arenes-rouge`).

- [ ] **Step 3.1 — Install yaml parser**

```bash
npm install --save-dev yaml
```

- [ ] **Step 3.2 — Create `scripts/seed-products-d1.ts`**

```typescript
#!/usr/bin/env npx tsx
/**
 * Seed D1 products table from src/content/vins/*.fr.yaml
 * Also reads *.en.yaml and *.es.yaml for translated names.
 *
 * Each INSERT is written to a temp .sql file and passed via --file to avoid
 * shell-escaping issues with product names containing special characters.
 *
 * Usage:
 *   CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx npx tsx scripts/seed-products-d1.ts
 * Local:
 *   npx tsx scripts/seed-products-d1.ts --local
 */
import { readFileSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { parse as parseYaml } from "yaml";
import { tmpdir } from "node:os";

const isLocal = process.argv.includes("--local");
const DB_NAME = "perinade-dev-db";
const VINS_DIR = join(process.cwd(), "src/content/vins");
const baseArgs = isLocal ? ["--local"] : [];

interface VinYaml {
  nom: string;
  prix: number;         // EUR (float)
  stock: string;        // "En stock" | "Stock limité" | "Rupture de stock"
}

function stockStatus(stock: string): string {
  if (stock === "Rupture de stock") return "rupture";
  if (stock === "Stock limité") return "limite";
  return "en_stock";
}

function readVin(slug: string, locale: string): VinYaml | null {
  const path = join(VINS_DIR, `${slug}.${locale}.yaml`);
  try {
    return parseYaml(readFileSync(path, "utf8")) as VinYaml;
  } catch {
    return null;
  }
}

// Escape single quotes for SQL string literals
function sqlStr(s: string): string {
  return s.replace(/'/g, "''");
}

// Collect all slugs from .fr.yaml files
const slugs = readdirSync(VINS_DIR)
  .filter((f) => f.endsWith(".fr.yaml"))
  .map((f) => f.replace(".fr.yaml", ""));

console.log(`Found ${slugs.length} products to seed...`);

for (const slug of slugs) {
  const fr = readVin(slug, "fr");
  const en = readVin(slug, "en");
  const es = readVin(slug, "es");

  if (!fr) {
    console.warn(`Skipping ${slug}: no fr.yaml found`);
    continue;
  }

  const prixCents = Math.round(fr.prix * 100);
  const status = stockStatus(fr.stock);
  const now = new Date().toISOString();

  // Write SQL to a temp file — avoids shell-escaping issues with names
  // containing $, backticks, quotes, accented characters, etc.
  const sql = [
    "INSERT OR REPLACE INTO products",
    "  (id, name_fr, name_en, name_es, prix_cents, stock_qty, stock_status, updated_at)",
    "VALUES (",
    `  '${sqlStr(slug)}',`,
    `  '${sqlStr(fr.nom ?? slug)}',`,
    `  '${sqlStr(en?.nom ?? fr.nom ?? slug)}',`,
    `  '${sqlStr(es?.nom ?? fr.nom ?? slug)}',`,
    `  ${prixCents},`,
    `  50,`,
    `  '${status}',`,
    `  '${now}'`,
    ");",
  ].join("\n");

  const tmpFile = join(tmpdir(), `perinade-seed-${slug}.sql`);
  writeFileSync(tmpFile, sql, "utf8");

  try {
    execFileSync(
      "npx",
      ["wrangler", "d1", "execute", DB_NAME, `--file=${tmpFile}`, ...baseArgs],
      { stdio: "inherit" }
    );
  } finally {
    unlinkSync(tmpFile);
  }

  console.log(`  ✓ ${slug} (${prixCents / 100}€, stock: ${status})`);
}

console.log("Seed complete.");
```

Note: `stock_qty` is seeded to `50` as a starting value. The owner adjusts real quantities in the dashboard.

- [ ] **Step 3.3 — Run seed locally**

```bash
npx tsx scripts/seed-products-d1.ts --local
```

Expected:
```
Found 10 products to seed...
  ✓ arenes-rouge (15€, stock: en_stock)
  ✓ chardonnay (...)
  ...
Seed complete.
```

- [ ] **Step 3.4 — Verify seed**

```bash
npx wrangler d1 execute perinade-dev-db --local --command "SELECT id, name_fr, stock_qty, stock_status FROM products;"
```

Expected: 10 rows.

- [ ] **Step 3.5 — Commit**

```bash
git add scripts/seed-products-d1.ts package.json package-lock.json
git commit -m "feat(db): add D1 seed script for products from YAML"
```

---

## Chunk 2: Stripe Webhook Extension

### File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| MODIFY | `infra/workers/stripe-webhook/index.js` | Add 4 new event handlers + idempotence via webhook_logs |

---

### Task 4: Refactor stripe-webhook for idempotence + new events

**Context:** The existing Worker handles `checkout.session.completed` with `INSERT OR IGNORE` on `stripe_session_id`. We extend it to:
1. Log every event in `webhook_logs` (idempotence guard on `stripe_event_id`)
2. After logging, dispatch to typed handlers
3. Add 4 new event handlers

- [ ] **Step 4.1 — Read the existing stripe-webhook Worker**

```bash
cat infra/workers/stripe-webhook/index.js
```

Note the existing structure. We preserve the HMAC signature verification.

- [ ] **Step 4.2 — Rewrite `infra/workers/stripe-webhook/index.js`**

```javascript
/**
 * Worker: stripe-webhook
 * Handles Stripe events, stores to D1, manages stock.
 *
 * Bindings required (wrangler.toml + wrangler secret put):
 *   DB                    — D1 perinade-dev-db
 *   STRIPE_WEBHOOK_SECRET — from Stripe Dashboard → Webhooks
 *   STRIPE_SECRET_KEY     — from Stripe Dashboard → API Keys
 *   RESEND_API_KEY        — for alert emails
 *
 * Env vars (wrangler.toml [vars]):
 *   CONTACT_EMAIL_TO      — email for admin alerts
 */

const TOLERANCE_SECONDS = 300; // 5 min

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // 1. Validate Stripe signature
    const payload = await request.text();
    const sig = request.headers.get("stripe-signature");
    let event;
    try {
      event = await verifyStripeSignature(payload, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Signature verification failed:", err.message);
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Log event (idempotence: INSERT OR IGNORE on stripe_event_id)
    const logId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT OR IGNORE INTO webhook_logs (id, event_type, stripe_event_id, payload, status, created_at)
       VALUES (?, ?, ?, ?, 'received', ?)`
    ).bind(logId, event.type, event.id, payload, new Date().toISOString()).run();

    // Check if already processed (INSERT OR IGNORE silently fails on duplicate)
    const existing = await env.DB.prepare(
      "SELECT status FROM webhook_logs WHERE stripe_event_id = ? AND status = 'processed'"
    ).bind(event.id).first();
    if (existing) {
      console.log(`Event ${event.id} already processed, skipping.`);
      return new Response("OK (duplicate)", { status: 200 });
    }

    // 3. Dispatch to handler
    let error = null;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(event.data.object, env, event.id);
          break;
        case "charge.refunded":
          await handleChargeRefunded(event.data.object, env);
          break;
        case "payment_intent.payment_failed":
          await handlePaymentFailed(event.data.object, env);
          break;
        case "charge.dispute.created":
          await handleDisputeCreated(event.data.object, env);
          break;
        case "payment_intent.canceled":
          await handlePaymentCanceled(event.data.object, env);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      error = err.message;
      console.error(`Handler error for ${event.type}:`, err);
    }

    // 4. Update webhook_log status
    await env.DB.prepare(
      "UPDATE webhook_logs SET status = ?, error = ? WHERE stripe_event_id = ?"
    ).bind(error ? "failed" : "processed", error ?? null, event.id).run();

    if (error) {
      return new Response("Internal error", { status: 500 });
    }
    return new Response("OK", { status: 200 });
  },
};

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session, env, eventId) {
  const sessionId = session.id;

  // Check idempotence on order
  const order = await env.DB.prepare(
    "SELECT id, items_processed FROM orders WHERE stripe_session_id = ?"
  ).bind(sessionId).first();

  if (!order) {
    // Fetch line items from Stripe API
    const items = await fetchLineItems(sessionId, env.STRIPE_SECRET_KEY);

    await env.DB.prepare(
      `INSERT OR IGNORE INTO orders
       (id, stripe_session_id, payment_intent_id, status, customer_email, amount_total, currency, items, items_processed, created_at)
       VALUES (?, ?, ?, 'paid', ?, ?, ?, ?, 0, ?)`
    ).bind(
      crypto.randomUUID(),
      sessionId,
      session.payment_intent ?? null,  // stored for charge.refunded lookup
      session.customer_details?.email ?? "",
      session.amount_total ?? 0,
      session.currency ?? "eur",
      JSON.stringify(items),
      new Date().toISOString()
    ).run();
  }

  // Re-fetch to get items_processed state
  const orderRow = await env.DB.prepare(
    "SELECT id, items, items_processed FROM orders WHERE stripe_session_id = ?"
  ).bind(sessionId).first();

  if (!orderRow || orderRow.items_processed === 1) {
    console.log(`Stock already decremented for session ${sessionId}`);
    return;
  }

  // Decrement stock per line item
  const items = JSON.parse(orderRow.items ?? "[]");
  for (const item of items) {
    const productId = item.price?.product ?? item.id;
    const qty = item.quantity ?? 1;

    // Decrement if product exists in our table (best-effort; max 0)
    await env.DB.prepare(
      "UPDATE products SET stock_qty = MAX(0, stock_qty - ?), updated_at = ? WHERE id = ?"
    ).bind(qty, new Date().toISOString(), productId).run();

    await env.DB.prepare(
      `INSERT INTO stock_movements (id, product_id, type, qty_delta, reference_id, created_at)
       VALUES (?, ?, 'order', ?, ?, ?)`
    ).bind(
      crypto.randomUUID(), productId, -qty, sessionId, new Date().toISOString()
    ).run();
  }

  // Mark order as processed + update audit log in same logical step
  await env.DB.prepare(
    "UPDATE orders SET items_processed = 1 WHERE stripe_session_id = ?"
  ).bind(sessionId).run();

  // Update webhook_log status here (after items_processed=1 is confirmed written)
  // This ensures the audit trail is consistent even if the outer status update fails.
  await env.DB.prepare(
    "UPDATE webhook_logs SET status = 'processed' WHERE stripe_event_id = ?"
  ).bind(eventId).run();

  console.log(`Checkout ${sessionId}: stock decremented for ${items.length} items`);
}

async function handleChargeRefunded(charge, env) {
  // charge.payment_intent (pi_xxx) is stored in orders.payment_intent_id
  // (added by migration 002 + stored in handleCheckoutCompleted)
  const order = await env.DB.prepare(
    "SELECT id, items FROM orders WHERE payment_intent_id = ?"
  ).bind(charge.payment_intent).first();

  if (order?.items) {
    const items = JSON.parse(order.items);
    for (const item of items) {
      const productId = item.price?.product ?? item.id;
      const qty = item.quantity ?? 1;

      await env.DB.prepare(
        "UPDATE products SET stock_qty = stock_qty + ?, updated_at = ? WHERE id = ?"
      ).bind(qty, new Date().toISOString(), productId).run();

      await env.DB.prepare(
        `INSERT INTO stock_movements (id, product_id, type, qty_delta, reference_id, note, created_at)
         VALUES (?, ?, 'refund', ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(), productId, qty,
        charge.id, "Remboursement Stripe", new Date().toISOString()
      ).run();
    }
  }

  await sendAlert(env, "Remboursement reçu",
    `Charge ${charge.id} remboursée. Montant: ${(charge.amount_refunded / 100).toFixed(2)}€`);
}

async function handlePaymentFailed(paymentIntent, env) {
  // payment_intent.payment_failed has no Checkout Session ID.
  // Use payment_intent_id column for correlation; stripe_session_id stays NULL.
  await env.DB.prepare(
    `INSERT OR IGNORE INTO orders
     (id, stripe_session_id, payment_intent_id, status, customer_email, amount_total, currency, items, items_processed, created_at)
     VALUES (?, NULL, ?, 'failed', ?, ?, ?, '[]', 0, ?)`
  ).bind(
    crypto.randomUUID(),
    paymentIntent.id,
    paymentIntent.receipt_email ?? "",
    paymentIntent.amount ?? 0,
    paymentIntent.currency ?? "eur",
    new Date().toISOString()
  ).run();
  console.log(`Payment failed: ${paymentIntent.id}`);
}

async function handleDisputeCreated(dispute, env) {
  await sendAlert(env, "⚠️ Litige Stripe créé",
    `Dispute ${dispute.id} pour ${(dispute.amount / 100).toFixed(2)}€. Raison: ${dispute.reason}`);
}

async function handlePaymentCanceled(paymentIntent, env) {
  // payment_intent_id stores pi_xxx — correct column for this lookup
  await env.DB.prepare(
    "UPDATE orders SET status = 'canceled' WHERE payment_intent_id = ?"
  ).bind(paymentIntent.id).run();
  console.log(`Payment canceled: ${paymentIntent.id}`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchLineItems(sessionId, stripeKey) {
  const resp = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items?limit=100`,
    { headers: { Authorization: `Bearer ${stripeKey}` } }
  );
  if (!resp.ok) throw new Error(`Stripe line_items fetch failed: ${resp.status}`);
  const data = await resp.json();
  return data.data ?? [];
}

async function sendAlert(env, subject, body) {
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL_TO) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: env.CONTACT_EMAIL_TO,
      subject: `[Périnade Admin] ${subject}`,
      text: body,
    }),
  });
}

async function verifyStripeSignature(payload, sigHeader, secret) {
  if (!sigHeader) throw new Error("Missing stripe-signature");
  const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
  const timestamp = parts.t;
  if (!timestamp) throw new Error("Missing timestamp in signature");
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) {
    throw new Error("Timestamp too old");
  }
  const signed = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signed));
  const computed = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const expected = parts.v1;
  if (computed !== expected) throw new Error("Signature mismatch");
  return JSON.parse(payload);
}
```

- [ ] **Step 4.3 — Register new Stripe events in Dashboard**

In Stripe Dashboard → Webhooks → edit the webhook endpoint, add:
- `charge.refunded`
- `payment_intent.payment_failed`
- `charge.dispute.created`
- `payment_intent.canceled`

- [ ] **Step 4.4 — Add CONTACT_EMAIL_TO to wrangler.toml**

Edit `infra/workers/stripe-webhook/wrangler.toml`, add:

```toml
[vars]
CONTACT_EMAIL_TO = "your-email@example.com"
```

Replace with the actual owner email.

- [ ] **Step 4.5 — Deploy**

```bash
cd infra/workers/stripe-webhook
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
CLOUDFLARE_API_TOKEN=<TOKEN> \
npx wrangler deploy
```

Expected: `✅ Deployed stripe-webhook`

- [ ] **Step 4.6 — Test with Stripe CLI**

```bash
stripe trigger checkout.session.completed
```

Then verify in D1:
```bash
npx wrangler d1 execute perinade-dev-db --command "SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 3;"
npx wrangler d1 execute perinade-dev-db --command "SELECT * FROM orders ORDER BY created_at DESC LIMIT 3;"
```

Expected: `webhook_logs.status = 'processed'`, order row with `items_processed = 1`.

- [ ] **Step 4.7 — Commit**

```bash
git add infra/workers/stripe-webhook/
git commit -m "feat(webhook): add idempotent event log + 4 new Stripe event handlers"
```

---

## Chunk 3: Hono API Worker

### File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| REWRITE | `infra/workers/api/src/index.ts` | Hono app, route registration |
| CREATE | `infra/workers/api/src/middleware/auth.ts` | CF Access JWT validation |
| CREATE | `infra/workers/api/src/middleware/rateLimit.ts` | KV rate limiter |
| CREATE | `infra/workers/api/src/lib/jwks.ts` | JWKS fetch + KV cache |
| CREATE | `infra/workers/api/src/routes/dashboard.ts` | GET /api/admin/dashboard |
| CREATE | `infra/workers/api/src/routes/products.ts` | GET + PATCH /api/admin/products |
| CREATE | `infra/workers/api/src/routes/orders.ts` | GET /api/admin/orders + /:id |
| CREATE | `infra/workers/api/src/routes/stock.ts` | GET /api/admin/stock/movements |
| CREATE | `infra/workers/api/src/routes/stripe.ts` | Stripe balance/reconcile/events/sync |
| CREATE | `infra/workers/api/src/routes/webhooks.ts` | GET /api/admin/webhooks |
| MODIFY | `infra/workers/api/wrangler.toml` | Point to src/index.ts |
| CREATE | `infra/workers/api/package.json` | hono, zod, stripe |

---

### Task 5: Setup Hono project in api Worker

- [ ] **Step 5.1 — Create `infra/workers/api/package.json`**

```json
{
  "name": "perinade-dev-api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run"
  },
  "dependencies": {
    "hono": "^4.6.0",
    "@hono/zod-validator": "^0.4.0",
    "zod": "^3.23.0",
    "stripe": "^16.0.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@cloudflare/workers-types": "^4.0.0"
  }
}
```

- [ ] **Step 5.2 — Create `infra/workers/api/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "types": ["@cloudflare/workers-types"],
    "lib": ["ES2022", "WebWorker"]
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 5.3 — Update `infra/workers/api/wrangler.toml`**

```toml
name = "perinade-dev-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
account_id = "aea813e220eb8b709d70698a80ded18e"

[[d1_databases]]
binding = "DB"
database_name = "perinade-dev-db"
database_id = "69f84eaf-2291-44c5-bf6f-eaa4b8c1d46f"

[[kv_namespaces]]
binding = "CACHE"
id = "eb0dfc6944b74a048e140b36e74b13be"

[[routes]]
# ⚠️ ROUTE CHANGE: was "api/*" (stub placeholder), narrowed to "api/admin/*".
# The old "api/*" route handled no real traffic (it returned "api placeholder").
# Public-facing API routes (create-checkout-session) are Cloudflare Pages Functions,
# not this Worker. Narrowing to admin/* is intentional and safe.
pattern = "perinade.alpha2omegaconsulting.com/api/admin/*"
zone_id = "3de818ba26d525ef6b866487c8cf2b21"

[vars]
CF_ACCESS_TEAM = "your-team-name"   # replace with Cloudflare Access team name
```

- [ ] **Step 5.4 — Install dependencies**

```bash
cd infra/workers/api && npm install
```

---

### Task 6: JWKS + Auth middleware

**Files:**
- Create: `infra/workers/api/src/lib/jwks.ts`
- Create: `infra/workers/api/src/middleware/auth.ts`

- [ ] **Step 6.1 — Create `src/lib/jwks.ts`**

```typescript
import type { KVNamespace } from "@cloudflare/workers-types";

export interface JwkKey {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
}

const CACHE_KEY = "cf_access_jwks";
const CACHE_TTL = 3600; // 1 hour
const FETCH_TIMEOUT = 3000;

export async function getJwks(teamName: string, kv: KVNamespace): Promise<JwkKey[]> {
  // 1. Try KV cache
  const cached = await kv.get<{ keys: JwkKey[] }>(CACHE_KEY, "json");
  if (cached?.keys) return cached.keys;

  // 2. Fetch with timeout
  const certsUrl = `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/certs`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  let jwks: { keys: JwkKey[] };
  try {
    const res = await fetch(certsUrl, { signal: controller.signal });
    if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
    jwks = await res.json();
  } catch (err) {
    throw new Error(`CF Access JWKS unavailable: ${(err as Error).message}`);
  } finally {
    clearTimeout(timer);
  }

  // 3. Cache result
  await kv.put(CACHE_KEY, JSON.stringify(jwks), { expirationTtl: CACHE_TTL });
  return jwks.keys;
}

export async function verifyJwt(
  token: string,
  keys: JwkKey[]
): Promise<{ email: string } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;

  let header: { kid: string; alg: string };
  let payload: { exp: number; email?: string };
  try {
    header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
    payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }

  if (payload.exp < Date.now() / 1000) return null;

  const key = keys.find((k) => k.kid === header.kid);
  if (!key) return null;

  const cryptoKey = await crypto.subtle.importKey(
    "jwk", key,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["verify"]
  );

  function base64urlDecode(s: string): Uint8Array {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }

  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5", cryptoKey,
    base64urlDecode(sigB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );

  return valid ? { email: payload.email ?? "unknown" } : null;
}
```

- [ ] **Step 6.2 — Create `src/middleware/auth.ts`**

```typescript
import type { Context, Next } from "hono";
import type { Env } from "../types.js";
import { getJwks, verifyJwt } from "../lib/jwks.js";

// Extend Hono context variables to carry the authenticated user
type AuthVariables = { user: { email: string } };

export async function cfAccessAuth(
  c: Context<{ Bindings: Env; Variables: AuthVariables }>,
  next: Next
) {
  const token = c.req.header("CF-Access-Jwt-Assertion");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let keys;
  try {
    keys = await getJwks(c.env.CF_ACCESS_TEAM, c.env.CACHE);
  } catch {
    // JWKS unavailable: return 503 (not 401 — don't block on infra outage)
    return c.json({ error: "Auth service unavailable" }, 503);
  }

  let user = await verifyJwt(token, keys);

  // If validation failed with cached keys, try fresh keys (key rotation)
  if (!user) {
    await c.env.CACHE.delete("cf_access_jwks");
    try {
      const freshKeys = await getJwks(c.env.CF_ACCESS_TEAM, c.env.CACHE);
      user = await verifyJwt(token, freshKeys);
      if (!user) return c.json({ error: "Forbidden" }, 403);
    } catch {
      return c.json({ error: "Auth service unavailable" }, 503);
    }
  }

  // Store authenticated user in context for downstream route handlers
  c.set("user", user);
  await next();
}
```

- [ ] **Step 6.3 — Create `src/middleware/rateLimit.ts`**

```typescript
import type { Context, Next } from "hono";
import type { Env } from "../types.js";

const LIMIT = 60;   // requests per window
const WINDOW = 60;  // seconds

export async function rateLimit(c: Context<{ Bindings: Env }>, next: Next) {
  const ip = c.req.header("CF-Connecting-IP") ?? "unknown";
  const key = `rate:admin:${ip}`;

  const current = await c.env.CACHE.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= LIMIT) {
    return c.json({ error: "Too Many Requests" }, 429);
  }

  await c.env.CACHE.put(key, String(count + 1), { expirationTtl: WINDOW });
  await next();
}
```

- [ ] **Step 6.4 — Create `src/types.ts`**

```typescript
import type { D1Database, KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STRIPE_SECRET_KEY: string;
  CF_ACCESS_TEAM: string;
}
```

---

### Task 7: Route implementations

- [ ] **Step 7.1 — Create `src/routes/dashboard.ts`**

```typescript
import { Hono } from "hono";
import type { Env } from "../types.js";

export const dashboardRoutes = new Hono<{ Bindings: Env }>();

dashboardRoutes.get("/", async (c) => {
  const db = c.env.DB;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [revenueToday, revenueMonth, ordersToday, ordersMonth, pending, stockAlerts] =
    await Promise.all([
      db.prepare("SELECT COALESCE(SUM(amount_total),0) as v FROM orders WHERE status='paid' AND created_at >= ?").bind(todayStart).first<{ v: number }>(),
      db.prepare("SELECT COALESCE(SUM(amount_total),0) as v FROM orders WHERE status='paid' AND created_at >= ?").bind(monthStart).first<{ v: number }>(),
      db.prepare("SELECT COUNT(*) as v FROM orders WHERE created_at >= ?").bind(todayStart).first<{ v: number }>(),
      db.prepare("SELECT COUNT(*) as v FROM orders WHERE created_at >= ?").bind(monthStart).first<{ v: number }>(),
      db.prepare("SELECT COUNT(*) as v FROM orders WHERE status='pending'").first<{ v: number }>(),
      db.prepare("SELECT id, name_fr, stock_qty FROM products WHERE stock_qty < 5 ORDER BY stock_qty ASC").all<{ id: string; name_fr: string; stock_qty: number }>(),
    ]);

  return c.json({
    revenue: {
      today_cents: revenueToday?.v ?? 0,
      this_month_cents: revenueMonth?.v ?? 0,
    },
    orders: {
      today: ordersToday?.v ?? 0,
      this_month: ordersMonth?.v ?? 0,
      pending: pending?.v ?? 0,
    },
    stock_alerts: stockAlerts.results ?? [],
  });
});
```

- [ ] **Step 7.2 — Create `src/routes/products.ts`**

```typescript
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types.js";

export const productRoutes = new Hono<{ Bindings: Env }>();

productRoutes.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM products ORDER BY id ASC"
  ).all();
  return c.json(rows.results);
});

const patchSchema = z.object({
  stock_qty: z.number().int().min(0).max(9999).optional(),
  prix_cents: z.number().int().min(0).max(999900).optional(),
  note: z.string().max(200).optional(),
}).refine(
  (d) => d.stock_qty !== undefined || d.prix_cents !== undefined,
  { message: "At least one of stock_qty or prix_cents is required" }
);

productRoutes.patch("/:id", zValidator("json", patchSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const now = new Date().toISOString();
  const db = c.env.DB;

  const product = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  if (!product) return c.json({ error: "Product not found" }, 404);

  if (data.stock_qty !== undefined) {
    const delta = data.stock_qty - (product.stock_qty as number);
    await db.prepare(
      "UPDATE products SET stock_qty = ?, updated_at = ? WHERE id = ?"
    ).bind(data.stock_qty, now, id).run();

    await db.prepare(
      `INSERT INTO stock_movements (id, product_id, type, qty_delta, reference_id, note, created_at)
       VALUES (?, ?, 'manual', ?, 'manual', ?, ?)`
    ).bind(crypto.randomUUID(), id, delta, data.note ?? null, now).run();
  }

  if (data.prix_cents !== undefined) {
    await db.prepare(
      "UPDATE products SET prix_cents = ?, updated_at = ? WHERE id = ?"
    ).bind(data.prix_cents, now, id).run();
  }

  const updated = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  return c.json(updated);
});
```

- [ ] **Step 7.3 — Create `src/routes/orders.ts`**

```typescript
import { Hono } from "hono";
import type { Env } from "../types.js";

export const orderRoutes = new Hono<{ Bindings: Env }>();

orderRoutes.get("/", async (c) => {
  const status = c.req.query("status");
  const from = c.req.query("from");
  const to = c.req.query("to");

  let sql = "SELECT * FROM orders WHERE 1=1";
  const params: (string | number)[] = [];

  if (status) { sql += " AND status = ?"; params.push(status); }
  if (from)   { sql += " AND created_at >= ?"; params.push(from); }
  if (to)     { sql += " AND created_at <= ?"; params.push(to); }

  sql += " ORDER BY created_at DESC LIMIT 100";

  const rows = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json(rows.results);
});

orderRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const order = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE id = ? OR stripe_session_id = ?"
  ).bind(id, id).first();
  if (!order) return c.json({ error: "Not found" }, 404);
  return c.json(order);
});
```

- [ ] **Step 7.4 — Create `src/routes/stock.ts`**

```typescript
import { Hono } from "hono";
import type { Env } from "../types.js";

export const stockRoutes = new Hono<{ Bindings: Env }>();

stockRoutes.get("/movements", async (c) => {
  const productId = c.req.query("product_id");
  let sql = "SELECT * FROM stock_movements";
  const params: string[] = [];
  if (productId) { sql += " WHERE product_id = ?"; params.push(productId); }
  sql += " ORDER BY created_at DESC LIMIT 200";
  const rows = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json(rows.results);
});
```

- [ ] **Step 7.5 — Create `src/routes/stripe.ts`**

```typescript
import { Hono } from "hono";
import type { Env } from "../types.js";

export const stripeRoutes = new Hono<{ Bindings: Env }>();

stripeRoutes.get("/balance", async (c) => {
  const res = await fetch("https://api.stripe.com/v1/balance", {
    headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return c.json({ error: "Stripe API error" }, 502);
  return c.json(await res.json());
});

stripeRoutes.get("/events", async (c) => {
  const res = await fetch("https://api.stripe.com/v1/events?limit=50", {
    headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return c.json({ error: "Stripe API error" }, 502);
  return c.json(await res.json());
});

stripeRoutes.get("/reconcile", async (c) => {
  // Fetch D1 paid orders (last 30 days)
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const d1Orders = await c.env.DB.prepare(
    "SELECT stripe_session_id, status, amount_total FROM orders WHERE created_at >= ?"
  ).bind(since).all<{ stripe_session_id: string; status: string; amount_total: number }>();

  // Fetch Stripe Checkout Sessions (keyed by id = cs_xxx, matches stripe_session_id in D1)
  const sinceSec = Math.floor(Date.now() / 1000 - 30 * 24 * 3600);
  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions?limit=100&created[gte]=${sinceSec}`,
    { headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` } }
  );
  if (!stripeRes.ok) return c.json({ error: "Stripe API error" }, 502);
  const stripeData: { data: Array<{ id: string; payment_status: string; amount_total: number }> } = await stripeRes.json();

  // Build maps — both keyed on stripe_session_id (cs_xxx)
  const d1Map = new Map(d1Orders.results.map((o) => [o.stripe_session_id, o]));
  const stripeMap = new Map(stripeData.data.map((s) => [s.id, s]));

  // Union of all keys
  const allKeys = new Set([...d1Map.keys(), ...stripeMap.keys()]);

  const items = Array.from(allKeys).map((key) => {
    const d1 = d1Map.get(key) ?? null;
    const stripe = stripeMap.get(key) ?? null;
    const amountMatch = d1 && stripe ? d1.amount_total === stripe.amount_total : d1 === stripe;
    const statusMatch = !d1 || !stripe ? false :
      (d1.status === "paid" && stripe.payment_status === "paid") ||
      (d1.status === "failed" && stripe.payment_status === "unpaid");
    return {
      stripe_session_id: key,
      d1_status: d1?.status ?? null,
      stripe_status: stripe?.payment_status ?? null,
      d1_amount_cents: d1?.amount_total ?? null,
      stripe_amount_cents: stripe?.amount_total ?? null,
      amount_match: amountMatch,
      status_match: statusMatch,
      divergent: !amountMatch || !statusMatch,
    };
  });

  return c.json({
    summary: {
      total_d1: d1Map.size,
      total_stripe: stripeMap.size,
      divergences: items.filter((i) => i.divergent).length,
    },
    items,
  });
});

stripeRoutes.post("/sync/:orderId", async (c) => {
  const orderId = c.req.param("orderId");
  const order = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE id = ? OR stripe_session_id = ?"
  ).bind(orderId, orderId).first<{ stripe_session_id: string }>();
  if (!order) return c.json({ error: "Order not found" }, 404);

  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${order.stripe_session_id}`,
    { headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` } }
  );
  if (!res.ok) return c.json({ error: "Stripe API error" }, 502);
  const session: { payment_status: string; amount_total: number } = await res.json();

  const newStatus = session.payment_status === "paid" ? "paid" : "pending";
  await c.env.DB.prepare(
    "UPDATE orders SET status = ?, amount_total = ? WHERE stripe_session_id = ?"
  ).bind(newStatus, session.amount_total, order.stripe_session_id).run();

  return c.json({ synced: true, new_status: newStatus });
});
```

- [ ] **Step 7.6 — Create `src/routes/webhooks.ts`**

```typescript
import { Hono } from "hono";
import type { Env } from "../types.js";

export const webhookRoutes = new Hono<{ Bindings: Env }>();

webhookRoutes.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT id, event_type, stripe_event_id, status, error, created_at FROM webhook_logs ORDER BY created_at DESC LIMIT 50"
  ).all();
  return c.json(rows.results);
});
```

- [ ] **Step 7.7 — Create `src/index.ts` (main Hono app)**

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types.js";
import { cfAccessAuth } from "./middleware/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { dashboardRoutes } from "./routes/dashboard.js";
import { productRoutes } from "./routes/products.js";
import { orderRoutes } from "./routes/orders.js";
import { stockRoutes } from "./routes/stock.js";
import { stripeRoutes } from "./routes/stripe.js";
import { webhookRoutes } from "./routes/webhooks.js";

const app = new Hono<{ Bindings: Env }>();

// CORS: only allow admin subdomain
app.use("/api/admin/*", cors({
  origin: ["https://admin.perinade.fr", "http://localhost:5173"],
  allowMethods: ["GET", "PATCH", "POST"],
  allowHeaders: ["Content-Type", "CF-Access-Jwt-Assertion"],
}));

// Auth + rate limiting on all admin routes
app.use("/api/admin/*", cfAccessAuth);
app.use("/api/admin/*", rateLimit);

// Mount routes
app.route("/api/admin/dashboard", dashboardRoutes);
app.route("/api/admin/products", productRoutes);
app.route("/api/admin/orders", orderRoutes);
app.route("/api/admin/stock", stockRoutes);
app.route("/api/admin/stripe", stripeRoutes);
app.route("/api/admin/webhooks", webhookRoutes);

// Health check (no auth)
app.get("/api/health", (c) => c.json({ ok: true }));

export default app;
```

- [ ] **Step 7.8 — Deploy api Worker**

```bash
cd infra/workers/api
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
CLOUDFLARE_API_TOKEN=<TOKEN> \
npx wrangler deploy
```

- [ ] **Step 7.9 — Inject STRIPE_SECRET_KEY secret**

```bash
echo "sk_test_..." | npx wrangler secret put STRIPE_SECRET_KEY --name perinade-dev-api
```

- [ ] **Step 7.10 — Test health endpoint**

```bash
curl https://perinade.alpha2omegaconsulting.com/api/health
```

Expected: `{"ok":true}`

- [ ] **Step 7.11 — Test auth rejection**

```bash
curl https://perinade.alpha2omegaconsulting.com/api/admin/products
```

Expected: `{"error":"Unauthorized"}` with status 401.

- [ ] **Step 7.12 — Commit**

```bash
cd ../../../ && git add infra/workers/api/
git commit -m "feat(api): rewrite api Worker with Hono — 10 admin routes, CF Access auth, rate limiting"
```

---

## Chunk 4: Security & Checkout Stock Check

### File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| MODIFY | `infra/workers/edge-security/index.js` | Conditional CSP for admin subdomain |
| MODIFY | `functions/create-checkout-session.ts` | Optimistic stock check before Stripe session |

---

### Task 8: CSP extension for admin subdomain

- [ ] **Step 8.1 — Read existing edge-security Worker**

```bash
cat infra/workers/edge-security/index.js
```

- [ ] **Step 8.2 — Add conditional CSP branch**

Locate the CSP construction in the Worker. Add a condition on the `Host` header:

```javascript
const host = request.headers.get("Host") ?? "";
const isAdmin = host.startsWith("admin.");

const cspDirectives = isAdmin
  ? [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.stripe.com https://perinade.alpha2omegaconsulting.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ]
  : [/* existing public CSP array unchanged */];

const csp = cspDirectives.join("; ");
```

- [ ] **Step 8.3 — Deploy edge-security**

```bash
cd infra/workers/edge-security
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
CLOUDFLARE_API_TOKEN=<TOKEN> \
npx wrangler deploy
```

- [ ] **Step 8.4 — Commit**

```bash
git add infra/workers/edge-security/
git commit -m "feat(security): conditional CSP for admin.perinade.fr subdomain"
```

---

### Task 9: Stock check in checkout

- [ ] **Step 9.1 — Read existing `functions/create-checkout-session.ts`**

Find where `stripe.checkout.sessions.create` is called.

- [ ] **Step 9.2 — Update `Env` interface in `functions/create-checkout-session.ts`**

First, add `DB?: D1Database` to the Env interface at the top of the file:

```typescript
import type { D1Database } from "@cloudflare/workers-types";

interface Env {
  STRIPE_SECRET_KEY?: string;
  SITE_BASE_URL?: string;
  DB?: D1Database;  // D1 binding — optional for backwards compat in local dev
}
```

- [ ] **Step 9.3 — Add stock check before Stripe session creation**

Insert before the `stripe.checkout.sessions.create(...)` call:

```typescript
// Stock check — optimistic strategy (see spec for race condition handling)
// DB binding is available via context.env.DB (Cloudflare Pages Functions)
if (context.env.DB) {
  for (const item of cartItems) {
    const row = await context.env.DB.prepare(
      "SELECT stock_qty FROM products WHERE id = ?"
    ).bind(item.id).first<{ stock_qty: number }>();

    if (!row || row.stock_qty < item.qty) {
      return new Response(
        JSON.stringify({ error: `Stock insuffisant pour ${item.name}` }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
// If DB is not bound (dev without D1), skip check
```

Note: `context.env.DB` requires adding D1 binding to `wrangler.toml` in the Pages Functions config, or in the Cloudflare Pages dashboard (Settings → Functions → D1 database bindings: `DB` → `perinade-dev-db`).

- [ ] **Step 9.4 — Test insufficient stock**

Manually set a product's stock to 0 in D1:

```bash
npx wrangler d1 execute perinade-dev-db --command "UPDATE products SET stock_qty = 0 WHERE id = 'arenes-rouge';"
```

Add that product to cart and attempt checkout. Expected: 409 error message displayed.

Reset:
```bash
npx wrangler d1 execute perinade-dev-db --command "UPDATE products SET stock_qty = 50 WHERE id = 'arenes-rouge';"
```

- [ ] **Step 9.5 — Commit**

```bash
git add functions/create-checkout-session.ts
git commit -m "feat(checkout): add optimistic stock check before Stripe session creation"
```

---

## Chunk 5: React SPA Admin App

### File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| CREATE | `admin-app/` | Full React SPA project |
| CREATE | `admin-app/src/api/client.ts` | Typed fetch wrapper for all API routes |
| CREATE | `admin-app/src/components/Layout.tsx` | App shell with sidebar navigation |
| CREATE | `admin-app/src/pages/Dashboard.tsx` | KPI cards |
| CREATE | `admin-app/src/pages/Products.tsx` | Editable stock table |
| CREATE | `admin-app/src/pages/Orders.tsx` | Orders table + Stripe links |
| CREATE | `admin-app/src/pages/Reconciliation.tsx` | D1 vs Stripe comparison |
| CREATE | `admin-app/src/pages/Webhooks.tsx` | Webhook event log |
| CREATE | `admin-app/src/App.tsx` | Router + layout |
| CREATE | `admin-app/src/main.tsx` | Entry point |

---

### Task 10: Scaffold React SPA

- [ ] **Step 10.1 — Scaffold with Vite**

```bash
npm create vite@latest admin-app -- --template react-ts
cd admin-app
```

- [ ] **Step 10.2 — Install dependencies**

```bash
npm install @tanstack/react-query react-router-dom
npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom
npx tailwindcss init -p
```

- [ ] **Step 10.3 — Install shadcn/ui**

```bash
npx shadcn@latest init
# Choose: TypeScript, default style, default base color, CSS variables
```

Add components:
```bash
npx shadcn@latest add card table badge button input
```

- [ ] **Step 10.4 — Create `admin-app/wrangler.toml`**

```toml
name = "perinade-admin"
pages_build_output_dir = "dist"
```

- [ ] **Step 10.5 — Update `tailwind.config.js`**

```javascript
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

---

### Task 11: API client + types

- [ ] **Step 11.1 — Create `src/api/client.ts`**

```typescript
const API_BASE = import.meta.env.VITE_API_BASE ?? "https://perinade.alpha2omegaconsulting.com";

// CF-Access-Jwt-Assertion is injected automatically by Cloudflare Access
// when the user is authenticated via the Access login page.
// The browser passes it as a cookie; we read it for API calls.
function getCfJwt(): string {
  const match = document.cookie.match(/CF_Authorization=([^;]+)/);
  return match?.[1] ?? "";
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "CF-Access-Jwt-Assertion": getCfJwt(),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "API error");
  }
  return res.json() as Promise<T>;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string; name_fr: string; name_en: string; name_es: string;
  prix_cents: number; stock_qty: number; stock_status: string;
  stripe_price_id: string | null; updated_at: string;
}

export interface Order {
  id: string; stripe_session_id: string; status: string;
  customer_email: string; amount_total: number; currency: string;
  items: string; items_processed: number; created_at: string;
}

export interface DashboardData {
  revenue: { today_cents: number; this_month_cents: number };
  orders: { today: number; this_month: number; pending: number };
  stock_alerts: Array<{ id: string; name_fr: string; stock_qty: number }>;
}

export interface ReconcileItem {
  stripe_session_id: string;
  d1_status: string | null; stripe_status: string | null;
  d1_amount_cents: number | null; stripe_amount_cents: number | null;
  amount_match: boolean; status_match: boolean; divergent: boolean;
}

export interface WebhookLog {
  id: string; event_type: string; stripe_event_id: string;
  status: string; error: string | null; created_at: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

export const api = {
  dashboard: () => apiFetch<DashboardData>("/api/admin/dashboard"),
  products: {
    list: () => apiFetch<Product[]>("/api/admin/products"),
    update: (id: string, data: { stock_qty?: number; prix_cents?: number; note?: string }) =>
      apiFetch<Product>(`/api/admin/products/${id}`, {
        method: "PATCH", body: JSON.stringify(data),
      }),
  },
  orders: {
    list: (params?: { status?: string; from?: string; to?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return apiFetch<Order[]>(`/api/admin/orders${qs ? `?${qs}` : ""}`);
    },
  },
  stripe: {
    reconcile: () => apiFetch<{ summary: { total_d1: number; total_stripe: number; divergences: number }; items: ReconcileItem[] }>("/api/admin/stripe/reconcile"),
    sync: (orderId: string) => apiFetch<{ synced: boolean; new_status: string }>(`/api/admin/stripe/sync/${orderId}`, { method: "POST" }),
  },
  webhooks: () => apiFetch<WebhookLog[]>("/api/admin/webhooks"),
};
```

---

### Task 12: Layout + pages

- [ ] **Step 12.1 — Create `src/components/Layout.tsx`**

```tsx
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Produits" },
  { to: "/orders", label: "Commandes" },
  { to: "/reconciliation", label: "Réconciliation" },
  { to: "/webhooks", label: "Webhooks" },
];

export function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <nav className="w-56 bg-white border-r p-4 flex flex-col gap-1">
        <div className="font-semibold text-gray-900 mb-6 px-2">Périnade Admin</div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${isActive ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-50"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 12.2 — Create `src/pages/Dashboard.tsx`**

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });

  if (isLoading) return <p>Chargement…</p>;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="CA aujourd'hui" value={euros(data.revenue.today_cents)} />
        <KpiCard label="CA ce mois" value={euros(data.revenue.this_month_cents)} />
        <KpiCard label="Commandes en attente" value={String(data.orders.pending)} />
      </div>
      {data.stock_alerts.length > 0 && (
        <div>
          <h2 className="font-medium mb-3 text-red-600">Alertes stock ({"<"}5 unités)</h2>
          <ul className="space-y-1">
            {data.stock_alerts.map((p) => (
              <li key={p.id} className="text-sm text-gray-700">
                {p.name_fr} — {p.stock_qty} unité{p.stock_qty !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
```

- [ ] **Step 12.3 — Create `src/pages/Products.tsx`**

```tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Product } from "../api/client";

export function Products() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"], queryFn: api.products.list,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, stock_qty }: { id: string; stock_qty: number }) =>
      api.products.update(id, { stock_qty }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Produits</h1>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Produit", "Stock", "Prix (€)", "Statut", "Modifié"].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((p) => (
            <ProductRow key={p.id} product={p} onUpdate={(id, qty) =>
              updateMutation.mutate({ id, stock_qty: qty })
            } />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({ product: p, onUpdate }: { product: Product; onUpdate: (id: string, qty: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(p.stock_qty));

  function save() {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0 && n <= 9999) {
      onUpdate(p.id, n);
      setEditing(false);
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2">{p.name_fr}</td>
      <td className="px-4 py-2">
        {editing ? (
          <span className="flex gap-2 items-center">
            <input
              type="number" min={0} max={9999}
              value={val} onChange={(e) => setVal(e.target.value)}
              className="border rounded px-2 py-1 w-20 text-sm"
              autoFocus
            />
            <button onClick={save} className="text-green-600 font-medium text-xs">Sauver</button>
            <button onClick={() => { setEditing(false); setVal(String(p.stock_qty)); }}
              className="text-gray-400 text-xs">Annuler</button>
          </span>
        ) : (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setEditing(true)}
            title="Cliquer pour modifier"
          >{p.stock_qty}</span>
        )}
      </td>
      <td className="px-4 py-2">{(p.prix_cents / 100).toFixed(2)}</td>
      <td className="px-4 py-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          p.stock_status === "en_stock" ? "bg-green-100 text-green-700" :
          p.stock_status === "limite" ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        }`}>{p.stock_status}</span>
      </td>
      <td className="px-4 py-2 text-gray-400">{new Date(p.updated_at).toLocaleDateString("fr-FR")}</td>
    </tr>
  );
}
```

- [ ] **Step 12.4 — Create `src/pages/Orders.tsx`**

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"], queryFn: () => api.orders.list(),
  });

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Commandes</h1>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Date", "Email", "Montant", "Statut", "Stripe"].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
              <td className="px-4 py-2">{o.customer_email}</td>
              <td className="px-4 py-2">{(o.amount_total / 100).toFixed(2)} €</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  o.status === "paid" ? "bg-green-100 text-green-700" :
                  o.status === "failed" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-600"
                }`}>{o.status}</span>
              </td>
              <td className="px-4 py-2">
                <a
                  href={`https://dashboard.stripe.com/test/checkout/sessions/${o.stripe_session_id}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >Voir →</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 12.5 — Create `src/pages/Reconciliation.tsx`**

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ReconcileItem } from "../api/client";

export function Reconciliation() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reconcile"], queryFn: api.stripe.reconcile,
  });
  const syncMutation = useMutation({
    mutationFn: api.stripe.sync,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reconcile"] }),
  });

  if (isLoading) return <p>Chargement…</p>;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Réconciliation Stripe ↔ D1</h1>
      <p className="text-sm text-gray-500 mb-4">
        D1: {data.summary.total_d1} commandes · Stripe: {data.summary.total_stripe} charges · {data.summary.divergences} écart(s)
      </p>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Session ID", "Statut D1", "Statut Stripe", "Montant D1", "Montant Stripe", ""].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.items.map((item) => (
            <tr key={item.stripe_session_id} className={item.divergent ? "bg-red-50" : ""}>
              <td className="px-4 py-2 font-mono text-xs">{item.stripe_session_id.slice(0, 20)}…</td>
              <td className="px-4 py-2">{item.d1_status ?? "—"}</td>
              <td className="px-4 py-2">{item.stripe_status ?? "—"}</td>
              <td className="px-4 py-2">{item.d1_amount_cents != null ? `${(item.d1_amount_cents / 100).toFixed(2)} €` : "—"}</td>
              <td className="px-4 py-2">{item.stripe_amount_cents != null ? `${(item.stripe_amount_cents / 100).toFixed(2)} €` : "—"}</td>
              <td className="px-4 py-2">
                {item.divergent && (
                  <button
                    onClick={() => syncMutation.mutate(item.stripe_session_id)}
                    className="text-xs text-blue-600 hover:underline"
                  >Resync</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 12.6 — Create `src/pages/Webhooks.tsx`**

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function Webhooks() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["webhooks"], queryFn: api.webhooks,
  });

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Événements Webhook</h1>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Date", "Type", "Stripe ID", "Statut", "Erreur"].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((w) => (
            <tr key={w.id} className={w.status === "failed" ? "bg-red-50" : ""}>
              <td className="px-4 py-2">{new Date(w.created_at).toLocaleString("fr-FR")}</td>
              <td className="px-4 py-2 font-mono text-xs">{w.event_type}</td>
              <td className="px-4 py-2 font-mono text-xs">{w.stripe_event_id?.slice(0, 18)}…</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  w.status === "processed" ? "bg-green-100 text-green-700" :
                  w.status === "failed" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-500"
                }`}>{w.status}</span>
              </td>
              <td className="px-4 py-2 text-red-600 text-xs">{w.error ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 12.7 — Create `src/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Orders } from "./pages/Orders";
import { Reconciliation } from "./pages/Reconciliation";
import { Webhooks } from "./pages/Webhooks";

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });

export function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reconciliation" element={<Reconciliation />} />
            <Route path="webhooks" element={<Webhooks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 12.8 — Update `src/main.tsx`**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

- [ ] **Step 12.9 — Local dev test**

```bash
cd admin-app && npm run dev
```

Open `http://localhost:5173`. Verify all 5 pages load without errors (API calls will fail locally without CF Access token — that's expected).

- [ ] **Step 12.10 — Build**

```bash
npm run build
```

Expected: `dist/` created, no TypeScript errors.

- [ ] **Step 12.11 — Deploy to Cloudflare Pages**

```bash
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
CLOUDFLARE_API_TOKEN=<TOKEN> \
npx wrangler pages deploy dist --project-name perinade-admin
```

Then in Cloudflare Dashboard → Pages → perinade-admin → Custom domains → add `admin.perinade.fr`.

- [ ] **Step 12.12 — Configure Cloudflare Access**

1. Cloudflare Dashboard → Zero Trust → Access → Applications
2. Add application: `https://admin.perinade.fr`
3. Policy: Allow — Email = `[owner email]`
4. Save

- [ ] **Step 12.13 — End-to-end test**

Open `https://admin.perinade.fr`. Should redirect to CF Access login. After login:
- Dashboard shows KPIs
- Products table loads with 10 wines
- Editing stock inline and saving updates D1
- Orders tab shows any test orders
- Reconciliation compares D1 and Stripe

- [ ] **Step 12.14 — Commit**

```bash
git add admin-app/
git commit -m "feat(admin-spa): complete React admin dashboard — 5 views, Stripe reconciliation, live stock editing"
```

---

## Final Verification Checklist

- [ ] `npx tsx scripts/migrate.ts --local` completes without error (run twice: second run skips 002)
- [ ] `npx tsx scripts/seed-products-d1.ts --local` seeds 10 products
- [ ] `curl .../api/health` → `{"ok":true}`
- [ ] `curl .../api/admin/products` without token → 401
- [ ] `stripe trigger checkout.session.completed` → webhook_logs.status = 'processed', order saved, stock decremented
- [ ] `stripe trigger charge.refunded` → stock incremented, alert email sent
- [ ] Admin SPA loads at `admin.perinade.fr` after CF Access login
- [ ] Products stock editable inline in dashboard
- [ ] Reconciliation view shows summary + highlights divergences in red
