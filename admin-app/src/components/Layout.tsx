import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Produits" },
  { to: "/orders", label: "Commandes" },
  { to: "/reconciliation", label: "Réconciliation" },
  { to: "/webhooks", label: "Webhooks" },
];

export function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <nav className="w-56 bg-white border-r p-4 flex flex-col gap-1">
        <div className="font-semibold text-gray-900 mb-6 px-2">Périnade Admin</div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${isActive ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-50"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
