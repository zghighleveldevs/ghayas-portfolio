/* Detail pages: header, menu, reveal, back-to-top */
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hdr = $("#hdr"), totop = $("#totop");
const onScroll = () => { hdr.classList.toggle("scrolled", scrollY > 10); totop.classList.toggle("show", scrollY > 600); };
addEventListener("scroll", onScroll, { passive: true }); onScroll();
totop.addEventListener("click", () => scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));
const burger = $("#burger"), mnav = $("#mnav");
const menu = open => { burger.setAttribute("aria-expanded", String(open)); document.body.classList.toggle("menu-open", open);
  if (open) { mnav.hidden = false; requestAnimationFrame(() => mnav.classList.add("open")); } else { mnav.classList.remove("open"); setTimeout(() => { if (!mnav.classList.contains("open")) mnav.hidden = true; }, 300); } };
burger.addEventListener("click", () => menu(burger.getAttribute("aria-expanded") !== "true"));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1 });
$$(".rv").forEach(el => io.observe(el));
$("#yr").textContent = new Date().getFullYear();
