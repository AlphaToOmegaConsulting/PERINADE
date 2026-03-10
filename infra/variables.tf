variable "cloudflare_api_token" {
  description = "Token API Cloudflare avec permissions : Pages:Edit, Workers:Edit, D1:Edit, KV:Edit, R2:Edit"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "ID du compte Cloudflare (AEGEE / TWT / FOODIES / ALPHA)"
  type        = string
  default     = "aea813e220eb8b709d70698a80ded18e"
}

variable "cloudflare_zone_id" {
  description = "Zone ID Cloudflare (alpha2omegaconsulting.com maintenant, perinade.fr après transfert)"
  type        = string
}

variable "site_domain" {
  description = "Domaine principal du site. Actuellement: perinade.alpha2omegaconsulting.com. Après transfert: perinade.fr"
  type        = string
  default     = "perinade.alpha2omegaconsulting.com"
}

variable "github_owner" {
  description = "Propriétaire du dépôt GitHub (username ou org)"
  type        = string
  default     = "francoisfrance"
}

variable "github_repo" {
  description = "Nom du dépôt GitHub (ex: PERINADE)"
  type        = string
  default     = "PERINADE"
}

variable "github_production_branch" {
  description = "Branche déclenchant les déploiements de production"
  type        = string
  default     = "main"
}
