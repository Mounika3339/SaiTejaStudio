/* Gallery logic: portfolio filter + lightbox refresh + gallery infinite scroll */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const PORTFOLIO = [
    { cat: "Wedding", title: "Sacred Vows", img: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg" },
    { cat: "Pre Wedding", title: "Golden Hour", img: "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg" },
    { cat: "Reception", title: "The Celebration", img: "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg" },
    { cat: "Haldi", title: "Colors of Joy", img: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg" },
    { cat: "Baby", title: "Little Wonder", img: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg" },
    { cat: "Family", title: "Together", img: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg" },
    { cat: "Drone", title: "From Above", img: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg" },
    { cat: "Wedding", title: "Traditional Rituals", img: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg" },
    { cat: "Pre Wedding", title: "By The Shore", img: "https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg" },
    { cat: "Reception", title: "Grand Stage", img: "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg" },
    { cat: "Haldi", title: "Smiles & Turmeric", img: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg" },
    { cat: "Family", title: "Generations", img: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg" },
    { cat: "Wedding", title: "The First Look", img: "https://images.pexels.com/photos/1024997/pexels-photo-1024997.jpeg" },
    { cat: "Drone", title: "Aerial Vows", img: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg" },
    { cat: "Baby", title: "Innocence", img: "https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg" },
  ];

  function renderPortfolio() {
    const grid = $("#portfolioGrid");
    if (!grid) return;
    grid.innerHTML = PORTFOLIO.map((p, i) => `
      <article class="portfolio-card lb-item lift reveal-up" data-filter-cat="${p.cat}" data-caption="${p.title} — ${p.cat}" data-delay="${(i % 3) * 100}">
        <img src="${p.img}" alt="${p.title} — ${p.cat}" loading="lazy" />
        <div class="portfolio-meta">
          <span class="portfolio-cat">${p.cat}</span>
          <span class="portfolio-title">${p.title}</span>
        </div>
      </article>
    `).join("");
    if (window.refreshLightbox) window.refreshLightbox();
  }

  function initPortfolioFilter() {
    const btns = $$(".filter-btn");
    if (!btns.length) return;
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.dataset.filter;
        $$(".portfolio-card, .gallery-item").forEach((c) => {
          const match = f === "all" || c.dataset.filterCat === f;
          c.classList.toggle("hide", !match);
        });
      });
    });
  }

  /* Gallery infinite scroll */
  const GALLERY_SEED = [
    { cat: "Wedding", img: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg" },
    { cat: "Pre Wedding", img: "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg" },
    { cat: "Engagement", img: "https://images.pexels.com/photos/1024997/pexels-photo-1024997.jpeg" },
    { cat: "Haldi", img: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg" },
    { cat: "Mehendi", img: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg" },
    { cat: "Reception", img: "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg" },
    { cat: "Bride", img: "https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg" },
    { cat: "Groom", img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg" },
    { cat: "Couple", img: "https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg" },
    { cat: "Family", img: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg" },
    { cat: "Candid", img: "https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg" },
    { cat: "Decor", img: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg" },
  ];

  function renderGallery() {
    const grid = $("#galleryGrid");
    if (!grid) return;
    let count = 0;
    const BATCH = 12;
    const MAX = 108;

    function addBatch() {
      for (let i = 0; i < BATCH && count < MAX; i++) {
        const item = GALLERY_SEED[count % GALLERY_SEED.length];
        const el = document.createElement("div");
        el.className = "gallery-item lb-item";
        el.dataset.filterCat = item.cat;
        el.dataset.caption = item.cat;
        el.innerHTML = `<img src="${item.img}?auto=compress&w=600" alt="${item.cat} photo ${count + 1}" loading="lazy" /><span class="gallery-cat">${item.cat}</span>`;
        grid.appendChild(el);
        count++;
      }
      if (window.refreshLightbox) window.refreshLightbox();
      if (count >= MAX) {
        const sentinel = $("#gallerySentinel");
        if (sentinel) sentinel.style.display = "none";
        const wrap = $(".load-more-wrap");
        if (wrap) wrap.innerHTML = "<p>You've reached the end of our gallery.</p>";
      }
    }

    addBatch();

    const sentinel = $("#gallerySentinel");
    if (sentinel && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) addBatch();
      }, { rootMargin: "200px" });
      io.observe(sentinel);
    }

    const loadBtn = $("#loadMoreBtn");
    if (loadBtn) loadBtn.addEventListener("click", addBatch);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderPortfolio();
    initPortfolioFilter();
    renderGallery();
  });
})();
