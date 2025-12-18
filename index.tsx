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
    const hostname = window.location.hostname;
    // Identifica se estamos em ambiente de preview do Google AI Studio ou Localhost
    const isStudioPreview = 
      hostname === "ai.studio" || 
      hostname.endsWith("usercontent.goog") ||
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1");

    // Registra Service Workers apenas em ambiente de produção real (Vercel, etc.)
    // No preview do AI Studio, o registro de SW costuma falhar por restrições de origem e iframe.
    if (!isStudioPreview) {
      // Usamos caminhos relativos para garantir que o navegador resolva a partir do diretório atual
      navigator.serviceWorker.register("sw.js")
        .then(() => console.debug("PWA: Main Service Worker ativo"))
        .catch(err => console.warn("PWA SW Register ignorado no preview:", err.message));
        
      navigator.serviceWorker.register("firebase-messaging-sw.js")
        .then(() => console.debug("PWA: Firebase Messaging SW ativo"))
        .catch(err => console.warn("FCM SW Register ignorado no preview:", err.message));
    } else {
      console.debug("PWA: Registro de Service Worker pulado em ambiente de desenvolvimento/preview.");
    }
  });
}
