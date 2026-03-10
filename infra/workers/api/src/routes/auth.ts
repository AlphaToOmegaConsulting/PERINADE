import { Hono } from "hono";
import type { Env } from "../types.js";

export const authRoutes = new Hono<{ Bindings: Env }>();

/**
 * POST /api/auth/logout
 *
 * Supabase sessions are managed client-side; this endpoint exists for
 * completeness and future use (e.g. token blocklist). No server-side
 * state needs to be cleared for stateless JWT auth.
 */
authRoutes.post("/logout", (c) => {
  return c.json({ ok: true });
});

/**
 * GET /api/auth/session
 *
 * Lightweight session probe that decodes (but does NOT verify the signature of)
 * the JWT in the Authorization header. Returns { authenticated: true/false }.
 *
 * Token signature is NOT verified here — use /api/user/me for authenticated
 * actions (which goes through supabaseUserAuth middleware with full verification).
 */
authRoutes.get("/session", (c) => {
  const auth = c.req.header("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return c.json({ authenticated: false });
  }

  const token = auth.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return c.json({ authenticated: false });
    }
    const [, payloadB64] = parts;
    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { sub?: string; exp?: number; email?: string };

    if (!payload.sub || !payload.exp || payload.exp < Date.now() / 1000) {
      return c.json({ authenticated: false });
    }

    return c.json({
      authenticated: true,
      userId: payload.sub,
      email: payload.email ?? "",
    });
  } catch {
    return c.json({ authenticated: false });
  }
});
