import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY?: string;
  SITE_BASE_URL?: string;
}

interface CartItem {
  id: string;
  name: string;
  description: string;
  unitAmount: number;
  qty: number;
}

interface RequestBody {
  items?: unknown;
  successUrl?: unknown;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });

const ALLOWED_SUCCESS_PATHS = {
  fr: "/confirmation",
  en: "/en/confirmation",
  es: "/es/confirmacion",
} as const;

const ALLOWED_SUCCESS_PATH_VALUES: string[] = Object.values(ALLOWED_SUCCESS_PATHS);

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

  // Resolve locale-specific success URL sent by the cart page.
  // Allowed values keep Stripe redirecting to pages we control.
  const rawSuccessUrl = body.successUrl;
  let successPath: string = ALLOWED_SUCCESS_PATHS.fr;
  if (typeof rawSuccessUrl === "string" && rawSuccessUrl.startsWith(siteBaseUrl)) {
    const pathname = new URL(rawSuccessUrl).pathname;
    if (ALLOWED_SUCCESS_PATH_VALUES.includes(pathname)) {
      successPath = pathname;
    }
  }

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteBaseUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteBaseUrl}/panier`,
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
