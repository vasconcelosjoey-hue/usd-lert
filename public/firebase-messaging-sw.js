// Importa as bibliotecas do Firebase compat via CDN
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Configurações do Firebase (devem ser as mesmas do src/services/firebase.ts)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Recupera a instância do Messaging
const messaging = firebase.messaging();

// Lida com mensagens recebidas em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida em segundo plano: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://api.dicebear.com/7.x/bottts/png?seed=usd-192&size=192&backgroundColor=0f172a'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});