// Initialize translations object (only if not already defined)
if (typeof translations === 'undefined') {
  var translations = {};
}

async function fetchTranslations(lang) {
  const res = await fetch(`locales/${lang}.json`);
  if (!res.ok) throw new Error(`Çeviri dosyası yüklenemedi: ${lang}.json`);
  let text = await res.text();
  // Remove BOM if present
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  return JSON.parse(text);
}

function applyTranslation() {
  // document title
  if (translations.siteTitle) document.title = translations.siteTitle;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.getAttribute('data-i18n').split(".");
    let value = translations;
    for (let key of keys) value = value?.[key];
    if (value != null) el.textContent = value;
  });
  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    const keys = el.getAttribute('data-i18n-content').split(".");
    let value = translations;
    for (let key of keys) value = value?.[key];
    if (value != null) {
      const attr = (el.tagName === 'META' || el.tagName === 'LINK') ? 'content' : 'placeholder';
      el.setAttribute(attr, value);
    }
  });
}

async function setLanguage(lang) {
  try {
    translations = await fetchTranslations(lang);
    localStorage.setItem('lang', lang);
    applyTranslation();
  } catch (e) {
    console.error(`Çeviri yüklenirken hata (${lang}):`, e);
  }
}

// Attach click handlers to language buttons (defined in navbar.html)
function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.onclick = function() {
      const chosen = btn.id.replace('btn-', '');
      if (chosen !== localStorage.getItem('lang')) {
        setLanguage(chosen);
      }
    }
  });
}

// On DOM ready, load initial language
document.addEventListener('DOMContentLoaded', () => {
  const initial = localStorage.getItem('lang') || 'tr';
  setLanguage(initial);
});
function applyTranslation() {
  // Başlık
  if (translations.siteTitle) document.title = translations.siteTitle;

  // Tüm data-i18n'leri yakala
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.getAttribute('data-i18n').split(".");
    let value = translations;
    for (let key of keys) value = value?.[key];

    // Buton veya <a> etiketi ise
    if (el.tagName === "IMG" && value != null) {
      el.alt = value;
    } else if (value != null) {
      el.innerHTML = value;
    }
  });

  // meta veya placeholderlar
  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    const keys = el.getAttribute('data-i18n-content').split(".");
    let value = translations;
    for (let key of keys) value = value?.[key];
    if (value != null) {
      const attr = (el.tagName === 'META' || el.tagName === 'LINK') ? 'content' : 'placeholder';
      el.setAttribute(attr, value);
    }
  });
}