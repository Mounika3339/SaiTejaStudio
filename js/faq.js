/* FAQ accordion logic */
(function () {
  "use strict";
  const FAQS = [
    { q: "How early should we book?", a: "We recommend booking 3–6 months in advance to secure your date, especially during peak wedding season (November to February)." },
    { q: "Do you travel?", a: "Yes, we travel across Andhra Pradesh, Telangana, and for destination weddings across India. Travel and stay are arranged as part of the package." },
    { q: "Do you provide albums?", a: "Yes. We craft luxury hand-finished albums using archival-grade materials, designed to last for generations." },
    { q: "How many edited photos do we receive?", a: "Depending on the package, you receive between 300–500 professionally edited photos, plus a curated highlight gallery." },
    { q: "What is the delivery time?", a: "Preview galleries are shared within 7–10 days. Your fully edited premium album is delivered within 4–6 weeks." },
    { q: "Is drone photography available?", a: "Yes, we have a licensed drone pilot on the team and include aerial coverage in our cinematic packages." },
    { q: "Is a pre-wedding shoot included?", a: "Pre-wedding shoots are included in our premium and cinematic packages, and can be added to any other package." },
    { q: "How much advance payment is required?", a: "A booking advance of 25% of the package price confirms your date. The balance is due on or before the event day." },
    { q: "What is your cancellation policy?", a: "The booking advance is non-refundable. If you reschedule, we will accommodate the new date subject to availability." },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    const wrap = document.getElementById("accordion");
    if (!wrap) return;
    wrap.innerHTML = FAQS.map((f, i) => `
      <div class="accordion-item">
        <button class="accordion-header" aria-expanded="false">${f.q}<span class="accordion-icon" aria-hidden="true"></span></button>
        <div class="accordion-body"><p>${f.a}</p></div>
      </div>
    `).join("");

    wrap.querySelectorAll(".accordion-header").forEach((header) => {
      header.addEventListener("click", () => {
        const item = header.parentElement;
        const body = header.nextElementSibling;
        const isOpen = item.classList.contains("open");
        wrap.querySelectorAll(".accordion-item").forEach((it) => {
          it.classList.remove("open");
          it.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
          it.querySelector(".accordion-body").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          header.setAttribute("aria-expanded", "true");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  });
})();
