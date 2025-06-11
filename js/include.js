function includeHTML(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  includeHTML('navbar', 'navbar.html');
  includeHTML('footer', 'footer.html');
});
