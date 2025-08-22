# Premium Mobile Navbar Deployment Script
Write-Host "🚀 Premium Mobile Navbar Deployment başlatılıyor..." -ForegroundColor Cyan

# HTML dosyalarını bul
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { 
    $_.Name -notin @("navbar.html", "footer.html", "test-navbar.html") 
}

Write-Host "📄 Bulunan HTML dosyaları: $($htmlFiles.Count)" -ForegroundColor Green

$updatedFiles = @()
$skippedFiles = @()

foreach ($file in $htmlFiles) {
    Write-Host "`n🔄 İşleniyor: $($file.Name)" -ForegroundColor White
    
    try {
        $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
        $originalContent = $content
        $needsUpdate = $false
        
        # components.js kontrolü
        if ($content -notmatch 'components\.js') {
            Write-Host "  ⚙️ Components.js ekleniyor..." -ForegroundColor Yellow
            
            # Bootstrap 5 ekle
            if ($content -notmatch 'bootstrap@5\.3\.2') {
                $content = $content -replace '(<head[^>]*>)', '$1`n    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">'
            }
            
            # Font Awesome ekle
            if ($content -notmatch 'font-awesome') {
                $content = $content -replace '(<head[^>]*>)', '$1`n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'
            }
            
            # AOS library ekle
            if ($content -notmatch 'aos\.css') {
                $content = $content -replace '(<head[^>]*>)', '$1`n    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">'
            }
            
            # Viewport meta tag ekle
            if ($content -notmatch 'viewport') {
                $content = $content -replace '(<head[^>]*>)', '$1`n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
            }
            
            # Navbar container ekle
            if ($content -notmatch 'navbar-container') {
                $content = $content -replace '(<body[^>]*>)', '$1`n    <div id="navbar-container"></div>'
            }
            
            # Footer container ekle
            if ($content -notmatch 'footer-container') {
                $content = $content -replace '(</body>)', '    <div id="footer-container"></div>`n$1'
            }
            
            # Scripts ekle
            $content = $content -replace '(</body>)', '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`n    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`n    <script src="js/components.js"></script>`n    <script src="js/main.js"></script>`n$1'
            
            $needsUpdate = $true
        } else {
            Write-Host "  ✅ components.js zaten mevcut" -ForegroundColor Green
        }
        
        # Değişiklik varsa kaydet
        if ($needsUpdate -and $content -ne $originalContent) {
            # Backup oluştur
            $backupName = "$($file.BaseName)_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').html"
            Copy-Item -Path $file.FullName -Destination $backupName
            Write-Host "  💾 Backup: $backupName" -ForegroundColor Magenta
            
            # Güncellenmiş içeriği yaz
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  ✅ Güncellendi: $($file.Name)" -ForegroundColor Green
            $updatedFiles += $file.Name
        } else {
            Write-Host "  ⏭️ Değişiklik gerekmiyor" -ForegroundColor Gray
            $skippedFiles += $file.Name
        }
        
    } catch {
        Write-Host "  ❌ Hata: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Sonuç raporu
Write-Host "`n📊 DEPLOYMENT RAPORU" -ForegroundColor Cyan
Write-Host "✅ Güncellenen: $($updatedFiles.Count)" -ForegroundColor Green
Write-Host "⏭️ Atlanan: $($skippedFiles.Count)" -ForegroundColor Yellow
Write-Host "🎉 Premium Mobile Navbar deployment tamamlandı!" -ForegroundColor Green
