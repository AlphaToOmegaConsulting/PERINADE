import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/compte/callback`,
    },
  });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function fetchUserProfile(accessToken: string) {
  const res = await fetch("https://perinade.alpha2omegaconsulting.com/api/user/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json() as Promise<{
    userId: string;
    email: string;
    orderCount: number;
    totalSpentCents: number;
  }>;
}

export async function fetchOrders(accessToken: string) {
  const res = await fetch("https://perinade.alpha2omegaconsulting.com/api/user/orders", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  return res.json() as Promise<
    Array<{
      id: string;
      stripe_session_id: string;
      status: string;
      amount_total: number;
      currency: string;
      line_items: unknown;
      created_at: string;
    }>
  >;
}
