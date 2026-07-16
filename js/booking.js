/* Booking form WhatsApp submission */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    if (window.handleWhatsAppForm) {
      window.handleWhatsAppForm("bookingForm", [
        { name: "name", label: "Name", required: true },
        { name: "phone", label: "Phone", required: true },
        { name: "email", label: "Email", required: false },
        { name: "eventType", label: "Event Type", required: true },
        { name: "eventDate", label: "Event Date", required: true },
        { name: "venue", label: "Venue", required: false },
        { name: "budget", label: "Budget", required: false },
        { name: "message", label: "Message", required: false },
      ], "formNote");
    }
  });
})();
