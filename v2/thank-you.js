/* Thank-you page: greet by name, embed Calendly inline (pre-filled), confirm booking */
(function () {
  const q = new URLSearchParams(location.search);
  let lead = {};
  try { lead = JSON.parse(sessionStorage.getItem("zgLead") || "{}"); } catch {}
  const first = (q.get("name") || (lead.name || "").split(" ")[0] || "").trim().slice(0, 40);
  if (first) document.getElementById("tyName").textContent = ", " + first;

  const frame = document.getElementById("tyFrame"), loading = document.getElementById("tyLoading");
  const u = new URL("https://calendly.com/zghighleveldevs/30min");
  u.searchParams.set("embed_domain", location.hostname || "localhost");
  u.searchParams.set("embed_type", "Inline");
  u.searchParams.set("hide_gdpr_banner", "1");
  u.searchParams.set("hide_event_type_details", "1");
  u.searchParams.set("primary_color", "e5281e");
  if (lead.name) u.searchParams.set("name", lead.name);
  if (lead.email) u.searchParams.set("email", lead.email);
  if (lead.need) u.searchParams.set("a1", "Interested in: " + lead.need);
  frame.addEventListener("load", () => { loading.hidden = true; });
  frame.src = u.toString();

  addEventListener("message", e => {
    let host = ""; try { host = new URL(e.origin).hostname; } catch {}
    if (!/calendly\.com$/.test(host)) return;
    const ev = e.data && e.data.event;
    if (ev === "calendly.page_height" && e.data.payload && e.data.payload.height) {
      const h = parseInt(e.data.payload.height, 10); if (h > 400) frame.style.height = Math.min(h, 1100) + "px";
    }
    if (ev === "calendly.event_scheduled") {
      document.querySelectorAll(".ty-steps li").forEach(li => { li.classList.remove("now"); li.classList.add("done"); });
      document.getElementById("tyBooked").hidden = false;
      const first = (document.getElementById("tyName").textContent || "").replace(/^,\s*/, "");
      setTimeout(() => { location.href = "/v2/booked/" + (first ? "?name=" + encodeURIComponent(first) : ""); }, 1400);
    }
  });
})();
