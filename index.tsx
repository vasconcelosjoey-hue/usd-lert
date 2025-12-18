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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Construindo a URL do SW de forma robusta para o ambiente de preview
    try {
      const swUrl = new URL('sw.js', window.location.href).href;
      
      navigator.serviceWorker.register(swUrl, { scope: './' })
        .then(reg => console.log("SW registrado com sucesso:", reg.scope))
        .catch(err => {
          console.error("Falha ao registrar SW:", err);
          // Em ambientes de sandbox, o registro de SW pode ser bloqueado por política de segurança
          if (err.name === 'SecurityError') {
            console.warn("Registro de Service Worker ignorado devido a restrições do navegador no ambiente de sandbox.");
          }
        });
    } catch (e) {
      console.error("Erro ao preparar registro do SW:", e);
    }
  });
}