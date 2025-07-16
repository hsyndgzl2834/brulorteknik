// Simple HTML include with callback
async function includeHTML(elementId, filePath, callback) {
  console.log(`Include başlıyor: ${filePath} -> ${elementId}`);
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Include failed: ${filePath}`);
    const html = await res.text();
    document.getElementById(elementId).innerHTML = html;
    console.log(`Include başarılı: ${filePath}`);
    if (typeof callback === 'function') callback();
  } catch (e) {
    console.error(`Include hatası: ${filePath}`, e);
  }
}

// Include navbar and reapply translations once loaded
includeHTML('navbar', 'navbar.html', function() {
  if (typeof setupLanguageSwitcher === 'function') setupLanguageSwitcher();
  if (typeof applyTranslation === 'function') applyTranslation();
});
includeHTML('footer', 'footer.html', function() {
  // Footer ve scrollTop butonu DOM'da!
  var scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.style.display = window.scrollY > 150 ? 'block' : 'none';
    });
    scrollBtn.onclick = function() {
      window.scrollTo({top:0, behavior:'smooth'});
    };
  }
});
