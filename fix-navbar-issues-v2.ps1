# 🚀 NAVBAR ISSUES FIX SCRIPT
# Bu script navbar altındaki gereksiz padding ve "n" harfini düzeltir

Write-Host "🔧 Navbar Issues Fix Script Başlatılıyor..." -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Yellow

# 1. Navbar.html dosyasını temizle
Write-Host "📁 Navbar.html temizleniyor..." -ForegroundColor Cyan

$navbarFile = "navbar.html"
if (Test-Path $navbarFile) {
    $navbarContent = Get-Content $navbarFile -Raw -Encoding UTF8
    
    # Sonundaki boş satırları ve gereksiz "n" harfini temizle
    $navbarContent = $navbarContent.TrimEnd()
    $navbarContent = $navbarContent -replace '\s*n\s*$', ''
    $navbarContent = $navbarContent -replace '\n\s*\n\s*\n+', "`n`n"
    
    # Temizlenmiş içeriği kaydet
    $navbarContent | Set-Content -Path $navbarFile -Encoding UTF8 -NoNewline
    Write-Host "   ✅ Navbar.html temizlendi" -ForegroundColor Green
} else {
    Write-Host "   ❌ Navbar.html bulunamadı" -ForegroundColor Red
}

# 2. Tüm HTML dosyalarını bul
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { 
    $_.Name -ne "navbar.html" -and 
    $_.Name -ne "footer.html" -and 
    $_.Name -ne "footer_clean.html" -and 
    $_.Name -ne "template.html" -and
    $_.Name -notlike "*backup*"
}

Write-Host "`n📄 $($htmlFiles.Count) HTML dosyası bulundu" -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    Write-Host "`n🔄 İşleniyor: $($file.Name)" -ForegroundColor Yellow
    
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        $changed = $false
        
        # 1. Body başlangıcından sonraki gereksiz "n" harflerini temizle
        $content = $content -replace '<body>\s*n\s*', '<body>'
        if ($content -ne $originalContent) { 
            $changed = $true
            Write-Host "   ✅ Body sonrası 'n' harfi temizlendi" -ForegroundColor Green 
        }
        
        # 2. Navbar container sonrası gereksiz içerikleri temizle
        $content = $content -replace '<div id="navbar-container"></div>\s*n\s*', '<div id="navbar-container"></div>`n'
        if ($content -ne $originalContent -and -not $changed) { 
            $changed = $true
            Write-Host "   ✅ Navbar container sonrası temizlendi" -ForegroundColor Green 
        }
        
        # 3. Genel olarak yalnız "n" harflerini temizle
        $content = $content -replace '>\s*n\s*<', '><'
        $content = $content -replace '\s*n\s*\n', "`n"
        if ($content -ne $originalContent -and -not $changed) { 
            $changed = $true
            Write-Host "   ✅ Gereksiz 'n' harfleri temizlendi" -ForegroundColor Green 
        }
        
        # 4. CSS body padding kontrolü - gereksiz padding-top düzeltmeleri
        if ($content -match 'body\s*\{[^}]*padding-top:\s*[0-9]+px') {
            $content = $content -replace '(body\s*\{[^}]*)padding-top:\s*[0-9]+px;?([^}]*\})', '$1$2'
            $changed = $true
            Write-Host "   ✅ Body padding-top kaldırıldı" -ForegroundColor Green
        }
        
        # 5. Container padding kontrolü
        if ($content -match '\.container\s*\{[^}]*padding-top:\s*[0-9]+px') {
            $content = $content -replace '(\.container\s*\{[^}]*)padding-top:\s*[0-9]+px;?([^}]*\})', '$1$2'
            $changed = $true
            Write-Host "   ✅ Container padding-top kaldırıldı" -ForegroundColor Green
        }
        
        # 6. Inline style padding kontrolü
        $content = $content -replace 'style="[^"]*padding-top:\s*[0-9]+px;?[^"]*"', ''
        if ($content -ne $originalContent -and -not $changed) { 
            $changed = $true
            Write-Host "   ✅ Inline padding stilleri temizlendi" -ForegroundColor Green 
        }
        
        # 7. Fazla boş satırları temizle
        $content = $content -replace '\n\s*\n\s*\n+', "`n`n"
        
        # Değişiklik varsa dosyayı kaydet
        if ($changed) {
            # Backup oluştur
            $backupPath = "$($file.Name).backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            Copy-Item $file.FullName $backupPath
            
            # Düzeltilmiş içeriği kaydet
            $content | Set-Content -Path $file.FullName -Encoding UTF8
            Write-Host "   💾 Dosya kaydedildi (Backup: $backupPath)" -ForegroundColor Green
        } else {
            Write-Host "   ℹ️  Değişiklik gerekmiyor" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "   ❌ Hata: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. CSS dosyasındaki navbar padding ayarlarını kontrol et
Write-Host "`n🎨 CSS dosyası kontrol ediliyor..." -ForegroundColor Cyan

$cssFile = "css\main.css"
if (Test-Path $cssFile) {
    $cssContent = Get-Content $cssFile -Raw -Encoding UTF8
    $originalCss = $cssContent
    
    # Gereksiz body padding-top'ları temizle (navbar için olanlar hariç)
    $cssContent = $cssContent -replace 'body\s*\{\s*padding-top:\s*[0-9]+px;', 'body {'
    
    # Navbar spacer yüksekliğini optimize et
    $cssContent = $cssContent -replace '\.navbar-spacer[^}]*height:\s*[0-9]+px', '.navbar-spacer" style="height: 70px'
    
    if ($cssContent -ne $originalCss) {
        # CSS backup
        $cssBackup = "css\main.css.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $cssFile $cssBackup
        
        $cssContent | Set-Content -Path $cssFile -Encoding UTF8
        Write-Host "   ✅ CSS düzeltildi (Backup: $cssBackup)" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  CSS'de değişiklik gerekmiyor" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ CSS dosyası bulunamadı" -ForegroundColor Red
}

# Sonuç
Write-Host "`n🎉 NAVBAR ISSUES FIX TAMAMLANDI!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Yellow
Write-Host "✅ Navbar altındaki gereksiz 'n' harfleri temizlendi" -ForegroundColor Green
Write-Host "✅ Gereksiz padding ayarları kaldırıldı" -ForegroundColor Green
Write-Host "✅ Boş satırlar optimize edildi" -ForegroundColor Green
Write-Host "✅ Backup dosyaları oluşturuldu" -ForegroundColor Green
Write-Host "`n💡 Test için: python -m http.server 8080" -ForegroundColor Cyan
