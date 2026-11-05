/* Experience page: count-ups + timeline line that draws as you scroll */
(function () {
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      var el = e.target, to = +el.dataset.to;
      if (RM) { el.textContent = to; return; }
      var t0 = performance.now();
      (function tick(t) { var p = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }, { threshold: .5 });
  document.querySelectorAll("[data-to]").forEach(function (n) { io.observe(n); });

  var tl = document.getElementById("exTl"), fill = tl && tl.querySelector(".ex-line i");
  if (!tl || !fill) return;
  var steps = [].slice.call(tl.querySelectorAll(".ex-step"));
  function update() {
    var r = tl.getBoundingClientRect(), vh = innerHeight;
    var p = Math.max(0, Math.min(1, (vh * .6 - r.top) / r.height));
    fill.style.transform = "scaleY(" + (RM ? 1 : p) + ")";
    steps.forEach(function (s) { s.classList.toggle("lit", s.getBoundingClientRect().top < vh * .6); });
  }
  addEventListener("scroll", update, { passive: true }); addEventListener("resize", update); update();
})();
