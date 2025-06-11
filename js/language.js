document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.lang-btn');
  let translations = {};

  // Seçili dili localStorage'dan oku; yoksa "tr" kullan
  const storedLang = localStorage.getItem('selectedLang') || 'tr';

  // Dil butonlarına tıklanınca:
  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const lang = btn.getAttribute('data-lang');

      // Seçimi localStorage'a kaydet
      localStorage.setItem('selectedLang', lang);

      // JSON'u yükleyip çeviriyi uygula
      try {
        const res = await fetch(`locales/${lang}.json`);
        if (!res.ok) {
          throw new Error(`Çeviri dosyası yüklenemedi: locales/${lang}.json (status ${res.status})`);
        }
        translations = await res.json();
        applyTranslations(translations);
      } catch (err) {
        console.error('Çeviri dosyası yüklenirken hata:', err);
      }
    });
  });

  function applyTranslations(obj, parentKey = '') {
    for (const key in obj) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'string') {
        document.querySelectorAll(`[data-i18n="${fullKey}"]`).forEach(el => {
          el.textContent = obj[key];
        });
      } else {
        applyTranslations(obj[key], fullKey);
      }
    }
  }

  // Sayfa yüklendiğinde storedLang değerine göre çeviriyi uygula
  // (Buton tıklaması simülasyonuna gerek yok)
  (async () => {
    try {
      const res = await fetch(`locales/${storedLang}.json`);
      if (!res.ok) {
        throw new Error(`Çeviri dosyası yüklenemedi: locales/${storedLang}.json (status ${res.status})`);
      }
      translations = await res.json();
      applyTranslations(translations);
    } catch (err) {
      console.error('Çeviri dosyası yüklenirken hata:', err);
    }
  })();
   // Butonlar yüklendiğinde tekrar seçiliyor!
  document.getElementById('btn-tr')?.addEventListener('click', function() {
    setLanguage('tr');
  });
  document.getElementById('btn-en')?.addEventListener('click', function() {
    setLanguage('en');
  });
});
