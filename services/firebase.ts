import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken, deleteToken } from "firebase/messaging";

// Acesso seguro ao import.meta.env para evitar crashes em ambientes de preview ou SSR
const getSafeEnv = () => {
  try {
    return (import.meta as any).env || {};
  } catch (e) {
    return {};
  }
};

const env = getSafeEnv();

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
    console.warn("Firebase Messaging não suportado neste navegador.");
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof Notification === 'undefined') return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error("Erro ao solicitar permissão:", error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging || !('serviceWorker' in navigator)) return null;
  
  try {
    const swUrl = '/firebase-messaging-sw.js';
    let registration = await navigator.serviceWorker.getRegistration(swUrl);
    
    if (!registration) {
      registration = await navigator.serviceWorker.register(swUrl);
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