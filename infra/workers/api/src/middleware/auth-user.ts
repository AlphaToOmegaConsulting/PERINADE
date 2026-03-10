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
// Fix 1: cache now preserves the kid ↔ CryptoKey association
let jwksCache: Promise<{ kid: string; key: CryptoKey }[]> | null = null;

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

// Fix 1: fetchJwks returns { kid, key }[] instead of CryptoKey[]
async function fetchJwks(): Promise<{ kid: string; key: CryptoKey }[]> {
  const res = await fetch(SUPABASE_JWKS_URL);
  if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
  const data: { keys: EcJwk[] } = await res.json();

  const filtered = data.keys.filter(
    (k) => k.kty === "EC" && k.crv === "P-256"
  );

  return Promise.all(
    filtered.map(async (jwk) => {
      const key = await crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["verify"]
      );
      return { kid: jwk.kid, key };
    })
  );
}

// Fix 1: getJwks returns { kid, key }[]
function getJwks(): Promise<{ kid: string; key: CryptoKey }[]> {
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
// Fix 1: updated signature to accept { kid, key }[]
export function setJwksCache(entries: { kid: string; key: CryptoKey }[]): void {
  jwksCache = Promise.resolve(entries);
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

  // Fix 2: decode header + payload first, then verify signature, then validate claims
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

  let entries: { kid: string; key: CryptoKey }[];
  try {
    entries = await getJwks();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Fix 1: prefer the key whose kid matches the token header's kid,
  // then fall back to trying all keys if no match found.
  const signatureBytes = base64urlToUint8Array(sigB64);
  const dataBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  // Build the ordered list of keys to try: matching kid first, then the rest
  const tokenKid = header.kid;
  const ordered =
    tokenKid !== undefined
      ? [
          ...entries.filter((e) => e.kid === tokenKid),
          ...entries.filter((e) => e.kid !== tokenKid),
        ]
      : entries;

  let verified = false;
  for (const { key } of ordered) {
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

  // Fix 2: validate claims AFTER signature verification
  if (!payload.exp || payload.exp < Date.now() / 1000) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Require sub claim
  if (!payload.sub) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userId", payload.sub);
  c.set("userEmail", payload.email ?? "");
  await next();
};
