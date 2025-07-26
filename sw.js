// Service Worker for Brülör Teknik - Mobile Optimized
// Version: 1.0.1

const CACHE_NAME = 'brulor-teknik-v1.0.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/hizmet1.html',
  '/hizmet2.html',
  '/hizmet3.html',
  '/hizmet4.html',
  '/hizmet5.html',
  '/monoblok.html',
  '/duoblok.html',
  '/navbar.html',
  '/footer.html',
  '/images/logo.webp',
  '/images/hero1-1600.webp',
  '/manifest.json'
];

// Install event - Cache dosyaları
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Cache'den serve et
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate event - Eski cache'leri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
