import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });

  if (isLoading) return <p>Chargement…</p>;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="CA aujourd'hui" value={euros(data.revenue.today_cents)} />
        <KpiCard label="CA ce mois" value={euros(data.revenue.this_month_cents)} />
        <KpiCard label="Commandes en attente" value={String(data.orders.pending)} />
      </div>
      {data.stock_alerts.length > 0 && (
        <div>
          <h2 className="font-medium mb-3 text-red-600">Alertes stock ({"<"}5 unités)</h2>
          <ul className="space-y-1">
            {data.stock_alerts.map((p) => (
              <li key={p.id} className="text-sm text-gray-700">
                {p.name_fr} — {p.stock_qty} unité{p.stock_qty !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
