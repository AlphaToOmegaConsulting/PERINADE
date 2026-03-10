import type { D1Database, KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STRIPE_SECRET_KEY: string;
  CF_ACCESS_TEAM: string;
  CF_ACCESS_AUD: string;  // Application Audience tag from CF Access dashboard
  DEV_BYPASS_AUTH?: string; // Set in .dev.vars only — never in wrangler.toml
  SUPABASE_URL: string;
}
