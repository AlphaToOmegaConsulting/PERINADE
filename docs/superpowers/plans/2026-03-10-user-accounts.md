# User Accounts — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a user account space (order history + loyalty points) to the Périnade wine shop, backed by Supabase Auth for identity and Cloudflare D1 for transactional data.

**Architecture:** Three isolated data silos — Stripe (payments/addresses), Supabase (auth + user profiles + loyalty), Cloudflare D1 (orders + stock). Magic-link login via Supabase → Resend. Account auto-provisioned after first Stripe payment via the stripe-webhook Worker.

**Tech Stack:** Supabase Auth (HS256 JWT, magic links), Supabase Postgres (user_profiles, loyalty_transactions), Cloudflare Workers + D1 + Hono, Astro 5 + `@supabase/supabase-js`

**Spec:** [docs/superpowers/specs/2026-03-10-user-accounts-design.md](../specs/2026-03-10-user-accounts-design.md)

**Security note:** Any place where server-supplied data is rendered into the DOM, use `textContent` (plain text) or build elements with `createElement` + `textContent`. Never use `innerHTML` with data from the API. All user-supplied strings (email, order ref, amounts) must go through `textContent` only.

---

## File Map

### Created
| File | Purpose |
|---|---|
| `infra/migrations/003_user_accounts.sql` | D1 migration: add supabase_user_id to orders, create user_email_map |
| `infra/supabase/schema.sql` | Supabase schema: user_profiles, loyalty_transactions, upsert_loyalty RPC |
| `infra/workers/api/src/middleware/auth-user.ts` | Supabase JWT verification middleware |
| `infra/workers/api/src/routes/user.ts` | GET /api/user/me, GET /api/user/orders |
| `infra/workers/api/src/routes/auth.ts` | POST /api/auth/logout |
| `src/pages/compte.astro` | FR dashboard / login page |
| `src/pages/compte/callback.astro` | FR magic link callback |
| `src/pages/compte/commandes.astro` | FR order history |
| `src/pages/compte/fidelite.astro` | FR loyalty points |
| `src/pages/en/account.astro` | EN dashboard / login |
| `src/pages/en/account/callback.astro` | EN callback |
| `src/pages/en/account/orders.astro` | EN order history |
| `src/pages/en/account/loyalty.astro` | EN loyalty |
| `src/pages/es/cuenta.astro` | ES dashboard / login |
| `src/pages/es/cuenta/callback.astro` | ES callback |
| `src/pages/es/cuenta/pedidos.astro` | ES orders |
| `src/pages/es/cuenta/fidelidad.astro` | ES loyalty |
| `src/scripts/account.ts` | Client-side Supabase auth + account UI logic |

