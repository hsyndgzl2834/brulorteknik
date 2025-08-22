// Service Worker for Brülör Teknik - Simplified Version
// Version: 3.0.0 - Minimal SW to avoid redirect issues

const CACHE_NAME = 'brulor-teknik-v3.0.0';
const STATIC_CACHE = 'brulor-static-v3.0.0';

// Only cache essential static assets
const STATIC_ASSETS = [
  '/css/main.css',
  '/js/components.js',
  '/js/modules/navbar.js',
  '/images/logo.webp',
  '/images/favicon.ico'
];

// Install Event - Only cache static assets
self.addEventListener('install', event => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.warn('⚠️ Some static assets failed to cache:', error);
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker installation failed:', error);
        return Promise.resolve();
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
          if (cacheName !== STATIC_CACHE) {
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

// Fetch Event - Only handle specific static assets, let browser handle HTML pages
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
  
  // Only handle specific static assets - let browser handle HTML pages naturally
  const isStaticAsset = url.pathname.includes('/css/') || 
                       url.pathname.includes('/js/') || 
                       url.pathname.includes('/images/') ||
                       url.pathname.endsWith('.css') ||
                       url.pathname.endsWith('.js') ||
                       url.pathname.endsWith('.png') ||
                       url.pathname.endsWith('.jpg') ||
                       url.pathname.endsWith('.webp') ||
                       url.pathname.endsWith('.ico');
  
  // Don't intercept HTML pages - let browser handle them naturally
  if (!isStaticAsset) {
    console.log('🌐 Letting browser handle:', request.url);
    return; // Let the browser handle HTML pages normally
  }
  
  // Only handle static assets
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('📦 Serving static asset from cache:', request.url);
          return cachedResponse;
        }
        
        // Fetch static asset and cache it
        return fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(STATIC_CACHE)
                .then(cache => {
                  console.log('💾 Caching static asset:', request.url);
                  cache.put(request, responseToCache);
                })
                .catch(error => {
                  console.warn('⚠️ Failed to cache static asset:', error);
                });
            }
            return response;
          })
          .catch(error => {
            console.log('❌ Failed to fetch static asset:', request.url, error);
            return new Response('Static asset not available', {
              status: 404,
              statusText: 'Not Found'
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
