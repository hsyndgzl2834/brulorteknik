/**
 * Main JavaScript Module
 * Orchestrates all site functionality
 */

// Main application class
class App {
  constructor() {
    this.modules = {
      core: window.Core,
      navbar: window.Navbar,
      footer: window.Footer
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
   * Initialize a specific module
   */
  async initModule(moduleName) {
    try {
      const module = this.modules[moduleName];
      if (module && typeof module.init === 'function') {
        await module.init();
        this.state.modulesLoaded.add(moduleName);
        console.log(`✅ ${moduleName} module initialized`);
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
      'css/main.css',
      'js/modules/navbar.js',
      'js/modules/footer.js'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
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
    // Track focus changes
    document.addEventListener('focusin', (e) => {
      const target = e.target;
      if (target.classList.contains('modern-link') || 
          target.classList.contains('modern-btn') ||
          target.classList.contains('modern-toggler')) {
        target.classList.add('focused');
      }
    });
    
    document.addEventListener('focusout', (e) => {
      const target = e.target;
      target.classList.remove('focused');
    });
    
    // Handle focus trap for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && e.target.closest('.modal')) {
        const focusableElements = e.target.closest('.modal').querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && e.target === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && e.target === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  /**
   * Initialize keyboard navigation
   */
  initKeyboardNavigation() {
    // Handle escape key for modals and menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        const openMenu = document.querySelector('.navbar-collapse.show');
        
        if (openModal) {
          // Close modal
          const closeBtn = openModal.querySelector('[data-dismiss="modal"]');
          if (closeBtn) closeBtn.click();
        } else if (openMenu) {
          // Close mobile menu
          const closeBtn = document.querySelector('.mobile-menu-close');
          if (closeBtn) closeBtn.click();
        }
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
      modules: Object.keys(this.modules)
    };
  }

  /**
   * Destroy application
   */
  destroy() {
    this.state.isInitialized = false;
    this.state.modulesLoaded.clear();
    console.log('🗑️ Application destroyed');
  }
}

// Create global instance
window.App = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
  });
} else {
  window.App.init();
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
} 