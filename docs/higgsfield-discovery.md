# Higgsfield discovery — 2026-07-10

## Installed CLI

- Binary: `higgsfield` PowerShell shim from npm global bin.
- Authentication: active workspace/account (email intentionally omitted from repo docs).
- Plan/credits at discovery: Ultimate, 604.09 credits.
- Supported command groups confirmed by `higgsfield --help`: `account`, `auth`, `generate`, `marketing-studio`, `marketplace-cards`, `model`, `product-photoshoot`, `soul-id`, `upload`, `version`, `workspace`.

## Selected models

- Stills: `gpt_image_2` (schema-confirmed aspect ratios, 1k/2k/4k, low/medium/high).
- Video: `seedance1_5` (schema-confirmed 4/8/12 s, 480p/720p/1080p, 16:9/9:16 etc.).
- Rationale: clean single-take shots anchored by explicit first frames; economical and scrub-friendly.

## Confirmed generation syntax

```powershell
higgsfield generate create gpt_image_2 --prompt "..." --aspect_ratio 16:9 --resolution 2k --quality high --wait --json
higgsfield generate create seedance1_5 --prompt "..." --start-image <path> --duration 4 --resolution 720p --aspect_ratio 16:9 --generate-audio false --wait --json
```

Source of truth: live `model list --json` and `model get <job_set_type> --json`; no undocumented flags are used.
