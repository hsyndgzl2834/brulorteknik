// Simple HTML include with callback
async function includeHTML(elementId, filePath, callback) {
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Include failed: ${filePath}`);
    const html = await res.text();
    document.getElementById(elementId).innerHTML = html;
    if (typeof callback === 'function') callback();
  } catch (e) {
    console.error(e);
  }
}

// Include navbar and reapply translations once loaded
includeHTML('navbar', 'navbar.html', function() {
  if (typeof setupLanguageSwitcher === 'function') setupLanguageSwitcher();
  if (typeof applyTranslation === 'function') applyTranslation();
});
includeHTML('footer', 'footer.html', function() {
  // Footer yüklendi, scrollTop artık var!
  var scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    scrollBtn.onclick = function() {
      window.scrollTo({top:0, behavior:'smooth'});
    };
  }
});
