function includeHTML(id, url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (typeof callback === "function") callback(); // Yüklendikten sonra çağır!
    });
}

document.addEventListener('DOMContentLoaded', function() {
  includeHTML('navbar', 'navbar.html', function() {
    // Navbar geldikten sonra dil eventlerini burada atayabilirsin
    if (typeof setupLanguageSwitcher === "function") {
      setupLanguageSwitcher(); // language.js içinde bu fonksiyonu olmalı
    }
  });
  includeHTML('footer', 'footer.html');
});
