/**
 * Worker: stripe-webhook
 * Handles Stripe events, stores to D1, manages stock.
 *
 * Bindings required (wrangler.toml + wrangler secret put):
 *   DB                    — D1 perinade-dev-db
 *   STRIPE_WEBHOOK_SECRET — from Stripe Dashboard → Webhooks
 *   STRIPE_SECRET_KEY     — from Stripe Dashboard → API Keys
 *   RESEND_API_KEY        — for alert emails
 *
 * Env vars (wrangler.toml [vars]):
 *   CONTACT_EMAIL_TO      — email for admin alerts
 */

const TOLERANCE_SECONDS = 300; // 5 min

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // 1. Validate Stripe signature
    const payload = await request.text();
    const sig = request.headers.get("stripe-signature");
    let event;
    try {
      event = await verifyStripeSignature(payload, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Signature verification failed:", err.message);
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Log event (idempotence: INSERT OR IGNORE on stripe_event_id)
    const logId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT OR IGNORE INTO webhook_logs (id, event_type, stripe_event_id, payload, status, created_at)
       VALUES (?, ?, ?, ?, 'received', ?)`
    ).bind(logId, event.type, event.id, payload, new Date().toISOString()).run();

    // Check if already processed (INSERT OR IGNORE silently fails on duplicate)
    const existing = await env.DB.prepare(
      "SELECT status FROM webhook_logs WHERE stripe_event_id = ? AND status = 'processed'"
    ).bind(event.id).first();
    if (existing) {
      console.log(`Event ${event.id} already processed, skipping.`);
      return new Response("OK (duplicate)", { status: 200 });
    }

    // 3. Dispatch to handler
    let error = null;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(event.data.object, env, event.id);
          break;
        case "charge.refunded":
          await handleChargeRefunded(event.data.object, env);
          break;
        case "payment_intent.payment_failed":
          await handlePaymentFailed(event.data.object, env);
          break;
        case "charge.dispute.created":
          await handleDisputeCreated(event.data.object, env);
          break;
        case "payment_intent.canceled":
          await handlePaymentCanceled(event.data.object, env);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      error = err.message;
      console.error(`Handler error for ${event.type}:`, err);
    }

    // 4. Update webhook_log status
    await env.DB.prepare(
      "UPDATE webhook_logs SET status = ?, error = ? WHERE stripe_event_id = ?"
    ).bind(error ? "failed" : "processed", error ?? null, event.id).run();

    if (error) {
      return new Response("Internal error", { status: 500 });
    }
    return new Response("OK", { status: 200 });
  },
};

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session, env, eventId) {
  const sessionId = session.id;

  // Check idempotence on order
  const order = await env.DB.prepare(
    "SELECT id, items_processed FROM orders WHERE stripe_session_id = ?"
  ).bind(sessionId).first();

  if (!order) {
    // Fetch line items from Stripe API
    const items = await fetchLineItems(sessionId, env.STRIPE_SECRET_KEY);

    await env.DB.prepare(
      `INSERT OR IGNORE INTO orders
       (id, stripe_session_id, payment_intent_id, status, customer_email, amount_total, currency, items, items_processed, created_at)
       VALUES (?, ?, ?, 'paid', ?, ?, ?, ?, 0, ?)`
    ).bind(
      crypto.randomUUID(),
      sessionId,
      session.payment_intent ?? null,  // stored for charge.refunded lookup
      session.customer_details?.email ?? "",
      session.amount_total ?? 0,
      session.currency ?? "eur",
      JSON.stringify(items),
      new Date().toISOString()
    ).run();
  }

  // Re-fetch to get items_processed state
  const orderRow = await env.DB.prepare(
    "SELECT id, items, items_processed FROM orders WHERE stripe_session_id = ?"
  ).bind(sessionId).first();

  if (!orderRow || orderRow.items_processed === 1) {
    console.log(`Stock already decremented for session ${sessionId}`);
    return;
  }

  // Decrement stock per line item
  const items = JSON.parse(orderRow.items ?? "[]");
  for (const item of items) {
    const productId = item.price?.product ?? item.id;
    const qty = item.quantity ?? 1;

    // Decrement if product exists in our table (best-effort; max 0)
    await env.DB.prepare(
      "UPDATE products SET stock_qty = MAX(0, stock_qty - ?), updated_at = ? WHERE id = ?"
    ).bind(qty, new Date().toISOString(), productId).run();

    await env.DB.prepare(
      `INSERT INTO stock_movements (id, product_id, type, qty_delta, reference_id, created_at)
       VALUES (?, ?, 'order', ?, ?, ?)`
    ).bind(
      crypto.randomUUID(), productId, -qty, sessionId, new Date().toISOString()
    ).run();
  }

  // Mark order as processed + update audit log in same logical step
  await env.DB.prepare(
    "UPDATE orders SET items_processed = 1 WHERE stripe_session_id = ?"
  ).bind(sessionId).run();

  // Update webhook_log status here (after items_processed=1 is confirmed written)
  // This ensures the audit trail is consistent even if the outer status update fails.
  await env.DB.prepare(
    "UPDATE webhook_logs SET status = 'processed' WHERE stripe_event_id = ?"
  ).bind(eventId).run();

  console.log(`Checkout ${sessionId}: stock decremented for ${items.length} items`);
}

async function handleChargeRefunded(charge, env) {
  // charge.payment_intent (pi_xxx) is stored in orders.payment_intent_id
  // (added by migration 002 + stored in handleCheckoutCompleted)
  const order = await env.DB.prepare(
    "SELECT id, items FROM orders WHERE payment_intent_id = ?"
  ).bind(charge.payment_intent).first();

  if (order?.items) {
    const items = JSON.parse(order.items);
    for (const item of items) {
      const productId = item.price?.product ?? item.id;
      const qty = item.quantity ?? 1;

      await env.DB.prepare(
        "UPDATE products SET stock_qty = stock_qty + ?, updated_at = ? WHERE id = ?"
      ).bind(qty, new Date().toISOString(), productId).run();

      await env.DB.prepare(
        `INSERT INTO stock_movements (id, product_id, type, qty_delta, reference_id, note, created_at)
         VALUES (?, ?, 'refund', ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(), productId, qty,
        charge.id, "Remboursement Stripe", new Date().toISOString()
      ).run();
    }
  }

  await sendAlert(env, "Remboursement reçu",
    `Charge ${charge.id} remboursée. Montant: ${(charge.amount_refunded / 100).toFixed(2)}€`);
}

