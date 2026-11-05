/* Contact page: form (FormSubmit → Gmail → thank-you page), copy email, lazy Calendly, steps, FAQ */
(function () {
  const $ = (s, e = document) => e.querySelector(s), $$ = (s, e = document) => [...e.querySelectorAll(s)];
  const ENDPOINT = "https://formsubmit.co/ajax/zghighleveldevs@gmail.com", EMAIL = "zghighleveldevs@gmail.com";

  // form
  const f = $("#form"), status = $("#status"), fields = $$("input[required], textarea[required]", f);
  const check = el => {
    const ok = el.checkValidity() && el.value.trim().length >= (+el.getAttribute("minlength") || 0);
    el.closest(".f").classList.toggle("bad", !ok); el.closest(".f").classList.toggle("ok", ok);
    el.setAttribute("aria-invalid", String(!ok)); return ok;
  };
  fields.forEach(el => { el.addEventListener("blur", () => el.value && check(el)); el.addEventListener("input", () => el.closest(".f").classList.contains("bad") && check(el)); });
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const res = fields.map(check);
    if (res.includes(false)) { fields[res.indexOf(false)].focus(); status.className = "status bad"; status.textContent = "Check the highlighted fields."; return; }
    const d = Object.fromEntries(new FormData(f));
    const btn = f.querySelector('button[type="submit"]'), label = btn.innerHTML;
    btn.disabled = true; btn.textContent = "Sending…";
    const payload = { Name: d.name, Email: d.email, Phone: d.phone, "I am a": d.who, "Service needed": d.need, Message: d.message, Page: "Contact page",
      _subject: `New project enquiry from ${d.name}`, _replyto: d.email, _template: "table", _captcha: "false", _honey: d._honey || "" };
    const goThankYou = () => {
      try { sessionStorage.setItem("zgLead", JSON.stringify({ name: d.name, email: d.email, need: d.need })); } catch {}
      location.href = "/thank-you/?name=" + encodeURIComponent(d.name.split(" ")[0]);
    };
    const send = fetch(ENDPOINT, { method: "POST", keepalive: true, headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
      .then(r => r.json().catch(() => ({})).then(j => ({ ok: r.ok, j })));
    const timeout = new Promise(r => setTimeout(() => r({ timeout: true }), 2500));
    try {
      const r = await Promise.race([send, timeout]);
      const activation = r.j && /activat/i.test(r.j.message || "");
      if (r.timeout || r.ok || activation) { status.className = "status good"; status.textContent = "Message sent. Taking you to the next step…"; goThankYou(); return; }
      throw new Error("send failed");
    } catch {
      status.className = "status bad";
      status.textContent = `The message didn’t send. Email ${EMAIL} or WhatsApp +92 310 4168315 instead.`;
      btn.disabled = false; btn.innerHTML = label;
    }
  });

  // copy email
  const cp = $("#ctCopy");
  cp.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(EMAIL); } catch { const t = document.createElement("textarea"); t.value = EMAIL; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch {} t.remove(); }
    cp.classList.add("done"); $("span", cp).textContent = "Copied";
    setTimeout(() => { cp.classList.remove("done"); $("span", cp).textContent = "Copy"; }, 2000);
  });

  // steps animate in
  const cn = $("#cn");
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { cn.classList.add("in"); o.disconnect(); } }, { threshold: .3 }).observe(cn);

  // Calendly loads when the booking section gets close
  const frame = $("#ctFrame"), loading = $("#ctLoading");
  const load = () => {
    if (frame.src) return;
    const u = new URL("https://calendly.com/zghighleveldevs/30min");
    u.searchParams.set("embed_domain", location.hostname || "localhost"); u.searchParams.set("embed_type", "Inline");
    u.searchParams.set("hide_gdpr_banner", "1"); u.searchParams.set("hide_event_type_details", "1"); u.searchParams.set("primary_color", "e5281e");
    frame.addEventListener("load", () => { loading.hidden = true; });
    frame.src = u.toString();
  };
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { load(); o.disconnect(); } }, { rootMargin: "600px 0px" }).observe($("#book"));
  addEventListener("message", e => {
    let host = ""; try { host = new URL(e.origin).hostname; } catch {}
    if (!/calendly\.com$/.test(host)) return;
    const ev = e.data && e.data.event;
    if (ev === "calendly.page_height" && e.data.payload && e.data.payload.height) { const h = parseInt(e.data.payload.height, 10); if (h > 400) frame.style.height = Math.min(h, 1100) + "px"; }
    if (ev === "calendly.event_scheduled" && !document.querySelector("dialog[open]")) setTimeout(() => { location.href = "/booked/"; }, 800);
  });

  // FAQ: one open at a time
  const qs = $$(".wq"); qs.forEach(d => d.addEventListener("toggle", () => { if (d.open) qs.forEach(o => { if (o !== d) o.open = false; }); }));
})();
