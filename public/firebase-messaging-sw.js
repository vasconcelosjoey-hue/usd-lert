importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAjawFDBEE9Onf2ebKFAar8C0LmeJcipxs",
  projectId: "usd-alert-afd18",
  messagingSenderId: "357822009676",
  appId: "1:357822009676:web:f2a9246e60806599493fe9"
};

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