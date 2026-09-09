# Deploy — simple

## Live status (2026-09-08 night)
- Vercel project Git-linked on hustle-launch (`prj_7aDUf16Pi9kcalGnJullTAQqDBzt`).
- Tailwind v4 PostCSS fixed (`@tailwindcss/postcss`).
- Production build previously failed with `auth/invalid-api-key` when Firebase env vars were absent.
- Client Firebase config is env-only (see `.env.example`). Build is softened to allow prerender without secrets; **auth/data need Vercel env** for a working app.

## Required Vercel Production env
Set from `.env.example`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- optional `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Then redeploy. Stable URL: `https://simple-hustle-launch.vercel.app` (production alias `https://simple-two-silk.vercel.app`). `simple.vercel.app` is someone else’s project.

## Ship
- `.github/workflows/ship.yml` + `.vercel/project.json` present.
- `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` secrets set; `VERCEL_TOKEN` still needed for Blacksmith Ship CLI path (Git integration already deploys on push).
