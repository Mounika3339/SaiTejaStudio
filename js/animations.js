/* Hero slider, testimonial slider, before/after slider, timeline, floating elements */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Hero slider ---------- */
  function initHeroSlider() {
    const slides = $$(".hero-slide");
    if (slides.length < 2) return;
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, 6000);
  }

  /* ---------- Testimonial slider ---------- */
  function initTestimonials() {
    const track = $(".testimonial-track");
    if (!track) return;
    const cards = $$(".testimonial-card", track);
    const dotsWrap = $(".slider-dots");
    const prev = $("#sliderPrev");
    const next = $("#sliderNext");
    let cur = 0, timer;

    if (dotsWrap) {
      dotsWrap.innerHTML = cards.map((_, i) =>
        `<button class="slider-dot ${i === 0 ? "active" : ""}" data-i="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
      ).join("");
    }
    const dots = $$(".slider-dot", dotsWrap);

    const go = (i) => {
      cur = (i + cards.length) % cards.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle("active", j === cur));
      restart();
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(cur + 1), 6000);
    };
    if (prev) prev.addEventListener("click", () => go(cur - 1));
    if (next) next.addEventListener("click", () => go(cur + 1));
    dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.i)));
    restart();
  }

  /* ---------- Before/After slider ---------- */
  function initBeforeAfter() {
    $$(".ba-slider").forEach((slider) => {
      const handle = $(".ba-handle", slider);
      const after = $(".ba-after", slider);
      let dragging = false;

      const move = (clientX) => {
        const rect = slider.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        handle.style.left = pct + "%";
        after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      };

      slider.addEventListener("mousedown", (e) => { dragging = true; move(e.clientX); });
      window.addEventListener("mousemove", (e) => { if (dragging) move(e.clientX); });
      window.addEventListener("mouseup", () => { dragging = false; });
      slider.addEventListener("touchstart", (e) => { dragging = true; move(e.touches[0].clientX); });
      window.addEventListener("touchmove", (e) => { if (dragging) move(e.touches[0].clientX); });
      window.addEventListener("touchend", () => { dragging = false; });
      move(slider.getBoundingClientRect().width / 2 + slider.getBoundingClientRect().left);
    });
  }

  /* ---------- Timeline ---------- */
  function initTimeline() {
    const timeline = $(".timeline");
    if (!timeline) return;
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("active");
          $$(".timeline-step", en.target).forEach((s, i) =>
            setTimeout(() => s.classList.add("revealed"), i * 180)
          );
          tio.unobserve(en.target);
        }
      });
    }, { threshold: 0.3 });
    tio.observe(timeline);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
    initTestimonials();
    initBeforeAfter();
    initTimeline();
  });
})();
