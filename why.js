/* Why Me: coin stage tilt, flip cards, count-ups, scroll-triggered 3D scenes, video arc, FAQ */
(function () {
  var $ = function (s, e) { return (e || document).querySelector(s); }, $$ = function (s, e) { return [].slice.call((e || document).querySelectorAll(s)); };
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches, HOVER = matchMedia("(hover: hover)").matches;

  // add .in when a scene enters view
  var seen = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); seen.unobserve(e.target); } }); }, { threshold: .3 });
  ["#wn", "#wc", "#wp", "#wvArc"].forEach(function (s) { var n = $(s); if (n) seen.observe(n); });

  // count-ups
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; io.unobserve(e.target); var el = e.target, to = +el.dataset.to; if (RM) { el.textContent = to; return; } var t0 = performance.now(); (function tick(t) { var p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0); }); }, { threshold: .5 });
  $$("[data-to]").forEach(function (n) { io.observe(n); });

  // hero stage follows pointer
  var st = $("#whStage"), orb = st && $(".wh-orbit", st);
  if (orb && HOVER && !RM) document.addEventListener("pointermove", function (e) {
    orb.style.setProperty("--tx", ((e.clientY / innerHeight - .5) * -14) + "deg");
    orb.style.setProperty("--ty", ((e.clientX / innerWidth - .5) * 20) + "deg");
  });

  // flip cards: hover on desktop (CSS), tap/Enter everywhere
  $$(".wf").forEach(function (c) {
    c.addEventListener("click", function () { if (!HOVER) c.classList.toggle("flip"); });
    c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.classList.toggle("flip"); } });
  });

  // number tiles tilt
  if (HOVER && !RM) $$(".wn-c").forEach(function (c) {
    c.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(); c.style.transform = "rotateX(" + ((.5 - (e.clientY - r.top) / r.height) * 18) + "deg) rotateY(" + (((e.clientX - r.left) / r.width - .5) * 18) + "deg) translateZ(20px)"; });
    c.addEventListener("pointerleave", function () { c.style.transform = ""; });
  });

  // video arc: one plays at a time, playing card comes forward
  var vids = $$(".wv video");
  vids.forEach(function (v) {
    v.addEventListener("play", function () { vids.forEach(function (o) { if (o !== v) o.pause(); }); $$(".wv").forEach(function (f) { f.classList.toggle("on", f.contains(v)); }); });
    v.addEventListener("pause", function () { v.closest(".wv").classList.remove("on"); });
  });

  // FAQ: one open at a time
  var qs = $$(".wq");
  qs.forEach(function (d) { d.addEventListener("toggle", function () { if (d.open) qs.forEach(function (o) { if (o !== d) o.open = false; }); }); });
})();
