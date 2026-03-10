import Stripe from "stripe";
import type { D1Database } from "@cloudflare/workers-types";

interface Env {
  STRIPE_SECRET_KEY?: string;
  SITE_BASE_URL?: string;
  DB?: D1Database; // D1 binding — optional for backwards compat in local dev
}

interface CartItem {
  id: string;
  name: string;
  description: string;
  unitAmount: number;
  qty: number;
}

type Locale = "fr" | "en" | "es";

const CART_ROUTES: Record<Locale, string> = {
  fr: "/panier",
  en: "/en/cart",
  es: "/es/carrito",
};

const CONFIRMATION_ROUTES: Record<Locale, string> = {
  fr: "/confirmation",
  en: "/en/confirmation",
  es: "/es/confirmacion",
};

interface RequestBody {
  items?: unknown;
  locale?: unknown;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });

const normalizeBaseUrl = (value: string | undefined): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.origin;
  } catch {
    return null;
  }
};

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    typeof item.description === "string" &&
    item.description.trim().length > 0 &&
    Number.isFinite(item.unitAmount) &&
    Number(item.unitAmount) > 0 &&
    Number.isInteger(item.qty) &&
    Number(item.qty) > 0
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const secretKey = context.env.STRIPE_SECRET_KEY;
  if (!secretKey) return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);
  const siteBaseUrl = normalizeBaseUrl(context.env.SITE_BASE_URL);
  if (!siteBaseUrl) return json({ error: "Missing or invalid SITE_BASE_URL" }, 500);

  let body: RequestBody;
  try {
    body = (await context.request.json()) as RequestBody;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!Array.isArray(body.items)) return json({ error: "Invalid payload" }, 400);

  const items = body.items.filter(isCartItem);
  if (items.length === 0 || items.length !== body.items.length) {
    return json({ error: "Invalid payload" }, 400);
  }

  const locale: Locale =
    body.locale === "en" || body.locale === "es" ? body.locale : "fr";

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  // Optimistic stock decrement — atomic UPDATE avoids TOCTOU race condition.
  // Each UPDATE only succeeds if stock_qty >= qty; changes === 0 means insufficient stock.
  // On Stripe failure the decrements are rolled back.
  const decremented: Array<{ id: string; qty: number }> = [];
  if (context.env.DB) {
    try {
      for (const item of items) {
        const result = await context.env.DB.prepare(
          "UPDATE products SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?"
        ).bind(item.qty, item.id, item.qty).run();

        if (result.meta.changes === 0) {
          // Roll back already-decremented items
          if (decremented.length > 0) {
            const rollbacks = decremented.map(({ id, qty }) =>
              context.env.DB!.prepare(
                "UPDATE products SET stock_qty = stock_qty + ? WHERE id = ?"
              ).bind(qty, id)
            );
            await context.env.DB.batch(rollbacks);
          }
          return json({ error: `Stock insuffisant pour ${item.name}` }, 409);
        }
        decremented.push({ id: item.id, qty: item.qty });
      }
    } catch {
      // D1 unavailable — fail open to avoid blocking checkout
      console.error("Stock check failed, proceeding without check");
    }
  }
  // If DB is not bound (dev without D1), skip stock check

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteBaseUrl}${CONFIRMATION_ROUTES[locale]}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteBaseUrl}${CART_ROUTES[locale]}`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description.trim(),
          },
          unit_amount: item.unitAmount,
        },
        quantity: item.qty,
      })),
    });

    if (!session.url) {
      // Stripe session created but no URL — roll back decrements
      if (context.env.DB && decremented.length > 0) {
        const rollbacks = decremented.map(({ id, qty }) =>
          context.env.DB!.prepare(
            "UPDATE products SET stock_qty = stock_qty + ? WHERE id = ?"
          ).bind(qty, id)
        );
        await context.env.DB.batch(rollbacks);
      }
      return json({ error: "Missing session URL" }, 500);
    }

    return json({ url: session.url });
  } catch {
    // Stripe failed — roll back stock decrements
    if (context.env.DB && decremented.length > 0) {
      try {
        const rollbacks = decremented.map(({ id, qty }) =>
          context.env.DB!.prepare(
            "UPDATE products SET stock_qty = stock_qty + ? WHERE id = ?"
          ).bind(qty, id)
        );
        await context.env.DB.batch(rollbacks);
      } catch {
        console.error("Stock rollback failed after Stripe error");
      }
    }
    return json({ error: "Failed to create checkout session" }, 500);
  }
};
