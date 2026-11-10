/* Landing pages: 3D hero parallax, glass card tilt + shine, screenshot fan */
(function () {
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches, HOVER = matchMedia("(hover: hover)").matches;
  if (RM || !HOVER) return;
  var st = document.getElementById("glStage");
  if (st) {
    var sc = st.querySelector(".gl-scene");
    document.addEventListener("pointermove", function (e) {
      var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      sc.style.setProperty("--ry", (-16 + x * 14) + "deg"); sc.style.setProperty("--rx", (8 - y * 10) + "deg");
    });
  }
  [].forEach.call(document.querySelectorAll(".gl-tilt"), function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.transform = "perspective(900px) rotateX(" + ((.5 - y) * 10) + "deg) rotateY(" + ((x - .5) * 12) + "deg) translateZ(6px)";
      c.style.setProperty("--sx", x * 100 + "%"); c.style.setProperty("--sy", y * 100 + "%");
    });
    c.addEventListener("pointerleave", function () { c.style.transform = ""; });
  });
})();
