# PRODUCT PAGES NAVBAR STANDARDIZATION SCRIPT
# Bu script tum urun sayfalarinda navbar'i standardize eder

Write-Host "Product Pages Navbar Standardization Starting..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Yellow

# Urun sayfalarini listele
$productFiles = @(
    "products.html",
    "monoblok.html", 
    "duoblok.html",
    "multiblok.html",
    "emniyet-valfi.html",
    "valf-aktuatoru.html",
    "gaz-basinç-regulatoru.html",
    "yanma-analizoru.html",
    "filtre.html",
    "prosesstat.html"
)

# Standart navbar HTML'ini oku
$standardNavbar = Get-Content "navbar.html" -Raw -Encoding UTF8

foreach ($file in $productFiles) {
    if (Test-Path $file) {
        Write-Host "`nProcessing: $file" -ForegroundColor Yellow
        
        try {
            $content = Get-Content $file -Raw -Encoding UTF8
            $originalContent = $content
            $hasChanges = $false
            
            # 1. Eski navbar'i kaldir (cesitli varyasyonlari)
            # Nav elementini bul ve degistir
            $content = $content -replace '<nav[^>]*>.*?</nav>\s*', ''
            $content = $content -replace '<!-- Navbar.*?-->\s*', ''
            $content = $content -replace '<div class="navbar-spacer"[^>]*></div>\s*', ''
            
            # 2. Navbar container'dan sonra standart navbar'i ekle
            if ($content -match '<div id="navbar-container"></div>') {
                $content = $content -replace '<div id="navbar-container"></div>', "<div id=`"navbar-container`"></div>`n$standardNavbar"
                $hasChanges = $true
                Write-Host "   SUCCESS: Standard navbar added" -ForegroundColor Green
            } else {
                # Navbar container yoksa body'den sonra ekle
                if ($content -match '<body[^>]*>') {
                    $bodyMatch = $Matches[0]
                    $replacement = "$bodyMatch`n  <div id=`"navbar-container`"></div>`n$standardNavbar"
                    $content = $content -replace [regex]::Escape($bodyMatch), $replacement
                    $hasChanges = $true
                    Write-Host "   SUCCESS: Navbar container and standard navbar added" -ForegroundColor Green
                }
            }
            
            # 3. CSS import kontrolu - Bootstrap ve main.css'in dogru sirada oldugunu kontrol et
            if ($content -match '<head>') {
                # Bootstrap CSS'in main.css'den once yuklenmesini sagla
                if ($content -notmatch 'bootstrap.*css' -or $content -notmatch 'main\.css') {
                    # CSS linklerini head'e ekle (yoksa)
                    $headEnd = $content.IndexOf('</head>')
                    if ($headEnd -gt 0) {
                        $cssLinks = @"
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Main CSS -->
  <link rel="stylesheet" href="css/main.css">
"@
                        $content = $content.Insert($headEnd, $cssLinks + "`n")
                        $hasChanges = $true
                        Write-Host "   SUCCESS: CSS links added" -ForegroundColor Green
                    }
                }
            }
            
            # 4. JavaScript import kontrolu - components.js ve main.js'in oldugunu kontrol et
            if ($content -match '</body>') {
                if ($content -notmatch 'components\.js' -or $content -notmatch 'main\.js') {
                    # JS dosyalarini body'nin sonuna ekle
                    $bodyEndIndex = $content.LastIndexOf('</body>')
                    if ($bodyEndIndex -gt 0) {
                        $jsLinks = @"
  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Components JS -->
  <script src="js/components.js"></script>
  <!-- Main JS -->
  <script src="js/main.js"></script>
"@
                        $content = $content.Insert($bodyEndIndex, $jsLinks + "`n")
                        $hasChanges = $true
                        Write-Host "   SUCCESS: JavaScript links added" -ForegroundColor Green
                    }
                }
            }
            
            # 5. Fazla bos satirlari temizle
            $content = $content -replace '\n\s*\n\s*\n+', "`n`n"
            
            # Degisiklik varsa dosyayi kaydet
            if ($hasChanges -or ($content -ne $originalContent)) {
                # Backup olustur
                $backupPath = "$file.navbar-fix-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
                Copy-Item $file $backupPath
                
                # Duzeltilmis icerigi kaydet
                $content | Set-Content -Path $file -Encoding UTF8
                Write-Host "   SAVED: File updated (Backup: $backupPath)" -ForegroundColor Green
            } else {
                Write-Host "   INFO: No changes needed" -ForegroundColor Gray
            }
            
        } catch {
            Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "   WARNING: File not found - $file" -ForegroundColor Yellow
    }
}

Write-Host "`nPRODUCT PAGES NAVBAR STANDARDIZATION COMPLETED" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Yellow
Write-Host "- All product pages now use standard navbar" -ForegroundColor White
Write-Host "- CSS and JavaScript imports standardized" -ForegroundColor White
Write-Host "- Backup files created for safety" -ForegroundColor White
Write-Host "`nTest your changes: python -m http.server 8082" -ForegroundColor Cyan
