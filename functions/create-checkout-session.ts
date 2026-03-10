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

  // Stock check — optimistic strategy (see spec for race condition handling)
  // DB binding is available via context.env.DB (Cloudflare Pages Functions)
  if (context.env.DB) {
    try {
      for (const item of items) {
        const row = await context.env.DB.prepare(
          "SELECT stock_qty FROM products WHERE id = ?"
        ).bind(item.id).first<{ stock_qty: number }>();

        if (!row || row.stock_qty < item.qty) {
          return json({ error: `Stock insuffisant pour ${item.name}` }, 409);
        }
      }
    } catch {
      // D1 unavailable — fail open to avoid blocking checkout
      console.error("Stock check failed, proceeding without check");
    }
  }
  // If DB is not bound (dev without D1), skip check

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

    if (!session.url) return json({ error: "Missing session URL" }, 500);

    return json({ url: session.url });
  } catch {
    return json({ error: "Failed to create checkout session" }, 500);
  }
};
