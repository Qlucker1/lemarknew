$ErrorActionPreference = "Stop"
. "$PSScriptRoot/ffmpeg-path.ps1"
$repo = Resolve-Path "$PSScriptRoot/../.."
$ffmpeg = Get-LemarkFfmpegPath
$desktop = "$repo/public/media/lemark/processed/desktop/hero-desktop.mp4"
$mobile = "$repo/public/media/lemark/processed/mobile/hero-mobile.mp4"
$posters = "$repo/public/media/lemark/processed/posters"

& $ffmpeg -y -ss 0.08 -i $desktop -frames:v 1 -q:v 3 "$posters/hero-desktop.jpg"
& $ffmpeg -y -ss 0.08 -i $desktop -frames:v 1 -c:v libwebp -quality 84 "$posters/hero-desktop.webp"
& $ffmpeg -y -ss 0.08 -i $mobile -frames:v 1 -q:v 3 "$posters/hero-mobile.jpg"
& $ffmpeg -y -ss 0.08 -i $mobile -frames:v 1 -c:v libwebp -quality 84 "$posters/hero-mobile.webp"

if ($LASTEXITCODE -ne 0) { throw "Poster extraction failed" }
