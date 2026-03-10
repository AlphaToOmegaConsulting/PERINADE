import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { Hono } from "hono";
import { supabaseUserAuth, resetJwksCache, setJwksCache } from "./auth-user.js";
import type { UserVariables } from "./auth-user.js";
import type { Env } from "../types.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const TEST_SUPABASE_URL = "https://test.supabase.co";

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encodeJson(obj: unknown): string {
  return base64urlEncode(new TextEncoder().encode(JSON.stringify(obj)));
}

async function makeToken(
  privateKey: CryptoKey,
  payload: Record<string, unknown>,
  // optional header overrides (e.g. to set a kid or override alg)
  headerOverrides?: Record<string, unknown>
): Promise<string> {
  const header = encodeJson({ alg: "ES256", typ: "JWT", ...headerOverrides });
  const body = encodeJson(payload);
  const data = new TextEncoder().encode(`${header}.${body}`);
  const sigBytes = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    data
  );
  return `${header}.${body}.${base64urlEncode(new Uint8Array(sigBytes))}`;
}

// ── Test setup ─────────────────────────────────────────────────────────────

let privateKey: CryptoKey;
let publicKey: CryptoKey;

beforeAll(async () => {
  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
  privateKey = kp.privateKey;
  publicKey = kp.publicKey;
});

afterEach(() => {
  resetJwksCache();
});

// Helper: wrap a CryptoKey into the cache entry format required by setJwksCache
function cacheEntry(key: CryptoKey, kid = "test-key-id") {
  return { kid, key };
}

// Minimal Hono app for testing — binds SUPABASE_URL so middleware can use it
function makeApp() {
  const app = new Hono<{ Bindings: Env; Variables: UserVariables }>();
  app.use("/protected", supabaseUserAuth);
  app.get("/protected", (c) =>
    c.json({ userId: c.get("userId"), userEmail: c.get("userEmail") })
  );
  return app;
}

async function request(app: Hono, authHeader?: string) {
  const headers: Record<string, string> = {
    // Provide the env binding that the middleware reads
    "x-test-supabase-url": TEST_SUPABASE_URL,
  };
  if (authHeader !== undefined) headers["Authorization"] = authHeader;
  // Inject env via Hono's fetch env parameter
  return app.fetch(
    new Request("http://localhost/protected", { headers }),
    { SUPABASE_URL: TEST_SUPABASE_URL } as unknown as Env
  );
}

// Valid payload helper — includes iss and aud so Fix 4 checks pass
function validPayload(overrides?: Record<string, unknown>) {
  return {
    sub: "user-uuid-456",
    email: "customer@perinade.fr",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iss: `${TEST_SUPABASE_URL}/auth/v1`,
    aud: "authenticated",
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("supabaseUserAuth middleware", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const app = makeApp();
    const res = await request(app);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 when Authorization header has no Bearer prefix", async () => {
    const app = makeApp();
    const res = await request(app, "Basic sometoken");
    expect(res.status).toBe(401);
  });

  it("returns 401 when token does not have 3 parts", async () => {
    const app = makeApp();
    const res = await request(app, "Bearer onlytwoparts.here");
    expect(res.status).toBe(401);
  });

  it("returns 401 when token is malformed (not valid base64url JSON)", async () => {
    const app = makeApp();
    const res = await request(app, "Bearer !!!.!!!.!!!");
    expect(res.status).toBe(401);
  });

  // Fix 3: token with alg: "none" must be rejected before key lookup
  it("returns 401 when token header has alg: none", async () => {
    setJwksCache([cacheEntry(publicKey)], TEST_SUPABASE_URL);
    const app = makeApp();

    const token = await makeToken(privateKey, validPayload(), { alg: "none" });
    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it("returns 401 when token is expired", async () => {
    setJwksCache([cacheEntry(publicKey)], TEST_SUPABASE_URL);
    const app = makeApp();

    const token = await makeToken(
      privateKey,
      validPayload({ exp: Math.floor(Date.now() / 1000) - 3600 })
    );

    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it("returns 401 when signature is invalid (tampered payload)", async () => {
    setJwksCache([cacheEntry(publicKey)], TEST_SUPABASE_URL);
    const app = makeApp();

    const token = await makeToken(privateKey, validPayload());

    // Tamper with the payload part
    const parts = token.split(".");
    const tamperedPayload = encodeJson({
      sub: "attacker-uuid",
      email: "attacker@evil.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: `${TEST_SUPABASE_URL}/auth/v1`,
      aud: "authenticated",
    });
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const res = await request(app, `Bearer ${tamperedToken}`);
    expect(res.status).toBe(401);
  });

  it("returns 401 when JWKS fetch fails", async () => {
    resetJwksCache();
    const origFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error("Network error");
    };

    try {
      const app = makeApp();
      const token = await makeToken(privateKey, validPayload());
      const res = await request(app, `Bearer ${token}`);
      expect(res.status).toBe(401);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // Fix 4: wrong iss must return 401
  it("returns 401 when token has wrong iss claim", async () => {
    setJwksCache([cacheEntry(publicKey)], TEST_SUPABASE_URL);
    const app = makeApp();

    const token = await makeToken(
      privateKey,
      validPayload({ iss: "https://evil.supabase.co/auth/v1" })
    );
    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  // Fix 4: wrong aud must return 401
  it("returns 401 when token has wrong aud claim", async () => {
    setJwksCache([cacheEntry(publicKey)], TEST_SUPABASE_URL);
    const app = makeApp();

    const token = await makeToken(privateKey, validPayload({ aud: "anon" }));
    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it("passes with a valid token and sets userId + userEmail on context", async () => {
    setJwksCache([cacheEntry(publicKey)], TEST_SUPABASE_URL);
    const app = makeApp();

    const token = await makeToken(privateKey, validPayload());

    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      userId: "user-uuid-456",
      userEmail: "customer@perinade.fr",
    });
  });

  // Fix 3: token signed with valid key, future exp, but no sub → 401
  it("returns 401 when token is missing the sub claim", async () => {
    setJwksCache([cacheEntry(publicKey)], TEST_SUPABASE_URL);
    const app = makeApp();

    const token = await makeToken(
      privateKey,
      validPayload({ sub: undefined })
    );

    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
