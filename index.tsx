import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Registramos apenas o worker do Firebase que já cuidará do PWA e das mensagens
    navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: '/' })
      .then(reg => console.log("SW registrado com sucesso:", reg.scope))
      .catch(err => console.warn("Falha ao registrar SW:", err));
  });
}