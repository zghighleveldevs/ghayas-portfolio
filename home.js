/* Home: lead leak calculator, 5 moments toggle, client video popup, FAQ */
(function () {
  const $ = (s, e = document) => e.querySelector(s), $$ = (s, e = document) => [...e.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lead leak check
  const L = $("#lcLeads"), V = $("#lcVal"), C = $("#lcClose"), M = $("#lcMiss"), cur = $("#lcCur"), out = $("#lcOut"), cust = $("#lcCust");
  let shown = 180000, raf;
  const fmt = n => cur.value + Math.round(n).toLocaleString("en-GB");
  function calc() {
    const leads = Math.max(0, +L.value || 0), val = Math.max(0, +V.value || 0), close = +C.value / 100, miss = +M.value / 100;
    $("#lcCloseOut").textContent = C.value + "%"; $("#lcMissOut").textContent = M.value + "%";
    [C, M].forEach(r => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%"));
    const lost = leads * miss * close * 12, target = lost * val;
    cust.textContent = Math.round(lost).toLocaleString("en-GB");
    cancelAnimationFrame(raf);
    if (RM) { shown = target; out.textContent = fmt(target); return; }
    const from = shown, t0 = performance.now();
    (function tick(t) { const p = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - p, 3); shown = from + (target - from) * e; out.textContent = fmt(shown); if (p < 1) raf = requestAnimationFrame(tick); })(t0);
  }
  [L, V, C, M, cur].forEach(el => el.addEventListener("input", calc));
  calc();

  // 5 moments: the lead goes cold at the first dropped moment
  const tiles = $$(".hm-mo"), good = $("#hmGood"), bad = $("#hmBad");
  const dropped = new Set([2]);
  function render() {
    let gone = false;
    tiles.forEach((t, i) => {
      const d = dropped.has(i), cold = gone && !d;
      t.className = "hm-mo " + (d && !gone ? "drop" : cold || (gone && d) ? "cold" : "held");
      t.setAttribute("aria-pressed", String(!d));
      $("small", t).textContent = d && !gone ? "Dropped" : gone ? "—" : "Held";
      if (d) gone = true;
    });
    good.classList.toggle("on", !dropped.size); bad.classList.toggle("on", !!dropped.size);
  }
  tiles.forEach((t, i) => t.addEventListener("click", () => { dropped.has(i) ? dropped.delete(i) : dropped.add(i); render(); }));
  render();

  // client video popup
  const rl = $("#rl"), media = $("#rlMedia");
  function openV(el) {
    media.innerHTML = "";
    const v = document.createElement("video"); v.src = el.dataset.v; v.controls = true; v.playsInline = true; v.autoplay = true; v.poster = el.dataset.p || "";
    media.appendChild(v);
    $("#rlName").textContent = el.dataset.n; $("#rlCo").textContent = el.dataset.c;
    rl.showModal(); document.body.classList.add("svm-open"); v.play().catch(() => {});
  }
  $$(".hm-cr-vid").forEach(b => b.addEventListener("click", () => openV(b)));
  $$(".hm-cr-watch").forEach(b => b.addEventListener("click", () => openV($(".hm-cr-vid", b.closest(".hm-cr")))));
  $(".rl-x", rl).addEventListener("click", () => rl.close());
  rl.addEventListener("click", e => { if (e.target === rl) rl.close(); });
  rl.addEventListener("close", () => { media.innerHTML = ""; document.body.classList.remove("svm-open"); });
  $$("[data-cal]", rl).forEach(a => a.addEventListener("click", () => rl.close()));

  // FAQ: one open at a time
  const qs = $$(".wq"); qs.forEach(d => d.addEventListener("toggle", () => { if (d.open) qs.forEach(o => { if (o !== d) o.open = false; }); }));
})();
