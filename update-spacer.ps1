# UPDATE NAVBAR SPACER HEIGHT
Write-Host "Updating navbar spacer height in all HTML files..." -ForegroundColor Green

$htmlFiles = Get-ChildItem -Filter "*.html" | Where-Object { 
    $_.Name -notlike "*backup*" -and 
    $_.Name -ne "navbar.html" -and 
    $_.Name -ne "footer.html" -and
    $_.Name -ne "footer_clean.html" -and
    $_.Name -ne "template.html"
}

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Update navbar spacer height
    $content = $content -replace 'navbar-spacer[^>]*style="height:\s*\d+px[^"]*"', 'navbar-spacer" style="height: 65px;"'
    
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        Write-Host "   SUCCESS: Updated spacer height" -ForegroundColor Green
    } else {
        Write-Host "   INFO: No spacer found or already correct" -ForegroundColor Gray
    }
}

Write-Host "`nNavbar spacer height update completed!" -ForegroundColor Green
