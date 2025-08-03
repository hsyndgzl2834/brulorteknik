/**
 * Main JavaScript Module
 * Orchestrates all site functionality
 */

// Main application class
class App {
  constructor() {
    this.modules = {
      core: null,
      navbar: null,
      footer: null
    };
    
    this.state = {
      isInitialized: false,
      modulesLoaded: new Set()
    };
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🚀 Initializing application...');
      
      // Wait for modules to be available
      await this.waitForModules();
      
      // Initialize core functionality first
      await this.initModule('core');
      
      // Initialize navbar
      await this.initModule('navbar');
      
      // Initialize footer
      await this.initModule('footer');
      
      // Initialize performance optimizations
      this.initPerformanceOptimizations();
      
      // Initialize accessibility features
      this.initAccessibility();
      
      this.state.isInitialized = true;
      console.log('✅ Application initialized successfully');
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('app:initialized'));
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
    }
  }

  /**
   * Wait for modules to be available
   */
  async waitForModules() {
    const maxAttempts = 50; // 5 seconds max
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      if (window.Core && window.Navbar && window.Footer) {
        this.modules.core = window.Core;
        this.modules.navbar = window.Navbar;
        this.modules.footer = window.Footer;
        console.log('✅ All modules loaded');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    throw new Error('Modules failed to load within timeout');
  }

  /**
   * Initialize a specific module
   */
  async initModule(moduleName) {
    try {
      const module = this.modules[moduleName];
      if (module && typeof module.init === 'function') {
        await module.init();
        this.state.modulesLoaded.add(moduleName);
        console.log(`✅ ${moduleName} module initialized`);
      } else {
        console.warn(`⚠️ ${moduleName} module not found or init method missing`);
      }
    } catch (error) {
      console.error(`❌ Failed to initialize ${moduleName} module:`, error);
    }
  }

  /**
   * Initialize performance optimizations
   */
  initPerformanceOptimizations() {
    // Lazy load images
    this.initLazyLoading();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize scroll performance
    this.optimizeScrollPerformance();
  }

  /**
   * Initialize lazy loading
   */
  initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    const criticalResources = [
      '/css/main.css',
      '/js/main.js',
      '/images/logo.webp'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 
                 resource.endsWith('.js') ? 'script' : 'image';
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize scroll performance
   */
  optimizeScrollPerformance() {
    let ticking = false;
    
    const updateScroll = () => {
      // Scroll-based animations and effects
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    this.initSkipLinks();
    this.initFocusManagement();
    this.initKeyboardNavigation();
  }

  /**
   * Initialize skip links
   */
  initSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /**
   * Initialize focus management
   */
  initFocusManagement() {
    // Track focus for better UX
    document.addEventListener('focusin', (e) => {
      e.target.classList.add('focused');
    });
    
    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focused');
    });
    
    // Trap focus in modals
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
    });
  }

  /**
   * Initialize keyboard navigation
   */
  initKeyboardNavigation() {
    // Escape key handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close modals, dropdowns, etc.
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          if (modal.style.display !== 'none') {
            modal.style.display = 'none';
          }
        });
      }
    });
    
    // Enter key handling for custom elements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.hasAttribute('role')) {
        e.target.click();
      }
    });
  }

  /**
   * Get application state
   */
  getState() {
    return {
      isInitialized: this.state.isInitialized,
      modulesLoaded: Array.from(this.state.modulesLoaded),
      modules: Object.keys(this.modules).filter(key => this.modules[key])
    };
  }

  /**
   * Destroy application
   */
  destroy() {
    // Cleanup event listeners
    window.removeEventListener('scroll', this.optimizeScrollPerformance);
    
    // Reset state
    this.state.isInitialized = false;
    this.state.modulesLoaded.clear();
    
    console.log('🗑️ Application destroyed');
  }
}

// Create global App instance
window.App = new App();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
} 