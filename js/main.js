// Modern DOM Content Loaded Handler
document.addEventListener("DOMContentLoaded", function () {
  // Hata yakalama sistemi
  window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showErrorToast('Bir hata oluştu. Sayfayı yenilemeyi deneyin.');
  });
  
  // Promise rejection yakalama
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
    showErrorToast('Bağlantı sorunu. Lütfen internet bağlantınızı kontrol edin.');
  });
  
  // Initialize modern features
  initializeModernNavbar();
  initializeScrollEffects();
  initializeModernAnimations();
  initializeSwiper();
  initializeRippleEffect();
  initializeParallax();
  
  // Legacy hamburger support
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }
});

// Modern Navbar with scroll effects
function initializeModernNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
  
  // Active page indicator
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// Modern scroll effects
function initializeScrollEffects() {
  // Enhanced smooth scroll to top button
  const scrollTopBtn = document.getElementById('scrollTop') || document.querySelector('.scroll-top-btn');
  
  if (scrollTopBtn) {
    let ticking = false;
    
    function updateScrollButton() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      const progressElement = scrollTopBtn.querySelector('.scroll-progress');
      
      // Show/hide button with smooth animation
      if (scrollTop > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.transform = 'translateY(0) scale(1)';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'translateY(10px) scale(0.8)';
        setTimeout(() => {
          if (scrollTop <= 300) scrollTopBtn.style.display = 'none';
        }, 300);
      }
      
      // Update progress circle
      if (progressElement) {
        const angle = (scrollPercent * 360) / 100;
        progressElement.style.transform = `rotate(-90deg)`;
        progressElement.style.borderTopColor = `rgba(255, 255, 255, ${0.3 + (scrollPercent / 100) * 0.7})`;
        progressElement.style.borderRightColor = angle > 90 ? 'rgba(255, 255, 255, 0.8)' : 'transparent';
        progressElement.style.borderBottomColor = angle > 180 ? 'rgba(255, 255, 255, 0.8)' : 'transparent';
        progressElement.style.borderLeftColor = angle > 270 ? 'rgba(255, 255, 255, 0.8)' : 'transparent';
      }
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScrollButton);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Enhanced click handler with haptic feedback
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add click animation
      scrollTopBtn.style.transform = 'translateY(0) scale(0.95)';
      setTimeout(() => {
        scrollTopBtn.style.transform = 'translateY(0) scale(1)';
      }, 150);
      
      // Smooth scroll to top
      const scrollDuration = 800;
      const scrollStep = Math.PI / (scrollDuration / 15);
      const cosParameter = window.pageYOffset / 2;
      let scrollCount = 0;
      
      function scrollAnimation() {
        if (window.pageYOffset !== 0) {
          requestAnimationFrame(scrollAnimation);
          scrollCount += 1;
          const scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
          window.scrollTo(0, cosParameter - scrollMargin);
        }
      }
      
      scrollAnimation();
      
      // Haptic feedback for supported devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
    
    // Add touch gesture support for mobile
    let touchStartY = 0;
    scrollTopBtn.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    scrollTopBtn.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;
      
      if (Math.abs(swipeDistance) < 10) {
        // It's a tap, not a swipe
        scrollTopBtn.click();
      }
    }, { passive: true });
  }
  
  // Enhanced parallax scrolling for hero sections
  const heroSections = document.querySelectorAll('.hero-section, #hero');
  heroSections.forEach(section => {
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const speed = scrolled * 0.3; // Reduced speed for better performance
      section.style.transform = `translateY(${speed}px)`;
      ticking = false;
    }
    
    function requestParallaxTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestParallaxTick, { passive: true });
  });
}

// Modern animations and interactions
function initializeModernAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Counter animation
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, observerOptions);
  
  // Observe animated elements
  document.querySelectorAll('.card, .stats-card, .service-card, .product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
}

// Counter animation
function animateCounter(element) {
  const target = parseInt(element.textContent) || parseInt(element.getAttribute('data-count'));
  if (!target) return;
  
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
  }, duration / steps);
}

// Initialize Swiper with modern settings
function initializeSwiper() {
  if (typeof Swiper !== "undefined") {
    // Services swiper
    new Swiper(".services-swiper", {
      slidesPerView: 1.2,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 15,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      breakpoints: { 
        640: { slidesPerView: 2.2, centeredSlides: false }, 
        1024: { slidesPerView: 3.2, centeredSlides: false } 
      }
    });
    
    // Products swiper
    new Swiper(".products-swiper", {
      slidesPerView: 1.2,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      breakpoints: { 
        640: { slidesPerView: 2.2, centeredSlides: false }, 
        1024: { slidesPerView: 3.2, centeredSlides: false } 
      }
    });
  }
}

// Modern ripple effect
function initializeRippleEffect() {
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.ripple, .btn, .card');
    if (!target) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
}

// Parallax effect for floating elements
function initializeParallax() {
  const floatingElements = document.querySelectorAll('.floating-elements, .floating');
  
  if (floatingElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 0.3;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }
}

// Language toast notification
function showLangToast(msg) {
  // Create modern toast
  const toast = document.createElement('div');
  toast.className = 'modern-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-language"></i>
      <span>${msg}</span>
    </div>
  `;
  
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize modern loading animation
window.addEventListener('load', () => {
  // Hide loading screen if exists
  const loadingScreen = document.querySelector('.loading-screen, .splash-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.remove(), 500);
  }
  
  // Trigger entrance animations
  document.body.classList.add('loaded');
});

// CSS for ripple effect (only define if not already defined)
if (typeof rippleCSS === 'undefined') {
  const rippleCSS = `
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to { transform: scale(4); opacity: 0; }
    }
    
    .modern-toast .toast-content {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }
  `;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = rippleCSS;
  document.head.appendChild(style);
}

// Welcome modal functionality
document.addEventListener("DOMContentLoaded", function() {
  // Show welcome modal only once
  if (!localStorage.getItem("welcome_shown")) {
    const welcomeModal = document.getElementById('welcomeModal');
    if (welcomeModal && typeof bootstrap !== 'undefined') {
      var modal = new bootstrap.Modal(welcomeModal);
      modal.show();
      localStorage.setItem("welcome_shown", "true");
    }
  }
});

// Hata bildirimi fonksiyonu
function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="toast-close">×</button>
    </div>
  `;
  
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    max-width: 300px;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// Service Worker güncelleme kontrolü
function checkForSWUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Yeni versiyon mevcut
            showUpdateToast();
          }
        });
      });
    });
  }
}

// Güncelleme bildirimi
function showUpdateToast() {
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div class="update-toast">
      <i class="fas fa-sync-alt"></i>
      <span>Yeni versiyon mevcut!</span>
      <button onclick="refreshApp()" class="btn btn-sm btn-light">Güncelle</button>
    </div>
  `;
  
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 25px;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(toast);
}

// Uygulamayı yenileme
function refreshApp() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  } else {
    window.location.reload();
  }
}

// Cache temizleme fonksiyonu
function clearAppCache() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg && reg.active) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
          if (event.data.success) {
            showErrorToast('Cache temizlendi. Sayfa yenileniyor...');
            setTimeout(() => window.location.reload(), 1000);
          }
        };
        reg.active.postMessage({ type: 'CLEAR_CACHE' }, [messageChannel.port2]);
      }
    });
  }
}
