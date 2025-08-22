# Quick CSS Fix Script
Write-Host "Fixing CSS loading issues across all pages..." -ForegroundColor Cyan

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { 
    $_.Name -notin @("navbar.html", "footer.html", "test-navbar.html") 
}

$fixedFiles = @()

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor White
    
    try {
        $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
        $originalContent = $content
        
        # Remove problematic CSS loading patterns
        $content = $content -replace 'media="print" onload="this\.media=''all''"', ''
        $content = $content -replace 'media="print"', ''
        
        # Ensure main.css comes after Bootstrap
        if ($content -match 'bootstrap' -and $content -match 'main\.css') {
            # Move main.css to load after bootstrap if it's not already
            $content = $content -replace '<link[^>]*css/main\.css[^>]*>\s*', ''
            $content = $content -replace '(<link[^>]*bootstrap[^>]*>)', '$1`n  <link rel="stylesheet" href="css/main.css">'
        }
        
        # Save if changed
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
            $fixedFiles += $file.Name
        } else {
            Write-Host "  No changes needed" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nCSS Fix completed!" -ForegroundColor Green
Write-Host "Fixed files: $($fixedFiles.Count)" -ForegroundColor Cyan
