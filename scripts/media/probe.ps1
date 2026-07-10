$ErrorActionPreference = "Stop"
. "$PSScriptRoot/ffmpeg-path.ps1"
$repo = Resolve-Path "$PSScriptRoot/../.."
$ffprobe = Get-LemarkFfprobePath
$files = Get-ChildItem "$repo/public/media/lemark/selected/videos/*.mp4"
foreach ($file in $files) {
  Write-Host "`n$file"
  & $ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -show_entries format=duration -of json $file.FullName
}
