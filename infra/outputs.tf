output "pages_subdomain" {
  description = "Sous-domaine Cloudflare Pages du projet"
  value       = cloudflare_pages_project.perinade.subdomain
}

output "d1_database_id" {
  description = "ID de la base D1 — à renseigner dans wrangler.toml des Workers"
  value       = cloudflare_d1_database.perinade.id
}

output "kv_namespace_id" {
  description = "ID du namespace KV — à renseigner dans wrangler.toml des Workers"
  value       = cloudflare_workers_kv_namespace.perinade.id
}

output "r2_bucket_name" {
  description = "Nom du bucket R2 — à utiliser dans Pages CMS media config"
  value       = cloudflare_r2_bucket.perinade_media.name
}

output "worker_stripe_webhook_url" {
  description = "URL publique du Worker stripe-webhook (à configurer dans Stripe Dashboard)"
  value       = "https://${cloudflare_worker_script.stripe_webhook.name}.${var.github_owner}.workers.dev"
}

output "worker_contact_form_url" {
  description = "URL publique du Worker contact-form"
  value       = "https://${cloudflare_worker_script.contact_form.name}.${var.github_owner}.workers.dev"
}
