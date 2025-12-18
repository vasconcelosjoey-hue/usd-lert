self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Estratégia Network First (Rede Primeiro) para garantir dados sempre atualizados
  // mas permitindo funcionamento básico offline se necessário no futuro.
  // Por enquanto, apenas repassa a requisição.
  event.respondWith(fetch(event.request));
});