/* Ghayas Ahmed | v2 interactions (no dependencies) */
/* Form messages are emailed to EMAIL through FormSubmit (formsubmit.co).
   The very first submission sends a one-time "Activate" email to that inbox; click it once. */
const CONFIG = { FORM_ENDPOINT: "https://formsubmit.co/ajax/zghighleveldevs@gmail.com", EMAIL: "zghighleveldevs@gmail.com" };
const GHL_HOOK = "https://services.leadconnectorhq.com/hooks/65eRbQqIPWfYH6wIDGDd/webhook-trigger/d0e65d1a-0cd2-4310-b926-4c404e0f410e";
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* Header + back-to-top */
const hdr = $("#hdr"), totop = $("#totop");
const onScroll = () => { hdr.classList.toggle("scrolled", scrollY > 10); totop.classList.toggle("show", scrollY > 800); };
addEventListener("scroll", onScroll, { passive: true }); onScroll();
totop.addEventListener("click", () => scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));

/* Mobile menu */
const burger = $("#burger"), mnav = $("#mnav");
function menu(open) {
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open);
  if (open) { mnav.hidden = false; requestAnimationFrame(() => mnav.classList.add("open")); }
  else { mnav.classList.remove("open"); setTimeout(() => { if (!mnav.classList.contains("open")) mnav.hidden = true; }, 300); }
}
burger.addEventListener("click", () => menu(burger.getAttribute("aria-expanded") !== "true"));
$$("a", mnav).forEach(a => a.addEventListener("click", () => menu(false)));
addEventListener("keydown", e => { if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") menu(false); });

/* Active nav pill */
const links = $$(".nav a");
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
links.forEach(a => { const h = a.getAttribute("href"); if (!h.startsWith("#")) return; const s = $(h); if (s) secObs.observe(s); });

/* Scroll reveal */
const rvObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, sib = $$(":scope > .rv", el.parentElement), i = Math.max(0, sib.indexOf(el));
  el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
  el.classList.add("in");
  setTimeout(() => { el.style.transitionDelay = ""; }, 1300);
  rvObs.unobserve(el);
}), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
$$(".rv").forEach(el => rvObs.observe(el));
requestAnimationFrame(() => $$(".hero .rv").forEach(el => el.classList.add("in")));

/* Lightbox */
const lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
const openLb = (src, alt, cap) => { lbImg.src = src; lbImg.alt = alt || ""; lbCap.textContent = cap || ""; lb.showModal?.(); };
$(".lb-x").addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });

