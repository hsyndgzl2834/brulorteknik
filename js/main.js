/**
 * Main JavaScript Module
 * Orchestrates all site functionality
 */

// Import modules
import Core from './modules/core.js';
import Navbar from './modules/navbar.js';
import Footer from './modules/footer.js';

// Main application class
class App {
  constructor() {
    this.modules = {
      core: Core,
      navbar: Navbar,
      footer: Footer
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
      'images/logo.webp',
      'css/main.css',
      'js/main.js'
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
      // Update scroll-based animations
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
    // Skip to main content
    this.initSkipLinks();
    
    // Focus management
    this.initFocusManagement();
    
    // Keyboard navigation
    this.initKeyboardNavigation();
  }

  /**
   * Initialize skip links
   */
  initSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Ana içeriğe geç';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      z-index: 10000;
      background: #000;
      color: #fff;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Initialize focus management
   */
  initFocusManagement() {
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
          const focusableElements = modal.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
          );
          
          if (focusableElements.length) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
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
      }
    });
  }

  /**
   * Initialize keyboard navigation
   */
  initKeyboardNavigation() {
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
          const closeButton = modal.querySelector('.close, [data-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          }
        });
      }
    });
  }

  /**
   * Get application state
   */
  getState() {
    return {
      ...this.state,
      modules: Array.from(this.state.modulesLoaded)
    };
  }

  /**
   * Destroy the application
   */
  destroy() {
    // Destroy all modules
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.destroy === 'function') {
        module.destroy();
      }
    });
    
    this.state.isInitialized = false;
    this.state.modulesLoaded.clear();
    
    console.log('🗑️ Application destroyed');
  }
}

// Create global app instance
window.App = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
  });
} else {
  window.App.init();
}

// Export for use in other modules
export default window.App; 