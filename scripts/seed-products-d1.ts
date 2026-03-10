#!/usr/bin/env npx tsx
/**
 * Seed D1 products table from src/content/vins/*.fr.yaml
 * Also reads *.en.yaml and *.es.yaml for translated names.
 *
 * Each INSERT is written to a temp .sql file and passed via --file to avoid
 * shell-escaping issues with product names containing special characters.
 *
 * Usage:
 *   CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx npx tsx scripts/seed-products-d1.ts
 * Local:
 *   npx tsx scripts/seed-products-d1.ts --local
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { parse as parseYaml } from "yaml";
import { tmpdir } from "node:os";

const isLocal = process.argv.includes("--local");
const DB_NAME = "perinade-dev-db";
const VINS_DIR = join(process.cwd(), "src/content/vins");
const baseArgs = isLocal ? ["--local"] : [];

interface VinYaml {
  nom?: string;
  prix: number;         // EUR (float)
  stock: string;        // "En stock" | "Stock limité" | "Rupture de stock"
}

function stockStatus(stock: string): string {
  if (stock === "Rupture de stock") return "rupture";
  if (stock === "Stock limité") return "limite";
  return "en_stock";
}

function readVin(slug: string, locale: string): VinYaml | null {
  const path = join(VINS_DIR, `${slug}.${locale}.yaml`);
  try {
    return parseYaml(readFileSync(path, "utf8")) as VinYaml;
  } catch {
    return null;
  }
}

// Escape single quotes for SQL string literals
function sqlStr(s: string): string {
  return s.replace(/'/g, "''");
}

if (!existsSync(VINS_DIR)) {
  console.error(`ERROR: VINS_DIR not found: ${VINS_DIR}`);
  console.error("Run this script from the project root.");
  process.exit(1);
}

// Collect all slugs from .fr.yaml files
const slugs = readdirSync(VINS_DIR)
  .filter((f) => f.endsWith(".fr.yaml"))
  .map((f) => f.replace(".fr.yaml", ""));

console.log(`Found ${slugs.length} products to seed...`);

for (const slug of slugs) {
  const fr = readVin(slug, "fr");
  const en = readVin(slug, "en");
  const es = readVin(slug, "es");

  if (!fr) {
    console.warn(`Skipping ${slug}: no fr.yaml found`);
    continue;
  }

  const prixCents = Math.round(fr.prix * 100);
  const status = stockStatus(fr.stock);
  const now = new Date().toISOString();

  // Write SQL to a temp file — avoids shell-escaping issues with names
  // containing $, backticks, quotes, accented characters, etc.
  const sql = [
    "INSERT OR REPLACE INTO products",
    "  (id, name_fr, name_en, name_es, prix_cents, stock_qty, stock_status, updated_at)",
    "VALUES (",
    `  '${sqlStr(slug)}',`,
    `  '${sqlStr(fr.nom ?? slug)}',`,
    `  '${sqlStr(en?.nom ?? fr.nom ?? slug)}',`,
    `  '${sqlStr(es?.nom ?? fr.nom ?? slug)}',`,
    `  ${prixCents},`,
    `  50,`,
    `  '${status}',`,
    `  '${now}'`,
    ");",
  ].join("\n");

  const tmpFile = join(tmpdir(), `perinade-seed-${process.pid}-${slug}.sql`);
  writeFileSync(tmpFile, sql, "utf8");

  try {
    execFileSync(
      "npx",
      ["wrangler", "d1", "execute", DB_NAME, `--file=${tmpFile}`, ...baseArgs],
      { stdio: "inherit" }
    );
  } finally {
    unlinkSync(tmpFile);
  }

  console.log(`  ✓ ${slug} (${prixCents / 100}€, stock: ${status})`);
}

console.log("Seed complete.");
