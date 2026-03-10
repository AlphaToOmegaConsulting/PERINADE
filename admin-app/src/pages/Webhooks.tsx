import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function Webhooks() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["webhooks"], queryFn: api.webhooks,
  });

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Événements Webhook</h1>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Date", "Type", "Stripe ID", "Statut", "Erreur"].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((w, i) => (
            <tr key={w.id} className={`${w.status === "failed" ? "bg-red-50" : ""} ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <td className="px-4 py-2">{new Date(w.created_at).toLocaleString("fr-FR")}</td>
              <td className="px-4 py-2 font-mono text-xs">{w.event_type}</td>
              <td className="px-4 py-2 font-mono text-xs">{w.stripe_event_id?.slice(0, 18)}…</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  w.status === "processed" ? "bg-green-100 text-green-700" :
                  w.status === "failed" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-500"
                }`}>{w.status}</span>
              </td>
              <td className="px-4 py-2 text-red-600 text-xs">{w.error ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
