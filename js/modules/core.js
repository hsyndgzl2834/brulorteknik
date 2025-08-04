/**
 * Core Module - Centralized functionality for all pages
 * Handles navbar/footer loading, AOS initialization, and common utilities
 */

window.App = window.App || {};

window.App.core = {
  // Configuration
  config: {
    navbarContainer: 'navbar-container',
    footerContainer: 'footer-container',
    navbarFile: 'navbar.html',
    footerFile: 'footer.html',
    aosConfig: {
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    }
  },

  // Initialize core functionality
  init: function() {
    this.loadComponents();
    this.initAOS();
    this.initScrollToTop();
    this.initCacheManagement();
  },

  // Load navbar and footer components
  loadComponents: function() {
    this.loadNavbar();
    this.loadFooter();
  },

  // Load navbar
  loadNavbar: function() {
    const container = document.getElementById(this.config.navbarContainer);
    if (!container) {
      console.warn('Navbar container not found');
      return;
    }

    fetch(this.config.navbarFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        container.innerHTML = data;
      })
      .catch(error => {
        console.error('Navbar yüklenirken hata:', error);
      });
  },

  // Load footer
  loadFooter: function() {
    const container = document.getElementById(this.config.footerContainer);
    if (!container) {
      console.warn('Footer container not found');
      return;
    }

    fetch(this.config.footerFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        container.innerHTML = data;
      })
      .catch(error => {
        console.error('Footer yüklenirken hata:', error);
      });
  },

  // Initialize AOS animations
  initAOS: function() {
    if (typeof AOS !== 'undefined') {
      AOS.init(this.config.aosConfig);
    }
  },

  // Initialize scroll to top functionality
  initScrollToTop: function() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (!scrollBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'block';
      } else {
        scrollBtn.style.display = 'none';
      }
    });

    // Scroll to top when clicked
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  },

  // Initialize cache management
  initCacheManagement: function() {
    // Cache clearing functions
    window.clearAllCaches = function() {
      // Clear service worker cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    // Check cache status
    window.checkCacheStatus = function() {
      if ('caches' in window) {
        caches.keys().then(names => {
          console.log('Mevcut cache\'ler:', names);
        });
      }
    };

    // Initialize cache status check
    setTimeout(() => {
      window.checkCacheStatus();
    }, 1000);
  },

  // Utility functions
  utils: {
    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Mobile detection
    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Smooth scroll to element
    scrollToElement: function(elementId, offset = 0) {
      const element = document.getElementById(elementId);
      if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
  }
};

// Initialize core when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  if (window.App && window.App.core) {
    window.App.core.init();
  }
}); 