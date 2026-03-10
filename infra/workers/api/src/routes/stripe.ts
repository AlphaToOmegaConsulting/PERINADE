import { Hono } from "hono";
import type { Env } from "../types.js";

export const stripeRoutes = new Hono<{ Bindings: Env }>();

stripeRoutes.get("/balance", async (c) => {
  const res = await fetch("https://api.stripe.com/v1/balance", {
    headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return c.json({ error: "Stripe API error" }, 502);
  return c.json(await res.json());
});

stripeRoutes.get("/events", async (c) => {
  const res = await fetch("https://api.stripe.com/v1/events?limit=50", {
    headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return c.json({ error: "Stripe API error" }, 502);
  return c.json(await res.json());
});

stripeRoutes.get("/reconcile", async (c) => {
  // Fetch D1 paid orders (last 30 days)
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  type D1Order = { stripe_session_id: string; status: string; amount_total: number };
  let d1Orders: { results: D1Order[] };
  try {
    d1Orders = await c.env.DB.prepare(
      "SELECT stripe_session_id, status, amount_total FROM orders WHERE created_at >= ?"
    ).bind(since).all<D1Order>();
  } catch {
    return c.json({ error: "Database error" }, 500);
  }

  // NOTE: Stripe API caps a single page at 100 results.
  // Reconciliation covers at most 100 Stripe sessions; pagination not implemented.
  // For high-volume periods, divergences beyond the first 100 sessions may be missed.
  const sinceSec = Math.floor(Date.now() / 1000 - 30 * 24 * 3600);
  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions?limit=100&created[gte]=${sinceSec}`,
    { headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` } }
  );
  if (!stripeRes.ok) return c.json({ error: "Stripe API error" }, 502);
  const stripeData: { data: Array<{ id: string; payment_status: string; amount_total: number }> } = await stripeRes.json();

  // Build maps — both keyed on stripe_session_id (cs_xxx)
  const d1Map = new Map(d1Orders.results.map((o) => [o.stripe_session_id, o]));
  const stripeMap = new Map(stripeData.data.map((s) => [s.id, s]));

  // Union of all keys
  const allKeys = new Set([...d1Map.keys(), ...stripeMap.keys()]);

  const items = Array.from(allKeys).map((key) => {
    const d1 = d1Map.get(key) ?? null;
    const stripe = stripeMap.get(key) ?? null;
    const amountMatch = d1 !== null && stripe !== null && d1.amount_total === stripe.amount_total;
    const statusMatch = !d1 || !stripe ? false :
      (d1.status === "paid" && stripe.payment_status === "paid") ||
      (d1.status === "failed" && stripe.payment_status === "unpaid");
    return {
      stripe_session_id: key,
      d1_status: d1?.status ?? null,
      stripe_status: stripe?.payment_status ?? null,
      d1_amount_cents: d1?.amount_total ?? null,
      stripe_amount_cents: stripe?.amount_total ?? null,
      amount_match: amountMatch,
      status_match: statusMatch,
      divergent: !amountMatch || !statusMatch,
    };
  });

  return c.json({
    summary: {
      total_d1: d1Map.size,
      total_stripe: stripeMap.size,
      divergences: items.filter((i) => i.divergent).length,
    },
    items,
  });
});

stripeRoutes.post("/sync/:orderId", async (c) => {
  const orderId = c.req.param("orderId");
  let order: { stripe_session_id: string } | null;
  try {
    order = await c.env.DB.prepare(
      "SELECT * FROM orders WHERE id = ? OR stripe_session_id = ?"
    ).bind(orderId, orderId).first<{ stripe_session_id: string }>();
  } catch {
    return c.json({ error: "Database error" }, 500);
  }
  if (!order) return c.json({ error: "Order not found" }, 404);

  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${order.stripe_session_id}`,
    { headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}` } }
  );
  if (!res.ok) return c.json({ error: "Stripe API error" }, 502);
  const session: { payment_status: string; amount_total: number } = await res.json();

  const newStatus =
    session.payment_status === "paid" ? "paid" :
    session.payment_status === "unpaid" ? "failed" :
    "pending"; // no_payment_required or unknown
  try {
    await c.env.DB.prepare(
      "UPDATE orders SET status = ?, amount_total = ? WHERE stripe_session_id = ?"
    ).bind(newStatus, session.amount_total, order.stripe_session_id).run();
  } catch {
    return c.json({ error: "Database error" }, 500);
  }

  return c.json({ synced: true, new_status: newStatus });
});
