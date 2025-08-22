# CSS Loading Fix Script
Write-Host "Fixing CSS loading issues..." -ForegroundColor Cyan

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { 
    $_.Name -notin @("navbar.html", "footer.html", "test-navbar.html") 
}

$fixedFiles = @()

foreach ($file in $htmlFiles) {
    Write-Host "Checking: $($file.Name)" -ForegroundColor White
    
    try {
        $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
        $originalContent = $content
        $needsUpdate = $false
        
        # Check if main.css is loaded properly in head
        if ($content -match '<head[^>]*>' -and $content -notmatch '<head[^>]*>[\s\S]*?<link[^>]*css/main\.css[^>]*>[\s\S]*?</head>') {
            Write-Host "  CSS not in head properly - fixing..." -ForegroundColor Yellow
            
            # Remove existing main.css links that might be in wrong places
            $content = $content -replace '<link[^>]*css/main\.css[^>]*>\s*', ''
            $content = $content -replace '<noscript><link[^>]*css/main\.css[^>]*></noscript>\s*', ''
            
            # Add CSS link right after head tag
            $content = $content -replace '(<head[^>]*>)', '$1`n    <link rel="stylesheet" href="css/main.css">'
            
            $needsUpdate = $true
        }
        
        # Ensure components.js is loaded after main.css
        if ($content -match 'components\.js' -and $content -notmatch '<link[^>]*css/main\.css[^>]*>[\s\S]*?<script[^>]*components\.js') {
            Write-Host "  Fixing CSS/JS loading order..." -ForegroundColor Yellow
            $needsUpdate = $true
        }
        
        # Save if changed
        if ($needsUpdate -and $content -ne $originalContent) {
            $backupName = "$($file.BaseName)_css_backup.html"
            Copy-Item -Path $file.FullName -Destination $backupName
            
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
            $fixedFiles += $file.Name
        } else {
            Write-Host "  OK: $($file.Name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nCSS Fix completed!" -ForegroundColor Green
Write-Host "Fixed files: $($fixedFiles.Count)" -ForegroundColor Cyan
foreach ($file in $fixedFiles) {
    Write-Host "  - $file" -ForegroundColor White
}
