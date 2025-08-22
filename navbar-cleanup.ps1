# PROFESSIONAL NAVBAR CLEANUP SCRIPT
# This script fixes padding issues and removes unwanted 'n' characters from navbar

Write-Host "Starting Navbar Cleanup Process..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Yellow

# Step 1: Clean navbar.html file
Write-Host "`nCleaning navbar.html file..." -ForegroundColor Cyan

if (Test-Path "navbar.html") {
    $navbarContent = Get-Content "navbar.html" -Raw -Encoding UTF8
    
    # Remove trailing whitespace and orphaned 'n' characters
    $navbarContent = $navbarContent.TrimEnd()
    $navbarContent = $navbarContent -replace '\s*n\s*$', ''
    $navbarContent = $navbarContent -replace '\n\s*\n\s*\n+', "`n`n"
    
    # Save cleaned content
    $navbarContent | Set-Content -Path "navbar.html" -Encoding UTF8 -NoNewline
    Write-Host "   SUCCESS: navbar.html cleaned" -ForegroundColor Green
} else {
    Write-Host "   ERROR: navbar.html not found" -ForegroundColor Red
}

# Step 2: Process all HTML files
$htmlFiles = Get-ChildItem -Filter "*.html" | Where-Object { 
    $_.Name -notlike "*backup*" -and 
    $_.Name -ne "navbar.html" -and 
    $_.Name -ne "footer.html" -and
    $_.Name -ne "footer_clean.html" -and
    $_.Name -ne "template.html"
}

Write-Host "`nProcessing $($htmlFiles.Count) HTML files..." -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        $hasChanges = $false
        
        # Remove orphaned 'n' characters after body tag
        $content = $content -replace '<body>\s*n\s*', '<body>`n'
        if ($content -ne $originalContent) { $hasChanges = $true }
        
        # Remove orphaned 'n' characters between tags
        $content = $content -replace '>\s*n\s*<', '>`n<'
        if ($content -ne $originalContent) { $hasChanges = $true }
        
        # Remove orphaned 'n' characters in lines
        $content = $content -replace '\s*n\s*\n', "`n"
        if ($content -ne $originalContent) { $hasChanges = $true }
        
        # Clean navbar container area
        $content = $content -replace '<div id="navbar-container"></div>\s*n\s*', '<div id="navbar-container"></div>`n'
        if ($content -ne $originalContent) { $hasChanges = $true }
        
        # Remove excessive padding-top styles
        $content = $content -replace 'style="[^"]*padding-top:\s*[0-9]+px[^"]*"', ''
        if ($content -ne $originalContent) { $hasChanges = $true }
        
        # Clean multiple empty lines
        $content = $content -replace '\n\s*\n\s*\n+', "`n`n"
        if ($content -ne $originalContent) { $hasChanges = $true }
        
        # Save changes if any
        if ($hasChanges) {
            # Create backup
            $backupName = "$($file.Name).backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            Copy-Item $file.FullName $backupName
            
            # Save cleaned content
            $content | Set-Content -Path $file.FullName -Encoding UTF8
            Write-Host "   SUCCESS: Cleaned and saved (Backup: $backupName)" -ForegroundColor Green
        } else {
            Write-Host "   INFO: No changes needed" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 3: Check and fix CSS padding issues
Write-Host "`nChecking CSS file..." -ForegroundColor Cyan

$cssFile = "css\main.css"
if (Test-Path $cssFile) {
    $cssContent = Get-Content $cssFile -Raw -Encoding UTF8
    $originalCss = $cssContent
    
    # Fix excessive body padding that conflicts with navbar
    $cssContent = $cssContent -replace 'body\s*\{\s*padding-top:\s*[0-9]+px;', 'body {'
    
    # Optimize navbar spacer height
    if ($cssContent -match '\.navbar-spacer.*height:\s*([0-9]+)px') {
        $height = [int]$Matches[1]
        if ($height -gt 80) {
            $cssContent = $cssContent -replace '(\.navbar-spacer[^}]*height:\s*)[0-9]+px', '${1}70px'
        }
    }
    
    if ($cssContent -ne $originalCss) {
        # Create CSS backup
        $cssBackup = "css\main.css.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $cssFile $cssBackup
        
        $cssContent | Set-Content -Path $cssFile -Encoding UTF8
        Write-Host "   SUCCESS: CSS optimized (Backup: $cssBackup)" -ForegroundColor Green
    } else {
        Write-Host "   INFO: CSS is already optimized" -ForegroundColor Gray
    }
} else {
    Write-Host "   ERROR: CSS file not found" -ForegroundColor Red
}

# Summary
Write-Host "`nNAVBAR CLEANUP COMPLETED" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Yellow
Write-Host "- Removed orphaned 'n' characters" -ForegroundColor White
Write-Host "- Fixed excessive padding issues" -ForegroundColor White
Write-Host "- Optimized empty lines" -ForegroundColor White
Write-Host "- Created backup files" -ForegroundColor White
Write-Host "`nTest your changes: python -m http.server 8080" -ForegroundColor Cyan
Write-Host "Then visit: http://localhost:8080" -ForegroundColor Cyan
