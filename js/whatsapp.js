/* WhatsApp form submission helper */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  window.buildWhatsAppURL = function (data) {
    const PHONE = "919666669199";
    let text = "Hello The Best Pic (SaiTeja Digitals),%0A%0A";
    Object.keys(data).forEach((k) => {
      if (data[k]) text += `${k}: ${data[k]}%0A`;
    });
    text += "%0APlease share your packages and availability. Thank you!";
    return `https://wa.me/${PHONE}?text=${text}`;
  };

  window.handleWhatsAppForm = function (formId, fields, noteId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const note = noteId ? document.getElementById(noteId) : null;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {};
      let valid = true;
      fields.forEach((f) => {
        const el = form.querySelector(`[name="${f.name}"]`);
        if (!el) return;
        const val = el.value.trim();
        data[f.label] = val || "—";
        if (f.required && !val) valid = false;
      });
      if (!valid) {
        if (note) { note.textContent = "Please fill in all required fields."; note.style.color = "#c0392b"; }
        return;
      }
      if (note) { note.textContent = "Opening WhatsApp..."; note.style.color = ""; }
      window.open(window.buildWhatsAppURL(data), "_blank");
      if (note) setTimeout(() => { note.textContent = ""; }, 3000);
    });
  };
})();
