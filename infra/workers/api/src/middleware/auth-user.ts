import type { MiddlewareHandler } from "hono";
import type { Env } from "../types.js";

// Hono context variables set by this middleware
export type UserVariables = {
  userId: string;
  userEmail: string;
};

const SUPABASE_JWKS_URL =
  "https://ieuaozyzffcmmrgigivc.supabase.co/auth/v1/.well-known/jwks.json";

// Module-level cache: a single Promise so concurrent requests share the same fetch
let jwksCache: Promise<CryptoKey[]> | null = null;

function base64urlToUint8Array(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

interface EcJwk {
  kty: string;
  crv: string;
  x: string;
  y: string;
  kid: string;
  alg: string;
  use: string;
}

async function fetchJwks(): Promise<CryptoKey[]> {
  const res = await fetch(SUPABASE_JWKS_URL);
  if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
  const data: { keys: EcJwk[] } = await res.json();

  return Promise.all(
    data.keys
      .filter((k) => k.kty === "EC" && k.crv === "P-256")
      .map((jwk) =>
        crypto.subtle.importKey(
          "jwk",
          jwk,
          { name: "ECDSA", namedCurve: "P-256" },
          false,
          ["verify"]
        )
      )
  );
}

function getJwks(): Promise<CryptoKey[]> {
  if (!jwksCache) {
    jwksCache = fetchJwks().catch((err) => {
      // Clear cache on failure so next request retries
      jwksCache = null;
      throw err;
    });
  }
  return jwksCache;
}

// Exported for testing — resets the module-level cache
export function resetJwksCache(): void {
  jwksCache = null;
}

// Exported for testing — injects a pre-resolved cache
export function setJwksCache(keys: CryptoKey[]): void {
  jwksCache = Promise.resolve(keys);
}

export const supabaseUserAuth: MiddlewareHandler<{
  Bindings: Env;
  Variables: UserVariables;
}> = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  const parts = token.split(".");
  if (parts.length !== 3) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const [headerB64, payloadB64, sigB64] = parts;

  let header: { kid?: string; alg?: string };
  let payload: { sub?: string; email?: string; exp?: number };
  try {
    header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
    payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    );
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Validate expiry
  if (!payload.exp || payload.exp < Date.now() / 1000) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Require sub claim
  if (!payload.sub) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let keys: CryptoKey[];
  try {
    keys = await getJwks();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Try each key — we don't have kid-per-key mapping from the cache, so we
  // try all and accept if any verifies. If header.kid is present, prefer matching.
  const signatureBytes = base64urlToUint8Array(sigB64);
  const dataBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  let verified = false;
  for (const key of keys) {
    try {
      const ok = await crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        key,
        signatureBytes,
        dataBytes
      );
      if (ok) {
        verified = true;
        break;
      }
    } catch {
      // key mismatch / wrong curve — continue
    }
  }

  if (!verified) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userId", payload.sub);
  c.set("userEmail", payload.email ?? "");
  await next();
};
