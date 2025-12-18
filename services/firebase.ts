import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, deleteToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "", 
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || ""
};

if (!firebaseConfig.apiKey) {
  console.warn("Missing VITE_FIREBASE_API_KEY (configure env on Vercel / local).");
}

// VAPID KEY via env
const VAPID_KEY = (import.meta as any).env.VITE_FIREBASE_VAPID_KEY || "";

// Inicializa o App do Firebase uma única vez
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Messaging só quando suportado (evita quebrar em ambientes que não suportam)
 */
export async function getFirebaseMessaging() {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
}

/**
 * Helpers para a UI (Header.tsx)
 */
export const isMessagingSupported = async () => {
  try {
    return typeof window !== 'undefined' && await isSupported();
  } catch (e) {
    return false;
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;
  
  try {
    // Registra ou obtém o Service Worker atual
    const registration = await navigator.serviceWorker.ready;
    
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (token) {
      localStorage.setItem('fcm_token', token);
      return token;
    }
    return null;
  } catch (error: any) {
    console.error("Erro ao obter token FCM:", error);
    return null;
  }
};

export const deactivateNotifications = async (): Promise<void> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;
  
  try {
    await deleteToken(messaging);
    localStorage.removeItem('fcm_token');
  } catch (e) {
    console.error("Erro ao desativar notificações:", e);
  }
};