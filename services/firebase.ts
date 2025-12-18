import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken, deleteToken } from "firebase/messaging";

// ATENÇÃO: Verifique se esta chave em 'apiKey' é exatamente a "Chave de API da Web" 
// que aparece em Configurações do Projeto > Geral no seu Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyAjawFDBEE9Onf2ebKFAar8C0LmeJcipxs",
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
  } catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging || !('serviceWorker' in navigator)) return null;
  
  try {
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
  } catch (error) {
    // Se cair aqui com erro 400, a API Key é inválida
    console.error("Erro detalhado do Firebase:", error);
    throw error;
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