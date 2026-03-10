resource "cloudflare_d1_database" "perinade" {
  account_id = var.cloudflare_account_id
  name       = "${local.prefix}-db"
}
