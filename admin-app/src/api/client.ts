const API_BASE = import.meta.env.VITE_API_BASE ?? "https://perinade.alpha2omegaconsulting.com";

// CF-Access-Jwt-Assertion is injected automatically by Cloudflare Access
// when the user is authenticated via the Access login page.
// The browser passes it as a cookie; we read it for API calls.
function getCfJwt(): string {
  // CF Access JWTs are base64url-encoded (no ';'), so this simple regex is reliable
  const match = document.cookie.match(/CF_Authorization=([^;]+)/);
  return match?.[1] ?? "";
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "CF-Access-Jwt-Assertion": getCfJwt(),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "API error");
  }
  return res.json() as Promise<T>;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string; name_fr: string; name_en: string; name_es: string;
  prix_cents: number; stock_qty: number; stock_status: string;
  stripe_price_id: string | null; updated_at: string;
}

export interface Order {
  id: string; stripe_session_id: string; status: string;
  customer_email: string; amount_total: number; currency: string;
  items: string; items_processed: number; created_at: string;
}

export interface DashboardData {
  revenue: { today_cents: number; this_month_cents: number };
  orders: { today: number; this_month: number; pending: number };
  stock_alerts: Array<{ id: string; name_fr: string; stock_qty: number }>;
}

export interface ReconcileItem {
  stripe_session_id: string;
  d1_status: string | null; stripe_status: string | null;
  d1_amount_cents: number | null; stripe_amount_cents: number | null;
  amount_match: boolean; status_match: boolean; divergent: boolean;
}

export interface WebhookLog {
  id: string; event_type: string; stripe_event_id: string;
  status: string; error: string | null; created_at: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

export const api = {
  dashboard: () => apiFetch<DashboardData>("/api/admin/dashboard"),
  products: {
    list: () => apiFetch<Product[]>("/api/admin/products"),
    update: (id: string, data: { stock_qty?: number; prix_cents?: number; note?: string }) =>
      apiFetch<Product>(`/api/admin/products/${id}`, {
        method: "PATCH", body: JSON.stringify(data),
      }),
  },
  orders: {
    list: (params?: { status?: string; from?: string; to?: string }) => {
      const qs = params
        ? new URLSearchParams(
            Object.fromEntries(
              Object.entries(params).filter(([, v]) => v !== undefined)
            ) as Record<string, string>
          ).toString()
        : "";
      return apiFetch<Order[]>(`/api/admin/orders${qs ? `?${qs}` : ""}`);
    },
  },
  stripe: {
    reconcile: () => apiFetch<{ summary: { total_d1: number; total_stripe: number; divergences: number }; items: ReconcileItem[] }>("/api/admin/stripe/reconcile"),
    sync: (orderId: string) => apiFetch<{ synced: boolean; new_status: string }>(`/api/admin/stripe/sync/${orderId}`, { method: "POST" }),
  },
  webhooks: () => apiFetch<WebhookLog[]>("/api/admin/webhooks"),
};
