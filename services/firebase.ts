import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken, deleteToken } from "firebase/messaging";

// Credenciais oficiais do seu projeto "usd-alert-afd18"
const firebaseConfig = {
  apiKey: "AIzaSyAjawFDBEE9Onf2ebKFAar8C0LmeJcipxs",
  authDomain: "usd-alert-afd18.firebaseapp.com",
  projectId: "usd-alert-afd18",
  storageBucket: "usd-alert-afd18.firebasestorage.app",
  messagingSenderId: "357822009676",
  appId: "1:357822009676:web:f2a9246e60806599493fe9"
};

// Chave extraída da sua imagem:
const VAPID_KEY = "BNw9RODM3xnMOjfTJ91XA_oNMvFu4lb24pa8ZWd44UHo2Qpbo1Ol7lzXEfof_IWokxf-LWTLWYZEQ98NwE4cj-g"; 

let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("Navegador não suporta Push Notifications.");
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
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
    // Registra ou obtém o worker de mensagens
    const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
    
    // Espera o worker estar pronto para evitar erros de timing
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
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
    await deleteToken(messaging);
    localStorage.removeItem('fcm_token');
  } catch (e) {
    console.error("Erro ao desativar notificações:", e);
  }
};

export { messaging };