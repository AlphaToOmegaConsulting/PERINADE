-- Migration 000: create orders table
-- This table is managed by the stripe-webhook Worker in production.
-- It was created directly on the remote D1; this file exists for local dev init only.
CREATE TABLE IF NOT EXISTS orders (
  id                 TEXT PRIMARY KEY,
  stripe_session_id  TEXT NOT NULL UNIQUE,
  payment_intent_id  TEXT,
  status             TEXT NOT NULL DEFAULT 'pending',
  customer_email     TEXT NOT NULL DEFAULT '',
  amount_total       INTEGER NOT NULL DEFAULT 0,
  currency           TEXT NOT NULL DEFAULT 'eur',
  items              TEXT NOT NULL DEFAULT '[]',
  items_processed    INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
