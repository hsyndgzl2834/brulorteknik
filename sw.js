// Service Worker for Brülör Teknik - Mobile Optimized
// Version: 2.0.0

const CACHE_NAME = 'brulor-teknik-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/products.html',
  '/contact.html',
  '/navbar.html',
  '/footer.html',
  '/css/style.css',
  '/js/main.js',
  '/js/include.js',
  '/js/language.js',
  '/images/logo.webp',
  '/images/hero1.webp',
  '/images/hero2.webp',
  '/images/hero3.webp',
  '/images/favicon.png',
  '/images/favicon.ico',
  '/manifest.json',
  // Critical mobile resources
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - Mobile optimized
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, { mode: 'cors' })));
      })
      .catch(function(error) {
        console.log('Cache failed:', error);
      })
  );
  self.skipWaiting(); // Activate immediately
});

// Fetch event - Mobile optimized with network-first strategy for dynamic content
self.addEventListener('fetch', function(event) {
  // Skip chrome-extension and non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    // Try network first for better mobile experience
    fetch(event.request)
      .then(function(response) {
        // Clone the response before caching
        const responseClone = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseClone);
            });
        }
        
        return response;
      })
      .catch(function() {
        // If network fails, try cache
        return caches.match(event.request)
          .then(function(response) {
            if (response) {
              return response;
            }
            
            // For navigation requests, return index.html as fallback
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return a custom offline page or response
            return new Response('Content not available offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
