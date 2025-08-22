# ============================================================================
# 🚀 NAVBAR MODERNIZATION SCRIPT
# Tüm HTML sayfalarında modern navbar'a geçiş yapar
# ============================================================================

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🚀 Navbar Modernization Script" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# HTML dosyalarını bul
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { $_.Name -ne "navbar.html" -and $_.Name -ne "footer.html" -and $_.Name -ne "footer_clean.html" -and $_.Name -ne "template.html" }

Write-Host "📋 Bulunan HTML dosyaları: $($htmlFiles.Count)" -ForegroundColor Green
$htmlFiles | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Gray }
Write-Host ""

$updatedCount = 0
$errorCount = 0

foreach ($file in $htmlFiles) {
    try {
        Write-Host "🔄 İşleniyor: $($file.Name)" -ForegroundColor Yellow
        
        # Dosya içeriğini oku
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Navbar class değişimi: navbar-custom -> navbar-professional
        $oldNavbar = 'class="navbar navbar-expand-lg navbar-custom"'
        $newNavbar = 'class="navbar navbar-expand-lg navbar-professional fixed-top"'
        
        if ($content -match [regex]::Escape($oldNavbar)) {
            $content = $content -replace [regex]::Escape($oldNavbar), $newNavbar
            Write-Host "   ✅ Navbar class güncellendi" -ForegroundColor Green
        }
        
        # navbar-custom classını navbar-professional ile değiştir
        $content = $content -replace 'navbar-custom', 'navbar-professional'
        
        # Eski toggle button yapısını yeni modern toggle ile değiştir
        $oldToggle = '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Menüyü aç/kapat">
      <span class="navbar-toggler-icon"></span>
    </button>'
        
        $newToggle = '<button class="navbar-toggler modern-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" 
            aria-controls="navbarContent" aria-expanded="false" aria-label="Navigasyon menüsünü aç/kapat">
      <span class="toggler-line"></span>
      <span class="toggler-line"></span>
      <span class="toggler-line"></span>
    </button>'
        
        if ($content -match [regex]::Escape($oldToggle)) {
            $content = $content -replace [regex]::Escape($oldToggle), $newToggle
            Write-Host "   ✅ Toggle button modernize edildi" -ForegroundColor Green
        }
        
        # navbarNav -> navbarContent değişimi
        $content = $content -replace 'data-bs-target="#navbarNav"', 'data-bs-target="#navbarContent"'
        $content = $content -replace 'aria-controls="navbarNav"', 'aria-controls="navbarContent"'
        $content = $content -replace 'id="navbarNav"', 'id="navbarContent"'
        
        # Navbar spacer ekle (fixed navbar için)
        if ($content -notmatch 'navbar-spacer') {
            $spacer = "`n<!-- Navbar Spacer (Fixed navbar için) -->`n<div class=`"navbar-spacer`" style=`"height: 80px;`"></div>`n"
            
            # Body tag'ından sonra spacer ekle
            $bodyPattern = '(<body[^>]*>)'
            if ($content -match $bodyPattern) {
                $content = $content -replace $bodyPattern, ('$1' + $spacer)
                Write-Host "   ✅ Navbar spacer eklendi" -ForegroundColor Green
            }
        }
        
        # Modern navbar kullanıyorsa role ve aria-label ekle
        if ($content -match 'navbar-professional') {
            $content = $content -replace '<nav class="navbar navbar-expand-lg navbar-professional fixed-top">', '<nav class="navbar navbar-expand-lg navbar-professional fixed-top" role="navigation" aria-label="Ana navigasyon">'
        }
        
        # Dosyayı kaydet
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        
        Write-Host "   ✅ $($file.Name) güncellendi!" -ForegroundColor Green
        $updatedCount++
        
    } catch {
        Write-Host "   ❌ Hata: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host ""
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "📊 ÖZET RAPOR" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Başarıyla güncellenen: $updatedCount dosya" -ForegroundColor Green
Write-Host "❌ Hatalı: $errorCount dosya" -ForegroundColor Red
Write-Host "📁 Toplam işlenen: $($htmlFiles.Count) dosya" -ForegroundColor Blue
Write-Host ""

if ($updatedCount -gt 0) {
    Write-Host "🎉 Navbar modernizasyonu tamamlandı!" -ForegroundColor Green
    Write-Host "🔧 Değişiklikler:" -ForegroundColor Yellow
    Write-Host "   • navbar-custom → navbar-professional" -ForegroundColor Gray
    Write-Host "   • Eski toggle → Modern animasyonlu toggle" -ForegroundColor Gray
    Write-Host "   • Fixed navbar için spacer eklendi" -ForegroundColor Gray
    Write-Host "   • Accessibility iyileştirmeleri" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Hiçbir dosya güncellenmedi!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Script tamamlandı!" -ForegroundColor Cyan
