import type { Context, Next } from "hono";
import type { Env } from "../types.js";
import { getJwks, verifyJwt } from "../lib/jwks.js";

// Extend Hono context variables to carry the authenticated user
type AuthVariables = { user: { email: string } };

export async function cfAccessAuth(
  c: Context<{ Bindings: Env; Variables: AuthVariables }>,
  next: Next
) {
  // Guard: placeholder AUD tag must never reach a live request
  if (c.env.CF_ACCESS_AUD === "your-aud-tag" || c.env.CF_ACCESS_AUD === "your-team-name") {
    throw new Error("CF_ACCESS_AUD is still set to the placeholder value. Set the real Audience tag via `wrangler secret put CF_ACCESS_AUD`.");
  }

  // Guard: DEV_BYPASS_AUTH must never coexist with a real AUD tag (= production)
  if (c.env.DEV_BYPASS_AUTH === "true" && c.env.CF_ACCESS_AUD) {
    throw new Error("DEV_BYPASS_AUTH must not be set when CF_ACCESS_AUD is configured. Remove DEV_BYPASS_AUTH from your environment.");
  }

  // DEV ONLY — bypass via .dev.vars (gitignored, never in wrangler.toml)
  if (c.env.DEV_BYPASS_AUTH === "true") {
    c.set("user", { email: "dev@local.test" });
    await next();
    return;
  }

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

  let user = await verifyJwt(token, keys, c.env.CF_ACCESS_AUD);

  // If validation failed with cached keys, try fresh keys (key rotation)
  if (!user) {
    await c.env.CACHE.delete("cf_access_jwks");
    try {
      const freshKeys = await getJwks(c.env.CF_ACCESS_TEAM, c.env.CACHE);
      user = await verifyJwt(token, freshKeys, c.env.CF_ACCESS_AUD);
      if (!user) return c.json({ error: "Forbidden" }, 403);
    } catch {
      return c.json({ error: "Auth service unavailable" }, 503);
    }
  }

  // Store authenticated user in context for downstream route handlers
  c.set("user", user);
  await next();
}
