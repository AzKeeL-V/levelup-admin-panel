$bytes = [System.IO.File]::ReadAllBytes('src/pages/Index.tsx')
$chars = @()
for ($i = 0; $i -lt 10 -and $i -lt $bytes.Length; $i++) {
    $chars += [char]$bytes[$i]
}
$chars -join ''
