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
    // Usar caminho relativo direto garante que o browser procure no mesmo domínio/origem da página atual
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .then(reg => console.log("SW registrado com sucesso:", reg.scope))
      .catch(err => console.error("Falha ao registrar SW:", err));
  });
}