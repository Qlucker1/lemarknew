# Lemark cinematic landing

Production-ready Next.js landing for Lemark HPL: a seven-chapter sticky scroll story, generated/processed desktop and mobile video, responsive editorial sections, accessible interactions, lead form, SEO metadata and consent-gated analytics.

## Run

```powershell
npm install
npm run dev
```

Production verification:

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The Playwright suite starts `next start` and covers forward/reverse HERO scrubbing, desktop/mobile video selection, mobile menu, product/FAQ/form interactions, upload/remove, honest API failure, reduced motion, failed-video poster fallback, console errors and widths 360, 390, 430, 768, 1024, 1280, 1440 and 1920 px.

## Environment

Copy `.env.example` to `.env.local` and provide only the integrations available in the deployment environment.

- `LEAD_WEBHOOK_URL` — required for delivery of form submissions. Without it, `/api/lead` intentionally returns 503 with a readable message; leads are never silently discarded.
- `LEAD_EMAIL_TO` — optional destination metadata sent to the webhook.
- `NEXT_PUBLIC_GA_ID` — GA4 measurement ID; defaults to the verified current-site ID `G-T00WQ7W67S` and loads only after analytics consent.
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — Yandex Metrika ID; defaults to the verified current-site ID `68572018` and loads only after analytics consent.
- `NEXT_PUBLIC_CALLTOUCH_ID` — optional Calltouch identifier.
- `NEXT_PUBLIC_BITRIX_TRACKER_URL` — optional existing Bitrix tracker URL.

No personal form fields are sent to analytics. Server-side validation, honeypot, attachment allow-list/10 MB limit and basic in-memory rate limiting are implemented in `src/app/api/lead/route.ts`.

## Content and source facts

- `src/content/site-facts.ts` centralizes verified public facts and contacts.
- `src/content/site-content.ts` contains the seven HERO chapters and landing content.
- `docs/content-map.md`, `docs/visual-bible.md`, `docs/storyboard.md` document the editorial system.
- `docs/facts-to-verify.md` records conflicts found across the current site and the master prompt. Ambiguous client names, certificates, formats, lead times and surface counts are not presented as hard claims.

Existing public-site URLs are used for catalog, company, projects and informational destinations; no legacy URL is redefined inside this standalone landing.

## Media

- Generation prompts, exact Higgsfield models, IDs, seeds and selected paths: `public/media/lemark/manifests/generations.json`.
- Processed outputs, poster variants, thumbnails and official-source imagery: `public/media/lemark/manifests/assets.json`.
- Idempotent FFmpeg scripts: `scripts/media/`.
- Pipeline notes: `docs/media-pipeline.md`.

The browser selects exactly one video source through `matchMedia`; desktop and mobile variants are not declared as simultaneous `<source>` downloads. `prefers-reduced-motion` removes the video and renders the complete story as static chapters.

## Known deployment prerequisites

There are no code/build blockers. Before launch, configure the real lead webhook and analytics IDs, confirm the disputed commercial facts in `docs/facts-to-verify.md`, and validate the final consent wording with the site owner.
