/**
 * Modern Navbar JavaScript Module
 * Handles mobile menu toggle, scroll effects, and accessibility
 */

// Make Navbar globally available
window.Navbar = {
  // Configuration
  config: {
    mobileBreakpoint: 991,
    scrollThreshold: 100,
    animationDuration: 300,
    enableScrollEffects: true,
    enableAccessibility: true,
    enableKeyboardNav: true,
    enableTouchGestures: true
  },

  // State
  state: {
    isInitialized: false,
    isMobileMenuOpen: false,
    isScrolled: false,
    currentFocusIndex: -1,
    lastScrollPosition: 0
  },

  // Elements cache
  elements: {
    navbar: null,
    navbarToggler: null,
    navbarCollapse: null,
    navbarLinks: null,
    navbarActions: null,
    mobileMenuClose: null,
    brand: null
  },

  /**
   * Initialize navbar functionality
   */
  init() {
    if (this.state.isInitialized) return;
    
    console.log('🚀 Initializing navbar...');
    
    this.cacheElements();
    this.bindEvents();
    this.ensureInitialState();
    this.initAccessibility();
    this.initKeyboardNavigation();
    this.initTouchGestures();
    this.debugNavbarElements();
    
    this.state.isInitialized = true;
    console.log('✅ Navbar initialized successfully');
  },

  /**
   * Debug navbar elements
   */
  debugNavbarElements() {
    console.log('🔍 Navbar Debug Bilgileri:');
    
    // Navbar elementini kontrol et
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
      const navbarStyle = window.getComputedStyle(navbar);
      console.log('✅ Navbar elementi bulundu');
      console.log('   Display:', navbarStyle.display);
      console.log('   Visibility:', navbarStyle.visibility);
      console.log('   Opacity:', navbarStyle.opacity);
      console.log('   Position:', navbarStyle.position);
      console.log('   Z-index:', navbarStyle.zIndex);
    } else {
      console.log('❌ Navbar elementi bulunamadı!');
    }
    
    // Navbar collapse'ı kontrol et
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
      const collapseStyle = window.getComputedStyle(navbarCollapse);
      console.log('✅ Navbar Collapse bulundu');
      console.log('   Display:', collapseStyle.display);
      console.log('   Visibility:', collapseStyle.visibility);
      console.log('   Opacity:', collapseStyle.opacity);
      console.log('   Position:', collapseStyle.position);
      console.log('   Transform:', collapseStyle.transform);
    } else {
      console.log('❌ Navbar Collapse bulunamadı!');
    }
    
    // Navbar toggler'ı kontrol et
    const navbarToggler = document.querySelector('.modern-toggler');
    if (navbarToggler) {
      const togglerStyle = window.getComputedStyle(navbarToggler);
      console.log('✅ Navbar Toggler bulundu');
      console.log('   Display:', togglerStyle.display);
      console.log('   Visibility:', togglerStyle.visibility);
      console.log('   Opacity:', togglerStyle.opacity);
      console.log('   Aria-expanded:', navbarToggler.getAttribute('aria-expanded'));
    } else {
      console.log('❌ Navbar Toggler bulunamadı!');
    }
    
    // Navbar nav'ı kontrol et
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
      const navStyle = window.getComputedStyle(navbarNav);
      console.log('✅ Navbar Nav bulundu');
      console.log('   Display:', navStyle.display);
      console.log('   Visibility:', navStyle.visibility);
      console.log('   Flex-direction:', navStyle.flexDirection);
    } else {
      console.log('❌ Navbar Nav bulunamadı!');
    }
    
    // Navbar actions'ı kontrol et
    const navbarActions = document.querySelector('.navbar-actions');
    if (navbarActions) {
      const actionsStyle = window.getComputedStyle(navbarActions);
      console.log('✅ Navbar Actions bulundu');
      console.log('   Display:', actionsStyle.display);
      console.log('   Visibility:', actionsStyle.visibility);
    } else {
      console.log('❌ Navbar Actions bulunamadı!');
    }
    
    // Ekran genişliğini kontrol et
    const screenWidth = window.innerWidth;
    console.log(`📱 Ekran genişliği: ${screenWidth}px`);
    console.log(`📱 Mobil mod: ${screenWidth <= this.config.mobileBreakpoint ? 'Evet' : 'Hayır'}`);
    
    // Navbar links sayısını kontrol et
    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    console.log(`🔗 Navbar links: ${navbarLinks.length} adet`);
    
    // Navbar actions sayısını kontrol et
    const actions = document.querySelectorAll('.navbar-actions .btn');
    console.log(`🔘 Navbar actions: ${actions.length} adet`);
  },

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements.navbar = document.querySelector('.navbar-custom');
    this.elements.navbarToggler = document.querySelector('.modern-toggler');
    this.elements.navbarCollapse = document.querySelector('.navbar-collapse');
    this.elements.navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    this.elements.navbarActions = document.querySelectorAll('.navbar-actions .btn');
    this.elements.mobileMenuClose = document.querySelector('.mobile-menu-close');
    this.elements.brand = document.querySelector('.navbar-brand');
    
    // Log cached elements
    console.log('📋 Cached elements:', {
      navbar: !!this.elements.navbar,
      navbarToggler: !!this.elements.navbarToggler,
      navbarCollapse: !!this.elements.navbarCollapse,
      navbarLinks: this.elements.navbarLinks.length,
      navbarActions: this.elements.navbarActions.length
    });
    
    // Debug element details
    console.log('🔍 Navbar element:', this.elements.navbar);
    console.log('🔍 Toggler element:', this.elements.navbarToggler);
    console.log('🔍 Collapse element:', this.elements.navbarCollapse);
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Mobile menu toggle
    if (this.elements.navbarToggler) {
      this.elements.navbarToggler.addEventListener('click', this.toggleMobileMenu.bind(this));
      console.log('📱 Mobile menu toggle event bound');
      console.log('🔍 Toggler element details:', this.elements.navbarToggler);
    } else {
      console.error('❌ Navbar toggler element not found!');
    }

    // Mobile menu close button
    if (this.elements.mobileMenuClose) {
      this.elements.mobileMenuClose.addEventListener('click', this.hideMobileMenu.bind(this));
      console.log('❌ Mobile menu close event bound');
    }

    // Scroll effects
    if (this.config.enableScrollEffects) {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      console.log('📜 Scroll effects enabled');
    }

    // Window resize
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    console.log('🔄 Resize event bound');

    // Click outside to close mobile menu
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    console.log('🖱️ Outside click event bound');

    // Keyboard navigation
    if (this.config.enableKeyboardNav) {
      document.addEventListener('keydown', this.handleKeyboard.bind(this));
      console.log('⌨️ Keyboard navigation enabled');
    }

    // Touch gestures for mobile
    if (this.config.enableTouchGestures) {
      this.initTouchGestures();
      console.log('👆 Touch gestures enabled');
    }
  },

  /**
   * Ensure initial state
   */
  ensureInitialState() {
    // Ensure mobile menu is closed initially
    if (this.elements.navbarCollapse) {
      this.elements.navbarCollapse.classList.remove('show');
    }
    
    if (this.elements.navbarToggler) {
      this.elements.navbarToggler.setAttribute('aria-expanded', 'false');
    }
    
    this.state.isMobileMenuOpen = false;
    console.log('🔧 Initial state ensured');
  },

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    if (!this.config.enableAccessibility) return;

    // Add ARIA labels
    if (this.elements.navbarToggler) {
      this.elements.navbarToggler.setAttribute('aria-label', 'Menüyü aç/kapat');
      this.elements.navbarToggler.setAttribute('aria-controls', 'navbarNav');
      this.elements.navbarToggler.setAttribute('aria-expanded', 'false');
    }

    // Add role attributes
    if (this.elements.navbar) {
      this.elements.navbar.setAttribute('role', 'navigation');
      this.elements.navbar.setAttribute('aria-label', 'Ana navigasyon');
    }

    // Add focus management
    this.elements.navbarLinks.forEach((link, index) => {
      link.setAttribute('role', 'menuitem');
      link.setAttribute('tabindex', '0');
    });

    console.log('♿ Accessibility features initialized');
  },

  /**
   * Initialize keyboard navigation
   */
  initKeyboardNavigation() {
    if (!this.config.enableKeyboardNav) return;

    // Focus management for mobile menu
    this.elements.navbarLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });

    console.log('⌨️ Keyboard navigation initialized');
  },

  /**
   * Initialize touch gestures
   */
  initTouchGestures() {
    if (!this.config.enableTouchGestures) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    // Touch start
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = false;
    }, { passive: true });

    // Touch move
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) {
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        
        if (deltaX > 10 || deltaY > 10) {
          isDragging = true;
        }
      }
    }, { passive: true });

    // Touch end
    document.addEventListener('touchend', (e) => {
      if (isDragging) {
        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = e.changedTouches[0].clientY - startY;
        
        // Swipe right to open menu (only on mobile)
        if (window.innerWidth <= this.config.mobileBreakpoint && 
            deltaX > 50 && Math.abs(deltaY) < 50 && 
            !this.state.isMobileMenuOpen) {
          this.showMobileMenu();
        }
        
        // Swipe left to close menu
        if (deltaX < -50 && Math.abs(deltaY) < 50 && 
            this.state.isMobileMenuOpen) {
          this.hideMobileMenu();
        }
      }
    }, { passive: true });

    console.log('👆 Touch gestures initialized');
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    console.log('🔄 Toggling mobile menu...');
    console.log('📱 Current state:', this.state.isMobileMenuOpen);
    
    if (this.state.isMobileMenuOpen) {
      this.hideMobileMenu();
    } else {
      this.showMobileMenu();
    }
  },

  /**
   * Show mobile menu
   */
  showMobileMenu() {
    console.log('📱 Showing mobile menu...');
    
    if (!this.elements.navbarCollapse || !this.elements.navbarToggler) {
      console.error('❌ Required elements not found for mobile menu');
      return;
    }

    // Add show class and force display
    this.elements.navbarCollapse.classList.add('show');
    this.elements.navbarCollapse.style.display = 'block';
    this.elements.navbarCollapse.style.visibility = 'visible';
    this.elements.navbarCollapse.style.opacity = '1';
    this.elements.navbarCollapse.style.transform = 'translateX(0)';
    
    // Update aria-expanded
    this.elements.navbarToggler.setAttribute('aria-expanded', 'true');
    
    // Update state
    this.state.isMobileMenuOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    setTimeout(() => {
      const firstLink = this.elements.navbarCollapse.querySelector('.nav-link');
      if (firstLink) {
        firstLink.focus();
      }
    }, 100);
    
    console.log('✅ Mobile menu shown');
    console.log('📱 Menu state:', this.state.isMobileMenuOpen);
    console.log('🔧 Aria-expanded:', this.elements.navbarToggler.getAttribute('aria-expanded'));
  },

  /**
   * Hide mobile menu
   */
  hideMobileMenu() {
    console.log('📱 Hiding mobile menu...');
    
    if (!this.elements.navbarCollapse || !this.elements.navbarToggler) {
      console.error('❌ Required elements not found for mobile menu');
      return;
    }

    // Remove show class and hide
    this.elements.navbarCollapse.classList.remove('show');
    this.elements.navbarCollapse.style.display = 'none';
    this.elements.navbarCollapse.style.visibility = 'hidden';
    this.elements.navbarCollapse.style.opacity = '0';
    this.elements.navbarCollapse.style.transform = 'translateX(-100%)';
    
    // Update aria-expanded
    this.elements.navbarToggler.setAttribute('aria-expanded', 'false');
    
    // Update state
    this.state.isMobileMenuOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to toggler
    this.elements.navbarToggler.focus();
    
    console.log('✅ Mobile menu hidden');
    console.log('📱 Menu state:', this.state.isMobileMenuOpen);
    console.log('🔧 Aria-expanded:', this.elements.navbarToggler.getAttribute('aria-expanded'));
  },

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollPosition = window.pageYOffset;
    const shouldBeScrolled = scrollPosition > this.config.scrollThreshold;
    
    if (shouldBeScrolled !== this.state.isScrolled) {
      this.state.isScrolled = shouldBeScrolled;
      
      if (this.elements.navbar) {
        this.elements.navbar.classList.toggle('navbar-scrolled', shouldBeScrolled);
      }
    }
    
    this.state.lastScrollPosition = scrollPosition;
  },

  /**
   * Handle window resize
   */
  handleResize() {
    const isMobile = window.innerWidth <= this.config.mobileBreakpoint;
    
    // Close mobile menu when switching to desktop
    if (!isMobile && this.state.isMobileMenuOpen) {
      this.hideMobileMenu();
    }
    
    // Update navbar classes based on screen size
    if (this.elements.navbar) {
      this.elements.navbar.classList.toggle('navbar-mobile', isMobile);
      this.elements.navbar.classList.toggle('navbar-desktop', !isMobile);
    }
  },

  /**
   * Handle clicks outside mobile menu
   */
  handleOutsideClick(event) {
    if (!this.state.isMobileMenuOpen) return;
    
    const isClickInsideNavbar = this.elements.navbar && this.elements.navbar.contains(event.target);
    const isClickOnToggler = this.elements.navbarToggler && this.elements.navbarToggler.contains(event.target);
    
    if (!isClickInsideNavbar && !isClickOnToggler) {
      this.hideMobileMenu();
    }
  },

  /**
   * Handle keyboard events
   */
  handleKeyboard(event) {
    // Escape key to close mobile menu
    if (event.key === 'Escape' && this.state.isMobileMenuOpen) {
      this.hideMobileMenu();
      return;
    }
    
    // Arrow keys for navigation
    if (this.state.isMobileMenuOpen) {
      const focusableElements = this.elements.navbarCollapse.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
      
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex].focus();
      }
    }
  },

  /**
   * Update navbar content dynamically
   */
  updateContent(newContent) {
    if (this.elements.navbar) {
      this.elements.navbar.innerHTML = newContent;
      this.cacheElements();
      this.bindEvents();
      this.ensureInitialState();
    }
  },

  /**
   * Get navbar statistics
   */
  getStats() {
    return {
      isInitialized: this.state.isInitialized,
      isMobileMenuOpen: this.state.isMobileMenuOpen,
      isScrolled: this.state.isScrolled,
      linksCount: this.elements.navbarLinks.length,
      actionsCount: this.elements.navbarActions.length,
      screenWidth: window.innerWidth,
      isMobile: window.innerWidth <= this.config.mobileBreakpoint
    };
  },

  /**
   * Destroy navbar functionality
   */
  destroy() {
    // Remove event listeners
    if (this.elements.navbarToggler) {
      this.elements.navbarToggler.removeEventListener('click', this.toggleMobileMenu);
    }
    
    if (this.elements.mobileMenuClose) {
      this.elements.mobileMenuClose.removeEventListener('click', this.hideMobileMenu);
    }
    
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyboard);
    
    // Reset state
    this.state.isInitialized = false;
    this.state.isMobileMenuOpen = false;
    this.state.isScrolled = false;
    
    // Clear elements cache
    this.elements = {
      navbar: null,
      navbarToggler: null,
      navbarCollapse: null,
      navbarLinks: null,
      navbarActions: null,
      mobileMenuClose: null,
      brand: null
    };
    
    console.log('🗑️ Navbar destroyed');
  }
};

// Make Navbar available globally
window.Navbar = Navbar;

// Test function to verify module loading
console.log('🚀 Navbar module loaded successfully');
console.log('Navbar object:', Navbar);
console.log('window.Navbar:', window.Navbar); 