import type { Context, Next } from "hono";
import type { Env } from "../types.js";

const LIMIT = 60;   // requests per fixed window
const WINDOW = 60;  // seconds

export async function rateLimit(c: Context<{ Bindings: Env }>, next: Next) {
  const ip = c.req.header("CF-Connecting-IP") ?? "unknown";
  // Key includes the current window bucket (fixed window, not sliding)
  const windowBucket = Math.floor(Date.now() / 1000 / WINDOW);
  const key = `rate:admin:${ip}:${windowBucket}`;

  const current = await c.env.CACHE.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= LIMIT) {
    return c.json({ error: "Too Many Requests" }, 429);
  }

  // TTL set to 2× window to ensure cleanup even at bucket boundaries
  await c.env.CACHE.put(key, String(count + 1), { expirationTtl: WINDOW * 2 });
  await next();
}
