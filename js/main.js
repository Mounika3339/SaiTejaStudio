/* Shared site logic: navbar, mobile menu, smooth scroll, active nav,
   scroll progress, back-to-top, cursor glow, ripple, dark mode, loader,
   lightbox, counters, parallax, year. */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  window.TBP = window.TBP || {};
  TBP.PHONE = "919666669199";
  TBP.$ = $;
  TBP.$$ = $$;

  /* ---------- Loader ---------- */
  function initLoader() {
    const loader = $(".page-loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("done"), 400);
    });
    setTimeout(() => loader.classList.add("done"), 2500);
  }

  /* ---------- Navbar ---------- */
  function initNavbar() {
    const navbar = $(".navbar");
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const burger = $(".hamburger");
    const menu = $(".nav-menu");
    if (!burger || !menu) return;
    const toggle = (open) => {
      menu.classList.toggle("open", open);
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!menu.classList.contains("open")));
    $$(".nav-menu a").forEach((a) => a.addEventListener("click", () => toggle(false)));
    window.addEventListener("resize", () => { if (window.innerWidth > 768) toggle(false); });
  }

  /* ---------- Smooth scroll ---------- */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const el = $(id);
          if (el) {
            e.preventDefault();
            const top = el.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      });
    });
  }

  /* ---------- Active nav ---------- */
  function initActiveNav() {
    const links = $$(".nav-link");
    if (!links.length) return;
    const path = location.pathname.split("/").pop() || "index.html";
    links.forEach((l) => {
      const href = l.getAttribute("href");
      if (href === path || (path === "index.html" && href === "index.html") ||
          (href && href.includes(path.replace(".html", "")) && path !== "index.html")) {
        l.classList.add("active");
      }
    });
  }

  /* ---------- Scroll progress ---------- */
  function initScrollProgress() {
    const bar = $(".scroll-progress");
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    const btn = $(".back-to-top");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("show", window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Cursor glow ---------- */
  function initCursorGlow() {
    const glow = $(".cursor-glow");
    if (!glow || window.matchMedia("(pointer: coarse)").matches) return;
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    const loop = () => {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      glow.style.left = cx + "px"; glow.style.top = cy + "px";
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Ripple ---------- */
  function initRipple() {
    $$(".btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--rx", e.clientX - r.left + "px");
        btn.style.setProperty("--ry", e.clientY - r.top + "px");
        btn.classList.remove("ripple");
        void btn.offsetWidth;
        btn.classList.add("ripple");
      });
    });
  }

  /* ---------- Dark mode ---------- */
  function initTheme() {
    const toggle = $(".theme-toggle");
    if (!toggle) return;
    const saved = localStorage.getItem("tbp-theme");
    if (saved === "dark") document.body.classList.add("dark");
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("tbp-theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }

  /* ---------- Intersection reveals ---------- */
  function initReveals() {
    const revealEls = $$(".reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-zoom, .img-reveal, .text-reveal");
    if (!revealEls.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const delay = en.target.dataset.delay || 0;
          setTimeout(() => en.target.classList.add("revealed"), delay);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || "";
    const dur = 2000;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("en-IN") + suffix;
    };
    requestAnimationFrame(step);
  }
  function initCounters() {
    const nums = $$(".stat-num");
    if (!nums.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animateCounter(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- Lightbox ---------- */
  let lbIndex = 0;
  let lbItems = [];
  function initLightbox() {
    const lb = $(".lightbox");
    if (!lb) return;
    const lbImg = $("#lightboxImg", lb);
    const lbCap = $("#lightboxCap", lb);
    const close = $(".lightbox-close", lb);
    const prev = $(".lightbox-prev", lb);
    const next = $(".lightbox-next", lb);

    const gather = () => {
      lbItems = $$(".lb-item").map((el) => ({
        src: el.querySelector("img").src,
        alt: el.querySelector("img").alt,
        cap: el.dataset.caption || el.querySelector("img").alt || "",
      }));
    };
    gather();
    window.refreshLightbox = gather;

    const open = (idx) => {
      lbIndex = idx; update();
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const update = () => {
      const item = lbItems[lbIndex];
      if (!item) return;
      lbImg.src = item.src; lbImg.alt = item.alt; lbCap.textContent = item.cap;
    };
    const closeLb = () => {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const go = (d) => { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; update(); };

    $$(".lb-item").forEach((el) => {
      el.addEventListener("click", () => {
        gather();
        const idx = lbItems.findIndex((it) => it.src === el.querySelector("img").src);
        if (idx >= 0) open(idx);
      });
    });
    if (close) close.addEventListener("click", closeLb);
    if (prev) prev.addEventListener("click", () => go(-1));
    if (next) next.addEventListener("click", () => go(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = $$("[data-parallax]");
    if (!els.length) return;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      els.forEach((el) => {
        const speed = +el.dataset.parallax || 0.3;
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = (rect.top - window.innerHeight / 2) * speed;
          el.style.transform = `translateY(${offset * 0.08}px)`;
        }
      });
    }, { passive: true });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Year ---------- */
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initScrollProgress();
    initBackToTop();
    initCursorGlow();
    initRipple();
    initTheme();
    initReveals();
    initCounters();
    initLightbox();
    initParallax();
    initMagnetic();
    initYear();
  });
})();