/* Portfolio player */
const PROJECTS = [
  { img: "workflow-ai-outbound-law", kind: "Workflow", title: "AI Outbound Campaign for a Law Firm", chips: ["AI Voice", "Reply Branches"],
    prob: "Leads went cold because nobody followed up after the first message.", res: "Every lead gets SMS, email and an AI call when they ask for one, and stops being chased the moment they book.",
    desc: "Outbound follow-up that mixes SMS, email and AI voice calls, with different paths for “call me”, other replies and no reply.",
    focus: "Multi-channel outbound follow-up with AI voice calls", see: ["Trigger", "SMS & Email", "AI Call", "Timeouts", "Exit on Booking"],
    shows: [["Reply-based branching", "Different paths for “call me”, other replies and no response."], ["AI voice follow-up", "The AI calls leads who ask for a call."], ["Clean exits", "Booked leads are removed from the sequence."]],
    skills: ["Workflow Automation", "AI Voice", "SMS", "Conditions"], best: "Firms that need every outbound lead followed up without manual chasing." },
  { img: "workflow-email-nurture", kind: "Workflow", title: "Email Nurture with Engagement Branches", chips: ["Email Events", "DND Handling"],
    prob: "Emails kept going to people who had unsubscribed, bounced or marked them as spam.", res: "Engaged leads keep moving toward a booking, and bad addresses are cleaned out automatically.",
    desc: "An email sequence that reacts to what each contact does: opens and clicks move them on, unsubscribes, spam and bounces are tagged and set to Do Not Disturb.",
    focus: "Email nurture that reacts to engagement", see: ["Email 1", "Wait", "Email Events", "Tags", "DND"],
    shows: [["Event-based paths", "Opened, clicked, unsubscribed, spam and bounced each handled."], ["List hygiene", "Bad addresses and complaints set to Do Not Disturb."], ["Booking check", "Leads who book stop receiving nurture emails."]],
    skills: ["Email Automation", "Tags", "Conditions"], best: "Businesses running email nurture that must stay compliant and clean." },
  { img: "7-steps-sales-mastery", kind: "Website", title: "7 Steps to Sales Mastery", chips: ["Assessment Funnel", "Booking"], url: "https://7stepstosalesmastery.com/",
    prob: "Visitors read the site and left without booking a call.", res: "Visitors take the assessment, see their result and go straight into booking a discovery call.",
    desc: "A sales coaching site for Paul Broome built around a 2-minute Sales Leak Assessment, connected to his GoHighLevel CRM and calendar.",
    focus: "Coaching website with an assessment funnel", see: ["Hero", "Assessment", "Results", "Booking"],
    shows: [["Lead magnet funnel", "A short assessment captures and qualifies visitors."], ["Clear calls to action", "Every section leads to the assessment or a call."], ["Built in GHL", "Pages connect straight to the CRM and pipeline."]],
    skills: ["Funnels", "Website", "Forms", "Calendars"], best: "Coaches and consultants who sell through discovery calls." },
  { img: "client-success-machine", kind: "Website", title: "Client Success Machine", chips: ["Website", "Membership"], url: "https://clientsuccessmachine.com/",
    prob: "The product needed one place for people to sign up and log in.", res: "Every sign-up lands in the CRM, and members log in from the same site.",
    desc: "A product website with one clear sign-up action, account creation and member login built in.",
    focus: "Product website with sign-up and member access", see: ["Hero", "Features", "Sign-up", "Member Login"],
    shows: [["Conversion-led layout", "One clear sign-up action above the fold."], ["Membership access", "Member login built into the site."], ["Lead capture", "Every sign-up lands in the CRM."]],
    skills: ["Website", "Membership", "Funnels"], best: "Software and service brands selling sign-ups online." },
  { img: "pipeline-wiserweb-board", kind: "Pipeline", title: "WiserWeb Sales Pipeline", chips: ["Opportunities", "White-label"],
    prob: "The team couldn’t see where each deal was or what to do next.", res: "Every lead sits in a clear stage, with SMS, notes, tasks and booking one click away.",
    desc: "A sales pipeline in a white-label agency account: New Lead, Contacted, Proposal Sent and Closed.",
    focus: "Sales pipeline inside a white-label agency", see: ["New Lead", "Contacted", "Proposal Sent", "Closed"],
    shows: [["Clear stages", "Every lead sits in a stage the team can see."], ["Actions on every card", "SMS, tags, notes, tasks and booking in one click."], ["Linked conversations", "Each opportunity is logged in the contact’s inbox."]],
    skills: ["Pipelines", "Opportunities", "CRM"], best: "Agencies and sales teams tracking deals in GHL." },
  { img: "pipeline-wiserweb-dashboard", kind: "Dashboard", title: "WiserWeb Pipeline Dashboard", chips: ["Reporting", "Conversion"],
    prob: "The owner had to dig through records to know how sales were going.", res: "Pipeline value, conversion rate and the stages where deals stall, all on one screen.",
    desc: "A reporting dashboard for opportunity status, pipeline value, conversion and stage distribution.",
    focus: "Reporting on how deals move", see: ["Status", "Value", "Conversion", "Stage Distribution"],
    shows: [["At-a-glance status", "Open, won and lost opportunities in one view."], ["Pipeline value", "Revenue tracked across pipelines."], ["Stage distribution", "See where deals are stalling."]],
    skills: ["Dashboards", "Reporting"], best: "Owners who want to see pipeline health without digging." },
  { img: "email-consultation-offer", kind: "Email", title: "Branded Email Templates", chips: ["Merge Fields", "Mobile Ready"],
    prob: "Reminders and offers looked plain and broke on phones.", res: "On-brand, personalised emails that read cleanly on any phone, sent automatically at the right time.",
    desc: "Offer, appointment reminder and review request templates with merge fields, sent by workflows.",
    focus: "Email templates that look good in every inbox", see: ["Offer", "Reminder", "Review Request"],
    shows: [["Personalised", "First name, appointment and location merge fields."], ["Mobile layout", "Columns stack into one on phones."], ["Workflow ready", "Each template is sent by a workflow at the right time."]],
    skills: ["Email Templates", "Merge Fields", "Workflows"], best: "Clinics and service businesses sending reminders and offers." },
];
(function coverflow() {
  const stage = $("#cfStage"), track = $("#cfTrack"), dots = $("#cfDots"), info = $("#sxCard");
  if (!stage) return;
  const q = id => document.getElementById(id), N = PROJECTS.length;
  let cur = 0, timer = null, hover = false;
  const slides = PROJECTS.map((p, i) => {
    const el = document.createElement("button");
    el.type = "button"; el.className = "cf-slide"; el.setAttribute("aria-label", `${p.title} (${p.kind})`);
    el.innerHTML = `<span class="cf-frame"><span class="cf-bar"><i></i><i></i><i></i><em></em></span><span class="cf-img"><img src="/assets/img/${p.img}.webp" alt="" loading="${i < 3 ? "eager" : "lazy"}"></span><span class="cf-shine"></span><span class="cf-cap"><small></small><strong></strong></span></span><span class="cf-reflect" aria-hidden="true"></span>`;
    el.querySelector("em").textContent = p.kind; el.querySelector(".cf-cap small").textContent = `${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")} · ${p.kind}`;
    el.querySelector(".cf-cap strong").textContent = p.title;
    el.addEventListener("click", () => { if (i === cur) openLb(`/assets/img/${p.img}.webp`, p.title, p.title); else go(i); });
    track.appendChild(el); return el;
  });
  const dotEls = PROJECTS.map((p, i) => { const d = document.createElement("button"); d.type = "button"; d.setAttribute("role", "tab"); d.setAttribute("aria-label", p.title); d.addEventListener("click", () => go(i)); dots.appendChild(d); return d; });
  function layout() {
    const narrow = stage.clientWidth < 700;
    slides.forEach((el, i) => {
      let d = i - cur; if (d > N / 2) d -= N; if (d < -N / 2) d += N;
      const a = Math.abs(d), s = Math.sign(d);
      const x = narrow ? d * 74 : s * (a === 0 ? 0 : 40 + (a - 1) * 22);
      const tf = `translate(-50%, -50%) translateX(${x}%) translateZ(${-a * (narrow ? 220 : 260)}px) rotateY(${-s * Math.min(a, 2) * (narrow ? 28 : 38)}deg)`;
      el.style.transform = tf; el.style.zIndex = String(10 - a);
      el.style.opacity = a > (narrow ? 1 : 2) ? "0" : "1"; el.style.setProperty("--dim", a === 0 ? "0" : a === 1 ? ".5" : ".7");
      el.style.pointerEvents = a > (narrow ? 1 : 2) ? "none" : "auto";
      el.classList.toggle("on", a === 0); el.tabIndex = a === 0 ? 0 : -1; el.setAttribute("aria-hidden", String(a > 1));
    });
  }
  function fill() {
    const p = PROJECTS[cur];
    q("sxCount").textContent = `${p.kind} · Project ${cur + 1} of ${N}`; q("plTitle").textContent = p.title;
    q("sxProb").textContent = p.prob; q("plDesc").textContent = p.desc; q("sxRes").textContent = p.res; q("bfBest").textContent = p.best;
    const open = q("plOpen"); open.hidden = !p.url; if (p.url) open.href = p.url;
    dotEls.forEach((d, j) => d.setAttribute("aria-selected", String(j === cur)));
    if (!RM) { info.classList.remove("in"); void info.offsetWidth; info.classList.add("in"); }
  }
  function go(i) { cur = (i + N) % N; layout(); fill(); restart(); }
  const restart = () => { clearInterval(timer); if (!RM && !hover) timer = setInterval(() => { if (!document.hidden && isVis) go(cur + 1); }, 6000); };
  let isVis = false; new IntersectionObserver(([e]) => { isVis = e.isIntersecting; }, { threshold: .4 }).observe(stage);
  q("sxPrev").addEventListener("click", () => go(cur - 1)); q("sxNext").addEventListener("click", () => go(cur + 1));
  q("plFull").addEventListener("click", () => openLb(`/assets/img/${PROJECTS[cur].img}.webp`, PROJECTS[cur].title, PROJECTS[cur].title));
  stage.addEventListener("keydown", e => { if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); } });
  stage.addEventListener("mouseenter", () => { hover = true; clearInterval(timer); }); stage.addEventListener("mouseleave", () => { hover = false; restart(); });
  let sx = null, sy = 0;
  stage.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; }, { passive: true });
  stage.addEventListener("pointerup", e => { if (sx === null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1)); });
  stage.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", e => { if (sx === null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
  if (!RM && matchMedia("(hover: hover)").matches) stage.addEventListener("pointermove", e => {
    const on = slides[cur], r = on.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { on.style.removeProperty("--tx"); on.style.removeProperty("--ty"); return; }
    on.style.setProperty("--tx", `${((e.clientY - r.top) / r.height - .5) * -8}deg`); on.style.setProperty("--ty", `${((e.clientX - r.left) / r.width - .5) * 10}deg`);
    on.style.setProperty("--mx", `${(e.clientX - r.left) / r.width * 100}%`); on.style.setProperty("--my", `${(e.clientY - r.top) / r.height * 100}%`);
  });
  addEventListener("resize", layout);
  layout(); fill(); restart();
})();

