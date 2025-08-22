Write-Host "Premium Mobile Navbar Deployment Starting..." -ForegroundColor Cyan

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { 
    $_.Name -notin @("navbar.html", "footer.html", "test-navbar.html") 
}

Write-Host "Found HTML files: $($htmlFiles.Count)" -ForegroundColor Green

$updatedFiles = @()

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor White
    
    try {
        $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
        $originalContent = $content
        
        # Check if components.js already exists
        if ($content -match 'components\.js') {
            Write-Host "  Already has components.js - skipping" -ForegroundColor Green
            continue
        }
        
        # Add Bootstrap 5
        if ($content -notmatch 'bootstrap@5\.3\.2') {
            $content = $content -replace '(<head[^>]*>)', '$1`n    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">'
        }
        
        # Add Font Awesome
        if ($content -notmatch 'font-awesome') {
            $content = $content -replace '(<head[^>]*>)', '$1`n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'
        }
        
        # Add AOS
        if ($content -notmatch 'aos\.css') {
            $content = $content -replace '(<head[^>]*>)', '$1`n    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">'
        }
        
        # Add viewport
        if ($content -notmatch 'viewport') {
            $content = $content -replace '(<head[^>]*>)', '$1`n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        }
        
        # Add navbar container
        if ($content -notmatch 'navbar-container') {
            $content = $content -replace '(<body[^>]*>)', '$1`n    <div id="navbar-container"></div>'
        }
        
        # Add footer container
        if ($content -notmatch 'footer-container') {
            $content = $content -replace '(</body>)', '    <div id="footer-container"></div>`n$1'
        }
        
        # Add scripts
        $content = $content -replace '(</body>)', '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>`n    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`n    <script src="js/components.js"></script>`n    <script src="js/main.js"></script>`n$1'
        
        # Save if changed
        if ($content -ne $originalContent) {
            # Create backup
            $backupName = "$($file.BaseName)_backup.html"
            Copy-Item -Path $file.FullName -Destination $backupName
            
            # Save updated content
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
            $updatedFiles += $file.Name
        }
        
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nDeployment completed!" -ForegroundColor Green
Write-Host "Updated files: $($updatedFiles.Count)" -ForegroundColor Cyan
foreach ($file in $updatedFiles) {
    Write-Host "  - $file" -ForegroundColor White
}
