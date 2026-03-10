/**
 * Worker: api
 * REST API pour le panier Stripe et les commandes (D1)
 * Routes : GET/POST /api/cart, POST /api/orders, GET /api/orders/:id
 *
 * ⚠️  WARNING — STUB SANS AUTHENTIFICATION
 * Ce Worker est un placeholder. Avant toute implémentation réelle :
 *
 * 1. AUTHENTIFICATION REQUISE — Toutes les routes doivent vérifier un token
 *    valide (ex: JWT signé, session Cloudflare Access, ou clé API secrète).
 *    Ne jamais exposer /api/orders sans auth — les données de commande sont sensibles.
 *
 * 2. AUTORISATION — Les routes GET /api/orders/:id doivent vérifier que
 *    l'utilisateur authentifié est bien le propriétaire de la commande.
 *
 * 3. VALIDATION — Valider et sanitiser tous les inputs avant insertion D1
 *    (cf. pattern dans contact-form/index.js).
 *
 * 4. RATE LIMITING — Appliquer un rate limit via KV (cf. contact-form)
 *    avant d'implémenter les routes de commande.
 *
 * TODO: remplacer ce placeholder par l'implémentation réelle
 */
export default {
  async fetch(request, env) {
    return new Response("api placeholder", { status: 200 });
  },
};
