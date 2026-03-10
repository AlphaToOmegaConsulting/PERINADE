-- Migration 003: user account support
-- Ajoute supabase_user_id aux commandes + cache email → user_id

ALTER TABLE orders ADD COLUMN supabase_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_supabase_user_id ON orders(supabase_user_id);

-- Cache local email → Supabase user_id
-- Évite des appels répétés à l'Admin API Supabase pour les achats récurrents
CREATE TABLE IF NOT EXISTS user_email_map (
  email             TEXT PRIMARY KEY,
  supabase_user_id  TEXT NOT NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
