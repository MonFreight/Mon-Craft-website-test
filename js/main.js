/* Mon Craft — interactions */
(function () {
  "use strict";

  /* ---------- Spirit-level loader ---------- */
  var loader = document.getElementById("loader");
  if (loader) {
    setTimeout(function () { loader.classList.add("level-ok"); }, 1500); // bubble settles → ✓
    setTimeout(function () { loader.classList.add("done"); }, 2100);    // content appears
  }

  /* ---------- Tape-measure scroll progress ---------- */
  var tape = document.getElementById("tape");
  function updateTape() {
    if (!tape) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    tape.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateTape, { passive: true });
  updateTape();

  /* ---------- Scroll reveals (drawers, frames, drawn lines) ---------- */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );
  document
    .querySelectorAll(".reveal, .reveal-drawer, .reveal-drawer-r, .sq-frame, .drawn")
    .forEach(function (el) { observer.observe(el); });

  /* ---------- Animated counters (tape numbers) ---------- */
  var counterObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        counterObs.unobserve(e.target);
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1600, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.childNodes[0].nodeValue = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        }
        el.innerHTML = "0<sup>" + suffix + "</sup>";
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) { counterObs.observe(el); });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.querySelector(".nav-links").classList.toggle("open");
    });
  }

  /* ---------- Hero: subtle wood-grain parallax on mouse ---------- */
  var hero = document.querySelector(".hero");
  if (hero && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", function (ev) {
      var x = (ev.clientX / window.innerWidth - 0.5) * 12;
      var y = (ev.clientY / window.innerHeight - 0.5) * 8;
      hero.style.backgroundPosition =
        "calc(82% + " + x + "px) calc(18% + " + y + "px), calc(12% - " + x + "px) calc(85% - " + y + "px), 0 0";
    });
  }

  /* ---------- Hero tape measure extends with scroll ---------- */
  var tapeLine = document.getElementById("tape-line");
  var tapeTicks = document.getElementById("tape-ticks");
  var tapeBody = document.getElementById("tape-body");
  if (tapeLine) {
    function heroTape() {
      var h = window.innerHeight;
      var p = Math.min(window.scrollY / (h * 0.8), 1);
      var len = 18 + p * 64; // percent of viewBox width
      tapeLine.setAttribute("width", len + "%");
      if (tapeTicks) tapeTicks.setAttribute("width", len + "%");
      if (tapeBody) tapeBody.setAttribute("x", len + "%");
    }
    window.addEventListener("scroll", heroTape, { passive: true });
    heroTape();
  }

  /* ---------- Wood shavings (very subtle, hero only) ---------- */
  if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (var i = 0; i < 6; i++) {
      var s = document.createElement("span");
      s.className = "shaving";
      s.style.left = 8 + Math.random() * 84 + "%";
      s.style.animationDelay = Math.random() * 9 + "s";
      s.style.animationDuration = 8 + Math.random() * 6 + "s";
      hero.appendChild(s);
    }
  }
})();
