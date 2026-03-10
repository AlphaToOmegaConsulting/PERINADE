import type { MiddlewareHandler } from "hono";
import type { Env } from "../types.js";

// Hono context variables set by this middleware
export type UserVariables = {
  userId: string;
  userEmail: string;
};

// Module-level cache keyed by SUPABASE_URL.
// Each entry holds the shared Promise and the time it was fetched (for TTL).
const jwksCache = new Map<
  string,
  { promise: Promise<{ kid: string; key: CryptoKey }[]>; fetchedAt: number }
>();

const JWKS_TTL_MS = 3_600_000; // 1 hour

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

async function fetchJwks(
  jwksUrl: string
): Promise<{ kid: string; key: CryptoKey }[]> {
  const res = await fetch(jwksUrl);
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

function getJwks(
  baseUrl: string
): Promise<{ kid: string; key: CryptoKey }[]> {
  const jwksUrl = `${baseUrl}/auth/v1/.well-known/jwks.json`;
  const cached = jwksCache.get(baseUrl);

  // Evict stale entry (TTL exceeded)
  if (cached && Date.now() - cached.fetchedAt > JWKS_TTL_MS) {
    jwksCache.delete(baseUrl);
  }

  if (!jwksCache.has(baseUrl)) {
    const fetchedAt = Date.now();
    const promise = fetchJwks(jwksUrl).catch((err) => {
      // Clear cache on failure so next request retries
      jwksCache.delete(baseUrl);
      throw err;
    });
    jwksCache.set(baseUrl, { promise, fetchedAt });
  }

  return jwksCache.get(baseUrl)!.promise;
}

// Exported for testing — resets the module-level cache
export function resetJwksCache(): void {
  jwksCache.clear();
}

// Exported for testing — injects a pre-resolved cache entry for a given URL
export function setJwksCache(
  entries: { kid: string; key: CryptoKey }[],
  baseUrl = "https://test.supabase.co"
): void {
  jwksCache.set(baseUrl, {
    promise: Promise.resolve(entries),
    fetchedAt: Date.now(),
  });
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
  let payload: {
    sub?: string;
    email?: string;
    exp?: number;
    iss?: string;
    aud?: string;
  };
  try {
    header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
    payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    );
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Fix 3: validate alg claim before any key lookup
  if (header.alg !== "ES256") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let entries: { kid: string; key: CryptoKey }[];
  try {
    entries = await getJwks(c.env.SUPABASE_URL);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Prefer the key whose kid matches the token header's kid,
  // then fall back to trying all keys if no match found.
  const signatureBytes = base64urlToUint8Array(sigB64);
  const dataBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

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

  // Validate claims AFTER signature verification
  if (!payload.exp || payload.exp < Date.now() / 1000) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Require sub claim
  if (!payload.sub) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Fix 4: validate iss and aud claims
  const expectedIss = `${c.env.SUPABASE_URL}/auth/v1`;
  if (payload.iss !== expectedIss || payload.aud !== "authenticated") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userId", payload.sub);
  c.set("userEmail", payload.email ?? "");
  await next();
};
