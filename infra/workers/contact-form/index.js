/**
 * Worker: contact-form
 * Reçoit les soumissions du formulaire de contact, sauvegarde dans D1, envoie un email via Resend.
 *
 * Bindings requis :
 *   DB               — D1 database (perinade-dev-db)
 *   CACHE            — KV namespace (perinade-dev-kv) — rate limiting
 *   RESEND_API_KEY   — re_... (wrangler secret put)
 *   CONTACT_EMAIL_TO — adresse email de destination (ex: contact@perinade.fr)
 *
 * Variables (wrangler.toml [vars]) :
 *   ALLOWED_ORIGINS  — origines autorisées séparées par virgule
 *
 * Route : POST /api/contact
 *
 * Payload JSON attendu :
 *   { firstName, lastName, email, phone, subject, message }
 */

// Seuils de validation
const MAX_BODY_BYTES = 16_384; // 16 KB
const RATE_LIMIT_MAX = 5;       // requêtes max
const RATE_LIMIT_TTL = 900;     // 15 minutes (secondes)
const FIELD_LIMITS = {
  firstName: 100,
  lastName: 100,
  phone: 30,
  subject: 200,
  message: 4000,
};

export default {
  async fetch(request, env) {
    // Vérification de l'origine (CORS)
    const origin = request.headers.get("Origin") ?? "";
    const allowedOrigins = (env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    const originAllowed = allowedOrigins.length === 0 || allowedOrigins.includes(origin);

    const corsHeaders = {
      "Access-Control-Allow-Origin": originAllowed ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Preflight CORS
    if (request.method === "OPTIONS") {
      if (!originAllowed) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!originAllowed) {
      return new Response("Forbidden", { status: 403 });
    }

    if (request.method !== "POST") {
      return json({ error: "Method Not Allowed" }, 405, corsHeaders);
    }

    // Limite de taille du body
    const contentLength = parseInt(request.headers.get("Content-Length") ?? "0", 10);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: "Payload Too Large" }, 413, corsHeaders);
    }

    // Rate limiting par IP via KV
    if (env.CACHE) {
      const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
      const kvKey = `rate:contact:${ip}`;
      const current = parseInt((await env.CACHE.get(kvKey)) ?? "0", 10);
      if (current >= RATE_LIMIT_MAX) {
        return json({ error: "Too Many Requests" }, 429, {
          ...corsHeaders,
          "Retry-After": String(RATE_LIMIT_TTL),
        });
      }
      // Incrémenter le compteur (TTL remis à chaque requête pour simplifier)
      await env.CACHE.put(kvKey, String(current + 1), { expirationTtl: RATE_LIMIT_TTL });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, corsHeaders);
    }

    const { firstName, lastName, email, phone, subject, message } = payload;

    // Validation présence
    if (!email || !message) {
      return json({ error: "email and message are required" }, 422, corsHeaders);
    }

    // Validation format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email format" }, 422, corsHeaders);
    }

    // Validation longueurs des champs
    const fieldErrors = [];
    for (const [field, max] of Object.entries(FIELD_LIMITS)) {
      const value = payload[field];
      if (typeof value === "string" && value.length > max) {
        fieldErrors.push(`${field} exceeds ${max} characters`);
      }
    }
    if (fieldErrors.length > 0) {
      return json({ error: fieldErrors.join(", ") }, 422, corsHeaders);
    }

    const id = crypto.randomUUID();

    // 1. Sauvegarde dans D1
    try {
      await env.DB.prepare(
        `INSERT INTO contact_submissions (id, first_name, last_name, email, phone, subject, message)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(id, firstName ?? null, lastName ?? null, email, phone ?? null, subject ?? null, message)
        .run();
    } catch (err) {
      console.error("D1 insert error:", err);
      // On continue quand même pour envoyer l'email
    }

    // 2. Envoi email via Resend
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Périnade Contact <onboarding@resend.dev>", // TODO: changer en contact@perinade.fr après vérification du domaine sur resend.com
          to: [env.CONTACT_EMAIL_TO],
          reply_to: email,
          subject: subject ? `[Contact] ${subject}` : `[Contact] Nouveau message de ${firstName} ${lastName}`,
          html: `
            <h2>Nouveau message depuis perinade.fr</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td style="padding:8px;font-weight:bold">Prénom</td><td style="padding:8px">${escapeHtml(firstName ?? "")}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Nom</td><td style="padding:8px">${escapeHtml(lastName ?? "")}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding:8px;font-weight:bold">Téléphone</td><td style="padding:8px">${escapeHtml(phone ?? "—")}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Sujet</td><td style="padding:8px">${escapeHtml(subject ?? "—")}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${escapeHtml(message).replace(/\n/g, "<br>")}</td></tr>
            </table>
            <p style="color:#888;font-size:12px">Référence : ${id}</p>
          `,
        }),
      });

      if (!emailRes.ok) {
        const errBody = await emailRes.text();
        console.error("Resend error:", errBody);
      }
    } catch (err) {
      console.error("Resend fetch error:", err);
      // On retourne quand même success si D1 a bien reçu le message
    }

    return json({ success: true, id }, 200, corsHeaders);
  },
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...extraHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
