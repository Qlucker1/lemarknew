$ErrorActionPreference = "Stop"
. "$PSScriptRoot/ffmpeg-path.ps1"
$repo = Resolve-Path "$PSScriptRoot/../.."
$ffmpeg = Get-LemarkFfmpegPath
$out = "$repo/public/media/lemark/processed/desktop/hero-master.mov"

& $ffmpeg -y -f concat -safe 0 -i "$PSScriptRoot/concat-list.txt" `
  -vf "fps=24,scale=1280:720:flags=lanczos,setsar=1,format=yuv422p10le" `
  -an -c:v prores_ks -profile:v 1 -vendor apl0 $out

if ($LASTEXITCODE -ne 0) { throw "Hero master assembly failed" }
Write-Host $out
