/* ==========================================================
   ANSARI Tours & RENT A CAR — site behavior
   Vanilla JS only (no build step) so the site stays easy to
   host anywhere and edit without tooling.
   ========================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector(".site-header");
  function onHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  document.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
      var isOpen = navLinks.classList.contains("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { navLinks.classList.remove("is-open"); });
    });
  }

  /* ---------- Active nav link by current page ---------- */
  var here = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a[data-nav]").forEach(function (a) {
    if (a.getAttribute("data-nav") === here) a.classList.add("active");
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Route-line scroll progress (signature element) ---------- */
  var rail = document.querySelector(".route-rail");
  if (rail && !reduceMotion) {
    var progressPath = rail.querySelector(".progress");
    var marker = rail.querySelector(".marker");
    var trackPath = rail.querySelector(".track");
    var pathLength = trackPath ? trackPath.getTotalLength() : 0;

    if (progressPath) {
      progressPath.style.strokeDasharray = pathLength;
      progressPath.style.strokeDashoffset = pathLength;
    }

    var ticking = false;
    function updateRoute() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;

      if (progressPath) {
        progressPath.style.strokeDashoffset = pathLength - pathLength * progress;
      }
      if (marker && trackPath && pathLength) {
        var pt = trackPath.getPointAtLength(pathLength * progress);
        marker.setAttribute("cx", pt.x);
        marker.setAttribute("cy", pt.y);
      }
      ticking = false;
    }
    document.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateRoute);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", function () {
      pathLength = trackPath ? trackPath.getTotalLength() : 0;
      updateRoute();
    });
    updateRoute();
  }

  /* ---------- Hero / band parallax on scroll ---------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion) {
    var pTicking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - vh / 2;
        var offset = center * speed * -1;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      pTicking = false;
    }
    document.addEventListener(
      "scroll",
      function () {
        if (!pTicking) {
          window.requestAnimationFrame(updateParallax);
          pTicking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateParallax);
    updateParallax();
  }

  /* ---------- Subtle hero layer tilt on mouse move (desktop, fine pointer only) ---------- */
  var heroLayers = document.querySelector(".hero-layers");
  if (heroLayers && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    var bg = heroLayers.querySelector(".hero-layer.bg");
    var mid = heroLayers.querySelector(".hero-layer.mid");
    heroLayers.addEventListener("mousemove", function (e) {
      var rect = heroLayers.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      if (bg) bg.style.transform = "translate3d(" + (x * -10) + "px," + (y * -6) + "px,0) scale(1.08)";
      if (mid) mid.style.transform = "translate3d(" + (x * 18) + "px," + (y * 12) + "px,0)";
    });
    heroLayers.addEventListener("mouseleave", function () {
      if (bg) bg.style.transform = "";
      if (mid) mid.style.transform = "";
    });
  }

  /* ---------- Filter pills (Fleet / Tours pages) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var pills = group.querySelectorAll(".pill");
    var targetSelector = group.getAttribute("data-filter-group");
    var items = document.querySelectorAll(targetSelector);
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        var cat = pill.getAttribute("data-filter");
        items.forEach(function (item) {
          var show = cat === "all" || item.getAttribute("data-category") === cat;
          item.style.display = show ? "" : "none";
        });
      });
    });
  });

  /* ---------- Contact / booking form (static-site friendly) ----------
     No backend is wired up yet. On submit we build a WhatsApp message
     from the fields and open WhatsApp, and show an on-page confirmation.
     Swap this for a real POST to your backend/Formspree/etc. later. */
  var bookingForm = document.querySelector("#booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(bookingForm);
      var name = data.get("name") || "";
      var phone = data.get("phone") || "";
      var service = data.get("service") || "";
      var date = data.get("date") || "";
      var message = data.get("message") || "";

      var waNumber = bookingForm.getAttribute("data-whatsapp") || "923001234567";
      var text = "Assalam-o-Alaikum, I'd like to inquire about " + service +
        ".%0AName: " + encodeURIComponent(name) +
        "%0APhone: " + encodeURIComponent(phone) +
        "%0APreferred date: " + encodeURIComponent(date) +
        "%0ADetails: " + encodeURIComponent(message);

      var successBox = document.querySelector("#form-success");
      if (successBox) successBox.classList.add("is-visible");

      window.open("https://wa.me/" + waNumber + "?text=" + text, "_blank");
      bookingForm.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
