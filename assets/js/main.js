/* =============================================================
   main.js — UI behaviour
   Waits for "partials:loaded" (header/footer injected) then wires:
     • mobile nav drawer (toggle, scrim, Esc, close-on-navigate)
     • sticky-header shadow
     • scroll reveal animations
     • current-year in footer
   ============================================================= */
(function () {
  "use strict";

  function init() {
    var body = document.body;
    var header = document.querySelector("[data-site-header]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("primary-nav");
    var scrim = document.querySelector("[data-nav-close]");

    /* ---- mobile drawer ---- */
    function setNav(open) {
      body.classList.toggle("nav-open", open);
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
      if (scrim) scrim.hidden = !open;
    }
    if (toggle) toggle.addEventListener("click", function () {
      setNav(!body.classList.contains("nav-open"));
    });
    if (scrim) scrim.addEventListener("click", function () { setNav(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) setNav(false);
    });
    if (nav) nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    /* reset menu state when leaving mobile width */
    var mq = window.matchMedia("(min-width: 1421px)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(
      function () { if (mq.matches) setNav(false); }
    );

    /* ---- bilingual header/footer: show the language matching the URL ---- */
    var inTelugu = /(^|\/)te\//.test(location.pathname);
    document.querySelectorAll(".lang-en").forEach(function (el) { el.hidden = inTelugu; });
    document.querySelectorAll(".lang-te").forEach(function (el) { el.hidden = !inTelugu; });
    var langSwitch = document.querySelector("[data-lang-switch]");
    if (langSwitch) {
      var file = location.pathname.split("/").pop() || "index.html";
      langSwitch.href = inTelugu ? "../" + file : "te/" + file;
    }

    /* ---- sticky header shadow ---- */
    if (header) {
      var sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      header.parentNode.insertBefore(sentinel, header);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          header.classList.toggle("is-stuck", !entries[0].isIntersecting);
        }, { rootMargin: "0px" }).observe(sentinel);
      }
    }

    /* ---- reveal on scroll ---- */
    var reveals = document.querySelectorAll(".reveal");
    if (reveals.length) {
      if (!("IntersectionObserver" in window) ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        reveals.forEach(function (el) { el.classList.add("is-visible"); });
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
        reveals.forEach(function (el) { io.observe(el); });
      }
    }

    /* ---- footer year ---- */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    /* ---- auto-scrolling carousels (e.g. the Vision page commitments strip) ---- */
    var carousels = document.querySelectorAll(".commitments-carousel");
    if (carousels.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      carousels.forEach(function (track) {
        var paused = false;
        var speed = 1.1; // px per frame, ~66px/s
        track.addEventListener("mouseenter", function () { paused = true; });
        track.addEventListener("mouseleave", function () { paused = false; });
        track.addEventListener("touchstart", function () { paused = true; }, { passive: true });
        track.addEventListener("touchend", function () { paused = false; });
        track.addEventListener("focusin", function () { paused = true; });
        track.addEventListener("focusout", function () { paused = false; });
        (function step() {
          if (!paused) {
            var max = track.scrollWidth - track.clientWidth;
            if (max > 1) {
              track.scrollLeft = track.scrollLeft >= max - 1 ? 0 : track.scrollLeft + speed;
            }
          }
          requestAnimationFrame(step);
        })();
      });
    }
  }

  /* run after partials land; fall back to DOM ready if none present */
  var used = document.querySelector("[data-include]");
  if (used) {
    document.addEventListener("partials:loaded", init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
