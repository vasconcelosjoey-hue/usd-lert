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
    const isStudioPreview = 
      window.location.hostname === "ai.studio" || 
      window.location.hostname.endsWith("usercontent.goog");

    // No Vercel/Produção, registramos o sw.js e o firebase sw
    if (!isStudioPreview) {
      navigator.serviceWorker.register("/sw.js")
        .then(() => console.debug("PWA: Main Service Worker ativo"))
        .catch(err => console.error("PWA Error:", err));
        
      navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then(() => console.debug("PWA: Firebase Messaging SW ativo"))
        .catch(err => console.error("FCM SW Error:", err));
    }
  });
}