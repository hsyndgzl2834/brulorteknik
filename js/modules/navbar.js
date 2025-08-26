/**
 * Professional Navbar JavaScript Module
 * Optimized for both desktop and mobile with hover dropdowns
 */

window.Navbar = {
  // Configuration
  config: {
    mobileBreakpoint: 992,
    fastTransition: 200,
    scrollThreshold: 50,
    hoverDelay: 150
  },

  // State management
  state: {
    isInitialized: false,
    isMobileMenuOpen: false,
    isMobile: window.innerWidth < 992,
    hoverTimers: {}
  },

  // Cached elements
  elements: {
    navbar: null,
    toggler: null,
    collapse: null,
    links: null,
    dropdowns: null
  },

  /**
   * Initialize navbar for both desktop and mobile
   */
  init() {
    if (this.state.isInitialized) {
      console.log('🔄 Navbar already initialized');
      return;
    }
    
    const initializeWhenReady = () => {
      this.cacheElements();
      
      // Initialize if navbar elements exist
      if (this.elements.navbar) {
        this.bindEvents();
        this.checkScreenSize();
        this.state.isInitialized = true;
        console.log('✅ Navbar initialized');
      } else {
        setTimeout(initializeWhenReady, 200);
      }
    };
    
    setTimeout(initializeWhenReady, 100);
  },

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements.navbar = document.querySelector('.navbar-professional');
    this.elements.toggler = document.querySelector('.modern-toggler');
    this.elements.collapse = document.querySelector('.navbar-collapse');
    this.elements.links = document.querySelectorAll('.nav-link');
    this.elements.dropdowns = document.querySelectorAll('.dropdown');
    
    console.log('🔍 Elements cached:', {
      navbar: !!this.elements.navbar,
      toggler: !!this.elements.toggler,
      collapse: !!this.elements.collapse,
      links: this.elements.links.length,
      dropdowns: this.elements.dropdowns.length
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
    }

    // Desktop dropdown hover functionality
    if (this.elements.dropdowns && this.elements.dropdowns.length > 0) {
      this.elements.dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
          // Mouse enter - show dropdown
          dropdown.addEventListener('mouseenter', () => {
            if (!this.state.isMobile) {
              this.showDropdown(dropdown, dropdownMenu);
            }
          });
          
          // Mouse leave - hide dropdown
          dropdown.addEventListener('mouseleave', () => {
            if (!this.state.isMobile) {
              this.hideDropdown(dropdown, dropdownMenu);
            }
          });
          
          // Click toggle for mobile
          dropdownToggle.addEventListener('click', (e) => {
            if (this.state.isMobile) {
              e.preventDefault();
              this.toggleDropdown(dropdown, dropdownMenu);
            }
          });
        }
      });
    }

    // Smart menu closing on link clicks
    if (this.elements.links && this.elements.links.length > 0) {
      this.elements.links.forEach(link => {
        link.addEventListener('click', (e) => {
          // Don't close menu if it's a dropdown toggle
          if (link.classList.contains('dropdown-toggle')) {
            return;
          }
          
          // Close menu only for actual navigation links
          if (this.state.isMobile && this.state.isMobileMenuOpen && link.getAttribute('href') !== '#') {
            setTimeout(() => this.closeMobileMenu(), 100);
          }
        });
      });
    }

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.state.isMobileMenuOpen) {
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
   * Show dropdown menu (desktop)
   */
  showDropdown(dropdown, dropdownMenu) {
    // Clear any existing timer
    if (this.state.hoverTimers[dropdown.id || 'default']) {
      clearTimeout(this.state.hoverTimers[dropdown.id || 'default']);
    }
    
    dropdown.classList.add('show');
    dropdownMenu.classList.add('show');
    
    // Add active state to toggle
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.classList.add('active');
    }
  },

  /**
   * Hide dropdown menu (desktop)
   */
  hideDropdown(dropdown, dropdownMenu) {
    const timerId = dropdown.id || 'default';
    
    // Set timer to hide dropdown
    this.state.hoverTimers[timerId] = setTimeout(() => {
      dropdown.classList.remove('show');
      dropdownMenu.classList.remove('show');
      
      // Remove active state from toggle
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.classList.remove('active');
      }
    }, this.config.hoverDelay);
  },

  /**
   * Toggle dropdown menu (mobile)
   */
  toggleDropdown(dropdown, dropdownMenu) {
    const isOpen = dropdown.classList.contains('show');
    
    // Close all other dropdowns first
    this.elements.dropdowns.forEach(otherDropdown => {
      if (otherDropdown !== dropdown) {
        otherDropdown.classList.remove('show');
        const otherMenu = otherDropdown.querySelector('.dropdown-menu');
        if (otherMenu) otherMenu.classList.remove('show');
      }
    });
    
    // Toggle current dropdown
    if (isOpen) {
      dropdown.classList.remove('show');
      dropdownMenu.classList.remove('show');
    } else {
      dropdown.classList.add('show');
      dropdownMenu.classList.add('show');
    }
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
    
    // Close all dropdowns when switching between mobile/desktop
    if (this.elements.dropdowns) {
      this.elements.dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) dropdownMenu.classList.remove('show');
      });
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
