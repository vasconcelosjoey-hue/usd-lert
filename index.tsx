import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Registro do Service Worker principal do PWA
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('Falha ao registrar Service Worker (PWA):', err);
    });

    // Registro do Service Worker de Notificações
    navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'classic' })
      .then((registration) => {
        console.log('Firebase Messaging SW registrado com sucesso');
      })
      .catch(err => {
        console.warn('Falha ao registrar Firebase Messaging Service Worker:', err);
      });

    // Escuta mensagens vindas do Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PUSH_RECEIVED') {
        console.log('Notificação recebida em foreground:', event.data.payload);
      }
    });
  });
}