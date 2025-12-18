import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, getToken, deleteToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCkpwisB2z2W5iCY9VYU_BE4cGZ0buv4cc", 
  authDomain: "usd-alert-afd18.firebaseapp.com",
  projectId: "usd-alert-afd18",
  storageBucket: "usd-alert-afd18.firebasestorage.app",
  messagingSenderId: "357822009676",
  appId: "1:357822009676:web:f2a9246e60806599493fe9"
};

// Inicializa o App do Firebase uma única vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const VAPID_KEY = "BNw9RODM3xnMOjfTJ91XA_oNMvFu4lb24pa8ZWd44UHo2Qpbo1Ol7lzXEfof_IWokxf-LWTLWYZEQ98NwE4cj-g"; 

/**
 * Verifica se o Messaging é suportado no navegador atual
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
  const supported = await isMessagingSupported();
  if (!supported) {
    console.warn("FCM Messaging não é suportado neste navegador.");
    return null;
  }
  
  try {
    const messaging = getMessaging(app);
    // Aguarda o Service Worker estar pronto antes de pedir o token
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
    if (error.code === 'messaging/unsupported-browser' || error.message?.includes('not available')) {
      return null;
    }
    throw error;
  }
};

export const deactivateNotifications = async (): Promise<void> => {
  const supported = await isMessagingSupported();
  if (!supported) return;
  
  try {
    const messaging = getMessaging(app);
    await deleteToken(messaging);
    localStorage.removeItem('fcm_token');
  } catch (e) {
    console.error("Erro ao desativar notificações:", e);
  }
};
