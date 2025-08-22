/**
 * Mobile First Navbar JavaScript Module
 * Optimized for fast transitions and mobile performance
 */

window.Navbar = {
  // Mobile-first configuration
  config: {
    mobileBreakpoint: 992,
    fastTransition: 200,
    scrollThreshold: 50
  },

  // State management
  state: {
    isInitialized: false,
    isMobileMenuOpen: false,
    isMobile: window.innerWidth < 992
  },

  // Cached elements
  elements: {
    navbar: null,
    toggler: null,
    collapse: null,
    links: null
  },

  /**
   * Fast initialization
   */
  init() {
    if (this.state.isInitialized) {
      console.log('🔄 Desktop Navbar already initialized');
      return;
    }
    
    // Only initialize on desktop
    if (window.innerWidth >= this.config.mobileBreakpoint) {
      const initializeWhenReady = () => {
        this.cacheElements();
        
        // Only initialize if navbar elements exist
        if (this.elements.navbar) {
          this.bindEvents();
          this.checkScreenSize();
          this.state.isInitialized = true;
          console.log('�️ Desktop Navbar initialized');
        } else {
          setTimeout(initializeWhenReady, 200);
        }
      };
      
      setTimeout(initializeWhenReady, 100);
    }
    // Remove the mobile skip log to reduce console noise
  },

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements.navbar = document.querySelector('.navbar-professional');
    this.elements.toggler = document.querySelector('.modern-toggler');
    this.elements.collapse = document.querySelector('.navbar-collapse');
    this.elements.links = document.querySelectorAll('.nav-link');
    
    // Debug element caching
    console.log('🔍 Elements cached:', {
      navbar: !!this.elements.navbar,
      toggler: !!this.elements.toggler,
      collapse: !!this.elements.collapse,
      links: this.elements.links.length
    });
  },

  /**
   * Bind events with passive listeners for performance
   */
  bindEvents() {
    // Mobile menu toggle
    if (this.elements.toggler) {
      this.elements.toggler.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
      console.log('✅ Navbar toggler event bound (mobile)');
    } else {
      console.log('ℹ️ Navbar toggler not found (desktop view - normal)');
    }

    // Smart menu closing on link clicks
    if (this.elements.links && this.elements.links.length > 0) {
      this.elements.links.forEach(link => {
        link.addEventListener('click', (e) => {
          // Don't close menu if it's a dropdown toggle
          if (link.classList.contains('dropdown-toggle')) {
            return; // Let Bootstrap handle dropdown toggle
          }
          
          // Close menu only for actual navigation links
          if (this.state.isMobile && this.state.isMobileMenuOpen && link.getAttribute('href') !== '#') {
            setTimeout(() => this.closeMobileMenu(), 100); // Small delay for UX
          }
        });
      });
      console.log(`✅ ${this.elements.links.length} nav links events bound`);
    }

    // Close menu on outside click (but not on dropdown items)
    document.addEventListener('click', (e) => {
      if (this.state.isMobileMenuOpen) {
        // Don't close if clicking on navbar content, toggler, or dropdown items
        const isNavbarClick = this.elements.collapse.contains(e.target) || 
                             this.elements.toggler.contains(e.target) ||
                             e.target.closest('.dropdown-menu') ||
                             e.target.closest('.nav-link');
        
        if (!isNavbarClick) {
          this.closeMobileMenu();
        }
      }
    });

    // Resize handler with throttling
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.checkScreenSize();
      }, 100);
    }, { passive: true });

    // Scroll handler with throttling
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.handleScroll();
      }, 50);
    }, { passive: true });

    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  },

  /**
   * Fast mobile menu toggle
   */
  toggleMobileMenu() {
    if (this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  /**
   * Open mobile menu with fast animation
   */
  openMobileMenu() {
    if (!this.elements.collapse) return;

    this.state.isMobileMenuOpen = true;
    this.elements.collapse.classList.add('show');
    
    if (this.elements.toggler) {
      this.elements.toggler.setAttribute('aria-expanded', 'true');
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    console.log('📱 Mobile menu opened');
  },

  /**
   * Close mobile menu with fast animation
   */
  closeMobileMenu() {
    if (!this.elements.collapse) return;

    this.state.isMobileMenuOpen = false;
    this.elements.collapse.classList.remove('show');
    
    if (this.elements.toggler) {
      this.elements.toggler.setAttribute('aria-expanded', 'false');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('📱 Mobile menu closed');
  },

  /**
   * Check screen size and update state
   */
  checkScreenSize() {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = window.innerWidth < this.config.mobileBreakpoint;

    // Close mobile menu if switched to desktop
    if (wasMobile && !this.state.isMobile && this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  },

  /**
   * Handle scroll effects with performance optimization
   */
  handleScroll() {
    if (!this.elements.navbar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrolled = scrollTop > this.config.scrollThreshold;

    // Add/remove scrolled class for styling
    if (isScrolled) {
      this.elements.navbar.classList.add('scrolled');
    } else {
      this.elements.navbar.classList.remove('scrolled');
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.Navbar) window.Navbar.init();
  });
} else {
  if (window.Navbar) window.Navbar.init();
}
