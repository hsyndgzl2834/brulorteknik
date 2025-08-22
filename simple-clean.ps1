# NAVBAR CLEAN SCRIPT
Write-Host "Navbar Temizleme Baslatiliyor..." -ForegroundColor Green

# 1. Navbar.html temizle
Write-Host "Navbar.html temizleniyor..." -ForegroundColor Cyan
$navbarContent = Get-Content "navbar.html" -Raw -Encoding UTF8
$navbarContent = $navbarContent.TrimEnd()
$navbarContent = $navbarContent -replace '\s*n\s*$', ''
$navbarContent | Set-Content -Path "navbar.html" -Encoding UTF8 -NoNewline
Write-Host "Navbar.html temizlendi" -ForegroundColor Green

# 2. HTML dosyalarini temizle
$htmlFiles = Get-ChildItem -Filter "*.html" | Where-Object { 
    $_.Name -notlike "*backup*" -and 
    $_.Name -ne "navbar.html" -and 
    $_.Name -ne "footer.html" 
}

Write-Host "$($htmlFiles.Count) HTML dosyasi isleniyor..." -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    Write-Host "Isleniyor: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    # Gereksiz n harflerini temizle
    $content = $content -replace '<body>\s*n\s*', '<body>'
    $content = $content -replace '>\s*n\s*<', '><'
    $content = $content -replace '\s*n\s*\n', "`n"
    $content = $content -replace '<div id="navbar-container"></div>\s*n\s*', '<div id="navbar-container"></div>`n'
    
    # Gereksiz padding temizle
    $content = $content -replace 'style="[^"]*padding-top:\s*[0-9]+px[^"]*"', 'style=""'
    $content = $content -replace 'style=""', ''
    
    # Fazla bos satirlari temizle
    $content = $content -replace '\n\s*\n\s*\n+', "`n`n"
    
    if ($content -ne $original) {
        Copy-Item $file.FullName "$($file.Name).backup"
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        Write-Host "Temizlendi: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "Degisiklik yok: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "TAMAMLANDI!" -ForegroundColor Green
