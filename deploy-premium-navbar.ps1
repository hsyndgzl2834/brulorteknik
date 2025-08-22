# Premium Mobile Navbar Deployment Script
# Bu script tüm HTML sayfalarında mobil navbar'ı güncelleyecek

Write-Host "🚀 Premium Mobile Navbar Deployment başlatılıyor..." -ForegroundColor Cyan

# Çalışma dizinini kontrol et
$workDir = Get-Location
Write-Host "📁 Çalışma dizini: $workDir" -ForegroundColor Yellow

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
        
        # components.js kullanıp kullanmadığını kontrol et
        if ($content -match 'components\.js') {
            Write-Host "  ✅ components.js zaten mevcut - güncelleme gerekmiyor" -ForegroundColor Green
            $skippedFiles += $file.Name
            continue
        }
        
        # Bootstrap 5 kontrolü
        if ($content -notmatch 'bootstrap@5\.3\.2') {
            Write-Host "  ⚠️ Bootstrap 5.3.2 bulunamadı - ekleniyor..." -ForegroundColor Yellow
            
            # Head section'da Bootstrap CSS ekle
            $content = $content -replace '(<head[^>]*>)', 
                '$1`n    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">'
            
            # Body sonunda Bootstrap JS ekle
            $content = $content -replace '(</body>)', 
                '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`n$1'
        }
        
        # Font Awesome kontrolü
        if ($content -notmatch 'font-awesome') {
            Write-Host "  📝 Font Awesome ekleniyor..." -ForegroundColor Yellow
            $content = $content -replace '(<head[^>]*>)', 
                '$1`n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'
        }
        
        # Navbar container kontrolü ve ekleme
        if ($content -notmatch 'navbar-container') {
            Write-Host "  🏗️ Navbar container ekleniyor..." -ForegroundColor Yellow
            $content = $content -replace '(<body[^>]*>)', '$1`n    <div id="navbar-container"></div>'
        }
        
        # Footer container kontrolü ve ekleme  
        if ($content -notmatch 'footer-container') {
            Write-Host "  🦶 Footer container ekleniyor..." -ForegroundColor Yellow
            $content = $content -replace '(</body>)', '    <div id="footer-container"></div>`n$1'
        }
        
        # Components.js ekleme
        if ($content -notmatch 'components\.js') {
            Write-Host "  ⚙️ Components.js ekleniyor..." -ForegroundColor Yellow
            $content = $content -replace '(</body>)', 
                '    <script src="js/components.js"></script>`n    <script src="js/main.js"></script>`n$1'
        }
        
        # AOS library ekleme (animasyonlar için)
        if ($content -notmatch 'aos\.css') {
            Write-Host "  ✨ AOS animasyon library ekleniyor..." -ForegroundColor Yellow
            $content = $content -replace '(<head[^>]*>)', 
                '$1`n    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">'
            $content = $content -replace '(</body>)', 
                '    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`n$1'
        }
        
        # Manuel navbar/footer yüklemelerini kaldır
        $content = $content -replace '<script[^>]*navbar[^>]*>.*?</script>\s*', ''
        $content = $content -replace '<script[^>]*footer[^>]*>.*?</script>\s*', ''
        
        # Eski navbar HTML'lerini kaldır
        $content = $content -replace '<nav[^>]*navbar[^>]*>.*?</nav>\s*', ''
        $content = $content -replace '<footer[^>]*>.*?</footer>\s*', ''
        
        # Meta viewport kontrolü (mobil uyumluluk için)
        if ($content -notmatch 'viewport') {
            Write-Host "  📱 Viewport meta tag ekleniyor..." -ForegroundColor Yellow
            $content = $content -replace '(<head[^>]*>)', 
                '$1`n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        }
        }
        
        # Değişiklik oldu mu kontrol et
        if ($content -ne $originalContent) {
            # Backup oluştur
            $backupName = "$($file.BaseName)_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').html"
            Copy-Item -Path $file.FullName -Destination $backupName
            Write-Host "  💾 Backup oluşturuldu: $backupName" -ForegroundColor Magenta
            
            # Güncellenmiş içeriği yaz
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  ✅ Başarıyla güncellendi: $($file.Name)" -ForegroundColor Green
            $updatedFiles += $file.Name
        } else {
            Write-Host "  ⏭️ Değişiklik gerekmiyor: $($file.Name)" -ForegroundColor Gray
            $skippedFiles += $file.Name
        }
        
    } catch {
        Write-Host "  ❌ Hata oluştu: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Sonuç raporu
Write-Host "`n📊 DEPLOYMENT RAPORU" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "✅ Güncellenen dosyalar ($($updatedFiles.Count)):" -ForegroundColor Green
foreach ($file in $updatedFiles) {
    Write-Host "   • $file" -ForegroundColor White
}

Write-Host "`n⏭️ Atlanan dosyalar ($($skippedFiles.Count)):" -ForegroundColor Yellow  
foreach ($file in $skippedFiles) {
    Write-Host "   • $file" -ForegroundColor Gray
}

Write-Host "`n🎉 Premium Mobile Navbar deployment tamamlandı!" -ForegroundColor Green
Write-Host "💡 Şimdi tüm sayfalar modern mobil navbar kullanacak." -ForegroundColor Cyan

# Test önerisi
Write-Host "`n🧪 TEST ÖNERİSİ:" -ForegroundColor Yellow
Write-Host "Aşağıdaki komutla test sunucusu başlatabilirsiniz:" -ForegroundColor White
Write-Host "python -m http.server 8080" -ForegroundColor Magenta
