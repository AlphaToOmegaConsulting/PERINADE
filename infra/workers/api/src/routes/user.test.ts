import { describe, it, expect, beforeEach, vi } from "vitest";
import { Hono } from "hono";
import { userRoutes } from "./user.js";
import { setJwksCache, resetJwksCache } from "../middleware/auth-user.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal ES256 key pair and sign a JWT so that supabaseUserAuth
 * can verify it. Returns { token, privateKey }.
 */
async function makeSignedToken(
  payload: Record<string, unknown>,
  kid = "test-kid"
): Promise<{ token: string; publicKey: CryptoKey }> {
  const pair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  const header = { alg: "ES256", typ: "JWT", kid };
  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const sigBuffer = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    pair.privateKey,
    data
  );
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return {
    token: `${headerB64}.${payloadB64}.${sigB64}`,
    publicKey: pair.publicKey,
  };
}

// ---------------------------------------------------------------------------
// D1 mock factory
// ---------------------------------------------------------------------------

function makeD1Mock(firstResult: unknown = null, allResults: unknown[] = []) {
  const stmt = {
    bind: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(firstResult),
    all: vi.fn().mockResolvedValue({ results: allResults }),
  };
  return {
    prepare: vi.fn().mockReturnValue(stmt),
    _stmt: stmt,
  } as unknown as D1Database;
}

// ---------------------------------------------------------------------------
// App builder
// ---------------------------------------------------------------------------

function makeApp(DB: D1Database) {
  const app = new Hono<{ Bindings: { DB: D1Database; SUPABASE_URL: string } }>();
  app.route("/api/user", userRoutes);
  return {
    fetch: (path: string, init?: RequestInit) =>
      app.fetch(
        new Request(`http://localhost${path}`, init),
        // env binding
        { DB, SUPABASE_URL: "https://test.supabase.co" } as unknown as { DB: D1Database; SUPABASE_URL: string },
        {} as ExecutionContext
      ),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const SUPABASE_URL = "https://test.supabase.co";
const USER_ID = "user-uuid-1234";
const USER_EMAIL = "user@example.com";

const validPayload = {
  sub: USER_ID,
  email: USER_EMAIL,
  exp: Math.floor(Date.now() / 1000) + 3600,
  iss: `${SUPABASE_URL}/auth/v1`,
  aud: "authenticated",
};

describe("userRoutes — GET /api/user/me", () => {
  beforeEach(() => {
    resetJwksCache();
  });

  it("returns 401 when no Authorization header", async () => {
    const db = makeD1Mock();
    const { fetch } = makeApp(db);
    const res = await fetch("/api/user/me");
    expect(res.status).toBe(401);
  });

  it("returns 200 with zero stats when user has no orders", async () => {
    const db = makeD1Mock({ order_count: 0, total_spent: null });
    const { token, publicKey } = await makeSignedToken(validPayload);
    setJwksCache([{ kid: "test-kid", key: publicKey }], SUPABASE_URL);

    const { fetch } = makeApp(db);
    const res = await fetch("/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.userId).toBe(USER_ID);
    expect(body.email).toBe(USER_EMAIL);
    expect(body.orderCount).toBe(0);
    expect(body.totalSpentCents).toBe(0);
  });

  it("returns 200 with correct stats when user has orders", async () => {
    const db = makeD1Mock({ order_count: 3, total_spent: 7500 });
    const { token, publicKey } = await makeSignedToken(validPayload);
    setJwksCache([{ kid: "test-kid", key: publicKey }], SUPABASE_URL);

    const { fetch } = makeApp(db);
    const res = await fetch("/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.orderCount).toBe(3);
    expect(body.totalSpentCents).toBe(7500);
  });
});

describe("userRoutes — GET /api/user/orders", () => {
  beforeEach(() => {
    resetJwksCache();
  });

  it("returns 401 when no Authorization header", async () => {
    const db = makeD1Mock(null, []);
    const { fetch } = makeApp(db);
    const res = await fetch("/api/user/orders");
    expect(res.status).toBe(401);
  });

  it("returns 200 with empty array when user has no orders", async () => {
    const db = makeD1Mock(null, []);
    const { token, publicKey } = await makeSignedToken(validPayload);
    setJwksCache([{ kid: "test-kid", key: publicKey }], SUPABASE_URL);

    const { fetch } = makeApp(db);
    const res = await fetch("/api/user/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect((body as unknown[]).length).toBe(0);
  });

  it("returns 200 with parsed orders when user has orders", async () => {
    const rawOrder = {
      id: "ord-1",
      stripe_session_id: "cs_test_abc",
      status: "paid",
      amount_total: 4500,
      currency: "eur",
      line_items: JSON.stringify([{ name: "Vin rouge", quantity: 1 }]),
      created_at: "2026-01-01T12:00:00Z",
    };
    const db = makeD1Mock(null, [rawOrder]);
    const { token, publicKey } = await makeSignedToken(validPayload);
    setJwksCache([{ kid: "test-kid", key: publicKey }], SUPABASE_URL);

    const { fetch } = makeApp(db);
    const res = await fetch("/api/user/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>[];
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe("ord-1");
    // line_items should be parsed from JSON string to object
    expect(Array.isArray(body[0].line_items)).toBe(true);
    expect((body[0].line_items as unknown[])[0]).toMatchObject({ name: "Vin rouge" });
  });
});
