/* ============================================================
   Temirkhan Sabdenbek — portfolio
   Small vanilla-JS helpers. No frameworks, no build step.
   1. Navbar turns solid after scrolling past the hero top.
   2. Scroll-reveal: .reveal elements fade in when they enter
      the viewport (IntersectionObserver).
   3. Footer year is kept current automatically.
   ============================================================ */

(function () {
  "use strict";

  /* 1. Solid navbar on scroll ------------------------------- */
  var nav = document.getElementById("mainNav");

  function updateNav() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* Collapse the mobile menu after tapping a link ------------ */
  var navCollapse = document.getElementById("navMenu");
  navCollapse.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      var open = navCollapse.classList.contains("show");
      if (open) {
        bootstrap.Collapse.getInstance(navCollapse).hide();
      }
    });
  });

  /* 2. Scroll-reveal ----------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    /* very old browsers: just show everything */
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* 3. Gallery: auto-generate indicator dots ------------------ */
  var carousel = document.getElementById("galleryCarousel");
  if (carousel) {
    var indicators = carousel.querySelector(".carousel-indicators");
    var slides = carousel.querySelectorAll(".carousel-item");
    slides.forEach(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("data-bs-target", "#galleryCarousel");
      dot.setAttribute("data-bs-slide-to", String(i));
      dot.setAttribute("aria-label", "Slide " + (i + 1));
      if (i === 0) {
        dot.classList.add("active");
        dot.setAttribute("aria-current", "true");
      }
      indicators.appendChild(dot);
    });
  }

  /* 4. Gallery lightbox: click a slide to view it full-size ---- */
  var lightboxEl = document.getElementById("lightbox");
  if (carousel && lightboxEl) {
    var lightboxImg = document.getElementById("lightboxImg");
    carousel.querySelectorAll(".carousel-item img").forEach(function (img) {
      img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        bootstrap.Modal.getOrCreateInstance(lightboxEl).show();
      });
    });
  }

  /* 5. Footer year ------------------------------------------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
