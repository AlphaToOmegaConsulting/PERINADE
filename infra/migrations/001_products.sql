-- Migration 001: product catalog, stock movements, webhook logs
-- Apply once: npx wrangler d1 execute perinade-dev-db --file=infra/migrations/001_products.sql

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  prix_cents INTEGER NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'en_stock' CHECK (stock_status IN ('en_stock', 'limite', 'rupture')),
  stripe_price_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL, -- NOTE: D1 does not enforce FK constraints; app-layer validation required
  type TEXT NOT NULL CHECK (type IN ('order', 'refund', 'manual')),
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

CREATE INDEX IF NOT EXISTS idx_products_stripe_price_id ON products(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status);
