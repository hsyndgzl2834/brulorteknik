/**
 * Modern Navbar JavaScript Module
 * Handles navbar interactions, mobile menu, and navigation
 */

const Navbar = {
  // Configuration
  config: {
    scrollThreshold: 100,
    mobileBreakpoint: 991,
    animationDuration: 300,
    enableSticky: true,
    enableMobileMenu: true,
    enableScrollHide: true
  },

  // State
  state: {
    isInitialized: false,
    isScrolled: false,
    isMobileMenuOpen: false,
    lastScrollPosition: 0,
    isSticky: false
  },

  // Elements cache
  elements: {
    navbar: null,
    navbarToggler: null,
    navbarCollapse: null,
    navbarLinks: null,
    navbarActions: null,
    navbarBrand: null,
    brandLogo: null
  },

  /**
   * Initialize navbar functionality
   */
  init() {
    if (this.state.isInitialized) return;
    
    // Wait for navbar elements to be available
    this.waitForElements();
  },

  /**
   * Wait for navbar elements to be available in DOM
   */
  waitForElements() {
    const maxAttempts = 50; // 5 seconds max
    let attempts = 0;
    
    const checkElements = () => {
      attempts++;
      
      // Check if elements exist
      const navbar = document.querySelector('.navbar-custom');
      const navbarToggler = document.querySelector('.modern-toggler');
      const navbarCollapse = document.querySelector('.collapse.navbar-collapse');
      
      console.log(`Attempt ${attempts}: navbar=${!!navbar}, toggler=${!!navbarToggler}, collapse=${!!navbarCollapse}`);
      
      if (navbar && navbarToggler && navbarCollapse) {
        console.log('Navbar elements found, initializing...');
        this.initializeNavbar();
      } else if (attempts < maxAttempts) {
        // Try again in 100ms
        setTimeout(checkElements, 100);
      } else {
        console.error('Navbar elements not found after maximum attempts');
      }
    };
    
    checkElements();
  },

  /**
   * Initialize navbar after elements are available
   */
  initializeNavbar() {
    this.cacheElements();
    this.bindEvents();
    this.initStickyNavbar();
    this.initMobileMenu();
    this.initScrollEffects();
    this.initAccessibility();
    
    this.state.isInitialized = true;
    console.log('Navbar initialized successfully');
  },

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements = {
      navbar: document.querySelector('.navbar-custom'),
      navbarToggler: document.querySelector('.modern-toggler'),
      navbarCollapse: document.querySelector('.collapse.navbar-collapse'),
      navbarLinks: document.querySelectorAll('.modern-link'),
      navbarActions: document.querySelectorAll('.navbar-actions .btn'),
      navbarBrand: document.querySelector('.navbar-brand'),
      brandLogo: document.querySelector('.brand-logo')
    };
    
    console.log('Cached elements:', {
      navbar: !!this.elements.navbar,
      navbarToggler: !!this.elements.navbarToggler,
      navbarCollapse: !!this.elements.navbarCollapse,
      navbarLinks: this.elements.navbarLinks.length,
      navbarActions: this.elements.navbarActions.length,
      navbarBrand: !!this.elements.navbarBrand,
      brandLogo: !!this.elements.brandLogo
    });
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Scroll events
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Mobile menu toggle
    if (this.elements.navbarToggler) {
      this.elements.navbarToggler.addEventListener('click', this.toggleMobileMenu.bind(this));
      this.elements.navbarToggler.addEventListener('touchstart', this.toggleMobileMenu.bind(this), { passive: false });
    }

    // Navbar link clicks - check if elements exist
    if (this.elements.navbarLinks && this.elements.navbarLinks.length > 0) {
      this.elements.navbarLinks.forEach(link => {
        link.addEventListener('click', this.handleLinkClick.bind(this));
      });
    }

    // Action button clicks - check if elements exist
    if (this.elements.navbarActions && this.elements.navbarActions.length > 0) {
      this.elements.navbarActions.forEach(button => {
        button.addEventListener('click', this.handleActionClick.bind(this));
      });
    }

    // Window resize
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });

    // Touch events for mobile
    if (this.config.enableMobileMenu) {
      this.initTouchEvents();
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  },

  /**
   * Initialize sticky navbar
   */
  initStickyNavbar() {
    if (!this.config.enableSticky) return;

    // Check initial scroll position
    this.handleScroll();
  },

  /**
   * Initialize mobile menu
   */
  initMobileMenu() {
    if (!this.elements.navbarToggler) return;
    
    // Mobile menu toggle
    this.elements.navbarToggler.addEventListener('click', (event) => {
      this.toggleMobileMenu(event);
    });
    
    // Mobile menu close button
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', (event) => {
        this.hideMobileMenu();
      });
    }
    
    // Close menu when clicking on links
    if (this.elements.navbarLinks && this.elements.navbarLinks.length > 0) {
      this.elements.navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 991) {
            setTimeout(() => {
              this.hideMobileMenu();
            }, 300);
          }
        });
      });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 991) {
        const navbar = this.elements.navbar;
        const navbarToggler = this.elements.navbarToggler;
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        
        if (!navbar.contains(event.target) && 
            !navbarToggler.contains(event.target) && 
            !mobileMenuClose?.contains(event.target)) {
          this.hideMobileMenu();
        }
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && window.innerWidth <= 991) {
        this.hideMobileMenu();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991) {
        this.hideMobileMenu();
      }
    });
  },

  /**
   * Initialize scroll effects
   */
  initScrollEffects() {
    if (!this.config.enableScrollHide) return;

    // Add scroll-based navbar hide/show
    let lastScrollTop = 0;
    const navbar = this.elements.navbar;
    
    if (navbar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > this.config.scrollThreshold) {
          // Scrolling down - hide navbar
          navbar.style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up - show navbar
          navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
      }, { passive: true });
    }
  },

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    // Add ARIA attributes
    if (this.elements.navbarToggler) {
      this.elements.navbarToggler.setAttribute('aria-expanded', 'false');
      this.elements.navbarToggler.setAttribute('aria-controls', 'navbarNav');
    }

    // Add focus management
    this.elements.navbarLinks.forEach(link => {
      link.addEventListener('focus', this.handleLinkFocus.bind(this));
      link.addEventListener('blur', this.handleLinkBlur.bind(this));
    });

    // Add keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  },

  /**
   * Initialize touch events for mobile
   */
  initTouchEvents() {
    if (!this.elements.navbarCollapse) return;

    this.touchStartY = 0;
    this.touchEndY = 0;

    this.elements.navbarCollapse.addEventListener('touchstart', (e) => {
      this.touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    this.elements.navbarCollapse.addEventListener('touchend', (e) => {
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleTouchSwipe();
    }, { passive: true });
  },

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollPosition = window.pageYOffset;
    const navbar = this.elements.navbar;
    
    if (!navbar) return;

    // Update sticky state
    if (scrollPosition > this.config.scrollThreshold) {
      if (!this.state.isScrolled) {
        this.state.isScrolled = true;
        navbar.classList.add('navbar-scrolled');
      }
    } else {
      if (this.state.isScrolled) {
        this.state.isScrolled = false;
        navbar.classList.remove('navbar-scrolled');
      }
    }

    this.state.lastScrollPosition = scrollPosition;
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Toggle mobile menu clicked');
    
    if (!this.elements.navbarCollapse) {
      console.error('Navbar collapse element not found');
      return;
    }
    
    const isExpanded = this.elements.navbarToggler.getAttribute('aria-expanded') === 'true';
    
    console.log('Current state:', { isExpanded, isMobileMenuOpen: this.state.isMobileMenuOpen });
    
    if (isExpanded) {
      this.hideMobileMenu();
    } else {
      this.showMobileMenu();
    }
  },

  /**
   * Show mobile menu
   */
  showMobileMenu() {
    if (!this.elements.navbarCollapse || !this.elements.navbarToggler) return;
    
    console.log('Showing mobile menu');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show menu
    this.elements.navbarCollapse.style.display = 'flex';
    this.elements.navbarCollapse.style.opacity = '1';
    this.elements.navbarCollapse.style.visibility = 'visible';
    this.elements.navbarCollapse.classList.add('show');
    
    // Update toggler state
    this.elements.navbarToggler.setAttribute('aria-expanded', 'true');
    
    // Update internal state
    this.state.isMobileMenuOpen = true;
    
    // Focus management
    const firstLink = this.elements.navbarCollapse.querySelector('.modern-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
    
    console.log('Mobile menu opened');
  },

  /**
   * Hide mobile menu
   */
  hideMobileMenu() {
    if (!this.elements.navbarCollapse || !this.elements.navbarToggler) return;
    
    console.log('Hiding mobile menu');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Hide menu
    this.elements.navbarCollapse.style.opacity = '0';
    this.elements.navbarCollapse.style.visibility = 'hidden';
    this.elements.navbarCollapse.classList.remove('show');
    
    // Update toggler state
    this.elements.navbarToggler.setAttribute('aria-expanded', 'false');
    
    // Update internal state
    this.state.isMobileMenuOpen = false;
    
    // Hide after animation
    setTimeout(() => {
      if (this.elements.navbarToggler.getAttribute('aria-expanded') !== 'true') {
        this.elements.navbarCollapse.style.display = 'none';
      }
    }, 500);
    
    console.log('Mobile menu closed');
  },

  /**
   * Handle outside click
   */
  handleOutsideClick(event) {
    const navbar = this.elements.navbar;
    const navbarToggler = this.elements.navbarToggler;
    
    if (this.state.isMobileMenuOpen && 
        navbar && 
        !navbar.contains(event.target) && 
        !navbarToggler?.contains(event.target)) {
      this.hideMobileMenu();
    }
  },

  /**
   * Handle link clicks
   */
  handleLinkClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    
    // Close mobile menu if open
    if (this.state.isMobileMenuOpen) {
      this.hideMobileMenu();
    }
    
    // Add click effect
    this.createClickEffect(event);
    
    // Log navigation
    console.log(`Navigation: ${href}`);
  },

  /**
   * Handle action button clicks
   */
  handleActionClick(event) {
    const button = event.currentTarget;
    const action = button.getAttribute('data-action') || 'contact';
    
    // Add click effect
    this.createClickEffect(event);
    
    // Log action
    console.log(`Action clicked: ${action}`);
  },

  /**
   * Handle window resize
   */
  handleResize() {
    const isMobile = window.innerWidth <= this.config.mobileBreakpoint;
    
    // Hide mobile menu on desktop
    if (!isMobile && this.state.isMobileMenuOpen) {
      this.hideMobileMenu();
    }
    
    // Update navbar classes
    if (this.elements.navbar) {
      this.elements.navbar.classList.toggle('navbar-mobile', isMobile);
    }
  },

  /**
   * Handle touch swipe
   */
  handleTouchSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartY - this.touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe up - close menu
        this.hideMobileMenu();
      } else {
        // Swipe down - open menu
        this.showMobileMenu();
      }
    }
  },

  /**
   * Handle link focus
   */
  handleLinkFocus(event) {
    const link = event.currentTarget;
    link.classList.add('nav-link-focused');
  },

  /**
   * Handle link blur
   */
  handleLinkBlur(event) {
    const link = event.currentTarget;
    link.classList.remove('nav-link-focused');
  },

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    // Escape key to close mobile menu
    if (event.key === 'Escape' && this.state.isMobileMenuOpen) {
      this.hideMobileMenu();
    }
    
    // Enter key to activate focused element
    if (event.key === 'Enter') {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.classList.contains('nav-link')) {
        focusedElement.click();
      }
    }
  },

  /**
   * Create click effect
   */
  createClickEffect(event) {
    const element = event.currentTarget;
    element.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      element.style.transform = '';
    }, 150);
  },

  /**
   * Update navbar content dynamically
   */
  updateContent(newContent) {
    if (this.elements.navbar) {
      this.elements.navbar.innerHTML = newContent;
      this.cacheElements();
      this.bindEvents();
    }
  },

  /**
   * Get navbar state
   */
  getState() {
    return {
      isInitialized: this.state.isInitialized,
      isScrolled: this.state.isScrolled,
      isMobileMenuOpen: this.state.isMobileMenuOpen,
      isSticky: this.state.isSticky,
      lastScrollPosition: this.state.lastScrollPosition
    };
  },

  /**
   * Destroy navbar functionality
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyboard);
    
    // Reset state
    this.state.isInitialized = false;
    this.state.isScrolled = false;
    this.state.isMobileMenuOpen = false;
    this.state.isSticky = false;
    
    // Clear elements cache
    this.elements = {
      navbar: null,
      navbarToggler: null,
      navbarCollapse: null,
      navbarLinks: null,
      navbarActions: null,
      navbarBrand: null,
      brandLogo: null
    };
    
    console.log('Navbar destroyed');
  }
};

// Export for use in other modules
export default Navbar; 