/* Services page: highlight the chip for the service in view */
(function () {
  var chips = [].slice.call(document.querySelectorAll(".sv-chips a"));
  var bar = document.querySelector(".sv-chips-in");
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      chips.forEach(function (c) {
        var on = c.getAttribute("href") === "#" + e.target.id;
        c.classList.toggle("on", on);
        if (on && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: c.offsetLeft - 16, behavior: "smooth" });
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll(".sv-row").forEach(function (r) { io.observe(r); });
})();