/* Contact form */
(function form() {
  const f = $("#form"), status = $("#status");
  // Send the lead to the GoHighLevel inbound webhook (creates/updates the contact and runs the workflow)
  const toGHL = (d, page) => {
    if (d._honey) return Promise.resolve({ ok: true });
    const parts = (d.name || "").trim().split(/\s+/);
    return fetch(GHL_HOOK, { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: parts[0] || "", last_name: parts.slice(1).join(" "), full_name: (d.name || "").trim(),
        email: d.email || "", phone: d.phone || "", who: d.who || "", service_needed: d.need || "", message: d.message || "",
        source: "Website - " + page, page_url: location.href, submitted_at: new Date().toISOString() }) })
      .then(r => ({ ok: r.ok })).catch(() => ({ ok: false }));
  };
  const fields = $$("input[required], textarea[required]", f);
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
    if (!CONFIG.FORM_ENDPOINT) {
      const body = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nI am a: ${d.who}\nService: ${d.need}\n\n${d.message}`;
      location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent("Project enquiry from " + d.name)}&body=${encodeURIComponent(body)}`;
      status.className = "status good"; status.textContent = "Your email app should open with the message ready to send."; return;
    }
    const btn = f.querySelector('button[type="submit"]'), label = btn.innerHTML;
    btn.disabled = true; btn.textContent = "Sending…";
    const payload = { Name: d.name, Email: d.email, Phone: d.phone, "I am a": d.who, "Service needed": d.need, Message: d.message,
      _subject: `New project enquiry from ${d.name}`, _replyto: d.email, _template: "table", _captcha: "false", _honey: d._honey || "" };
    const goThankYou = () => {
      try { sessionStorage.setItem("zgLead", JSON.stringify({ name: d.name, email: d.email, need: d.need })); } catch {}
      location.href = "/thank-you/?name=" + encodeURIComponent(d.name.split(" ")[0]);
    };
    // keepalive lets the request finish even after we move to the thank-you page
    const ghl = toGHL(d, "Homepage");
    const mail = fetch(CONFIG.FORM_ENDPOINT, { method: "POST", keepalive: true,
      headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
      .then(r => r.json().catch(() => ({})).then(j => ({ ok: r.ok, j })));
    // success if either GoHighLevel or the email copy accepted it
    const send = Promise.all([ghl, mail.catch(() => ({ ok: false }))]).then(([g, m]) => ({ ok: g.ok || m.ok, j: m.j }));
    const timeout = new Promise(res => setTimeout(() => res({ timeout: true }), 2500));
    try {
      const res = await Promise.race([send, timeout]);
      // Sent, still sending (timed out but keepalive continues), or FormSubmit asking for one-time activation: all go ahead
      const activation = res.j && /activat/i.test(res.j.message || "");
      if (res.timeout || res.ok || activation) { status.className = "status good"; status.textContent = "Message sent. Taking you to the next step…"; goThankYou(); return; }
      throw new Error((res.j && res.j.message) || "send failed");
    } catch {
      status.className = "status bad";
      status.textContent = `The message didn’t send. Email ${CONFIG.EMAIL} or WhatsApp +92 310 4168315 instead.`;
      btn.disabled = false; btn.innerHTML = label;
    }
  });
})();

