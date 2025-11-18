document.addEventListener("DOMContentLoaded", () => {
  // Preloader fade out
  const pre = document.getElementById("preloader");
  window.addEventListener("load", () => {
    if (!pre) return;
    setTimeout(() => {
      pre.style.opacity = "0";
      setTimeout(() => (pre.style.display = "none"), 260);
    }, 300);
  });

  // Year
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Nav toggle
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // Init AOS
  if (window.AOS) {
    AOS.init({ duration: 900, once: true });
  }
});
