import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ReconcileItem } from "../api/client";

export function Reconciliation() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reconcile"], queryFn: api.stripe.reconcile,
  });
  const syncMutation = useMutation({
    mutationFn: api.stripe.sync,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reconcile"] }),
  });

  if (isLoading) return <p>Chargement…</p>;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Réconciliation Stripe ↔ D1</h1>
      <p className="text-sm text-gray-500 mb-4">
        D1: {data.summary.total_d1} commandes · Stripe: {data.summary.total_stripe} charges · {data.summary.divergences} écart(s)
      </p>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Session ID", "Statut D1", "Statut Stripe", "Montant D1", "Montant Stripe", ""].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.items.map((item: ReconcileItem, i: number) => (
            <tr key={item.stripe_session_id} className={`${item.divergent ? "bg-red-50" : ""} ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <td className="px-4 py-2 font-mono text-xs">{item.stripe_session_id.slice(0, 20)}…</td>
              <td className="px-4 py-2">{item.d1_status ?? "—"}</td>
              <td className="px-4 py-2">{item.stripe_status ?? "—"}</td>
              <td className="px-4 py-2">{item.d1_amount_cents != null ? `${(item.d1_amount_cents / 100).toFixed(2)} €` : "—"}</td>
              <td className="px-4 py-2">{item.stripe_amount_cents != null ? `${(item.stripe_amount_cents / 100).toFixed(2)} €` : "—"}</td>
              <td className="px-4 py-2">
                {item.divergent && (
                  <button
                    onClick={() => syncMutation.mutate(item.stripe_session_id)}
                    className="text-xs text-blue-600 hover:underline"
                  >Resync</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
