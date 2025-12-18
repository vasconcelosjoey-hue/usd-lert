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

// Inicializa o Firebase apenas uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | null = null;

// Inicializa Messaging apenas no navegador
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("Firebase Messaging não é suportado neste navegador.");
  }
}

/**
 * Solicita o token FCM para o dispositivo atual.
 * @returns Promise com o token ou null
 */
export const requestNotificationToken = async (): Promise<string | null> => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Substitua pela sua VAPID Key gerada no console do Firebase (Project Settings > Messaging > Web configuration)
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' 
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