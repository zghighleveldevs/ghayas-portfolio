/* Booking popup: opens your Calendly calendar in a modal on any page.
   Any link with data-cal (or to calendly.com/zghighleveldevs) opens it. */
(function () {
  const URL_BASE = "https://calendly.com/zghighleveldevs/30min";
  const dlg = document.createElement("dialog");
  dlg.className = "cal";
  dlg.setAttribute("aria-label", "Book a free discovery call");
  dlg.innerHTML = `
    <div class="cal-card">
      <div class="cal-head">
        <span class="cal-ic"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg></span>
        <div><strong>Free Discovery Call</strong><small>30 minutes · GoHighLevel &amp; automation</small></div>
        <button type="button" class="cal-x" aria-label="Close"><svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>
      <div class="cal-steps"><span class="on">1. Choose a time</span><span>2. Your details</span></div>
      <div class="cal-body">
        <div class="cal-loading"><span></span>Loading available times…</div>
        <iframe title="Book a call with Ghayas Ahmed" loading="lazy" allow="payment"></iframe>
      </div>
      <a class="cal-alt" href="${URL_BASE}" target="_blank" rel="noopener">Calendar not loading? Open it in a new tab</a>
    </div>`;
  document.body.appendChild(dlg);
  const frame = dlg.querySelector("iframe"), loading = dlg.querySelector(".cal-loading");
  frame.addEventListener("load", () => { if (frame.src) loading.hidden = true; });
  // Calendly tells the page when someone moves to the details step / books
  addEventListener("message", e => {
    if (!/calendly\.com$/.test(new URL(e.origin).hostname)) return;
    const ev = e.data && e.data.event;
    if (ev === "calendly.date_and_time_selected") dlg.querySelectorAll(".cal-steps span").forEach((s, i) => s.classList.toggle("on", i === 1));
    if (ev === "calendly.event_scheduled") dlg.querySelectorAll(".cal-steps span").forEach(s => s.classList.add("on"));
  });
  function open(e) {
    if (!dlg.showModal) return;              // very old browsers: follow the link
    e && e.preventDefault();
    if (!frame.src) {
      const u = new URL(URL_BASE);
      u.searchParams.set("embed_domain", location.hostname || "localhost");
      u.searchParams.set("embed_type", "Inline");
      u.searchParams.set("hide_gdpr_banner", "1");
      u.searchParams.set("primary_color", "e5281e");
      frame.src = u.toString();
    }
    document.querySelector(".mnav.open") && document.getElementById("burger")?.click();
    dlg.showModal(); document.body.classList.add("svm-open");
  }
  const close = () => dlg.close();
  dlg.querySelector(".cal-x").addEventListener("click", close);
  dlg.addEventListener("click", e => { if (e.target === dlg) close(); });
  dlg.addEventListener("close", () => document.body.classList.remove("svm-open"));
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-cal], a[href^='https://calendly.com/zghighleveldevs']");
    if (a && !a.classList.contains("cal-alt")) open(e);
  });
  window.zgOpenCalendar = open;
})();
