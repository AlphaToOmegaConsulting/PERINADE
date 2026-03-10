import type { D1Database, KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STRIPE_SECRET_KEY: string;
  CF_ACCESS_TEAM: string;
  CF_ACCESS_AUD: string;  // Application Audience tag from CF Access dashboard
  // ⚠️ TODO-BEFORE-DEPLOY: must be "false" (or absent) in production wrangler.toml
  DEV_BYPASS_AUTH?: string;
}
