import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, Messaging, getToken } from "firebase/messaging";

// Substitua por suas chaves reais do Firebase Console
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

const isConfigured = firebaseConfig.apiKey !== "PLACEHOLDER";

let app;
let messaging: Messaging | null = null;

if (isConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  if (typeof window !== 'undefined') {
    try {
      messaging = getMessaging(app);
    } catch (e) {
      console.warn("Firebase Messaging não suportado.");
    }
  }
}

export const requestNotificationToken = async (): Promise<string | null> => {
  if (!isConfigured) {
    console.warn("Firebase não configurado. Configure as chaves em services/firebase.ts");
    return null;
  }

  if (!messaging || !('serviceWorker' in navigator)) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error("Erro FCM:", error);
    return null;
  }
};

export { app as firebaseApp, messaging };