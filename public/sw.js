self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Estratégia simples de repasse para evitar problemas em ambiente de desenvolvimento
  event.respondWith(fetch(event.request));
});