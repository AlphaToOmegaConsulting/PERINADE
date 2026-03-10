-- ═══════════════════════════════════════════════════════════════
-- Périnade — Supabase Schema
-- Copiez-collez ce fichier dans le SQL Editor de Supabase et cliquez Run
-- ═══════════════════════════════════════════════════════════════

-- ── user_profiles ────────────────────────────────────────────────
-- 1 ligne par acheteur (1:1 avec auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  loyalty_points  INTEGER NOT NULL DEFAULT 0,
  total_orders    INTEGER NOT NULL DEFAULT 0,
  total_spent_cts INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur ne voit et ne modifie que son propre profil
CREATE POLICY "own_profile_select" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "own_profile_update" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- ── loyalty_transactions ──────────────────────────────────────────
-- Historique des mouvements de points (append-only)
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  points_delta INTEGER NOT NULL,
  reason       TEXT NOT NULL CHECK (reason IN ('order', 'refund', 'redemption', 'manual')),
  reference_id TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_tx_user_id ON loyalty_transactions(user_id);

ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent uniquement lire leurs propres transactions
CREATE POLICY "own_loyalty_select" ON loyalty_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ── upsert_loyalty RPC ────────────────────────────────────────────
-- Appelée par le Worker stripe-webhook (service_role key).
-- Crée ou met à jour le profil + enregistre la transaction, de manière atomique.
CREATE OR REPLACE FUNCTION upsert_loyalty(
  p_user_id    UUID,
  p_points     INTEGER,
  p_amount_cts INTEGER,
  p_session_id TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_profiles (id, loyalty_points, total_orders, total_spent_cts)
  VALUES (p_user_id, p_points, 1, p_amount_cts)
  ON CONFLICT (id) DO UPDATE SET
    loyalty_points  = user_profiles.loyalty_points  + p_points,
    total_orders    = user_profiles.total_orders    + 1,
    total_spent_cts = user_profiles.total_spent_cts + p_amount_cts,
    updated_at      = now();

  INSERT INTO loyalty_transactions (user_id, points_delta, reason, reference_id)
  VALUES (p_user_id, p_points, 'order', p_session_id);
END;
$$;
