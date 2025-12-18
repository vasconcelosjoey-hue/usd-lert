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

/**
 * Registro de Service Worker otimizado para evitar erros em ambientes de Sandbox/Preview.
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const isStudioPreview = 
      window.location.hostname === "ai.studio" || 
      window.location.hostname.endsWith("usercontent.goog");

    // Registra o SW apenas se não estiver em ambiente de preview e o navegador suportar
    if (!isStudioPreview) {
      navigator.serviceWorker.register("./sw.js", { scope: "./" })
        .then(reg => {
          console.log("USD Alert: Service Worker registrado com sucesso:", reg.scope);
        })
        .catch(err => {
          // Ignora erros de segurança comuns em sandboxes, loga outros erros
          if (err.name !== 'SecurityError') {
            console.error("USD Alert: Erro ao registrar SW:", err);
          }
        });
    } else {
      console.log("USD Alert: Registro de Service Worker ignorado no ambiente de preview.");
    }
  });
}