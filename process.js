/* Process page: 3D ring (drag/hover), scroll-driven isometric build, tilt */
(function () {
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, e) { return (e || document).querySelector(s); }, $$ = function (s, e) { return [].slice.call((e || document).querySelectorAll(s)); };

  /* ---- 3D ring: auto-rotates, follows pointer, pauses on hover ---- */
  var ring = $("#r3"), angle = 0, speed = RM ? 0 : 0.12, tiltX = -8, target = -8, hover = false;
  if (ring) {
    var scene = ring.parentElement;
    scene.addEventListener("pointerenter", function () { hover = true; });
    scene.addEventListener("pointerleave", function () { hover = false; target = -8; });
    scene.addEventListener("pointermove", function (e) { var r = scene.getBoundingClientRect(); target = -8 - ((e.clientY - r.top) / r.height - .5) * 16; });
    (function loop() {
      if (!hover) angle -= speed;
      tiltX += (target - tiltX) * .08;
      ring.style.transform = "rotateX(" + tiltX + "deg) rotateY(" + angle + "deg)";
      // fade cards on the back of the ring
      $$(".r3-card", ring).forEach(function (c, i) {
        var a = ((angle + i * 72) % 360 + 360) % 360, front = Math.cos(a * Math.PI / 180);
        c.style.opacity = (front < -0.15 ? 0.08 : (0.25 + 0.75 * (front + 1) / 2)).toFixed(2);
        c.style.zIndex = Math.round(front * 10) + 10;
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---- Sticky scroll story ---- */
  var story = $("#story"), iso = $("#iso"), bar = $("#psBar");
  var texts = $$(".ps-txt"), dots = $$(".ps-dot"), layers = $$(".iso-l");
  var N = layers.length, cur = -1;
  function setStage(i) {
    if (i === cur) return; cur = i;
    story.dataset.stage = i;
    texts.forEach(function (t, j) { t.classList.toggle("on", j === i); });
    dots.forEach(function (d, j) { d.classList.toggle("on", j === i); d.classList.toggle("done", j < i); });
    layers.forEach(function (l, j) { l.classList.toggle("in", j <= i); l.classList.toggle("on", j === i); });
  }
  function onScroll() {
    var r = story.getBoundingClientRect(), total = r.height - innerHeight;
    var p = Math.max(0, Math.min(1, -r.top / total));
    bar.style.transform = "scaleX(" + p + ")";
    setStage(Math.min(N - 1, Math.floor(p * N * 0.999)));
  }
  if (story) {
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();
    dots.forEach(function (d) {
      d.addEventListener("click", function () {
        var i = +d.dataset.go, r = story.getBoundingClientRect(), total = r.height - innerHeight;
        scrollTo({ top: scrollY + r.top + total * (i + .5) / N, behavior: RM ? "auto" : "smooth" });
      });
    });
    // pointer tilt on the isometric scene
    var sc = $("#isoScene");
    if (!RM && matchMedia("(hover: hover)").matches) {
      sc.addEventListener("pointermove", function (e) { var r = sc.getBoundingClientRect(); var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; iso.style.setProperty("--tx", (y * -8) + "deg"); iso.style.setProperty("--tz", (x * 10) + "deg"); });
      sc.addEventListener("pointerleave", function () { iso.style.setProperty("--tx", "0deg"); iso.style.setProperty("--tz", "0deg"); });
    }
  }

  /* ---- spin the detail cubes when visible ---- */
  var co = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle("spin", e.isIntersecting); }); }, { threshold: .3 });
  $$(".pd").forEach(function (p) { co.observe(p); });
})();
