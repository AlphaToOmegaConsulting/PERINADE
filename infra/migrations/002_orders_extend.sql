-- Migration 002: add items_processed column to orders
-- WARNING: SQLite does not support ADD COLUMN IF NOT EXISTS.
-- This file is applied by scripts/migrate.ts which guards via PRAGMA table_info.
-- Do NOT run this file directly with wrangler d1 execute.
ALTER TABLE orders ADD COLUMN items_processed INTEGER DEFAULT 0;
