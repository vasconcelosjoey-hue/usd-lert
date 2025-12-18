importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Os valores serão injetados via variáveis de ambiente durante o deploy no Vercel
// Para desenvolvimento, o script lida com a ausência de chaves graciosamente.
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

if (firebaseConfig.apiKey !== "PLACEHOLDER") {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || 'USD Alert';
    const notificationOptions = {
      body: payload.notification?.body || 'Atualização na cotação do dólar.',
      icon: 'https://api.dicebear.com/7.x/bottts/png?seed=usd-192&size=192'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}