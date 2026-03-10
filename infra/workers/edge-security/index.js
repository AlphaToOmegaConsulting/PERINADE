/**
 * Worker: edge-security
 * Injecte les headers de sécurité sur toutes les réponses du site.
 *
 * CSP notes :
 * - script-src : 'unsafe-inline' conservé pour compatibilité avec les scripts inline
 *   générés par Astro en mode statique (hydratation Islands). À remplacer par une
 *   solution nonce/hash si le site passe en mode SSR.
 * - style-src : 'unsafe-inline' supprimé — les styles inline Astro utilisent des
 *   attributs style sur des éléments, couverts par 'self' + la directive style-src-attr.
 */
export default {
  async fetch(request, env, ctx) {
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);

    newHeaders.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://js.stripe.com",
        "style-src 'self'",
        "style-src-attr 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.stripe.com",
        "frame-src https://js.stripe.com https://hooks.stripe.com",
        "font-src 'self'",
      ].join("; ")
    );
    newHeaders.set("X-Frame-Options", "DENY");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
