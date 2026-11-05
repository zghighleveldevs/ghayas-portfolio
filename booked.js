/* Booked page: greet by first name + short confetti burst */
(function () {
  var q = new URLSearchParams(location.search), lead = {};
  try { lead = JSON.parse(sessionStorage.getItem("zgLead") || "{}"); } catch (e) {}
  var first = (q.get("name") || (lead.name || "").split(" ")[0] || "").trim().slice(0, 40);
  if (first) document.getElementById("bkName").textContent = ", " + first;
  try { sessionStorage.removeItem("zgLead"); } catch (e) {}
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var box = document.querySelector(".bk-confetti"), colors = ["#E5281E", "#F97316", "#F59E0B", "#22C55E", "#3BA9E0"];
  for (var i = 0; i < 60; i++) {
    var s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = (Math.random() * .8) + "s";
    s.style.animationDuration = (2.2 + Math.random() * 1.6) + "s";
    s.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
    s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
    box.appendChild(s);
  }
})();
