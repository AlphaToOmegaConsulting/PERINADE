import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types.js";

export const productRoutes = new Hono<{ Bindings: Env }>();

productRoutes.get("/", async (c) => {
  try {
    const rows = await c.env.DB.prepare(
      "SELECT * FROM products ORDER BY id ASC"
    ).all();
    return c.json(rows.results);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});

const patchSchema = z.object({
  stock_qty: z.number().int().min(0).max(9999).optional(),
  prix_cents: z.number().int().min(0).max(999900).optional(),
  note: z.string().max(200).optional(),
}).refine(
  (d) => d.stock_qty !== undefined || d.prix_cents !== undefined,
  { message: "At least one of stock_qty or prix_cents is required" }
);

productRoutes.patch("/:id", zValidator("json", patchSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const now = new Date().toISOString();
  const db = c.env.DB;

  try {
    const product = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (!product) return c.json({ error: "Product not found" }, 404);

    if (data.stock_qty !== undefined) {
      const delta = data.stock_qty - (product.stock_qty as number);
      await db.batch([
        db.prepare(
          "UPDATE products SET stock_qty = ?, updated_at = ? WHERE id = ?"
        ).bind(data.stock_qty, now, id),
        db.prepare(
          `INSERT INTO stock_movements (id, product_id, type, qty_delta, reference_id, note, created_at)
           VALUES (?, ?, 'manual', ?, 'manual', ?, ?)`
        ).bind(crypto.randomUUID(), id, delta, data.note ?? null, now),
      ]);
    }

    if (data.prix_cents !== undefined) {
      await db.prepare(
        "UPDATE products SET prix_cents = ?, updated_at = ? WHERE id = ?"
      ).bind(data.prix_cents, now, id).run();
    }

    const updated = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    return c.json(updated);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});
