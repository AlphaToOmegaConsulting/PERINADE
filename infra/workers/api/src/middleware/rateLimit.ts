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
