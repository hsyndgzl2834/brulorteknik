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
    
    // Initialize navbar
    if (window.Navbar) {
      window.Navbar.init();
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
    
    console.log('✅ Components loaded successfully');
    
  } catch (error) {
    console.error('❌ Component loading error:', error);
  }
});
