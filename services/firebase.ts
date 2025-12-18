import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken, deleteToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCkpwisB2z2W5iCY9VYU_BE4cGZ0buv4cc", 
  authDomain: "usd-alert-afd18.firebaseapp.com",
  projectId: "usd-alert-afd18",
  storageBucket: "usd-alert-afd18.firebasestorage.app",
  messagingSenderId: "357822009676",
  appId: "1:357822009676:web:f2a9246e60806599493fe9"
};

const VAPID_KEY = "BNw9RODM3xnMOjfTJ91XA_oNMvFu4lb24pa8ZWd44UHo2Qpbo1Ol7lzXEfof_IWokxf-LWTLWYZEQ98NwE4cj-g"; 

let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    messaging = getMessaging(app);
    console.log("Firebase Messaging inicializado.");
  } catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn("Notificações não suportadas neste navegador.");
    return false;
  }
  try {
    console.log("Solicitando permissão...");
    const permission = await Notification.requestPermission();
    console.log("Resultado da permissão:", permission);
    return permission === 'granted';
  } catch (error) {
    console.error("Erro ao solicitar permissão:", error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging || !('serviceWorker' in navigator)) {
    console.error("Mensageria ou Service Worker não disponíveis.");
    return null;
  }
  
  try {
    console.log("Aguardando Service Worker estar pronto...");
    const registration = await navigator.serviceWorker.ready;
    console.log("Service Worker pronto. Escopo:", registration.scope);
    
    console.log("Solicitando Token FCM ao Google...");
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (token) {
      console.log("Token obtido com sucesso.");
      localStorage.setItem('fcm_token', token);
      return token;
    }
    
    console.warn("Nenhum token retornado pelo Firebase.");
    return null;
  } catch (error: any) {
    console.error("Erro detalhado no FCM:", error);
    // Se o erro for 'messaging/registration-failed', pode ser o VAPID ou conflito de SW
    throw error;
  }
};

export const deactivateNotifications = async (): Promise<void> => {
  if (!messaging) return;
  try {
    await deleteToken(messaging);
    localStorage.removeItem('fcm_token');
    console.log("Token removido com sucesso.");
  } catch (e) {
    console.error("Erro ao remover token:", e);
  }
};

export { messaging };