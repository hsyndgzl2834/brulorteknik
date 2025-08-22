# 🚀 NAVBAR CLEAN SCRIPT
Write-Host "🔧 Navbar Temizleme Başlatılıyor..." -ForegroundColor Green

# 1. Navbar.html temizle
Write-Host "`n📁 Navbar.html temizleniyor..." -ForegroundColor Cyan
$navbarContent = Get-Content "navbar.html" -Raw -Encoding UTF8
$navbarContent = $navbarContent.TrimEnd()
$navbarContent = $navbarContent -replace '\s*n\s*$', ''
$navbarContent | Set-Content -Path "navbar.html" -Encoding UTF8 -NoNewline
Write-Host "   ✅ Navbar.html temizlendi" -ForegroundColor Green

# 2. HTML dosyalarını temizle
$htmlFiles = Get-ChildItem -Filter "*.html" | Where-Object { $_.Name -notlike "*backup*" -and $_.Name -ne "navbar.html" -and $_.Name -ne "footer.html" }

Write-Host "`n📄 $($htmlFiles.Count) HTML dosyası işleniyor..." -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    Write-Host "🔄 $($file.Name)" -ForegroundColor Yellow
    
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
    
    # Fazla boş satırları temizle
    $content = $content -replace '\n\s*\n\s*\n+', "`n`n"
    
    if ($content -ne $original) {
        Copy-Item $file.FullName "$($file.Name).backup"
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        Write-Host "   ✅ Temizlendi" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Değişiklik yok" -ForegroundColor Gray
    }
}

Write-Host "`n🎉 TAMAMLANDI!" -ForegroundColor Green
