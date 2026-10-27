/* =========================================================
   ZG HighLevel Devs | Portfolio interactions
   No dependencies. Everything respects prefers-reduced-motion.
   ========================================================= */

/* ---- CONFIG -------------------------------------------------
   FORM_ENDPOINT: paste a URL that accepts a JSON POST, e.g.
   - a GoHighLevel inbound webhook (Automation > Workflow > Inbound Webhook trigger)
   - a Formspree endpoint (https://formspree.io/f/xxxxxx)
   Leave it empty and the form opens the visitor's email app,
   pre-filled, as a fallback.
-------------------------------------------------------------- */
const CONFIG = {
  FORM_ENDPOINT: "",
  EMAIL: "zghighleveldevs@gmail.com",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Page load sequence ---------- */
requestAnimationFrame(() => document.documentElement.classList.add("is-loaded"));

/* ---------- Header: scrolled state + back-to-top ---------- */
const header = $("#siteHeader");
const toTop = $("#toTop");
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 12);
  toTop.classList.toggle("show", y > 700);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

/* ---------- Mobile menu ---------- */
const menuBtn = $("#menuToggle");
const menu = $("#mobileMenu");

function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open);
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    $("a", menu).focus({ preventScroll: true });
  } else {
    menu.classList.remove("is-open");
    setTimeout(() => { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 350);
  }
}
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") { setMenu(false); menuBtn.focus(); }
});
window.matchMedia("(min-width: 960px)").addEventListener("change", e => { if (e.matches) setMenu(false); });

/* ---------- Active nav link ---------- */
const navLinks = $$(".nav-desktop a");
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
navLinks.forEach(a => { const s = $(a.getAttribute("href")); if (s) sectionObs.observe(s); });

/* ---------- Scroll reveal (small stagger within each group) ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = $$(":scope > .reveal", el.parentElement);
    const i = Math.max(0, siblings.indexOf(el));
    el.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
    el.classList.add("in");
    revealObs.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
$$(".reveal").forEach(el => revealObs.observe(el));

/* ---------- Count-up (hero fact) ---------- */
$$("[data-count]").forEach(el => {
  if (reduceMotion) return;
  const target = +el.dataset.count;
  const start = performance.now();
  const dur = 1400;
  el.textContent = "0";
  const tick = now => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  setTimeout(() => requestAnimationFrame(tick), 500);
});

/* ---------- Hero pipeline: a lead moves through the stages ---------- */
(function pipeline() {
  const cols = $$("#boardCols .col-list");
  const log = $("#logList");
  const tpl = $("#leadTpl");
  if (!cols.length || !log || !tpl) return;

  const leads = [
    { initials: "AR", name: "Amira R.", need: "Facial consult" },
    { initials: "JT", name: "James T.", need: "Kitchen refit quote" },
    { initials: "SK", name: "Sana K.", need: "Mortgage review" },
    { initials: "DM", name: "Dan M.", need: "Strategy call" },
  ];
  const steps = [
    { stage: 0, text: "Form submitted, contact created" },
    { stage: 1, text: "Instant SMS and email sent" },
    { stage: 2, text: "Call booked, reminders scheduled" },
    { stage: 3, text: "Marked won, review request queued", won: true },
  ];

  let leadIdx = 0, stepIdx = 0, card;
  let clock = 9 * 60 + 2; // fake clock, 09:02

  const fmt = m => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

  function newCard() {
    const l = leads[leadIdx % leads.length];
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".lead-avatar").textContent = l.initials;
    node.querySelector("strong").textContent = l.name;
    node.querySelector("small").textContent = l.need;
    return node;
  }

  function addLog(step) {
    const li = document.createElement("li");
    if (step.won) li.className = "won";
    li.innerHTML = `<time>${fmt(clock)}</time><span></span>`;
    li.lastChild.textContent = step.text;
    log.appendChild(li);
    while (log.children.length > 4) log.firstElementChild.remove();
  }

  // FLIP move from current column to the next
  function moveTo(stage) {
    const target = cols[stage];
    if (!card.parentElement || reduceMotion) { target.prepend(card); return; }
    const first = card.getBoundingClientRect();
    target.prepend(card);
    const last = card.getBoundingClientRect();
    const dx = first.left - last.left, dy = first.top - last.top;
    card.animate(
      [{ transform: `translate(${dx}px, ${dy}px) scale(1.04)` }, { transform: "translate(0,0) scale(1)" }],
      { duration: 750, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }

  function step() {
    if (stepIdx === 0) {
      if (card) card.remove();
      log.innerHTML = "";
      card = newCard();
      cols[0].prepend(card);
    } else {
      moveTo(steps[stepIdx].stage);
    }
    const s = steps[stepIdx];
    card.classList.toggle("is-won", !!s.won);
    clock += stepIdx === 0 ? 7 : stepIdx === 2 ? 38 : 1;
    addLog(s);

    const isLast = stepIdx === steps.length - 1;
    stepIdx = isLast ? 0 : stepIdx + 1;
    if (isLast) leadIdx++;
    timer = setTimeout(step, isLast ? 3200 : 1900);
  }

  let timer = null;
  // Only animate while visible (saves battery on mobile)
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !timer) timer = setTimeout(step, reduceMotion ? 0 : 900);
    else if (!e.isIntersecting && timer) { clearTimeout(timer); timer = null; }
  });
  io.observe($(".board"));
})();

