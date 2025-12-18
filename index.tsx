import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registro de Service Worker otimizado
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const isStudioPreview = 
      window.location.hostname === "ai.studio" || 
      window.location.hostname.endsWith("usercontent.goog");

    if (!isStudioPreview) {
      // Em produção, o arquivo fica na raiz do build (/sw.js)
      navigator.serviceWorker.register("/sw.js")
        .then(reg => console.debug("PWA: Service Worker ativo"))
        .catch(err => {
          if (err.name !== 'SecurityError') {
            console.error("PWA: Erro no registro:", err);
          }
        });
    }
  });
}