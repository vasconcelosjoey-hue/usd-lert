// Service Worker nativo para Push Notifications sem dependência de SDK no Worker
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const notificationTitle = data.notification?.title || 'USD Alert';
      const notificationOptions = {
        body: data.notification?.body || 'Nova atualização de cotação disponível.',
        icon: data.notification?.icon || 'https://api.dicebear.com/7.x/bottts/png?seed=usd-192&size=192&backgroundColor=0f172a',
        data: data.data
      };

      event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
      );

      // Envia mensagem para os clientes ativos (foreground)
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PUSH_RECEIVED',
            payload: data
          });
        });
      });
    } catch (e) {
      console.error('Erro ao processar push event:', e);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('/');
    })
  );
});