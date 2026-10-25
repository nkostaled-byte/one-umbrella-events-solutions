$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $projectRoot
try {
  node remotion/render-intro.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Card preparation failed.' }

  $ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
  $inputArgs = @()
  for ($i = 0; $i -lt 6; $i++) {
    $inputArgs += @('-loop', '1', '-framerate', '30', '-t', '3.7', '-i', "remotion/.render/card-$i.png")
  }

  $filterGraph = [System.IO.File]::ReadAllText('remotion/.render/filters.txt')
  & $ffmpeg -y @inputArgs -filter_complex $filterGraph -map '[x5]' -an -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart 'public/one-umbrella-intro.mp4'
  if ($LASTEXITCODE -ne 0) { throw 'FFmpeg render failed.' }
}
finally {
  Pop-Location
}
