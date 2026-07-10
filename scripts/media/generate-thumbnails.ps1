$ErrorActionPreference = "Stop"
. "$PSScriptRoot/ffmpeg-path.ps1"
$repo = Resolve-Path "$PSScriptRoot/../.."
$ffmpeg = Get-LemarkFfmpegPath
$inputDir = "$repo/public/media/lemark/selected/images"
$outputDir = "$repo/public/media/lemark/processed/thumbnails"

Get-ChildItem "$inputDir/*.png" | ForEach-Object {
  $name = [IO.Path]::GetFileNameWithoutExtension($_.Name)
  & $ffmpeg -y -i $_.FullName -vf "scale=1280:-2:flags=lanczos" -c:v libwebp -quality 82 "$outputDir/$name.webp"
  if ($LASTEXITCODE -ne 0) { throw "Thumbnail generation failed for $($_.Name)" }
}
