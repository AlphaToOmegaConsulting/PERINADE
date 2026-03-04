import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY?: string;
}

interface CartItem {
  id: string;
  name: string;
  unitAmount: number;
  qty: number;
}

interface RequestBody {
  items?: unknown;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    Number.isFinite(item.unitAmount) &&
    Number(item.unitAmount) > 0 &&
    Number.isInteger(item.qty) &&
    Number(item.qty) > 0
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const secretKey = context.env.STRIPE_SECRET_KEY;
  if (!secretKey) return json({ error: "Missing STRIPE_SECRET_KEY" }, 500);

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

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: "https://www.perinade.fr/confirmation",
      cancel_url: "https://www.perinade.fr/panier",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
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
