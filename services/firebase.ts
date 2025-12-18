import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Configuração preparada para o ambiente. 
// Substitua pelos valores reais do console do Firebase ou use variáveis de ambiente.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);