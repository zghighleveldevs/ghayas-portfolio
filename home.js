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
  // 3D journey: the lead orb travels until the first dropped moment
  const row = $("#hmMos"), scene = $("#ljScene"), orb = $("#ljOrb");
  const stopAt = () => { for (let i = 0; i < tiles.length; i++) if (dropped.has(i)) return i; return tiles.length; };
  let loop;
  function run() {
    const stop = stopAt();
    row.style.setProperty("--stop", stop);
    row.classList.toggle("lost", stop < tiles.length); row.classList.toggle("won", stop === tiles.length);
    if (RM) { orb.style.setProperty("--pos", stop); orb.classList.add("arrived"); return; }
    orb.classList.remove("arrived"); orb.classList.add("reset"); orb.style.setProperty("--pos", -1);
    void orb.offsetWidth; orb.classList.remove("reset");
    orb.style.setProperty("--dur", (0.55 * (stop + 1)) + "s");
    requestAnimationFrame(() => orb.style.setProperty("--pos", stop));
    clearTimeout(orb._t); orb._t = setTimeout(() => orb.classList.add("arrived"), 550 * (stop + 1));
  }
  function start() { clearInterval(loop); run(); if (!RM) loop = setInterval(run, 5200); }
  tiles.forEach((t, i) => t.addEventListener("click", () => { dropped.has(i) ? dropped.delete(i) : dropped.add(i); render(); start(); }));
  render();
  new IntersectionObserver(es => { if (es[0].isIntersecting) start(); else clearInterval(loop); }, { threshold: .3 }).observe(scene);
  if (matchMedia("(hover: hover)").matches && !RM) {
    scene.addEventListener("pointermove", e => { const r = scene.getBoundingClientRect(); scene.style.setProperty("--my", ((e.clientX - r.left) / r.width - .5) * 14 + "deg"); scene.style.setProperty("--mx", (24 - ((e.clientY - r.top) / r.height - .5) * 10) + "deg"); });
    scene.addEventListener("pointerleave", () => { scene.style.removeProperty("--my"); scene.style.removeProperty("--mx"); });
  }

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

  // Sound familiar: flip cards + switch
  const pbs = $$(".pb"), sw = $(".pb-switch");
  const HOV = matchMedia("(hover: hover)").matches;
  pbs.forEach(c => {
    c.addEventListener("click", () => { if (!HOV) c.classList.toggle("flip"); });
    c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.classList.toggle("flip"); } });
  });
  if (sw) $$("button", sw).forEach(b => b.addEventListener("click", () => {
    const fix = b.dataset.v === "fix";
    $$("button", sw).forEach(x => x.classList.toggle("on", x === b)); sw.classList.toggle("fix", fix);
    pbs.forEach((c, i) => setTimeout(() => c.classList.toggle("flip", fix), RM ? 0 : i * 70));
  }));

  // FAQ: one open at a time
  const qs = $$(".wq"); qs.forEach(d => d.addEventListener("toggle", () => { if (d.open) qs.forEach(o => { if (o !== d) o.open = false; }); }));
})();
