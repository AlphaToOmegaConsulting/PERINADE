import type { D1Database, KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STRIPE_SECRET_KEY: string;
  CF_ACCESS_TEAM: string;
}
