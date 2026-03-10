#!/usr/bin/env npx tsx
/**
 * Migration runner for Cloudflare D1 (local dev / CI).
 * Uses wrangler d1 execute for 001, PRAGMA guard for 002.
 *
 * Usage:
 *   CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx npx tsx scripts/migrate.ts
 *
 * For local wrangler dev (no API token needed):
 *   npx tsx scripts/migrate.ts --local
 */
import { execFileSync } from "node:child_process";

const isLocal = process.argv.includes("--local");
const DB_NAME = "perinade-dev-db";
const baseArgs = isLocal ? ["--local"] : [];

function wranglerExec(file: string) {
  console.log(`Applying ${file}...`);
  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", DB_NAME, `--file=${file}`, ...baseArgs],
    { stdio: "inherit" }
  );
}

// Migration 001 — idempotent (CREATE TABLE IF NOT EXISTS)
wranglerExec("infra/migrations/001_products.sql");

// Migration 002 — NOT idempotent: guard via pragma query
// Note: wrangler d1 execute --json may emit progress lines before the JSON
// on remote (non-local) mode. We extract the last line starting with '['.
console.log("Checking if migration 002 is needed...");
let rawOutput: string;
try {
  rawOutput = execFileSync(
    "npx",
    [
      "wrangler", "d1", "execute", DB_NAME,
      "--command", "PRAGMA table_info('orders');",
      "--json",
      ...baseArgs,
    ],
    { encoding: "utf8", stderr: "pipe" }
  );
} catch (err: unknown) {
  const spawnErr = err as { stderr?: Buffer | string; message?: string };
  console.error("PRAGMA query failed:", spawnErr.stderr?.toString() ?? spawnErr.message);
  process.exit(1);
}

// Find the JSON line in stdout (last line starting with '[')
const jsonLine = rawOutput
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.startsWith("["))
  .at(-1) ?? "[]";

if (jsonLine === "[]") {
  throw new Error("PRAGMA query returned no JSON output — aborting to avoid unsafe ALTERs");
}

const rows: Array<{ name: string }> = JSON.parse(jsonLine)?.[0]?.results ?? [];

// Each column checked independently — safe to re-run
const columnsToAdd: Array<{ name: string; sql: string }> = [
  { name: "items_processed", sql: "ALTER TABLE orders ADD COLUMN items_processed INTEGER DEFAULT 0" },
  { name: "payment_intent_id", sql: "ALTER TABLE orders ADD COLUMN payment_intent_id TEXT" },
];

for (const { name, sql } of columnsToAdd) {
  if (!rows.some((r) => r.name === name)) {
    console.log(`Migration 002: adding column ${name}...`);
    execFileSync(
      "npx",
      ["wrangler", "d1", "execute", DB_NAME, "--command", `${sql};`, ...baseArgs],
      { stdio: "inherit" }
    );
  } else {
    console.log(`Migration 002: column ${name} already exists, skipping.`);
  }
}

console.log("All migrations applied.");
