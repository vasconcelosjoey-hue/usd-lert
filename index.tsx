import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Renderização única com React 18
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registro do Service Worker de forma limpa
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/firebase-messaging-sw.js")
      .then(reg => {
        console.log("Service Worker registrado com escopo:", reg.scope);
      })
      .catch(err => {
        console.warn("Erro ao registrar Service Worker:", err);
      });
  });
}
