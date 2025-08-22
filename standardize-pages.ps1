# PowerShell Script to standardize navbar/footer loading across all HTML pages
# This script adds components.js and removes manual loading code

$pages = @(
    "monoblok.html",
    "multiblok.html", 
    "brulor-hakkinda.html",
    "emniyet-valfi.html",
    "filtre.html",
    "gaz-basinç-regulatoru.html",
    "valf-aktuatoru.html",
    "yanma-analizoru.html",
    "faq.html",
    "privacy.html"
)

Write-Host "🚀 Starting bulk HTML standardization..." -ForegroundColor Green

foreach ($page in $pages) {
    if (Test-Path $page) {
        Write-Host "📄 Processing: $page" -ForegroundColor Yellow
        
        $content = Get-Content $page -Raw
        
        # Check if components.js is already present
        if ($content -notmatch "components\.js") {
            Write-Host "   ➕ Adding components.js..." -ForegroundColor Cyan
            
            # Add components.js after navbar.js
            $content = $content -replace '(<script src="js/modules/navbar\.js"></script>\s*)', '$1<script src="js/components.js" defer></script>'
            
            # Remove manual navbar/footer loading blocks
            Write-Host "   🗑️ Removing manual loading code..." -ForegroundColor Cyan
            
            # Remove DOMContentLoaded blocks that contain fetch('navbar.html') or fetch('footer.html')
            $content = $content -replace '(?s)<script>\s*//[^<]*?document\.addEventListener\([^<]*?DOMContentLoaded[^<]*?fetch\([^<]*?navbar\.html[^<]*?</script>', '<script>'
            $content = $content -replace '(?s)<script>\s*//[^<]*?Load navbar and footer[^<]*?</script>', '<script>'
            $content = $content -replace '(?s)document\.addEventListener\([^<]*?DOMContentLoaded[^<]*?fetch\([^<]*?navbar\.html[^<]*?\}\);', ''
            $content = $content -replace '(?s)document\.addEventListener\([^<]*?DOMContentLoaded[^<]*?fetch\([^<]*?footer\.html[^<]*?\}\);', ''
            
            # Remove empty script blocks
            $content = $content -replace '<script>\s*</script>', ''
            $content = $content -replace '<script>\s*\n\s*</script>', ''
            
            # Clean up waitForNavbar functions
            $content = $content -replace '(?s)function waitForNavbar\(\)[^}]*?\}\s*\}\s*\)\s*;\s*\}', ''
            $content = $content -replace '(?s)async function waitForNavbar\(\)[^}]*?\}\s*\}', ''
            
            # Write the modified content back
            $content | Set-Content $page -NoNewline
            Write-Host "   ✅ $page updated successfully!" -ForegroundColor Green
        }
        else {
            Write-Host "   ⏭️ $page already has components.js, skipping..." -ForegroundColor Gray
        }
    }
    else {
        Write-Host "   ❌ $page not found!" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Bulk standardization completed!" -ForegroundColor Green
Write-Host "📊 Processed $($pages.Count) pages" -ForegroundColor Cyan

# Check results
Write-Host "`n🔍 Verification:" -ForegroundColor Yellow
foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        $hasComponents = $content -match "components\.js"
        $hasManualLoading = $content -match "fetch\('navbar\.html'\)"
        
        if ($hasComponents -and -not $hasManualLoading) {
            Write-Host "   ✅ $page - Standardized" -ForegroundColor Green
        }
        elseif ($hasComponents -and $hasManualLoading) {
            Write-Host "   ⚠️ $page - Has components.js but still has manual loading" -ForegroundColor Yellow
        }
        else {
            Write-Host "   ❌ $page - Not standardized" -ForegroundColor Red
        }
    }
}
