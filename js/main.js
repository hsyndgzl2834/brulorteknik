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
document.addEventListener('click', function(e) {
  const target = e.target.closest('.ripple');
  if (!target) return;

  const circle = document.createElement('span');
  circle.className = 'ripple-effect';
  const rect = target.getBoundingClientRect();
  circle.style.width = circle.style.height = Math.max(rect.width, rect.height) + 'px';
  circle.style.left = (e.clientX - rect.left - rect.width/2) + 'px';
  circle.style.top = (e.clientY - rect.top - rect.height/2) + 'px';
  target.appendChild(circle);

  setTimeout(() => circle.remove(), 600);
});
function showLangToast(msg) {
  document.getElementById('langMsg').textContent = msg;
  var toast = new bootstrap.Toast(document.getElementById('langToast'));
  toast.show();
}

// Dil değişince şu şekilde çağır:
showLangToast(selectedLang === 'tr' ? 'Dil Türkçe olarak değiştirildi.' : 'Language changed to English.');


document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add('loaded');
});
document.addEventListener("DOMContentLoaded", function() {
  // Eğer daha önce gösterildiyse tekrar çıkarma
  if (!localStorage.getItem("welcome_shown")) {
    var modal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    modal.show();
    localStorage.setItem("welcome_shown", "true");
  }
});
