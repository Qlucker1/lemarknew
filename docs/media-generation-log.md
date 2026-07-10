# Media generation log

Machine-readable source of truth: `public/media/lemark/manifests/generations.json`. Processed derivatives and non-generated source assets are listed in `assets.json` beside it.

| Date | Asset group | Generator/model | Count | Status | Notes |
|---|---|---|---:|---|---|
| 2026-07-10 | Design concept | built-in Image Gen | 1 | selected | `docs/design-concepts/hero-concept.png` |
| 2026-07-10 | HERO stills | Higgsfield `gpt_image_2` | 9 | selected | 2K, 16:9, high quality |
| 2026-07-10 | HERO clips | Higgsfield `seedance1_5` | 9 | selected | 4 s, 720p, 24 fps, silent |
| 2026-07-10 | HERO desktop | FFmpeg 8.1.2 | 1 | processed | H.264, 1280×720, GOP 12, faststart |
| 2026-07-10 | HERO mobile | FFmpeg 8.1.2 | 1 | processed | H.264, 720×1280, GOP 12, faststart |
| 2026-07-10 | Posters/thumbnails | FFmpeg 8.1.2 | 13 | processed | JPEG/WebP fallbacks and nine scene thumbnails |

Raw downloads are immutable under `public/media/lemark/raw/`; selected generations are copied to `selected/`; all FFmpeg outputs are under `processed/`.

Some duplicate generation attempts occurred while recovering from a transient upstream 502 response. Only the nine selected image IDs and nine selected video IDs are present in the manifest and production sequence.
