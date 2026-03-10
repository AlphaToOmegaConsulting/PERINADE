import { Hono } from "hono";
import type { Env } from "../types.js";

export const orderRoutes = new Hono<{ Bindings: Env }>();

orderRoutes.get("/", async (c) => {
  const VALID_STATUSES = ["paid", "pending", "failed", "canceled", "expired"] as const;
  const status = c.req.query("status");
  const from = c.req.query("from");
  const to = c.req.query("to");

  if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return c.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, 400);
  }
  if (from && isNaN(Date.parse(from))) {
    return c.json({ error: "Invalid 'from' date" }, 400);
  }
  if (to && isNaN(Date.parse(to))) {
    return c.json({ error: "Invalid 'to' date" }, 400);
  }

  let sql = "SELECT * FROM orders WHERE 1=1";
  const params: (string | number)[] = [];

  if (status) { sql += " AND status = ?"; params.push(status); }
  if (from)   { sql += " AND created_at >= ?"; params.push(from); }
  if (to)     { sql += " AND created_at <= ?"; params.push(to); }

  sql += " ORDER BY created_at DESC LIMIT 100";

  try {
    const rows = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json(rows.results);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});

orderRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const order = await c.env.DB.prepare(
      "SELECT * FROM orders WHERE id = ? OR stripe_session_id = ?"
    ).bind(id, id).first();
    if (!order) return c.json({ error: "Not found" }, 404);
    return c.json(order);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});
