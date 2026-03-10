/**
 * Worker: stripe-webhook
 * Reçoit les événements Stripe, vérifie la signature, sauvegarde les commandes dans D1.
 *
 * Bindings requis :
 *   DB                   — D1 database (perinade-dev-db)
 *   STRIPE_WEBHOOK_SECRET — whsec_... (wrangler secret put)
 *   STRIPE_SECRET_KEY     — sk_live_... ou sk_test_... (wrangler secret put)
 *
 * URL à enregistrer dans Stripe Dashboard → Webhooks :
 *   https://perinade-dev-stripe-webhook.francoisfrance.workers.dev
 *
 * Événements à activer dans Stripe :
 *   checkout.session.completed
 */

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("stripe-webhook: missing stripe-signature header");
      return new Response("Bad Request", { status: 400 });
    }

    // Vérification de la signature Stripe (HMAC SHA-256)
    const isValid = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
    if (!isValid) {
      console.error("stripe-webhook: invalid signature");
      return new Response("Bad Request", { status: 400 });
    }

    let event;
    try {
      event = JSON.parse(body);
    } catch {
      console.error("stripe-webhook: invalid JSON body");
      return new Response("Bad Request", { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = crypto.randomUUID();

      // Récupérer les line_items depuis Stripe
      let items = "[]";
      try {
        const lineItemsRes = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${session.id}/line_items?limit=100`,
          {
            headers: {
              Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            },
          }
        );
        const lineItemsData = await lineItemsRes.json();
        items = JSON.stringify(lineItemsData.data ?? []);
      } catch {
        // On sauvegarde quand même la commande sans les items
      }

      await env.DB.prepare(
        `INSERT OR IGNORE INTO orders
         (id, stripe_session_id, status, customer_email, amount_total, currency, items)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          orderId,
          session.id,
          session.payment_status === "paid" ? "paid" : "pending",
          session.customer_details?.email ?? null,
          session.amount_total ?? 0,
          session.currency ?? "eur",
          items
        )
        .run();
    }

    return new Response("OK", { status: 200 });
  },
};

/**
 * Vérifie la signature Stripe sans SDK (compatible Workers).
 * https://stripe.com/docs/webhooks/signatures
 */
async function verifyStripeSignature(payload, sigHeader, secret) {
  const parts = sigHeader.split(",").reduce((acc, part) => {
    const [k, v] = part.split("=");
    acc[k] = v;
    return acc;
  }, {});

  const timestamp = parts["t"];
  const signature = parts["v1"];

  if (!timestamp || !signature) return false;

  // Tolérance de 5 minutes
  const tolerance = 5 * 60;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > tolerance) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedSig === signature;
}
