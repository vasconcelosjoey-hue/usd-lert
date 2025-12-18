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

    // Registro do Service Worker do Firebase Messaging apenas em produção
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(err => {
        console.warn('Falha ao registrar Firebase Messaging Service Worker:', err);
      });
    }
  });
}