function includeHTML(id, url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (typeof callback === "function") callback();
    });
}

document.addEventListener('DOMContentLoaded', function() {
  includeHTML('navbar', 'navbar.html', function() {
    // Navbar geldikten sonra:
    if (typeof setupLanguageSwitcher === "function") {
      setupLanguageSwitcher(); // Eventleri ata
    }
    if (typeof applyTranslation === "function") {
      const storedLang = localStorage.getItem('selectedLang') || 'tr';
      applyTranslation(storedLang);    // Navbar içi çeviri
    }
  });
  includeHTML('footer', 'footer.html', function() {
    if (typeof applyTranslation === "function") {
      const storedLang = localStorage.getItem('selectedLang') || 'tr';
      applyTranslation(storedLang);    // Footer içi çeviri
    }
  });
});

