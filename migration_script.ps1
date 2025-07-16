
<#
Migration Script Usage:
1. Ensure this file (migration_script.ps1) is saved in the same folder as your HTML pages.
2. Open PowerShell as Administrator.
3. Navigate to this folder where the script resides, e.g.: `cd C:\Desktop\nasaweb1`.
4. Allow script execution (for the current session):
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
5. Run the script:
   .\migration_script.ps1
6. After completion, open each HTML file to verify the updated template content and active navbar links.
   If the command is not recognized, ensure:
   - You are in the correct directory (`Get-ChildItem` to list files).
   - The script file is named exactly `migration_script.ps1`.
#>

# PowerShell Migration Script for Template Update
# This script updates all HTML pages to match the template and cleans old code.

$pages = @( 'about.html', 'services.html', 'products.html', 'faq.html', 'contact.html')

# Define template sections
$TemplateHead = @"
<head>
  <meta charset=\"utf-8\"/>
  <meta name=\"description\" content=\"Brülör Teknik Hizmetler: Endüstriyel brülör sistemleri için kurulum, bakım ve servis hizmetleri.\"/>
  <meta name=\"keywords\" content=\"Brülör, Teknik hizmetler, sanayi, kurulum, bakım, servis, otomasyon\"/>
  <meta name=\"author\" content=\"Brülör, Teknik Hizmetler\"/>
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>
  <title data-i18n=\"siteTitle\">Brülör, Teknik Hizmetler</title>
  <!-- CSS Libraries -->
  <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\"/>
  <link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\" rel=\"stylesheet\"/>
  <link href=\"https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css\" rel=\"stylesheet\"/>
  <link href=\"https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css\" rel=\"stylesheet\"/>
  <link href=\"css/style.css\" rel=\"stylesheet\"/>
</head>
"@

$TemplateNav = @"
<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow\">
  <div class=\"container-fluid\">
    <a class=\"navbar-brand\" href=\"index.html\"><i class=\"fas fa-fire-alt me-2\"></i>Brülör, Teknik</a>
    <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarContent\" aria-controls=\"navbarContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">
      <span class=\"navbar-toggler-icon\"></span>
    </button>
    <div class=\"collapse navbar-collapse\" id=\"navbarContent\">
      <ul class=\"navbar-nav me-auto mb-2 mb-lg-0\">
        <li class=\"nav-item\"><a class=\"nav-link active\" href=\"index.html\">Home</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"about.html\">About</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"services.html\">Services</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"products.html\">Products</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"faq.html\">FAQ</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"contact.html\">Contact</a></li>
      </ul>
      <div class=\"d-flex align-items-center\">
        <div class=\"dropdown me-3\">
          <button class=\"btn btn-outline-light dropdown-toggle\" type=\"button\" id=\"langDropdown\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">
            <i class=\"fas fa-globe\"></i>
          </button>
          <ul class=\"dropdown-menu dropdown-menu-end\" aria-labelledby=\"langDropdown\">
            <li><button class=\"dropdown-item\" onclick=\"setLanguage('tr')\">Türkçe</button></li>
            <li><button class=\"dropdown-item\" onclick=\"setLanguage('en')\">English</button></li>
          </ul>
        </div>
        <a href=\"tel:+905551112233\" class=\"btn btn-success me-2 d-none d-lg-inline-flex align-items-center\"><i class=\"fas fa-phone-alt me-1\"></i>0555 111 2233</a>
        <a href=\"https://wa.me/905551112233\" class=\"btn btn-success me-2 align-items-center\"><i class=\"fab fa-whatsapp me-1\"></i>WhatsApp</a>
        <a href=\"contact.html\" class=\"btn btn-primary\">Teklif Al</a>
      </div>
    </div>
  </div>
</nav>
"@

$TemplateFooter = @"
<footer class=\"bg-dark text-light text-center py-3\">
  <p data-i18n=\"rights\">© 2025 Brülör, Teknik Hizmetler. Tüm hakları saklıdır.</p>
</footer>
"@

foreach ($page in $pages) {
  Write-Host "Processing $page..."
  $basename = [System.IO.Path]::GetFileName($page)
  $content = Get-Content $page -Raw

  # Remove old language.js reference
  $content = $content -replace '<script defer src=\"js/language.js\".*?>.*?<\/script>', ''
  # Remove inline <script> blocks
  $content = $content -replace '<script>[\s\S]*?<\/script>', ''

  # Replace <head>
  $content = $content -replace '(?s)<head>.*?<\/head>', $TemplateHead
  # Replace <nav>
  $content = $content -replace '(?s)<nav[\s\S]*?<\/nav>', $TemplateNav
  # Replace <footer>
  $content = $content -replace '(?s)<footer[\s\S]*?<\/footer>', $TemplateFooter

  # Update active navbar link
  $pattern = 'class=\"nav-link\" href=\"' + [regex]::Escape($basename) + '\"'
  $replacement = 'class=\"nav-link active\" href=\"' + $basename + '\"'
  $content = $content -replace $pattern, $replacement

  Set-Content -Path $page -Value $content
}

