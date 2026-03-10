resource "cloudflare_r2_bucket" "perinade_media" {
  account_id = var.cloudflare_account_id
  name       = "${local.prefix}-media"
}
