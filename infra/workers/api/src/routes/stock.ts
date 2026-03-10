import { Hono } from "hono";
import type { Env } from "../types.js";

export const stockRoutes = new Hono<{ Bindings: Env }>();

stockRoutes.get("/movements", async (c) => {
  const productId = c.req.query("product_id");
  let sql = "SELECT * FROM stock_movements";
  const params: string[] = [];
  if (productId) { sql += " WHERE product_id = ?"; params.push(productId); }
  sql += " ORDER BY created_at DESC LIMIT 200";
  try {
    const rows = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json(rows.results);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});
