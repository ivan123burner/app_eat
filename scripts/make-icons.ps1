# Generates PWA icons into public/ (fried-egg logo on dark background).
# Usage: npm run icons   (or: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/make-icons.ps1)
Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\public"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-EggIcon {
  param([int]$Size, [string]$Path)

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(255, 28, 25, 23))  # dark ink background

  $white  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 247, 237))
  $yolk   = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
  $shine  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 251, 191, 36))

  $cx = [int]($Size / 2)
  $cy = [int]($Size * 0.54)
  $rx = [int]($Size * 0.36)
  $ry = [int]($Size * 0.30)
  $g.FillEllipse($white, $cx - $rx, $cy - $ry, $rx * 2, $ry * 2)

  $yr = [int]($Size * 0.145)
  $g.FillEllipse($yolk, $cx - $yr, $cy - $yr, $yr * 2, $yr * 2)

  $sr = [int]($Size * 0.05)
  $sx = $cx - $yr + [int]($Size * 0.035)
  $sy = $cy - $yr + [int]($Size * 0.03)
  $g.FillEllipse($shine, $sx, $sy, $sr * 2, $sr * 2)

  $g.Dispose()
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

New-EggIcon -Size 512 -Path (Join-Path $outDir "pwa-512x512.png")
New-EggIcon -Size 192 -Path (Join-Path $outDir "pwa-192x192.png")
New-EggIcon -Size 180 -Path (Join-Path $outDir "apple-touch-icon.png")
Write-Host "Icons created in $outDir"
