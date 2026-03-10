import { Hono } from "hono";
import type { Env } from "../types.js";

export const dashboardRoutes = new Hono<{ Bindings: Env }>();

dashboardRoutes.get("/", async (c) => {
  const db = c.env.DB;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    const [revenueToday, revenueMonth, ordersToday, ordersMonth, pending, stockAlerts] =
      await Promise.all([
        db.prepare("SELECT COALESCE(SUM(amount_total),0) as v FROM orders WHERE status='paid' AND created_at >= ?").bind(todayStart).first<{ v: number }>(),
        db.prepare("SELECT COALESCE(SUM(amount_total),0) as v FROM orders WHERE status='paid' AND created_at >= ?").bind(monthStart).first<{ v: number }>(),
        db.prepare("SELECT COUNT(*) as v FROM orders WHERE created_at >= ?").bind(todayStart).first<{ v: number }>(),
        db.prepare("SELECT COUNT(*) as v FROM orders WHERE created_at >= ?").bind(monthStart).first<{ v: number }>(),
        db.prepare("SELECT COUNT(*) as v FROM orders WHERE status='pending'").first<{ v: number }>(),
        db.prepare("SELECT id, name_fr, stock_qty FROM products WHERE stock_qty < 5 ORDER BY stock_qty ASC").all<{ id: string; name_fr: string; stock_qty: number }>(),
      ]);

    return c.json({
      revenue: {
        today_cents: revenueToday?.v ?? 0,
        this_month_cents: revenueMonth?.v ?? 0,
      },
      orders: {
        today: ordersToday?.v ?? 0,
        this_month: ordersMonth?.v ?? 0,
        pending: pending?.v ?? 0,
      },
      stock_alerts: stockAlerts.results ?? [],
    });
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
});
