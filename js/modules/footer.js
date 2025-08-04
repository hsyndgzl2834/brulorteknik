/**
 * Modern Footer JavaScript Module
 * Handles footer interactions, animations, and functionality
 */

// Make Footer globally available
window.Footer = {
  // Configuration
  config: {
    backToTopThreshold: 300,
    animationDelay: 100,
    scrollSmooth: true,
    enableTooltips: true,
    enableRegionHover: true,
    enableSocialEffects: true
  },

  // State
  state: {
    isInitialized: false,
    backToTopVisible: false,
    currentRegion: null,
    scrollPosition: 0
  },

  // Elements cache
  elements: {
    footer: null,
    backToTop: null,
    regionGroups: null,
    socialLinks: null,
    footerLinks: null,
    contactItems: null
  },

  /**
   * Initialize footer functionality
   */
  init() {
    if (this.state.isInitialized) return;
    
    this.cacheElements();
    this.bindEvents();
    this.initAnimations();
    this.initBackToTop();
    this.initTooltips();
    this.initRegionInteractions();
    this.initSocialEffects();
    this.debugFooterElements();
    
    this.state.isInitialized = true;
    console.log('Footer initialized successfully');
  },

  /**
   * Debug footer elements
   */
  debugFooterElements() {
    console.log('🔍 Footer Debug Bilgileri:');
    
    // Footer elementini kontrol et
    const footer = document.querySelector('.footer');
    if (footer) {
      const footerStyle = window.getComputedStyle(footer);
      console.log('✅ Footer elementi bulundu');
      console.log('   Display:', footerStyle.display);
      console.log('   Visibility:', footerStyle.visibility);
      console.log('   Opacity:', footerStyle.opacity);
      console.log('   Height:', footerStyle.height);
    } else {
      console.log('❌ Footer elementi bulunamadı!');
    }
    
    // Service areas bölümünü kontrol et
    const serviceAreas = document.querySelector('.footer-service-areas');
    if (serviceAreas) {
      const serviceStyle = window.getComputedStyle(serviceAreas);
      console.log('✅ Service Areas bulundu');
      console.log('   Display:', serviceStyle.display);
      console.log('   Visibility:', serviceStyle.visibility);
      console.log('   Height:', serviceStyle.height);
    } else {
      console.log('❌ Service Areas bulunamadı!');
    }
    
    // Region groups'ları kontrol et
    const regionGroups = document.querySelectorAll('.region-group');
    console.log(`📊 Region Groups: ${regionGroups.length} adet bulundu`);
    
    // Cities'leri kontrol et
    const cities = document.querySelectorAll('.city');
    console.log(`🏙️ Cities: ${cities.length} adet bulundu`);
    
    // İlk birkaç şehri listele
    if (cities.length > 0) {
      console.log('📍 İlk 5 şehir:');
      for (let i = 0; i < Math.min(5, cities.length); i++) {
        console.log(`   - ${cities[i].textContent}`);
      }
    }
    
    // Service areas header'ını kontrol et
    const serviceHeader = document.querySelector('.service-areas-header');
    if (serviceHeader) {
      const headerStyle = window.getComputedStyle(serviceHeader);
      console.log('✅ Service Areas Header bulundu');
      console.log('   Display:', headerStyle.display);
      console.log('   Visibility:', headerStyle.visibility);
    } else {
      console.log('❌ Service Areas Header bulunamadı!');
    }
    
    // Service areas subtitle'ını kontrol et
    const serviceSubtitle = document.querySelector('.service-areas-subtitle');
    if (serviceSubtitle) {
      const subtitleStyle = window.getComputedStyle(serviceSubtitle);
      console.log('✅ Service Areas Subtitle bulundu');
      console.log('   Display:', subtitleStyle.display);
      console.log('   Visibility:', subtitleStyle.visibility);
    } else {
      console.log('❌ Service Areas Subtitle bulunamadı!');
    }
  },

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements.footer = document.querySelector('.footer');
    this.elements.backToTop = document.getElementById('backToTop');
    this.elements.regionGroups = document.querySelectorAll('.region-group');
    this.elements.socialLinks = document.querySelectorAll('.social-link');
    this.elements.footerLinks = document.querySelectorAll('.footer-link');
    this.elements.contactItems = document.querySelectorAll('.contact-item');
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Scroll events
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Back to top click
    if (this.elements.backToTop) {
      this.elements.backToTop.addEventListener('click', this.scrollToTop.bind(this));
    }

    // Region group interactions
    if (this.config.enableRegionHover) {
      this.elements.regionGroups.forEach(group => {
        group.addEventListener('mouseenter', this.handleRegionHover.bind(this));
        group.addEventListener('mouseleave', this.handleRegionLeave.bind(this));
        group.addEventListener('click', this.handleRegionClick.bind(this));
      });
    }

    // Social link interactions
    if (this.config.enableSocialEffects) {
      this.elements.socialLinks.forEach(link => {
        link.addEventListener('mouseenter', this.handleSocialHover.bind(this));
        link.addEventListener('mouseleave', this.handleSocialLeave.bind(this));
        link.addEventListener('click', this.handleSocialClick.bind(this));
      });
    }

    // Footer link interactions
    this.elements.footerLinks.forEach(link => {
      link.addEventListener('mouseenter', this.handleLinkHover.bind(this));
      link.addEventListener('mouseleave', this.handleLinkLeave.bind(this));
    });

    // Contact item interactions
    this.elements.contactItems.forEach(item => {
      item.addEventListener('mouseenter', this.handleContactHover.bind(this));
      item.addEventListener('mouseleave', this.handleContactLeave.bind(this));
    });

    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  },

  /**
   * Initialize animations
   */
  initAnimations() {
    // Intersection Observer for footer widgets
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe footer widgets
    const widgets = document.querySelectorAll('.footer-widget');
    widgets.forEach(widget => {
      widget.style.opacity = '0';
      widget.style.transform = 'translateY(30px)';
      widget.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(widget);
    });
  },

  /**
   * Initialize back to top functionality
   */
  initBackToTop() {
    if (!this.elements.backToTop) return;

    // Check initial scroll position
    this.handleScroll();
  },

  /**
   * Initialize tooltips
   */
  initTooltips() {
    if (!this.config.enableTooltips) return;

    this.elements.socialLinks.forEach(link => {
      const tooltip = link.getAttribute('data-tooltip');
      if (tooltip) {
        link.setAttribute('title', tooltip);
      }
    });
  },

  /**
   * Initialize region interactions
   */
  initRegionInteractions() {
    if (!this.config.enableRegionHover) return;

    // Add hover effects to cities
    const cities = document.querySelectorAll('.city');
    cities.forEach(city => {
      city.addEventListener('mouseenter', this.handleCityHover.bind(this));
      city.addEventListener('mouseleave', this.handleCityLeave.bind(this));
    });
  },

  /**
   * Initialize social effects
   */
  initSocialEffects() {
    if (!this.config.enableSocialEffects) return;

    // Add ripple effect to social links
    this.elements.socialLinks.forEach(link => {
      link.addEventListener('click', this.createRippleEffect.bind(this));
    });
  },

  /**
   * Handle scroll events
   */
  handleScroll() {
    this.state.scrollPosition = window.pageYOffset;
    
    // Back to top visibility
    if (this.elements.backToTop) {
      const shouldShow = this.state.scrollPosition > this.config.backToTopThreshold;
      
      if (shouldShow !== this.state.backToTopVisible) {
        this.state.backToTopVisible = shouldShow;
        this.elements.backToTop.classList.toggle('visible', shouldShow);
      }
    }

    // Parallax effect for footer
    if (this.elements.footer) {
      const scrolled = this.state.scrollPosition;
      const rate = scrolled * -0.5;
      this.elements.footer.style.transform = `translateY(${rate}px)`;
    }
  },

  /**
   * Scroll to top smoothly
   */
  scrollToTop() {
    if (this.config.scrollSmooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }

    // Focus management for accessibility
    const firstFocusableElement = document.querySelector('header a, header button, .navbar a, .navbar button');
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  },

  /**
   * Handle region group hover
   */
  handleRegionHover(event) {
    const region = event.currentTarget;
    const regionName = region.getAttribute('data-region');
    
    this.state.currentRegion = regionName;
    region.style.transform = 'translateY(-5px) scale(1.02)';
    
    // Add glow effect
    region.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
    
    // Animate cities
    const cities = region.querySelectorAll('.city');
    cities.forEach((city, index) => {
      setTimeout(() => {
        city.style.transform = 'scale(1.1)';
        city.style.background = 'var(--accent-color)';
      }, index * 50);
    });
  },

  /**
   * Handle region group leave
   */
  handleRegionLeave(event) {
    const region = event.currentTarget;
    
    region.style.transform = 'translateY(0) scale(1)';
    region.style.boxShadow = '';
    
    // Reset cities
    const cities = region.querySelectorAll('.city');
    cities.forEach(city => {
      city.style.transform = 'scale(1)';
      city.style.background = '';
    });
    
    this.state.currentRegion = null;
  },

  /**
   * Handle region click
   */
  handleRegionClick(event) {
    const region = event.currentTarget;
    const regionName = region.getAttribute('data-region');
    
    // Create click effect
    this.createClickEffect(event);
    
    // Log region interaction
    console.log(`Region clicked: ${regionName}`);
    
    // You can add navigation or other functionality here
    // For example, scroll to contact form with region pre-filled
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Handle city hover
   */
  handleCityHover(event) {
    const city = event.currentTarget;
    city.style.transform = 'scale(1.15)';
    city.style.background = 'var(--accent-color)';
    city.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
  },

  /**
   * Handle city leave
   */
  handleCityLeave(event) {
    const city = event.currentTarget;
    city.style.transform = 'scale(1)';
    city.style.background = '';
    city.style.boxShadow = '';
  },

  /**
   * Handle social link hover
   */
  handleSocialHover(event) {
    const link = event.currentTarget;
    link.style.transform = 'translateY(-5px) scale(1.1)';
    
    // Add pulse effect
    link.style.animation = 'pulse 0.6s ease-in-out';
  },

  /**
   * Handle social link leave
   */
  handleSocialLeave(event) {
    const link = event.currentTarget;
    link.style.transform = 'translateY(0) scale(1)';
    link.style.animation = '';
  },

  /**
   * Handle social link click
   */
  handleSocialClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    
    // Create click effect
    this.createClickEffect(event);
    
    // Log social interaction
    console.log(`Social link clicked: ${href}`);
    
    // Add analytics tracking if needed
    if (typeof gtag !== 'undefined') {
      gtag('event', 'social_click', {
        'social_platform': link.classList.contains('whatsapp') ? 'whatsapp' : 
                          link.classList.contains('phone') ? 'phone' : 
                          link.classList.contains('email') ? 'email' : 'location'
      });
    }
  },

  /**
   * Handle footer link hover
   */
  handleLinkHover(event) {
    const link = event.currentTarget;
    const icon = link.querySelector('i');
    
    if (icon) {
      icon.style.transform = 'scale(1.2) rotate(5deg)';
    }
    
    link.style.transform = 'translateX(10px)';
  },

  /**
   * Handle footer link leave
   */
  handleLinkLeave(event) {
    const link = event.currentTarget;
    const icon = link.querySelector('i');
    
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
    
    link.style.transform = 'translateX(0)';
  },

  /**
   * Handle contact item hover
   */
  handleContactHover(event) {
    const item = event.currentTarget;
    const icon = item.querySelector('i');
    
    if (icon) {
      icon.style.transform = 'scale(1.2)';
      icon.style.color = 'var(--accent-color)';
    }
    
    item.style.background = 'rgba(255, 255, 255, 0.15)';
  },

  /**
   * Handle contact item leave
   */
  handleContactLeave(event) {
    const item = event.currentTarget;
    const icon = item.querySelector('i');
    
    if (icon) {
      icon.style.transform = 'scale(1)';
      icon.style.color = '';
    }
    
    item.style.background = '';
  },

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    // Back to top with Escape key
    if (event.key === 'Escape' && this.state.backToTopVisible) {
      this.scrollToTop();
    }
    
    // Region navigation with arrow keys
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.closest('.region-group')) {
        event.preventDefault();
        this.navigateRegions(event.key === 'ArrowDown' ? 1 : -1);
      }
    }
  },

  /**
   * Navigate between regions
   */
  navigateRegions(direction) {
    const regions = Array.from(this.elements.regionGroups);
    const currentIndex = regions.findIndex(region => region.contains(document.activeElement));
    
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + direction + regions.length) % regions.length;
      const nextRegion = regions[nextIndex];
      const firstFocusable = nextRegion.querySelector('a, button, [tabindex]');
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  },

  /**
   * Create ripple effect
   */
  createRippleEffect(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
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
   * Update footer content dynamically
   */
  updateContent(newContent) {
    if (this.elements.footer) {
      this.elements.footer.innerHTML = newContent;
      this.cacheElements();
      this.bindEvents();
    }
  },

  /**
   * Get footer statistics
   */
  getStats() {
    return {
      regions: this.elements.regionGroups.length,
      cities: document.querySelectorAll('.city').length,
      socialLinks: this.elements.socialLinks.length,
      footerLinks: this.elements.footerLinks.length,
      contactItems: this.elements.contactItems.length
    };
  },

  /**
   * Destroy footer functionality
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    
    // Reset state
    this.state.isInitialized = false;
    this.state.backToTopVisible = false;
    this.state.currentRegion = null;
    
    // Clear elements cache
    this.elements = {
      footer: null,
      backToTop: null,
      regionGroups: null,
      socialLinks: null,
      footerLinks: null,
      contactItems: null
    };
    
    console.log('Footer destroyed');
  }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Make Footer available globally
window.Footer = window.Footer; 