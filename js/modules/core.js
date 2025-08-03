/**
 * Core JavaScript Module
 * Provides utility functions and core functionality
 */

// Make Core globally available
window.Core = {
  // Configuration
  config: {
    debug: false,
    performanceMonitoring: true,
    errorReporting: true
  },

  // State
  state: {
    isInitialized: false,
    performanceMetrics: {},
    errorCount: 0
  },

  /**
   * Initialize core functionality
   */
  init() {
    if (this.state.isInitialized) return;
    
    this.initPerformanceMonitoring();
    this.initErrorHandling();
    this.initUtilities();
    
    this.state.isInitialized = true;
    console.log('Core module initialized successfully');
  },

  /**
   * Initialize performance monitoring
   */
  initPerformanceMonitoring() {
    if (!this.config.performanceMonitoring) return;

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordPerformanceMetric(entry);
        }
      });
      
      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    }

    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.recordPerformanceMetric({
        name: 'page-load-time',
        startTime: loadTime
      });
    });
  },

  /**
   * Initialize error handling
   */
  initErrorHandling() {
    if (!this.config.errorReporting) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'JavaScript Error');
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
    });
  },

  /**
   * Initialize utility functions
   */
  initUtilities() {
    // Add utility functions to global scope
    window.Core = this;
  },

  /**
   * Record performance metric
   */
  recordPerformanceMetric(entry) {
    const metric = {
      name: entry.name || entry.entryType,
      value: entry.startTime || entry.value,
      timestamp: Date.now()
    };

    this.state.performanceMetrics[metric.name] = metric;

    if (this.config.debug) {
      console.log('Performance Metric:', metric);
    }
  },

  /**
   * Handle errors
   */
  handleError(error, context = 'Unknown') {
    this.state.errorCount++;
    
    const errorInfo = {
      message: error.message || error,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    if (this.config.debug) {
      console.error('Error:', errorInfo);
    }

    // You can add error reporting service here
    // Example: sendErrorToService(errorInfo);
  },

  /**
   * Debounce function
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Smooth scroll to element
   */
  scrollToElement(element, offset = 0) {
    if (!element) return;

    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Add CSS class with animation
   */
  addClassWithAnimation(element, className, duration = 300) {
    if (!element) return;

    element.classList.add(className);
    
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  },

  /**
   * Create and show notification
   */
  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      ${type === 'success' ? 'background: #28a745;' : 
        type === 'error' ? 'background: #dc3545;' : 
        type === 'warning' ? 'background: #ffc107; color: #000;' : 
        'background: #17a2b8;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after duration
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  },

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone format
   */
  validatePhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(phone);
  },

  /**
   * Format phone number
   */
  formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+90 $1 $2 $3 $4');
  },

  /**
   * Get device type
   */
  getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  },

  /**
   * Get screen size category
   */
  getScreenSize() {
    const width = window.innerWidth;
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    return 'xl';
  },

  /**
   * Check if device supports touch
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Get current page URL
   */
  getCurrentPage() {
    return window.location.pathname;
  },

  /**
   * Navigate to page
   */
  navigateTo(url, options = {}) {
    if (options.replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  },

  /**
   * Load content dynamically
   */
  async loadContent(url, container) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      container.innerHTML = content;
      return content;
    } catch (error) {
      this.handleError(error, `Content loading: ${url}`);
      throw error;
    }
  },

  /**
   * Preload resource
   */
  preloadResource(url, type = 'image') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  },

  /**
   * Lazy load images
   */
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  },

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.state.performanceMetrics;
  },

  /**
   * Get error count
   */
  getErrorCount() {
    return this.state.errorCount;
  },

  /**
   * Get core state
   */
  getState() {
    return {
      isInitialized: this.state.isInitialized,
      performanceMetrics: this.state.performanceMetrics,
      errorCount: this.state.errorCount,
      deviceType: this.getDeviceType(),
      screenSize: this.getScreenSize(),
      isTouchDevice: this.isTouchDevice()
    };
  },

  /**
   * Destroy core functionality
   */
  destroy() {
    this.state.isInitialized = false;
    this.state.performanceMetrics = {};
    this.state.errorCount = 0;
    
    console.log('Core module destroyed');
  }
};

// Make Core available globally
window.Core = window.Core; 