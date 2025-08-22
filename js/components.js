// Universal component loader for all pages
document.addEventListener('DOMContentLoaded', async function() {
  try {
    console.log('🔄 Loading components...');
    
    // Load navbar and footer in parallel
    const [navbarResponse, footerResponse] = await Promise.all([
      fetch('navbar.html'),
      fetch('footer.html')
    ]);
    
    const [navbarHTML, footerHTML] = await Promise.all([
      navbarResponse.text(),
      footerResponse.text()
    ]);
    
    // Insert components
    const navbarContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');
    
    if (navbarContainer) navbarContainer.innerHTML = navbarHTML;
    if (footerContainer) footerContainer.innerHTML = footerHTML;
    
    // Load navbar modules after DOM is updated
    await loadNavbarModules();
    
    // Initialize navbar modules
    if (window.Navbar && typeof window.Navbar.init === 'function') {
      window.Navbar.init();
    }
    if (window.MobileNavbar && typeof window.MobileNavbar.init === 'function') {
      window.MobileNavbar.init();
    }
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
    
    console.log('✅ Components and navbar modules loaded successfully');
    
  } catch (error) {
    console.error('❌ Component loading error:', error);
  }
});

// Load navbar modules dynamically
async function loadNavbarModules() {
  try {
    // Load core first
    await loadScript('js/modules/core.js');
    
    // Load both modules but only initialize appropriate one
    await loadScript('js/modules/navbar.js');
    await loadScript('js/modules/navbar_mobile.js');
    
    console.log('✅ All navbar modules loaded');
  } catch (error) {
    console.error('❌ Navbar modules loading error:', error);
  }
}

// Helper function to load scripts dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