Write-Host "Migration tamamlandı."
=======
<#
Migration Script Usage:
1. Ensure this file (migration_script.ps1) is saved in the same folder as your HTML pages.
2. Open PowerShell as Administrator.
3. Navigate to this folder where the script resides, e.g.: `cd C:\Desktop\nasaweb1`.
4. Allow script execution (for the current session):
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
5. Run the script:
   .\migration_script.ps1
6. After completion, open each HTML file to verify the updated template content and active navbar links.
   If the command is not recognized, ensure:
   - You are in the correct directory (`Get-ChildItem` to list files).
   - The script file is named exactly `migration_script.ps1`.
#>

# PowerShell Migration Script for Template Update
# This script updates all HTML pages to match the template and cleans old code.

$pages = @( 'about.html', 'services.html', 'products.html', 'faq.html', 'contact.html')

# Define template sections
$TemplateHead = @"
<head>
  <meta charset=\"utf-8\"/>
  <meta name=\"description\" content=\"Brülör, Teknik Hizmetler: Endüstriyel brülör sistemleri için kurulum, bakım ve servis hizmetleri.\"/>
  <meta name=\"keywords\" content=\"Brülör, Teknik hizmetler, sanayi, kurulum, bakım, servis, otomasyon\"/>
  <meta name=\"author\" content=\"Brülör, Teknik Hizmetler\"/>
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>
  <title data-i18n=\"siteTitle\">Brülör, Teknik Hizmetler</title>
  <!-- CSS Libraries -->
  <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\"/>
  <link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\" rel=\"stylesheet\"/>
  <link href=\"https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css\" rel=\"stylesheet\"/>
  <link href=\"https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css\" rel=\"stylesheet\"/>
  <link href=\"css/style.css\" rel=\"stylesheet\"/>
</head>
"@

$TemplateNav = @"
<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow\">
  <div class=\"container-fluid\">
    <a class=\"navbar-brand\" href=\"index.html\"><i class=\"fas fa-fire-alt me-2\"></i>NASA Teknik</a>
    <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarContent\" aria-controls=\"navbarContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">
      <span class=\"navbar-toggler-icon\"></span>
    </button>
    <div class=\"collapse navbar-collapse\" id=\"navbarContent\">
      <ul class=\"navbar-nav me-auto mb-2 mb-lg-0\">
        <li class=\"nav-item\"><a class=\"nav-link active\" href=\"index.html\">Home</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"about.html\">About</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"services.html\">Services</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"products.html\">Products</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"faq.html\">FAQ</a></li>
        <li class=\"nav-item\"><a class=\"nav-link\" href=\"contact.html\">Contact</a></li>
      </ul>
      <div class=\"d-flex align-items-center\">
        <div class=\"dropdown me-3\">
          <button class=\"btn btn-outline-light dropdown-toggle\" type=\"button\" id=\"langDropdown\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">
            <i class=\"fas fa-globe\"></i>
          </button>
          <ul class=\"dropdown-menu dropdown-menu-end\" aria-labelledby=\"langDropdown\">
            <li><button class=\"dropdown-item\" onclick=\"setLanguage('tr')\">Türkçe</button></li>
            <li><button class=\"dropdown-item\" onclick=\"setLanguage('en')\">English</button></li>
          </ul>
        </div>
        <a href=\"tel:+905551112233\" class=\"btn btn-success me-2 d-none d-lg-inline-flex align-items-center\"><i class=\"fas fa-phone-alt me-1\"></i>0555 111 2233</a>
        <a href=\"https://wa.me/905551112233\" class=\"btn btn-success me-2 align-items-center\"><i class=\"fab fa-whatsapp me-1\"></i>WhatsApp</a>
        <a href=\"contact.html\" class=\"btn btn-primary\">Teklif Al</a>
      </div>
    </div>
  </div>
</nav>
"@

$TemplateFooter = @"
<footer class=\"bg-dark text-light text-center py-3\">
  <p data-i18n=\"rights\">© 2025 NASA Teknik Hizmetler. Tüm hakları saklıdır.</p>
</footer>
"@

foreach ($page in $pages) {
  Write-Host "Processing $page..."
  $basename = [System.IO.Path]::GetFileName($page)
  $content = Get-Content $page -Raw

  # Remove old language.js reference
  $content = $content -replace '<script defer src=\"js/language.js\".*?>.*?<\/script>', ''
  # Remove inline <script> blocks
  $content = $content -replace '<script>[\s\S]*?<\/script>', ''

  # Replace <head>
  $content = $content -replace '(?s)<head>.*?<\/head>', $TemplateHead
  # Replace <nav>
  $content = $content -replace '(?s)<nav[\s\S]*?<\/nav>', $TemplateNav
  # Replace <footer>
  $content = $content -replace '(?s)<footer[\s\S]*?<\/footer>', $TemplateFooter

  # Update active navbar link
  $pattern = 'class=\"nav-link\" href=\"' + [regex]::Escape($basename) + '\"'
  $replacement = 'class=\"nav-link active\" href=\"' + $basename + '\"'
  $content = $content -replace $pattern, $replacement

  Set-Content -Path $page -Value $content
}