### Modified
| File | Change |
|---|---|
| `infra/workers/stripe-webhook/index.js` | Add Supabase user provisioning + loyalty credits after checkout |
| `infra/workers/stripe-webhook/wrangler.toml` | Document new secrets |
| `infra/workers/api/src/index.ts` | Register user routes + CORS for user endpoints |
| `infra/workers/api/src/types.ts` | Add SUPABASE_JWT_SECRET, SUPABASE_URL to Env |
| `infra/workers/api/wrangler.toml` | Add routes for api/user/*, api/auth/*, add SUPABASE_URL var |
| `src/i18n/routes.ts` | Add compte/account/cuenta routes |
| `src/content/ui/fr.yaml` | Account UI strings (FR) |
| `src/content/ui/en.yaml` | Account UI strings (EN) |
| `src/content/ui/es.yaml` | Account UI strings (ES) |
| `package.json` | Add @supabase/supabase-js |

---

## Chunk 1: Supabase Project + D1 Migration

> Manual setup steps + SQL files. No deployment yet.

### Task 1.1 — Create the Supabase project

- [ ] **Step 1: Create project via Supabase dashboard**

Go to supabase.com/dashboard, click **New project**, fill in:
- Name: `perinade-prod`
- Region: **West EU (Ireland)** — `eu-west-1`
- Database password: generate a strong one and save in 1Password

- [ ] **Step 2: Retrieve credentials**

From **Project Settings → API**, copy:
- **Project URL** → save as `SUPABASE_URL`
- **anon/public key** → save as `SUPABASE_ANON_KEY`
- **service_role key** → save as `SUPABASE_SERVICE_ROLE_KEY` (keep secret, never in git)
- From **Project Settings → JWT Settings**, copy **JWT Secret** → save as `SUPABASE_JWT_SECRET`

- [ ] **Step 3: Configure Resend as SMTP provider**

In Supabase dashboard → **Project Settings → Auth → SMTP Settings**:
- Enable custom SMTP: ✓
- Host: `smtp.resend.com` | Port: `587` | User: `resend`
- Password: `<RESEND_API_KEY>` (same key already used by contact-form Worker)
- Sender name: `Domaine de la Périnade`
- Sender email: `contact@perinade.fr`

---

### Task 1.2 — Write Supabase schema SQL

- [ ] **Step 1: Create `infra/supabase/schema.sql`**

```sql
-- ── user_profiles ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  loyalty_points  INTEGER NOT NULL DEFAULT 0,
  total_orders    INTEGER NOT NULL DEFAULT 0,
  total_spent_cts INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile_select" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own_profile_update" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- ── loyalty_transactions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  points_delta INTEGER NOT NULL,
  reason       TEXT NOT NULL CHECK (reason IN ('order', 'refund', 'redemption', 'manual')),
  reference_id TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_loyalty_tx_user_id ON loyalty_transactions(user_id);
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_loyalty_select" ON loyalty_transactions FOR SELECT USING (auth.uid() = user_id);

-- ── upsert_loyalty RPC ───────────────────────────────────────────────────────
-- Called by the stripe-webhook Worker (service_role key).
-- Atomically creates or increments user_profiles, then appends a transaction.
CREATE OR REPLACE FUNCTION upsert_loyalty(
  p_user_id    UUID,
  p_points     INTEGER,
  p_amount_cts INTEGER,
  p_session_id TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_profiles (id, loyalty_points, total_orders, total_spent_cts)
  VALUES (p_user_id, p_points, 1, p_amount_cts)
  ON CONFLICT (id) DO UPDATE SET
    loyalty_points  = user_profiles.loyalty_points  + p_points,
    total_orders    = user_profiles.total_orders    + 1,
    total_spent_cts = user_profiles.total_spent_cts + p_amount_cts,
    updated_at      = now();

  INSERT INTO loyalty_transactions (user_id, points_delta, reason, reference_id)
  VALUES (p_user_id, p_points, 'order', p_session_id);
END;
$$;
```

- [ ] **Step 2: Run in Supabase SQL Editor**

Paste the file contents into the Supabase dashboard SQL Editor and click Run. Verify in Table Editor that both tables exist with RLS enabled.

- [ ] **Step 3: Verify RPC**

```sql
SELECT routine_name FROM information_schema.routines WHERE routine_name = 'upsert_loyalty';
```
Expected: 1 row.

---

### Task 1.3 — D1 migration

- [ ] **Step 1: Create `infra/migrations/003_user_accounts.sql`**

```sql
-- Migration 003: user account support
ALTER TABLE orders ADD COLUMN supabase_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_supabase_user_id ON orders(supabase_user_id);

-- Local cache: email → Supabase user_id (avoids repeated Admin API calls on repeat purchases)
CREATE TABLE IF NOT EXISTS user_email_map (
  email             TEXT PRIMARY KEY,
  supabase_user_id  TEXT NOT NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
```

- [ ] **Step 2: Apply locally**

```bash
cd /Users/codex/Desktop/WEBDEV/PERINADE
npx wrangler d1 execute perinade-dev-db --local --file=infra/migrations/003_user_accounts.sql
```

Expected: no errors.

- [ ] **Step 3: Apply to remote D1**

```bash
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
npx wrangler d1 execute perinade-dev-db --file=infra/migrations/003_user_accounts.sql
```

- [ ] **Step 4: Verify**

```bash
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
npx wrangler d1 execute perinade-dev-db --command="PRAGMA table_info(orders)"
```

Expected: row for `supabase_user_id` in output.

- [ ] **Step 5: Commit**

```bash
git add infra/migrations/003_user_accounts.sql infra/supabase/schema.sql
git commit -m "feat(db): D1 migration 003 + Supabase schema for user accounts"
```

---

## Chunk 2: Stripe-Webhook — Supabase Integration

> Modify the stripe-webhook Worker to provision Supabase users after payment and credit loyalty points. All Supabase calls use plain `fetch` — no SDK, no new dependencies.

### Task 2.1 — Inject secrets

- [ ] **Step 1: Add Supabase secrets to stripe-webhook Worker**

```bash
cd /Users/codex/Desktop/WEBDEV/PERINADE/infra/workers/stripe-webhook

echo "<SUPABASE_SERVICE_ROLE_KEY>" | \
  CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
  npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name perinade-dev-stripe-webhook

echo "<SUPABASE_URL>" | \
  CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
  npx wrangler secret put SUPABASE_URL --name perinade-dev-stripe-webhook
```

- [ ] **Step 2: Document secrets in wrangler.toml comment block**

In `infra/workers/stripe-webhook/wrangler.toml`, below the `[vars]` section add:

```toml
# Secrets (injected via `wrangler secret put`):
#   STRIPE_WEBHOOK_SECRET       — Stripe webhook signing secret
#   STRIPE_SECRET_KEY           — Stripe API key
#   RESEND_API_KEY              — Resend email API key
#   SUPABASE_SERVICE_ROLE_KEY   — Supabase service_role key (admin ops)
#   SUPABASE_URL                — Supabase project URL
```

---

### Task 2.2 — Add Supabase helper functions

- [ ] **Step 1: Add `provisionSupabaseUser` and `sendWelcomeMagicLink` to `infra/workers/stripe-webhook/index.js`**

Add these functions at the bottom of the file, before `// ─── Stripe signature verification ───`:

```javascript
// ─── Supabase Integration ────────────────────────────────────────────────────

/**
 * Provision a Supabase user for the customer email, send a welcome magic link
 * on first account creation, and credit loyalty points.
 *
 * Idempotent: D1 user_email_map caches the Supabase user_id so repeat
 * purchases don't re-create users or re-send welcome emails.
 *
 * @returns {Promise<string|null>} supabase_user_id or null on error
 */
