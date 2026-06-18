Add-Type -AssemblyName System.Drawing
$width = 256
$height = 256
$bmp = New-Object System.Drawing.Bitmap $width, $height
$rand = New-Object System.Random

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $val = $rand.Next(0, 256)
        $color = [System.Drawing.Color]::FromArgb(15, $val, $val, $val)
        $bmp.SetPixel($x, $y, $color)
    }
}
$path = Join-Path $PSScriptRoot "img\pure_noise.png"
$bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Noise image generated at $path"
