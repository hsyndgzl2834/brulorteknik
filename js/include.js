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

// Include footer (no callback needed)
includeHTML('footer', 'footer.html');