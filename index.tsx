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

// Registro robusto do Service Worker para PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const hostname = window.location.hostname;
    
    // Evita erro de origem cruzada no sandbox do Google AI Studio / Usercontent
    const isSandbox = 
      hostname.includes("usercontent.goog") || 
      hostname.includes("ai.studio");
    
    // Em produção real ou localhost fora de sandbox, tentamos registrar
    if (!isSandbox) {
      // Usamos caminhos relativos para garantir que o SW seja buscado na origem correta do app
      navigator.serviceWorker.register("./sw.js")
        .then(() => console.log("PWA: Service Worker principal registrado"))
        .catch(err => console.warn("PWA: Falha ao registrar SW principal (esperado em alguns navegadores):", err));
        
      navigator.serviceWorker.register("./firebase-messaging-sw.js")
        .then(() => console.log("FCM: Service Worker de mensagens registrado"))
        .catch(err => console.warn("FCM: Falha ao registrar SW de mensagens:", err));
    } else {
      console.log("Ambiente Sandbox detectado: Registro de Service Worker ignorado para evitar erros de origem.");
    }
  });
}