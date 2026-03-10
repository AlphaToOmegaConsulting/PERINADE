-- Migration 001: product catalog, stock movements, webhook logs
-- Apply once: npx wrangler d1 execute perinade-dev-db --file=infra/migrations/001_products.sql

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  prix_cents INTEGER NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'en_stock',
  stripe_price_id TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  type TEXT NOT NULL,
  qty_delta INTEGER NOT NULL,
  reference_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  error TEXT,
  created_at TEXT NOT NULL
);
