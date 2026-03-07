# Cloudflare Pages Deployment (Git Mode)

## Project Settings
- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Production branch: `main` (or your chosen release branch)

## Local Validation Gate
Run this before every deploy:

```bash
npm run verify
```

This runs:
- `npm run check`
- `npm run build`

## Environment Variables
No build-time environment variables are currently required by the codebase.

## Smoke Checks After Deploy
Open and verify:
- `/`
- `/boutique`
- `/domaine`
- `/visites`

Check:
- No missing images or broken static assets (`/_astro/*`, `/assets/perinade/*`)
- Mobile and desktop layout rendering for each route

## Optional Performance Baseline
Run one Lighthouse pass against the production URL and save the initial scores as baseline.
