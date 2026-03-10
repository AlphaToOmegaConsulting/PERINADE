import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function Orders() {
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["orders"], queryFn: () => api.orders.list(),
  });

  if (isLoading) return <p>Chargement…</p>;
  if (isError) return <p className="text-red-600 text-sm">Erreur de chargement. Vérifiez votre connexion.</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Commandes</h1>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Date", "Email", "Montant", "Statut", "Stripe"].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} className={`hover:bg-gray-50 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
              <td className="px-4 py-2">{o.customer_email}</td>
              <td className="px-4 py-2">{(o.amount_total / 100).toFixed(2)} €</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  o.status === "paid" ? "bg-green-100 text-green-700" :
                  o.status === "failed" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-600"
                }`}>{o.status}</span>
              </td>
              <td className="px-4 py-2">
                <a
                  href={`https://dashboard.stripe.com/test/checkout/sessions/${o.stripe_session_id}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >Voir →</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
