import { Hono } from "hono";
import type { Env } from "../types.js";

export const webhookRoutes = new Hono<{ Bindings: Env }>();

webhookRoutes.get("/", async (c) => {
  try {
    const rows = await c.env.DB.prepare(
      "SELECT id, event_type, stripe_event_id, status, error, created_at FROM webhook_logs ORDER BY created_at DESC LIMIT 50"
    ).all();
    return c.json(rows.results);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});
