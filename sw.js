// Service Worker for Brülör Teknik - Mobile Optimized
// Version: 1.0.3 - Cache Temizleme

const CACHE_NAME = 'brulor-teknik-v2.0.0';
const STATIC_CACHE = 'brulor-static-v2.0.0';
const DYNAMIC_CACHE = 'brulor-dynamic-v2.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/products.html',
  '/hizmetler.html',
  '/css/main.css',
  '/css/modules/base.css',
  '/css/modules/navbar.css',
  '/css/modules/footer.css',
  '/css/modules/hero.css',
  '/css/modules/components.css',
  '/js/main.js',
  '/js/modules/core.js',
  '/js/modules/navbar.js',
  '/js/modules/footer.js',
  '/navbar.html',
  '/footer.html',
  '/images/hero1.webp',
  '/images/hero2.webp',
  '/images/hero3.webp',
  '/images/logo.webp',
  '/images/favicon.ico'
];

const DYNAMIC_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js'
];

// Install Event
self.addEventListener('install', event => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('📦 Caching static assets...');
          return cache.addAll(STATIC_ASSETS);
        }),
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          console.log('🌐 Caching dynamic assets...');
          return cache.addAll(DYNAMIC_ASSETS);
        })
    ]).then(() => {
      console.log('✅ Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Cache First Strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('📦 Serving from cache:', request.url);
          return cachedResponse;
        }
        
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the response
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                console.log('💾 Caching new resource:', request.url);
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.log('❌ Fetch failed:', request.url, error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            return new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background Sync
self.addEventListener('sync', event => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push Notification
self.addEventListener('push', event => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Yeni brülör hizmetleri güncellemesi!',
    icon: '/images/logo.webp',
    badge: '/images/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'İncele',
        icon: '/images/favicon.ico'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/images/favicon.ico'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Brülör Teknik Hizmetler', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', event => {
  console.log('👆 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background Sync Function
async function doBackgroundSync() {
  try {
    console.log('🔄 Performing background sync...');
    
    // Sync any pending data
    const pendingData = await getPendingData();
    
    if (pendingData.length > 0) {
      for (const data of pendingData) {
        await syncData(data);
      }
    }
    
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Helper Functions
async function getPendingData() {
  // Get pending data from IndexedDB or localStorage
  return [];
}

async function syncData(data) {
  // Sync data to server
  console.log('📤 Syncing data:', data);
}

// Message Handler
self.addEventListener('message', event => {
  console.log('📨 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.ports[0].postMessage({
      type: 'CACHE_INFO',
      caches: ['STATIC_CACHE', 'DYNAMIC_CACHE']
    });
  }
});