/* ---------- Toast ---------- */
const toast = $("#toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Copy email ---------- */
const copyBtn = $("#copyEmail");
copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONFIG.EMAIL);
  } catch {
    const t = document.createElement("textarea");
    t.value = CONFIG.EMAIL; document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch {}
    t.remove();
  }
  copyBtn.classList.add("is-done");
  copyBtn.querySelector("span").textContent = "Copied";
  showToast("Email address copied");
  setTimeout(() => { copyBtn.classList.remove("is-done"); copyBtn.querySelector("span").textContent = "Copy"; }, 2000);
});

/* ---------- Contact form: validation + submit ---------- */
const form = $("#contactForm");
if (form) {
  const status = $("#formStatus");
  const submit = $("#formSubmit");
  const controls = $$("input:not(.hp), select, textarea", form);

  const validate = el => {
    const field = el.closest(".field");
    const ok = el.checkValidity() && el.value.trim().length >= (+el.getAttribute("minlength") || 0);
    field.classList.toggle("is-invalid", !ok);
    field.classList.toggle("is-valid", ok);
    el.setAttribute("aria-invalid", String(!ok));
    return ok;
  };

  controls.forEach(el => {
    const err = $(`.field-error[data-for="${el.id}"]`, form);
    if (err) { err.id = el.id + "-err"; el.setAttribute("aria-describedby", err.id); }
    el.addEventListener("blur", () => { if (el.value) validate(el); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("is-invalid")) validate(el); });
    el.addEventListener("change", () => validate(el));
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.className = "form-status"; status.textContent = "";
    const results = controls.map(validate);
    if (results.includes(false)) {
      controls[results.indexOf(false)].focus();
      status.className = "form-status err";
      status.textContent = "Check the highlighted fields.";
      return;
    }
    if (form.company_site.value) return; // bot

    const data = Object.fromEntries(new FormData(form));
    delete data.company_site;

    if (!CONFIG.FORM_ENDPOINT) {
      const body = `Name: ${data.name}\nEmail: ${data.email}\nNeeds: ${data.need}\n\n${data.message}`;
      window.location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent("Project enquiry from " + data.name)}&body=${encodeURIComponent(body)}`;
      status.className = "form-status ok";
      status.textContent = "Your email app should open with the message ready to send.";
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const res = await fetch(CONFIG.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, source: "Portfolio website" }),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      controls.forEach(el => el.closest(".field").classList.remove("is-valid"));
      status.className = "form-status ok";
      status.textContent = "Message sent. You’ll get a reply within 24 hours.";
    } catch {
      status.className = "form-status err";
      status.textContent = `The message didn’t send. Email ${CONFIG.EMAIL} directly instead.`;
    } finally {
      submit.disabled = false;
      submit.textContent = "Send message";
    }
  });
}

/* ---------- Lazy-load Calendly (heavy script) near the viewport ---------- */
const book = $("#book");
if (book) {
  const calObs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
    calObs.disconnect();
  }, { rootMargin: "600px 0px" });
  calObs.observe(book);
}

/* ---------- Footer year ---------- */
const yr = $("#year");
if (yr) yr.textContent = new Date().getFullYear();
