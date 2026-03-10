import type { KVNamespace } from "@cloudflare/workers-types";

export interface JwkKey {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
}

const CACHE_KEY = "cf_access_jwks";
const CACHE_TTL = 3600; // 1 hour
const FETCH_TIMEOUT = 3000;

export async function getJwks(teamName: string, kv: KVNamespace): Promise<JwkKey[]> {
  // 1. Try KV cache
  const cached = await kv.get<{ keys: JwkKey[] }>(CACHE_KEY, "json");
  if (cached?.keys) return cached.keys;

  // 2. Fetch with timeout
  const certsUrl = `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/certs`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  let jwks: { keys: JwkKey[] };
  try {
    const res = await fetch(certsUrl, { signal: controller.signal });
    if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
    jwks = await res.json();
  } catch (err) {
    throw new Error(`CF Access JWKS unavailable: ${(err as Error).message}`);
  } finally {
    clearTimeout(timer);
  }

  // 3. Cache result
  await kv.put(CACHE_KEY, JSON.stringify(jwks), { expirationTtl: CACHE_TTL });
  return jwks.keys;
}

export async function verifyJwt(
  token: string,
  keys: JwkKey[]
): Promise<{ email: string } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;

  let header: { kid: string; alg: string };
  let payload: { exp: number; email?: string };
  try {
    header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
    payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }

  if (payload.exp < Date.now() / 1000) return null;

  const key = keys.find((k) => k.kid === header.kid);
  if (!key) return null;

  const cryptoKey = await crypto.subtle.importKey(
    "jwk", key,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["verify"]
  );

  function base64urlDecode(s: string): Uint8Array {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }

  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5", cryptoKey,
    base64urlDecode(sigB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );

  return valid ? { email: payload.email ?? "unknown" } : null;
}
