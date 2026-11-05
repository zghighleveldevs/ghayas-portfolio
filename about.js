/* About page: count-up stats when they come into view */
(function () {
  var nums = [].slice.call(document.querySelectorAll("[data-to]"));
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  nums.forEach(function (n) { n.textContent = rm ? n.dataset.to : "0"; });
  if (rm) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var el = e.target, to = +el.dataset.to, t0 = performance.now();
      (function tick(t) {
        var p = Math.min(1, (t - t0) / 1400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .6 });
  nums.forEach(function (n) { io.observe(n); });
})();
