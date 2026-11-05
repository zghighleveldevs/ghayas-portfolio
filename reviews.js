/* Reviews: 3D hero carousel, showreel phone, tilt tiles, video lightbox */
(function () {
  var $ = function (s, e) { return (e || document).querySelector(s); }, $$ = function (s, e) { return [].slice.call((e || document).querySelectorAll(s)); };
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches, HOVER = matchMedia("(hover: hover)").matches;

  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; io.unobserve(e.target); var el = e.target, to = +el.dataset.to; if (RM) { el.textContent = to; return; } var t0 = performance.now(); (function tick(t) { var p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0); }); }, { threshold: .5 });
  $$("[data-to]").forEach(function (n) { io.observe(n); });

  var rsV = $("#rsVideo"), rsP = $("#rsPhone");

  // lightbox
  var rl = $("#rl"), media = $("#rlMedia");
  function openV(el) {
    if (rsV) rsV.pause();
    media.innerHTML = "";
    var v = document.createElement("video"); v.src = el.dataset.v; v.controls = true; v.playsInline = true; v.autoplay = true; if (el.dataset.p) v.poster = el.dataset.p; media.appendChild(v);
    $("#rlName").textContent = el.dataset.n; $("#rlCo").textContent = el.dataset.c;
    rl.showModal(); document.body.classList.add("svm-open");
    v.play().catch(function () {});
  }
  function closeRl() { rl.close(); }
  $(".rl-x", rl).addEventListener("click", closeRl);
  rl.addEventListener("click", function (e) { if (e.target === rl) closeRl(); });
  rl.addEventListener("close", function () { media.innerHTML = ""; document.body.classList.remove("svm-open"); });
  $$("[data-cal]", rl).forEach(function (a) { a.addEventListener("click", closeRl); });

  // hero 3D carousel
  var ring = $("#rcRing"), cards = $$(".rc-card"), dots = $$("#rcDots button"), n = cards.length, cur = 0, timer = null;
  function go(i) {
    cur = (i + n) % n;
    cards.forEach(function (c, k) { var s = ((k - cur) % n + n) % n; if (s > n / 2) s -= n; c.style.setProperty("--s", s); c.style.setProperty("--d", Math.abs(s)); c.style.zIndex = 10 - Math.abs(s); c.classList.toggle("on", k === cur); c.tabIndex = k === cur ? 0 : -1; });
    dots.forEach(function (d, k) { d.classList.toggle("on", k === cur); });
  }
  function play() { clearInterval(timer); if (!RM) timer = setInterval(function () { go(cur + 1); }, 3500); }
  cards.forEach(function (c, k) { c.addEventListener("click", function () { if (k === cur) openV(c); else { go(k); play(); } }); });
  dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); play(); }); });
  var sc = $("#rcScene");
  sc.addEventListener("pointerenter", function () { clearInterval(timer); });
  sc.addEventListener("pointerleave", play);
  if (HOVER && !RM) sc.addEventListener("pointermove", function (e) { var r = sc.getBoundingClientRect(); ring.style.setProperty("--tx", ((e.clientY - r.top) / r.height - .5) * -10 + "deg"); });
  go(0); play();

  // showreel phone
  function playReel() { rsV.controls = true; rsV.play().catch(function () {}); }
  $("#rsPlay").addEventListener("click", playReel);
  $("#rsBtn").addEventListener("click", playReel);
  $("#rhReel").addEventListener("click", function () { $("#showreel").scrollIntoView({ behavior: RM ? "auto" : "smooth" }); setTimeout(playReel, RM ? 0 : 600); });
  rsV.addEventListener("play", function () { rsP.classList.add("playing"); });
  rsV.addEventListener("pause", function () { rsP.classList.remove("playing"); });
  var st = $("#rsStage");
  new IntersectionObserver(function (es) { if (es[0].isIntersecting) st.classList.add("in"); else if (!rsV.paused) rsV.pause(); }, { threshold: .25 }).observe(st);

  // tiles
  $$(".rt, .rb-face, .rcs-card").forEach(function (t) { t.addEventListener("click", function () { openV(t); }); });
  $$(".rcs-watch").forEach(function (b) { b.addEventListener("click", function () { openV($(".rcs-card", b.closest(".rcs"))); }); });
  if (HOVER && !RM) $$(".rcs-card").forEach(function (t) {
    t.addEventListener("pointermove", function (e) { var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; t.style.setProperty("--ry", ((x - .5) * 18) + "deg"); t.style.setProperty("--rx", ((.5 - y) * 14) + "deg"); });
    t.addEventListener("pointerleave", function () { t.style.removeProperty("--ry"); t.style.removeProperty("--rx"); });
  });
  if (HOVER && !RM) $$(".rt").forEach(function (t) {
    var inn = $(".rt-in", t);
    t.addEventListener("pointermove", function (e) { var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; inn.style.transform = "rotateX(" + ((.5 - y) * 14) + "deg) rotateY(" + ((x - .5) * 16) + "deg) translateZ(14px)"; t.style.setProperty("--gx", x * 100 + "%"); t.style.setProperty("--gy", y * 100 + "%"); });
    t.addEventListener("pointerleave", function () { inn.style.transform = ""; });
  });

  // Paul story tilts in
  var rb = $("#rbMedia"); new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { rb.classList.add("in"); o.disconnect(); } }, { threshold: .3 }).observe(rb);
})();
