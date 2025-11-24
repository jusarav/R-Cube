// Simple intersection observer for scroll animations
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-fade");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  // 3D tilt effect for cards
  const tiltEls = document.querySelectorAll(".parallax-tilt");
  tiltEls.forEach((card) => {
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = clamp(((x / rect.width) - 0.5) * 16, -18, 18);
      const rotateX = clamp(((y / rect.height) - 0.5) * -16, -18, 18);

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
      card.style.boxShadow = "0 24px 55px rgba(0, 0, 0, 0.85)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
      card.style.boxShadow = "";
    });
  });
});
