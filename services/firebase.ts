import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializa o Firebase apenas uma vez (Singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | null = null;

// Inicializa Messaging apenas no lado do cliente (navegador)
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("Firebase Messaging não é suportado neste navegador ou ambiente.");
  }
}

/**
 * Solicita permissão e retorna o token FCM para o dispositivo atual.
 * @returns Promise com o token ou null
 */
export const requestNotificationToken = async (): Promise<string | null> => {
  const isStudioPreview = 
    window.location.hostname === "ai.studio" || 
    window.location.hostname.endsWith("usercontent.goog");

  if (!messaging || !('serviceWorker' in navigator) || isStudioPreview) {
    if (isStudioPreview) {
      console.warn("Notificações desabilitadas no ambiente de preview.");
    }
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const swUrl = new URL('firebase-messaging-sw.js', window.location.href).href;
      
      // Tenta obter registro existente
      let registration = await navigator.serviceWorker.getRegistration(swUrl);
      
      if (!registration) {
        registration = await navigator.serviceWorker.register(swUrl);
      }
      
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY', // Gerada no Console do Firebase
        serviceWorkerRegistration: registration
      });
      
      return token;
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter token FCM:", error);
    return null;
  }
};

export { app as firebaseApp, messaging };