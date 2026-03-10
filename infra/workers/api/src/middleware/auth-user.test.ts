import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { Hono } from "hono";
import { supabaseUserAuth, resetJwksCache, setJwksCache } from "./auth-user.js";
import type { UserVariables } from "./auth-user.js";
import type { Env } from "../types.js";

// ── Helpers ────────────────────────────────────────────────────────────────

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
  payload: Record<string, unknown>
): Promise<string> {
  const header = encodeJson({ alg: "ES256", typ: "JWT" });
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

// Minimal Hono app for testing
function makeApp() {
  const app = new Hono<{ Bindings: Env; Variables: UserVariables }>();
  app.use("/protected", supabaseUserAuth);
  app.get("/protected", (c) =>
    c.json({ userId: c.get("userId"), userEmail: c.get("userEmail") })
  );
  return app;
}

async function request(app: Hono, authHeader?: string) {
  const headers: Record<string, string> = {};
  if (authHeader !== undefined) headers["Authorization"] = authHeader;
  return app.request("/protected", { headers });
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

  it("returns 401 when token is expired", async () => {
    setJwksCache([publicKey]);
    const app = makeApp();

    const expiredPayload = {
      sub: "user-uuid-123",
      email: "user@example.com",
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    };
    const token = await makeToken(privateKey, expiredPayload);

    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it("returns 401 when signature is invalid (tampered payload)", async () => {
    setJwksCache([publicKey]);
    const app = makeApp();

    const validPayload = {
      sub: "user-uuid-123",
      email: "user@example.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const token = await makeToken(privateKey, validPayload);

    // Tamper with the payload part
    const parts = token.split(".");
    const tamperedPayload = encodeJson({
      sub: "attacker-uuid",
      email: "attacker@evil.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const res = await request(app, `Bearer ${tamperedToken}`);
    expect(res.status).toBe(401);
  });

  it("returns 401 when JWKS fetch fails", async () => {
    // Do NOT set cache — but override fetchJwks by keeping cache null
    // and patching the global fetch to fail
    resetJwksCache();
    const origFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error("Network error");
    };

    try {
      const app = makeApp();
      const validPayload = {
        sub: "user-uuid-123",
        email: "user@example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      // We need a real token but the JWKS will fail anyway
      const token = await makeToken(privateKey, validPayload);
      const res = await request(app, `Bearer ${token}`);
      expect(res.status).toBe(401);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it("passes with a valid token and sets userId + userEmail on context", async () => {
    setJwksCache([publicKey]);
    const app = makeApp();

    const validPayload = {
      sub: "user-uuid-456",
      email: "customer@perinade.fr",
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const token = await makeToken(privateKey, validPayload);

    const res = await request(app, `Bearer ${token}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      userId: "user-uuid-456",
      userEmail: "customer@perinade.fr",
    });
  });
});
