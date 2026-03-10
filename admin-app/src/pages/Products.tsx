import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Product } from "../api/client";

export function Products() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"], queryFn: api.products.list,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, stock_qty }: { id: string; stock_qty: number }) =>
      api.products.update(id, { stock_qty }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Produits</h1>
      <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Produit", "Stock", "Prix (€)", "Statut", "Modifié"].map((h) => (
              <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <ProductRow key={p.id} product={p} index={i} onUpdate={(id, qty) =>
              updateMutation.mutate({ id, stock_qty: qty })
            } />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({ product: p, index, onUpdate }: { product: Product; index: number; onUpdate: (id: string, qty: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(p.stock_qty));

  function save() {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0 && n <= 9999) {
      onUpdate(p.id, n);
      setEditing(false);
    }
  }

  return (
    <tr className={`hover:bg-gray-50 ${index > 0 ? "border-t border-gray-100" : ""}`}>
      <td className="px-4 py-2">{p.name_fr}</td>
      <td className="px-4 py-2">
        {editing ? (
          <span className="flex gap-2 items-center">
            <input
              type="number" min={0} max={9999}
              value={val} onChange={(e) => setVal(e.target.value)}
              className="border rounded px-2 py-1 w-20 text-sm"
              autoFocus
            />
            <button onClick={save} className="text-green-600 font-medium text-xs">Sauver</button>
            <button onClick={() => { setEditing(false); setVal(String(p.stock_qty)); }}
              className="text-gray-400 text-xs">Annuler</button>
          </span>
        ) : (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setEditing(true)}
            title="Cliquer pour modifier"
          >{p.stock_qty}</span>
        )}
      </td>
      <td className="px-4 py-2">{(p.prix_cents / 100).toFixed(2)}</td>
      <td className="px-4 py-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          p.stock_status === "en_stock" ? "bg-green-100 text-green-700" :
          p.stock_status === "limite" ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        }`}>{p.stock_status}</span>
      </td>
      <td className="px-4 py-2 text-gray-400">{new Date(p.updated_at).toLocaleDateString("fr-FR")}</td>
    </tr>
  );
}
