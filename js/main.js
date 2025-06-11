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


});
