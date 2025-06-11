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
      if (translations[key]) {
        el.innerHTML = translations[key];
      }
    });
  } catch (err) {
    console.error(err);
  }
}
