import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        about: "about.html",
        services: "services.html",
        portfolio: "portfolio.html",
        gallery: "gallery.html",
        testimonials: "testimonials.html",
        faq: "faq.html",
        book: "book-now.html",
        contact: "contact.html",
        privacy: "privacy.html",
        notfound: "404.html",
      },
    },
  },
});
