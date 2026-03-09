terraform {
  required_version = ">= 1.6"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  # État local par défaut — remplacer par un backend distant (S3, Cloudflare R2…) en production
  backend "local" {}
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

locals {
  workspace = terraform.workspace # "dev" ou "prod"
  prefix    = "perinade-${terraform.workspace}"
}
