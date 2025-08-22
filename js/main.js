/**
 * Main Application Module
 * Temiz, anlaşılır ve modüler ana uygulama sistemi
 */

window.App = (function() {
  'use strict';

  // Private variables
  let modules = {};
  let state = {
    isInitialized: false,
    isOnline: navigator.onLine,
    currentPage: window.location.pathname
  };

  // Configuration
  const config = {
    cacheName: 'brulor-teknik-v1.0.3',
    cacheVersion: '1.0.3',
    enableServiceWorker: true,
    enablePerformanceMonitoring: true,
    enableAccessibility: true
  };

  /**
   * Initialize the application
   */
  function init() {
    console.log('🚀 Sayfa yüklendi, sistem kontrol ediliyor...');
    
    try {
      // Initialize core features
      initPerformanceOptimizations();
      initAccessibility();
      initCacheManagement();
      loadModules();
      
      // Mark as initialized
      state.isInitialized = true;
      
      console.log('✅ Ana uygulama başarıyla başlatıldı');
    } catch (error) {
      console.error('❌ Ana uygulama başlatılırken hata:', error);
    }
  }

  /**
   * Load and initialize modules
   */
  function loadModules() {
    // Initialize navbar module if available
    if (window.Navbar && typeof window.Navbar.init === 'function') {
      window.Navbar.init();
      console.log('✅ Navbar modülü yüklendi');
    }
  }

  /**
   * Initialize performance optimizations
   */
  function initPerformanceOptimizations() {
    if (!config.enablePerformanceMonitoring) return;

    // Monitor page load performance
    window.addEventListener('load', function() {
      const loadTime = performance.now();
      const domContentLoaded = performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 0;
      const loadEvent = performance.getEntriesByType('navigation')[0]?.loadEventEnd || 0;
      
      console.log('⚡ Sayfa Yükleme Performansı:');
      console.log('  - DOM Content Loaded:', domContentLoaded - performance.getEntriesByType('navigation')[0]?.domContentLoadedEventStart, 'ms');
      console.log('  - Load Event:', loadEvent - performance.getEntriesByType('navigation')[0]?.loadEventStart, 'ms');
      console.log('  - Toplam Yükleme:', loadTime, 'ms');
    });

    // Optimize scroll performance
    let ticking = false;
    function updateScroll() {
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * Initialize accessibility features
   */
  function initAccessibility() {
    if (!config.enableAccessibility) return;

    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Ana içeriğe geç';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
      this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  /**
   * Initialize cache management
   */
  function initCacheManagement() {
    // Check existing caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        console.log('📦 Mevcut cache\'ler:', cacheNames);
        
        // Clean up old caches
        cacheNames.forEach(cacheName => {
          if (cacheName !== config.cacheName) {
            caches.delete(cacheName);
            console.log('🗑️ Eski cache silindi:', cacheName);
          }
        });
      });
    }

    // Monitor storage
    console.log('💾 Local Storage:', Object.keys(localStorage).length, 'öğe');
    console.log('💾 Session Storage:', Object.keys(sessionStorage).length, 'öğe');
  }

  /**
   * Load modules
   */
  function loadModules() {
    return new Promise((resolve) => {
      const modulePromises = [];

      // Load Core module
      if (window.Core) {
        modules.core = window.Core;
        console.log('📦 Module core loaded successfully');
      }

      // Load Navbar module
      if (window.Navbar) {
        modules.navbar = window.Navbar;
        console.log('📦 Module navbar loaded successfully');
      }

      // Load Footer module
      if (window.Footer) {
        modules.footer = window.Footer;
        console.log('📦 Module footer loaded successfully');
      }

      // Wait for all modules to be available
      Promise.allSettled(modulePromises).then(() => {
        console.log('📦 Tüm modüller yüklendi');
        resolve();
      });
    });
  }

  /**
   * Initialize modules
   */
  function initModules() {
    // Initialize navbar if available
    if (modules.navbar && typeof modules.navbar.init === 'function') {
      modules.navbar.init();
    }

    // Initialize footer if available
    if (modules.footer && typeof modules.footer.init === 'function') {
      modules.footer.init();
    }
  }

  /**
   * Clear all caches (for development)
   */
  function clearAllCaches() {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
        console.log('🗑️ Tüm cache\'ler temizlendi');
        location.reload();
      });
    }

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    console.log('🗑️ Local ve Session Storage temizlendi');
  }

  /**
   * Handle online/offline status
   */
  function handleOnlineStatus() {
    window.addEventListener('online', function() {
      state.isOnline = true;
      console.log('🌐 Çevrimiçi');
    });

    window.addEventListener('offline', function() {
      state.isOnline = false;
      console.log('📴 Çevrimdışı');
    });
  }

  /**
   * Public API
   */
  return {
    /**
     * Initialize the application
     */
    init: function() {
      init();
    },

    /**
     * Load and initialize modules
     */
    loadModules: async function() {
      await loadModules();
      initModules();
    },

    /**
     * Get application state
     */
    getState: function() {
      return { ...state };
    },

    /**
     * Get loaded modules
     */
    getModules: function() {
      return { ...modules };
    },

    /**
     * Access modules directly
     */
    modules: modules,

    /**
     * Clear all caches
     */
    clearAllCaches: function() {
      clearAllCaches();
    },

    /**
     * Handle online status
     */
    handleOnlineStatus: function() {
      handleOnlineStatus();
    }
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.App.init();
  window.App.handleOnlineStatus();
}); 