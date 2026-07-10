# Media pipeline

FFmpeg was installed from WinGet package `Gyan.FFmpeg` and verified as `ffmpeg 8.1.2-full_build-www.gyan.dev`. Higgsfield discovery was performed with CLI `0.1.28`; no model or flag was used before its live schema had been inspected.

## Reproducible stages

1. `scripts/media/probe.ps1` validates each selected input: H.264, 1280×720, yuv420p, 24 fps, ~4.04 s, no audio.
2. `scripts/media/assemble-hero.ps1` concatenates the nine ordered clips into a 36.375 s ProRes LT mezzanine.
3. `scripts/media/encode-web.ps1` creates desktop 1280×720 and mobile 720×1280 H.264 encodes with GOP 12, yuv420p, no audio and `+faststart`.
4. `scripts/media/extract-posters.ps1` extracts matching JPEG and WebP poster frames.
5. `scripts/media/generate-thumbnails.ps1` creates one WebP thumbnail per scene.

Run the scripts from the repository root in that order. `scripts/media/ffmpeg-path.ps1` resolves the verified executable. Scripts do not delete or rewrite raw Higgsfield downloads.

The mobile output is a deliberate center crop of the generated 16:9 sequence. It is a separately encoded vertical delivery asset and selected with JavaScript media matching so the browser does not request both video variants.

Machine-readable technical details, sizes and paths are in `public/media/lemark/manifests/assets.json`.
