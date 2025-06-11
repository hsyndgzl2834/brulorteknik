function setupLanguageSwitcher() {
  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const lang = btn.getAttribute('data-lang');
      localStorage.setItem('selectedLang', lang);
      await applyTranslation(lang);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const storedLang = localStorage.getItem('selectedLang') || 'tr';
  await applyTranslation(storedLang);
});

async function applyTranslation(lang) {
  try {
    const res = await fetch(`locales/${lang}.json`);
    if (!res.ok) throw new Error(`Çeviri dosyası yüklenemedi: locales/${lang}.json`);
    const translations = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getDeepValue(translations, key);
     if (value) el.innerHTML = value;
    });
  } catch (err) {
    console.error(err);
  }
}
function getDeepValue(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
}

async function applyTranslation(lang) {
  try {
    const res = await fetch(`locales/${lang}.json`);
    if (!res.ok) throw new Error(`Çeviri dosyası yüklenemedi: locales/${lang}.json`);
    const translations = await res.json();

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getDeepValue(translations, key); // ARTIK DERİN OKUYOR!
      if (value) {
        el.innerHTML = value;
      }
    });
  } catch (err) {
    console.error(err);
  }
}
