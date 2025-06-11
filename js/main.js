document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Swiper sliders
  if (typeof Swiper !== "undefined") {
    new Swiper(".services-swiper", {
      slidesPerView: 1.2,
      spaceBetween: 16,
      breakpoints: { 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }
    });
    new Swiper(".products-swiper", {
      slidesPerView: 1.2,
      spaceBetween: 16,
      breakpoints: { 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }
    });
  }

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
new Swiper(".hero-swiper", {
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  speed: 800,
  effect: 'fade',
});
ddocument.addEventListener("DOMContentLoaded", function() {
  var scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    scrollBtn.onclick = function() {
      window.scrollTo({top:0, behavior:'smooth'});
    };
  }
});
