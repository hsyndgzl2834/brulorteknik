# Sayfalarda CSS ve Script sorunlarını kontrol eden script
Write-Host "CSS ve Script Sorunları Kontrol Ediliyor..." -ForegroundColor Cyan

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { 
    $_.Name -notin @("navbar.html", "footer.html", "test-navbar.html") 
}

$problemFiles = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $problems = @()
    
    # CSS sırası kontrolü
    if ($content -match 'main\.css.*bootstrap' -and $content -notmatch 'bootstrap.*main\.css') {
        $problems += "CSS sırası yanlış"
    }
    
    # Eski script yapısı kontrolü
    if ($content -match 'js/modules/navbar\.js' -and $content -notmatch 'js/components\.js') {
        $problems += "Eski script yapısı"
    }
    
    # Components.js eksik kontrolü
    if ($content -notmatch 'js/components\.js') {
        $problems += "Components.js eksik"
    }
    
    if ($problems.Count -gt 0) {
        $problemFiles += [PSCustomObject]@{
            File = $file.Name
            Problems = $problems -join ", "
        }
    }
}

if ($problemFiles.Count -gt 0) {
    Write-Host "`nSorunlu Dosyalar:" -ForegroundColor Red
    foreach ($problem in $problemFiles) {
        Write-Host "  $($problem.File): $($problem.Problems)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nTüm dosyalar düzgün!" -ForegroundColor Green
}
