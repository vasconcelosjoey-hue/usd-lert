import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken, deleteToken } from "firebase/messaging";

/**
 * Acessa as variáveis de ambiente de forma segura.
 */
const getEnv = () => {
  try {
    return (import.meta as any).env || {};
  } catch (e) {
    return {};
  }
};

const env = getEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "PLACEHOLDER",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "PLACEHOLDER",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "PLACEHOLDER",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "PLACEHOLDER",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "PLACEHOLDER",
  appId: env.VITE_FIREBASE_APP_ID || "PLACEHOLDER"
};

const isConfigured = firebaseConfig.apiKey !== "PLACEHOLDER";
let messaging: Messaging | null = null;

if (isConfigured && typeof window !== 'undefined') {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("Firebase Messaging não pôde ser inicializado.");
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof Notification === 'undefined') return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error("Erro ao solicitar permissão de notificação:", error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging || !('serviceWorker' in navigator)) return null;
  
  try {
    const hostname = window.location.hostname;
    const isPreview = hostname.endsWith("usercontent.goog") || hostname === "ai.studio";
    
    // Usamos caminho relativo 'firebase-messaging-sw.js' em vez de '/...'
    // para evitar que o navegador tente buscar na raiz do domínio de preview (ai.studio)
    const swUrl = 'firebase-messaging-sw.js';
    let registration = await navigator.serviceWorker.getRegistration(swUrl);
    
    if (!registration) {
      try {
        registration = await navigator.serviceWorker.register(swUrl);
      } catch (err) {
        console.warn("Falha ao registrar SW de mensagens no preview:", err);
        if (isPreview) return null; // Erro esperado no ambiente de sandbox do AI Studio
        throw err;
      }
    }

    const token = await getToken(messaging, {
      vapidKey: env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (token) {
      localStorage.setItem('fcm_token', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter token FCM:", error);
    return null;
  }
};

export const deactivateNotifications = async (): Promise<void> => {
  if (!messaging) return;
  try {
    const currentToken = localStorage.getItem('fcm_token');
    if (currentToken) {
      await deleteToken(messaging);
      localStorage.removeItem('fcm_token');
    }
  } catch (error) {
    console.error("Erro ao desativar notificações:", error);
  }
};

export { messaging };
