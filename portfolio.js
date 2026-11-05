/* Portfolio: 3D wall parallax, laptop tilt, tilt cards, filter, modal, phone showreel */
(function () {
  var $ = function (s, e) { return (e || document).querySelector(s); }, $$ = function (s, e) { return [].slice.call((e || document).querySelectorAll(s)); };
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches, HOVER = matchMedia("(hover: hover)").matches;

  // count-ups
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; io.unobserve(e.target); var el = e.target, to = +el.dataset.to; if (RM) { el.textContent = to; return; } var t0 = performance.now(); (function tick(t) { var p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0); }); }, { threshold: .5 });
  $$("[data-to]").forEach(function (n) { io.observe(n); });

  // 3D wall follows the pointer
  var w3 = $("#w3"), wall = w3 && $(".w3", w3);
  if (wall && HOVER && !RM) {
    document.addEventListener("pointermove", function (e) {
      var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      wall.style.setProperty("--rx", (22 - y * 8) + "deg"); wall.style.setProperty("--ry", (-24 + x * 10) + "deg");
    });
  }

  // laptop opens as it scrolls into view, tilts with pointer
  var lap = $("#lap"), ls = $("#lapScene");
  if (lap) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting) lap.classList.add("open"); }, { threshold: .35 }).observe(ls);
    if (HOVER && !RM) {
      ls.addEventListener("pointermove", function (e) { var r = ls.getBoundingClientRect(); lap.style.setProperty("--ly", (((e.clientX - r.left) / r.width - .5) * 16 - 14) + "deg"); lap.style.setProperty("--lx", (8 - ((e.clientY - r.top) / r.height - .5) * 10) + "deg"); });
      ls.addEventListener("pointerleave", function () { lap.style.removeProperty("--ly"); lap.style.removeProperty("--lx"); });
    }
  }

  // tilt cards
  var cards = $$(".pc");
  if (HOVER && !RM) cards.forEach(function (c) {
    var inn = $(".pc-in", c);
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      inn.style.transform = "rotateX(" + ((.5 - y) * 12) + "deg) rotateY(" + ((x - .5) * 14) + "deg) translateZ(10px)";
      c.style.setProperty("--gx", x * 100 + "%"); c.style.setProperty("--gy", y * 100 + "%");
    });
    c.addEventListener("pointerleave", function () { inn.style.transform = ""; });
  });

  // staggered entrance
  var grid = $("#pcGrid");
  cards.forEach(function (c, i) { c.style.setProperty("--i", i % 8); });
  new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { grid.classList.add("in"); o.disconnect(); } }, { threshold: .05 }).observe(grid);

  // filter (FLIP)
  $$(".pf-f").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".pf-f").forEach(function (x) { x.classList.toggle("on", x === b); });
      var f = b.dataset.f; grid.dataset.f = f; var first = new Map(cards.map(function (c) { return [c, c.getBoundingClientRect()]; }));
      cards.forEach(function (c) { c.hidden = !(f === "all" || c.dataset.cat === f); });
      if (RM) return;
      cards.forEach(function (c) {
        if (c.hidden) return; var a = first.get(c), z = c.getBoundingClientRect();
        if (!a.width) { c.animate([{ opacity: 0, transform: "scale(.9) rotateX(20deg)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" }); return; }
        c.animate([{ transform: "translate(" + (a.left - z.left) + "px," + (a.top - z.top) + "px)" }, { transform: "none" }], { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    });
  });

  // modal
  var pm = $("#pm"), media = $("#pmMedia");
  function openCard(c) {
    var d = c.dataset;
    media.innerHTML = "";
    if (d.video) { var v = document.createElement("video"); v.src = d.video; v.controls = true; v.playsInline = true; v.autoplay = true; v.className = "pm-video"; media.appendChild(v); }
    else { var im = document.createElement("img"); im.src = d.img; im.alt = d.title; media.appendChild(im); }
    $("#pmCat").textContent = d.catName; $("#pmTitle").textContent = d.title; $("#pmClient").textContent = d.client; $("#pmDesc").textContent = d.desc;
    var tg = $("#pmTags"); tg.innerHTML = ""; d.tags.split(",").forEach(function (t) { var li = document.createElement("li"); li.textContent = t; tg.appendChild(li); });
    var a = $("#pmLink"); a.hidden = !d.url; if (d.url) a.href = d.url;
    pm.style.setProperty("--c", c.style.getPropertyValue("--c"));
    pm.showModal(); document.body.classList.add("svm-open");
  }
  cards.forEach(function (c) {
    c.addEventListener("click", function () { openCard(c); });
    c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(c); } });
  });
  function closePm() { pm.close(); }
  $(".pm-x", pm).addEventListener("click", closePm);
  pm.addEventListener("click", function (e) { if (e.target === pm) closePm(); });
  pm.addEventListener("close", function () { media.innerHTML = ""; document.body.classList.remove("svm-open"); });
  $$("[data-cal]", pm).forEach(function (a) { a.addEventListener("click", closePm); });

  // 3D phone showreel
  var ph = $("#ph3"), v = $("#ph3Video");
  if (ph && v) {
    var play = function () { v.controls = true; v.play().catch(function () {}); ph.classList.add("playing"); };
    $("#ph3Play").addEventListener("click", play);
    $("#ph3Btn").addEventListener("click", function () { ph.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" }); play(); });
    v.addEventListener("pause", function () { ph.classList.remove("playing"); });
    v.addEventListener("play", function () { ph.classList.add("playing"); });
  }
})();