async function provisionSupabaseUser(email, amountTotal, sessionId, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Supabase env vars not set — skipping user provisioning");
    return null;
  }

  const supabaseHeaders = {
    "Content-Type": "application/json",
    "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  };

  // 1. Check D1 cache (repeat buyer)
  let userId = null;
  const cached = await env.DB.prepare(
    "SELECT supabase_user_id FROM user_email_map WHERE email = ?"
  ).bind(email).first();

  if (cached?.supabase_user_id) {
    userId = cached.supabase_user_id;
  } else {
    // 2. Create user in Supabase (first purchase)
    const createRes = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: supabaseHeaders,
      body: JSON.stringify({ email, email_confirm: true }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error(`Supabase createUser failed (${createRes.status}): ${errText}`);
      return null;
    }

    const user = await createRes.json();
    userId = user.id;

    // 3. Cache email → user_id in D1
    await env.DB.prepare(
      "INSERT OR IGNORE INTO user_email_map (email, supabase_user_id) VALUES (?, ?)"
    ).bind(email, userId).run();

    // 4. Send welcome magic link (first account creation only)
    await sendWelcomeMagicLink(email, env, supabaseHeaders);
  }

  // 5. Credit loyalty points via atomic Postgres RPC
  const points = Math.max(1, Math.floor(amountTotal / 100));
  const rpcRes = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/upsert_loyalty`, {
    method: "POST",
    headers: { ...supabaseHeaders, "Prefer": "return=minimal" },
    body: JSON.stringify({
      p_user_id: userId,
      p_points: points,
      p_amount_cts: amountTotal,
      p_session_id: sessionId,
    }),
  });

  if (!rpcRes.ok) {
    const errText = await rpcRes.text();
    console.error(`upsert_loyalty RPC failed (${rpcRes.status}): ${errText}`);
    // user_id is still valid — D1 link update below should still run
  }

  return userId;
}

/**
 * Generate a Supabase magic link and send it via the configured SMTP (Resend).
 * Called only on first account creation.
 */
async function sendWelcomeMagicLink(email, env, supabaseHeaders) {
  const siteBase = env.SITE_BASE_URL ?? "https://perinade.fr";
  const linkRes = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: supabaseHeaders,
    body: JSON.stringify({
      type: "magiclink",
      email,
      options: { redirect_to: `${siteBase}/compte` },
    }),
  });

  if (!linkRes.ok) {
    const errText = await linkRes.text();
    console.warn(`generate_link failed (${linkRes.status}): ${errText}`);
    // Non-fatal: user can request a link manually from /compte
    return;
  }

  // Supabase sends the email via the configured SMTP (Resend) automatically.
  console.log(`Welcome magic link dispatched to ${email}`);
}
```

- [ ] **Step 2: Wire into `handleCheckoutCompleted`**

In `handleCheckoutCompleted`, locate the final `console.log` line:

```javascript
console.log(`Checkout ${sessionId}: stock decremented for ${items.length} items`);
```

Add immediately after it:

```javascript
  // Provision Supabase user + credit loyalty points (non-blocking, best-effort)
  const customerEmail = session.customer_details?.email ?? "";
  if (customerEmail) {
    const supabaseUserId = await provisionSupabaseUser(
      customerEmail,
      session.amount_total ?? 0,
      sessionId,
      env
    );
    if (supabaseUserId) {
      await env.DB.prepare(
        "UPDATE orders SET supabase_user_id = ? WHERE stripe_session_id = ?"
      ).bind(supabaseUserId, sessionId).run();
    }
  }
```

- [ ] **Step 3: Test locally**

```bash
cd infra/workers/stripe-webhook
# Terminal 1: start local dev
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e npx wrangler dev --local

# Terminal 2: forward stripe events
stripe listen --forward-to localhost:8787

# Terminal 3: trigger event
stripe trigger checkout.session.completed
```

Expected: logs show `Welcome magic link dispatched to <email>` and no errors.

- [ ] **Step 4: Deploy**

```bash
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e npx wrangler deploy
```

- [ ] **Step 5: Commit**

```bash
git add infra/workers/stripe-webhook/index.js infra/workers/stripe-webhook/wrangler.toml
git commit -m "feat(webhook): provision Supabase user + credit loyalty points after checkout"
```

---

## Chunk 3: API Worker — User JWT Middleware + Routes

> Add user-facing endpoints (`/api/user/*`, `/api/auth/*`) to the existing Hono API Worker. Verify Supabase JWTs using `crypto.subtle` (HS256) — no new dependencies required.

### Task 3.1 — Update types and wrangler config

- [ ] **Step 1: Update `infra/workers/api/src/types.ts`**

```typescript
import type { D1Database, KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STRIPE_SECRET_KEY: string;
  CF_ACCESS_TEAM: string;
  CF_ACCESS_AUD: string;
  DEV_BYPASS_AUTH?: string;
  SUPABASE_JWT_SECRET: string;
  SUPABASE_URL: string;
}
```

- [ ] **Step 2: Update `infra/workers/api/wrangler.toml`**

Add two new route blocks after the existing `[[routes]]` block:

```toml
[[routes]]
pattern = "perinade.alpha2omegaconsulting.com/api/user/*"
zone_id = "3de818ba26d525ef6b866487c8cf2b21"

[[routes]]
pattern = "perinade.alpha2omegaconsulting.com/api/auth/*"
zone_id = "3de818ba26d525ef6b866487c8cf2b21"
```

In `[vars]` section, add:

```toml
SUPABASE_URL = "https://<your-project-ref>.supabase.co"
```

- [ ] **Step 3: Inject `SUPABASE_JWT_SECRET` as a secret**

```bash
cd infra/workers/api
echo "<SUPABASE_JWT_SECRET>" | \
  CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e \
  npx wrangler secret put SUPABASE_JWT_SECRET --name perinade-dev-api
```

---

### Task 3.2 — Write `auth-user` middleware

- [ ] **Step 1: Create `infra/workers/api/src/middleware/auth-user.ts`**

```typescript
import type { Context, Next } from "hono";
import type { Env } from "../types.js";

export type UserVariables = {
  authUser: { sub: string; email: string };
};

/**
 * Verify a Supabase-issued JWT (HS256, signed with SUPABASE_JWT_SECRET).
 * Sets c.var.authUser = { sub, email } on success.
 */
export async function supabaseAuth(
  c: Context<{ Bindings: Env; Variables: UserVariables }>,
  next: Next
) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  const user = await verifySupabaseJwt(token, c.env.SUPABASE_JWT_SECRET);
  if (!user) {
    return c.json({ error: "Forbidden" }, 403);
  }

  c.set("authUser", user);
  await next();
}

// Exported for unit testing
export async function verifySupabaseJwt(
  token: string,
  secret: string
): Promise<{ sub: string; email: string } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;

  let payload: { sub: string; email?: string; exp: number; role?: string };
  try {
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    payload = JSON.parse(json);
  } catch {
    return null;
  }

  // Reject expired tokens and anonymous sessions
  if (payload.exp < Date.now() / 1000) return null;
  if (payload.role !== "authenticated") return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  function b64url(s: string): Uint8Array {
    return Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  }

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    b64url(sigB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );

  return valid ? { sub: payload.sub, email: payload.email ?? "" } : null;
}
```

- [ ] **Step 2: Write unit tests**

Create `infra/workers/api/src/middleware/auth-user.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { verifySupabaseJwt } from "./auth-user.js";

const SECRET = "test-jwt-secret-at-least-32-chars-long!";

async function buildJwt(payload: object, secret: string): Promise<string> {
  const enc = (o: object) =>
    btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  const header = enc({ alg: "HS256", typ: "JWT" });
  const body = enc(payload);
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const rawSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${body}`));
  const sig = btoa(String.fromCharCode(...new Uint8Array(rawSig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return `${header}.${body}.${sig}`;
}

describe("verifySupabaseJwt", () => {
  it("accepts a valid authenticated JWT", async () => {
    const token = await buildJwt(
      { sub: "user-123", email: "a@b.com", exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" },
      SECRET
    );
    const result = await verifySupabaseJwt(token, SECRET);
    expect(result).toEqual({ sub: "user-123", email: "a@b.com" });
  });

  it("rejects an expired token", async () => {
    const token = await buildJwt(
      { sub: "user-123", email: "a@b.com", exp: Math.floor(Date.now() / 1000) - 1, role: "authenticated" },
      SECRET
    );
    const result = await verifySupabaseJwt(token, SECRET);
    expect(result).toBeNull();
  });

  it("rejects anon role", async () => {
    const token = await buildJwt(
      { sub: "anon-abc", email: "", exp: Math.floor(Date.now() / 1000) + 3600, role: "anon" },
      SECRET
    );
    const result = await verifySupabaseJwt(token, SECRET);
    expect(result).toBeNull();
  });

  it("rejects wrong secret", async () => {
    const token = await buildJwt(
      { sub: "user-123", email: "a@b.com", exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" },
      "wrong-secret-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    );
    const result = await verifySupabaseJwt(token, SECRET);
    expect(result).toBeNull();
  });

  it("rejects malformed token", async () => {
    const result = await verifySupabaseJwt("not.a.valid.jwt.string", SECRET);
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests**

```bash
cd infra/workers/api
npm test
```

Expected: all 5 tests pass.

---

### Task 3.3 — Write user and auth routes

- [ ] **Step 1: Create `infra/workers/api/src/routes/user.ts`**

```typescript
import { Hono } from "hono";
import type { Env } from "../types.js";
import type { UserVariables } from "../middleware/auth-user.js";

export const userRoutes = new Hono<{ Bindings: Env; Variables: UserVariables }>();

// GET /api/user/me — returns email + loyalty summary
userRoutes.get("/me", async (c) => {
  const { sub, email } = c.var.authUser;
  const accessToken = c.req.header("Authorization")?.slice(7) ?? "";

  // Fetch profile using the user's own JWT (RLS enforces access)
  const res = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/user_profiles?id=eq.${encodeURIComponent(sub)}&select=loyalty_points,total_orders,total_spent_cts`,
    {
      headers: {
        apikey: c.env.SUPABASE_JWT_SECRET,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) return c.json({ error: "Profile fetch failed" }, 502);

  const rows: unknown[] = await res.json();
  const profile = (rows[0] as Record<string, number>) ?? {
    loyalty_points: 0, total_orders: 0, total_spent_cts: 0,
  };

  return c.json({ sub, email, profile });
});

// GET /api/user/orders — returns user's paid orders from D1
userRoutes.get("/orders", async (c) => {
  const { email } = c.var.authUser;

  try {
    const rows = await c.env.DB.prepare(
      `SELECT id, stripe_session_id, status, amount_total, currency, created_at
       FROM orders
       WHERE customer_email = ? AND status = 'paid'
       ORDER BY created_at DESC
       LIMIT 50`
    ).bind(email).all();

    return c.json(rows.results);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});
```

Note: `items` column (JSON of line items) is excluded from the user API response — expose only if the UI needs it.

- [ ] **Step 2: Create `infra/workers/api/src/routes/auth.ts`**

```typescript
import { Hono } from "hono";
import type { Env } from "../types.js";

export const authRoutes = new Hono<{ Bindings: Env }>();

// POST /api/auth/logout
// Supabase sessions are managed client-side (localStorage).
// This endpoint lets the Astro frontend signal logout to any server-side layer.
authRoutes.post("/logout", (c) => c.json({ ok: true }));
```

---

### Task 3.4 — Register routes in main Hono app

- [ ] **Step 1: Replace `infra/workers/api/src/index.ts`**

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types.js";
import { cfAccessAuth } from "./middleware/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { supabaseAuth } from "./middleware/auth-user.js";
import { dashboardRoutes } from "./routes/dashboard.js";
import { productRoutes } from "./routes/products.js";
import { orderRoutes } from "./routes/orders.js";
import { stockRoutes } from "./routes/stock.js";
import { stripeRoutes } from "./routes/stripe.js";
import { webhookRoutes } from "./routes/webhooks.js";
import { userRoutes } from "./routes/user.js";
import { authRoutes } from "./routes/auth.js";

const app = new Hono<{ Bindings: Env }>();

const SITE_ORIGINS = [
  "https://perinade.fr",
  "https://www.perinade.fr",
  "https://perinade.alpha2omegaconsulting.com",
  "http://localhost:4321",
];

// ── Admin routes ───────────────────────────────────────────────────────────
app.use("/api/admin/*", cors({
  origin: ["https://admin.perinade.fr", "http://localhost:5173"],
  allowMethods: ["GET", "PATCH", "POST"],
  allowHeaders: ["Content-Type", "CF-Access-Jwt-Assertion"],
}));
app.use("/api/admin/*", cfAccessAuth);
app.use("/api/admin/*", rateLimit);

app.route("/api/admin/dashboard", dashboardRoutes);
app.route("/api/admin/products", productRoutes);
app.route("/api/admin/orders", orderRoutes);
app.route("/api/admin/stock", stockRoutes);
app.route("/api/admin/stripe", stripeRoutes);
app.route("/api/admin/webhooks", webhookRoutes);

// ── User routes ────────────────────────────────────────────────────────────
app.use("/api/user/*", cors({
  origin: SITE_ORIGINS,
  allowMethods: ["GET"],
  allowHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api/user/*", supabaseAuth);
app.route("/api/user", userRoutes);

app.use("/api/auth/*", cors({
  origin: SITE_ORIGINS,
  allowMethods: ["POST"],
  allowHeaders: ["Content-Type", "Authorization"],
}));
app.route("/api/auth", authRoutes);

// ── Health ─────────────────────────────────────────────────────────────────
app.get("/api/health", (c) => c.json({ ok: true }));

export default app;
```

- [ ] **Step 2: Deploy API Worker**

```bash
cd infra/workers/api
CLOUDFLARE_ACCOUNT_ID=aea813e220eb8b709d70698a80ded18e npx wrangler deploy
```

- [ ] **Step 3: Smoke test**

```bash
# Both should return 401
curl -i https://perinade.alpha2omegaconsulting.com/api/user/me
curl -i https://perinade.alpha2omegaconsulting.com/api/user/orders
```

Expected: `{"error":"Unauthorized"}` with HTTP 401.

- [ ] **Step 4: Commit**

```bash
git add infra/workers/api/src/
git add infra/workers/api/wrangler.toml
git commit -m "feat(api): add /api/user/* routes with Supabase JWT auth (HS256 via crypto.subtle)"
```

---

## Chunk 4: Astro Frontend — Account Pages

> Install `@supabase/supabase-js`, add UI strings, register routes, create account pages for all 3 locales. **All dynamic data rendered via `textContent` — never `innerHTML`.**

### Task 4.1 — Dependencies + route registration

- [ ] **Step 1: Install Supabase client**

```bash
cd /Users/codex/Desktop/WEBDEV/PERINADE
npm install @supabase/supabase-js
```

- [ ] **Step 2: Add `compte` to route map in `src/i18n/routes.ts`**

In the `pageRoutes` object, add:

```typescript
  compte:    { fr: "/compte",    en: "/en/account", es: "/es/cuenta" },
```

- [ ] **Step 3: Add UI strings to `src/content/ui/fr.yaml`**

Append (at end of file):

```yaml
accountTitle: "Mon espace"
accountSubtitle: "Entrez votre e-mail pour recevoir un lien de connexion."
accountEmailLabel: "Adresse e-mail"
accountEmailPlaceholder: "vous@exemple.fr"
accountSendLinkCta: "Recevoir un lien de connexion"
accountSendingLink: "Envoi en cours…"
accountLinkSent: "Lien envoyé ! Vérifiez votre boîte mail."
accountLinkError: "Une erreur est survenue. Réessayez."
accountLogout: "Se déconnecter"
accountOrdersTitle: "Mes commandes"
accountOrdersEmpty: "Aucune commande pour l'instant."
accountLoyaltyTitle: "Ma fidélité"
accountLoyaltyPoints: "points"
accountLoyaltyOrders: "commandes"
accountLoyaltySpent: "dépensés"
accountOrderDate: "Date"
accountOrderAmount: "Montant"
accountOrderStatus: "Statut"
accountOrderRef: "Référence"
accountStatusPaid: "Payée"
accountStatusPending: "En attente"
accountLoyaltyRule: "1 point par € dépensé. Les points seront bientôt échangeables contre des réductions."
```

- [ ] **Step 4: Add UI strings to `src/content/ui/en.yaml`**

Append:

```yaml
accountTitle: "My account"
accountSubtitle: "Enter your email to receive a login link."
accountEmailLabel: "Email address"
accountEmailPlaceholder: "you@example.com"
accountSendLinkCta: "Send me a login link"
accountSendingLink: "Sending…"
accountLinkSent: "Link sent! Check your inbox."
accountLinkError: "Something went wrong. Please try again."
accountLogout: "Log out"
accountOrdersTitle: "My orders"
accountOrdersEmpty: "No orders yet."
accountLoyaltyTitle: "My loyalty"
accountLoyaltyPoints: "points"
accountLoyaltyOrders: "orders"
accountLoyaltySpent: "spent"
accountOrderDate: "Date"
accountOrderAmount: "Amount"
accountOrderStatus: "Status"
accountOrderRef: "Reference"
accountStatusPaid: "Paid"
accountStatusPending: "Pending"
accountLoyaltyRule: "1 point per € spent. Points will soon be redeemable for discounts."
```

- [ ] **Step 5: Add UI strings to `src/content/ui/es.yaml`**

Append:

```yaml
accountTitle: "Mi cuenta"
accountSubtitle: "Introduce tu correo para recibir un enlace de inicio."
accountEmailLabel: "Correo electrónico"
accountEmailPlaceholder: "tu@ejemplo.es"
accountSendLinkCta: "Recibir enlace de inicio"
accountSendingLink: "Enviando…"
accountLinkSent: "¡Enlace enviado! Revisa tu correo."
accountLinkError: "Algo salió mal. Inténtalo de nuevo."
accountLogout: "Cerrar sesión"
accountOrdersTitle: "Mis pedidos"
accountOrdersEmpty: "Aún no tienes pedidos."
accountLoyaltyTitle: "Mi fidelidad"
accountLoyaltyPoints: "puntos"
accountLoyaltyOrders: "pedidos"
accountLoyaltySpent: "gastados"
accountOrderDate: "Fecha"
accountOrderAmount: "Importe"
accountOrderStatus: "Estado"
accountOrderRef: "Referencia"
accountStatusPaid: "Pagado"
accountStatusPending: "Pendiente"
accountLoyaltyRule: "1 punto por € gastado. Pronto podrás canjear puntos por descuentos."
```

- [ ] **Step 6: Verify i18n**

```bash
npm run i18n:verify
```

Expected: no errors for the new `account*` keys.

- [ ] **Step 7: Add env vars**

Create `.env` in project root (if absent — **never commit**):

```
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
PUBLIC_API_BASE=https://perinade.alpha2omegaconsulting.com
```

Also add in Cloudflare Pages dashboard → **Settings → Environment variables** (both Preview and Production).

---

### Task 4.2 — Client-side auth script

- [ ] **Step 1: Create `src/scripts/account.ts`**

```typescript
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;
const API_BASE = (import.meta.env.PUBLIC_API_BASE as string) ?? "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function sendMagicLink(
  email: string,
  redirectTo: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return { error: error?.message ?? null };
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/compte";
}

export interface UserProfile {
  email: string;
  loyalty_points: number;
  total_orders: number;
  total_spent_cts: number;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const session = await getSession();
  if (!session) return null;

  const res = await fetch(`${API_BASE}/api/user/me`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return null;

  const { email, profile } = await res.json();
  return { email, ...profile } as UserProfile;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  status: string;
  amount_total: number;
  currency: string;
  created_at: string;
}

export async function fetchUserOrders(): Promise<Order[]> {
  const session = await getSession();
  if (!session) return [];

  const res = await fetch(`${API_BASE}/api/user/orders`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return [];
  return res.json();
}
```

---

### Task 4.3 — Magic-link callback pages

- [ ] **Step 1: Create `src/pages/compte/callback.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
const locale = "fr";
---

<BaseLayout
  title="Connexion…"
  description=""
  locale={locale}
  canonicalPath="/compte/callback"
  alternates={[]}
  noindex={true}
>
  <main
    id="main-content"
    style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:2rem;"
  >
    <p id="callback-status" style="color:#4f5257;font-size:1rem;">Connexion en cours…</p>
  </main>
</BaseLayout>

<script>
  import { supabase } from "../../scripts/account";

  const statusEl = document.getElementById("callback-status")!;
  const { error } = await supabase.auth.getSessionFromUrl();

  if (error) {
    statusEl.textContent = "Lien invalide ou expiré. Demandez un nouveau lien depuis /compte.";
  } else {
    window.location.href = "/compte";
  }
</script>
```

- [ ] **Step 2: Create `src/pages/en/account/callback.astro`**

Same structure, `locale = "en"`, redirect to `/en/account`, status text in English:
- Loading: `"Logging in…"`
- Error: `"Invalid or expired link. Request a new one from /en/account."`

- [ ] **Step 3: Create `src/pages/es/cuenta/callback.astro`**

Same structure, `locale = "es"`, redirect to `/es/cuenta`, status text in Spanish:
- Loading: `"Iniciando sesión…"`
- Error: `"Enlace inválido o expirado. Solicita uno nuevo en /es/cuenta."`

---

### Task 4.4 — Dashboard / login page (FR)

- [ ] **Step 1: Create `src/pages/compte.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/sections/Header.astro";
import Footer from "../components/sections/Footer.astro";
import { getSiteData } from "../data/index";
import { getAlternates, getAlternateUrls, getPagePath } from "../i18n/routes";

const locale = "fr";
const pageId = "compte";
const site = await getSiteData(locale);
const alternates = getAlternates(pageId);
const alternateUrls = getAlternateUrls(pageId);
---

<BaseLayout
  title="Mon espace — Domaine de la Périnade"
  description="Accédez à votre historique de commandes et vos points de fidélité."
  locale={locale}
  canonicalPath={getPagePath(pageId, locale)}
  alternates={alternates}
  noindex={true}
>
  <Header
    nav={site.nav}
    quickActions={site.mobileQuickActions}
    ctaLabel={site.experience.ctaLabel}
    ctaHref={site.experience.ctaHref}
    locale={locale}
    alternateUrls={alternateUrls}
  />

  <main id="main-content" class="account-page">
    <div class="account-shell">

      <section id="login-section" class="account-card" hidden>
        <h1 class="account-card__title">Mon espace</h1>
        <p class="account-card__subtitle">Entrez votre e-mail pour recevoir un lien de connexion.</p>
        <form id="magic-link-form" novalidate>
          <label for="email-input" class="account-label">Adresse e-mail</label>
          <input
            id="email-input"
            type="email"
            required
            class="account-input"
            autocomplete="email"
          />
          <button type="submit" id="send-link-btn" class="account-btn-primary">
            Recevoir un lien de connexion
          </button>
          <p id="form-feedback" class="account-feedback" aria-live="polite"></p>
        </form>
      </section>

      <section id="profile-section" class="account-card" hidden>
        <p id="welcome-msg" class="account-card__subtitle"></p>
        <nav class="account-nav" aria-label="Espace utilisateur">
          <a href="/compte/commandes" class="account-nav__link">Mes commandes</a>
          <a href="/compte/fidelite" class="account-nav__link">Mes points de fidélité</a>
        </nav>
        <button id="logout-btn" class="account-btn-secondary" type="button">Se déconnecter</button>
      </section>

    </div>
  </main>

  <Footer footer={site.footer} />
</BaseLayout>

<script>
  import { getSession, sendMagicLink, signOut } from "../scripts/account";

  const loginSection = document.getElementById("login-section")!;
  const profileSection = document.getElementById("profile-section")!;
  const form = document.getElementById("magic-link-form") as HTMLFormElement;
  const emailInput = document.getElementById("email-input") as HTMLInputElement;
  const sendBtn = document.getElementById("send-link-btn") as HTMLButtonElement;
  const feedback = document.getElementById("form-feedback")!;
  const welcomeMsg = document.getElementById("welcome-msg")!;

  const session = await getSession();

  if (session) {
    welcomeMsg.textContent = `Bonjour, ${session.user.email}`;
    profileSection.hidden = false;
    document.getElementById("logout-btn")!.addEventListener("click", signOut);
  } else {
    loginSection.hidden = false;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      sendBtn.disabled = true;
      sendBtn.textContent = "Envoi en cours…";
      feedback.textContent = "";

      const redirectTo = `${window.location.origin}/compte/callback`;
      const { error } = await sendMagicLink(email, redirectTo);

      if (error) {
        feedback.textContent = "Une erreur est survenue. Réessayez.";
        feedback.style.color = "#c0392b";
        sendBtn.disabled = false;
        sendBtn.textContent = "Recevoir un lien de connexion";
      } else {
        feedback.textContent = "Lien envoyé ! Vérifiez votre boîte mail.";
        feedback.style.color = "#27ae60";
        sendBtn.textContent = "Lien envoyé";
      }
    });
  }
</script>

<style>
  .account-page {
    background: #f8f7f5;
    min-height: calc(100svh - var(--header-height) * 2);
    padding: var(--section-padding-y, 3rem) 0;
  }
  .account-shell { margin-inline: auto; max-width: 36rem; padding: 0 1rem; }
  .account-card {
    background: #fff;
    border: 1px solid rgba(44, 44, 44, 0.1);
    border-radius: 1rem;
    box-shadow: 0 10px 26px rgba(16, 24, 40, 0.06);
    padding: 1.5rem;
  }
  .account-card__title { color: #202227; font-size: clamp(1.6rem, 4vw, 2rem); margin: 0 0 0.25rem; }
  .account-card__subtitle { color: #4f5257; margin: 0 0 1.2rem; }
  .account-label { display: block; color: #3a3f47; font-size: 0.88rem; font-weight: 600; margin-bottom: 0.35rem; }
  .account-input {
    border: 1px solid rgba(44, 44, 44, 0.25);
    border-radius: 0.6rem;
    display: block;
    font-size: 1rem;
    padding: 0.65rem 0.85rem;
    width: 100%;
    box-sizing: border-box;
  }
  .account-input:focus { border-color: #c86d00; outline: none; box-shadow: 0 0 0 3px rgba(200, 109, 0, 0.15); }
  .account-btn-primary {
    background: linear-gradient(180deg, #dc7f0a 0%, #c86d00 100%);
    border: none;
    border-radius: 0.65rem;
    color: #fff;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    margin-top: 0.85rem;
    min-height: 2.8rem;
    padding: 0.6rem 1.2rem;
    text-transform: uppercase;
    width: 100%;
  }
  .account-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .account-btn-secondary {
    background: #fff;
    border: 1px solid rgba(44, 44, 44, 0.18);
    border-radius: 0.65rem;
    color: #3a3f47;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 600;
    margin-top: 1rem;
    padding: 0.55rem 1rem;
  }
  .account-feedback { font-size: 0.88rem; margin-top: 0.6rem; min-height: 1.2em; }
  .account-nav { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem; }
  .account-nav__link {
    background: #f7f6f4;
    border: 1px solid rgba(44, 44, 44, 0.08);
    border-radius: 0.6rem;
    color: #202227;
    font-weight: 600;
    padding: 0.75rem 1rem;
    text-decoration: none;
    transition: background 120ms;
  }
  .account-nav__link:hover { background: #edecea; }
</style>
```

- [ ] **Step 2: Create `src/pages/en/account.astro`**

Same structure as above with:
- `locale = "en"`, `pageId = "compte"`
- English text: title "My account", subtitle "Enter your email…", button "Send me a login link"
- `welcomeMsg.textContent = 'Hello, ' + session.user.email`
- nav links: `/en/account/orders` and `/en/account/loyalty`
- redirectTo: `${window.location.origin}/en/account/callback`
- `signOut` should redirect to `/en/account` — pass a locale-specific `signOut` or handle in the script

- [ ] **Step 3: Create `src/pages/es/cuenta.astro`**

Same with Spanish text, nav to `/es/cuenta/pedidos` and `/es/cuenta/fidelidad`, redirect to `/es/cuenta/callback`.

---

### Task 4.5 — Order history page (FR)

- [ ] **Step 1: Create `src/pages/compte/commandes.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/sections/Header.astro";
import Footer from "../../components/sections/Footer.astro";
import { getSiteData } from "../../data/index";

const locale = "fr";
const site = await getSiteData(locale);
const alternateUrls = { fr: "/compte/commandes", en: "/en/account/orders", es: "/es/cuenta/pedidos" };
---

<BaseLayout
  title="Mes commandes — Domaine de la Périnade"
  description=""
  locale={locale}
  canonicalPath="/compte/commandes"
  alternates={[]}
  noindex={true}
>
  <Header
    nav={site.nav}
    quickActions={site.mobileQuickActions}
    ctaLabel={site.experience.ctaLabel}
    ctaHref={site.experience.ctaHref}
    locale={locale}
    alternateUrls={alternateUrls}
  />

  <main id="main-content" class="account-page">
    <div class="account-shell">
      <h1 class="account-page__title">Mes commandes</h1>
      <div id="orders-container">
        <p id="orders-status" style="color:#4f5257">Chargement…</p>
      </div>
    </div>
  </main>

  <Footer footer={site.footer} />
</BaseLayout>

<script>
  import { getSession, fetchUserOrders } from "../../scripts/account";
  import type { Order } from "../../scripts/account";

  const session = await getSession();
  const statusEl = document.getElementById("orders-status")!;
  const container = document.getElementById("orders-container")!;

  if (!session) {
    statusEl.textContent = "";
    const link = document.createElement("a");
    link.href = "/compte";
    link.textContent = "Connectez-vous pour voir vos commandes";
    statusEl.appendChild(link);
    return;
  }

  const orders = await fetchUserOrders();

  if (orders.length === 0) {
    statusEl.textContent = "Aucune commande pour l'instant.";
    return;
  }

  statusEl.remove();

  // Build table using DOM methods (no innerHTML with dynamic data)
  const table = document.createElement("table");
  table.className = "orders-table";

  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  ["Date", "Référence", "Montant", "Statut"].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    headerRow.appendChild(th);
  });

  const tbody = table.createTBody();
  orders.forEach((o: Order) => {
    const tr = tbody.insertRow();

    const tdDate = tr.insertCell();
    tdDate.textContent = new Date(o.created_at).toLocaleDateString("fr-FR");

    const tdRef = tr.insertCell();
    const code = document.createElement("code");
    code.textContent = o.stripe_session_id.slice(-8);
    tdRef.appendChild(code);

    const tdAmount = tr.insertCell();
    tdAmount.textContent = `${(o.amount_total / 100).toFixed(2)} €`;

    const tdStatus = tr.insertCell();
    tdStatus.textContent = o.status === "paid" ? "Payée" : o.status;
  });

  container.appendChild(table);
</script>

<style>
  .account-page { background: #f8f7f5; min-height: calc(100svh - var(--header-height) * 2); padding: var(--section-padding-y, 3rem) 0; }
  .account-shell { margin-inline: auto; max-width: 52rem; padding: 0 1rem; }
  .account-page__title { color: #202227; font-size: clamp(1.6rem, 4vw, 2rem); margin: 0 0 1.25rem; }
  .orders-table {
    border-collapse: collapse;
    width: 100%;
    background: #fff;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(16, 24, 40, 0.06);
  }
  .orders-table th, .orders-table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(44, 44, 44, 0.08);
  }
  .orders-table th {
    background: #f7f6f4;
    color: #5b616a;
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .orders-table td { color: #202227; font-size: 0.92rem; }
  .orders-table code { font-size: 0.82rem; color: #5b616a; }
</style>
```

- [ ] **Step 2: Create EN and ES equivalents**

`src/pages/en/account/orders.astro` — same structure, locale `"en"`, English labels (Date, Reference, Amount, Status), redirect to `/en/account` when not logged in.

`src/pages/es/cuenta/pedidos.astro` — same, locale `"es"`, Spanish labels (Fecha, Referencia, Importe, Estado), redirect to `/es/cuenta`.

---

### Task 4.6 — Loyalty points page (FR)

- [ ] **Step 1: Create `src/pages/compte/fidelite.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/sections/Header.astro";
import Footer from "../../components/sections/Footer.astro";
import { getSiteData } from "../../data/index";

const locale = "fr";
const site = await getSiteData(locale);
const alternateUrls = { fr: "/compte/fidelite", en: "/en/account/loyalty", es: "/es/cuenta/fidelidad" };
---

<BaseLayout
  title="Fidélité — Domaine de la Périnade"
  description=""
  locale={locale}
  canonicalPath="/compte/fidelite"
  alternates={[]}
  noindex={true}
>
  <Header
    nav={site.nav}
    quickActions={site.mobileQuickActions}
    ctaLabel={site.experience.ctaLabel}
    ctaHref={site.experience.ctaHref}
    locale={locale}
    alternateUrls={alternateUrls}
  />

  <main id="main-content" class="account-page">
    <div class="account-shell">
      <h1 class="account-page__title">Ma fidélité</h1>
      <div id="loyalty-container">
        <p id="loyalty-status" style="color:#4f5257">Chargement…</p>
      </div>
    </div>
  </main>

  <Footer footer={site.footer} />
</BaseLayout>

<script>
  import { getSession, fetchUserProfile } from "../../scripts/account";

  const session = await getSession();
  const statusEl = document.getElementById("loyalty-status")!;
  const container = document.getElementById("loyalty-container")!;

  if (!session) {
    statusEl.textContent = "";
    const link = document.createElement("a");
    link.href = "/compte";
    link.textContent = "Connectez-vous pour voir vos points";
    statusEl.appendChild(link);
    return;
  }

  const profile = await fetchUserProfile();

  if (!profile) {
    statusEl.textContent = "Impossible de charger votre profil.";
    return;
  }

  statusEl.remove();

  // Build stats using DOM methods (no innerHTML with dynamic data)
  const card = document.createElement("div");
  card.className = "loyalty-card";

  const stats = [
    { value: String(profile.loyalty_points), label: "points" },
    { value: String(profile.total_orders), label: "commandes" },
    { value: `${Math.floor(profile.total_spent_cts / 100)} €`, label: "dépensés" },
  ];

  stats.forEach(({ value, label }) => {
    const stat = document.createElement("div");
    stat.className = "loyalty-stat";

    const valEl = document.createElement("span");
    valEl.className = "loyalty-stat__value";
    valEl.textContent = value;

    const labelEl = document.createElement("span");
    labelEl.className = "loyalty-stat__label";
    labelEl.textContent = label;

    stat.appendChild(valEl);
    stat.appendChild(labelEl);
    card.appendChild(stat);
  });

  container.appendChild(card);

  const rule = document.createElement("p");
  rule.className = "loyalty-rule";
  rule.textContent = "1 point par € dépensé. Les points seront bientôt échangeables contre des réductions.";
  container.appendChild(rule);
</script>

<style>
  .account-page { background: #f8f7f5; min-height: calc(100svh - var(--header-height) * 2); padding: var(--section-padding-y, 3rem) 0; }
  .account-shell { margin-inline: auto; max-width: 36rem; padding: 0 1rem; }
  .account-page__title { color: #202227; font-size: clamp(1.6rem, 4vw, 2rem); margin: 0 0 1.25rem; }
  .loyalty-card {
    background: #fff;
    border: 1px solid rgba(44, 44, 44, 0.1);
    border-radius: 1rem;
    box-shadow: 0 10px 26px rgba(16, 24, 40, 0.06);
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  .loyalty-stat { align-items: center; display: flex; flex-direction: column; flex: 1; }
  .loyalty-stat__value { color: #202227; font-size: 2rem; font-weight: 700; }
  .loyalty-stat__label { color: #5b616a; font-size: 0.82rem; letter-spacing: 0.06em; margin-top: 0.2rem; text-transform: uppercase; }
  .loyalty-rule { color: #5b616a; font-size: 0.88rem; margin-top: 1rem; }
</style>
```

- [ ] **Step 2: Create EN and ES equivalents**

`src/pages/en/account/loyalty.astro` — same, English labels (points, orders, spent), English rule text.

`src/pages/es/cuenta/fidelidad.astro` — same, Spanish labels (puntos, pedidos, gastados).

---

### Task 4.7 — Final build + deploy verification

- [ ] **Step 1: Type check**

```bash
cd /Users/codex/Desktop/WEBDEV/PERINADE
npm run check
```

Expected: 0 errors.

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: all account pages compiled in `dist/`.

- [ ] **Step 3: i18n verify**

```bash
npm run i18n:verify
```

Expected: no missing key errors.

- [ ] **Step 4: End-to-end test (manual)**

1. Trigger Stripe test webhook: `stripe trigger checkout.session.completed`
2. Supabase Dashboard → **Auth → Users** — verify email exists
3. Supabase **Table Editor → user_profiles** — verify `loyalty_points >= 1`
4. Cloudflare D1 Console → `SELECT supabase_user_id FROM orders ORDER BY created_at DESC LIMIT 1` — verify non-null
5. Visit `/compte` — verify login form appears
6. Submit test email → verify "Lien envoyé" feedback
7. Click magic link from inbox → verify redirect to `/compte` shows profile section with email
8. Visit `/compte/commandes` → verify order row appears in table
9. Visit `/compte/fidelite` → verify points match the order amount
10. Click "Se déconnecter" → verify redirect to `/compte` shows login form again

- [ ] **Step 5: Commit**

```bash
git add src/pages/compte.astro src/pages/compte/ src/pages/en/account* src/pages/es/cuenta*
git add src/scripts/account.ts src/i18n/routes.ts
git add src/content/ui/fr.yaml src/content/ui/en.yaml src/content/ui/es.yaml
git add package.json package-lock.json
git commit -m "feat(frontend): account pages — magic-link auth, order history, loyalty points"
```

---

## Verification Summary

| Check | Method |
|---|---|
| D1 migration applied | `wrangler d1 execute ... --command="PRAGMA table_info(orders)"` — see `supabase_user_id` |
| Supabase schema live | SQL Editor: `SELECT COUNT(*) FROM user_profiles` |
| Stripe webhook creates Supabase user | Dashboard → Auth → Users after `stripe trigger` |
| Loyalty points credited | Table Editor → user_profiles |
| API rejects no-token | `curl -i .../api/user/me` → 401 |
| JWT middleware unit tests | `cd infra/workers/api && npm test` → 5 pass |
| Astro build passes | `npm run build` → 0 errors |
| Magic link login flow | Manual: email → click → `/compte` shows profile |
| Order history loads | `/compte/commandes` shows orders from D1 |
| Loyalty page loads | `/compte/fidelite` shows points from Supabase |
| RLS: user can't see others | Query `user_profiles` with another user's token → 0 rows |
| GDPR delete | DELETE auth.users → cascade; UPDATE orders SET customer_email = '[supprimé]' |
