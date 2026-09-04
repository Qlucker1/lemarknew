$ErrorActionPreference = "Stop"
. "$PSScriptRoot/ffmpeg-path.ps1"

$repo = Resolve-Path "$PSScriptRoot/../.."
$ffmpeg = Get-LemarkFfmpegPath
$raw = "$repo/public/media/lemark/raw/videos"
$processed = "$repo/public/media/lemark/processed"
$desktop = "$processed/desktop/hero-v2-desktop.mp4"
$mobile = "$processed/mobile/hero-v2-mobile.mp4"
$desktopPoster = "$processed/posters/hero-v2-desktop.webp"
$mobilePoster = "$processed/posters/hero-v2-mobile.webp"

$inputs = @(
  "$raw/sections/production-window-source.mp4",
  "$raw/scene-05-furniture.mp4",
  "$raw/scene-06-facade.mp4",
  "$raw/scene-07-clean-room.mp4",
  "$raw/scene-08-transport.mp4"
)

$inputArgs = @()
foreach ($input in $inputs) { $inputArgs += @("-i", $input) }

$desktopFilter = @"
[0:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,scale=1280:720:flags=lanczos,setsar=1[v0];
[1:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,scale=1280:720:flags=lanczos,setsar=1[v1];
[2:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,scale=1280:720:flags=lanczos,setsar=1[v2];
[3:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,scale=1280:720:flags=lanczos,setsar=1[v3];
[4:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,scale=1280:720:flags=lanczos,setsar=1[v4];
[v0][v1]xfade=transition=fade:duration=0.7:offset=3.3[x1];
[x1][v2]xfade=transition=smoothleft:duration=0.7:offset=6.6[x2];
[x2][v3]xfade=transition=fade:duration=0.7:offset=9.9[x3];
[x3][v4]xfade=transition=smoothleft:duration=0.7:offset=13.2,format=yuv420p[out]
"@ -replace "`r?`n", ""

$mobileFilter = @"
[0:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,crop=405:720:430:0,scale=720:1280:flags=lanczos,setsar=1[v0];
[1:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,crop=405:720:365:0,scale=720:1280:flags=lanczos,setsar=1[v1];
[2:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,crop=405:720:410:0,scale=720:1280:flags=lanczos,setsar=1[v2];
[3:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,crop=405:720:438:0,scale=720:1280:flags=lanczos,setsar=1[v3];
[4:v]trim=duration=4,setpts=PTS-STARTPTS,fps=24,crop=405:720:438:0,scale=720:1280:flags=lanczos,setsar=1[v4];
[v0][v1]xfade=transition=fade:duration=0.7:offset=3.3[x1];
[x1][v2]xfade=transition=smoothleft:duration=0.7:offset=6.6[x2];
[x2][v3]xfade=transition=fade:duration=0.7:offset=9.9[x3];
[x3][v4]xfade=transition=smoothleft:duration=0.7:offset=13.2,format=yuv420p[out]
"@ -replace "`r?`n", ""

& $ffmpeg -y @inputArgs -filter_complex $desktopFilter -map "[out]" -an `
  -c:v libx264 -profile:v high -preset slow -crf 24 -maxrate 2800k -bufsize 5600k `
  -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart $desktop
if ($LASTEXITCODE -ne 0) { throw "Desktop hero v2 encode failed" }

& $ffmpeg -y @inputArgs -filter_complex $mobileFilter -map "[out]" -an `
  -c:v libx264 -profile:v high -preset slow -crf 26 -maxrate 2200k -bufsize 4400k `
  -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart $mobile
if ($LASTEXITCODE -ne 0) { throw "Mobile hero v2 encode failed" }

& $ffmpeg -y -ss 0.5 -i $desktop -frames:v 1 -c:v libwebp -quality 82 $desktopPoster
if ($LASTEXITCODE -ne 0) { throw "Desktop poster extraction failed" }

& $ffmpeg -y -ss 0.5 -i $mobile -frames:v 1 -c:v libwebp -quality 80 $mobilePoster
if ($LASTEXITCODE -ne 0) { throw "Mobile poster extraction failed" }

Write-Host $desktop
Write-Host $mobile
