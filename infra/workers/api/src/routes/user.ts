import { Hono } from "hono";
import type { Env } from "../types.js";
import { supabaseUserAuth, type UserVariables } from "../middleware/auth-user.js";

export const userRoutes = new Hono<{
  Bindings: Env;
  Variables: UserVariables;
}>();

// Apply auth middleware to all user routes
userRoutes.use("*", supabaseUserAuth);

/**
 * GET /api/user/me
 * Returns the authenticated user's profile with aggregate D1 order stats.
 */
userRoutes.get("/me", async (c) => {
  const userId = c.var.userId;
  const email = c.var.userEmail;

  try {
    const row = await c.env.DB.prepare(
      "SELECT COUNT(*) as order_count, SUM(amount_total) as total_spent FROM orders WHERE supabase_user_id = ?"
    )
      .bind(userId)
      .first<{ order_count: number; total_spent: number | null }>();

    return c.json({
      userId,
      email,
      orderCount: row?.order_count ?? 0,
      totalSpentCents: row?.total_spent ?? 0,
    });
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});

/**
 * GET /api/user/orders
 * Returns the authenticated user's orders from D1, newest first.
 */
userRoutes.get("/orders", async (c) => {
  const userId = c.var.userId;

  try {
    const result = await c.env.DB.prepare(
      "SELECT id, stripe_session_id, status, amount_total, currency, line_items, created_at FROM orders WHERE supabase_user_id = ? ORDER BY created_at DESC LIMIT 50"
    )
      .bind(userId)
      .all<{
        id: string;
        stripe_session_id: string;
        status: string;
        amount_total: number;
        currency: string;
        line_items: string;
        created_at: string;
      }>();

    const orders = (result.results ?? []).map((row) => ({
      ...row,
      line_items: (() => {
        try {
          return JSON.parse(row.line_items);
        } catch {
          return row.line_items;
        }
      })(),
    }));

    return c.json(orders);
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});
