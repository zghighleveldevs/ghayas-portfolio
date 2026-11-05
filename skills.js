/* Skills page: count-ups, animated category bars, filterable grid with FLIP, reviews showreel */
(function () {
  var $ = function (s, e) { return (e || document).querySelector(s); }, $$ = function (s, e) { return [].slice.call((e || document).querySelectorAll(s)); };
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // count-ups
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      var el = e.target, to = +el.dataset.to;
      if (RM) { el.textContent = to; return; }
      var t0 = performance.now();
      (function tick(t) { var p = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }, { threshold: .5 });
  $$("[data-to]").forEach(function (n) { io.observe(n); });

  // category bars fill when visible
  var bo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("go"); bo.unobserve(e.target); } }); }, { threshold: .4 });
  $$(".skcat").forEach(function (c) { bo.observe(c); });

  // staggered entrance for the grid
  var grid = $("#skgrid"), cards = $$(".skc", grid);
  cards.forEach(function (c, i) { c.style.setProperty("--i", i % 12); });
  var go = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { grid.classList.add("in"); go.disconnect(); } }, { threshold: .1 });
  go.observe(grid);

  // filter with FLIP animation
  $$(".skf").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".skf").forEach(function (x) { x.classList.toggle("on", x === b); });
      var f = b.dataset.f;
      var first = new Map(cards.map(function (c) { return [c, c.getBoundingClientRect()]; }));
      cards.forEach(function (c) { c.hidden = !(f === "all" || c.dataset.c === f); });
      if (RM) return;
      cards.forEach(function (c) {
        if (c.hidden) return;
        var a = first.get(c), z = c.getBoundingClientRect();
        if (a.width === 0) { c.animate([{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" }); return; }
        var dx = a.left - z.left, dy = a.top - z.top;
        if (dx || dy) c.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    });
  });

  // pointer glow on cards
  if (matchMedia("(hover: hover)").matches) cards.forEach(function (c) {
    c.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); });
  });

  // showreel
  var box = $("#reel"), v = $("#reelVideo");
  if (box && v) {
    var play = function () { v.controls = true; v.play().catch(function () {}); };
    $("#reelPlay").addEventListener("click", play);
    $("#reelBtn").addEventListener("click", function () { box.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" }); play(); });
    v.addEventListener("play", function () { box.classList.add("playing"); });
    v.addEventListener("ended", function () { box.classList.remove("playing"); v.controls = false; v.load(); });
    v.addEventListener("loadedmetadata", function () { var d = Math.floor(v.duration); if (d) $("#reelDur").textContent = Math.floor(d / 60) + ":" + String(d % 60).padStart(2, "0"); });
    document.addEventListener("play", function (e) { $$("video").forEach(function (x) { if (x !== e.target) x.pause(); }); }, true);
  }
})();
