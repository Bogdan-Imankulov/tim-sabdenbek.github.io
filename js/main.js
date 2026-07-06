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

  /* 4. Gallery lightbox: click a slide to view it full-size.
     The lightbox is a slider too: arrows, keyboard (←/→) and
     touch swipe all switch photos while zoomed in. ------------- */
  var lightboxEl = document.getElementById("lightbox");
  if (carousel && lightboxEl) {
    var lightboxImg = document.getElementById("lightboxImg");
    var galleryImgs = Array.prototype.slice.call(
      carousel.querySelectorAll(".carousel-item img")
    );
    var currentIndex = 0;

    function showPhoto(index) {
      /* wrap around at both ends */
      currentIndex = (index + galleryImgs.length) % galleryImgs.length;
      lightboxImg.src = galleryImgs[currentIndex].src;
      lightboxImg.alt = galleryImgs[currentIndex].alt;
    }

    galleryImgs.forEach(function (img, i) {
      img.addEventListener("click", function () {
        showPhoto(i);
        bootstrap.Modal.getOrCreateInstance(lightboxEl).show();
      });
    });

    /* arrows */
    document.getElementById("lightboxPrev").addEventListener("click", function () {
      showPhoto(currentIndex - 1);
    });
    document.getElementById("lightboxNext").addEventListener("click", function () {
      showPhoto(currentIndex + 1);
    });

    /* keyboard: ← / → while the lightbox is open */
    lightboxEl.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { showPhoto(currentIndex - 1); }
      if (e.key === "ArrowRight") { showPhoto(currentIndex + 1); }
    });

    /* touch swipe on the photo */
    var touchStartX = null;
    lightboxEl.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightboxEl.addEventListener("touchend", function (e) {
      if (touchStartX === null) { return; }
      var dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 40) { return; } /* too short — not a swipe */
      if (dx > 0) { showPhoto(currentIndex - 1); } else { showPhoto(currentIndex + 1); }
    }, { passive: true });

    /* pause the background carousel while zoomed in;
       on close, jump it to the last viewed photo and resume */
    lightboxEl.addEventListener("show.bs.modal", function () {
      bootstrap.Carousel.getOrCreateInstance(carousel).pause();
    });
    lightboxEl.addEventListener("hidden.bs.modal", function () {
      var c = bootstrap.Carousel.getOrCreateInstance(carousel);
      c.to(currentIndex);
      c.cycle();
    });
  }

  /* 5. Footer year ------------------------------------------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
