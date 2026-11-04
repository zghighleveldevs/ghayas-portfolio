/* Ghayas Ahmed | v2 interactions (no dependencies) */
const CONFIG = { FORM_ENDPOINT: "", EMAIL: "zghighleveldevs@gmail.com" };
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
links.forEach(a => { const s = $(a.getAttribute("href")); if (s) secObs.observe(s); });

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
    desc: "Outbound follow-up that mixes SMS, email and AI voice calls. It waits for each lead to reply, has the AI call anyone who answers “call me”, retries after two days with no response, and takes leads out once they book.",
    focus: "Multi-channel outbound follow-up with AI voice calls", see: ["Trigger", "SMS & Email", "AI Call", "Timeouts", "Exit on Booking"],
    shows: [["Reply-based branching", "Different paths for “call me”, other replies and no response."], ["AI voice follow-up", "The AI calls leads who ask for a call."], ["Clean exits", "Booked leads are removed from the sequence."]],
    skills: ["Workflow Automation", "AI Voice", "SMS", "Conditions"], best: "Firms that need every outbound lead followed up without manual chasing." },
  { img: "workflow-email-nurture", kind: "Workflow", title: "Email Nurture with Engagement Branches", chips: ["Email Events", "DND Handling"],
    desc: "Sends an email, waits a day, then branches on what the contact did. Opens and clicks lead to the next email or exit once booked; unsubscribes, spam complaints and bounces are tagged and set to Do Not Disturb.",
    focus: "Email nurture that reacts to engagement", see: ["Email 1", "Wait", "Email Events", "Tags", "DND"],
    shows: [["Event-based paths", "Opened, clicked, unsubscribed, spam and bounced each handled."], ["List hygiene", "Bad addresses and complaints set to Do Not Disturb."], ["Booking check", "Leads who book stop receiving nurture emails."]],
    skills: ["Email Automation", "Tags", "Conditions"], best: "Businesses running email nurture that must stay compliant and clean." },
  { img: "7-steps-sales-mastery", kind: "Website", title: "7 Steps to Sales Mastery", chips: ["Assessment Funnel", "Booking"], url: "https://7stepstosalesmastery.com/",
    desc: "Sales coaching site for Paul Broome, built around a 2-minute Sales Leak Assessment that turns visitors into booked discovery calls.",
    focus: "Coaching website with an assessment funnel", see: ["Hero", "Assessment", "Results", "Booking"],
    shows: [["Lead magnet funnel", "A short assessment captures and qualifies visitors."], ["Clear calls to action", "Every section leads to the assessment or a call."], ["Built in GHL", "Pages connect straight to the CRM and pipeline."]],
    skills: ["Funnels", "Website", "Forms", "Calendars"], best: "Coaches and consultants who sell through discovery calls." },
  { img: "client-success-machine", kind: "Website", title: "Client Success Machine", chips: ["Website", "Membership"], url: "https://clientsuccessmachine.com/",
    desc: "Sales platform site with account sign-up and member login, built for lead capture.",
    focus: "Product website with sign-up and member access", see: ["Hero", "Features", "Sign-up", "Member Login"],
    shows: [["Conversion-led layout", "One clear sign-up action above the fold."], ["Membership access", "Member login built into the site."], ["Lead capture", "Every sign-up lands in the CRM."]],
    skills: ["Website", "Membership", "Funnels"], best: "Software and service brands selling sign-ups online." },
  { img: "pipeline-wiserweb-board", kind: "Pipeline", title: "WiserWeb Sales Pipeline", chips: ["Opportunities", "White-label"],
    desc: "Opportunity board in a white-label agency account. Leads move from New Lead to Contacted, Proposal Sent and Closed, with SMS, tags, notes, tasks and booking on every card.",
    focus: "Sales pipeline inside a white-label agency", see: ["New Lead", "Contacted", "Proposal Sent", "Closed"],
    shows: [["Clear stages", "Every lead sits in a stage the team can see."], ["Actions on every card", "SMS, tags, notes, tasks and booking in one click."], ["Linked conversations", "Each opportunity is logged in the contact’s inbox."]],
    skills: ["Pipelines", "Opportunities", "CRM"], best: "Agencies and sales teams tracking deals in GHL." },
  { img: "pipeline-wiserweb-dashboard", kind: "Dashboard", title: "WiserWeb Pipeline Dashboard", chips: ["Reporting", "Conversion"],
    desc: "Dashboard tracking opportunity status, pipeline value, conversion rate, funnel and stage distribution.",
    focus: "Reporting on how deals move", see: ["Status", "Value", "Conversion", "Stage Distribution"],
    shows: [["At-a-glance status", "Open, won and lost opportunities in one view."], ["Pipeline value", "Revenue tracked across pipelines."], ["Stage distribution", "See where deals are stalling."]],
    skills: ["Dashboards", "Reporting"], best: "Owners who want to see pipeline health without digging." },
  { img: "email-consultation-offer", kind: "Email", title: "Branded Email Templates", chips: ["Merge Fields", "Mobile Ready"],
    desc: "Offer, appointment reminder and review request emails built for GHL, personalised with merge fields and designed to stack cleanly on phones.",
    focus: "Email templates that look good in every inbox", see: ["Offer", "Reminder", "Review Request"],
    shows: [["Personalised", "First name, appointment and location merge fields."], ["Mobile layout", "Columns stack into one on phones."], ["Workflow ready", "Each template is sent by a workflow at the right time."]],
    skills: ["Email Templates", "Merge Fields", "Workflows"], best: "Clinics and service businesses sending reminders and offers." },
];
(function portfolio() {
  const list = $("#pfList"), img = $("#plImg"), stage = $("#plStage");
  const q = id => document.getElementById(id);
  let cur = 0;
  PROJECTS.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "pf-item"; b.setAttribute("role", "tab");
    b.innerHTML = `<img src="/assets/img/${p.img}.webp" alt="" loading="lazy"><span><small>0${i + 1} · ${p.kind}</small><strong></strong></span><svg class="i chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>`;
    b.querySelector("strong").textContent = p.title;
    b.addEventListener("click", () => show(i));
    list.appendChild(b);
  });
  function li(text, html) { const el = document.createElement("li"); if (html) el.innerHTML = html; else el.textContent = text; return el; }
  function show(i) {
    cur = i; const p = PROJECTS[i];
    $$(".pf-item", list).forEach((b, j) => b.setAttribute("aria-selected", String(j === i)));
    const set = () => { img.src = `/assets/img/${p.img}.webp`; img.alt = p.title; const done = () => img.classList.remove("swap"); img.complete ? requestAnimationFrame(done) : img.addEventListener("load", done, { once: true }); };
    if (RM) set(); else { img.classList.add("swap"); setTimeout(set, 220); }
    q("plKicker").textContent = `Project ${i + 1} · ${p.kind}`;
    q("plTitle").textContent = p.title;
    q("plChip1").textContent = p.chips[0]; q("plChip2").textContent = p.chips[1];
    q("plDesc").textContent = p.desc;
    q("plProg").style.width = `${((i + 1) / PROJECTS.length) * 100}%`;
    const see = q("plSee"); see.replaceChildren(...p.see.map((s, k) => { const e = li(); const b = document.createElement("b"); b.textContent = String(k + 1).padStart(2, "0"); e.append(b, s); return e; }));
    const open = q("plOpen"); open.hidden = !p.url; if (p.url) open.href = p.url;
    q("bfNum").textContent = `Project ${i + 1} Briefing`;
    q("bfType").textContent = p.kind;
    q("bfFocus").textContent = p.focus;
    q("bfShows").replaceChildren(...p.shows.map(([t, d]) => { const e = li(); const b = document.createElement("b"); b.textContent = t; e.append(b, d); return e; }));
    q("bfSkills").replaceChildren(...p.skills.map(s => li(s)));
    const best = q("bfBest"); best.replaceChildren(); const bb = document.createElement("b"); bb.textContent = "Best for: "; best.append(bb, p.best);
    if (!RM) ["plTitle", "plDesc", "plSee", "bfFocus", "bfShows"].forEach(id => { const el = q(id); el.classList.remove("fade"); void el.offsetWidth; el.classList.add("fade"); });
  }
  const full = () => openLb(img.src, img.alt, PROJECTS[cur].title);
  stage.addEventListener("click", full); q("plFull").addEventListener("click", full);
  show(0);
})();

/* Contact form */
(function form() {
  const f = $("#form"), status = $("#status");
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
      const body = `Name: ${d.name}\nEmail: ${d.email}\nI am a: ${d.who}\nService: ${d.need}\n\n${d.message}`;
      location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent("Project enquiry from " + d.name)}&body=${encodeURIComponent(body)}`;
      status.className = "status good"; status.textContent = "Your email app should open with the message ready to send."; return;
    }
    try {
      const r = await fetch(CONFIG.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, source: "Portfolio v2" }) });
      if (!r.ok) throw 0;
      f.reset(); status.className = "status good"; status.textContent = "Message sent. You’ll get a reply within 24 hours.";
    } catch { status.className = "status bad"; status.textContent = `The message didn’t send. Email ${CONFIG.EMAIL} directly instead.`; }
  });
})();

$("#yr").textContent = new Date().getFullYear();
