function Get-LemarkFfmpegPath {
  $command = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($command) { return $command.Source }

  $candidate = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter ffmpeg.exe -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  if (-not $candidate) { throw "ffmpeg not found. Install Gyan.FFmpeg with WinGet." }
  return $candidate
}

function Get-LemarkFfprobePath {
  $ffmpeg = Get-LemarkFfmpegPath
  return Join-Path (Split-Path $ffmpeg) "ffprobe.exe"
}
