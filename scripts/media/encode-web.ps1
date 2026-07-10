$ErrorActionPreference = "Stop"
. "$PSScriptRoot/ffmpeg-path.ps1"
$repo = Resolve-Path "$PSScriptRoot/../.."
$ffmpeg = Get-LemarkFfmpegPath
$master = "$repo/public/media/lemark/processed/desktop/hero-master.mov"
$desktop = "$repo/public/media/lemark/processed/desktop/hero-desktop.mp4"
$mobile = "$repo/public/media/lemark/processed/mobile/hero-mobile.mp4"

& $ffmpeg -y -i $master -vf "scale=1280:720:flags=lanczos,fps=24,format=yuv420p" -an `
  -c:v libx264 -preset slow -crf 21 -profile:v high -level 4.1 `
  -g 12 -keyint_min 12 -sc_threshold 0 -movflags +faststart $desktop
if ($LASTEXITCODE -ne 0) { throw "Desktop encode failed" }

& $ffmpeg -y -i $master -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=720:1280:flags=lanczos,fps=24,format=yuv420p" -an `
  -c:v libx264 -preset slow -crf 23 -profile:v high -level 4.1 `
  -g 12 -keyint_min 12 -sc_threshold 0 -movflags +faststart $mobile
if ($LASTEXITCODE -ne 0) { throw "Mobile encode failed" }

Write-Host $desktop
Write-Host $mobile
