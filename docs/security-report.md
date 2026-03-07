# Security Best Practices Report

Date: 2026-02-28  
Project: PERINADE (Astro static site)

## Executive Summary

This repository has no server-side application code and currently no known npm vulnerabilities (`npm audit --json` reports 0 findings).  
Primary risk is therefore not backend compromise, but front-end injection hardening gaps, operational hardening gaps, and governance/supply-chain resilience.

Most important outcomes:
- No runtime npm vulnerabilities currently detected.
- Multiple HTML injection sinks exist (`set:html`, `innerHTML`) that are safe **today** because inputs are local constants, but become high-risk if content source changes (CMS/API/user input).
- Security header and CSP hardening is not configured in-repo.
- Dependency/security ownership concentration is high (single contributor bus factor = 1).

---

## Scope And Method

- Static analysis of Astro source and config in `src/`, `public/`, and root config files.
- Dependency checks:
  - `npm audit --json`
  - `npm ls lodash @astrojs/check @astrojs/language-server yaml-language-server volar-service-yaml`
- Ownership/governance analysis using security ownership map artifacts in `ownership-map-out/`.

Assumptions:
- Site is deployed as static pages (Astro build output), no runtime Node server handling requests.
- No hidden private backend in another repository.

---

## Findings (By Severity)

## Medium Severity

### [MED-001] HTML Injection Sinks Present (`set:html` and `innerHTML`)
- Evidence:
  - [src/components/sections/Contact.astro:16](/Users/codex/Desktop/WEBDEV/PERINADE/src/components/sections/Contact.astro:16) uses `set:html={contact.titleHtml}`
  - [src/components/shop/ShopDomainSelection.astro:58](/Users/codex/Desktop/WEBDEV/PERINADE/src/components/shop/ShopDomainSelection.astro:58) uses `set:html={iconSvg(item.icon)}`
  - [src/components/visits/BookingSection.astro:97](/Users/codex/Desktop/WEBDEV/PERINADE/src/components/visits/BookingSection.astro:97) uses `priceLabel.innerHTML = ...`
- Current exploitability:
  - Low in current state (values come from local constants in [src/data/site.ts:186](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site.ts:186) and local function literals).
- Risk if project evolves:
  - If values later come from CMS/API/query params/user input, this pattern can become XSS quickly.
- Recommendation:
  - Replace `set:html` with structured markup where possible.
  - Replace `innerHTML` with DOM-safe construction (`textContent` + separate `<small>` node or static markup wrapper).
  - If `set:html` must remain, enforce strict sanitizer boundary and typed “trusted HTML” utility.

### [MED-002] No In-Repo Security Header/CSP Policy
- Evidence:
  - [astro.config.mjs:1](/Users/codex/Desktop/WEBDEV/PERINADE/astro.config.mjs:1) contains no security hardening config.
  - `public/` has no `_headers`, `security.txt`, or explicit CSP policy artifacts.
  - Multiple inline scripts exist (for example [src/layouts/BaseLayout.astro:27](/Users/codex/Desktop/WEBDEV/PERINADE/src/layouts/BaseLayout.astro:27), [src/components/sections/Header.astro:60](/Users/codex/Desktop/WEBDEV/PERINADE/src/components/sections/Header.astro:60), [src/components/visits/BookingSection.astro:79](/Users/codex/Desktop/WEBDEV/PERINADE/src/components/visits/BookingSection.astro:79)).
- Impact:
  - Weak default browser hardening and difficult CSP rollout (`unsafe-inline` pressure due to inline scripts).
- Recommendation:
  - Add deploy-layer headers:
    - `Content-Security-Policy` (nonce/hash-based where possible)
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)
    - `Referrer-Policy: strict-origin-when-cross-origin`
  - Migrate inline scripts to bundled modules to make CSP practical.

### [MED-003] Security Ownership Bus Factor = 1
- Evidence:
  - `ownership-map-out/summary.json` reports `people: 1`.
  - `ownership-map-out` people query returns only `codex@minidefrancois.home`.
- Impact:
  - Single-maintainer risk for dependency response, incident handling, and secure release continuity.
- Recommendation:
  - Add at least one reviewer/maintainer for dependency and release files:
    - [package.json](/Users/codex/Desktop/WEBDEV/PERINADE/package.json)
    - [package-lock.json](/Users/codex/Desktop/WEBDEV/PERINADE/package-lock.json)
    - [astro.config.mjs](/Users/codex/Desktop/WEBDEV/PERINADE/astro.config.mjs)
  - Enforce PR review for dependency updates.

## Low Severity

### [LOW-001] Placeholder Production Links/Endpoints Can Cause Compliance/Trust Issues
- Evidence:
  - [src/data/site.ts:195](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site.ts:195) `formAction: "TODO_FORM_ENDPOINT"`
  - [src/data/site.ts:216](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site.ts:216)-[src/data/site.ts:219](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site.ts:219) legal/privacy placeholders
  - [src/data/site.ts:226](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site.ts:226), [src/data/site.ts:228](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site.ts:228)-[src/data/site.ts:229](/Users/codex/Desktop/WEBDEV/PERINADE/src/data/site.ts:229) newsletter/social placeholders
- Impact:
  - No direct exploit, but legal/privacy workflow and user trust risks at go-live.
- Recommendation:
  - Block production deploy when placeholder markers (`TODO_`) are present.

### [LOW-002] Dev Server Exposure On Local Network
- Evidence:
  - [astro.config.mjs:5](/Users/codex/Desktop/WEBDEV/PERINADE/astro.config.mjs:5) sets `server.host: true`.
- Impact:
  - Local development server can be reachable on LAN; risk depends on developer network trust.
- Recommendation:
  - Gate with env flag (host only when explicitly needed).

### [LOW-003] No CI Security Workflow In Repository
- Evidence:
  - No `.github/` directory in repository root.
- Impact:
  - No automated guardrails for audit, dependency drift, or baseline security checks.
- Recommendation:
  - Add CI jobs for:
    - `npm ci`
    - `npm run check`
    - `npm run build`
    - `npm audit --omit=dev` and periodic full audit.

---

## Dependency And Supply Chain Status

- `npm audit --json`: 0 vulnerabilities currently.
- Previously reported lodash transitive advisory chain has been remediated via override:
  - [package.json:23](/Users/codex/Desktop/WEBDEV/PERINADE/package.json:23) sets `overrides.yaml-language-server = "1.20.0"`.
- Residual supply-chain risk:
  - Override can drift from upstream dependency intent; monitor and remove when upstream permanently resolves.

---

## Threat Scenarios (Realistic For This Project)

1. Content source expansion XSS:
   - If marketing content migrates to CMS/API and is passed to current HTML sinks, attacker-supplied HTML/JS could execute in visitor browsers.
2. Browser hardening bypass:
   - Without CSP and related headers, a future DOM injection bug has higher impact.
3. Dependency incident response delay:
   - With ownership concentration, critical patch turnaround may depend on one person’s availability.

---

## Prioritized Remediation Plan

1. Remove/contain HTML sinks (`set:html`, `innerHTML`) and codify trusted HTML policy.
2. Add production security headers and migrate inline scripts to CSP-compatible modules.
3. Add CI security gates (check/build/audit + placeholder-link blocker).
4. Add secondary maintainer/reviewer for dependency and deploy config files.

---

## What Is Not Currently In Scope

- Server-side auth/session risks (no backend runtime in this repository).
- Database/secret storage exploitation (no data store code present).