$("#yr").textContent = new Date().getFullYear();

/* Service-line popups */
(function svcModals() {
  $$(".svm").forEach(d => {
    $$(".svm-inc li", d).forEach((li, k) => li.style.setProperty("--k", k));
    const close = () => d.close();
    $(".svm-x", d).addEventListener("click", close);
    d.addEventListener("click", e => { if (e.target === d) close(); });
    d.addEventListener("close", () => document.body.classList.remove("svm-open"));
    $$("[data-close]", d).forEach(a => a.addEventListener("click", () => {
      if (a.dataset.need) { const sel = $("#t"); if (sel) sel.value = a.dataset.need; }
      close();
    }));
  });
  $$("[data-svc]").forEach(a => a.addEventListener("click", e => {
    const d = document.getElementById("svm" + a.dataset.svc);
    if (!d?.showModal) return;
    e.preventDefault();
    d.showModal(); document.body.classList.add("svm-open");
  }));
})();

/* Testimonial showreel: custom play overlay, pause other videos */
(function reel() {
  const box = $("#reel"), v = $("#reelVideo");
  if (!box || !v) return;
  const play = () => { v.controls = true; v.play().catch(() => {}); };
  $("#reelPlay").addEventListener("click", play);
  $("#reelBtn").addEventListener("click", () => { box.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" }); play(); });
  v.addEventListener("play", () => box.classList.add("playing"));
  v.addEventListener("ended", () => { box.classList.remove("playing"); v.controls = false; v.load(); });
  v.addEventListener("loadedmetadata", () => { const d = Math.floor(v.duration); if (d) $("#reelDur").textContent = `${Math.floor(d / 60)}:${String(d % 60).padStart(2, "0")}`; });
  // only one video plays at a time
  document.addEventListener("play", e => { $$("video").forEach(x => { if (x !== e.target) x.pause(); }); }, true);
})();