async function handlePaymentFailed(paymentIntent, env) {
  // payment_intent.payment_failed has no Checkout Session ID.
  // Use payment_intent_id column for correlation; stripe_session_id stays NULL.
  await env.DB.prepare(
    `INSERT OR IGNORE INTO orders
     (id, stripe_session_id, payment_intent_id, status, customer_email, amount_total, currency, items, items_processed, created_at)
     VALUES (?, NULL, ?, 'failed', ?, ?, ?, '[]', 0, ?)`
  ).bind(
    crypto.randomUUID(),
    paymentIntent.id,
    paymentIntent.receipt_email ?? "",
    paymentIntent.amount ?? 0,
    paymentIntent.currency ?? "eur",
    new Date().toISOString()
  ).run();
  console.log(`Payment failed: ${paymentIntent.id}`);
}

async function handleDisputeCreated(dispute, env) {
  await sendAlert(env, "⚠️ Litige Stripe créé",
    `Dispute ${dispute.id} pour ${(dispute.amount / 100).toFixed(2)}€. Raison: ${dispute.reason}`);
}

async function handlePaymentCanceled(paymentIntent, env) {
  // payment_intent_id stores pi_xxx — correct column for this lookup
  await env.DB.prepare(
    "UPDATE orders SET status = 'canceled' WHERE payment_intent_id = ?"
  ).bind(paymentIntent.id).run();
  console.log(`Payment canceled: ${paymentIntent.id}`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchLineItems(sessionId, stripeKey) {
  const resp = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items?limit=100`,
    { headers: { Authorization: `Bearer ${stripeKey}` } }
  );
  if (!resp.ok) throw new Error(`Stripe line_items fetch failed: ${resp.status}`);
  const data = await resp.json();
  return data.data ?? [];
}

async function sendAlert(env, subject, body) {
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL_TO) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: env.CONTACT_EMAIL_TO,
      subject: `[Périnade Admin] ${subject}`,
      text: body,
    }),
  });
}

async function verifyStripeSignature(payload, sigHeader, secret) {
  if (!sigHeader) throw new Error("Missing stripe-signature");
  const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
  const timestamp = parts.t;
  if (!timestamp) throw new Error("Missing timestamp in signature");
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) {
    throw new Error("Timestamp too old");
  }
  const signed = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signed));
  const computed = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const expected = parts.v1;
  if (computed !== expected) throw new Error("Signature mismatch");
  return JSON.parse(payload);
}
