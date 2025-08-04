// Service Worker for Brülör Teknik - Mobile Optimized
// Version: 1.0.3 - Cache Temizleme

const CACHE_NAME = 'brulor-teknik-v1.0.3';
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

// Install event - Cache dosyaları ve hata yönetimi
self.addEventListener('install', event => {
  console.log('Service Worker installing with version:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened successfully');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
        // Fallback: Skip waiting to force update
        self.skipWaiting();
      })
  );
});

// Fetch event - Gelişmiş cache stratejisi
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache'den bulundu
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }
        
        // Network'ten getir
        console.log('Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Sadece valid response'ları cache'le
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(error => {
            console.error('Network fetch failed:', error);
            // Offline durumunda basic HTML döndür
            if (event.request.destination === 'document') {
              return new Response(
                '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>Bağlantı Sorunu</h1><p>İnternet bağlantınızı kontrol edin.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            throw error;
          });
      })
  );
});

// Activate event - Eski cache'leri temizle ve güncelle
self.addEventListener('activate', event => {
  console.log('Service Worker activating with version:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activation complete');
      // Tüm client'ları güncelle
      return self.clients.claim();
    })
  );
});

// Message event - Client'lardan gelen mesajları dinle
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});
