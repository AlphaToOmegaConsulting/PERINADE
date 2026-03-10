import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { authRoutes } from "./auth.js";

// ---------------------------------------------------------------------------
// App builder
// ---------------------------------------------------------------------------

function makeApp() {
  const app = new Hono();
  app.route("/api/auth", authRoutes);
  return {
    fetch: (path: string, init?: RequestInit) =>
      app.fetch(
        new Request(`http://localhost${path}`, init),
        {},
        {} as ExecutionContext
      ),
  };
}

// ---------------------------------------------------------------------------
// JWT payload helpers
// ---------------------------------------------------------------------------

function encodeB64url(obj: unknown): string {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Build an unsigned fake JWT (for /session which does not verify signatures). */
function makeFakeToken(payload: Record<string, unknown>): string {
  const header = encodeB64url({ alg: "ES256", typ: "JWT" });
  const body = encodeB64url(payload);
  return `${header}.${body}.fakesig`;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("authRoutes — POST /api/auth/logout", () => {
  it("returns 200 { ok: true } without any auth header", async () => {
    const { fetch } = makeApp();
    const res = await fetch("/api/auth/logout", { method: "POST" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });
});

describe("authRoutes — GET /api/auth/session", () => {
  it("returns { authenticated: false } when no Authorization header", async () => {
    const { fetch } = makeApp();
    const res = await fetch("/api/auth/session");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ authenticated: false });
  });

  it("returns { authenticated: false } when token is expired", async () => {
    const { fetch } = makeApp();
    const expiredToken = makeFakeToken({
      sub: "user-uuid",
      email: "user@example.com",
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    const res = await fetch("/api/auth/session", {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ authenticated: false });
  });

  it("returns { authenticated: true, userId, email } with a valid token", async () => {
    const { fetch } = makeApp();
    const userId = "user-uuid-5678";
    const email = "hello@perinade.fr";
    const token = makeFakeToken({
      sub: userId,
      email,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const res = await fetch("/api/auth/session", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.authenticated).toBe(true);
    expect(body.userId).toBe(userId);
    expect(body.email).toBe(email);
  });

  it("returns { authenticated: false } when Authorization header is malformed", async () => {
    const { fetch } = makeApp();
    const res = await fetch("/api/auth/session", {
      headers: { Authorization: "Basic notabearer" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ authenticated: false });
  });

  it("returns { authenticated: false } when token payload is invalid JSON", async () => {
    const { fetch } = makeApp();
    // Construct a token whose payload is not valid base64url JSON
    const res = await fetch("/api/auth/session", {
      headers: { Authorization: "Bearer header.!!!notbase64.sig" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ authenticated: false });
  });
});
