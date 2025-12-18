import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken, deleteToken } from "firebase/messaging";

// Credenciais enviadas via imagem
const firebaseConfig = {
  apiKey: "AIzaSyAjawFDBEE9Onf2ebKFAar8C0LmeJcipxs",
  authDomain: "usd-alert-afd18.firebaseapp.com",
  projectId: "usd-alert-afd18",
  storageBucket: "usd-alert-afd18.firebasestorage.app",
  messagingSenderId: "357822009676",
  appId: "1:357822009676:web:f2a9246e60806599493fe9"
};

// IMPORTANTE: Obtenha sua VAPID Key no Firebase (Configurações > Cloud Messaging > Certificados da Web)
const VAPID_KEY = "SUA_CHAVE_VAPID_AQUI"; 

let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("Firebase Messaging não inicializado.");
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof Notification === 'undefined') return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error("Erro na permissão:", error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging || !('serviceWorker' in navigator)) return null;
  
  try {
    const swUrl = './firebase-messaging-sw.js';
    let registration = await navigator.serviceWorker.getRegistration(swUrl);
    
    if (!registration) {
      registration = await navigator.serviceWorker.register(swUrl);
    }

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
    console.error("Erro FCM:", error);
    return null;
  }
};

export const deactivateNotifications = async (): Promise<void> => {
  if (!messaging) return;
  try {
    await deleteToken(messaging);
    localStorage.removeItem('fcm_token');
  } catch (e) {}
};

export { messaging };