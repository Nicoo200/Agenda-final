const elements = document.querySelectorAll('.fade-in-up');

function checkVisibility() {
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      element.classList.add('visible');
    }
  });
}

window.addEventListener('load', checkVisibility);

window.addEventListener('scroll', checkVisibility);
