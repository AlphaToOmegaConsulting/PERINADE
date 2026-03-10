import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types.js";
import { cfAccessAuth } from "./middleware/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { dashboardRoutes } from "./routes/dashboard.js";
import { productRoutes } from "./routes/products.js";
import { orderRoutes } from "./routes/orders.js";
import { stockRoutes } from "./routes/stock.js";
import { stripeRoutes } from "./routes/stripe.js";
import { webhookRoutes } from "./routes/webhooks.js";
import { userRoutes } from "./routes/user.js";
import { authRoutes } from "./routes/auth.js";

const app = new Hono<{ Bindings: Env }>();

// CORS: only allow admin subdomain
app.use("/api/admin/*", cors({
  origin: ["https://admin.perinade.fr", "http://localhost:5173"],
  allowMethods: ["GET", "PATCH", "POST"],
  allowHeaders: ["Content-Type", "CF-Access-Jwt-Assertion"],
}));

// Auth + rate limiting on all admin routes
app.use("/api/admin/*", cfAccessAuth);
app.use("/api/admin/*", rateLimit);

// Mount routes
app.route("/api/admin/dashboard", dashboardRoutes);
app.route("/api/admin/products", productRoutes);
app.route("/api/admin/orders", orderRoutes);
app.route("/api/admin/stock", stockRoutes);
app.route("/api/admin/stripe", stripeRoutes);
app.route("/api/admin/webhooks", webhookRoutes);

// CORS: allow main site origins for user/auth routes
app.use("/api/user/*", cors({
  origin: ["https://perinade.alpha2omegaconsulting.com", "http://localhost:4321"],
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api/auth/*", cors({
  origin: ["https://perinade.alpha2omegaconsulting.com", "http://localhost:4321"],
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Mount user/auth routes
app.route("/api/user", userRoutes);
app.route("/api/auth", authRoutes);

// Health check (no auth)
app.get("/api/health", (c) => c.json({ ok: true }));

export default app;
