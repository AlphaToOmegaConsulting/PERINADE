import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Orders } from "./pages/Orders";
import { Reconciliation } from "./pages/Reconciliation";
import { Webhooks } from "./pages/Webhooks";
import { isCfAuthenticated } from "./api/client";

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isCfAuthenticated()) {
    const loginUrl = `/cdn-cgi/access/login?redirect_url=${encodeURIComponent(window.location.href)}`;
    window.location.href = loginUrl;
    return null;
  }
  return <>{children}</>;
}

export function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reconciliation" element={<Reconciliation />} />
            <Route path="webhooks" element={<Webhooks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
