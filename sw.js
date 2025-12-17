const CACHE_NAME = 'usd-alert-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

// Instalação: Cacheia assets essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos (importante para deploy contínuo)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação: Cache-first para assets, Network-first para dados da API
self.addEventListener('fetch', (event) => {
  const isApiRequest = event.request.url.includes('awesomeapi') || event.request.url.includes('googleapis');

  if (isApiRequest) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Placeholder para Firebase Cloud Messaging (FCM)
// O FCM requer o arquivo firebase-messaging-sw.js ou importar scripts aqui:
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-sw.js');