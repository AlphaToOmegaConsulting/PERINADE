resource "cloudflare_workers_kv_namespace" "perinade" {
  account_id = var.cloudflare_account_id
  title      = "${local.prefix}-kv"
}
