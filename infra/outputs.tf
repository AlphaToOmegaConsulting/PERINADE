output "d1_database_id" {
  description = "ID de la base D1 — à copier dans wrangler.toml des Workers"
  value       = cloudflare_d1_database.perinade.id
}

output "kv_namespace_id" {
  description = "ID du namespace KV — à copier dans wrangler.toml des Workers"
  value       = cloudflare_workers_kv_namespace.perinade.id
}
