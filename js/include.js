// Simple HTML include with callback
async function includeHTML(elementId, filePath, callback) {
  console.log(`Loading: ${filePath} -> ${elementId}`);
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Failed to load: ${filePath}`);
    const html = await res.text();
    document.getElementById(elementId).innerHTML = html;
    console.log(`Loaded successfully: ${filePath}`);
    if (typeof callback === 'function') callback();
  } catch (e) {
    console.error(`Error loading: ${filePath}`, e);
  }
}

// Advanced HTML include with modern navbar support
async function includeHTML(elementId, filePath, callback) {
  console.log(`Loading: ${filePath} -> ${elementId}`);
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Failed to load: ${filePath}`);
    const html = await res.text();
    document.getElementById(elementId).innerHTML = html;
    console.log(`Loaded successfully: ${filePath}`);
    if (typeof callback === 'function') callback();
  } catch (e) {
    console.error(`Error loading: ${filePath}`, e);
  }
}

// Include modern navbar with enhanced functionality
includeHTML('navbar', 'navbar.html', function() {
  console.log('Modern navbar loaded - initializing functionality');
  
  // Enhanced scroll effect with glassmorphism
  function initScrollEffect() {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;
    
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      navbar.classList.toggle('scrolled', scrolled);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // Auto-detect active page and highlight nav item
  function initActivePageDetection() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.modern-nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
        link.closest('.nav-item')?.classList.add('active');
      }
    });
  }

  // Enhanced mobile menu animation
  function initMobileMenu() {
    const navbarToggler = document.querySelector('.modern-toggler');
    const navbarCollapse = document.querySelector('.modern-collapse');
    const navLinks = document.querySelectorAll('.modern-nav-link');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // Toggler click handler
    navbarToggler.addEventListener('click', function(e) {
      e.preventDefault();
      navbarCollapse.classList.toggle('show-animate');
      navbarToggler.classList.toggle('active');
      
      // Bootstrap collapse integration
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
        toggle: false
      });
      
      if (navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      } else {
        bsCollapse.show();
      }
    });

    // Close mobile menu when clicking on nav link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth < 992) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
          bsCollapse.hide();
          navbarToggler.classList.remove('active');
          navbarCollapse.classList.remove('show-animate');
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth < 992) {
        const isClickInsideNav = navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
        if (!isClickInsideNav && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
          bsCollapse.hide();
          navbarToggler.classList.remove('active');
          navbarCollapse.classList.remove('show-animate');
        }
      }
    });
  }

  // Button ripple effects
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.modern-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = this.querySelector('.btn-ripple');
        if (ripple) {
          ripple.style.width = '0';
          ripple.style.height = '0';
          
          setTimeout(() => {
            ripple.style.width = '120px';
            ripple.style.height = '120px';
          }, 10);
          
          setTimeout(() => {
            ripple.style.width = '0';
            ripple.style.height = '0';
          }, 400);
        }
      });
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const navbarHeight = document.querySelector('.navbar-custom')?.offsetHeight || 80;
          const targetPosition = target.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Performance optimization: RAF for scroll
  function initPerformanceOptimizations() {
    let ticking = false;
    const navbar = document.querySelector('.navbar-custom');
    
    function updateNavbar() {
      const scrolled = window.scrollY > 20;
      navbar?.classList.toggle('scrolled', scrolled);
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Initialize all navbar functionality
  function initNavbar() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initNavbarFeatures, 100);
      });
    } else {
      setTimeout(initNavbarFeatures, 100);
    }
  }

  function initNavbarFeatures() {
    initScrollEffect();
    initActivePageDetection();
    initMobileMenu();
    initButtonEffects();
    initSmoothScroll();
    initPerformanceOptimizations();
    
    console.log('Modern navbar fully initialized');
    
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('navbarReady'));
  }

  // Start initialization
  initNavbar();
});

// Include footer with scroll button functionality
includeHTML('footer', 'footer.html', function() {
  // Sadece copyright yılını güncelle
  var currentYear = new Date().getFullYear();
  var copyElement = document.querySelector('.footer-bottom p');
  if (copyElement) {
    copyElement.innerHTML = '© ' + currentYear + ' Brülör Teknik Hizmetler. Tüm hakları saklıdır.';
  }
});
