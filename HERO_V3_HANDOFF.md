# Lemark — original site + new HERO

## Scope

The prior editorial version remains in tag `archive/editorial-v1-2026-09-04` and its external ZIP archive. This version replaces only the official homepage intro. All lower sections, original styles, images, navigation, menus, analytics and form markup come from https://lemarkllc.ru/.

`src/content/original-home.json` is the captured original HTML with an intro insertion marker. `original-source-manifest.json` records source hashes and mirrored resources. `src/app/route.ts` serves it with the isolated HERO; the previous React landing components are not mounted.

## New media and motion

- Fresh Higgsfield Seedance 2.0 generation: `13f07e5a-c962-4b20-b33b-0a8528cfb9f2`.
- 10-second continuous material/interior film, not reused footage.
- Desktop: 1280×720, 1,064,239 bytes. Mobile: 540×960, 524,303 bytes.
- H.264, 24 fps, keyframe interval 4, no B-frames, faststart, no audio.
- Source, prompt, job result, hashes, FFmpeg arguments and outputs: `public/media/lemark/v3/manifest.json`.
- Lenis smooth wheel scrolling; native mobile touch momentum. Sticky travel approximately 1.7 viewport heights.
- Three fixed-position text states; fully empty intervals at 28–36% and 62–70%. No moving/reflowing headings.
- Reverse seeking, serialized decoder requests, poster/error fallback, reduced-motion/data-saver static cover, skip button.

## Forms and original integrations

Original page links continue to the official website, including catalog URLs. Original AjaxForm POST URL is preserved by a Next route which establishes a fresh original MODX session and forwards to the original handler. It never fabricates success.

Automated tests do not submit real leads. End-to-end lead delivery is not claimed. Two original forms (`pred-form`, `message-form`) use reCAPTCHA: the Netlify hostname must be permitted in the existing reCAPTCHA configuration if these forms are to be used on the preview domain. Official-domain links remain available.

Five original legacy `.woff` URLs return 404 on the source; the corresponding primary `.woff2` fonts were mirrored successfully. Original external analytics and CAPTCHA retain their provider dependencies.

## Verification

Run `npm run build`, `npm run lint`, `npm run typecheck`, `npm run test:e2e`.
Playwright covers actual wheel easing, forward/reverse decoded video time, text baselines, blank text intervals, original lower section text, original menus, poster fallbacks, form controls and 360/390/430/768/1024/1280/1440/1920 px viewports.

Do not rerun `scripts/media/generate-hero-v3.mjs` unless a new paid generation is intended. Build uses local media and fonts; no generation or source crawling occurs during build.
