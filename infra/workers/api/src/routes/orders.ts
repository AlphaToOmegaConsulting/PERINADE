import { Hono } from "hono";
import type { Env } from "../types.js";

export const orderRoutes = new Hono<{ Bindings: Env }>();

orderRoutes.get("/", async (c) => {
  const status = c.req.query("status");
  const from = c.req.query("from");
  const to = c.req.query("to");

  let sql = "SELECT * FROM orders WHERE 1=1";
  const params: (string | number)[] = [];

  if (status) { sql += " AND status = ?"; params.push(status); }
  if (from)   { sql += " AND created_at >= ?"; params.push(from); }
  if (to)     { sql += " AND created_at <= ?"; params.push(to); }

  sql += " ORDER BY created_at DESC LIMIT 100";

  const rows = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json(rows.results);
});

orderRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const order = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE id = ? OR stripe_session_id = ?"
  ).bind(id, id).first();
  if (!order) return c.json({ error: "Not found" }, 404);
  return c.json(order);
});
